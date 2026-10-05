---
name: specs-init
description: Set up the specs method in a repository. Use when asked to adopt the specs method, add specifications and requirements to a repository, or set up https://github.com/justinmchase/specs.
license: MIT
metadata:
  specs-version: "1"
---

# Set up the specs method

Adopting the method adds a marker, a short pointer in `AGENTS.md`, and the two
index files. The method itself is not copied into the repository: agents get it
from the installed plugin or from the pinned links in the pointer, so it cannot
drift.

## 1. Look before writing

- If `.agents/SPECS` already exists, the repository has adopted the method. Read
  it and stop unless asked to change it.
- Look for existing design documents, ADRs, or instruction files that describe
  behavior (`docs/`, `.cursor/rules/`, `.github/instructions/`,
  `.github/copilot-instructions.md`, `CLAUDE.md`). Note them for step 5.

## 2. Write the marker

Create `.agents/SPECS` with exactly:

```text
specs v1
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

- If existing documents state behavior as rules, draft them as specification
  chapters (use the `specs` skill) and list each chapter in the index.
- Remove copies of method rules from per-tool instruction files (for example
  rules about how to write specs or requirements); the pointer and the skills
  replace them. Keep repository-specific rules where they are.
- Ask before deleting anything you are not sure about.

## 6. Check and report

- Run the audit (the `specs-audit` skill). A new repository should report no
  errors.
- Tell the user how to install the plugin for their agent, from
  <https://github.com/justinmchase/specs#install>, and suggest adding the audit
  to CI with the `justinmchase/specs@v1` GitHub Action.
