---
name: libraries-release-notes
description: Generate .NET Libraries release notes by evaluating the release's API diff, fetching merged PRs from a GitHub repository, categorizing by area or theme, and producing formatted markdown with exact benchmark data and code examples.
disable-model-invocation: true
argument-hint: "[owner/repo]"
---

# Release Notes Generator

Generate .NET Libraries release notes for a given release.

## Inputs

If `$ARGUMENTS` is provided, use `$0` as the repository. Otherwise ask the user for:
1. **Repository** — GitHub `owner/repo` to pull PRs from (e.g. `dotnet/runtime`)

Then ask for:
2. **Preview name** (e.g. ".NET 11 Preview 1")
3. **Date range** — ask for the start and end dates separately using the .NET release calendar's "Code complete" milestones:
   - **Start date**: Ask for the Code Complete date of the *previous* release. For example, when generating .NET 11 Preview 2 notes, ask: *"What is the Code Complete date for .NET 11 Preview 1? (ISO 8601, e.g. 2026-01-27)"*. When generating **Preview 1** notes, ask for the *previous major version's* RC1 Code Complete date instead (e.g. *"What is the Code Complete date for .NET 10 RC1?"*), since that is when the vNext fork occurs. Reassure the user that anything already covered in the prior version's RC1, RC2, or GA release notes will be de-duplicated in the [verify scope](references/verify-1-dedupe.md) step.
   - **End date**: Ask for the Code Complete date of the *current* release. For example: *"What is the Code Complete date for .NET 11 Preview 1?"*
4. **Output file** — path for the release notes markdown (default: `release-notes/11.0/preview/preview1/libraries.md`)

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
