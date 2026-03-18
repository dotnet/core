# Trace VMR Changes to Source Repo PRs

After the VMR diff identifies which components changed and extracts initial PR references from commit messages, this step builds the complete list of candidate PRs for each component.

## Two-pronged discovery

Use both approaches and intersect the results:

1. **Forward trace (VMR → source)** — PR numbers extracted from VMR commit messages during the [VMR diff step](vmr-diff.md). These are confirmed present in the VMR.
2. **Reverse search (source repo → VMR verification)** — search source repos for PRs merged in the date range, then verify each is present in the VMR.

The intersection ensures completeness (reverse search catches PRs missed by commit parsing) and accuracy (VMR verification ensures only shipped code is documented).

## Forward trace: validate extracted PR references

For each PR number extracted from VMR commits during the diff step:

1. **Fetch the PR** from the source repo to get full metadata:

   ```
   pull_request_read(
     method: "get",
     owner: "<owner>",
     repo: "<repo>",
     pullNumber: <number>
   )
   ```

2. **Apply exclusion filters** — skip PRs that are:
   - Labeled `backport`, `servicing`, or `NO-MERGE`
   - Titled with `[release/` prefix or containing `backport`
   - Purely test, CI, or documentation changes (inspect the PR's changed files — if no `src/` changes, skip)
   - Dependency update PRs (titled `Update dependencies from ...` or authored by `dotnet-maestro[bot]`)

3. **Mark as candidate** in the SQL `prs` table with `vmr_confirmed = 1`.

## Reverse search: source repo PR discovery

For each component with VMR changes, search the source repo for additional PRs that may have been missed by commit message parsing. Use the search strategy from [component-mapping.md](component-mapping.md#source-repo-pr-search-patterns):

### For dotnet/runtime (Libraries + Runtime)

Search by area labels defined in the team context, scoped to the date range:

```
search_pull_requests(
  owner: "dotnet",
  repo: "runtime",
  query: "is:merged merged:<start-date>..<end-date> label:<area-label>",
  perPage: 30
)
```

Run label-scoped searches in **parallel batches** for efficiency.

### For dotnet/aspnetcore

Search by milestone:

```
search_pull_requests(
  owner: "dotnet",
  repo: "aspnetcore",
  query: "is:merged milestone:<MAJOR>.0-preview<N>",
  perPage: 30
)
```

### For other repos

Search by date range:

```
search_pull_requests(
  owner: "dotnet",
  repo: "<repo>",
  query: "is:merged merged:<start-date>..<end-date>",
  perPage: 30
)
```

Page through results until all PRs are collected. Apply the same exclusion filters as the forward trace.

## VMR verification of reverse-search PRs

For each PR found via reverse search that was NOT already confirmed via forward trace, verify it is present in the VMR release branch:

1. **Search for distinctive code** from the PR in the VMR:

   ```
   search_code(
     query: "repo:dotnet/dotnet path:<vmr-path-prefix> <distinctive symbol or text>"
   )
   ```

   Use a unique identifier from the PR — a new type name, method name, or string literal that would only exist if the PR's changes were included.

2. **If found** — mark the PR as `vmr_confirmed = 1` and add to the candidate list.

3. **If not found** — the PR was likely not synced to the VMR for this release. Exclude it but record the miss:

   ```sql
   UPDATE prs SET vmr_confirmed = 0, exclusion_reason = 'not found in VMR release branch'
   WHERE number = <pr_number> AND repo = '<repo>';
   ```

   Report unconfirmed PRs to the user during finalization so they can investigate if needed.

## Handle PRs spanning multiple components

Some source repo PRs touch code that maps to multiple components (e.g., a dotnet/runtime PR that changes both `src/libraries/` and `src/coreclr/`). For these:

- Assign the PR to the **primary** component based on where the most significant user-facing change is
- If the PR introduces a feature that spans components, document it in the most relevant component file and cross-reference from the other

## Store results

Insert all discovered PRs into the `prs` table:

```sql
INSERT INTO prs (number, repo, component, title, author, merged_at, vmr_confirmed, is_candidate)
VALUES (<number>, '<repo>', '<component>', '<title>', '<author>', '<date>', 1, 1);
```

After this step, the `prs` table contains all candidate PRs with their component assignments, confirmed as present in the VMR release branch.
