---
name: specs-verify
description: Verify a repository's specifications and requirements using its own local tests. Use after changing specifications, requirements, or tests, or when asked to check traceability.
license: MIT
metadata:
  specs-version: "1"
---

# Verify with local tests

The adopting repository's tests verify its requirements. This skill is agent
guidance, not a tool or a test runner supplied by the specs plugin.

## Find the repository's checks

1. Read `.agents/SPECS` for the specifications, requirements, and optional test
   locations. Read repository instructions and test configuration to identify
   the normal unit or local test commands. Do not assume Deno or any particular
   language.
2. Read the changed specification sections and requirements. Follow each
   requirement's `spec_ref` to the chapter and heading it refines.
3. Find tests citing each requirement with `req:{id}`. Inspect the assertions: a
   citation is useful only when the test actually checks that behavior.

## Repair the trace

- If a requirement has no verifying test, add or adapt one in the repository's
  own test framework. Cite its id in the test name or a nearby test comment.
- If a test cites an unknown id, correct the citation or write the missing
  requirement after checking the specification. Never make a test pass by
  silently weakening a higher layer.
- If a chapter heading or requirement id changes, update its references in the
  same change. Inspect for duplicate ids, missing front matter, and unresolved
  `spec_ref` paths and headings.
- If existing tests and the specification disagree, stop and ask which behavior
  is intended before changing the higher layer.

## Run and report

Run the repository's normal local test command, including the tests you added or
changed. Report the command, result, uncovered requirements, and any checks you
could not run. A passing suite supports only the behavior its tests exercise;
describe remaining coverage gaps explicitly.
