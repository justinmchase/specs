# Layout

Where specifications and requirements live, how they are organized, and how they
are written.

## Conventions

The key words MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are to be interpreted
as described in RFC 2119 and RFC 8174 when, and only when, they appear in all
capitals.

## Specifications

```text
<specifications>/
  README.md
  {topic}.spec.md
  {topic}/
    {subtopic}.spec.md
```

- The specifications directory MUST contain a `README.md` that indexes the
  chapters and explains how they are organized.
- Chapters MUST be named `{topic}.spec.md` in kebab-case, one concern (or a few
  tightly related concerns) per file.
- A topic with subtopics SHOULD index them from `{topic}.spec.md` and keep them
  in a `{topic}/` directory. A new concern SHOULD get a new small chapter rather
  than growing an existing one into a catch-all.
- Each chapter SHOULD begin with a short statement of its scope.
- Chapters SHOULD be written in a normative style, like a focused RFC. A chapter
  that uses RFC 2119 key words MUST include a short Conventions section that
  cites RFC 2119 and RFC 8174.
- Chapters SHOULD stay at the level of the contract: guarantees, invariants, and
  composition. Low-level acceptance detail belongs in requirements.
- Open questions SHOULD be called out explicitly rather than implied as decided.
- Related chapters SHOULD link to each other.

### Rigorous chapters

For a mechanism where a wrong design risks incorrect results, non-termination,
or a worse complexity class than intended, a chapter SHOULD use these sections,
in order:

1. **Definitions**: name the concepts precisely before using them.
2. **Axioms**: the invariants that hold whatever the design, stated as flat
   facts.
3. **Constraints**: the properties the mechanism must satisfy, derived from the
   axioms and the chapter's goals, grouped when there are many.
4. **Mechanism**: the design itself, and how it composes with the rest of the
   system.
5. **Why this design**: for each non-obvious part, a short note on why a simpler
   alternative does not work.

Routine chapters SHOULD NOT carry this structure.

## Requirements

```text
<requirements>/
  {topic}/
    {NNN}-{name}.requirement.md
```

- Requirement documents MUST be named `*.requirement.md`, one requirement per
  file. Topic folders SHOULD follow the specification's chapters.
- A requirement document MUST begin with YAML front matter containing:
  - `id`: a kebab-case identifier, unique across the repository. It SHOULD be
    `{topic}-{NNN}`, matching its folder and file number.
  - `title`: one line stating the behavior.
  - `spec_ref`: the specification sections it refines (see
    [traceability](./traceability.spec.md#spec-references)).
- An `id` MUST NOT be reused for a different requirement, even after the
  original is removed.
- The body SHOULD state the behavior in plain language under the headings
  Preconditions, Expected behavior, and Postconditions, using RFC 2119 key words
  for what is required.
- A requirement MUST be narrower and more directly testable than the
  specification text it refines.
