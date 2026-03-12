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
- **Reaction counts**: Use the combined reaction count across the PR and its linked issues as a tiebreaker within each tier. As a rough guide:
  - **50+ combined reactions** — strong community demand; promote toward the top of the release notes
  - **10–49 reactions** — moderate interest; a useful signal but not decisive on its own
  - **Under 10 reactions** — weak signal; rank primarily by qualitative impact instead
- **Linked issue upvotes**: An issue with 50+ reactions is a stronger signal than one with 2 — check the linked issue, not just the PR, since community members upvote issues more often than PRs

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

### Preview-to-preview feedback fixes

Bug fixes are generally excluded from release notes — fixing existing functionality is assumed. However, **preview-to-preview feedback fixes** are an important exception. These are changes made in response to community feedback on a previous preview, and they demonstrate that the preview process is working as intended.

**Include a bug fix or behavior change when ALL of these apply:**

1. **Preview-era issue** — the linked issue was created *after* the previous preview shipped (within the current release's preview cycle)
2. **Community-reported** — the issue was filed by someone outside the team (not the PR author or a regular contributor to the repo)
3. **Responsive fix** — a PR in the current preview directly addresses the reported issue

**Prioritization signals** (more signal = more noteworthy):

- **Reaction count on the issue** — an issue with many 👍 or other reactions indicates broad community impact
- **Comment activity** — issues with substantive discussion (not just "+1" comments) suggest the problem was significant
- **Multiple reporters** — if several issues report the same underlying problem, consolidate and note the breadth of feedback
- **Behavioral change** — fixes that change an API's behavior, defaults, or error handling based on feedback are especially worth calling out, since users who adopted the previous preview behavior need to know

**How to write these entries:**

- Frame them positively — "Based on community feedback, X now does Y" — not as admissions of mistakes
- Credit the reporter with a link to the issue
- Briefly describe what changed and why, so users on the previous preview know what to expect

Exclude:
- Internal refactoring with no user-facing change
- Test-only changes
- Build/infrastructure changes
- Backports from servicing branches

### Bug fix summary

Bug fixes excluded from individual feature entries still deserve acknowledgment — they represent real quality improvements and often address issues reported by community members. Include a **"Bug fixes"** section after all feature entries (but before "Community contributors") that briefly lists the areas that received fixes.

**How to build the summary:**

1. Collect all candidate PRs that were excluded from feature entries because they are bug fixes, correctness improvements, or quality changes without new API surface.
2. Group them by area using the team context's grouping strategy (see below).
3. For each area, list the fixes. If any fix has a **community-reported backing issue** (the linked issue was filed by someone outside the team), call it out — this signals that the team is responsive to community feedback.

**Grouping strategy:**

The bug fix section uses a **nested list** — top-level bullets are area groups, with individual fixes as indented sub-bullets. How fixes are grouped depends on the team context:

- **Default**: Group by namespace or component (e.g., "System.Net.Http", "System.Collections"). Multiple fixes in the same namespace share a single top-level bullet.
- Team contexts can override the grouping strategy (e.g., by product area like "Blazor", "Kestrel") — see the team context file for details.

**Format:**

```markdown
## Bug fixes

This release includes bug fixes and quality improvements across several areas:

- **System.Net.Http**
  - Fixed authenticated proxy credential handling ([dotnet/runtime#123363](https://github.com/dotnet/runtime/issues/123363), reported by [@username](https://github.com/username))
  - Fixed edge-case non-ASCII host handling in HTTP logic ([dotnet/runtime#123934](https://github.com/dotnet/runtime/pull/123934))
- **System.Collections**
  - Fixed integer overflow in `ImmutableArray` range validation ([dotnet/runtime#124042](https://github.com/dotnet/runtime/pull/124042))
- **System.Xml**
  - Fixed `XDocument.LoadAsync` to avoid synchronous reads
```

Each area is a top-level bold bullet, with every fix as an indented sub-bullet — even if there is only one fix in that area.

**Rules:**

- Area name in bold at the top level
- Brief description of what was fixed, with PR link
- When a fix has a community-reported backing issue, include a link to the issue and credit the reporter inline
- Order areas alphabetically for consistency
- Do not include test-only, CI, doc-only, or infra changes — only fixes that improve user-facing behavior or correctness
- This section does NOT appear in the TOC — it's a lightweight summary, not a feature entry

### Partial features and building blocks

Some PRs contribute to a broader initiative where the full feature spans multiple previews. These still deserve coverage when they're independently useful — **err on the side of including** a feature if it's questionable. However, watch for building blocks that have no standalone value yet.

**Warning signs to investigate** (none of these alone means "exclude" — use them to trigger closer inspection):

1. **No meaningful code sample** — if you cannot write a code sample where a user does something useful with the feature, it's likely not independently usable yet. The [code sample validation step](validate-samples.md) is the final safety net, but check proactively during categorization.
2. **PR says "Contributes to" rather than "Fixes"** — this indicates the PR is one piece of a larger effort. Check the parent issue to see how much of the full API surface has shipped versus what's still pending. Many usable features "contribute to" a broad epic — this is a signal to investigate, not to exclude.
3. **No independent utility** — the change only becomes useful in combination with other changes that haven't shipped yet. Ask: can a user benefit from this change on its own, or does it require an unshipped API, configuration surface, or integration point to be meaningful?
4. **Release notes text says "upcoming" or "future"** — if the entry has to refer to planned-but-unshipped APIs to explain the feature's value, the feature may not be self-contained enough to document on its own.

**The key question is always: can a user try this today?** If yes, include it — even if it's part of a larger initiative. When a feature IS part of a broader effort, note that context so readers understand the bigger picture (e.g., "This is part of the new ChildProcess API initiative; additional capabilities will follow in future previews.").

**When a building block genuinely has no standalone value:**

- If the parent initiative has a section in the release notes, mention the building blocks briefly as foundational work without giving them their own subsection.
- If no broader context exists, omit them entirely — they'll be covered when the full feature ships.
- When in doubt, include it with appropriate context rather than omitting it.
