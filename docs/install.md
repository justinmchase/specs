# Install specs

If you are a coding agent and were pointed at this page, follow these steps in
the repository you are working in. Do not copy the specs method into that
repository.

## 1. Install the plugin

Identify which product you run in, then install `specs` from
https://github.com/justinmchase/specs.

### Cursor

Preferred, once the plugin is listed: open **Customize**, search for **specs**,
and install it for the project or user.

Until then, or for local testing:

```sh
git clone https://github.com/justinmchase/specs ~/.cursor/plugins/local/specs
```

Reload the window. Confirm the `specs`, `requirements`, `specs-init`, and
`specs-audit` skills are available.

Cursor teams can import https://github.com/justinmchase/specs as a team
marketplace instead of cloning.

### Claude Code

```text
/plugin marketplace add justinmchase/specs
/plugin install specs@justinmchase
```

### GitHub Copilot CLI

```sh
copilot plugin marketplace add justinmchase/specs
copilot plugin install specs@justinmchase
```

### Codex

```sh
codex plugin marketplace add justinmchase/specs
codex plugin add specs@justinmchase
```

### Any other agent

Do not copy `skills/` into the target repository. Read and follow
https://raw.githubusercontent.com/justinmchase/specs/v1/skills/specs-init/SKILL.md
directly.

## 2. Adopt the method when asked

If the repository already has an `.agents/SPECS` file, it already follows the
method. Stop unless you were asked to change that.

If you were asked to set up or adopt specs, read and follow
https://raw.githubusercontent.com/justinmchase/specs/v1/skills/specs-init/SKILL.md.
It adds `.agents/SPECS`, two index files, and a short block in `AGENTS.md`. It
does not copy the method into the repository.

## 3. After that

- Specifications: follow
  https://raw.githubusercontent.com/justinmchase/specs/v1/skills/specs/SKILL.md
- Requirements: follow
  https://raw.githubusercontent.com/justinmchase/specs/v1/skills/requirements/SKILL.md
- Audit: follow
  https://raw.githubusercontent.com/justinmchase/specs/v1/skills/specs-audit/SKILL.md
