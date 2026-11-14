---
id: distribution-006
title: The Cursor plugin manifest names a repository-relative SVG logo
spec_ref: ".agents/specifications/distribution.spec.md#plugin"
---

# Cursor Logo

## Requirement

Expected behavior:

- `.cursor-plugin/plugin.json` MUST have a `logo` field that is a relative path
  (no `..`, not absolute) to an existing `.svg` file in this repository.
- `.cursor-plugin/marketplace.json`'s plugin entry MUST name the same logo path.
- That SVG MUST be the same file the site serves as `docs/logo.svg`.

Postconditions:

- Tests: `src/distribution/site.test.ts`.
