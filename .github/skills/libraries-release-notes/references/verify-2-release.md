# Verify: Confirm Inclusion in Release Branch

After collecting and enriching candidates (including any manually added PRs), verify that candidate changes actually shipped in the target release by checking the `dotnet/dotnet` Virtual Monolithic Repository (VMR). The VMR contains all .NET source code — including `dotnet/runtime` under `src/runtime/` — and its release branches represent what ships in each preview.

## Determine the release branch name

The expected branch name pattern is:

```
release/<MAJOR>.0.1xx-<prerelease>
```

For example:
- .NET 11 Preview 1 → `release/11.0.1xx-preview1`
- .NET 11 Preview 2 → `release/11.0.1xx-preview2`
- .NET 11 RC 1 → `release/11.0.1xx-rc1`

Use the GitHub MCP server (or CLI fallback) to verify the branch exists:

```
list_branches(
  owner: "dotnet",
  repo: "dotnet"
)
```

If the expected branch is **not found**, search for branches matching `release/<MAJOR>.0*` and present the user with the matching branch names so they can select the correct one.

## Spot-check that the newest changes are included

Start from the most recently merged PRs in the candidate list and work backward. For each PR, verify its changes are present in the VMR release branch by either:

1. **Searching for code** introduced by the PR in the `dotnet/dotnet` repo:

   ```
   search_code(
     query: "repo:dotnet/dotnet path:src/runtime <distinctive symbol or text from the PR>"
   )
   ```

2. **Checking commit history** on the release branch for runtime source code updates that post-date the PR merge:

   ```
   list_commits(
     owner: "dotnet",
     repo: "dotnet",
     sha: "release/<MAJOR>.0.1xx-<prerelease>",
     perPage: 30
   )
   ```

   Look for commits with messages like `"Source code updates from dotnet/runtime"` dated after the PR's merge date. The dotnet-maestro bot regularly syncs changes from `dotnet/runtime` into the VMR.

Stop checking after **2 consecutive PRs are confirmed present** — if the two newest changes made it into the release branch, older changes are also included.

If any change is **not found** in the release branch, inform the user that the feature may not have been included in this preview release. Suggest either:
- Moving that feature to the **next preview's** release notes
- Confirming with the release team whether a late sync occurred
