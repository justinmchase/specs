# Traceability

How requirements cite specifications, how tests cite requirements, and what an
audit of a repository checks.

## Conventions

The key words MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are to be interpreted
as described in RFC 2119 and RFC 8174 when, and only when, they appear in all
capitals.

## Spec references

- A requirement's `spec_ref` MUST be either a string or a list of strings. A
  string MAY hold several references separated by `;`.
- Each reference MUST be `{path}` or `{path}#{anchor}`, where `{path}` is
  relative to the repository root and names a chapter inside the specifications
  directory.
- An `{anchor}` MUST be the GitHub-style slug of a heading in that chapter: the
  heading text lowercased, with characters other than letters, digits, spaces,
  `-`, and `_` removed, and spaces replaced by `-`. A repeated slug in the same
  chapter gets `-1`, `-2`, and so on.
- A requirement SHOULD reference a section rather than a whole chapter.

## Test references

- A test MUST cite each requirement it verifies with the token `req:{id}`,
  typically at the start of the test's name, for example
  `req:cli-run-003 - run reads --input as text`.
- Every `req:{id}` token in a test file MUST name an existing requirement.
- Every requirement SHOULD be cited by at least one test.

## Audit

An audit checks a repository against this method. It reports each finding as an
error or a warning.

Errors:

- The marker is missing or malformed, names a major version the audit does not
  implement, or repeats a key.
- The specifications or requirements directory does not exist, or the
  specifications directory has no `README.md`.
- A requirement document has no front matter, or is missing `id`, `title`, or
  `spec_ref`.
- Two requirement documents share an `id`.
- A spec reference names a file that does not exist or is outside the
  specifications directory, or an anchor that is not a heading in it.
- A test cites a requirement that does not exist.

Warnings:

- The marker has a key the audit does not know.
- A requirement is not cited by any test.

An audit MUST exit with a failure status when it finds an error. In strict mode
it MUST also fail when it finds a warning.
