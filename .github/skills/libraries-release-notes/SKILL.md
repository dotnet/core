---
name: libraries-release-notes
description: Generate .NET Libraries release notes by evaluating the release's API diff, fetching merged PRs from a GitHub repository, categorizing by area or theme, and producing formatted markdown with exact benchmark data and code examples.
disable-model-invocation: true
argument-hint: "[owner/repo]"
---

# Release Notes Generator

Generate .NET Libraries release notes for a given release.

## Inputs

If `$ARGUMENTS` is provided, use `$0` as the repository. Otherwise ask the user for the **repository** (`owner/repo`, e.g. `dotnet/runtime`).

Collect inputs **one at a time** — ask a single question, wait for the answer, then ask the next. After each response, acknowledge what has been collected so far and ask for the next missing input:

1. **Preview name** (e.g. ".NET 11 Preview 2")
2. **Start date** — ask: *"What was the Code Complete date for the previous release, `<previous preview name>`?"* (ISO 8601). For **Preview 1**, this is the prior major version's RC1 Code Complete date (the vNext fork point); anything already covered in RC1/RC2/GA release notes will be de-duplicated in the [verify scope](references/verify-1-dedupe.md) step.
3. **End date** — ask: *"What was the Code Complete date for `<this preview name>`? (If it hasn't occurred yet, provide the expected date.)"* (ISO 8601)
4. **Output file** — path for the release notes markdown (default: `release-notes/<version>/preview/<preview>/libraries.md`)

Once all inputs are collected, **check for API diffs before proceeding** (see below), then start the data pipeline without further confirmation.

## Early API Diff Check

Before starting the data pipeline, verify that the required API diffs are present in the local repository clone. Check for both:

1. **Current release API diff** — e.g. `release-notes/<version>/preview/<preview>/api-diff/Microsoft.NETCore.App/`
2. **Previous release API diff** — e.g. `release-notes/<version>/preview/<previous-preview>/api-diff/Microsoft.NETCore.App/` (used during [deduplication](references/verify-1-dedupe.md) and cross-referencing)

If **either** API diff directory is missing or empty:

- **Warn the user immediately**, specifying which diff is missing and the expected path.
- Explain that the API diff significantly improves the quality of the release notes by enabling accurate cross-referencing of new APIs with implementing PRs.
- Ask whether to proceed without it or wait until the API diff is available.

Do not defer this check to the data pipeline — surface the warning as soon as inputs are collected so the user can decide early whether to generate the API diff first.

## Execution guidelines

- **Avoid large MCP responses.** GitHub MCP search tools that return large payloads get saved to temporary files on disk — reading those files back requires PowerShell commands that trigger approval prompts. Prevent this by keeping individual search result sets small:
  - Use **label-scoped searches** (e.g. `label:area-System.Text.Json`) instead of fetching all merged PRs at once. See [data-2-collect-prs.md](references/data-2-collect-prs.md) for the recommended approach.
  - Use `perPage: 30` or less for search queries. Only use `perPage: 100` for targeted queries that are expected to return few results.
  - If a search response is saved to a temp file anyway, use the `view` tool (with `view_range` for large files) to read it — **never** use PowerShell/shell commands to read or parse these files.
- **Do not write intermediate files to disk.** Use the **SQL tool** for structured storage and querying (see [workflow.md](references/workflow.md) for schema).
- **Do not use shell commands for data processing.** Filter and transform PR/issue data using the SQL tool or direct tool output — not PowerShell scripts that parse JSON files.
- **Do not run linters, formatters, or validators.** Do not run markdownlint, prettier, link checkers, or any other validation tool on the output. The only output of this skill is the release notes markdown file itself.
- **Maximize parallel tool calls.** Fetch multiple PR and issue details in a single response to minimize round trips.

## Process

1. **[Data pipeline](references/workflow.md)** — gather the changes included in the release:
   1. [Analyze the API diff](references/data-1-apidiff-review.md)
   2. [Collect and filter PRs](references/data-2-collect-prs.md)
   3. [Enrich — fetch PR and issue details](references/data-3-enrich.md)
2. **Verify scope** — validate the candidate list:
   1. [Deduplicate from previous release notes](references/verify-1-dedupe.md)
   2. [Confirm inclusion in release branch](references/verify-2-release.md)
3. **Author content** — write the release notes:
   1. [Categorize entries by area, theme, and impact](references/author-1-entries.md)
   2. [Apply formatting rules](references/author-2-format.md)
   3. [Apply editorial rules](references/author-3-editorial.md)
4. Confirm feature list with the user before finalizing.
