# API Diff Review (Optional Step)

> **This step is optional.** It applies only to teams whose team context specifies API diff review. Teams that produce components with significant public API surface (e.g., Libraries, WinForms, ASP.NET Core) benefit from cross-referencing new APIs with candidate PRs.

## Locate the API diff

Locate and load the API diff for the target release. The API diff provides context about which APIs were added or changed and significantly improves the quality of the generated release notes.

The API diff lives under the `release-notes` folder within an `api-diff` subfolder for the target release. The team context specifies the exact path pattern. For example:
* .NET 11 Preview 1: `release-notes/11.0/preview/preview1/api-diff/Microsoft.NETCore.App/11.0-preview1.md`
* .NET 10 RC 2: `release-notes/10.0/preview/rc2/api-diff/Microsoft.NETCore.App/10.0-RC2.md`

The API diff may not be available in the current branch yet. If the expected API diff path does not exist in the local clone, search for a pull request in `dotnet/core` that introduces the needed API diff:

```
search_pull_requests(
  owner: "dotnet",
  repo: "core",
  query: "API diff <version> <preview>"
)
```

If a PR with the API diff is found, fetch the diff files from that PR's branch. If no API diff is available from any source, warn the user and ask whether to proceed without it.

## Load the API diff

Once the API diff is located, load all of the API difference files under the appropriate subfolder. Read every diff file to understand the full set of APIs that have been added or changed in the release.

## Cross-reference with candidate PRs

After candidate PRs are collected (see [collect-prs.md](collect-prs.md)), cross-reference them against the new APIs. For each new API or namespace in the diff, verify that at least one candidate PR covers it. If an API in the diff has **no matching PR**, search for the implementing PR explicitly:

```
search_pull_requests(
  owner: "<owner>",
  repo: "<repo>",
  query: "is:merged <API name or type name>"
)
```

This catches PRs that were missed by the date range or that lacked a recognized area label. Add any discovered PRs to the candidate list.

Also use the API diff to discover **issues** that drove new APIs. Many approved APIs originate from `api-approved` issues. Use `search_issues` to find related issues:

```
search_issues(
  owner: "<owner>",
  repo: "<repo>",
  query: "label:api-approved <API name or type name>"
)
```

If such issues exist, trace them to their implementing PRs and ensure those PRs are in the candidate list.

## Unmatched API surface area

After cross-referencing, if any substantial new APIs in the diff still cannot be correlated to a PR or issue, include a placeholder section in the release notes. Use a `**TODO**` marker so the author can manually resolve it later:

```markdown
## <New API or Feature Name>

**TODO:** The API diff shows new surface area for `<Namespace.TypeName>` but the implementing PR/issue could not be found. Investigate and fill in this section.
```

Report these unmatched APIs during the [confirm and finalize](../SKILL.md) step so the user is aware.
