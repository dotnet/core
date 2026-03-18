# VMR Branch Diff

Diff two VMR (`dotnet/dotnet`) release branches to determine what code changes shipped in the target release. This is the foundation of the pipeline — the VMR diff defines the scope of the release.

## Why VMR-first

The VMR release branch is the authoritative record of what ships in a .NET release. By starting from the VMR diff:

- **Reverts are inherently excluded** — if code was added and then reverted within the same release period, the net diff shows no change. No heuristic revert detection needed.
- **Missing syncs are caught** — if a source repo PR was merged but never synced to the VMR, it won't appear in the diff and won't be incorrectly documented.
- **Scope is exact** — the diff shows precisely what changed between two release milestones.

## Step 1: Verify branch existence

Confirm both VMR release branches exist. Use the branch naming pattern from [component-mapping.md](component-mapping.md#vmr-release-branch-naming):

```
list_branches(
  owner: "dotnet",
  repo: "dotnet"
)
```

Search for branches matching `release/<MAJOR>.0*`. If either branch is missing, present the available branches and ask the user to confirm.

## Step 2: Get the branch comparison

Use the GitHub CLI to compare the two release branches. This gives us the list of commits and changed files between the base (previous release) and head (current release):

```bash
gh api repos/dotnet/dotnet/compare/release/<MAJOR>.0.1xx-<prev>...release/<MAJOR>.0.1xx-<current> \
  --jq '{
    total_commits: .total_commits,
    files: [.files[] | {filename: .filename, status: .status, additions: .additions, deletions: .deletions, changes: .changes}]
  }' > /dev/null
```

**If the comparison is too large** (GitHub limits compare API to 250 commits / 300 files), fall back to listing commits on the head branch and filtering:

```bash
# List commits on the current release branch not on the previous
gh api "repos/dotnet/dotnet/compare/release/<MAJOR>.0.1xx-<prev>...release/<MAJOR>.0.1xx-<current>" \
  --jq '.commits[] | {sha: .sha, message: (.commit.message | split("\n")[0]), author: .author.login}' \
  --paginate
```

**Important:** Store the comparison results using the SQL tool — do not write to disk files. Insert each changed file into the `vmr_files` table (see [sql-storage.md](sql-storage.md)).

## Step 3: Classify changes by component

For each changed file in the diff, classify it into a component using the [component mapping](component-mapping.md#path-to-component-mapping). Apply the classification rules:

1. Match against the longest VMR path prefix
2. Skip non-source paths (`eng/`, `test/`, `tests/`, `docs/`, build files)
3. Record the component assignment in the `vmr_files` table

```sql
-- After classifying all files
INSERT INTO vmr_files (path, component, status, additions, deletions)
VALUES ('<path>', '<component>', '<status>', <additions>, <deletions>);
```

## Step 4: Summarize component changes

Query the classified files to determine which components have meaningful changes:

```sql
SELECT component,
       COUNT(*) AS file_count,
       SUM(additions) AS total_additions,
       SUM(deletions) AS total_deletions,
       SUM(additions + deletions) AS total_changes
FROM vmr_files
WHERE component IS NOT NULL
GROUP BY component
ORDER BY total_changes DESC;
```

Components with zero or trivial changes (e.g., only build file updates that slipped through filters) get minimal stub release notes. Present the component summary to the user before proceeding:

> The VMR diff shows changes in the following components:
>
> | Component | Files Changed | Lines Changed |
> |-----------|--------------|---------------|
> | Libraries | 142 | +3,200 / -800 |
> | Runtime | 89 | +1,500 / -400 |
> | ASP.NET Core | 234 | +5,100 / -1,200 |
> | SDK | 45 | +600 / -200 |
> | ... | | |
>
> Components with no changes: Windows Forms, WPF, Visual Basic
>
> Proceed with tracing these changes to source repo PRs?

## Step 5: Extract source repo references from VMR commits

VMR commits from the automated code flow (dotnet-maestro bot) follow predictable patterns. Parse commit messages to extract source repo PR references:

### Maestro sync commit patterns

1. **Standard sync**: `"[source-build] Update dependencies from dotnet/<repo>"` or `"Update dependencies from dotnet/<repo>"`
2. **Source update**: `"Source code updates from dotnet/<repo>"` — these contain the actual code changes
3. **Backflow**: `"[automated] Merge branch 'release/...' => 'main'"` — ignore these

For source update commits, the commit body often contains references to the source repo PRs that were included. Parse for:
- `dotnet/<repo>#<number>`
- `https://github.com/dotnet/<repo>/pull/<number>`
- `Merge pull request #<number> from ...`

Store discovered PR references in the `vmr_commits` table:

```sql
INSERT INTO vmr_commits (sha, component, source_repo, source_pr_number, message)
VALUES ('<sha>', '<component>', '<source_repo>', <pr_number>, '<first line of message>');
```

These references serve as the **primary** list of candidate PRs for each component. The [trace-to-source](trace-to-source.md) step will validate and supplement this list.
