---
id: audit-005
title: Tests cite only existing requirements, and uncited requirements are warnings
spec_ref: ".agents/specifications/traceability.spec.md#test-references"
---

# Test References

## Requirement

Preconditions:

- Test files are the files matching the marker's test globs, outside directories
  whose names begin with `.` and outside `node_modules`.

Expected behavior:

- A `req:{id}` token, where `{id}` is kebab-case, in a test file that names no
  requirement MUST be an error naming the file.
- A requirement that no test file cites MUST be a warning.

Postconditions:

- Tests: `src/audit/audit.test.ts`.
