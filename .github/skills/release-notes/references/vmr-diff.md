# VMR Diff

Diff two VMR (`dotnet/dotnet`) release references (tags or branches) to determine what code changes shipped in the target release. This is the foundation of the pipeline — the VMR diff defines the scope of the release.

## Why VMR-first

The VMR release tag/branch is the authoritative record of what ships in a .NET release. By starting from the VMR diff:

- **Reverts are inherently excluded** — if code was added and then reverted within the same release period, the net diff shows no change. No heuristic revert detection needed.
- **Missing syncs are caught** — if a source repo PR was merged but never synced to the VMR, it won't appear in the diff and won't be incorrectly documented.
- **Scope is exact** — the diff shows precisely what changed between two release milestones.

## Step 1: Find the VMR release references

VMR uses **tags** for shipped releases and **release-pr branches** for in-progress releases. The naming patterns are:

| Reference type | Pattern | Example |
|----------------|---------|---------|
| Release tag | `v<MAJOR>.0.100-<label>.<build>` | `v11.0.100-preview.2.26159.112` |
| Release-PR branch | `release-pr-<MAJOR>.0.100-<label>.<build>` | `release-pr-11.0.100-preview.3.26168.106` |
| Long-lived branch | `release/<MAJOR>.0.1xx` | `release/10.0.1xx` (only for shipped GA releases) |
| Active development | `main` | For the current in-development major version |

### Finding the previous release tag

```bash
# List tags matching the major version
gh api repos/dotnet/dotnet/tags --jq '.[].name' --paginate | grep "^v<MAJOR>.0" | head -20
```

Look for the tag matching the previous release label (e.g., for P3, find the P2 tag like `v11.0.100-preview.2.*`).

### Finding the current release reference

```bash
# Check for a release-pr branch for the current release
gh api repos/dotnet/dotnet/branches --jq '.[].name' --paginate | grep "release-pr-<MAJOR>.0"

# Or check for a tag if the release already shipped
gh api repos/dotnet/dotnet/tags --jq '.[].name' --paginate | grep "^v<MAJOR>.0.100-<label>"
```

If neither a tag nor release-pr branch exists for the current release, use `main` as the head reference.

## Step 2: Get the comparison

Use the GitHub API to compare the two references. This gives us commits and changed files:

```bash
gh api repos/dotnet/dotnet/compare/<previous-tag>...<current-ref> \
  --jq '{
    total_commits: .total_commits,
    ahead_by: .ahead_by,
    behind_by: .behind_by,
    files: [.files[] | {filename: .filename, status: .status, additions: .additions, deletions: .deletions}]
  }'
```

**Important limitations:**
- GitHub Compare API is limited to **300 files** and **250 commits** per response
- Infrastructure and build files often fill the file quota before source code appears
- The `status` field may be `"diverged"` rather than `"ahead"` since branches share a common ancestor

### When the comparison exceeds limits

If the diff has >250 commits or >300 files, **switch to commit-based analysis** instead of file-based:

```bash
# Get commits page by page
gh api "repos/dotnet/dotnet/compare/<previous-tag>...<current-ref>" \
  --jq '.commits[] | {sha: .sha, message: (.commit.message | split("\n")[0]), date: .commit.committer.date, author: .author.login}'
```

Focus on **source sync commits** (pattern: `[main] Source code updates from dotnet/<repo>`) to identify which repos had changes. Count sync commits per repo to gauge relative change volume.

**Store the comparison results using the SQL tool** — insert into `vmr_files` and `vmr_commits` tables (see [sql-storage.md](sql-storage.md)).

## Step 3: Derive the date range

From the VMR diff commits, extract the date range for source repo PR searches:

```sql
-- After inserting VMR commits into the database
SELECT MIN(date) AS start_date, MAX(date) AS end_date FROM vmr_commits;
```

This date range replaces the need to ask users for Code Complete dates. It naturally reflects when code was synced to the VMR for this release.

## Step 4: Classify changes by component

For each changed file or sync commit, classify into a component using the [component mapping](component-mapping.md#path-to-component-mapping):

1. Match against the longest VMR path prefix
2. Skip non-source paths (`eng/`, `test/`, `tests/`, `docs/`, build files)
3. Record the component assignment in the `vmr_files` table

```sql
INSERT INTO vmr_files (path, component, status, additions, deletions)
VALUES ('<path>', '<component>', '<status>', <additions>, <deletions>);
```

## Step 5: Summarize component changes

Query the classified data to determine which components have meaningful changes:

```sql
SELECT component,
       COUNT(*) AS file_count,
       SUM(additions) AS total_additions,
       SUM(deletions) AS total_deletions
FROM vmr_files
WHERE component IS NOT NULL
GROUP BY component
ORDER BY (total_additions + total_deletions) DESC;
```

Present the component summary to the user before proceeding to source repo tracing.

## Step 6: Extract source repo references from VMR commits

VMR source sync commits follow predictable patterns:

1. **Source update**: `"[main] Source code updates from dotnet/<repo> (#NNNN)"` — these contain the actual code changes
2. **Dependency update**: `"[main] Update dependencies from dotnet/<repo>"` — version bumps, usually not noteworthy
3. **Backflow**: `"[automated] Merge branch ..."` — ignore these

**Note:** Source sync commit bodies are often sparse — they may contain only a one-line description rather than listing individual source PRs. Do not rely solely on commit messages for PR discovery. Use the [trace-to-source](trace-to-source.md) step with date-range searches as the primary PR discovery method.

```sql
INSERT INTO vmr_commits (sha, component, source_repo, source_pr_number, message, date)
VALUES ('<sha>', '<component>', '<repo>', <pr_number>, '<message>', '<date>');
```
