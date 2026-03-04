# Editorial Rules

## Tone

- Maintain a **positive tone** — highlight new benefits rather than expressing prior shortcomings
  - ✅ `ProcessExitStatus provides a unified representation of how a process terminated.`
  - ✅ `The new overloads extend TarFile.CreateFromDirectory to support all four tar formats.`
- When context about the prior state is needed, keep it brief and factual — one clause, not a paragraph — then pivot immediately to the new capability

## Benchmarks

- Use **exact data** from PR descriptions — never round, approximate, or paraphrase performance numbers
- State the benchmark scenarios (what was measured, what hardware, what workloads)
- Report speedup ranges only when the PR provides them explicitly and with sufficient context to make an accurate claim — do not extrapolate or generalize from partial data
- Include specific before/after measurements when they tell a compelling story (e.g. "dropped from 48.0 ns to 12.2 ns")
- Do **not** embed full BenchmarkDotNet tables in the release notes — summarize in prose
- If the user asks for exact tables, pull them verbatim from the PR body. Never reconstruct or approximate

## Entry naming

- Prefer a **brief description** of what the feature does over simply stating the API name. The heading should help a reader understand the value at a glance
  - ✅ `## Support for Zstandard compression`
  - ✅ `## Faster time zone conversions`
  - ✅ `## Dictionary expression support for immutable and frozen collections`
  - ❌ `## ZstandardStream`
  - ❌ `## TimeZoneInfo performance`
  - ❌ `## ImmutableDictionary.CreateRange`
- Keep headings concise — aim for 3–8 words
- Include the API or type name in the body text, not necessarily in the heading

## Feature ranking

Order features by **customer impact**, using both qualitative "wow" factor and quantitative popularity signals. Promote entries that affect popular, widely-used areas; move niche or specialized scenarios lower.

**Primary ordering criteria** (biggest impact first):
1. Major new capabilities — especially those with high reaction counts on the backing issue or PR
2. Meaningful improvements to existing capabilities (performance, reliability, usability)
3. Smaller additions and fixes that round out the release

**Popularity signals:**
- **Reaction counts**: PRs and issues with many 👍, ❤️, or 🚀 reactions indicate strong community demand. Use the combined reaction count across the PR and its linked issues as a tiebreaker within each tier
- **Linked issue upvotes**: An issue with 50+ reactions is a stronger signal than one with 2

## Community contributors

Use the `community-contribution` label (or equivalent team-specific label) to identify PRs from external contributors.

### Inline attribution

When a documented feature was contributed by a community member, thank them inline at the end of that feature's section:

```markdown
Thank you [@username](https://github.com/username) for this contribution!
```

### Community contributors section

Include a "Community contributors" section at the bottom of the release notes listing ALL external contributors for the release — not just those who contributed documented features. This includes contributors whose PRs were bug fixes, test improvements, or other changes not covered in the release notes.

To build this list, search for all merged PRs with the `community-contribution` label within the release's date range (or milestone, per the team context). List contributors alphabetically with links to their relevant PRs:

```markdown
## Community contributors

Thank you contributors! ❤️

- [@username](https://github.com/<owner>/<repo>/pulls?q=is%3Apr+is%3Amerged+<query>+author%3Ausername)
```

The link query format depends on the team context (e.g., milestone-based for ASP.NET Core, date-range-based for Libraries).

## Inclusion criteria

Include a feature if it gives users something new to try, something that works better, or something they asked for. Good signals:
- New capabilities users can take advantage of
- Measurable improvements to performance, reliability, or usability
- High community demand (reaction counts on backing issues)
- Behavior changes users need to be aware of

Exclude:
- Internal refactoring with no user-facing change
- Test-only changes
- Build/infrastructure changes
- Backports from servicing branches
