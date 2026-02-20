---
name: libraries-release-notes
description: Generate .NET Libraries release notes by evaluating the release's API diff, fetching merged PRs from a GitHub repository, categorizing by area or theme, and producing formatted markdown with exact benchmark data and code examples.
disable-model-invocation: true
argument-hint: "[owner/repo]"
---

# Release Notes Generator

Generate .NET Libraries release notes for a given release.

## Execution guidelines

- **Do not write intermediate files to disk.** Use the **SQL tool** for structured storage and querying (see [data-2-collect-prs.md](references/data-2-collect-prs.md) for schema).
- **Do not run linters, formatters, or validators.** Do not run markdownlint, prettier, link checkers, or any other validation tool on the output. The only output of this skill is the release notes markdown file itself.
- **Maximize parallel tool calls.** Fetch multiple PR and issue details in a single response to minimize round trips.

## Process

1. **[Process Inputs and Validate Readiness](references/process-inputs.md)** — collect inputs and verify API diffs are available.
2. **Data pipeline** — gather the changes included in the release:
   1. [Analyze the API diff](references/data-1-apidiff-review.md)
   2. [Collect and filter PRs](references/data-2-collect-prs.md)
   3. [Enrich — fetch PR and issue details](references/data-3-enrich.md)
3. **Verify scope** — validate the candidate list:
   1. [Deduplicate from previous release notes](references/verify-1-dedupe.md)
   2. [Confirm inclusion in release branch](references/verify-2-release.md)
4. **Author content** — write the release notes:
   1. [Categorize entries by area, theme, and impact](references/author-1-entries.md)
   2. [Apply formatting rules](references/author-2-format.md)
   3. [Apply editorial rules](references/author-3-editorial.md)
5. **[Suggest reviewers](references/suggest-reviewers.md)** — gather authors, coauthors, assignees, and mergers from candidate PRs and present suggested reviewers grouped by area.
6. Confirm feature list and suggested reviewers with the user before finalizing.
