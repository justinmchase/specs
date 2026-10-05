import { error, type Finding, warning } from "./finding.ts";

/** The major versions of the method this audit implements. */
export const SUPPORTED_MAJOR = 1;

export const MARKER_PATH = ".agents/SPECS";

export const DEFAULT_TESTS = ["**/*.test.*", "**/*_test.*", "**/test_*.*"];

/** What a repository's `.agents/SPECS` declares. */
export interface Marker {
  major: number;
  source: string;
  specifications: string;
  requirements: string;
  tests: string[];
}

export type MarkerResult =
  | { ok: true; marker: Marker; findings: Finding[] }
  | { ok: false; findings: Finding[] };

const KNOWN_KEYS = new Set(["specifications", "requirements", "tests"]);

/** Parses the text of `.agents/SPECS` (see `marker.spec.md`). */
export function parseMarker(text: string): MarkerResult {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter((
    line,
  ) => line !== "" && !line.startsWith("#"));
  const findings: Finding[] = [];
  const fail = (message: string): MarkerResult => ({
    ok: false,
    findings: [...findings, error(MARKER_PATH, message)],
  });

  const version = /^specs v(\d+)$/.exec(lines[0] ?? "");
  if (!version) {
    return fail(
      `the first line must be "specs v<major>", not "${lines[0] ?? ""}"`,
    );
  }
  const major = Number(version[1]);
  if (major !== SUPPORTED_MAJOR) {
    return fail(
      `this audit implements specs v${SUPPORTED_MAJOR}, not v${major}`,
    );
  }

  const source = lines[1] ?? "";
  if (!URL.canParse(source) || new URL(source).protocol !== "https:") {
    return fail(
      `the second line must be an https: URL naming where the method is defined, not "${source}"`,
    );
  }

  const settings = new Map<string, string>();
  for (const line of lines.slice(2)) {
    const setting = /^([a-z][a-z0-9-]*):\s*(.*)$/.exec(line);
    if (!setting) {
      return fail(`"${line}" is not a "key: value" setting`);
    }
    const [, key, value] = setting;
    if (settings.has(key)) return fail(`the key "${key}" is repeated`);
    settings.set(key, value);
    if (!KNOWN_KEYS.has(key)) {
      findings.push(warning(MARKER_PATH, `unknown key "${key}"`));
    }
  }

  return {
    ok: true,
    findings,
    marker: {
      major,
      source,
      specifications: settings.get("specifications") ??
        ".agents/specifications",
      requirements: settings.get("requirements") ?? ".agents/requirements",
      tests: settings.get("tests")?.split(",").map((glob) => glob.trim())
        .filter((glob) => glob !== "") ?? DEFAULT_TESTS,
    },
  };
}
