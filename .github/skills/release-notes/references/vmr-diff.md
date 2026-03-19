# VMR Diff (Local Clone)

Diff two VMR (`dotnet/dotnet`) release references using the **local clone**. All diff operations use git commands against the local repo — no GitHub API for diff analysis. This is the foundation of the pipeline.

See [release-branch-mechanics.md](release-branch-mechanics.md) for the full branch topology, fork timing, and why fork-point-based comparison is necessary.

## Why VMR-first

The VMR release tag/branch is the authoritative record of what ships in a .NET release:

- **Reverts are inherently excluded** — reverted code has no net diff, never enters the pipeline
- **Missing syncs are caught** — unsynced source repo PRs don't appear, won't be documented
- **Scope is exact** — diff shows precisely what changed between two release milestones

## Why local clone

GitHub's Compare API has hard limits (300 files, 250 commits) that make it unreliable for VMR diffs. A local clone has no such limits and enables:

- Full `git log` with unlimited commits
- `git diff --stat` with all files
- `git log --ancestry-path` for precise commit reachability
- `git branch -r --contains <sha>` to verify a commit is on a specific branch
- `git grep` across source at a specific ref

## Step 1: Ensure the clone is fresh

```bash
cd <vmr-clone-path>
git fetch origin --tags --prune
```

## Step 2: Find the release references

VMR uses **tags** for shipped releases and **release-pr branches** for in-progress releases:

| Reference type | Pattern | Example |
|----------------|---------|---------|
| Release tag | `v<MAJOR>.0.100-<label>.<build>` | `v11.0.100-preview.2.26159.112` |
| Release-PR branch | `release-pr-<MAJOR>.0.100-<label>.<build>` | `release-pr-11.0.100-preview.3.26128.104` |
| Long-lived branch | `release/<MAJOR>.0.1xx` | `release/10.0.1xx` (only shipped GA) |
| Active development | `main` | Current in-development major |

```bash
# Find previous release tag
git tag -l "v<MAJOR>.0*" | sort -V

# Find current release reference
git branch -r | grep "release-pr-<MAJOR>.0.100-<label>"

# Verify both refs resolve
git rev-parse --verify <previous-tag>
git rev-parse --verify origin/<current-ref>
```

## Step 3: Get the commit log between releases

```bash
git log --oneline --format="%H %s" <previous-tag>..origin/<current-ref>
```

No API limits. Parse the output to identify:

1. **Source sync commits** — pattern: `[main] Source code updates from dotnet/<repo> (#NNNN)`
2. **Dependency update commits** — pattern: `[main] Update dependencies from dotnet/<repo>`
3. **Infrastructure commits** — everything else

Count sync commits per repo:

```bash
git log --oneline <previous-tag>..origin/<current-ref> --grep="Source code updates from dotnet/" \
  | sed 's/.*from dotnet\///' | sed 's/ .*//' | sort | uniq -c | sort -rn
```

## Step 4: Get the file-level diff summary

```bash
# Full diff stat (source files only)
git diff --stat <previous-tag>..origin/<current-ref> -- src/

# Per-component file counts
git diff --stat <previous-tag>..origin/<current-ref> -- src/runtime/src/libraries/ | tail -1
git diff --stat <previous-tag>..origin/<current-ref> -- src/aspnetcore/src/ | tail -1
git diff --stat <previous-tag>..origin/<current-ref> -- src/sdk/src/ | tail -1
```

Store results in SQL — insert into `vmr_files` and `vmr_commits` tables (see [sql-storage.md](sql-storage.md)).

## Step 5: Derive the date range

```bash
# Earliest commit date in the range
git log --format="%ci" <previous-tag>..origin/<current-ref> | tail -1

# Latest commit date
git log --format="%ci" <previous-tag>..origin/<current-ref> | head -1
```

This date range drives source repo PR searches. No need to ask users for Code Complete dates.

## Step 6: Classify changes by component

For each changed file or sync commit, classify using [component mapping](component-mapping.md#path-to-component-mapping):

1. Match against the longest VMR path prefix
2. Skip non-source paths (`eng/`, `test/`, `tests/`, `docs/`, build files)
3. Record the assignment

```sql
INSERT INTO vmr_files (path, component, status, additions, deletions)
VALUES ('<path>', '<component>', '<status>', <additions>, <deletions>);
```

## Step 7: Summarize and present

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

Present to user before proceeding to source repo tracing.

## Step 8: Extract source repo info from sync commits

For each source sync commit, examine what changed:

```bash
# Show files changed in a specific sync commit
git show --stat <commit-sha> -- src/
```

**Note:** Sync commit bodies are sparse — do not rely on them for PR discovery. Use [trace-to-source](trace-to-source.md) with date-range searches as primary discovery, with local clone verification as the quality gate.
