---
id: audit-001
title: The audit parses .agents/SPECS and reports a missing or malformed marker
spec_ref: ".agents/specifications/marker.spec.md#format; .agents/specifications/marker.spec.md#settings"
---

# Marker

## Requirement

Preconditions:

- The audit runs on a repository root.

Expected behavior:

- A missing `.agents/SPECS` MUST be an error.
- The first line MUST match `specs v<major>`; anything else MUST be an error. A
  major version other than 1 MUST be an error naming the supported version.
- The second line MUST be an absolute `https:` URL; anything else MUST be an
  error.
- Later lines MUST be `key: value` settings. A line that is not MUST be an
  error, a repeated key MUST be an error, and an unknown key MUST be a warning.
- Comment lines (`#`), blank lines, and surrounding whitespace MUST be ignored.
- Without settings, the directories MUST default to `.agents/specifications` and
  `.agents/requirements`, and the test globs to `**/*.test.*`, `**/*_test.*`,
  and `**/test_*.*`. The `tests` setting MUST be split on commas.

Postconditions:

- Tests: `src/audit/marker.test.ts`.
