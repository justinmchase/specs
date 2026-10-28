---
name: specs-init
description: Set up the specs method in a repository. Use when asked to adopt the specs method, add specifications and requirements to a repository, or set up https://github.com/justinmchase/specs.
license: MIT
metadata:
  specs-version: "2"
---

# Set up the specs method

Adopting the method adds a marker, a short pointer in `AGENTS.md`, and the two
index files. The method itself is not copied into the repository: agents get it
from the installed plugin or from the pinned links in the pointer, so it cannot
drift.

## 1. Look before writing

- If `.agents/SPECS` already exists, the repository has adopted the method. Read
  it and continue with the requested change; do not initialize it again.
- Look for existing design documents, ADRs, or instruction files that describe
  behavior (`docs/`, `.cursor/rules/`, `.github/instructions/`,
  `.github/copilot-instructions.md`, `CLAUDE.md`). Note them for step 5.

## 2. Write the marker

Create `.agents/SPECS` with exactly:

```text
specs v2
https://github.com/justinmchase/specs
```

Add settings only if the repository's layout differs from the defaults, after a
blank line:

```text
specifications: docs/spec
requirements: docs/requirements
tests: src/**/*.spec.ts, e2e/**/*.ts
```

The defaults are `.agents/specifications`, `.agents/requirements`, and tests
matching `**/*.test.*`, `**/*_test.*`, or `**/test_*.*`.

## 3. Write the indexes

Create `.agents/specifications/README.md` from
[assets/specifications-README.md](assets/specifications-README.md) and
`.agents/requirements/README.md` from
[assets/requirements-README.md](assets/requirements-README.md), replacing
`{project}` with the project's name.

## 4. Add the pointer to AGENTS.md

Add the block in [assets/agents-block.md](assets/agents-block.md) to `AGENTS.md`
at the repository root, creating the file if needed. Keep it short; it is the
only text about the method that lives in the repository.

If the repository has a `CLAUDE.md`, Claude Code reads it instead of
`AGENTS.md`. Make sure `CLAUDE.md` contains the line `@AGENTS.md` so Claude
reads both.

## 5. Bring existing knowledge in

- For an established codebase, follow `specs-extract` to derive a first,
  reviewable slice from code, existing tests, and documents. It guides you to
  resolve conflicts before making observed behavior normative.
- Remove copies of method rules from per-tool instruction files (for example
  rules about how to write specs or requirements); the pointer and the skills
  replace them. Keep repository-specific rules where they are.
- Ask before deleting anything you are not sure about.

## 6. Check and report

- Follow `specs-verify`: connect requirements to this repository's own local
  tests and run its normal test command. A marker and empty indexes alone do not
  verify behavior; report which areas have not yet been specified or tested.
- Tell the user how to install the plugin for their agent, from
  <https://github.com/justinmchase/specs#install>.
