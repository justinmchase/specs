import { assertEquals } from "@std/assert";

const root = new URL("../../", import.meta.url);

async function json(path: string): Promise<Record<string, unknown>> {
  return JSON.parse(await Deno.readTextFile(new URL(path, root)));
}

Deno.test("req:distribution-001 - manifests agree", async (t) => {
  const deno = await json("deno.json");
  const portable = await json("plugin.json");
  const claude = await json(".claude-plugin/plugin.json");
  const cursor = await json(".cursor-plugin/plugin.json");

  await t.step("plugin.json declares Agent Plugins 1.0.0", () => {
    assertEquals(
      portable.$schema,
      "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
    );
  });

  await t.step(
    "every manifest gives the same name, version, and description",
    () => {
      for (const manifest of [claude, cursor]) {
        assertEquals(
          [manifest.name, manifest.version, manifest.description],
          [portable.name, portable.version, portable.description],
        );
      }
      assertEquals(portable.version, deno.version);
    },
  );

  await t.step(
    "every marketplace lists the plugin at the repository root",
    async () => {
      for (
        const path of [
          ".claude-plugin/marketplace.json",
          ".cursor-plugin/marketplace.json",
        ]
      ) {
        const { plugins } = await json(path) as {
          plugins: { name: string; source: string }[];
        };
        assertEquals(
          plugins.map(({ name, source }) => ({ name, source })),
          [{ name: portable.name as string, source: "./" }],
          path,
        );
      }
    },
  );
});
