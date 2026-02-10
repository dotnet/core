# Step 2: Collect and Filter PRs

## MCP response size

GitHub MCP search tools that return large payloads get saved to temporary files on disk — reading those files back requires PowerShell commands that trigger approval prompts. Prevent this by keeping individual search result sets small:

- Use **label-scoped searches** (e.g. `label:area-System.Text.Json`) instead of fetching all merged PRs at once.
- Use `perPage: 30` or less for search queries. Only use `perPage: 100` for targeted queries that are expected to return few results.
- If a search response is saved to a temp file anyway, use the `view` tool (with `view_range` for large files) to read it — **never** use PowerShell/shell commands to read or parse these files.

## Fetch Merged PRs

Pull merged PRs in the date range from the specified repository, filtered to library areas. The primary method is the **GitHub MCP server** tools; fall back to the **GitHub CLI (`gh`)** if the MCP server is unavailable.

### Primary — GitHub MCP server

Use `search_pull_requests` with **label-scoped queries** to keep result sets small and avoid large responses being saved to temp files on disk (which then require shell commands to read — triggering approval prompts).

Search for merged PRs one area label at a time. The most common library area labels are listed below, but also search with the broader `label:area-System.` prefix to catch less-common areas:

```
# Search per area label — one query per label, small result sets
search_pull_requests(
  owner: "dotnet",
  repo: "runtime",
  query: "is:merged merged:2026-01-26..2026-02-11 label:area-System.Text.Json",
  perPage: 30
)
```

**Recommended area labels to search** (run these in parallel batches):

- `area-System.Text.Json`, `area-System.Net.Http`, `area-System.Collections`
- `area-System.IO`, `area-System.IO.Compression`, `area-System.Threading`
- `area-System.Numerics`, `area-System.Runtime`, `area-System.Memory`
- `area-System.Security`, `area-System.Diagnostics`, `area-System.Globalization`
- `area-System.Linq`, `area-System.Reflection`, `area-System.Reflection.Emit`
- `area-System.Formats.*`, `area-System.Net.*`, `area-System.Text.*`
- `area-Microsoft.Extensions.*`, `area-Extensions-*`

After the label-scoped searches, do a **catch-all search** for any remaining library PRs that may use uncommon area labels. Use a broad query but keep `perPage` small:

```
search_pull_requests(
  owner: "dotnet",
  repo: "runtime",
  query: "is:merged merged:2026-01-26..2026-02-11 label:area-System",
  perPage: 30
)
```

Page through results (incrementing `page`) until all PRs for each query are collected. Deduplicate by PR number across all queries before inserting into the database.

**PRs without area labels.** Some PRs lack an `area-*` label altogether. To catch these, also run a search without label filters but restricted to a short date range and `perPage: 30`. Check the title and description of unlabeled PRs for library-relevant content. If a PR references a library issue (via "Fixes #..." links), fetch the issue to check for `area-*` labels.

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

Store all fetched PR data using the **SQL tool**. Do **not** write cache files to disk — disk I/O triggers approval prompts. Insert each PR into the `prs` table and use SQL queries for all subsequent filtering.

```sql
CREATE TABLE prs (
    number INTEGER PRIMARY KEY,
    title TEXT,
    author TEXT,
    author_association TEXT,
    labels TEXT,           -- comma-separated label names
    merged_at TEXT,
    body TEXT,
    reactions INTEGER DEFAULT 0,
    is_library INTEGER DEFAULT 0,
    is_candidate INTEGER DEFAULT 0
);

CREATE TABLE issues (
    number INTEGER PRIMARY KEY,
    title TEXT,
    body TEXT,
    labels TEXT,
    reactions INTEGER DEFAULT 0,
    pr_number INTEGER     -- the PR that references this issue
);
```

Additional PRs can be added to the candidate list manually by number. Use [Enrich](data-3-enrich.md) to fetch their details.

## Filter to Library PRs

Since the search queries above are already scoped to library area labels, most results will be relevant. Apply these additional filters before marking PRs as candidates:

### Exclusion filters
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
