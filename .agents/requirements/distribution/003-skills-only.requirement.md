---
id: distribution-003
title: The installed plugin exposes skills and no callable tools
spec_ref: ".agents/specifications/distribution.spec.md#skills; .agents/specifications/distribution.spec.md#plugin"
---

# Skills Only

## Requirement

Expected behavior:

- Plugin manifests MUST NOT declare callable tools, MCP servers, commands,
  hooks, or agents.
- Existing standalone audit interfaces MAY remain available outside the plugin
  for compatibility. They MUST NOT be declared as plugin tools.
- The plugin's consumer instructions MUST use the adopting repository's local
  tests and MUST NOT direct agents to a specs-provided audit command or action.

Postconditions:

- Tests: `src/distribution/manifests.test.ts`,
  `src/distribution/skills.test.ts`.
