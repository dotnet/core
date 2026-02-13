# Script Parameters

Build the PowerShell command from the mapped parameters. Always run from the repository root.

```powershell
.\release-notes\RunApiDiff.ps1 [mapped parameters]
```

## Version parameters

All optional — auto-inferred from existing api-diffs if omitted.

- `-PreviousMajorMinor` — e.g., `10.0`
- `-PreviousPrereleaseLabel` — e.g., `preview.7`, `rc.1` (omit for GA)
- `-CurrentMajorMinor` — e.g., `11.0`
- `-CurrentPrereleaseLabel` — e.g., `preview.1`, `rc.2` (omit for GA)
- `-PreviousVersion` — exact NuGet version string (alternative to MajorMinor+PrereleaseLabel)
- `-CurrentVersion` — exact NuGet version string (alternative to MajorMinor+PrereleaseLabel)

## Feed parameters

Usually not needed.

- `-CurrentNuGetFeed` — defaults to `https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet{MAJOR}/nuget/v3/index.json`
- `-PreviousNuGetFeed` — defaults to `https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet{MAJOR}/nuget/v3/index.json`

## Switches

- `-ExcludeNetCore` — skip the Microsoft.NETCore.App comparison
- `-ExcludeAspNetCore` — skip the Microsoft.AspNetCore.App comparison
- `-ExcludeWindowsDesktop` — skip the Microsoft.WindowsDesktop.App comparison
- `-InstallApiDiff` — install or update the ApiDiff tool before running
