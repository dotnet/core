# Step 4: Enrich — Fetch PR and Issue Details

For each library PR, fetch the full body (description) which contains benchmark data, API signatures, and motivation. Building on the PR data, fetch the details for issues referenced by or linked to the pull request — especially any issues resolved by the PR. Issues labeled `api-approved` represent new APIs being added and should be represented in the API diff if it was loaded. The issue often has a more detailed description than the PR, including API usage examples and a statement of impact/value. The final API shape (and usage example) might be somewhat out of date compared to what was approved and merged in the pull request, so usage examples may need to be revised.

## Fetch PR details — GitHub MCP server (primary)

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

## Discover related issues from the PR

There are two complementary ways to find issues that a PR resolves or references. Use both to build a complete picture.

### Parse the PR description for issue links

Scan the PR body text for issue references. Common patterns include:

- **Closing keywords**: `Fixes #1234`, `Closes #1234`, `Resolves #1234` (GitHub auto-links these)
- **Full URL links**: `https://github.com/dotnet/runtime/issues/1234`
- **Cross-repo references**: `dotnet/runtime#1234`
- **Bare hash references**: `#1234` (relative to the PR's repository)

Extract all unique issue numbers from these patterns. For Copilot-authored PRs, also look in the `<details>` / `<summary>Original prompt</summary>` collapsed section, which typically contains the original issue title, description, and a `Fixes` link at the bottom of the PR body.

### Use the GitHub MCP server to find linked issues

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

## Fetch issue details

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

## Fallback — GitHub CLI

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
