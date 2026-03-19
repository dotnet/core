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
| `src/razor/` | ASP.NET Core | `dotnet/razor` | `aspnetcore.md` | `team-aspnetcore.md` |
| `src/sdk/` | SDK | `dotnet/sdk` | `sdk.md` | `team-sdk.md` |
| `src/templating/` | SDK | `dotnet/templating` | `sdk.md` | `team-sdk.md` |
| `src/msbuild/` | MSBuild | `dotnet/msbuild` | `msbuild.md` | — |
| `src/winforms/` | Windows Forms | `dotnet/winforms` | `winforms.md` | — |
| `src/wpf/` | WPF | `dotnet/wpf` | `wpf.md` | — |
| `src/windowsdesktop/` | Windows Desktop | — | — | — |
| `src/efcore/` | EF Core | `dotnet/efcore` | `efcore.md` | — |
| `src/roslyn/` | C# / Visual Basic | `dotnet/roslyn` | `csharp.md`, `visualbasic.md` | — |
| `src/fsharp/` | F# | `dotnet/fsharp` | `fsharp.md` | — |

### Non-VMR components

These components appear in every preview's release notes but are **not in the VMR**. They must be handled separately:

| Component | Source Repo | Release Notes File | Discovery Method |
|-----------|-------------|-------------------|-----------------|
| .NET MAUI | `dotnet/maui` | `dotnetmaui.md` | Search `dotnet/maui` PRs by milestone or date range |
| Container images | `dotnet/dotnet-docker` | `containers.md` | Search `dotnet/dotnet-docker` PRs + announcements |

### Expected output files per preview

Every preview release should produce **all** of these files, even if some are stubs ("no new features in this release"):

```
README.md              # Index/TOC linking to all component files
libraries.md           # System.* BCL APIs
runtime.md             # CoreCLR, Mono, GC, JIT, architecture
aspnetcore.md          # ASP.NET Core, Blazor, SignalR, minimal APIs
sdk.md                 # CLI, build, project system, NuGet
efcore.md              # Entity Framework Core, data access
csharp.md              # C# language features
fsharp.md              # F# language and compiler
visualbasic.md         # Visual Basic language
dotnetmaui.md          # .NET MAUI, Android, iOS
containers.md          # Container image updates
winforms.md            # Windows Forms
wpf.md                 # WPF
msbuild.md             # MSBuild (when applicable)
```

### Classification rules

1. **Longest prefix wins** — match against the longest matching prefix. For example, `src/runtime/src/libraries/System.Text.Json/...` matches Libraries, not Runtime.
2. **Ignore non-source paths** — skip files under `src/*/eng/`, `src/*/test/`, `src/*/tests/`, `src/*/docs/`, and build infrastructure files.
3. **Razor → ASP.NET Core** — the `src/razor/` path feeds into `aspnetcore.md`, not a separate file.
4. **Templating → SDK** — the `src/templating/` path feeds into `sdk.md`.
5. **Roslyn split** — the `src/roslyn/` path covers both C# and Visual Basic. Check PR labels and titles to determine which language. Produce separate `csharp.md` and `visualbasic.md` files.
6. **.NET MAUI** — not in the VMR. Search `dotnet/maui` directly by milestone or date range.
7. **Containers** — not in the VMR. Search `dotnet/dotnet-docker` or produce a stub unless the user provides container update information.

## VMR release branch naming

See [release-branch-mechanics.md](release-branch-mechanics.md) for the complete branch topology, timing, and comparison strategy across repos.

Summary of VMR reference types:

| Reference | Pattern | Example |
|-----------|---------|---------|
| Release tag | `v<MAJOR>.0.100-<label>.<build>` | `v11.0.100-preview.2.26159.112` |
| Release-PR branch | `release-pr-<MAJOR>.0.100-<label>.<build>` | `release-pr-11.0.100-preview.3.26168.106` |
| Long-lived branch | `release/<MAJOR>.0.1xx` | `release/10.0.1xx` (shipped GA only) |

### Finding the previous release tag

Read `release-notes/<MAJOR>.0/preview/<previous>/release.json` → `.release.runtime.version` to get the exact build number, then match to a VMR tag.

Active development for the next major version happens on `main`.

## Source repo PR search patterns

When tracing VMR changes back to source repo PRs, use these repo-specific search strategies:

| Source Repo | Primary Search | Filters |
|------------|----------------|---------|
| `dotnet/runtime` | Area labels (`area-System.*`) + date range | Exclude: `backport`, `servicing`, test-only |
| `dotnet/aspnetcore` | Milestone (`<MAJOR>.0-preview<N>`) | Exclude: `backport`, test-only |
| `dotnet/razor` | Date range | Exclude: `backport`, test-only |
| `dotnet/sdk` | Date range + title/path inspection | Exclude: `backport`, test-only |
| `dotnet/templating` | Date range | Exclude: `backport`, test-only |
| `dotnet/roslyn` | Milestone + labels | Exclude: `backport`, test-only |
| `dotnet/fsharp` | Date range | Exclude: `backport`, test-only |
| `dotnet/efcore` | Date range | Exclude: `backport`, test-only |
| `dotnet/msbuild` | Date range | Exclude: `backport`, test-only |
| `dotnet/winforms` | Date range + milestone | Exclude: `backport`, test-only |
| `dotnet/wpf` | Date range | Exclude: `backport`, test-only |
| `dotnet/maui` | Milestone (`<MAJOR>.0-preview<N>`) | Exclude: `backport`, test-only |
| `dotnet/dotnet-docker` | Date range + label | Exclude: test-only |
