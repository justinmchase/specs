import { assertEquals } from "@std/assert";
import { runCli } from "./cli.ts";
import { cleanRepository, writeRepository } from "./fixture.ts";

async function withRepository(
  changes: Record<string, string>,
  run: (root: string) => Promise<void>,
): Promise<void> {
  const root = await writeRepository({ ...cleanRepository(), ...changes });
  try {
    await run(root);
  } finally {
    await Deno.remove(root, { recursive: true });
  }
}

const UNCITED = { "src/spin.test.ts": "// nothing\n" };
const DANGLING = { ".agents/SPECS": "specs v9\nhttps://example.com\n" };

Deno.test("req:audit-006 - report and exit", async (t) => {
  await t.step("a clean repository exits 0", async () => {
    await withRepository({}, async (root) => {
      assertEquals(await runCli([root]), {
        code: 0,
        lines: ["0 errors, 0 warnings"],
      });
    });
  });

  await t.step("warnings pass, unless strict", async () => {
    await withRepository(UNCITED, async (root) => {
      const relaxed = await runCli([root]);
      assertEquals(relaxed.code, 0);
      assertEquals(relaxed.lines.at(-1), "0 errors, 1 warning");
      assertEquals(
        relaxed.lines[0].startsWith(
          "warning .agents/requirements/things/001-spin.requirement.md: ",
        ),
        true,
      );
      assertEquals((await runCli([root, "--strict"])).code, 1);
    });
  });

  await t.step("errors fail", async () => {
    await withRepository(DANGLING, async (root) => {
      assertEquals(await runCli([root]), {
        code: 1,
        lines: [
          "error .agents/SPECS: this audit implements specs v1, not v9",
          "1 error, 0 warnings",
        ],
      });
    });
  });

  await t.step("--format github prints workflow commands", async () => {
    await withRepository(DANGLING, async (root) => {
      const { lines } = await runCli([root, "--format", "github"]);
      assertEquals(
        lines[0],
        "::error file=.agents/SPECS::this audit implements specs v1, not v9",
      );
    });
  });

  await t.step("an unknown flag exits 2", async () => {
    assertEquals((await runCli(["--nope"])).code, 2);
    assertEquals((await runCli(["--format", "xml"])).code, 2);
  });
});
