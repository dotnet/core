# Enrich — Fetch PR and Issue Details

For each candidate PR, fetch the full body (description) which contains benchmark data, API signatures, and motivation. Then fetch the details for issues referenced by or linked to the pull request — especially any issues resolved by the PR.

## Fetch PR details — GitHub MCP server (primary)

Use `pull_request_read` with method `get` to fetch each PR's full details:

```
pull_request_read(
  method: "get",
  owner: "<owner>",
  repo: "<repo>",
  pullNumber: <number>
)
```

Multiple independent PR reads can be issued in parallel for efficiency. The PR response includes a `reactions` object with counts for each reaction type. Record the **total reaction count** for each PR as a popularity signal.

After fetching PR details, also fetch the PR's comments to look for **Copilot-generated summaries**:

```
pull_request_read(
  method: "get_comments",
  owner: "<owner>",
  repo: "<repo>",
  pullNumber: <number>
)
```

Look for comments authored by `copilot[bot]` or `github-actions[bot]` that contain a summary of the PR. These summaries are especially useful for large PRs where the description is auto-generated or sparse.

## Populate reviewer data

While fetching PR details, also collect contributor information for the [reviewer suggestion](suggest-reviewers.md) step:

1. **PR author** — the `user.login` field from the PR details.
2. **PR assignees** — the `assignees` array from the PR details.
3. **PR merged-by** — the `merged_by` field.
4. **Coauthors from commits** — fetch the PR's merge commit and look for `Co-authored-by:` trailers in commit messages.

Insert one row per contributor-role-PR combination into the `reviewers` table (see [sql-storage.md](sql-storage.md)). Exclude bot accounts and Copilot from all roles:

- `Copilot`, `copilot-swe-agent[bot]`, `copilot[bot]`
- `dependabot[bot]`, `dotnet-maestro[bot]`, `github-actions[bot]`
- Any account whose login ends with `[bot]`

## Discover related issues from the PR

Use both methods to find issues that a PR resolves or references:

### Parse the PR description for issue links

Scan the PR body text for issue references:

- **Closing keywords**: `Fixes #1234`, `Closes #1234`, `Resolves #1234`
- **Full URL links**: `https://github.com/<owner>/<repo>/issues/1234`
- **Cross-repo references**: `<owner>/<repo>#1234`
- **Bare hash references**: `#1234` (relative to the PR's repository)

For Copilot-authored PRs, also look in the `<details>` / `<summary>Original prompt</summary>` collapsed section, which typically contains the original issue title, description, and a `Fixes` link.

### Use the GitHub MCP server to find linked issues

```
search_issues(
  owner: "<owner>",
  repo: "<repo>",
  query: "is:closed linked:pr reason:completed <search terms>"
)
```

## Fetch issue details

For each discovered issue number, use `issue_read` with method `get`:

```
issue_read(
  method: "get",
  owner: "<owner>",
  repo: "<repo>",
  issue_number: <number>
)
```

Multiple independent issue reads can be issued in parallel. Record the **total reaction count** for each issue. Combine the PR and issue reaction counts to form an overall **popularity score** for each feature. Prioritize fetching issues that are:

- Referenced by a `Fixes`/`Closes`/`Resolves` keyword
- Labeled `api-approved` (these contain approved API shapes and usage examples)
- Labeled `enhancement` with high reaction counts

The issue body often contains richer context than the PR, including:
- **API proposals** with `### API Proposal` and `### API Usage` sections
- **Motivation** explaining why the feature was requested
- **Upvote counts** (via reactions) indicating community demand

## Fallback — GitHub CLI

If the GitHub MCP server is not available:

```bash
gh pr view <number> --repo "<owner>/<repo>" \
  --json number,title,body,labels,author,assignees,mergedAt,url

gh issue view <number> --repo "<owner>/<repo>" \
  --json number,title,body,labels,author,assignees,url
```

Store all fetched details using the **SQL tool** (update `body` and `reactions` columns in the `prs` table; insert into the `issues` table). Do **not** write intermediate files to disk.

## Detect preview-to-preview feedback fixes

After enriching all candidate PRs with their linked issues, scan for **preview feedback fixes** — bug fixes or behavior changes driven by community feedback on a previous preview. These are especially noteworthy for release notes (see [editorial-rules.md](editorial-rules.md#preview-to-preview-feedback-fixes)).

### Identification heuristics

For each candidate PR that has a linked issue (via `Fixes`/`Closes`/`Resolves`):

1. **Check issue creation date** — if the issue was created *after* the start date (the previous preview's Code Complete), it's a preview-era issue.
2. **Check issue author** — if the author is NOT a member of the team (not in the PR author list, not a bot, and doesn't appear frequently as a merger/assignee across candidate PRs), flag it as community-reported.
3. **Check for bug/regression labels** — labels like `bug`, `regression`, `behavior-change`, or team-specific equivalents are strong signals.
4. **Check reaction and comment counts** — record these as the **community signal strength** for this fix.

### Flag in the database

For PRs that match, update the SQL record:

```sql
UPDATE prs SET is_preview_feedback_fix = 1,
  feedback_issue_number = <issue_number>,
  feedback_issue_reactions = <total_reactions>,
  feedback_issue_comments = <comment_count>,
  feedback_reporter = '<issue_author>'
WHERE number = <pr_number>;
```

These flagged PRs are included during [categorization](categorize-entries.md) under the "Preview feedback fixes" tier and ranked by community signal strength.
