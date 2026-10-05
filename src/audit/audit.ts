import { extract } from "@std/front-matter/yaml";
import { test as hasFrontMatter } from "@std/front-matter/test";
import { walk } from "@std/fs/walk";
import { globToRegExp, join, normalize, relative, SEPARATOR } from "@std/path";
import { error, type Finding, warning } from "./finding.ts";
import { type Marker, MARKER_PATH, parseMarker } from "./marker.ts";
import { headingSlugs } from "./slug.ts";

export interface AuditResult {
  /** The parsed marker, when it could be read. */
  marker?: Marker;
  findings: Finding[];
}

interface RequirementDocument {
  file: string;
  id: string;
}

const TEST_REFERENCE = /\breq:([a-z0-9]+(?:-[a-z0-9]+)*)/g;

/** Audits the repository at `root` against the specs method. */
export async function audit(root: string): Promise<AuditResult> {
  const { marker, findings } = await collect(root);
  return {
    marker,
    findings: dedupe(findings).sort((a, b) =>
      a.file.localeCompare(b.file) || a.message.localeCompare(b.message)
    ),
  };
}

async function collect(root: string): Promise<AuditResult> {
  const text = await readText(join(root, MARKER_PATH));
  if (text === undefined) {
    return {
      findings: [
        error(
          MARKER_PATH,
          "missing; a repository following the method declares it here",
        ),
      ],
    };
  }
  const parsed = parseMarker(text);
  if (!parsed.ok) return { findings: parsed.findings };
  const { marker } = parsed;
  const findings = [...parsed.findings];

  const specifications = normalize(marker.specifications);
  const requirements = normalize(marker.requirements);
  if (!await isDirectory(join(root, specifications))) {
    findings.push(
      error(specifications, "the specifications directory does not exist"),
    );
  } else if (!await isFile(join(root, specifications, "README.md"))) {
    findings.push(
      error(
        posix(join(specifications, "README.md")),
        "the specifications directory needs a README.md index",
      ),
    );
  }
  if (!await isDirectory(join(root, requirements))) {
    findings.push(
      error(requirements, "the requirements directory does not exist"),
    );
    return { marker, findings };
  }

  const documents: RequirementDocument[] = [];
  const slugCache = new Map<string, Set<string> | undefined>();
  for await (
    const entry of walk(join(root, requirements), {
      includeDirs: false,
      match: [/\.requirement\.md$/],
    })
  ) {
    const file = posix(relative(root, entry.path));
    const document = await readRequirement(root, file, findings);
    if (!document) continue;
    documents.push({ file, id: document.id });
    for (const reference of document.references) {
      await checkReference(
        root,
        file,
        reference,
        specifications,
        slugCache,
        findings,
      );
    }
  }

  const byId = new Map<string, string>();
  for (const { file, id } of documents) {
    const first = byId.get(id);
    if (first) {
      findings.push(error(file, `the id "${id}" is also used by ${first}`));
    } else {
      byId.set(id, file);
    }
  }

  const cited = new Set<string>();
  const tests = marker.tests.map((glob) =>
    globToRegExp(glob, { extended: true, globstar: true })
  );
  for await (const file of searchedFiles(root)) {
    if (!tests.some((test) => test.test(file))) continue;
    const source = await Deno.readTextFile(join(root, file));
    for (const [, id] of source.matchAll(TEST_REFERENCE)) {
      cited.add(id);
      if (!byId.has(id)) {
        findings.push(
          error(file, `cites req:${id}, which is not a requirement`),
        );
      }
    }
  }
  for (const { file, id } of documents) {
    if (!cited.has(id)) {
      findings.push(warning(file, `no test cites req:${id}`));
    }
  }

  return { marker, findings };
}

async function readRequirement(
  root: string,
  file: string,
  findings: Finding[],
): Promise<{ id: string; references: string[] } | undefined> {
  const source = await Deno.readTextFile(join(root, file));
  if (!hasFrontMatter(source, ["yaml"])) {
    findings.push(error(file, "has no YAML front matter"));
    return undefined;
  }
  let attrs: Record<string, unknown>;
  try {
    attrs = extract<Record<string, unknown>>(source).attrs ?? {};
  } catch (cause) {
    findings.push(
      error(file, `has front matter that is not valid YAML: ${message(cause)}`),
    );
    return undefined;
  }
  const missing = ["id", "title", "spec_ref"].filter((field) => {
    const value = attrs[field];
    return value === undefined || value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0);
  });
  for (const field of missing) {
    findings.push(error(file, `is missing "${field}" in its front matter`));
  }
  if (missing.includes("id")) return undefined;
  return {
    id: String(attrs.id).trim(),
    references: missing.includes("spec_ref") ? [] : references(attrs.spec_ref),
  };
}

function references(specRef: unknown): string[] {
  const values = Array.isArray(specRef) ? specRef : [specRef];
  return values.flatMap((value) => String(value).split(";"))
    .map((reference) => reference.trim())
    .filter((reference) => reference !== "");
}

async function checkReference(
  root: string,
  file: string,
  reference: string,
  specifications: string,
  slugCache: Map<string, Set<string> | undefined>,
  findings: Finding[],
): Promise<void> {
  const [path, anchor] = reference.split("#", 2);
  const target = normalize(path);
  const inside = relative(specifications, target);
  if (inside.startsWith("..") || inside === "" || /^[\\/]/.test(inside)) {
    findings.push(
      error(
        file,
        `spec_ref "${reference}" is outside ${posix(specifications)}`,
      ),
    );
    return;
  }
  if (!slugCache.has(target)) {
    const source = await readText(join(root, target));
    slugCache.set(
      target,
      source === undefined ? undefined : headingSlugs(source),
    );
  }
  const slugs = slugCache.get(target);
  if (!slugs) {
    findings.push(
      error(file, `spec_ref "${reference}" names a file that does not exist`),
    );
  } else if (anchor !== undefined && anchor !== "" && !slugs.has(anchor)) {
    findings.push(
      error(
        file,
        `spec_ref "${reference}" names "#${anchor}", which is not a heading in ${
          posix(target)
        }`,
      ),
    );
  }
}

/**
 * The files under `root`, as `/`-separated relative paths, outside directories
 * whose names begin with `.` and outside `node_modules`.
 */
async function* searchedFiles(
  root: string,
  directory = "",
): AsyncGenerator<string> {
  for await (const entry of Deno.readDir(join(root, directory))) {
    const path = directory === "" ? entry.name : `${directory}/${entry.name}`;
    if (entry.isDirectory) {
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
      yield* searchedFiles(root, path);
    } else if (entry.isFile) {
      yield path;
    }
  }
}

async function readText(path: string): Promise<string | undefined> {
  try {
    return await Deno.readTextFile(path);
  } catch (cause) {
    if (cause instanceof Deno.errors.NotFound) return undefined;
    if (cause instanceof Deno.errors.IsADirectory) return undefined;
    throw cause;
  }
}

async function isDirectory(path: string): Promise<boolean> {
  try {
    return (await Deno.stat(path)).isDirectory;
  } catch (cause) {
    if (cause instanceof Deno.errors.NotFound) return false;
    throw cause;
  }
}

async function isFile(path: string): Promise<boolean> {
  try {
    return (await Deno.stat(path)).isFile;
  } catch (cause) {
    if (cause instanceof Deno.errors.NotFound) return false;
    throw cause;
  }
}

function posix(path: string): string {
  return SEPARATOR === "/" ? path : path.replaceAll(SEPARATOR, "/");
}

function message(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

function dedupe(findings: Finding[]): Finding[] {
  const seen = new Set<string>();
  return findings.filter((finding) => {
    const key = `${finding.severity}\0${finding.file}\0${finding.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
