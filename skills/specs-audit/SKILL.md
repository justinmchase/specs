---
name: specs-audit
description: Check a repository against the specs method and fix what it finds. Use when a repository has an .agents/SPECS file and you have changed specifications, requirements, or tests, or when asked to audit traceability.
license: MIT
metadata:
  specs-version: "1"
---

# Audit

The audit checks that a repository's marker, specifications, requirements, and
tests fit together.

## Run it

With Deno installed, from the repository root:

```sh
deno run --allow-read jsr:@justinmchase/specs/audit
```

Add `--strict` to fail on warnings too. In GitHub Actions:

```yaml
- uses: justinmchase/specs@v1
  with:
    strict: false
```

Without Deno, check the same things by hand, using the list below.

## What it reports, and how to fix it

Errors:

- **The marker is missing or malformed.** `.agents/SPECS` must start with
  `specs v1` and then an `https:` URL, followed only by `key: value` settings.
- **A directory is missing, or the specifications have no `README.md`.** Create
  it, or fix the `specifications:` / `requirements:` setting in the marker.
- **A requirement has no front matter, or lacks `id`, `title`, or `spec_ref`.**
  Add them (see the `requirements` skill). Quote a `title` that contains `:`.
- **Two requirements share an id.** Give the newer one the next free number in
  its folder, rename its file to match, and update the tests that cite it.
- **A `spec_ref` names a missing file, a file outside the specifications, or a
  heading that isn't there.** Point it at the chapter and heading it refines. If
  a heading was renamed, update every requirement that cited the old slug.
- **A test cites a requirement that doesn't exist.** Usually the requirement was
  removed or renumbered: cite the right one, or, if the behavior is gone, remove
  the test. If the behavior is real but has no requirement, write the
  requirement.

Warnings:

- **An unknown key in the marker.** Remove it, or check its spelling.
- **No test cites a requirement.** Add `req:{id}` to the test that verifies it,
  or write one.
