# NuGet in .NET 11 Preview 7 - Release Notes

.NET 11 Preview 7 includes the following NuGet client changes:

- [Restore records analyzer assets in project.assets.json](#restore-records-analyzer-assets-in-projectassetsjson)
- [Restore runs safely under multithreaded MSBuild](#restore-runs-safely-under-multithreaded-msbuild)
- [Pack reuses existing project evaluations](#pack-reuses-existing-project-evaluations)
- [Pack warns about non-restricted package IDs](#pack-warns-about-non-restricted-package-ids)
- [Performance improvements](#performance-improvements)
- [Bug fixes](#bug-fixes)

## Restore records analyzer assets in project.assets.json

Restore now writes an `analyzers` group for each package in `project.assets.json` when a project targets .NET 11 or later and opts in with `RestoreEnableAnalyzerAssets`. Every analyzer assembly under `analyzers/` is listed and annotated with its `codeLanguage` (`cs`, `vb`, `fs`, or `any`) and, when present in the path, a `compilerApiVersion` (`roslynX.Y`). Recording analyzers as their own asset type lays the groundwork for the same items you already use to [control a package's other assets](https://learn.microsoft.com/nuget/consume-packages/package-references-in-project-files#controlling-dependency-assets) — `PrivateAssets`, `ExcludeAssets`, and `IncludeAssets` — to also apply to its analyzers, instead of every analyzer a package ships always being loaded regardless of those settings:

```xml
<ItemGroup>
  <!-- Use this analyzer to build the project, but don't flow it to projects that reference this one -->
  <PackageReference Include="Microsoft.CodeAnalysis.NetAnalyzers" Version="9.0.0">
    <PrivateAssets>all</PrivateAssets>
  </PackageReference>
  <!-- Use this package's library, but skip its analyzer entirely -->
  <PackageReference Include="StyleCop.Analyzers" Version="1.2.0-beta.556">
    <ExcludeAssets>analyzers</ExcludeAssets>
  </PackageReference>
</ItemGroup>
```

After restore, `obj/project.assets.json` reflects the exclusion: `Microsoft.CodeAnalysis.NetAnalyzers` keeps its analyzer entries, while the analyzers for `StyleCop.Analyzers` are replaced with the `_._` placeholder already used for excluded `compile`, `runtime`, and `native` assets, so the SDK knows not to load it:

```json
"Microsoft.CodeAnalysis.NetAnalyzers/9.0.0": {
  "type": "package",
  "analyzers": {
    "analyzers/dotnet/cs/Microsoft.CodeAnalysis.NetAnalyzers.dll": { "codeLanguage": "cs" }
  }
},
"StyleCop.Analyzers/1.2.0-beta.556": {
  "type": "package",
  "analyzers": {
    "analyzers/_._": {}
  }
}
```

`RestoreEnableAnalyzerAssets` is gated per target framework, so mixed multi-targeting projects only get the new section on frameworks new enough to consume it. This restore-side change has no effect on which analyzers actually run yet — the compiler still loads every analyzer a package ships regardless of `PrivateAssets`, `ExcludeAssets`, or `IncludeAssets`, because the SDK-side consumer of this metadata ([dotnet/sdk #54646](https://github.com/dotnet/sdk/pull/54646)) hasn't landed. For Preview 7, the call to action is for **analyzer package authors**: make sure your analyzer assemblies are laid out correctly under `analyzers/<codeLanguage>/` (with a `roslynX.Y` segment if you ship compiler-API-specific builds), so they're represented correctly in this new asset group ahead of the SDK enforcing it ([NuGet/NuGet.Client #7464](https://github.com/NuGet/NuGet.Client/pull/7464), [NuGet/Home #6279](https://github.com/NuGet/Home/issues/6279), [NuGet/Home #14455](https://github.com/NuGet/Home/issues/14455)).

## Restore runs safely under multithreaded MSBuild

Since .NET SDK 10.0.300, MSBuild has supported an opt-in multithreaded, in-process task model — used by `dotnet build -mt` and MSBuild Server — where a single driver process persists across builds and multiple projects build (and restore) on it concurrently; making this the default build mode is still coming in a future release. Previously, restore could carry stale environment, credential, and plugin state between builds sharing a reused process, and could resolve a relative path against the wrong project's directory when several projects shared one worker. Preview 7 migrates the Restore Task and its supporting tasks to this multithreaded-safe model, so restore now produces the same correct results under `dotnet build -mt`, a reused MSBuild Server process, or several concurrent project restores as it does running single-threaded — no changes are required in your project files:

```console
dotnet build MySolution.sln -mt
```

Static-graph restore already spawns a fresh short-lived process per build and is unaffected; `nuget.exe` and Visual Studio builds are also unaffected. This is part of Preview 7's broader MSBuild multithreading work — see the [MSBuild release notes](./msbuild.md) for the rest of it ([NuGet/NuGet.Client #7507](https://github.com/NuGet/NuGet.Client/pull/7507), [NuGet/NuGet.Client #7533](https://github.com/NuGet/NuGet.Client/pull/7533), [NuGet/NuGet.Client #7543](https://github.com/NuGet/NuGet.Client/pull/7543), [NuGet/NuGet.Client #7551](https://github.com/NuGet/NuGet.Client/pull/7551), [NuGet/NuGet.Client #7554](https://github.com/NuGet/NuGet.Client/pull/7554), [NuGet/NuGet.Client #7578](https://github.com/NuGet/NuGet.Client/pull/7578), [NuGet/Home #14958](https://github.com/NuGet/Home/issues/14958), [dotnet/msbuild #14186](https://github.com/dotnet/msbuild/issues/14186), [dotnet/msbuild #14187](https://github.com/dotnet/msbuild/issues/14187)).

> **Note for plugin and credential-provider authors:** internal caches opt into this reset behavior through a small new `NuGetProcessState` registry in `NuGet.Common` (`RegisterResetAction(ResetKey, Action)` / `Reset(ResetKey)`). NuGet's own environment, credential-service, and plugin caches use it internally, and a plugin with process-wide state that must be refreshed between reused-process restores can register a reset action the same way.

## Pack reuses existing project evaluations

`dotnet pack` used to pass `BuildProjectReferences=false` as a global property on the inner MSBuild calls that gather versions, source files, framework references, and suppressed dependencies. Because MSBuild keys evaluations and project instances by project path plus global properties, that flag produced a distinct evaluation from the instances the preceding `Build` already produced — effectively doubling evaluations for every affected target framework and project reference in a multi-targeting graph. Preview 7 drops that global property from the inner calls so pack reuses the evaluations `Build` already produced instead of re-evaluating projects it just built, and also removes a second source of redundant evaluations that was specific to single-targeting projects. The result is fewer evaluations and faster packing, especially for multi-targeted projects with several project references. The change is safe because `BuildProjectReferences` only influences MSBuild's project-to-project reference protocol (whether a reference is built or its outputs are predicted), not any of the targets pack actually invokes on those inner calls. No project changes are required — the improvement applies automatically when the SDK is upgraded ([NuGet/NuGet.Client #7541](https://github.com/NuGet/NuGet.Client/pull/7541), reverted and re-implemented as [NuGet/NuGet.Client #7603](https://github.com/NuGet/NuGet.Client/pull/7603) to avoid an item-name collision with ASP.NET Core's own pack targets, [NuGet/Home #11530](https://github.com/NuGet/Home/issues/11530), [NuGet/Home #14998](https://github.com/NuGet/Home/issues/14998)).

```console
dotnet pack MySolution.sln
```

## Pack warns about non-restricted package IDs

nuget.org is phasing in stricter [package ID standards](https://github.com/NuGet/Announcements/issues/75): new package IDs must already be ASCII-only, and nuget.org will soon reject pushes of any non-conforming ID outright. Ahead of that enforcement, `dotnet pack` in SDK-style projects now warns **NU5052** when a package's ID doesn't start with a letter, digit, or underscore, or contains characters other than ASCII letters, digits, dots (`.`), dashes (`-`), and underscores (`_`), or has consecutive dots or dashes:

```console
warning NU5052: The package ID 'Contoso.Café' is invalid. Package IDs must start with a letter, digit, or underscore, and contain only ASCII letters, digits, dots (.), dashes (-), and underscores (_), with no consecutive dots or dashes.
```

The warning is advisory only — pack still produces the package — giving authors time to fix a noncompliant ID before nuget.org starts rejecting it ([NuGet/NuGet.Client #7487](https://github.com/NuGet/NuGet.Client/pull/7487), [NuGet/Home #14949](https://github.com/NuGet/Home/issues/14949), [NuGet/Announcements #75](https://github.com/NuGet/Announcements/issues/75)).

## Performance improvements

- Restore no longer scans the full version list of the global packages folder or fallback folders when it can't find an exact package version there. That fallback scan was never meaningful for local folders — their version list is never used to satisfy a graph — so restore now only performs it against real package sources, reducing work on warm restores against a large global packages folder ([NuGet/NuGet.Client #7569](https://github.com/NuGet/NuGet.Client/pull/7569), [NuGet/Home #14963](https://github.com/NuGet/Home/issues/14963), [NuGet/Home #14974](https://github.com/NuGet/Home/issues/14974)).

## Bug fixes

- **Pack**
  - [Fix mismatch between GetPackOutputItemsTask and PackTask generated filenames](https://github.com/NuGet/NuGet.Client/pull/7531)
  - [Fix GetPackOutputItems when nuspec does not exist](https://github.com/NuGet/NuGet.Client/pull/7565)
- **Visual Studio**
  - [When PM UI fails to load, show a window with exception details](https://github.com/NuGet/NuGet.Client/pull/7542)
  - [Find existing PM UI windows by editor type](https://github.com/NuGet/NuGet.Client/pull/7568)
