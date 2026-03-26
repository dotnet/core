# Collect and Filter PRs

Pull merged PRs from the repositories specified in the team context.

## Team-specific PR discovery

**Before using the default approach below**, check the team context (`team-<team>.md`) for a **PR Discovery** section. Teams may override the default approach entirely — for example, using milestones instead of labels, or different filtering criteria.

If the team context specifies PR discovery overrides, follow those instructions instead of the default label-based approach below. The exclusion filters and data storage sections still apply regardless of the discovery method.

## Default: Area-label-scoped search

The default approach uses area labels defined in the team context to find relevant PRs. This works for teams that organize PRs by area label (e.g., `area-System.Collections`).

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

**PRs without area labels.** Some PRs lack an area label altogether. To catch these, run a search without label filters but restricted to the date range and `perPage: 30`. Page through all results (incrementing `page` until an empty page is returned) to collect all unlabeled PRs. Check the title and description of unlabeled PRs for team-relevant content. If a PR references an issue (via "Fixes #..." links), fetch the issue to check for area labels.

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

### Detect and exclude reverts

After collecting all PRs, scan for **revert PRs** — PRs that undo work from another PR. How a revert is handled depends on whether the reverted PR was merged **within the current release period** or in a **previous release**.

- **Within-release revert** — both the original PR and its revert are excluded. The net effect is zero change, so neither should appear in the release notes.
- **Cross-release revert** — a revert of work from a previous release is effectively a bug fix or behavior change. Keep the revert PR as a candidate (it represents a user-visible change in this release) but do not include the original PR from the prior release.

**Detection patterns — scan every collected PR's title and body:**

1. **Title patterns** (full reverts):
   - `Revert "Original PR title"` — match the quoted title against other collected PRs
   - `Revert "<title>" (#1234)` — extract the PR number directly
   - `Revert #1234` or `Revert PR #1234`

2. **Body patterns** (full or partial reverts):
   - `Reverts <owner>/<repo>#1234` or `Reverts #1234` — GitHub's auto-generated revert body
   - `This reverts commit <sha>` — git's revert message; look up which PR introduced that commit
   - `Partially reverts #1234` or `Reverts part of #1234`

3. **Label patterns**:
   - PRs labeled `revert` or `reverted`

**For each detected revert, determine the scope:**

1. Mark the revert PR: `UPDATE prs SET is_revert = 1 WHERE number = <revert_pr>;`
2. Check whether the reverted PR is in the collected set (i.e., merged within the current release period's date range).
   - **If yes (within-release revert):** mark both for exclusion.

     ```sql
     UPDATE prs SET reverted_by = <revert_pr> WHERE number = <original_pr>;
     ```

   - **If no (cross-release revert):** the revert PR is a meaningful change — keep it as a candidate. Clear its `is_revert` flag so it is treated as a normal PR during categorization.

     ```sql
     UPDATE prs SET is_revert = 0 WHERE number = <revert_pr>;
     ```

**Partial reverts** require closer inspection. When a PR's title or body indicates a partial revert (e.g., "Revert part of", "Partially reverts"), fetch the revert PR's diff to understand what was undone:

- **Within-release partial revert:** if the partial revert removes the user-facing feature or API introduced by the original PR, treat it the same as a full within-release revert — exclude both. If the partial revert only rolls back an implementation detail while the feature remains intact, keep the original PR as a candidate but note the revert in the PR's context for the authoring step.
- **Cross-release partial revert:** keep the revert PR as a candidate. It represents a user-visible change worth documenting.

**After revert detection, exclude within-release revert pairs from candidates:**

```sql
-- Exclude within-release revert pairs (both sides)
UPDATE prs SET is_candidate = 0
WHERE is_revert = 1 OR reverted_by IS NOT NULL;
```

### Team-specific filters

Apply any additional filters specified in the team context (e.g., specific label inclusions/exclusions, path-based filtering).

Mark matching PRs as candidates in the SQL `prs` table (`is_candidate = 1`).
