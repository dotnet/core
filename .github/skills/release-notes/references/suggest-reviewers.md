# Suggest Reviewers

After authoring the release notes, compile a list of suggested reviewers by analyzing the authors, coauthors, and reviewers of the candidate PRs that were included in the release notes. This helps the release notes author identify the right people to tag for reviewing specific sections.

## Data sources

For each candidate PR (those with `is_candidate = 1` in the `prs` table), gather contributor information from:

1. **PR author** — the `user.login` field from the PR details (already fetched during [enrichment](enrich-prs.md)).
2. **PR assignees** — the `assignees` array from the PR details. Assignees are typically the area owner or tech lead who shepherded the PR.
3. **PR merged-by** — the `merged_by` field. The person who merged the PR is familiar with the changes.
4. **Coauthors from commits** — fetch the PR's merge commit (or the commits in the PR) and look for `Co-authored-by:` trailers in commit messages. Use `get_commit` with the PR's merge commit SHA, or `list_commits` on the PR's head branch, and parse trailer lines matching `Co-authored-by: Name <email>`.

## SQL schema

Store reviewer data in the `reviewers` table (see [sql-storage.md](sql-storage.md)):

```sql
INSERT INTO reviewers (github_login, role, pr_number, area_labels)
VALUES ('<login>', '<role>', <pr_number>, '<area_labels>');
```

Insert one row per contributor-role-PR combination. A single person may appear multiple times across different roles and PRs.

## Filtering

Exclude bot accounts and Copilot from the reviewer list. This applies to all roles including coauthors:
- `Copilot`, `copilot-swe-agent[bot]`, `copilot[bot]`
- `dependabot[bot]`, `dotnet-maestro[bot]`, `github-actions[bot]`
- Any account whose login ends with `[bot]`

## Aggregation

Query the reviewers table to produce a summary grouped by area:

```sql
SELECT
    area_labels,
    github_login,
    COUNT(DISTINCT pr_number) AS pr_count,
    GROUP_CONCAT(DISTINCT role) AS roles
FROM reviewers
WHERE github_login NOT LIKE '%[bot]%'
  AND github_login != 'Copilot'
GROUP BY area_labels, github_login
ORDER BY area_labels, pr_count DESC, github_login;
```

## Presentation

Present the suggested reviewers to the user as part of the confirmation step. Format as a grouped list:

```
## Suggested Reviewers

Based on the PRs included in these release notes, the following people are most
familiar with the changes and well-suited to review specific sections:

### Process APIs (System.Diagnostics.Process)
- @person1 — authored #124264, merged #124256 (2 PRs)
- @person2 — assigned on #124264 (1 PR)

### System.Text.Json
- @person5 — authored #123940
- @person6 — reviewed and merged #123940
```

**Ranking within each area:** List contributors by the number of PRs they touched (descending), then alphabetically. People who appear in multiple roles (e.g. both author and reviewer) for the same area are stronger candidates.

**Cross-area contributors:** If someone appears across 3+ areas, call them out separately as a potential overall reviewer:

```
### Overall Reviewers
- @person7 — involved in 4 PRs across Process APIs, System.Text.Json, and System.IO
```
