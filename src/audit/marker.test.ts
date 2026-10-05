import { assert, assertEquals } from "@std/assert";
import { Severity } from "./finding.ts";
import { DEFAULT_TESTS, parseMarker } from "./marker.ts";

const SOURCE = "https://github.com/justinmchase/specs";

function messages(text: string): string[] {
  return parseMarker(text).findings.map((f) => `${f.severity}: ${f.message}`);
}

Deno.test("req:audit-001 - marker", async (t) => {
  await t.step("the two-line marker uses the default layout", () => {
    const result = parseMarker(`specs v1\n${SOURCE}\n`);
    assert(result.ok);
    assertEquals(result.marker, {
      major: 1,
      source: SOURCE,
      specifications: ".agents/specifications",
      requirements: ".agents/requirements",
      tests: DEFAULT_TESTS,
    });
    assertEquals(result.findings, []);
  });

  await t.step("settings override the layout and tests split on commas", () => {
    const result = parseMarker(
      `# comment\n  specs v1  \r\n${SOURCE}\n\nspecifications: docs/spec\n` +
        `requirements: docs/req\ntests: src/**/*.spec.ts, e2e/**\n`,
    );
    assert(result.ok);
    assertEquals(result.marker.specifications, "docs/spec");
    assertEquals(result.marker.requirements, "docs/req");
    assertEquals(result.marker.tests, ["src/**/*.spec.ts", "e2e/**"]);
  });

  await t.step("a wrong first line is an error", () => {
    assert(!parseMarker(`spec v1\n${SOURCE}`).ok);
    assert(!parseMarker("").ok);
  });

  await t.step("an unsupported major version names the supported one", () => {
    assertEquals(messages(`specs v2\n${SOURCE}`), [
      "error: this audit implements specs v1, not v2",
    ]);
  });

  await t.step("the second line must be an https URL", () => {
    assert(!parseMarker("specs v1\nhttp://example.com").ok);
    assert(!parseMarker("specs v1\nnot a url").ok);
    assert(!parseMarker("specs v1").ok);
  });

  await t.step("a line that is not a setting is an error", () => {
    assert(!parseMarker(`specs v1\n${SOURCE}\njust words`).ok);
  });

  await t.step("a repeated key is an error", () => {
    assert(!parseMarker(`specs v1\n${SOURCE}\ntests: a\ntests: b`).ok);
  });

  await t.step("an unknown key is a warning", () => {
    const result = parseMarker(`specs v1\n${SOURCE}\ncolour: blue`);
    assert(result.ok);
    assertEquals(result.findings.map((f) => f.severity), [Severity.Warning]);
  });
});
