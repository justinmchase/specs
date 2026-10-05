---
id: distribution-001
title: Every plugin manifest agrees on name, version, and description, and marketplaces point at the root
spec_ref: ".agents/specifications/distribution.spec.md#plugin"
---

# Manifests Agree

## Requirement

Expected behavior:

- `plugin.json`, `.claude-plugin/plugin.json`, and `.cursor-plugin/plugin.json`
  MUST have the same `name`, `version`, and `description`, and the version MUST
  equal `deno.json`'s.
- `plugin.json` MUST declare the Agent Plugins 1.0.0 schema.
- `.claude-plugin/marketplace.json` and `.cursor-plugin/marketplace.json` MUST
  each list the plugin by that name with a source that is the repository root.

Postconditions:

- Tests: `src/distribution/manifests.test.ts`.
