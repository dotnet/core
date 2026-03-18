# Editorial Rules

## Tone

- Maintain a **positive tone** — highlight new benefits rather than expressing prior shortcomings
  - ✅ `ProcessExitStatus provides a unified representation of how a process terminated.`
  - ✅ `The new overloads extend TarFile.CreateFromDirectory to support all four tar formats.`
- When context about the prior state is needed, keep it brief and factual — one clause, not a paragraph — then pivot immediately to the new capability

## Benchmarks

- Use **exact data** from PR descriptions — never round, approximate, or paraphrase performance numbers
- State the benchmark scenarios (what was measured, what hardware, what workloads)
- Report speedup ranges only when the PR provides them explicitly and with sufficient context
- Include specific before/after measurements when they tell a compelling story (e.g., "dropped from 48.0 ns to 12.2 ns")
- Do **not** embed full BenchmarkDotNet tables — summarize in prose
- If the user asks for exact tables, pull them verbatim from the PR body

## Entry naming

- Prefer a **brief description** of what the feature does over simply stating the API name
  - ✅ `## Support for Zstandard compression`
  - ✅ `## Faster time zone conversions`
  - ❌ `## ZstandardStream`
  - ❌ `## TimeZoneInfo performance`
- Keep headings concise — 3–8 words
- Include the API or type name in the body text, not necessarily in the heading

## Feature ranking

Order features by **customer impact**, using qualitative "wow" factor and quantitative popularity signals. Promote entries affecting popular, widely-used areas; move niche scenarios lower.

**Primary ordering** (biggest impact first):
1. Major new capabilities — especially those with high reaction counts
2. Meaningful improvements to existing capabilities (performance, reliability, usability)
3. Smaller additions and fixes

**Popularity signals:**
- **50+ combined reactions** (PR + linked issues) — strong community demand; promote toward top
- **10–49 reactions** — moderate interest; useful signal but not decisive alone
- **Under 10 reactions** — rank primarily by qualitative impact

## Community contributors

Use the `community-contribution` label (or team-specific equivalent) to identify PRs from external contributors.

### Inline attribution

When a documented feature was contributed by a community member, thank them inline:

```markdown
Thank you [@username](https://github.com/username) for this contribution!
```

### Community contributors section

Include a "Community contributors" section at the bottom of each component's release notes listing ALL external contributors for that component — not just those who contributed documented features.

Search for all merged PRs with the `community-contribution` label within the release date range (or milestone per team context). List contributors alphabetically:

```markdown
## Community contributors

Thank you contributors! ❤️

- [@username](https://github.com/<owner>/<repo>/pulls?q=is%3Apr+is%3Amerged+<query>+author%3Ausername)
```

## Inclusion criteria

Include a feature if it gives users something new to try, something that works better, or something they asked for:

- New capabilities users can take advantage of
- Measurable improvements to performance, reliability, or usability
- High community demand (reaction counts on backing issues)
- Behavior changes users need to be aware of

### Preview-to-preview feedback fixes

**Include a bug fix or behavior change when ALL of these apply:**

1. **Preview-era issue** — linked issue created *after* the previous preview shipped
2. **Community-reported** — filed by someone outside the team
3. **Responsive fix** — a PR in the current preview directly addresses it

**Prioritization signals:**

- **Reaction count on the issue** — many 👍 indicates broad impact
- **Comment activity** — substantive discussion suggests significance
- **Multiple reporters** — consolidate and note breadth
- **Behavioral change** — changes to API behavior, defaults, or error handling are especially worth calling out

**How to write these entries:**
- Frame positively — "Based on community feedback, X now does Y"
- Credit the reporter with a link to the issue
- Describe what changed and why

### Exclude

- Internal refactoring with no user-facing change
- Test-only changes
- Build/infrastructure changes
- Backports from servicing branches

### Bug fix summary

Include a **"Bug fixes"** section after feature entries (but before "Community contributors") that lists areas receiving fixes. Use a **nested list** — top-level bullets are area groups, individual fixes as sub-bullets.

How fixes are grouped depends on the team context:
- **Default**: Group by namespace or component (e.g., "System.Net.Http", "System.Collections")
- Team contexts can override grouping (e.g., by product area like "Blazor", "Kestrel")

```markdown
## Bug fixes

This release includes bug fixes and quality improvements across several areas:

- **System.Net.Http**
  - Fixed authenticated proxy credential handling ([dotnet/runtime#123363](https://github.com/dotnet/runtime/issues/123363), reported by [@username](https://github.com/username))
  - Fixed edge-case non-ASCII host handling ([dotnet/runtime#123934](https://github.com/dotnet/runtime/pull/123934))
- **System.Collections**
  - Fixed integer overflow in `ImmutableArray` range validation ([dotnet/runtime#124042](https://github.com/dotnet/runtime/pull/124042))
```

Each area is a top-level bold bullet with every fix as an indented sub-bullet. Do not include test-only, CI, doc-only, or infra changes. This section does NOT appear in the TOC.

### Partial features and building blocks

Some PRs contribute to broader initiatives spanning multiple previews. Include them when they are independently useful — **err on the side of including**.

**Warning signs to investigate** (signals to look closer, not to exclude):

1. **No meaningful code sample** — the [validation step](validate-samples.md) is the final safety net, but check proactively
2. **PR says "Contributes to" rather than "Fixes"** — check the parent issue for overall progress
3. **No independent utility** — the change only becomes useful with unshipped APIs
4. **Text says "upcoming" or "future"** — may not be self-contained

**The key question: can a user try this today?** If yes, include it. When it is part of a larger effort, note the context.
