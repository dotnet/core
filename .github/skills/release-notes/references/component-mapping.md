# Component Mapping

## Repo-to-component mapping

Uses the `repo` field from `changes.json` (which matches `source-manifest.json` `path` values) to identify components.

| Manifest Path | Component | Source Repo | Output File | Branch Suffix | Default Assignee(s) |
| ------------- | --------- | ----------- | ----------- | ------------- | ------------------- |
| `runtime` | .NET Libraries | `dotnet/runtime` | `libraries.md` | `libraries` | @artl93 @jeffhandley @SamMonoRT @karelz |
| `runtime` | .NET Runtime | `dotnet/runtime` | `runtime.md` | `runtime` | @richlander |
| `aspnetcore` | ASP.NET Core | `dotnet/aspnetcore` | `aspnetcore.md` | `aspnetcore` | @danroth27 |
| `razor` | ASP.NET Core (Razor) | `dotnet/razor` | `aspnetcore.md` | `aspnetcore` | @danroth27 |
| `sdk` | .NET SDK | `dotnet/sdk` | `sdk.md` | `sdk` | @baronfel |
| `templating` | .NET SDK (Templating) | `dotnet/templating` | `sdk.md` | `sdk` | @baronfel |
| `msbuild` | MSBuild | `dotnet/msbuild` | `msbuild.md` | `msbuild` | @baronfel |
| `winforms` | Windows Forms | `dotnet/winforms` | `winforms.md` | `winforms` | @KlausLoeffelmann @merriemcgaw |
| `wpf` | WPF | `dotnet/wpf` | `wpf.md` | `wpf` | @harshit7962 @adegeo |
| `efcore` | EF Core | `dotnet/efcore` | `efcore.md` | `efcore` | @SamMonoRT @roji |
| `roslyn` | C# | `dotnet/roslyn` | `csharp.md` | `csharp` | @BillWagner |
| `roslyn` | Visual Basic (only when VB-specific changes exist) | `dotnet/roslyn` | `visualbasic.md` | `visualbasic` | @BillWagner |
| `fsharp` | F# | `dotnet/fsharp` | `fsharp.md` | `fsharp` | @T-Gro |
| `nuget-client` | NuGet | `nuget/nuget.client` | `nuget.md` | `nuget` | @baronfel |

### Out-of-VMR components

These ship alongside .NET but aren't sourced from the VMR. Include them in the
milestone branch set when the team is producing notes for the milestone:

| Component | Source Repo | Output File | Branch Suffix | Default Assignee(s) |
| --------- | ----------- | ----------- | ------------- | ------------------- |
| Containers | `dotnet/dotnet-docker` | `containers.md` | `containers` | @lbussell |
| .NET MAUI | `dotnet/maui` | `dotnetmaui.md` | `dotnetmaui` | @davidortinau |

The branch suffix is used to derive the component branch name as
`release-notes/{version}-{milestone-slug}-{branch-suffix}`. See
[`pr-layout.md`](pr-layout.md) for the full branching scheme.

#### Sourcing content for out-of-VMR components

Out-of-VMR components are **exempt from the rule that every documented item
must appear in `changes.json`**, because their changes are not collected by the
VMR-driven `release-notes generate changes` pipeline.

For `containers.md` and `dotnetmaui.md`:

1. Locate the milestone-aligned release branch or tag in the source repo (for
   example, `dotnet/dotnet-docker` release branches that map to the .NET
   milestone, or `dotnet/maui` previews tagged for the same release).
2. Source candidate features from merged PRs and release-notes / changelog
   files in that source repo since the previous milestone's tag.
3. Apply the same scoring, editorial, and 80/20 rules from
   [`feature-scoring.md`](feature-scoring.md) and
   [`editorial-rules.md`](editorial-rules.md).
4. If you cannot find authoritative source content, open the component PR as a
   short stub that names the milestone, links to the relevant source repo, and
   asks the default assignee from the table above to fill it in. Do not invent
   content.

The component PR for an out-of-VMR component is otherwise identical to a VMR
component PR: branch off the milestone base branch, draft state, default
assignee from the table above, target the base branch.

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
- **Apply the product-boundary rule** — Razor editor code actions, language-server behavior, and other IDE-only experiences are usually tooling stories, not ASP.NET Core product notes. See `editorial-rules.md`.

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
| `vstest` | `microsoft/vstest` | Test platform (microsoft org — skipped) |
| `xdt` | `dotnet/xdt` | XML transforms |

These components appear in `changes.json` for completeness but typically don't warrant markdown release notes.

## Expected output files per preview

Every preview should produce these files (stubs for components with no noteworthy changes). Files are split across branches per
[`pr-layout.md`](pr-layout.md):

**On the base branch (`release-notes/{version}-{milestone-slug}`):**

```text
README.md              # Index/TOC linking to all component files
changes.json           # Machine-readable change manifest
features.json          # Scored derivative used to rank what to document
build-metadata.json    # VMR refs (base/head) used to generate changes
```

**On per-component branches (`release-notes/{version}-{milestone-slug}-{branch-suffix}`):**

```text
libraries.md           # System.* BCL APIs
runtime.md             # CoreCLR, Mono, GC, JIT
aspnetcore.md          # ASP.NET Core, Blazor, SignalR
sdk.md                 # CLI, build, project system
efcore.md              # Entity Framework Core
csharp.md              # C# language features
fsharp.md              # F# language and compiler
winforms.md            # Windows Forms
wpf.md                 # WPF
msbuild.md             # MSBuild
nuget.md               # NuGet client
containers.md          # .NET container images (out-of-VMR)
dotnetmaui.md          # .NET MAUI (out-of-VMR)
visualbasic.md         # Visual Basic — only when VB-specific changes exist
```
