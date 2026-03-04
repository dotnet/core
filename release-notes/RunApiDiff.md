# RunApiDiff Script

The [`RunApiDiff.ps1`](./RunApiDiff.ps1) script automatically generates an API comparison report between two .NET versions, in the format expected for publishing in the dotnet/core repo.

## Prerequisites

- PowerShell 7.0 or later
- The Microsoft.DotNet.ApiDiff.Tool. Use `-InstallApiDiff` to have the script install it automatically from the transport feed constructed from the current version's major version (`https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet{MAJOR}-transport/nuget/v3/index.json`), or install it manually:

```shell
dotnet tool install --global Microsoft.DotNet.ApiDiff.Tool --source https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet{MAJOR}-transport/nuget/v3/index.json --prerelease
```

## Quick Start

When run with no arguments, the script infers the next version to diff by scanning existing `api-diff` folders in the repository. For example, if the latest api-diff is for .NET 10 GA, it will automatically generate a diff for .NET 11 Preview 1.

```powershell
.\RunApiDiff.ps1
```

## Parameters

### Version Parameters

By default the script assumes a diff will be produced for the next preview. When no version information is provided, the script scans existing `api-diff` folders in the repository to find the latest version and infers the next one in the progression (preview.1 → preview.2 → ... → preview.7 → rc.1 → rc.2 → GA → next major preview.1). When `PreviousVersion` or `CurrentVersion` is provided, the `MajorMinor` and `PrereleaseLabel` values are extracted from it automatically.

| Parameter | Description | Default |
|---|---|---|
| `PreviousVersion` | Exact package version for the "before" comparison (e.g., `10.0.0-preview.7.25380.108`). MajorMinor and PrereleaseLabel are extracted automatically. | *(empty — inferred or searched)* |
| `CurrentVersion` | Exact package version for the "after" comparison (e.g., `10.0.0-rc.1.25451.107`). MajorMinor and PrereleaseLabel are extracted automatically. | *(empty — inferred or searched)* |
| `PreviousMajorMinor` | The "before" .NET major.minor version (e.g., `10.0`) | Inferred from api-diffs, extracted from `PreviousVersion`, or discovered from `PreviousNuGetFeed` |
| `PreviousPrereleaseLabel` | Prerelease label for the "before" version (e.g., `preview.7`, `rc.1`). Omit for GA. | Inferred from api-diffs, extracted from `PreviousVersion`, or discovered from `PreviousNuGetFeed` |
| `CurrentMajorMinor` | The "after" .NET major.minor version (e.g., `10.0`) | Inferred from api-diffs, extracted from `CurrentVersion`, or discovered from `CurrentNuGetFeed` |
| `CurrentPrereleaseLabel` | Prerelease label for the "after" version (e.g., `preview.7`, `rc.1`). Omit for GA. | Inferred from api-diffs, extracted from `CurrentVersion`, or discovered from `CurrentNuGetFeed` |

### Feed Parameters

| Parameter | Description | Default |
|---|---|---|
| `CurrentNuGetFeed` | NuGet feed URL for downloading "after" packages | `https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet-public/nuget/v3/index.json` |
| `PreviousNuGetFeed` | NuGet feed URL for downloading "before" packages | `https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet-public/nuget/v3/index.json` |

### Path Parameters

| Parameter | Description | Default |
|---|---|---|
| `CoreRepo` | Path to your local clone of the dotnet/core repo | Git repo root relative to the script |
| `TmpFolder` | Working directory for downloaded and extracted packages | Auto-created temp directory |
| `AttributesToExcludeFilePath` | Path to attributes exclusion file | `ApiDiffAttributesToExclude.txt` (same folder as script) |
| `AssembliesToExcludeFilePath` | Path to assemblies exclusion file | `ApiDiffAssembliesToExclude.txt` (same folder as script) |

### Switches

| Parameter | Description |
|---|---|
| `ExcludeNetCore` | Skip the Microsoft.NETCore.App comparison |
| `ExcludeAspNetCore` | Skip the Microsoft.AspNetCore.App comparison |
| `ExcludeWindowsDesktop` | Skip the Microsoft.WindowsDesktop.App comparison |
| `InstallApiDiff` | Install or update the ApiDiff tool from the current transport feed |

## Examples

```powershell
# Infer the previous version from the most recent existing api-diff
# and infer the the current version to be the next version after it
.\RunApiDiff.ps1

# Specify only the current version; previous is inferred from existing api-diffs
.\RunApiDiff.ps1 -CurrentMajorMinor 11.0 -CurrentPrereleaseLabel preview.2

# Specify both versions explicitly
.\RunApiDiff.ps1 `
   -PreviousMajorMinor 10.0 -PreviousPrereleaseLabel preview.7 `
   -CurrentMajorMinor 10.0 -CurrentPrereleaseLabel rc.1

# Use exact NuGet package versions (MajorMinor and PrereleaseLabel are extracted automatically)
.\RunApiDiff.ps1 `
   -PreviousVersion "10.0.0-preview.7.25380.108" `
   -CurrentVersion "10.0.0-rc.1.25451.107"

# Use a custom feed for the current version's packages
.\RunApiDiff.ps1 `
   -CurrentNuGetFeed "https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet11/nuget/v3/index.json"
```

Example of what this script generates: [API diff between .NET 10 GA and .NET 11 Preview 1 (dotnet/core#10240)](https://github.com/dotnet/core/pull/10240/changes)
