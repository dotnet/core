# Data Pipeline — Fetching and Caching PRs

## Step 1: Fetch Merged PRs

Use the GitHub CLI to pull all merged PRs in the date range from the specified repository. The API returns a max of 1000 results per query, so split into batches if needed.

Cache files are stored under `.cache/<owner>/<repo>/` so multiple repositories can be cached side-by-side without collision.

```bash
REPO="dotnet/runtime"  # Set from user input
CACHE_DIR=".cache/${REPO}"
mkdir -p "$CACHE_DIR"

# First batch (newer half of range)
gh pr list --repo "$REPO" --state merged \
  --search "merged:2025-12-01..2026-02-01" \
  --limit 1000 --json number,title,labels,author,mergedAt,url \
  > "$CACHE_DIR/batch1.json"

# Second batch (older half of range)
gh pr list --repo "$REPO" --state merged \
  --search "merged:2025-10-01..2025-12-01" \
  --limit 1000 --json number,title,labels,author,mergedAt,url \
  > "$CACHE_DIR/batch2.json"
```

Merge batches into `$CACHE_DIR/all_merged_prs.json`. This is the authoritative cached dataset — all subsequent steps read from cache.

## Step 2: Filter to Library PRs

From the merged set, keep only PRs where:
- At least one label starts with `area-System.` or `area-Microsoft.Extensions.` or `area-Meta`
- Exclude labels: `backport`, `servicing`, `NO-MERGE`
- Exclude PRs whose title starts with `[release/` or contains `backport`

Save to `$CACHE_DIR/library_prs.json`.

## Step 3: Fetch Detailed PR Bodies

For each library PR, fetch the full body (description) which contains benchmark data, API signatures, and motivation:

```bash
gh pr view <number> --repo "$REPO" \
  --json number,title,body,labels,author,assignees,mergedAt,url
```

Cache results in `$CACHE_DIR/pr_details.json` (map of PR number → full detail object). This avoids re-fetching on subsequent runs.

## Step 4: Categorize by Impact

Group PRs into tiers:
- **Headline features**: New types, new compression algorithms, major new API surfaces
- **Performance**: PRs with benchmark data showing measurable improvements
- **API additions**: New methods/overloads on existing types
- **Small improvements**: Single-mapping additions, minor fixes with public API changes

Only Headline, Performance, and significant API additions go into the release notes. Use judgment — a 2-line dictionary entry addition is less noteworthy than a new numeric type.

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
        └── coauthors.txt            # Copilot PR → assignee mapping
```

Always check if cache files exist before re-fetching. Only re-fetch if the user asks to refresh or the date range changes.
