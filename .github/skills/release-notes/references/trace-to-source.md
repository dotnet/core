# Trace VMR Changes to Source Repo PRs

After the VMR diff identifies which components changed, this step builds the complete list of candidate PRs and **verifies each one is on the VMR release branch** using the local clone.

## Two-pronged discovery

1. **Forward trace (VMR → source)** — PR numbers from VMR sync commit messages
2. **Reverse search (source repo → VMR)** — search source repos by date range, then verify against the VMR release branch

The local clone is the **verification authority**: a PR is only a candidate if its changes are reachable from the VMR release reference.

## Forward trace: PRs from VMR sync commits

For each PR number extracted from VMR sync commit messages during the [VMR diff step](vmr-diff.md):

1. **Fetch the PR** from the source repo:

   ```
   pull_request_read(
     method: "get",
     owner: "<owner>",
     repo: "<repo>",
     pullNumber: <number>
   )
   ```

2. **Apply exclusion filters** — skip PRs that are:
   - Labeled `backport`, `servicing`, or `NO-MERGE`
   - Titled with `[release/` prefix or containing `backport`
   - Purely test, CI, or documentation changes (no `src/` changes)
   - Dependency update PRs (authored by `dotnet-maestro[bot]`)

3. **Mark as candidate** with `vmr_confirmed = 1` — these came directly from the VMR commit log, so they are inherently on the release branch.

## Reverse search: source repo PR discovery

For each component with VMR changes, search the source repo for PRs merged in the date range (derived from VMR diff in [Step 5 of vmr-diff.md](vmr-diff.md#step-5-derive-the-date-range)):

### For dotnet/runtime (Libraries + Runtime)

Search by area labels, scoped to the date range:

```
search_pull_requests(
  owner: "dotnet",
  repo: "runtime",
  query: "is:merged merged:<start-date>..<end-date> label:<area-label>",
  perPage: 30
)
```

### For dotnet/aspnetcore

Search by milestone:

```
search_pull_requests(
  owner: "dotnet",
  repo: "aspnetcore",
  query: "is:merged milestone:<MAJOR>.0-preview<N>",
  perPage: 30
)
```

### For other repos

Search by date range:

```
search_pull_requests(
  owner: "dotnet",
  repo: "<repo>",
  query: "is:merged merged:<start-date>..<end-date>",
  perPage: 30
)
```

Apply the same exclusion filters as forward trace. Page through all results.

## VMR verification of reverse-search PRs (LOCAL CLONE)

This is the critical quality gate. For each PR found via reverse search that was NOT already confirmed via forward trace, **verify it is on the VMR release branch** using the local clone.

### Method 1: Search for PR-specific code on the release branch

Use `git grep` at the release ref to check for distinctive code from the PR:

```bash
cd <vmr-clone-path>

# Search for a unique symbol (type name, method name, string literal) at the release ref
git grep -l "<UniqueTypeName>" origin/<current-ref> -- src/<component-path>/
```

Choose a symbol that is unique to this PR — a new type, method, or constant that would only exist if the PR was synced. If `git grep` finds it at the release ref, the PR's changes are confirmed present.

### Method 2: Search VMR commit messages for the source PR number

```bash
# Check if any VMR commit between releases references this PR
git log --oneline <previous-tag>..origin/<current-ref> --grep="<repo>#<pr-number>"
git log --oneline <previous-tag>..origin/<current-ref> --grep="<repo>/pull/<pr-number>"
```

### Method 3: Diff a specific file at the release ref

If the PR changed a specific file, compare that file between the two release refs:

```bash
# Check if the file was modified between releases
git diff <previous-tag>..origin/<current-ref> -- src/<component-path>/<specific-file>
```

If the diff shows the changes from the PR, it is confirmed present.

### Verification outcome

- **Confirmed** — mark `vmr_confirmed = 1`, add to candidates
- **Not found** — mark `vmr_confirmed = 0` with reason:

```sql
UPDATE prs SET vmr_confirmed = 0, exclusion_reason = 'changes not found on VMR release branch'
WHERE number = <pr_number> AND repo = '<repo>';
```

Report unconfirmed PRs to the user — they may have been merged in the source repo but not yet synced to the VMR for this release.

## Binary verification with dotnet-inspect

As a complementary quality gate, use `dotnet-inspect` to verify new **public APIs** exist in the actual compiled binaries from nightly builds. This catches two things git grep cannot:

1. **APIs that shipped in the previous preview** — `git grep` only checks "is it on the P3 branch?" but doesn't check "was it already on the P2 branch?" A new type found in both P2 and P3 binaries means it shipped in P2 and should be deduped.
2. **APIs that exist in source but aren't public** — internal types/methods appear in source but not in ref assemblies.

### Finding nightly package versions

Canonical references for nightly build feeds:
- **VMR builds table**: <https://github.com/dotnet/dotnet/blob/main/docs/builds-table.md>
- **Runtime dogfooding guide**: <https://github.com/dotnet/runtime/blob/main/docs/project/dogfooding.md>

The nightly feed for .NET `<MAJOR>` is `https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet<MAJOR>/nuget/v3/index.json` (equivalent to `https://dnceng.pkgs.visualstudio.com/public/_packaging/dotnet<MAJOR>/nuget/v3/index.json`). Use the runtime version from the VMR release reference to find the matching package:

```bash
dnx dotnet-inspect -y -- package Microsoft.NETCore.App.Ref --versions --prerelease \
  --source https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet<MAJOR>/nuget/v3/index.json \
  | grep "preview.<N>"
```

> **Note**: For released previews (e.g. P2 after GA), the ref packages are also on nuget.org. For in-progress previews (e.g. P3 before release), the nightly feed is the only source.

### Verifying a type exists in a specific build

```bash
# Check if a new type exists in the P3 build
dnx dotnet-inspect -y -- find "<TypeName>" \
  --package Microsoft.NETCore.App.Ref@<P3-version> \
  --source https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet<MAJOR>/nuget/v3/index.json

# Check if it also existed in the P2 build (dedup check)
dnx dotnet-inspect -y -- find "<TypeName>" \
  --package Microsoft.NETCore.App.Ref@<P2-version>
```

If the type is found in **both** P2 and P3 builds, it shipped in P2 and should NOT be documented as a P3 feature — even if the VMR git grep confirms it's on the P3 branch.

### Inspecting API surface of new types

```bash
# Get full API surface of a new type
dnx dotnet-inspect -y -- member <TypeName> \
  --package Microsoft.NETCore.App.Ref@<version> \
  --source <nightly-feed>
```

Use this to verify code samples in release notes match the actual public API surface.

### Package mapping for other components

| Component | Ref Package | Notes |
|-----------|------------|-------|
| Libraries + Runtime | `Microsoft.NETCore.App.Ref` | Core BCL types |
| ASP.NET Core | `Microsoft.AspNetCore.App.Ref` | ASP.NET Core types |
| EF Core | `Microsoft.EntityFrameworkCore` | Regular NuGet package |
| Windows Forms | `Microsoft.WindowsDesktop.App.Ref` | Windows-only ref package |
| WPF | `Microsoft.WindowsDesktop.App.Ref` | Windows-only ref package |

## Handle PRs spanning multiple components

Some PRs touch code in multiple VMR component paths. For these:

- Assign to the **primary** component where the most significant user-facing change is
- Cross-reference from the other component's release notes if relevant

## Store results

```sql
INSERT INTO prs (number, repo, component, title, author, merged_at, vmr_confirmed, is_candidate)
VALUES (<number>, '<repo>', '<component>', '<title>', '<author>', '<date>', 1, 1);
```

After this step, the `prs` table contains all candidate PRs, each **verified as present on the VMR release branch** via the local clone.
