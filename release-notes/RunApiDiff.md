# RunApiDiff Script

The [`RunApiDiff.ps1`](./RunApiDiff.ps1) script automatically generates an API comparison report between two .NET versions, in the format expected for publishing in the dotnet/core repo.

## Prerequisites

- PowerShell 7.0 or later
- Azure CLI (`az login`) if using authenticated Azure DevOps feeds
- The [Microsoft.DotNet.ApiDiff.Tool](https://www.nuget.org/packages/Microsoft.DotNet.ApiDiff.Tool). Install from the transport feed matching the version you're comparing, or use `-InstallApiDiff $true` to have the script install it automatically:

```
dotnet tool install --global Microsoft.DotNet.ApiDiff.Tool --prerelease
```

## Quick Start

Provide the current version information — either the major/minor and prerelease label, or the full version number. The current NuGet feed is automatically constructed from the major version (e.g., `dotnet11` for .NET 11).

```powershell
.\RunApiDiff.ps1 -CurrentMajorMinor 11.0 -CurrentPrereleaseLabel preview.1
```

## Parameters

### Version Parameters

All version parameters can be auto-discovered from their respective NuGet feeds. If any are omitted, the script queries the feed for the latest `Microsoft.NETCore.App.Ref` package and parses the version string. When `PreviousVersion` or `CurrentVersion` is provided, the `MajorMinor` and `PrereleaseLabel` values are extracted from it automatically.

| Parameter | Description | Default |
|---|---|---|
| `PreviousVersion` | Exact package version for the "before" comparison (e.g., `10.0.0-preview.7.25380.108`). MajorMinor and PrereleaseLabel are extracted automatically. | *(empty — version is searched)* |
| `CurrentVersion` | Exact package version for the "after" comparison (e.g., `10.0.0-rc.1.25451.107`). MajorMinor and PrereleaseLabel are extracted automatically. | *(empty — version is searched)* |
| `PreviousMajorMinor` | The "before" .NET major.minor version (e.g., `10.0`) | Extracted from `PreviousVersion` or discovered from `PreviousNuGetFeed` |
| `PreviousPrereleaseLabel` | Prerelease label for the "before" version (e.g., `preview.7`, `rc.1`). Omit for GA. | Extracted from `PreviousVersion` or discovered from `PreviousNuGetFeed` |
| `CurrentMajorMinor` | The "after" .NET major.minor version (e.g., `10.0`) | Extracted from `CurrentVersion` or discovered from `CurrentNuGetFeed` |
| `CurrentPrereleaseLabel` | Prerelease label for the "after" version (e.g., `preview.7`, `rc.1`). Omit for GA. | Extracted from `CurrentVersion` or discovered from `CurrentNuGetFeed` |

### Feed Parameters

| Parameter | Description | Default |
|---|---|---|
| `CurrentNuGetFeed` | NuGet feed URL for downloading "after" packages | Constructed from `CurrentMajorMinor`: `https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet{MAJOR}/nuget/v3/index.json` |
| `PreviousNuGetFeed` | NuGet feed URL for downloading "before" packages | `https://api.nuget.org/v3/index.json` |

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
| `InstallApiDiff` | Install or update the ApiDiff tool before running |

## Examples

Simplest — provide the current version info, previous defaults to latest GA on nuget.org:

```powershell
.\RunApiDiff.ps1 -CurrentMajorMinor 11.0 -CurrentPrereleaseLabel preview.1
```

Explicit version parameters (comparing .NET 10.0 Preview 7 to RC 1):

```powershell
.\RunApiDiff.ps1 `
   -PreviousMajorMinor 10.0 `
   -PreviousPrereleaseLabel preview.7 `
   -CurrentMajorMinor 10.0 `
   -CurrentPrereleaseLabel rc.1
```

With exact package versions (MajorMinor and PrereleaseLabel are extracted automatically):

```powershell
.\RunApiDiff.ps1 `
   -PreviousVersion "10.0.0-preview.7.25380.108" `
   -CurrentVersion "10.0.0-rc.1.25451.107"
```

Specifying only a previous version — current is auto-discovered from its default feed, generating a diff of all APIs added since .NET 8.0:

```powershell
.\RunApiDiff.ps1 `
   -PreviousVersion "8.0.0" `
   -CurrentMajorMinor 11.0 `
   -CurrentPrereleaseLabel preview.1
```

With a custom feed URL:

```powershell
.\RunApiDiff.ps1 `
   -CurrentNuGetFeed "https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet11/nuget/v3/index.json"
```

Example of what this script generates: [API diff between .NET 10 GA and .NET 11 Preview 1 (dotnet/core#10240)](https://github.com/dotnet/core/pull/10240/changes)
