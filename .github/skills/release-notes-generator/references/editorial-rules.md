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

## Feature Ranking

Order features by **customer impact** ("wow" factor), biggest first:
1. Major new capabilities (new types, new compression algorithms, new protocol support)
2. Performance improvements with dramatic numbers
3. New API surfaces on existing types
4. Small additions and fixes

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
