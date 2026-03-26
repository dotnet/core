# VMR Structure

How the .NET Virtual Monolithic Repository (VMR) at `dotnet/dotnet` works, and how to use it for release notes generation.

## What is the VMR?

The VMR (`dotnet/dotnet`) contains the source code for the entire .NET product — runtime, libraries, ASP.NET Core, SDK, compilers, and more. It's assembled from ~25 component repositories via an automated process called **codeflow**.

## source-manifest.json — the bill of materials

The file `src/source-manifest.json` is the key to everything. It lists every component repository included in the VMR, with the exact commit SHA that was incorporated:

```json
{
  "repositories": [
    {
      "path": "runtime",
      "remoteUri": "https://github.com/dotnet/runtime",
      "commitSha": "d3439749b652966f8283f2d01c972bc8c4dc3ec3"
    },
    {
      "path": "aspnetcore",
      "remoteUri": "https://github.com/dotnet/aspnetcore",
      "commitSha": "655f41d52f2fc75992eac41496b8e9cc119e1b54"
    }
  ]
}
```

### Using source-manifest.json for release notes

By comparing `source-manifest.json` at two release points, you get:

1. **Which components changed** — repos where `commitSha` differs
2. **Exact commit ranges** — the old SHA and new SHA in each source repo
3. **Which components didn't change** — these get minimal stubs, no investigation needed
4. **Source repo URLs** — for querying PRs via the GitHub compare API

The `dotnet-release generate changes` tool automates this: it fetches the manifest at both refs, diffs them, queries GitHub for PRs in each commit range, and outputs `changes.json`.

## Branch naming

### Long-lived release branches

```text
release/{major}.0.1xx                    # GA release train (e.g., release/10.0.1xx)
release/{major}.0.1xx-preview{N}         # Preview release train (e.g., release/11.0.1xx-preview3)
```

### Tags

Tags come in pairs (runtime and SDK versions) pointing to the same commit:

```text
v{major}.0.0-preview.{N}.{build}         # Runtime version tag
v{major}.0.100-preview.{N}.{build}       # SDK version tag
```

Examples:

- `v11.0.0-preview.2.26159.112` (runtime)
- `v11.0.100-preview.2.26159.112` (SDK)

### Automation branches (ephemeral)

```text
release-pr-{major}.0.100-{label}.{build}   # Release staging PR
darc-release/{band}-{guid}                  # Codeflow dependency update
```

These are created by automation (Maestro/Darc) and are not manually managed. A `release-pr-*` branch signals an imminent release — it contains the version bumps and tooling updates for the release build.

## Codeflow

Code flows between component repos and the VMR via automated PRs:

- **Forward flow** (repo → VMR): component repos push source changes into the VMR
- **Backflow** (VMR → repo): VMR-level changes flow back to component repos

Codeflow PRs come from `dotnet-maestro[bot]` with titles like `[{branch}] Source code updates from dotnet/{repo}`. The `github-merge-flow.jsonc` files in some components define the merge chain (e.g., `release/10.0.1xx → release/10.0.2xx → release/10.0.3xx → main`).

## Finding the previous release tag

To determine what's new in a preview, you need the previous release's VMR tag. Find it by reading the previous preview's `release.json` in this repo:

```text
release-notes/{major}.0/preview/{previous-preview}/release.json
→ .release.runtime.version  (e.g., "11.0.0-preview.2.26159.112")
```

Map that version to a VMR tag: `v11.0.0-preview.2.26159.112`.

## Version metadata

The VMR's `eng/Versions.props` tracks the current version:

- `PreReleaseVersionLabel` — e.g., `preview`
- `PreReleaseVersionIteration` — e.g., `3` (for preview 3)

## What's NOT in the VMR

Some .NET components are not in the VMR and won't appear in `source-manifest.json`:

- .NET MAUI (`dotnet/maui`)
- Container images (`dotnet/dotnet-docker`)

These are currently out of scope for automated release notes generation.
