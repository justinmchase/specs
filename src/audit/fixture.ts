import { dirname, join } from "@std/path";

/**
 * The test reference token, built so that fixtures written by these tests do
 * not themselves read as citations when this repository audits itself.
 */
export const REQ = "req" + ":";

export const MARKER = "specs v1\nhttps://github.com/justinmchase/specs\n";

export const SPEC = [
  "# Things",
  "",
  "## Widgets",
  "",
  "Widgets MUST spin.",
  "",
].join("\n");

export function requirement(
  id: string,
  specRef = ".agents/specifications/things.spec.md#widgets",
): string {
  return `---\nid: ${id}\ntitle: Widgets spin\nspec_ref: "${specRef}"\n---\n\n# Spin\n`;
}

/** A repository that passes the audit cleanly. */
export function cleanRepository(): Record<string, string> {
  return {
    ".agents/SPECS": MARKER,
    ".agents/specifications/README.md": "# Spec\n",
    ".agents/specifications/things.spec.md": SPEC,
    ".agents/requirements/things/001-spin.requirement.md": requirement(
      "things-001",
    ),
    "src/spin.test.ts": `Deno.test("${REQ}things-001 - spins", () => {});\n`,
  };
}

/** Writes `files` under a new temporary directory and returns it. */
export async function writeRepository(
  files: Record<string, string>,
): Promise<string> {
  const root = await Deno.makeTempDir({ prefix: "specs-audit-" });
  for (const [path, text] of Object.entries(files)) {
    await Deno.mkdir(join(root, dirname(path)), { recursive: true });
    await Deno.writeTextFile(join(root, path), text);
  }
  return root;
}
