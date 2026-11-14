---
id: distribution-003
title: A one-page GitHub Pages site includes an agent-readable install procedure
spec_ref: ".agents/specifications/distribution.spec.md#site"
---

# Site

## Requirement

Expected behavior:

- `docs/index.html` MUST be a one-page document for the method.
- `docs/install.md` MUST tell a coding agent how to install the plugin for
  Cursor, Claude Code, GitHub Copilot CLI, and Codex, then how to adopt the
  method with `specs-init` without copying it into the repository.
- `docs/index.html` MUST include a prompt a person can give to any coding agent,
  and MUST point at `install.md`.
- `docs/logo.svg` MUST exist and be an SVG.

Postconditions:

- Tests: `src/distribution/site.test.ts`.
