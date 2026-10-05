import { assert, assertEquals } from "@std/assert";
import { extract } from "@std/front-matter/yaml";

const skills = new URL("../../skills/", import.meta.url);

const FIELDS = new Set([
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
]);

Deno.test("req:distribution-002 - skills conform to Agent Skills", async (t) => {
  const names: string[] = [];
  for await (const entry of Deno.readDir(skills)) {
    if (entry.isDirectory) names.push(entry.name);
  }
  assert(names.length > 0);

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
      assert(name.length <= 64 && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(name));
      const description = attrs.description;
      assert(
        typeof description === "string" && description.trim() !== "" &&
          description.length <= 1024,
        `${name}: description must be 1 to 1024 characters`,
      );
    });
  }
});
