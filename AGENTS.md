# Agent instructions

This repository defines the specs method and ships it as Agent Skills, a plugin
for each coding agent, and an audit tool. It follows the method itself.

## Specifications

This repository follows the specs method, as declared in `.agents/SPECS`
(<https://github.com/justinmchase/specs>).

- Authority, highest first: specifications (`.agents/specifications/`),
  requirements (`.agents/requirements/`), tests, implementation. Never change a
  lower layer to contradict a higher one; if a request conflicts with the
  specification or a requirement, ask before proceeding.
- A behavior change updates the specification or requirement that covers it in
  the same change as the code.
- Tests cite the requirements they verify with `req:{id}`.
- Before writing specifications or requirements, use the `specs` and
  `requirements` skills in `skills/`.

## Working here

- The skills in `skills/` are what other repositories' agents read. Keep them
  self-contained, under about 5,000 tokens each, and their front matter limited
  to the Agent Skills fields.
- The method's rules live in `.agents/specifications/`; when a skill and a
  chapter disagree, the chapter wins and the skill is fixed.
- `skills/specs-init/assets/agents-block.md` is the pointer adopting
  repositories copy. Keep it short; any change to it reaches every repository
  that adopts the method afterwards.
- Every manifest (`plugin.json`, `.claude-plugin/`, `.cursor-plugin/`) must
  agree on name, version, and description, and match `deno.json`'s version.
- Use TypeScript and Deno for all tooling. Before pushing, run `deno task pre`
  (format, lint, test, and a strict audit of this repository).
- Never create, push, or move tags by hand; releases create them.
