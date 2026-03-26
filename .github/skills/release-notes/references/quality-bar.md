# Quality Bar

What good .NET release notes look like. This is the north star — when in doubt, refer back here.

## Two outputs, two standards

### changes.json — comprehensive and mechanical

Every PR that shipped gets an entry. No editorial judgment — if the `dotnet-release generate changes` tool found it in the source-manifest diff, it goes in. This is the machine-readable record of what shipped.

Quality criteria:

- **Complete** — every merged PR in the commit range is represented
- **Accurate** — PR numbers, titles, URLs, and commit hashes are correct
- **Classified** — `product` and `package` fields are populated where applicable
- **Joinable** — commit keys match the format used in `cve.json` for cross-file queries

### Markdown release notes — curated and editorial

Not every PR deserves a writeup. The markdown covers features users will care about.

Quality criteria:

- **High fidelity** — everything documented actually ships in this release
- **High value** — focused on what matters, not exhaustive
- **Useful** — a developer can read a section and start using the feature
- **Honest** — no marketing fluff, no exaggeration, no invented benchmarks

## What to include in markdown

Include a feature if it gives users something **new to try**, something that **works better**, or something they **asked for**:

- New capabilities users can take advantage of
- Measurable improvements to performance, reliability, or usability
- High community demand (reaction counts on backing issues/PRs)
- Behavior changes users need to be aware of
- Preview-to-preview fixes for community-reported issues

## What to exclude from markdown

- Internal refactoring with no user-facing change
- Test-only changes
- Build/infrastructure changes
- Backports from servicing branches
- Features that are not independently useful yet (still need unshipped APIs)
- Anything not confirmed by `changes.json` (i.e., not in the source-manifest diff)

## The fidelity rule

**If it's not in `changes.json`, don't write about it.**

The `changes.json` file is generated from the VMR's `source-manifest.json` diff — it reflects exactly what code moved between release points. This is the single source of truth. Don't document features based on PR titles alone, roadmap promises, or what "should" ship. Only document what the tool confirms actually shipped.

## Every feature entry needs WHY and HOW

A release note that just names a feature is useless. Every entry must answer:

1. **Why does this matter?** — what problem does it solve, what scenario does it enable?
2. **How do I use it?** — a code sample showing the feature in action

If you can't write a code sample for a feature, question whether it's user-facing enough for release notes.

## Tone

- Positive — highlight what's new, don't dwell on what was missing
- Direct — one paragraph of context, then show the code
- Precise — exact benchmark numbers only, never approximations
- Respectful of reader time — concise descriptions, no padding
