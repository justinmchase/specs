---
id: distribution-002
title: Every skill conforms to the Agent Skills specification
spec_ref: ".agents/specifications/distribution.spec.md#skills"
---

# Skills Conform

## Requirement

Expected behavior:

- Every directory under `skills/` MUST contain a `SKILL.md` with YAML front
  matter.
- The front matter MUST use only `name`, `description`, `license`,
  `compatibility`, `metadata`, and `allowed-tools`.
- `name` MUST equal the directory name, be at most 64 characters, and be
  lowercase letters, digits, and single hyphens, not starting or ending with a
  hyphen.
- `description` MUST be non-empty and at most 1024 characters.

Postconditions:

- Tests: `src/distribution/skills.test.ts`.
