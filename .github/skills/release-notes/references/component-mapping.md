# Component Mapping

Maps VMR (`dotnet/dotnet`) source paths to .NET components, their source repositories, and release notes output files.

## Path-to-component mapping

| VMR Path Prefix | Component | Source Repo | Release Notes File | Team Context |
|----------------|-----------|-------------|-------------------|--------------|
| `src/runtime/src/libraries/` | Libraries | `dotnet/runtime` | `libraries.md` | `team-libraries.md` |
| `src/runtime/src/coreclr/` | Runtime | `dotnet/runtime` | `runtime.md` | — |
| `src/runtime/src/mono/` | Runtime | `dotnet/runtime` | `runtime.md` | — |
| `src/runtime/src/native/` | Runtime | `dotnet/runtime` | `runtime.md` | — |
| `src/aspnetcore/` | ASP.NET Core | `dotnet/aspnetcore` | `aspnetcore.md` | `team-aspnetcore.md` |
| `src/sdk/` | SDK | `dotnet/sdk` | `sdk.md` | `team-sdk.md` |
| `src/msbuild/` | MSBuild | `dotnet/msbuild` | `msbuild.md` | — |
| `src/winforms/` | Windows Forms | `dotnet/winforms` | `winforms.md` | — |
| `src/wpf/` | WPF | `dotnet/wpf` | `wpf.md` | — |
| `src/efcore/` | EF Core | `dotnet/efcore` | `efcore.md` | — |
| `src/roslyn/` | C# / Visual Basic | `dotnet/roslyn` | `csharp.md`, `visualbasic.md` | — |
| `src/fsharp/` | F# | `dotnet/fsharp` | `fsharp.md` | — |
| `src/maui/` | .NET MAUI | `dotnet/maui` | `dotnetmaui.md` | — |

### Classification rules

1. **Longest prefix wins** — when classifying a file path, match against the longest matching prefix. For example, `src/runtime/src/libraries/System.Text.Json/...` matches Libraries, not Runtime.
2. **Ignore non-source paths** — skip files under `src/*/eng/`, `src/*/test/`, `src/*/tests/`, `src/*/docs/`, and build infrastructure files (`.proj`, `.targets`, `.props` at the repo root level). These do not represent user-facing changes.
3. **Containers** — container image changes do not come from the VMR diff. The `containers.md` release notes are authored separately based on container image announcements. Produce a stub unless the user provides container update information.
4. **Roslyn split** — the `src/roslyn/` path covers both C# and Visual Basic. When tracing to source repo PRs, check PR labels and titles to determine whether a change is C#-specific, VB-specific, or applies to both. Produce separate `csharp.md` and `visualbasic.md` files.

## VMR release branch naming

The VMR (`dotnet/dotnet`) uses this branch naming pattern:

```
release/<MAJOR>.0.1xx-<prerelease-label>
```

The `1xx` is the SDK feature band (standard for the first SDK release of a major version).

### Examples

| Release | Branch Name |
|---------|-------------|
| .NET 11 Preview 1 | `release/11.0.1xx-preview1` |
| .NET 11 Preview 2 | `release/11.0.1xx-preview2` |
| .NET 11 Preview 7 | `release/11.0.1xx-preview7` |
| .NET 11 RC 1 | `release/11.0.1xx-rc1` |
| .NET 11 RC 2 | `release/11.0.1xx-rc2` |

### Constructing branch names from inputs

Given the release name (e.g., ".NET 11 Preview 3"):
- Extract major version: `11`
- Extract prerelease label: `preview3`
- Construct: `release/11.0.1xx-preview3`

If the expected branch is not found, list branches matching `release/<MAJOR>.0*` and ask the user to select the correct one.

## Source repo PR search patterns

When tracing VMR changes back to source repo PRs, use these repo-specific search strategies:

| Source Repo | Primary Search | Filters |
|------------|----------------|---------|
| `dotnet/runtime` | Area labels (`area-System.*`) + date range | Exclude: `backport`, `servicing`, test-only |
| `dotnet/aspnetcore` | Milestone (`<MAJOR>.0-preview<N>`) | Exclude: `backport`, test-only |
| `dotnet/sdk` | Date range + title/path inspection | Exclude: `backport`, test-only |
| `dotnet/roslyn` | Milestone + labels | Exclude: `backport`, test-only |
| Others | Date range | Exclude: `backport`, `servicing`, test-only |
