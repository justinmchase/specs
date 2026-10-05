import { assertEquals } from "@std/assert";
import { headingSlugs, slug } from "./slug.ts";

Deno.test("req:audit-004 - heading slugs", async (t) => {
  await t.step("slugs follow GitHub's rules", () => {
    assertEquals(
      slug("Server mode and invocation"),
      "server-mode-and-invocation",
    );
    assertEquals(slug("AST execution contracts"), "ast-execution-contracts");
    assertEquals(slug("`uffda run` input (text)"), "uffda-run-input-text");
    assertEquals(slug("Rigor: why? A/B"), "rigor-why-ab");
    assertEquals(
      slug("snake_case and  two spaces"),
      "snake_case-and--two-spaces",
    );
    assertEquals(slug("See [the spec](./a.md)"), "see-the-spec");
    assertEquals(slug("Größe"), "größe");
  });

  await t.step("repeated headings are numbered and fences are skipped", () => {
    const markdown = [
      "# Title",
      "## Notes",
      "```md",
      "## Not a heading",
      "```",
      "## Notes ##",
      "#NoSpace",
      "### Notes",
    ].join("\n");
    assertEquals(
      [...headingSlugs(markdown)],
      ["title", "notes", "notes-1", "notes-2"],
    );
  });
});
