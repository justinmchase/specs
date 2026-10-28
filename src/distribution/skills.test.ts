import { assert, assertEquals } from "@std/assert";
import { extract } from "@std/front-matter/yaml";

const skills = new URL("../../skills/", import.meta.url);
const root = new URL("../../", import.meta.url);

const FIELDS = new Set([
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
]);

Deno.test("req:distribution-002 - skills conform to Agent Skills", async (t) => {
  const plugin = JSON.parse(
    await Deno.readTextFile(new URL("plugin.json", root)),
  );
  const major = String(plugin.version).split(".")[0];
  const names: string[] = [];
  for await (const entry of Deno.readDir(skills)) {
    if (entry.isDirectory) names.push(entry.name);
  }
  assertEquals(names.sort(), [
    "requirements",
    "specs",
    "specs-extract",
    "specs-init",
    "specs-verify",
  ]);

  for (const name of names.sort()) {
    await t.step(name, async () => {
      const source = await Deno.readTextFile(
        new URL(`${name}/SKILL.md`, skills),
      );
      const { attrs } = extract<Record<string, unknown>>(source);
      for (const field of Object.keys(attrs)) {
        assert(
          FIELDS.has(field),
          `${name}: "${field}" is not an Agent Skills field`,
        );
      }
      assertEquals(attrs.name, name);
      assertEquals(
        (attrs.metadata as Record<string, unknown>)?.["specs-version"],
        major,
      );
      assert(name.length <= 64 && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(name));
      const description = attrs.description;
      assert(
        typeof description === "string" && description.trim() !== "" &&
          description.length <= 1024,
        `${name}: description must be 1 to 1024 characters`,
      );
      // req:distribution-003 - consumer skills cannot direct agents to a
      // plugin-provided audit command or action.
      const forbidden =
        /specs-audit|jsr:@justinmchase\/specs\/audit|justinmchase\/specs@v\d+/;
      assert(!forbidden.test(source), `${name}: refers to a public audit`);
    });
  }
});

Deno.test("req:distribution-004 - extraction and local verification are linked", async () => {
  const extract = await Deno.readTextFile(
    new URL("specs-extract/SKILL.md", skills),
  );
  const verify = await Deno.readTextFile(
    new URL("specs-verify/SKILL.md", skills),
  );
  const init = await Deno.readTextFile(new URL("specs-init/SKILL.md", skills));
  assert(extract.includes("req:{id}"));
  assert(extract.includes("specs-verify"));
  assert(verify.includes("req:{id}"));
  assert(init.includes("specs-extract"));
});
