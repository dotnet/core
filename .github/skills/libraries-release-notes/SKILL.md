---
name: libraries-release-notes
description: Generate library preview release notes by fetching merged PRs from a GitHub repository, categorizing by impact, and producing formatted markdown with exact benchmark data and code examples.
disable-model-invocation: true
argument-hint: "[owner/repo]"
---

# Release Notes Generator

Generate library release notes for a given preview period.

## Inputs

If `$ARGUMENTS` is provided, use `$0` as the repository. Otherwise ask the user for:
1. **Repository** — GitHub `owner/repo` to pull PRs from (e.g. `dotnet/runtime`)

Then ask for:
2. **Preview name** (e.g. ".NET 11 Preview 1")
3. **Date range** — start and end dates for merged PRs (ISO 8601, e.g. `2025-10-01..2026-02-01`)
4. **Output file** — path for the release notes markdown (default: `release-notes/11.0/preview/preview1/libraries.md`)

## Process

1. Follow the [data pipeline](references/workflow.md) to fetch, cache, and filter PRs.
2. Follow the [formatting rules](references/format-template.md) to write the document.
3. Follow the [editorial rules](references/editorial-rules.md) for benchmarks, attribution, and ranking.
4. Confirm feature list with the user before finalizing.
