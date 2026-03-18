# GitHub Tool Usage Patterns

Common guidance for interacting with GitHub data throughout the release notes pipeline.

## Primary: GitHub MCP server

Use the GitHub MCP server tools as the primary method for all GitHub API interactions. These tools provide structured data without requiring shell commands.

## Fallback: GitHub CLI (`gh`)

If the GitHub MCP server is unavailable, fall back to the `gh` CLI. Verify availability with `gh --version` first. The `gh api` command is also useful for endpoints not covered by MCP tools (e.g., branch comparison).

## MCP response size management

GitHub MCP search tools that return large payloads get saved to temporary files on disk. Prevent this by keeping individual search result sets small:

- Use **label-scoped searches** (e.g., `label:area-System.Text.Json`) instead of fetching all merged PRs at once.
- Use `perPage: 30` or less for search queries. Only use `perPage: 100` for targeted queries expected to return few results.
- If a search response is saved to a temp file, use the `view` tool (with `view_range` for large files) to read it — **never** use shell commands to read these files.

## Parallel fetching

Multiple independent reads can be issued in parallel for efficiency:

- Fetch multiple PR details in a single response
- Fetch multiple issue details in a single response
- Run label-scoped PR searches in parallel batches
- Fetch VMR commit details in parallel

## Data storage

Store all fetched data using the **SQL tool**. Do **not** write cache files to disk. Use SQL queries for all subsequent filtering, ranking, and reporting.

See [sql-storage.md](sql-storage.md) for the common schema.
