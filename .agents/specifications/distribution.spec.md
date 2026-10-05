# Distribution

How the method reaches people and coding agents, how a repository points at it,
and how it is versioned. The aim is one source for the method, so it does not
drift as repositories adopt it.

## Conventions

The key words MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are to be interpreted
as described in RFC 2119 and RFC 8174 when, and only when, they appear in all
capitals.

## Skills

- The method's working instructions MUST be published as Agent Skills
  (<https://agentskills.io>): directories under `skills/`, each with a
  `SKILL.md`.
- A skill's front matter MUST use only the fields the Agent Skills specification
  defines, so every agent can load it. Its `name` MUST match its directory.
- The skills MUST be self-contained enough to follow without this repository
  checked out, and MAY link to these chapters for detail.

## Plugin

This repository is itself a plugin and a marketplace, so each agent can install
the skills with its own plugin manager:

| Manifest                          | Read by                                                 |
| --------------------------------- | ------------------------------------------------------- |
| `plugin.json`                     | Agent Plugins clients (Codex, Cursor, Copilot, VS Code) |
| `.claude-plugin/plugin.json`      | Claude Code                                             |
| `.claude-plugin/marketplace.json` | Claude Code, Copilot CLI, Codex                         |
| `.cursor-plugin/plugin.json`      | Cursor                                                  |
| `.cursor-plugin/marketplace.json` | Cursor team marketplaces                                |

- Every plugin manifest MUST give the same `name`, `version`, and `description`,
  and every marketplace entry MUST point at the repository root.

## Repository pointer

A repository that adopts the method MUST NOT copy the skills into itself.
Instead it has:

- the marker, `.agents/SPECS` (see [marker](./marker.spec.md)); and
- a short block in its `AGENTS.md` that names the marker, states the authority
  order and change control from [method](./method.spec.md), and links to the
  skills, both as the plugin to install and as raw files of the pinned major
  version, for agents without the plugin.

Repository-specific rules belong in the repository; the method's rules belong
here.

## Versioning

- Releases MUST follow semantic versioning. A change that would make a
  repository that passed the audit fail it, or that changes what the method
  requires of authors, is a major change.
- Each major version MUST stay available at a branch named `v{major}`, which the
  pointer's raw links and the GitHub Action refer to. Publishing a release MUST
  fast-forward that branch to the release, and nothing may rewind or rewrite it.
- The audit MUST implement exactly the major versions it reports supporting.
