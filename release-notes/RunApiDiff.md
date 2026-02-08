# RunApiDiff Script

The [`RunApiDiff.ps1`](./RunApiDiff.ps1) script automatically generates an API comparison report between two .NET versions, in the format expected for publishing in the dotnet/core repo.

## Prerequisites

- PowerShell 7.0 or later
- Azure CLI (`az login`) if using authenticated Azure DevOps feeds
- The [Microsoft.DotNet.ApiDiff.Tool](https://www.nuget.org/packages/Microsoft.DotNet.ApiDiff.Tool). Install from the transport feed matching the version you're comparing, or use `-InstallApiDiff $true` to have the script install it automatically:

```
dotnet tool install --global Microsoft.DotNet.ApiDiff.Tool --source https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet11-transport/nuget/v3/index.json --prerelease
```

## Quick Start

The simplest usage only requires the NuGet feed URL for the "current" (after) version. All other values are auto-discovered:

```powershell
.\RunApiDiff.ps1 <current-nuget-feed-url>
```

For example, comparing the latest GA release on nuget.org against .NET 11 Preview 1:

```powershell
.\RunApiDiff.ps1 "https://pkgs.dev.azure.com/dnceng/internal/_packaging/11.0.100-preview.1.26104.118-shipping/nuget/v3/index.json"
```

## Parameters

### Version Parameters

All version parameters can be auto-discovered from their respective NuGet feeds. If any are omitted, the script queries the feed for the latest `Microsoft.NETCore.App.Ref` package and parses the version string.

| Parameter | Description | Default |
|---|---|---|
| `PreviousMajorMinor` | The "before" .NET major.minor version (e.g., `10.0`) | Discovered from `PreviousNuGetFeed` |
| `PreviousReleaseKind` | Release kind for the "before" version: `preview`, `rc`, or `ga` | Discovered from `PreviousNuGetFeed` |
| `PreviousPreviewRCNumber` | Preview/RC number for the "before" version (e.g., `1`, `2`) | `0` for GA; discovered from `PreviousNuGetFeed` for preview/rc |
| `CurrentMajorMinor` | The "after" .NET major.minor version (e.g., `11.0`) | Discovered from `CurrentNuGetFeed` |
| `CurrentReleaseKind` | Release kind for the "after" version: `preview`, `rc`, or `ga` | Discovered from `CurrentNuGetFeed` |
| `CurrentPreviewRCNumber` | Preview/RC number for the "after" version (e.g., `1`, `2`) | `0` for GA; discovered from `CurrentNuGetFeed` for preview/rc |

### Feed Parameters

| Parameter | Description | Default |
|---|---|---|
| `CurrentNuGetFeed` | NuGet feed URL for downloading "after" packages. **Positional** — can be passed as the first unnamed argument. | `https://dnceng.pkgs.visualstudio.com/public/_packaging/dotnet10/nuget/v3/index.json` |
| `PreviousNuGetFeed` | NuGet feed URL for downloading "before" packages | `https://api.nuget.org/v3/index.json` |

### Path Parameters

| Parameter | Description | Default |
|---|---|---|
| `CoreRepo` | Path to your local clone of the dotnet/core repo | Git repo root relative to the script |
| `TmpFolder` | Working directory for downloaded and extracted packages | Auto-created temp directory |
| `AttributesToExcludeFilePath` | Path to attributes exclusion file | `ApiDiffAttributesToExclude.txt` (same folder as script) |
| `AssembliesToExcludeFilePath` | Path to assemblies exclusion file | `ApiDiffAssembliesToExclude.txt` (same folder as script) |

### Override Parameters

| Parameter | Description | Default |
|---|---|---|
| `PreviousPackageVersion` | Exact package version for the "before" comparison (e.g., `10.0.0`). Bypasses version search. | *(empty — version is searched)* |
| `CurrentPackageVersion` | Exact package version for the "after" comparison (e.g., `11.0.0-preview.1.26104.118`). Bypasses version search. | *(empty — version is searched)* |

### Flags

| Parameter | Description | Default |
|---|---|---|
| `ExcludeNetCore` | Skip the Microsoft.NETCore.App comparison | `$false` |
| `ExcludeAspNetCore` | Skip the Microsoft.AspNetCore.App comparison | `$false` |
| `ExcludeWindowsDesktop` | Skip the Microsoft.WindowsDesktop.App comparison | `$false` |
| `InstallApiDiff` | Install or update the ApiDiff tool before running | `$false` |

## Examples

Simplest — auto-discover everything from the feeds:

```powershell
.\RunApiDiff.ps1 "https://pkgs.dev.azure.com/dnceng/internal/_packaging/11.0.100-preview.1.26104.118-shipping/nuget/v3/index.json"
```

Explicit version parameters:

```powershell
.\RunApiDiff.ps1 `
   -PreviousMajorMinor 10.0 `
   -PreviousReleaseKind preview `
   -PreviousPreviewRCNumber 1 `
   -CurrentMajorMinor 10.0 `
   -CurrentReleaseKind preview `
   -CurrentPreviewRCNumber 2 `
   -CoreRepo D:\core\ `
   -TmpFolder D:\tmp\
```

With exact package versions:

```powershell
.\RunApiDiff.ps1 `
   -PreviousMajorMinor 10.0 `
   -PreviousReleaseKind rc `
   -PreviousPreviewRCNumber 1 `
   -CurrentMajorMinor 10.0 `
   -CurrentReleaseKind rc `
   -CurrentPreviewRCNumber 2 `
   -PreviousPackageVersion "10.0.0-rc.1.25451.107" `
   -CurrentPackageVersion "10.0.0-rc.2.25502.107"
```

Example of what this script generates: [API diff between .NET 10.0 Preview 1 and .NET 10 Preview 2](https://github.com/dotnet/core/pull/9771)
