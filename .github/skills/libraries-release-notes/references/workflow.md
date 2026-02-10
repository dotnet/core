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

Use `search_pull_requests` to query for merged PRs. Split the date range into batches if needed to stay within query result limits.

```
search_pull_requests(
  owner: "dotnet",
  repo: "runtime",
  query: "is:merged merged:2025-12-01..2026-02-01",
  perPage: 100
)
```

Page through results (incrementing `page`) until all PRs are collected. Repeat with subsequent date range batches as needed until all PRs from the date range have been collected.

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

From the merged set, keep only PRs where:
- Files modifying `System.*` or `Microsoft.Extensions.*` APIs (either `ref` or `src` changes)
- Exclude labels: `backport`, `servicing`, `NO-MERGE`
- Exclude PRs whose title starts with `[release/` or contains `backport`

Save to `$CACHE_DIR/library_prs.json`.

## Step 4: Fetch Pull Request and Related Issue Details

For each library PR, fetch the full body (description) which contains benchmark data, API signatures, and motivation. Building on the PR data, fetch the details for issues referenced by or linked to the pull request — especially any issues resolved by the PR. Issues labeled `api-approved` represent new APIs being added and should be represented in the API diff if it was loaded. The issue often has a more detailed description than the PR, including API usage examples and a statement of impact/value. The final API shape (and usage example) might be somewhat out of date compared to what was approved and merged in the pull request, so usage examples may need to be revised.

### 4a. Fetch PR details — GitHub MCP server (primary)

Use `pull_request_read` with method `get` to fetch each PR's full details:

```
pull_request_read(
  method: "get",
  owner: "dotnet",
  repo: "runtime",
  pullNumber: <number>
)
```

Multiple independent PR reads can be issued in parallel for efficiency.

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

### 4b. Discover related issues from the PR

There are two complementary ways to find issues that a PR resolves or references. Use both to build a complete picture.

#### 4b-i. Parse the PR description for issue links

Scan the PR body text for issue references. Common patterns include:

- **Closing keywords**: `Fixes #1234`, `Closes #1234`, `Resolves #1234` (GitHub auto-links these)
- **Full URL links**: `https://github.com/dotnet/runtime/issues/1234`
- **Cross-repo references**: `dotnet/runtime#1234`
- **Bare hash references**: `#1234` (relative to the PR's repository)

Extract all unique issue numbers from these patterns. For Copilot-authored PRs, also look in the `<details>` / `<summary>Original prompt</summary>` collapsed section, which typically contains the original issue title, description, and a `Fixes` link at the bottom of the PR body.

#### 4b-ii. Use the GitHub MCP server to find linked issues

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

### 4c. Fetch issue details

For each discovered issue number, use `issue_read` with method `get`:

```
issue_read(
  method: "get",
  owner: "dotnet",
  repo: "runtime",
  issue_number: <number>
)
```

Multiple independent issue reads can be issued in parallel for efficiency. Prioritize fetching issues that are:

- Referenced by a `Fixes`/`Closes`/`Resolves` keyword (these are the resolved issues)
- Labeled `api-approved` (these contain the approved API shape and usage examples)
- Labeled `enhancement` with high reaction counts (these indicate community demand)

The issue body often contains richer context than the PR, including:
- **API proposals** with `### API Proposal` and `### API Usage` sections
- **Motivation** explaining why the feature was requested
- **Upvote counts** (via reactions) that indicate community demand
- **Discussion comments** that may contain approved API shapes from API review

### 4d. Fallback — GitHub CLI

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

## Step 5: Categorize by Area/Theme/Impact

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
