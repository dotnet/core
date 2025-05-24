# RunApiDiff Script

The [`RunApiDiff.ps1`](./RunApiDiff.ps1) script can automatically generate an API comparison report for two specified .NET previews, in the format expected for publishing in the dotnet/core repo.

## Instructions

1. Clone the dotnet/core repo. Let's assume you clone it into `D:\core`.
2. Create a temporary directory. Let's assume you create it in `D:\tmp`.
3. Install or update your copy of the APIDiff tool (use the latest transport feed):
```
dotnet tool install --global Microsoft.DotNet.ApiDiff.Tool --source https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet10-transport/nuget/v3/index.json --prerelease
```
4. Run the command. Execution example:

```powershell
.\RunApiDiff.ps1 `
   -PreviousDotNetVersion 10.0 `
   -PreviousPreviewOrRC preview `
   -PreviousPreviewNumberVersion 1 `
   -CurrentDotNetVersion 10.0 `
   -CurrentPreviewOrRC preview `
   -CurrentPreviewNumberVersion 2 `
   -CoreRepo D:\core\ `
   -TmpFolder D:\tmp\
```

Example of what this script generates: [API diff between .NET 10.0 Preview1 and .NET 10 Preview2](https://github.com/dotnet/core/pull/9771)
