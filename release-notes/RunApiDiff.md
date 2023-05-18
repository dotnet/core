# RunApiDiff Script

The [`RunApiDiff.ps1`](./RunApiDiff.ps1) script can automatically generate an API comparison report for two specified .NET previews, in the format expected for publishing in the dotnet/core repo.

## Instructions

1. Clone the dotnet/arcade repo. Let's assume you clone it into `D:\arcade`.
2. Clone the dotnet/core repo. Let's assume you clone it into `D:\core`.
3. Create a temporary directory. Let's assume you create it in `D:\tmp`.
4. Run the command. Execution example:

```powershell
.\RunApiDiff.ps1 `
   -PreviousDotNetVersion 8.0 `
   -PreviousPreviewOrRC preview `
   -PreviousPreviewNumberVersion 2 `
   -CurrentDotNetVersion 8.0 `
   -CurrentPreviewOrRC preview `
   -CurrentPreviewNumberVersion 3 `
   -CoreRepo D:\core\ `
   -ArcadeRepo D:\arcade\ `
   -TmpFolder D:\tmp\
```

Examples of what this script generates:

- PR comparing .NET 8.0 Preview2 vs Preview3: <https://github.com/dotnet/core/pull/8387>
- PR comparing .NET 7.0 Preview1 vs Preview2: <https://github.com/dotnet/core/pull/7307>