---
id: audit-002
title: The audit requires the specifications and requirements directories and the specifications index
spec_ref: ".agents/specifications/traceability.spec.md#audit"
---

# Directories

## Requirement

Preconditions:

- The marker parses.

Expected behavior:

- A specifications directory that does not exist MUST be an error.
- A specifications directory without `README.md` MUST be an error.
- A requirements directory that does not exist MUST be an error.

Postconditions:

- Tests: `src/audit/audit.test.ts`.
