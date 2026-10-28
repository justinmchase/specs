---
name: specs-extract
description: Extract an initial specification and requirements from an existing codebase, then connect them to that repository's own tests. Use when adopting the specs method in an established repository.
license: MIT
metadata:
  specs-version: "2"
---

# Extract specs from an existing codebase

Use `specs-init` to add the marker and indexes first. Extract one coherent area
at a time; a repository does not need a complete specification before the first
useful change.

## 1. Select a bounded area

Choose a public behavior or module with existing users or tests. Record which
files, commands, APIs, and tests belong to it. Read repository instructions,
design documents, ADRs, user-facing docs, tests, and implementation. Treat each
as evidence of current behavior, not as automatic authority for intended
behavior.

## 2. Resolve the contract

List the behavior sources agree on and the points where they conflict. Ask the
user to resolve material conflicts or missing intent before treating an observed
behavior as normative. Do not turn an apparent bug into a guarantee just because
the current code or test contains it.

## 3. Write the first slice

- Follow the `specs` skill to create a focused chapter describing the intended
  contract. Add it to the specifications index.
- Follow the `requirements` skill to add narrow, testable requirements with
  `spec_ref` links to that chapter. Add them to the requirements index.
- Keep uncertainty and uncovered areas visible. Leave them for later slices
  instead of inventing requirements to make the inventory look complete.

## 4. Connect local tests

Find the repository's ordinary unit or other local tests for each requirement.
Add `req:{id}` to the relevant test names or nearby comments, and inspect the
assertions to make sure they test the requirement. Add or update tests in that
repository's framework for missing coverage; do not add a specs test runner. Run
the normal local test suite and report results and remaining gaps, following the
`specs-verify` skill.

## 5. Review the slice

Show the user the proposed chapter, requirements, test mapping, conflicts
resolved, and areas deferred. Continue with another slice when useful. A
repository can adopt the method incrementally while preserving the authority
order: specifications, requirements, tests, implementation.
