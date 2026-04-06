---
name: api-diff
description: >
  Download, inspect, and diff .NET APIs for a given build or release. Use
  `dotnet-inspect` to verify that APIs actually exist in the shipped packages,
  detect missed reverts, and generate before/after API diffs. Use
  `RunApiDiff.ps1` when a full markdown diff report is needed.
---

# API Downloading, Verification, and Diffing

Use this skill when you need evidence about the **actual public API surface** of a .NET build.

This is primarily for:

- confirming whether an API really shipped in the build binaries/ref packs
- catching reverts or incomplete rollouts before they end up in release notes
- generating before/after API diffs for a release milestone

## Preferred workflow

### 1. Query the right build first

Do **not** trust the locally installed SDK for preview work. Query the target build's packages directly.

Use the process in [api-verification.md](../release-notes/references/api-verification.md):

1. Generate or read `build-metadata.json`
2. Get `nuget.source` and the package versions for the target release
3. Run `dotnet-inspect` against those exact packages

### 2. Verify APIs with `dotnet-inspect`

Typical tasks:

- **Find a type or member** to confirm the API exists
- **Compare versions** to see what changed between previews or between RC and GA
- **Validate naming** before writing prose or code samples

Examples:

```bash
# Find a type in the runtime ref pack
dnx dotnet-inspect -y -- find "*AnyNewLine*" \
  --package "Microsoft.NETCore.App.Ref@${VER}" \
  --source "$FEED"

# Verify members on a type
dnx dotnet-inspect -y -- member RegexOptions \
  --package "Microsoft.NETCore.App.Ref@${VER}" \
  --source "$FEED" \
  -k field

# Diff public APIs between two versions
dnx dotnet-inspect -y -- diff \
  --package "Microsoft.NETCore.App.Ref@11.0.0-preview.2..11.0.0-preview.3" \
  --source "$FEED"
```

If the API is missing from the target build, treat that as a serious signal: it may have been renamed, kept internal, or reverted.

### 3. Use `RunApiDiff.ps1` for full diff reports

When the user wants the markdown-ready, repo-shaped API diff output, use `release-notes/RunApiDiff.ps1`. See [release-notes/RunApiDiff.md](../../../release-notes/RunApiDiff.md) for the full parameter reference.

## Mapping natural language to parameters

| User says                                             | Parameters                                                                                                             |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| "generate the next API diff"                          | _(none)_                                                                                                               |
| ".NET 10 GA vs .NET 11 Preview 1"                     | `-PreviousMajorMinor 10.0 -CurrentMajorMinor 11.0 -CurrentPrereleaseLabel preview.1`                                   |
| "net9.0-preview6 to net10.0-preview5"                 | `-PreviousMajorMinor 9.0 -PreviousPrereleaseLabel preview.6 -CurrentMajorMinor 10.0 -CurrentPrereleaseLabel preview.5` |
| ".NET 10 RC 2 vs .NET 10 GA"                          | `-PreviousMajorMinor 10.0 -PreviousPrereleaseLabel rc.2 -CurrentMajorMinor 10.0`                                       |
| "10.0.0-preview.7.25380.108 to 10.0.0-rc.1.25451.107" | `-PreviousVersion "10.0.0-preview.7.25380.108" -CurrentVersion "10.0.0-rc.1.25451.107"`                                |

- **GA** or no qualifier -> omit the `PrereleaseLabel` parameter for `RunApiDiff.ps1`; if a downstream api-diff release label is needed, use `ga`
- **Preview N** / **previewN** -> `-PrereleaseLabel preview.N` (for example, `preview.4`, not `preview4`)
- **RC N** / **rcN** -> `-PrereleaseLabel rc.N`
- **netX.Y-previewN** (TFM format) -> `-MajorMinor X.Y -PrereleaseLabel preview.N`
- Full NuGet version strings -> use `-PreviousVersion` / `-CurrentVersion` directly
- The "previous" version is always the older version; "current" is the newer one

## Running the script

```powershell
.\release-notes\RunApiDiff.ps1 [mapped parameters]
```

Set an initial wait of at least 300 seconds — the script takes several minutes. After completion, summarize the results: how many diff files were generated and where.
