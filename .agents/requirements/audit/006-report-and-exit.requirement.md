---
id: audit-006
title: The audit command reports findings and fails on errors, or on warnings in strict mode
spec_ref: ".agents/specifications/traceability.spec.md#audit"
---

# Report and Exit

## Requirement

Preconditions:

- The audit runs as a command: `audit [root] [--strict] [--format text|github]`.
  `root` defaults to the working directory.

Expected behavior:

- Each finding MUST be printed on its own line with its severity and the file it
  concerns, followed by a summary count.
- With `--format github`, findings MUST be printed as GitHub Actions workflow
  commands (`::error file=...::message`, `::warning file=...::message`).
- The exit status MUST be 1 when there is an error, or a warning in strict mode,
  and 0 otherwise. An unknown flag MUST exit with status 2.

Postconditions:

- Tests: `src/audit/cli.test.ts`.
