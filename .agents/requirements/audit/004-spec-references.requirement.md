---
id: audit-004
title: Every spec reference names a chapter in the specifications directory and a heading in it
spec_ref: ".agents/specifications/traceability.spec.md#spec-references"
---

# Spec References

## Requirement

Preconditions:

- A requirement document has a `spec_ref`.

Expected behavior:

- `spec_ref` MUST be accepted as a string, a string of references separated by
  `;`, or a list of strings.
- A reference whose path does not exist MUST be an error.
- A reference whose path is outside the specifications directory MUST be an
  error.
- A reference whose anchor is not the slug of a heading in the chapter MUST be
  an error. Slugs MUST follow GitHub's rules: lowercase; drop characters other
  than letters, digits, spaces, `-`, and `_`; spaces become `-`; a repeated slug
  gets `-1`, `-2`, and so on. Headings inside fenced code blocks MUST NOT count.

Postconditions:

- Tests: `src/audit/slug.test.ts`, `src/audit/audit.test.ts`.
