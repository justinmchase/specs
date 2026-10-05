---
id: audit-003
title: Every requirement document has id, title, and spec_ref, and ids are unique
spec_ref: ".agents/specifications/layout.spec.md#requirements"
---

# Requirement Front Matter

## Requirement

Preconditions:

- The requirements directory exists. Every `*.requirement.md` file under it, at
  any depth, is a requirement document.

Expected behavior:

- A requirement document without YAML front matter MUST be an error.
- A missing or empty `id`, `title`, or `spec_ref` MUST be an error naming the
  field.
- Two documents with the same `id` MUST be an error naming both files.

Postconditions:

- Tests: `src/audit/audit.test.ts`.
