import { assert, assertEquals, assertMatch } from "@std/assert";

const root = new URL("../../", import.meta.url);

async function read(path: string): Promise<string> {
  return await Deno.readTextFile(new URL(path, root));
}

async function json(path: string): Promise<Record<string, unknown>> {
  return JSON.parse(await read(path));
}

Deno.test("req:distribution-003 - site is a one-page doc with agent install", async (t) => {
  const page = await read("docs/index.html");
  const install = await read("docs/install.md");
  const logo = await read("docs/logo.svg");

  await t.step("index.html is a one-page document", () => {
    assertMatch(page, /<title>specs<\/title>/);
    assertMatch(page, /Give this to an agent/);
    assertMatch(page, /If you are a coding agent/);
  });

  await t.step("index.html includes a prompt and points at install.md", () => {
    assertMatch(page, /href="install.md"/);
    assertMatch(
      page,
      /Follow https:\/\/justinmchase\.github\.io\/specs\/install\.md/,
    );
    assertMatch(page, /Do not copy the method into the repository/);
  });

  await t.step("install.md covers each agent and specs-init", () => {
    for (
      const needle of [
        "Cursor",
        "Claude Code",
        "GitHub Copilot CLI",
        "Codex",
        "specs-init",
        "Do not copy",
      ]
    ) {
      assert(install.includes(needle), `install.md must mention ${needle}`);
    }
  });

  await t.step("docs/logo.svg is an SVG", () => {
    assertMatch(logo, /<svg\b/);
  });
});

Deno.test("req:distribution-004 - Cursor plugin names a repo-relative SVG logo", async (t) => {
  const cursor = await json(".cursor-plugin/plugin.json");
  const marketplace = await json(".cursor-plugin/marketplace.json") as {
    plugins: { name: string; logo?: string }[];
  };
  const logo = cursor.logo;

  await t.step("plugin.json logo is a relative path to an existing SVG", () => {
    assert(typeof logo === "string" && logo.endsWith(".svg"));
    assert(
      !logo.includes("..") && !logo.startsWith("/") &&
        !/^[a-z]+:/i.test(logo),
      `logo must be a relative path, got ${logo}`,
    );
  });

  await t.step("the logo file exists", async () => {
    await Deno.stat(new URL(logo as string, root));
  });

  await t.step("marketplace entry names the same logo", () => {
    const entry = marketplace.plugins.find((plugin) => plugin.name === "specs");
    assertEquals(entry?.logo, logo);
  });

  await t.step("plugin logo is the same SVG the site serves", async () => {
    assertEquals(
      await read(logo as string),
      await read("docs/logo.svg"),
    );
  });
});
