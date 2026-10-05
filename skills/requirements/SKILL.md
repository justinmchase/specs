---
name: requirements
description: Write requirement documents and trace tests to them under the specs method. Use when a repository has an .agents/SPECS file and you are adding or changing a requirement, writing a test for one, or removing behavior that requirements or tests cover.
license: MIT
metadata:
  specs-version: "1"
---

# Requirements

The repository follows the specs method
(<https://github.com/justinmchase/specs>), version 1. Requirements live in
`.agents/requirements/` unless `.agents/SPECS` has a `requirements:` line naming
another directory.

A requirement refines one part of the specification into a statement narrow
enough to test. It is subordinate to the specification: if they disagree, fix
the specification first (see the `specs` skill), or ask.

## Files

```text
.agents/requirements/
  README.md
  {topic}/
    {NNN}-{name}.requirement.md
```

- One requirement per file, named `{NNN}-{name}.requirement.md` in kebab-case.
- Topic folders follow the specification's chapters where practical.
- Number new files after the highest existing number in the folder.

## Front matter

Every requirement starts with YAML front matter:

```markdown
---
id: cli-run-003
title: run reads --input as text and --input-json as one JSON value
spec_ref: ".agents/specifications/cli/run.spec.md#input"
---
```

- `id`: `{topic}-{NNN}`, matching the folder and file number, and unique in the
  repository. Never reuse an id, even after its requirement is removed.
- `title`: one line stating the behavior. Quote it if it contains `:` (YAML
  reads an unquoted `title: jsr: modules load` as broken).
- `spec_ref`: the specification sections it refines, as `{path}#{heading-slug}`
  relative to the repository root. Separate several with `;`, or use a YAML
  list. Prefer a section over a whole chapter.

A heading's slug is GitHub's anchor for it: lowercase, drop everything except
letters, digits, spaces, `-` and `_`, then turn spaces into `-`. A repeated
heading in the same file gets `-1`, `-2`, and so on.

## Body

```markdown
# Title

## Requirement

Preconditions:

- What must already be true.

Expected behavior:

- The behavior, using MUST / MUST NOT / SHOULD / MAY.
- Exact messages, values, and edge cases a test can check.

Postconditions:

- What is true afterwards.
- Tests: where the tests that verify this live.
```

Keep it narrower and more concrete than the specification text it refines.

## Tracing tests

- A test cites each requirement it verifies with the token `req:{id}`, usually
  at the start of the test's name:
  `Deno.test("req:cli-run-003 - --input is read as text", ...)`,
  `def test_run_input():  # req:cli-run-003`.
- Every `req:{id}` in a test must name an existing requirement, and every
  requirement should be cited by at least one test.
- When you remove or renumber a requirement, update or remove the tests that
  cite it in the same change.

## Checking your work

Run the audit (the `specs-audit` skill). It reports missing front matter,
duplicate ids, `spec_ref`s that don't resolve, tests citing requirements that
don't exist, and requirements no test cites.
