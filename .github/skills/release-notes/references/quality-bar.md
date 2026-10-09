# Quality Bar

What good .NET release notes look like. This is the north star — when in doubt, refer back here.

## Two outputs, two standards

### changes.json — comprehensive and mechanical

Every PR that shipped gets an entry. No editorial judgment — if the `release-notes generate changes` tool found it in the source-manifest diff, it goes in. This is the machine-readable record of what shipped.

Quality criteria:

- **Complete** — every merged PR in the commit range is represented
- **Accurate** — PR numbers, titles, URLs, and commit hashes are correct
- **Classified** — `product` and `package` fields are populated where applicable
- **Joinable** — commit keys match the format used in `cve.json` for cross-file queries

### Markdown release notes — curated and editorial

Not every PR deserves a writeup. The markdown covers features users will care about.

Quality criteria:

- **High fidelity** — claims of new availability trace to this release's manifest and build
- **High value** — focused on what matters, not exhaustive
- **Useful** — a developer can read a section and start using the feature
- **Honest** — concrete benefits, no exaggeration, no invented benchmarks

## What to include in markdown

Include a feature if it gives users something **new to try**, something that **works better**, or something they **asked for**:

- New capabilities users can take advantage of
- Measurable improvements to performance, reliability, or usability
- High community demand (reaction counts on backing issues/PRs)
- Behavior changes users need to be aware of
- Preview-to-preview fixes for community-reported issues
- Features that most readers can immediately understand the value of

Apply the shared **80/20 audience filter** from
[`../../editorial-scoring/SKILL.md`](../../editorial-scoring/SKILL.md):
prioritize features most readers can immediately understand, and keep narrower
items only when the broader audience can still appreciate why they matter.

State the intended audience prominently, including features that serve library authors first.
Shipped compiler or runtime foundations can merit a headline before a stock-library integration or builder ships.
Explain the real supported capability, test-only or hypothetical integrations, and unchanged stock behavior separately.
Do not promise future shipping or performance.

## What to exclude from markdown

- Internal refactoring with no user-facing change
- Test-only changes
- Build/infrastructure changes
- Backports from servicing branches
- Claimed capabilities that require unshipped APIs, rather than useful shipped foundations
- Claims of newly shipped changes absent from this milestone's `changes.json`
- Anything that reads like unexplained engineering jargon to most readers

## The fidelity rule

**Every claim of a new change must trace to this milestone's `changes.json`.**

The `changes.json` file is generated from the VMR's `source-manifest.json` diff — it reflects exactly what code moved between release points. This is the single source of truth. Don't document features based on PR titles alone, roadmap promises, or what "should" ship. Only document what the tool confirms actually shipped.

Discover omissions against the exact pinned changes, implementation, and tests, not only the draft or titles.
Read prior component announcements to distinguish new deltas from previously announced, unchanged material.

Explicitly requested catch-up coverage can describe earlier-shipped, unannounced capabilities.
State their actual availability and verify their original shipped provenance and current support.
Do not add them as new entries in this milestone's `changes.json` or `features.json`.
An explicitly approved full-cycle report must identify its broader baseline, not imply that all changes shipped in this milestone.

## Every feature entry needs WHY and HOW

A release note that just names a feature is useless. Every entry must answer:

1. **Why does this matter?** — what problem does it solve, what scenario does it enable?
2. **How do I use it?** — a substantial supported scenario, setup, or representative measurement

When relevant, add a **familiar comparison** to help the reader place the feature quickly. If a new CLI workflow resembles something people already know from another tool, say that briefly. For example, `dotnet run -e FOO=BAR` can be framed as Docker-style environment-variable injection for local runs. Use comparisons to clarify, not to imply exact parity.

Use meaningful source-test scenarios, not a tiny syntax demonstration, when showing a capability.
For default-enabled or grouped performance improvements, explain adoption and measured workloads instead of forcing a code sample per change.

## Verify before you write

**Never guess API names.** Before writing about any type, method, property, or enum value, verify it exists using `dotnet-inspect`. See [api-verification.md](api-verification.md) for the workflow.

An incorrect type name in release notes is worse than a placeholder. It teaches developers something wrong and erodes trust. When you can't verify an API:

- Use a `<!-- TODO: verify type name -->` placeholder
- Describe the feature in prose without naming specific types
- Link to the PR and let the reader find the API themselves

This applies to code samples too. A fabricated code sample that uses invented types is harmful — it looks authoritative but won't compile.

Check test conditions and expected outcomes. Negative tests, skipped cases, or unmet conditions do not prove successful runtime support.
Run documented behavior against the milestone build through [`validate-code-samples`](../../validate-code-samples/SKILL.md).
Temporary validation does not authorize committed fixtures. Follow that skill's scope rules.

## Tone

- Positive — highlight what's new, don't dwell on what was missing
- Direct — concise context, then a useful scenario or measurement
- Precise — source-backed measurements and accurate summaries, following [the benchmark rules](editorial-rules.md#benchmarks)
- Respectful of reader time — concise descriptions, no padding
