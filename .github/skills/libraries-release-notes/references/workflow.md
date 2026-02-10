# Data Pipeline — Gathering the changes included in the release

This workflow orchestrates the full process for generating .NET Libraries release notes. Each step is documented in its own reference file and can be invoked independently.

## Step 1: Data Pipeline

Gather and enrich the candidate changes for the release.

| Step | Description | Reference |
|------|-------------|-----------|
| 1.1 | **Analyze API Diff** — Locate and load the API diff to understand new/changed APIs | [data-1-apidiff-review.md](data-1-apidiff-review.md) |
| 1.2 | **Collect & Filter PRs** — Fetch merged PRs, filter to library areas, cross-reference API diff | [data-2-collect-prs.md](data-2-collect-prs.md) |
| 1.3 | **Enrich** — Fetch full PR details, Copilot summaries, backing issues, and reaction counts | [data-3-enrich.md](data-3-enrich.md) |

After Step 1.2, additional PRs can be added to the candidate list manually by number. Use Step 1.3 to fetch their details.

## Step 2: Verify Scope

Validate the candidate list before authoring content. These verification steps apply to all candidates, including any manually added PRs.

| Step | Description | Reference |
|------|-------------|-----------|
| 2.1 | **Deduplicate** — Remove features already covered in prior release notes, flag earlier PRs for review | [verify-1-dedupe.md](verify-1-dedupe.md) |
| 2.2 | **Confirm release branch** — Verify candidate changes are present in the `dotnet/dotnet` VMR release branch | [verify-2-release.md](verify-2-release.md) |

## Step 3: Author Content

Write the release notes document.

| Step | Description | Reference |
|------|-------------|-----------|
| 3.1 | **Categorize entries** — Group PRs by area/theme/impact into tiers; identify multi-faceted PRs | [author-1-entries.md](author-1-entries.md) |
| 3.2 | **Format** — Apply the document structure and section layout | [author-2-format.md](author-2-format.md) |
| 3.3 | **Editorial** — Apply rules for benchmarks, attribution, naming, and ranking | [author-3-editorial.md](author-3-editorial.md) |

## Cache Directory Structure

```
.cache/
└── <owner>/
    └── <repo>/
        ├── all_merged_prs.json      # Raw merged PR list
        ├── batch1.json              # First date range batch
        ├── batch2.json              # Second date range batch
        ├── library_prs.json         # Filtered to library-area PRs
        ├── pr_details.json          # Full PR bodies keyed by number
        ├── issue_details.json       # Full issue bodies keyed by number
        └── coauthors.txt            # Copilot PR → assignee mapping
```

Always check if cache files exist before re-fetching. Only re-fetch if the user asks to refresh or the date range changes.
