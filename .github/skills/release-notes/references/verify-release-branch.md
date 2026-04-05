# Verify: Confirm Inclusion in Release Branch

After collecting and enriching candidates (including any manually added PRs), verify that candidate changes actually shipped in the target release.

## Default: VMR verification

By default, verify against the `dotnet/dotnet` Virtual Monolithic Repository (VMR), which contains all .NET source code. Its release branches represent what ships in each preview.

## Team-specific overrides

Some teams verify against their own repository instead of the VMR. **If the team context specifies a release branch override** (different repo, branch pattern, or verification steps), use those instead of the VMR defaults below. The team context takes precedence for:

- **Repository** — which repo to check (e.g., `dotnet/aspnetcore` instead of `dotnet/dotnet`)
- **Branch pattern** — how the release branch is named (e.g., `release/<MAJOR>.0-preview<N>` instead of the VMR pattern)
- **Verification steps** — any team-specific process for confirming inclusion (e.g., checking for backport PRs)

When team overrides apply, skip the VMR-specific sections below and follow the team context's instructions instead.

## Determine the release branch name

The expected branch name pattern is:

```
release/<MAJOR>.0.1xx-<prerelease>
```

The `1xx` is the SDK feature band — `1xx` is standard for the first SDK release of a major version.

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
     query: "repo:dotnet/dotnet path:src/<component> <distinctive symbol or text from the PR>"
   )
   ```

   The `path` prefix depends on the team context — e.g., `src/runtime/` for Libraries and Runtime, `src/aspnetcore/` for ASP.NET Core.

2. **Checking commit history** on the release branch for source code updates that post-date the PR merge:

   ```
   list_commits(
     owner: "dotnet",
     repo: "dotnet",
     sha: "release/<MAJOR>.0.1xx-<prerelease>",
     perPage: 30
   )
   ```

   Look for commits with messages like `"Source code updates from dotnet/<repo>"` dated after the PR's merge date. The dotnet-maestro bot regularly syncs changes from component repos into the VMR.

Stop checking after **2 consecutive PRs are confirmed present** — the VMR syncs from component repos in chronological order, so if the two most recently merged changes made it into the release branch, older changes merged before them are also included. If a gap is found (e.g., PR #5 is present but PR #4 is missing), investigate PR #4 specifically before moving on.

If any change is **not found** in the release branch, inform the user that the feature may not have been included in this preview release. Suggest either:
- Moving that feature to the **next preview's** release notes
- Confirming with the release team whether a late sync occurred
