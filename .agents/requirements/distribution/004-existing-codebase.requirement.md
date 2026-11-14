---
id: distribution-004
title: The plugin includes an existing-codebase extraction skill
spec_ref: ".agents/specifications/distribution.spec.md#skills; .agents/specifications/traceability.spec.md#local-verification"
---

# Existing Codebase Extraction

## Requirement

Expected behavior:

- The plugin MUST include a `specs-extract` skill that guides an agent to
  inspect existing code, tests, and documents, draft reviewable specifications
  and requirements, and link them to locally runnable tests.
- The workflow MUST be incremental and MUST require conflicts between sources of
  behavior to be resolved deliberately.
- The workflow MUST NOT depend on a specs-provided tool.

Postconditions:

- Tests: `src/distribution/skills.test.ts`.
