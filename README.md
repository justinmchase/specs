# specs

A small method for keeping software honest with coding agents: a living
specification, testable requirements that cite it, and tests that cite the
requirements. When they disagree, the specification wins, and behavior changes
update the specification in the same pull request as the code.

It works with Claude Code, Cursor, GitHub Copilot, and Codex, and with people.

## Agents: start here

If you were asked to set up the specs method in a repository:

1. Read [`skills/specs-init/SKILL.md`](skills/specs-init/SKILL.md) and follow
   it. It adds `.agents/SPECS`, two index files, and a short block in
   `AGENTS.md`. It does not copy the method into the repository.
2. To write specifications or requirements afterwards, follow
   [`skills/specs/SKILL.md`](skills/specs/SKILL.md) and
   [`skills/requirements/SKILL.md`](skills/requirements/SKILL.md).
3. For an existing codebase, follow
   [`skills/specs-extract/SKILL.md`](skills/specs-extract/SKILL.md) to bring one
   area of existing behavior into the method.
4. To check the result with that repository's tests, follow
   [`skills/specs-verify/SKILL.md`](skills/specs-verify/SKILL.md).

If the repository already has an `.agents/SPECS` file, it has adopted the
method; read its `AGENTS.md`.

## The method in one screen

| Layer          | Lives in                  | Is                                                 |
| -------------- | ------------------------- | -------------------------------------------------- |
| Specifications | `.agents/specifications/` | The normative contract, as focused chapters.       |
| Requirements   | `.agents/requirements/`   | Narrow, testable statements citing a chapter.      |
| Tests          | anywhere                  | Executable checks citing requirements: `req:{id}`. |
| Implementation | anywhere                  | The code.                                          |

- Higher layers win. Never edit a test or code to contradict a requirement or
  the specification; ask whether the higher layer should change.
- A behavior change updates the specification or requirement in the same change
  as the code. A behavior nobody specified is a gap to fill, not a license.
- Requirements cite specification sections (`spec_ref`), tests cite requirements
  (`req:{id}`), and the repository's own local tests verify behavior.

The normative definition is in
[`.agents/specifications/`](.agents/specifications/README.md). Unlike
per-feature spec tools such as GitHub Spec Kit or Kiro, the specification here
is not a plan that gets used up: it is the standing contract the code is held
to.

## A repository that follows it

```text
AGENTS.md                      a short pointer block (see below)
.agents/
  SPECS                        "specs v2" and this repository's URL
  specifications/
    README.md                  the index
    {topic}.spec.md
  requirements/
    README.md
    {topic}/{NNN}-{name}.requirement.md
```

`.agents/SPECS` declares the method and its major version, like a `LICENSE` file
declares a license:

```text
specs v2
https://github.com/justinmchase/specs
```

Optional `key: value` lines after a blank line change the layout
(`specifications:`, `requirements:`, `tests:`); see the
[marker chapter](.agents/specifications/marker.spec.md).

The method is never copied into the repository. Agents get it from the plugin,
or from the pinned links in the `AGENTS.md` block
([`skills/specs-init/assets/agents-block.md`](skills/specs-init/assets/agents-block.md)),
so it does not drift from repository to repository.

## Install

Installing the plugin gives your agent the `specs`, `requirements`,
`specs-init`, `specs-extract`, and `specs-verify` skills. The plugin contains no
callable tools or MCP server.

| Agent              | Install                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| Claude Code        | `/plugin marketplace add justinmchase/specs`, then `/plugin install specs@justinmchase`               |
| GitHub Copilot CLI | `copilot plugin marketplace add justinmchase/specs`, then `copilot plugin install specs@justinmchase` |
| Codex              | `codex plugin marketplace add justinmchase/specs`, then `codex plugin add specs@justinmchase`         |
| Cursor             | `git clone https://github.com/justinmchase/specs ~/.cursor/plugins/local/specs`, then reload          |

Cursor teams can instead import this repository as a team marketplace. Agents
without the plugin can still follow the method through the links in the
`AGENTS.md` block.

## Verify requirements

Use the adopting repository's normal unit or local test suite. Each test cites
the requirements it verifies with `req:{id}`. The `specs-verify` skill guides
agents to inspect those links, add tests where coverage is missing, run the
repository's tests, and report remaining gaps. A citation alone does not prove
the requirement is tested; the assertions must exercise its behavior.

This repository retains a Deno audit for checking its own marker, requirement
documents, and test references. It runs in this repository's `deno task pre` and
CI; it is not part of the installed plugin or an adopting repository's
verification workflow.

## Versioning

Releases follow semantic versioning. The major version is the one a repository
names in `.agents/SPECS`; each stays available at the `v{major}` branch, which
the `AGENTS.md` links use. Publishing a release fast-forwards that branch to it.
Removing a published interface or changing what the method asks of authors
requires a new major version.

## License

[MIT](LICENSE)
