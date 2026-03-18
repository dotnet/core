# Suggest Reviewers

After authoring release notes, compile suggested reviewers by analyzing contributors to candidate PRs. This helps identify who to tag for reviewing specific sections.

## Data sources

For each candidate PR, gather from the `reviewers` table (populated during [enrichment](enrich-prs.md)):

1. **PR author** — `user.login`
2. **PR assignees** — area owner or tech lead
3. **PR merged-by** — familiar with the changes
4. **Coauthors** — from `Co-authored-by:` commit trailers

## Filtering

Exclude bot accounts:
- `Copilot`, `copilot-swe-agent[bot]`, `copilot[bot]`
- `dependabot[bot]`, `dotnet-maestro[bot]`, `github-actions[bot]`
- Any login ending with `[bot]`

## Aggregation

Query reviewers grouped by component:

```sql
SELECT
    component,
    github_login,
    COUNT(DISTINCT pr_number) AS pr_count,
    GROUP_CONCAT(DISTINCT role) AS roles
FROM reviewers
WHERE github_login NOT LIKE '%[bot]%'
  AND github_login != 'Copilot'
GROUP BY component, github_login
ORDER BY component, pr_count DESC, github_login;
```

## Presentation

Present as a grouped list organized by component:

```
## Suggested Reviewers

### Libraries
#### Process APIs (System.Diagnostics.Process)
- @person1 — authored #124264, merged #124256 (2 PRs)
- @person2 — assigned on #124264 (1 PR)

#### System.Text.Json
- @person5 — authored #123940
- @person6 — reviewed and merged #123940

### ASP.NET Core
#### Blazor
- @person3 — authored #65263, #65393 (2 PRs)

### SDK
- @person4 — authored #42100
```

**Ranking within each area:** list by PR count (descending), then alphabetically.

**Cross-component contributors:** if someone appears across 3+ components, call them out as a potential overall reviewer:

```
### Overall Reviewers
- @person7 — involved in 4 PRs across Libraries, ASP.NET Core, and SDK
```
