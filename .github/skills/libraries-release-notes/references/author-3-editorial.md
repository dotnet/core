# Editorial Rules

## Benchmarks

- Use **exact data** from PR descriptions — never round, approximate, or paraphrase performance numbers.
- State the benchmark scenarios (what was measured, what hardware, what workloads).
- Report speedup ranges (e.g. "2.4–3.9x faster on Windows, 1.6–4.7x on Linux").
- Include specific before/after measurements when they tell a compelling story (e.g. "dropped from 48.0 ns to 12.2 ns").
- Do **not** embed full BenchmarkDotNet tables in the release notes — summarize in prose.
- If the user asks for exact tables, pull them verbatim from the PR body. Never reconstruct or approximate.

## Attribution

- **Community contributors**: If the PR author is not a Microsoft employee or a bot, cite them: `contributed by community member @handle`.
- **Copilot-authored PRs**: The PR author will be `Copilot` (bot). Do not credit Copilot. Cite the assignee who merged it if attribution is needed.
- **Microsoft employees**: No special attribution needed — they are implied.
- When in doubt, check the PR author's GitHub profile or the `author_association` field (`MEMBER` = Microsoft, `CONTRIBUTOR`/`NONE` = community).

## Entry Naming

- Prefer a **brief description** of what the feature does over simply stating the API name. The heading should help a reader understand the value at a glance.
  - ✅ `## Support for Zstandard compression`
  - ✅ `## Faster time zone conversions`
  - ✅ `## Dictionary expression support for immutable and frozen collections`
  - ❌ `## ZstandardStream`
  - ❌ `## TimeZoneInfo performance`
  - ❌ `## ImmutableDictionary.CreateRange`
- Keep headings concise — aim for 3–8 words.
- Include the API or type name in the body text, not necessarily in the heading.

## Feature Ranking

Order features by **customer impact**, using both qualitative "wow" factor and quantitative popularity signals. Promote entries that affect popular, widely-used libraries; move niche or specialized scenarios lower.

**Primary ordering criteria** (biggest impact first):
1. Major new capabilities for popular libraries (new types, new compression algorithms, new protocol support) — especially those with high reaction counts on the backing issue or PR
2. Performance improvements with dramatic numbers in widely-used APIs (e.g. `DateTime.Now`, `HttpClient`, `JsonSerializer`)
3. New API surfaces on popular existing types, prioritized by combined PR + issue reaction count
4. Improvements to less-common or specialized libraries (e.g. `System.Reflection.Emit`, `System.Formats.Tar`)
5. Small additions and fixes

**Popularity signals** (gathered in Step 5):
- **Reaction counts**: PRs and issues with many 👍, ❤️, or 🚀 reactions indicate strong community demand. Use the combined reaction count across the PR and its linked issues as a tiebreaker within each tier.
- **Linked issue upvotes**: An `api-approved` issue with 50+ reactions is a stronger signal than one with 2.
- **Library popularity**: Changes to `System.Text.Json`, `System.Net.Http`, `System.Collections`, `System.IO`, and `System.Threading` affect more users than changes to narrower namespaces. When two entries are otherwise similar in impact, prefer the one in the more widely-used library.

## Inclusion Criteria

Include a feature if it meets ANY of:
- Introduces a new public type or namespace
- Adds significant new API surface (3+ new methods) to an existing type
- Has benchmark data showing ≥20% improvement in a common scenario
- Enables a scenario that was previously impossible or required workarounds
- Was a highly-requested community feature (check linked issues for upvote counts)

Exclude:
- Internal refactoring with no public API change
- Test-only changes
- Build/infrastructure changes
- Backports from servicing branches
- Single-line fixes unless they unblock a major scenario
