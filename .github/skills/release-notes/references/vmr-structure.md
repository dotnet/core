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

The `release-notes-gen generate changes` tool automates this: it fetches the manifest at both refs, diffs them, queries GitHub for PRs in each commit range, and outputs `changes.json`.

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

## Finding the base tag

To determine what's new in a preview, you need the previous release's VMR tag as the `--base` ref. Two reliable methods:

### Method 1: From VMR tags (preferred)

List tags and find the latest one for the shipped iteration:

```bash
git tag -l 'v11.0.0-preview.*' --sort=-v:refname | head -5
# → v11.0.0-preview.2.26159.112  ← base tag for preview 3
# → v11.0.0-preview.1.26104.118
```

### Method 2: From releases.json

Read the runtime version from `releases.json` and map to a tag:

```bash
jq -r '.releases[0].runtime.version' release-notes/11.0/releases.json
# → 11.0.0-preview.2.26159.112  → tag: v11.0.0-preview.2.26159.112
```

## Version metadata — milestone detection

The VMR's `eng/Versions.props` on `main` tracks the current development milestone:

```xml
<PreReleaseVersionLabel>preview</PreReleaseVersionLabel>
<PreReleaseVersionIteration>3</PreReleaseVersionIteration>
```

This tells you that `main` is currently building **preview.3**. Combined with `releases.json` (which tracks what has shipped) and VMR tags (which provide base refs), this gives a deterministic signal for which milestone needs release notes.

**Key insight**: when a preview ships, a tag is created. Then `main`'s `PreReleaseVersionIteration` is bumped to the next number. So comparing the iteration against the latest shipped release always tells you the current target.

## What's NOT in the VMR

Some .NET components are not in the VMR and won't appear in `source-manifest.json`:

- .NET MAUI (`dotnet/maui`)
- Container images (`dotnet/dotnet-docker`)

These are currently out of scope for automated release notes generation.
