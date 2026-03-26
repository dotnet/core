# Component Mapping

Maps VMR source paths to .NET components, their source repositories, product taxonomy slugs, and release notes output files.

## Path-to-component mapping

Uses `source-manifest.json` `path` values to identify components. The `dotnet-release generate changes` tool uses this mapping to populate the `product` field in `changes.json`.

| Manifest Path | Component | Source Repo | Product Slug | Release Notes File |
| ------------- | --------- | ----------- | ------------ | ------------------ |
| `runtime` | .NET Libraries | `dotnet/runtime` | `dotnet-runtime` | `libraries.md` |
| `runtime` | .NET Runtime | `dotnet/runtime` | `dotnet-runtime` | `runtime.md` |
| `aspnetcore` | ASP.NET Core | `dotnet/aspnetcore` | `dotnet-aspnetcore` | `aspnetcore.md` |
| `razor` | ASP.NET Core (Razor) | `dotnet/razor` | `dotnet-aspnetcore` | `aspnetcore.md` |
| `sdk` | .NET SDK | `dotnet/sdk` | `dotnet-sdk` | `sdk.md` |
| `templating` | .NET SDK (Templating) | `dotnet/templating` | `dotnet-sdk` | `sdk.md` |
| `msbuild` | MSBuild | `dotnet/msbuild` | `dotnet-msbuild` | `msbuild.md` |
| `winforms` | Windows Forms | `dotnet/winforms` | `dotnet-winforms` | `winforms.md` |
| `wpf` | WPF | `dotnet/wpf` | `dotnet-wpf` | `wpf.md` |
| `efcore` | EF Core | `dotnet/efcore` | `dotnet-efcore` | `efcore.md` |
| `roslyn` | C# / Visual Basic | `dotnet/roslyn` | `dotnet-roslyn` | `csharp.md` |
| `fsharp` | F# | `dotnet/fsharp` | `dotnet-fsharp` | `fsharp.md` |
| `nuget-client` | NuGet | `nuget/nuget.client` | `dotnet-nuget` | `nuget.md` |

### Runtime sub-component classification

The `runtime` manifest entry covers both Libraries and Runtime. When writing markdown, classify PRs by the files they changed:

| VMR Path Prefix | Sub-component | Output File |
| --------------- | ------------- | ----------- |
| `src/runtime/src/libraries/` | Libraries | `libraries.md` |
| `src/runtime/src/coreclr/` | Runtime (CoreCLR) | `runtime.md` |
| `src/runtime/src/mono/` | Runtime (Mono) | `runtime.md` |
| `src/runtime/src/native/` | Runtime (Native) | `runtime.md` |

### Components that share output files

- **Razor → ASP.NET Core** — `dotnet/razor` PRs go in `aspnetcore.md`
- **Templating → SDK** — `dotnet/templating` PRs go in `sdk.md`
- **Roslyn** — covers both C# and Visual Basic. Check PR labels/titles to determine language. Produce `csharp.md` (and `visualbasic.md` if VB-specific features exist).

### Infrastructure components (skip for release notes)

These appear in `source-manifest.json` but rarely produce user-facing changes:

| Manifest Path | Repo | Notes |
| ------------- | ---- | ----- |
| `arcade` | `dotnet/arcade` | Build infrastructure |
| `cecil` | `dotnet/cecil` | IL manipulation library (internal) |
| `command-line-api` | `dotnet/command-line-api` | CLI parsing (internal) |
| `deployment-tools` | `dotnet/deployment-tools` | Deployment tooling |
| `diagnostics` | `dotnet/diagnostics` | Diagnostic tools |
| `emsdk` | `dotnet/emsdk` | Emscripten SDK |
| `scenario-tests` | `dotnet/scenario-tests` | Test infrastructure |
| `source-build-reference-packages` | `dotnet/source-build-reference-packages` | Source build |
| `sourcelink` | `dotnet/sourcelink` | Source Link |
| `symreader` | `dotnet/symreader` | Symbol reader |
| `windowsdesktop` | `dotnet/windowsdesktop` | Metapackage |
| `vstest` | `microsoft/vstest` | Test platform |
| `xdt` | `dotnet/xdt` | XML transforms |

These components appear in `changes.json` for completeness but typically don't warrant markdown release notes.

## Expected output files per preview

Every preview should produce these files (stubs for components with no noteworthy changes):

```text
README.md              # Index/TOC linking to all component files
libraries.md           # System.* BCL APIs
runtime.md             # CoreCLR, Mono, GC, JIT
aspnetcore.md          # ASP.NET Core, Blazor, SignalR
sdk.md                 # CLI, build, project system, NuGet
efcore.md              # Entity Framework Core
csharp.md              # C# language features
fsharp.md              # F# language and compiler
winforms.md            # Windows Forms
wpf.md                 # WPF
msbuild.md             # MSBuild
nuget.md               # NuGet client
changes.json           # Machine-readable change manifest
```
