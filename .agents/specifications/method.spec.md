# Method

The layers of the specs method, which of them wins when they disagree, and how a
change moves through them.

## Conventions

The key words MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are to be interpreted
as described in RFC 2119 and RFC 8174 when, and only when, they appear in all
capitals.

## Layers

A repository that follows the method has four layers, from most to least
authoritative:

1. **Specifications**: the normative contract, written as focused chapters. A
   specification says what the system guarantees, not how it is built.
2. **Requirements**: narrow, testable statements, each refining one part of a
   specification and citing it.
3. **Tests**: executable checks, each citing the requirements it verifies.
4. **Implementation**: the code.

## Authority

- When two layers disagree, the more authoritative layer MUST be treated as
  correct until it is deliberately changed.
- A lower layer MUST NOT be silently reinterpreted to contradict a higher one.
  For example, a test MUST NOT be edited to accept behavior a requirement
  forbids.
- When a requested change conflicts with a specification or requirement, the
  person or agent making it MUST stop and ask whether the higher layer should
  change, rather than changing only the lower layers.

## Change control

- A change in behavior MUST update the specification or requirement that covers
  it in the same change (for example, the same pull request) as the
  implementation.
- A behavior that no specification or requirement covers is a gap in the
  specification, not a license. The change that introduces it SHOULD add the
  missing specification text or requirement.
- Specifications SHOULD change rarely and deliberately. Requirements change more
  often, as behavior is refined.

## Proportion

- The method SHOULD be applied in proportion to risk. A small chapter can cover
  routine behavior; mechanisms where a wrong design risks incorrect results,
  non-termination, or worse complexity deserve the fuller structure described in
  [layout](./layout.spec.md#rigorous-chapters).
