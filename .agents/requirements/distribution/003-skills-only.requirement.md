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
- The plugin root MUST NOT contain a public audit action or exported audit
  package entry point. This repository MAY retain its audit implementation and
  command for its own validation.
- The plugin's consumer instructions MUST use the adopting repository's local
  tests and MUST NOT direct agents to a specs-provided audit command or action.

Postconditions:

- Tests: `src/distribution/manifests.test.ts`,
  `src/distribution/skills.test.ts`.
