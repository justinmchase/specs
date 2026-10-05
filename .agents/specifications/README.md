# The specs method

These chapters define the specs method: how a repository keeps a normative
specification, derives testable requirements from it, and traces tests back to
those requirements, so that people and coding agents change behavior on purpose
rather than by accident.

This repository follows the method it defines (see `.agents/SPECS`).

## Chapters

- [method](./method.spec.md): the layers, their authority, and change control.
- [marker](./marker.spec.md): the `.agents/SPECS` file a repository uses to
  declare that it follows the method.
- [layout](./layout.spec.md): where specifications and requirements live and how
  they are written.
- [traceability](./traceability.spec.md): how requirements cite the spec, how
  tests cite requirements, and what the audit checks.
- [distribution](./distribution.spec.md): how the method reaches agents, and how
  it is versioned.
