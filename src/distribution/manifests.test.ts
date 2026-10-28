import { assertEquals, assertRejects } from "@std/assert";

const root = new URL("../../", import.meta.url);

async function json(path: string): Promise<Record<string, unknown>> {
  return JSON.parse(await Deno.readTextFile(new URL(path, root)));
}

Deno.test("req:distribution-001 - manifests agree", async (t) => {
  const deno = await json("deno.json");
  const version = (await Deno.readTextFile(new URL("VERSION", root))).trim();
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
      assertEquals(portable.version, version);
    },
  );

  await t.step("req:distribution-003 - manifests expose no tools", () => {
    const metadata = [
      "$schema",
      "name",
      "version",
      "description",
      "author",
      "homepage",
      "repository",
      "license",
      "keywords",
    ];
    for (const manifest of [portable, claude, cursor]) {
      assertEquals(
        Object.keys(manifest).sort(),
        metadata.filter((key) => key in manifest).sort(),
      );
    }
  });

  await t.step("req:distribution-003 - no plugin tool folders", async () => {
    for (
      const path of [
        "mcp.json",
        ".mcp.json",
        "tools",
        "commands",
        "hooks",
        "agents",
        ".claude-plugin/commands",
        ".cursor-plugin/commands",
      ]
    ) {
      await assertRejects(
        () => Deno.stat(new URL(path, root)),
        Deno.errors.NotFound,
        path,
      );
    }
  });

  await t.step(
    "every marketplace lists the plugin at the repository root",
    async () => {
      for (
        const path of [
          ".claude-plugin/marketplace.json",
          ".cursor-plugin/marketplace.json",
        ]
      ) {
        const marketplace = await json(path);
        assertEquals(Object.keys(marketplace).sort(), [
          "metadata",
          "name",
          "owner",
          "plugins",
        ]);
        const { plugins } = marketplace as {
          plugins: { name: string; source: string; description: string }[];
        };
        for (const plugin of plugins) {
          // req:distribution-003 - marketplace entries cannot add tool
          // declarations alongside the skills-only plugin source.
          assertEquals(Object.keys(plugin).sort(), [
            "description",
            "name",
            "source",
          ]);
        }
        assertEquals(
          plugins.map(({ name, source }) => ({ name, source })),
          [{ name: portable.name as string, source: "./" }],
          path,
        );
      }
    },
  );
});
