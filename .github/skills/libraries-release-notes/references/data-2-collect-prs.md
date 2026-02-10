# Step 2: Collect and Filter PRs

## Fetch Merged PRs

Pull all merged PRs in the date range from the specified repository. The primary method is the **GitHub MCP server** tools; fall back to the **GitHub CLI (`gh`)** if the MCP server is unavailable.

### Primary — GitHub MCP server

Use `search_pull_requests` to query for merged PRs. The initial query should fetch **all** merged PRs in the date range without label filtering, to avoid missing PRs labeled with less-common area labels (e.g. `area-System.DateTime`, `area-System.Reflection.Emit`, `area-System.Globalization`). Split the date range into sub-ranges if needed to stay within GitHub's 1,000-result search limit.

```
search_pull_requests(
  owner: "dotnet",
  repo: "runtime",
  query: "is:merged merged:2025-12-01..2026-02-01",
  perPage: 100
)
```

Page through results (incrementing `page`) until all PRs are collected. If a single date range returns close to 1,000 results, split into smaller sub-ranges (e.g. halve the range) and repeat. Do **not** restrict the initial search to specific area labels — label-based filtering happens later in the filtering step.

### Fallback — GitHub CLI

If the GitHub MCP server is not available, use the `gh` CLI instead. Verify availability with `gh --version` first.

```bash
REPO="dotnet/runtime"  # Set from user input

# First batch (newer half of range)
gh pr list --repo "$REPO" --state merged \
  --search "merged:2025-12-01..2026-02-01" \
  --limit 1000 --json number,title,labels,author,mergedAt,url

# Second batch (older half of range)
gh pr list --repo "$REPO" --state merged \
  --search "merged:2025-10-01..2025-12-01" \
  --limit 1000 --json number,title,labels,author,mergedAt,url
```

### Data storage

Store all fetched PR data using the **SQL tool** (see [workflow.md](workflow.md) for schema). Do **not** write cache files to disk — disk I/O triggers approval prompts. Insert each PR into the `prs` table and use SQL queries for all subsequent filtering.

## Filter to Library PRs

### Label-based filtering

From the merged set, keep only PRs that have a label matching any `area-System.*`, `area-Microsoft.Extensions*`, or `area-Extensions-*` pattern. Match the label prefix broadly — do **not** use a hard-coded list of specific area labels, as that risks missing PRs labeled with less-common areas (e.g. `area-System.DateTime`, `area-System.Reflection.Emit`, `area-System.Globalization`).

**PRs without area labels.** PR labels cannot be entirely trusted — some PRs lack an `area-*` label altogether. Do not discard these PRs immediately. Instead, check their linked or related issues (from the PR description's "Fixes #..." references) for `area-*` labels. If a related issue carries a matching `area-System.*`, `area-Microsoft.Extensions*`, or `area-Extensions-*` label, include the PR in the candidate list.

Additionally exclude:
- Labels: `backport`, `servicing`, `NO-MERGE`
- PRs whose title starts with `[release/` or contains `backport`
- PRs that are purely test, CI, or documentation changes (no `src` changes)

### Cross-reference with API diff

If the API diff was loaded in [Step 1](data-1-apidiff-review.md), cross-reference the candidate PRs against the new APIs. For each new API or namespace in the diff, verify that at least one candidate PR covers it. If an API in the diff has **no matching PR**, search for the implementing PR explicitly:

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

Mark matching PRs as candidates in the SQL `prs` table (`is_candidate = 1`).
