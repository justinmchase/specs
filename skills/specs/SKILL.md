---
name: specs
description: Write and maintain a repository's specifications under the specs method. Use when a repository has an .agents/SPECS file and you are creating or editing its specification chapters, or making a behavior change that the specification should cover.
license: MIT
metadata:
  specs-version: "1"
---

# Specifications

The repository follows the specs method
(<https://github.com/justinmchase/specs>), version 1. Its `.agents/SPECS` file
says so, and says where the specifications live: `.agents/specifications/`
unless a `specifications:` line in that file names another directory.

## The layers and their authority

From most to least authoritative:

1. **Specifications**: the normative contract.
2. **Requirements**: narrow, testable statements that refine the specification.
   Use the `requirements` skill to write them.
3. **Tests**: they cite the requirements they verify.
4. **Implementation**.

When layers disagree, the higher one is correct until someone deliberately
changes it. Never edit a test or the code so that it contradicts a requirement
or the specification. If what you've been asked to do conflicts with the
specification, stop and ask whether the specification should change.

## Change control

- A behavior change updates the specification or requirement that covers it in
  the same change (the same pull request) as the code.
- If no chapter covers the behavior, that's a gap in the specification. Add the
  missing text rather than working around its silence.
- Specifications change rarely and deliberately. Put acceptance detail in
  requirements, not in chapters.

## Layout

```text
.agents/specifications/
  README.md              the index: what the chapters are and how they're organized
  {topic}.spec.md        one concern per chapter, kebab-case
  {topic}/
    {subtopic}.spec.md   indexed from {topic}.spec.md
```

- Keep the README index up to date when you add a chapter.
- Prefer a new small chapter over growing an existing one into a catch-all.
- Link related chapters to each other.

## Writing a chapter

- Start with one or two sentences stating the chapter's scope.
- Write normatively, like a focused RFC. If you use MUST, SHOULD, MAY and their
  negations, add a Conventions section:

  ```markdown
  ## Conventions

  The key words MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are to be interpreted
  as described in RFC 2119 and RFC 8174 when, and only when, they appear in all
  capitals.
  ```

- Stay at the level of the contract: what is guaranteed, the invariants, and how
  parts compose. Leave out implementation detail.
- Call out open questions explicitly instead of implying they're decided.
- Headings are anchors that requirements cite (`file.spec.md#heading-slug`).
  When you rename or remove a heading, update the requirements that cite it.

## Rigorous chapters

For a mechanism where a wrong design risks incorrect results, non-termination,
or worse complexity than intended (caching, recursion, error recovery,
concurrency, incremental updates), use these sections in order:

1. **Definitions**: name the concepts precisely before using them.
2. **Axioms**: invariants that hold whatever the design, as flat facts.
3. **Constraints**: properties the mechanism must satisfy, derived from the
   axioms and the goals. Group them when there are many.
4. **Mechanism**: the design, and how it composes with the rest.
5. **Why this design**: for each non-obvious part, why a simpler alternative
   doesn't work.

Keep it proportional. Routine chapters don't need this structure.

## Checking your work

Run the audit (the `specs-audit` skill) after changing chapters. It reports
requirements whose `spec_ref` points at a heading that no longer exists.

The full method is defined at
<https://github.com/justinmchase/specs/tree/v1/.agents/specifications>.
