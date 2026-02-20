# Collect and Filter PRs

Pull merged PRs in the date range from the repositories specified in the team context, filtered to the team's area labels.

## Fetch merged PRs

### Primary — GitHub MCP server

Use `search_pull_requests` with **label-scoped queries** to keep result sets small and avoid large responses being saved to temp files on disk. See [github-tools.md](github-tools.md) for response size guidance.

Search for merged PRs one area label at a time, using the labels defined in the team context:

```
search_pull_requests(
  owner: "<owner>",
  repo: "<repo>",
  query: "is:merged merged:<start-date>..<end-date> label:<area-label>",
  perPage: 30
)
```

Run label-scoped searches in **parallel batches** for efficiency.

After the label-scoped searches, do a **catch-all search** for any remaining PRs that may use uncommon area labels. Use a broad query with the team's label prefix but keep `perPage` small:

```
search_pull_requests(
  owner: "<owner>",
  repo: "<repo>",
  query: "is:merged merged:<start-date>..<end-date> label:<label-prefix>",
  perPage: 30
)
```

Page through results (incrementing `page`) until all PRs for each query are collected. Deduplicate by PR number across all queries before inserting into the database.

**PRs without area labels.** Some PRs lack an area label altogether. To catch these, also run a search without label filters but restricted to the date range and `perPage: 30`. Check the title and description of unlabeled PRs for team-relevant content. If a PR references an issue (via "Fixes #..." links), fetch the issue to check for area labels.

### Fallback — GitHub CLI

If the GitHub MCP server is not available, use the `gh` CLI. Verify availability with `gh --version` first.

```bash
REPO="<owner>/<repo>"  # From team context

gh pr list --repo "$REPO" --state merged \
  --search "merged:<start-date>..<end-date>" \
  --limit 1000 --json number,title,labels,author,mergedAt,url
```

For large date ranges, split into smaller windows to avoid hitting result limits.

### Data storage

Store all fetched PR data using the **SQL tool**. See [sql-storage.md](sql-storage.md) for the schema. Insert each PR into the `prs` table and use SQL queries for all subsequent filtering.

## Filter to relevant PRs

Apply these filters before marking PRs as candidates:

### Exclusion filters

- Labels: `backport`, `servicing`, `NO-MERGE`
- PRs whose title starts with `[release/` or contains `backport`
- PRs that are purely test, CI, or documentation changes (no `src` changes)

### Team-specific filters

Apply any additional filters specified in the team context (e.g., specific label inclusions/exclusions, path-based filtering).

Mark matching PRs as candidates in the SQL `prs` table (`is_candidate = 1`).
