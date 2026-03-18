# Enrich — Fetch PR and Issue Details

For each candidate PR, fetch the full body (description) which contains benchmark data, API signatures, and motivation. Then fetch the details for issues referenced by or linked to the pull request.

## Fetch PR details

Use `pull_request_read` with method `get` to fetch each PR's full details:

```
pull_request_read(
  method: "get",
  owner: "<owner>",
  repo: "<repo>",
  pullNumber: <number>
)
```

Multiple independent PR reads can be issued in parallel. Record the **total reaction count** for each PR as a popularity signal.

After fetching PR details, also fetch comments to look for **Copilot-generated summaries**:

```
pull_request_read(
  method: "get_comments",
  owner: "<owner>",
  repo: "<repo>",
  pullNumber: <number>
)
```

Look for comments authored by `copilot[bot]` or `github-actions[bot]` that contain a summary. These are useful for large PRs with sparse descriptions.

## Populate reviewer data

While fetching PR details, collect contributor information for the [reviewer suggestion](suggest-reviewers.md) step:

1. **PR author** — `user.login`
2. **PR assignees** — `assignees` array
3. **PR merged-by** — `merged_by`
4. **Coauthors** — fetch the merge commit and parse `Co-authored-by:` trailers

Insert one row per contributor-role-PR combination into the `reviewers` table (see [sql-storage.md](sql-storage.md)). Exclude bot accounts:
- `Copilot`, `copilot-swe-agent[bot]`, `copilot[bot]`
- `dependabot[bot]`, `dotnet-maestro[bot]`, `github-actions[bot]`
- Any account whose login ends with `[bot]`

## Discover related issues

### Parse the PR description for issue links

Scan the PR body for issue references:

- **Closing keywords**: `Fixes #1234`, `Closes #1234`, `Resolves #1234`
- **Full URL links**: `https://github.com/<owner>/<repo>/issues/1234`
- **Cross-repo references**: `<owner>/<repo>#1234`
- **Bare hash references**: `#1234` (relative to the PR's repository)

For Copilot-authored PRs, also check the `<details>` / `<summary>Original prompt</summary>` section for `Fixes` links.

### Fetch issue details

For each discovered issue, use `issue_read` with method `get`:

```
issue_read(
  method: "get",
  owner: "<owner>",
  repo: "<repo>",
  issue_number: <number>
)
```

Record the **total reaction count** for each issue. Combine PR and issue reactions for an overall **popularity score**. Prioritize fetching issues that are:

- Referenced by a `Fixes`/`Closes`/`Resolves` keyword
- Labeled `api-approved` (contain approved API shapes and usage examples)
- Labeled `enhancement` with high reaction counts

Store all fetched details using the SQL tool (update `body` and `reactions` in the `prs` table; insert into the `issues` table).

## Detect preview-to-preview feedback fixes

After enriching candidates with linked issues, scan for **preview feedback fixes** — bug fixes or behavior changes driven by community feedback on a previous preview. These are noteworthy for release notes (see [editorial-rules.md](editorial-rules.md#preview-to-preview-feedback-fixes)).

### Identification heuristics

For each candidate PR with a linked issue (via `Fixes`/`Closes`/`Resolves`):

1. **Issue creation date** — if created *after* the start date (previous preview's Code Complete), it is a preview-era issue.
2. **Issue author** — a **team member** is defined as someone who appears as author, merger, or assignee on **3 or more** candidate PRs in the pipeline. If the issue author is not a team member, flag as community-reported.
3. **Bug/regression labels** — labels like `bug`, `regression`, `behavior-change` are strong signals.
4. **Reaction and comment counts** — record as community signal strength.

### Flag in the database

```sql
UPDATE prs SET is_preview_feedback_fix = 1,
  feedback_issue_number = <issue_number>,
  feedback_issue_reactions = <total_reactions>,
  feedback_issue_comments = <comment_count>,
  feedback_reporter = '<issue_author>'
WHERE number = <pr_number> AND repo = '<repo>';
```

## Fallback — GitHub CLI

If the MCP server is unavailable:

```bash
gh pr view <number> --repo "<owner>/<repo>" \
  --json number,title,body,labels,author,assignees,mergedAt,url

gh issue view <number> --repo "<owner>/<repo>" \
  --json number,title,body,labels,author,assignees,url
```
