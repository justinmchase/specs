# Marker

The `.agents/SPECS` file a repository uses to declare that it follows the specs
method, which major version, and where its specifications and requirements live.

## Conventions

The key words MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are to be interpreted
as described in RFC 2119 and RFC 8174 when, and only when, they appear in all
capitals.

## Location

- A repository that follows the method MUST have a file named `SPECS`, with no
  extension, in its `.agents/` directory at the repository root.
- The repository root is the directory that contains `.agents/`. Paths in the
  marker are relative to it.

## Format

The marker is plain text, in the spirit of a `LICENSE` file: readable at a
glance and simple to parse.

```text
specs v1
https://github.com/justinmchase/specs

requirements: .agents/requirements
```

- The first line MUST be `specs v<major>`, where `<major>` is a positive integer
  naming the major version of the method the repository follows (see
  [distribution](./distribution.spec.md#versioning)).
- The second line MUST be an absolute `https:` URL naming where that method is
  defined.
- Any further non-empty lines MUST be settings of the form `key: value`. A blank
  line SHOULD separate them from the first two lines.
- Lines beginning with `#` are comments and MUST be ignored, as MUST leading and
  trailing whitespace on every line.
- A key MUST NOT appear more than once. A tool MUST report a key it does not
  know, and SHOULD continue.

## Settings

| Key              | Default                  | Meaning                                                 |
| ---------------- | ------------------------ | ------------------------------------------------------- |
| `specifications` | `.agents/specifications` | The directory holding the specification chapters.       |
| `requirements`   | `.agents/requirements`   | The directory holding the requirement documents.        |
| `tests`          | see below                | Comma-separated globs naming the files that hold tests. |

- The default `tests` globs are `**/*.test.*`, `**/*_test.*`, and `**/test_*.*`.
- Directories whose names begin with `.`, and `node_modules`, MUST NOT be
  searched for tests.
- A repository SHOULD rely on the defaults and add settings only when its layout
  differs.
