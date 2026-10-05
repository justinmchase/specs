import { assertEquals } from "@std/assert";
import { audit } from "./audit.ts";
import {
  cleanRepository,
  REQ,
  requirement,
  writeRepository,
} from "./fixture.ts";

async function findings(
  changes: Record<string, string | undefined>,
): Promise<string[]> {
  const files: Record<string, string> = cleanRepository();
  for (const [path, text] of Object.entries(changes)) {
    if (text === undefined) delete files[path];
    else files[path] = text;
  }
  const root = await writeRepository(files);
  try {
    return (await audit(root)).findings.map((f) =>
      `${f.severity} ${f.file}: ${f.message}`
    );
  } finally {
    await Deno.remove(root, { recursive: true });
  }
}

const SPIN = ".agents/requirements/things/001-spin.requirement.md";

Deno.test("audit of a clean repository finds nothing", async () => {
  assertEquals(await findings({}), []);
});

Deno.test("req:audit-001 - a missing marker is an error", async () => {
  assertEquals(await findings({ ".agents/SPECS": undefined }), [
    "error .agents/SPECS: missing; a repository following the method declares it here",
  ]);
});

Deno.test("req:audit-002 - directories", async (t) => {
  await t.step("the specifications index is required", async () => {
    assertEquals(
      await findings({ ".agents/specifications/README.md": undefined }),
      [
        "error .agents/specifications/README.md: the specifications directory needs a README.md index",
      ],
    );
  });

  await t.step("missing directories are errors", async () => {
    assertEquals(
      await findings({
        ".agents/SPECS":
          "specs v1\nhttps://github.com/justinmchase/specs\n\nspecifications: nope\nrequirements: none\n",
      }),
      [
        "error none: the requirements directory does not exist",
        "error nope: the specifications directory does not exist",
      ],
    );
  });
});

Deno.test("req:audit-003 - requirement front matter", async (t) => {
  await t.step("front matter is required", async () => {
    assertEquals(await findings({ [SPIN]: "# Spin\n" }), [
      `error ${SPIN}: has no YAML front matter`,
      `error src/spin.test.ts: cites ${REQ}things-001, which is not a requirement`,
    ]);
  });

  await t.step("invalid YAML is an error", async () => {
    const [finding] = await findings({
      [SPIN]: "---\nid: things-001\ntitle: a: b: c\n---\n",
    });
    assertEquals(
      finding.startsWith(
        `error ${SPIN}: has front matter that is not valid YAML`,
      ),
      true,
    );
  });

  await t.step("each missing field is named", async () => {
    assertEquals(
      await findings({ [SPIN]: '---\nid: things-001\ntitle: ""\n---\n' }),
      [
        `error ${SPIN}: is missing "spec_ref" in its front matter`,
        `error ${SPIN}: is missing "title" in its front matter`,
      ],
    );
  });

  await t.step("ids must be unique", async () => {
    // Which file is reported first depends on the directory listing.
    const [finding, ...rest] = await findings({
      ".agents/requirements/things/002-spin.requirement.md": requirement(
        "things-001",
      ),
    });
    assertEquals(rest, []);
    assertEquals(
      /^error \.agents\/requirements\/things\/00[12]-spin\.requirement\.md: the id "things-001" is also used by \.agents\/requirements\/things\/00[12]-spin\.requirement\.md$/
        .test(finding),
      true,
    );
  });
});

Deno.test("req:audit-004 - spec references", async (t) => {
  await t.step("lists and ;-separated strings are accepted", async () => {
    const both =
      ".agents/specifications/things.spec.md#widgets; .agents/specifications/things.spec.md#things";
    assertEquals(
      await findings({ [SPIN]: requirement("things-001", both) }),
      [],
    );
    assertEquals(
      await findings({
        [SPIN]:
          "---\nid: things-001\ntitle: t\nspec_ref:\n  - .agents/specifications/things.spec.md#widgets\n  - .agents/specifications/README.md\n---\n",
      }),
      [],
    );
  });

  await t.step("a file that does not exist is an error", async () => {
    assertEquals(
      await findings({
        [SPIN]: requirement(
          "things-001",
          ".agents/specifications/gone.spec.md",
        ),
      }),
      [
        `error ${SPIN}: spec_ref ".agents/specifications/gone.spec.md" names a file that does not exist`,
      ],
    );
  });

  await t.step("a file outside the specifications is an error", async () => {
    assertEquals(
      await findings({
        [SPIN]: requirement(
          "things-001",
          ".agents/specifications/../SPECS",
        ),
      }),
      [
        `error ${SPIN}: spec_ref ".agents/specifications/../SPECS" is outside .agents/specifications`,
      ],
    );
  });

  await t.step("an anchor that is not a heading is an error", async () => {
    assertEquals(
      await findings({
        [SPIN]: requirement(
          "things-001",
          ".agents/specifications/things.spec.md#gadgets",
        ),
      }),
      [
        `error ${SPIN}: spec_ref ".agents/specifications/things.spec.md#gadgets" names "#gadgets", which is not a heading in .agents/specifications/things.spec.md`,
      ],
    );
  });
});

Deno.test("req:audit-005 - test references", async (t) => {
  await t.step(
    "citing a requirement that does not exist is an error",
    async () => {
      assertEquals(
        await findings({
          "src/other.test.ts": `// ${REQ}things-404\n`,
        }),
        [
          "error src/other.test.ts: cites " + REQ +
          "things-404, which is not a requirement",
        ],
      );
    },
  );

  await t.step("an uncited requirement is a warning", async () => {
    assertEquals(await findings({ "src/spin.test.ts": "// nothing\n" }), [
      `warning ${SPIN}: no test cites ${REQ}things-001`,
    ]);
  });

  await t.step(
    "only test files count, outside dot directories and node_modules",
    async () => {
      assertEquals(
        await findings({
          "src/spin.test.ts": undefined,
          "src/spin.ts": `// ${REQ}things-001\n`,
          ".hidden/spin.test.ts": `// ${REQ}things-001\n`,
          "node_modules/x/spin.test.ts": `// ${REQ}things-404\n`,
        }),
        [`warning ${SPIN}: no test cites ${REQ}things-001`],
      );
    },
  );

  await t.step("every default test glob counts", async () => {
    for (
      const file of ["tests/test_spin.py", "spin_test.go", "a/b/spin.test.js"]
    ) {
      assertEquals(
        await findings({
          "src/spin.test.ts": undefined,
          [file]: `# ${REQ}things-001\n`,
        }),
        [],
        file,
      );
    }
  });
});
