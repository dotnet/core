# Data Pipeline — Gathering the changes included in the release

## Step 1: Analyze API Diff

### 1a. Locate the API diff

Locate and load the `Microsoft.NETCore.App` API diff for the target release. The API diff provides context about which APIs were added or changed and significantly improves the quality of the generated release notes.

The API diff lives under the `release-notes` folder within an `api-diff` subfolder for the target release. For example:
* .NET 10 RC 2: `release-notes/10.0/preview/rc2/api-diff/Microsoft.NETCore.App/10.0-RC2.md`
* .NET 10 GA: `release-notes/10.0/preview/ga/api-diff/Microsoft.NETCore.App/10.0-ga.md`
* .NET 11 Preview 1: `release-notes/11.0/preview/preview1/api-diff/Microsoft.NETCore.App/11.0-preview1.md`

Check the `release-notes/` folder in the current repository clone for the API diff. If it is not present locally, **warn the user** that the release notes generation gains substantial context from the API diff and suggest generating release notes after the API diff is ready. The user may choose to proceed without it, but quality will be reduced.

### 1b. Load the API diff

Once the `api-diff` folder is located, load all of the API difference files under the `Microsoft.NETCore.App` subfolder:

```
api-diff/Microsoft.NETCore.App/
```

For example:

```
release-notes/11.0/preview/preview1/api-diff/Microsoft.NETCore.App/
```

Read every diff file in this folder to understand the full set of APIs that have been added or changed in the release. This information is used later to cross-reference with merged PRs and ensure the release notes accurately cover all API surface changes.

## Step 2: Fetch Merged PRs

Pull all merged PRs in the date range from the specified repository. The primary method is the **GitHub MCP server** tools; fall back to the **GitHub CLI (`gh`)** if the MCP server is unavailable.

### 2a. Primary — GitHub MCP server

Use `search_pull_requests` to query for merged PRs. The initial query should fetch **all** merged PRs in the date range without label filtering, to avoid missing PRs labeled with less-common area labels (e.g. `area-System.DateTime`, `area-System.Reflection.Emit`, `area-System.Globalization`). Split the date range into sub-ranges if needed to stay within GitHub's 1,000-result search limit.

```
search_pull_requests(
  owner: "dotnet",
  repo: "runtime",
  query: "is:merged merged:2025-12-01..2026-02-01",
  perPage: 100
)
```

Page through results (incrementing `page`) until all PRs are collected. If a single date range returns close to 1,000 results, split into smaller sub-ranges (e.g. halve the range) and repeat. Do **not** restrict the initial search to specific area labels — label-based filtering happens later in Step 3.

### 2b. Fallback — GitHub CLI

If the GitHub MCP server is not available, use the `gh` CLI instead. Verify availability with `gh --version` first.

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

### Caching

Regardless of which method is used, cache files are stored under `.cache/<owner>/<repo>/` so multiple repositories can be cached side-by-side without collision. Merge batches into `$CACHE_DIR/all_merged_prs.json`. This is the authoritative cached dataset — all subsequent steps read from cache.

## Step 3: Filter to Library PRs

### 3a. Label-based filtering

From the merged set, keep only PRs that have a label matching any `area-System.*`, `area-Microsoft.Extensions*`, or `area-Extensions-*` pattern. Match the label prefix broadly — do **not** use a hard-coded list of specific area labels, as that risks missing PRs labeled with less-common areas (e.g. `area-System.DateTime`, `area-System.Reflection.Emit`, `area-System.Globalization`).

**PRs without area labels.** PR labels cannot be entirely trusted — some PRs lack an `area-*` label altogether. Do not discard these PRs immediately. Instead, check their linked or related issues (from the PR description's "Fixes #..." references) for `area-*` labels. If a related issue carries a matching `area-System.*`, `area-Microsoft.Extensions*`, or `area-Extensions-*` label, include the PR in the candidate list.

Additionally exclude:
- Labels: `backport`, `servicing`, `NO-MERGE`
- PRs whose title starts with `[release/` or contains `backport`
- PRs that are purely test, CI, or documentation changes (no `src` changes)

### 3b. Cross-reference with API diff

If the API diff was loaded in Step 1, cross-reference the candidate PRs against the new APIs. For each new API or namespace in the diff, verify that at least one candidate PR covers it. If an API in the diff has **no matching PR**, search for the implementing PR explicitly:

```
search_pull_requests(
  owner: "dotnet",
  repo: "runtime",
  query: "is:merged <API name or type name>"
)
```

This catches PRs that were missed by the date range (merged slightly after the Code Complete date but before the release branch was cut) or that lacked a recognized area label. Add any discovered PRs to the candidate list.

Also use the API diff to discover **issues** that drove new APIs. Many approved APIs originate from `api-approved` issues that may reference a broader feature story. Use `search_issues` to find related issues:

```
search_issues(
  owner: "dotnet",
  repo: "runtime",
  query: "label:api-approved <API name or type name>"
)
```

If such issues exist, trace them to their implementing PRs and ensure those PRs are in the candidate list.

**Unmatched API surface area.** After cross-referencing, if any substantial new APIs in the diff still cannot be correlated to a PR or issue, include a placeholder section in the release notes for each unmatched API group. Use a `**TODO**` marker so the author can manually resolve it later. For example:

```markdown
## <New API or Feature Name>

**TODO:** The API diff shows new surface area for `<Namespace.TypeName>` but the implementing PR/issue could not be found. Investigate and fill in this section.
```

Save to `$CACHE_DIR/library_prs.json`.

### 3c. Verify changes are present in the release branch

After filtering, verify that candidate changes actually shipped in the target release by checking the `dotnet/dotnet` Virtual Monolithic Repository (VMR). The VMR contains all .NET source code — including `dotnet/runtime` under `src/runtime/` — and its release branches represent what ships in each preview.

**Determine the release branch name.** The expected branch name pattern is:

```
release/<MAJOR>.0.1xx-<prerelease>
```

For example:
- .NET 11 Preview 1 → `release/11.0.1xx-preview1`
- .NET 11 Preview 2 → `release/11.0.1xx-preview2`
- .NET 11 RC 1 → `release/11.0.1xx-rc1`

Use the GitHub MCP server (or CLI fallback) to verify the branch exists:

```
list_branches(
  owner: "dotnet",
  repo: "dotnet"
)
```

If the expected branch is **not found**, search for branches matching `release/<MAJOR>.0*` and present the user with the matching branch names so they can select the correct one.

**Spot-check that the newest changes are included.** Start from the most recently merged PRs in the candidate list and work backward. For each PR, verify its changes are present in the VMR release branch by either:

1. **Searching for code** introduced by the PR in the `dotnet/dotnet` repo:

   ```
   search_code(
     query: "repo:dotnet/dotnet path:src/runtime <distinctive symbol or text from the PR>"
   )
   ```

2. **Checking commit history** on the release branch for runtime source code updates that post-date the PR merge:

   ```
   list_commits(
     owner: "dotnet",
     repo: "dotnet",
     sha: "release/<MAJOR>.0.1xx-<prerelease>",
     perPage: 30
   )
   ```

   Look for commits with messages like `"Source code updates from dotnet/runtime"` dated after the PR's merge date. The dotnet-maestro bot regularly syncs changes from `dotnet/runtime` into the VMR.

Stop checking after **2 consecutive PRs are confirmed present** — if the two newest changes made it into the release branch, older changes are also included.

If any change is **not found** in the release branch, inform the user that the feature may not have been included in this preview release. Suggest either:
- Moving that feature to the **next preview's** release notes
- Confirming with the release team whether a late sync occurred

## Step 4: Deduplicate Against Previous Release Notes

Before fetching full PR details, check that candidate features have not already been covered in an earlier preview's release notes for the same major version.

### 4a. Load prior release notes

Load the `libraries.md` file from the immediately preceding release within the same major version. For example, when generating Preview 3, load Preview 2's notes; when generating RC1, load Preview 7's notes.

When generating **Preview 1** release notes for a new major version, there are no prior previews to check. Instead, look back at the prior major version's late-cycle release notes — specifically RC1, RC2, and GA — since features that landed late in the previous release cycle may overlap with early work in the new version. For example, when generating .NET 12 Preview 1 notes, check:

```
release-notes/11.0/preview/rc1/libraries.md
release-notes/11.0/preview/rc2/libraries.md
release-notes/11.0/preview/ga/libraries.md
```

These files are in the local repository clone under `release-notes/<version>/preview/`.

### 4b. Check for overlap

For each candidate PR, check whether it (or its feature) already appears in a prior release's notes by looking for:

- **PR number references** — search for `#<number>` or the full PR URL in prior files
- **Feature names** — search for the API name, type name, or feature title (e.g. `IdnMapping`, `File.OpenNullHandle`, `Zstandard`)

Remove any PR from the candidate list whose feature is already covered. A PR that was merged in the date range of a prior preview but was not included in that preview's release notes may still be included — only exclude PRs whose features were actually written up.

### 4c. Flag earlier PRs that survived dedup

If any PRs were removed during dedup, review the remaining candidate PRs that were merged **before** the previous release's Code Complete date (i.e. PRs whose merge date falls in the earlier portion of the date range). These PRs were not found in the prior release notes but their merge dates suggest they *could* have been covered elsewhere. Present these PRs to the user and ask whether each should be included or excluded. For example:

> The following PRs were merged before the .NET 11 Preview 1 Code Complete date but were **not** found in any prior release notes. They may have been intentionally omitted or covered in a different document. Please confirm whether to include them:
>
> - #12345 — `Add Foo.Bar overload` (merged 2025-11-15)
> - #12400 — `Optimize Baz serialization` (merged 2025-12-03)

If no PRs were removed during dedup (i.e. nothing overlapped with prior notes), skip this sub-step — the earlier merge dates are expected given the date range and do not need user confirmation.

### 4d. Handle cross-preview features

Some features span multiple PRs across previews (e.g. a Preview 1 PR adds the core API and a Preview 2 PR extends it). In these cases:

- If the Preview 2 PR is a **substantial extension** (new overloads, new scenarios, significant perf improvement on top of the original, or breaking changes to the API shape), include it as an update referencing the earlier work.
- If the Preview 2 PR is a **minor follow-up** (bug fix, test addition, doc comment), skip it.

## Step 5: Fetch Pull Request and Related Issue Details

For each library PR, fetch the full body (description) which contains benchmark data, API signatures, and motivation. Building on the PR data, fetch the details for issues referenced by or linked to the pull request — especially any issues resolved by the PR. Issues labeled `api-approved` represent new APIs being added and should be represented in the API diff if it was loaded. The issue often has a more detailed description than the PR, including API usage examples and a statement of impact/value. The final API shape (and usage example) might be somewhat out of date compared to what was approved and merged in the pull request, so usage examples may need to be revised.

### 5a. Fetch PR details — GitHub MCP server (primary)

Use `pull_request_read` with method `get` to fetch each PR's full details:

```
pull_request_read(
  method: "get",
  owner: "dotnet",
  repo: "runtime",
  pullNumber: <number>
)
```

Multiple independent PR reads can be issued in parallel for efficiency. The PR response includes a `reactions` object with counts for each reaction type (e.g. `+1`, `heart`, `rocket`). Record the **total reaction count** for each PR as a popularity signal — PRs with high reaction counts indicate strong community interest.

After fetching PR details, also fetch the PR's comments to look for **Copilot-generated summaries**. Copilot often posts a comment on PRs that summarizes the changes, intent, and impact — this can provide a concise understanding of the PR that complements the (sometimes lengthy or template-heavy) PR description.

```
pull_request_read(
  method: "get_comments",
  owner: "dotnet",
  repo: "runtime",
  pullNumber: <number>
)
```

Look for comments authored by `copilot[bot]` or `github-actions[bot]` that contain a summary of the PR. These summaries are especially useful for large PRs where the description is auto-generated or sparse. Use this information to better understand the PR's purpose, but always cross-reference with the actual code changes and PR description for accuracy.

### 5b. Discover related issues from the PR

There are two complementary ways to find issues that a PR resolves or references. Use both to build a complete picture.

#### 5b-i. Parse the PR description for issue links

Scan the PR body text for issue references. Common patterns include:

- **Closing keywords**: `Fixes #1234`, `Closes #1234`, `Resolves #1234` (GitHub auto-links these)
- **Full URL links**: `https://github.com/dotnet/runtime/issues/1234`
- **Cross-repo references**: `dotnet/runtime#1234`
- **Bare hash references**: `#1234` (relative to the PR's repository)

Extract all unique issue numbers from these patterns. For Copilot-authored PRs, also look in the `<details>` / `<summary>Original prompt</summary>` collapsed section, which typically contains the original issue title, description, and a `Fixes` link at the bottom of the PR body.

#### 5b-ii. Use the GitHub MCP server to find linked issues

Use `search_issues` to find issues that reference the PR or that the PR resolves:

```
search_issues(
  owner: "dotnet",
  repo: "runtime",
  query: "is:closed linked:pr reason:completed <search terms>"
)
```

This can surface issues that were closed by the PR even if the PR description does not contain an explicit `Fixes` reference (e.g. when the link was added via the GitHub sidebar rather than the PR body).

You can also search by API name or type to find the backing issue directly:

```
search_issues(
  owner: "dotnet",
  repo: "runtime",
  query: "is:closed <API name or type>"
)
```

If any discovered issue carries the `api-approved` label, pay extra attention to both that issue and its associated PR. The `api-approved` issue typically contains the approved API shape, usage examples, motivation, and discussion from the API review — all of which are valuable background for writing compelling release notes.

### 5c. Fetch issue details

For each discovered issue number, use `issue_read` with method `get`:

```
issue_read(
  method: "get",
  owner: "dotnet",
  repo: "runtime",
  issue_number: <number>
)
```

Multiple independent issue reads can be issued in parallel for efficiency. The issue response includes a `reactions` object — record the **total reaction count** for each issue. Combine the PR and issue reaction counts to form an overall **popularity score** for each feature (sum of all `+1`, `heart`, `rocket`, and other positive reactions across the PR and its linked issues). Prioritize fetching issues that are:

- Referenced by a `Fixes`/`Closes`/`Resolves` keyword (these are the resolved issues)
- Labeled `api-approved` (these contain the approved API shape and usage examples)
- Labeled `enhancement` with high reaction counts (these indicate community demand)

The issue body often contains richer context than the PR, including:
- **API proposals** with `### API Proposal` and `### API Usage` sections
- **Motivation** explaining why the feature was requested
- **Upvote counts** (via reactions) that indicate community demand
- **Discussion comments** that may contain approved API shapes from API review

### 5d. Fallback — GitHub CLI

If the GitHub MCP server is not available, use the `gh` CLI:

```bash
gh pr view <number> --repo "$REPO" \
  --json number,title,body,labels,author,assignees,mergedAt,url

gh issue view <number> --repo "$REPO" \
  --json number,title,body,labels,author,assignees,url
```

To find issues closed by a PR via the CLI:

```bash
# Search for closed issues linked to the PR
gh search issues --repo "$REPO" --state closed "linked:pr <PR number or search terms>"
```

## Step 6: Categorize by Area/Theme/Impact

Group PRs into tiers:
- **Headline features**: New namespaces or types, implementations of new industry trends/algorithms, major new API surfaces
- **Quality**: PRs or groups of PRs that improve quality across an area (recognizing `area-*` labels on the PRs and issues)
- **Performance**: PRs with benchmark data showing measurable improvements
- **API additions**: New methods/overloads on existing types
- **Small improvements**: Single-mapping additions, minor fixes with public API changes
- **Community contributions**: Large PRs labeled as `community-contribution` or collections of such PRs by the same author

Only Headline, Quality, Performance, and significant API additions go into the release notes. Use judgment — a 2-line dictionary entry addition is less noteworthy than a new numeric type. The early previews (preview1 through preview5) tend to include more features, and the later previews (preview6, preview7, and rc1) tend to have fewer headline features and more quality improvements and small additions. The RC2 and GA releases typically have fewer changes so quality and performance improvements can be emphasized more.

For community contributions, if a community contributor has provided valuable features or quality improvements for popular libraries, give those entries more consideration for mentioning in the release notes.

Some example sets of release notes to use for reference and inspiration:
* `release-notes/11.0/preview/preview1/libraries.md`
* `release-notes/10.0/preview/preview1/libraries.md`
* `release-notes/9.0/preview/rc1/libraries.md`

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
