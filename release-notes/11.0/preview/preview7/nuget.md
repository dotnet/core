# NuGet in .NET 11 Preview 7 - Release Notes

<!-- Verified against preview7 changes.json, the NuGet/NuGet.Client PR slice, gh pr view metadata, and a scratch dotnet restore against SDK 11.0.100-preview.7.26381.103 that exercised the new analyzers section in project.assets.json. -->

.NET 11 Preview 7 includes the following NuGet client changes:

- [Restore records analyzer assets in project.assets.json](#restore-records-analyzer-assets-in-projectassetsjson)
- [Restore runs safely under multithreaded MSBuild](#restore-runs-safely-under-multithreaded-msbuild)
- [Pack reuses existing project evaluations](#pack-reuses-existing-project-evaluations)
- [Restore skips full version scans of the global packages folder](#restore-skips-full-version-scans-of-the-global-packages-folder)
- [Fix Vulnerabilities is available from the Error List](#fix-vulnerabilities-is-available-from-the-error-list)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

## Restore records analyzer assets in project.assets.json

Restore now writes an `analyzers` group for each package in `project.assets.json` when a project targets .NET 11 or later and opts in with `RestoreEnableAnalyzerAssets`. Every analyzer assembly under `analyzers/` is listed and annotated with its `codeLanguage` (`cs`, `vb`, `fs`, or `any`) and, when present in the path, a `compilerApiVersion` (`roslynX.Y`). This gives the SDK the information it needs to apply `PrivateAssets`, `ExcludeAssets`, and `IncludeAssets` to analyzers instead of always applying every analyzer a package ships. Excluded or transitively suppressed analyzers appear as `_._`, matching how `compile`, `runtime`, and `native` assets are represented ([NuGet/NuGet.Client #7464](https://github.com/NuGet/NuGet.Client/pull/7464), [NuGet/Home #6279](https://github.com/NuGet/Home/issues/6279), [NuGet/Home #14455](https://github.com/NuGet/Home/issues/14455)).

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net11.0</TargetFramework>
    <RestoreEnableAnalyzerAssets>true</RestoreEnableAnalyzerAssets>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.CodeAnalysis.NetAnalyzers" Version="9.0.0">
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
  </ItemGroup>
</Project>
```

After restore, the package's entry in `obj/project.assets.json` includes:

```json
"Microsoft.CodeAnalysis.NetAnalyzers/9.0.0": {
  "type": "package",
  "analyzers": {
    "analyzers/dotnet/cs/Microsoft.CodeAnalysis.NetAnalyzers.dll": { "codeLanguage": "cs" },
    "analyzers/dotnet/vb/Microsoft.CodeAnalysis.NetAnalyzers.dll": { "codeLanguage": "vb" }
  }
}
```

`RestoreEnableAnalyzerAssets` is gated per target framework, so mixed multi-targeting projects only get the new section on frameworks new enough to consume it. The SDK half of the feature — selecting analyzers from this metadata instead of always feeding every analyzer to the compiler — is shipping alongside in the .NET SDK.

## Restore runs safely under multithreaded MSBuild

MSBuild 18.6 introduces a multithreaded, in-process task model (`dotnet build -mt` and MSBuild Server) where the driver process persists across builds and multiple projects share it concurrently. Preview 7 makes NuGet's restore tasks first-class citizens in that model. `RestoreTask` is now annotated `[MSBuildMultiThreadableTask]`, and its environment-derived caches, credential service, and plugin child processes are refreshed at the start of each restore and torn down at the end so a reused process behaves like a fresh one. The reset runs from a new `RefreshNuGetStaticStateTask` wired as the first dependency of `_GenerateRestoreGraph`, so it fires ahead of every `Get*` collection task and before `dotnet package add` reads settings. `GetRestoreSolutionProjectsTask` and `GetRestoreSettingsTask` were migrated to `IMultiThreadableTask` and now resolve relative paths through `TaskEnvironment` (the project directory) instead of `Path.GetFullPath` (the process current directory), fixing incorrect path resolution when several projects share one worker ([NuGet/NuGet.Client #7507](https://github.com/NuGet/NuGet.Client/pull/7507), [NuGet/NuGet.Client #7533](https://github.com/NuGet/NuGet.Client/pull/7533), [NuGet/NuGet.Client #7543](https://github.com/NuGet/NuGet.Client/pull/7543), [NuGet/NuGet.Client #7551](https://github.com/NuGet/NuGet.Client/pull/7551), [NuGet/NuGet.Client #7554](https://github.com/NuGet/NuGet.Client/pull/7554), [NuGet/NuGet.Client #7578](https://github.com/NuGet/NuGet.Client/pull/7578), [NuGet/Home #14958](https://github.com/NuGet/Home/issues/14958), [dotnet/msbuild #14186](https://github.com/dotnet/msbuild/issues/14186), [dotnet/msbuild #14187](https://github.com/dotnet/msbuild/issues/14187)).

The registry that lets internal caches self-register their reset handlers is a small public API in `NuGet.Common`:

```csharp
public static class NuGetProcessState
{
    public enum ResetKey { StartRestore, EndRestore }
    public static void RegisterResetAction(ResetKey key, Action resetAction);
    public static void Reset(ResetKey key);
}
```

Individual caches (environment variables, credential service, plugin lifetimes) register their own internal reset actions from static constructors, so the surface stays small and each subsystem stays in charge of its own state. Static-graph restore already spawns a fresh short-lived process per build and is unaffected; `nuget.exe` and Visual Studio are also unaffected.

## Pack reuses existing project evaluations

`dotnet pack` used to pass `BuildProjectReferences=false` as a global property on the inner MSBuild calls that gather versions, source files, framework references, and suppressed dependencies. Because MSBuild keys evaluations and project instances by project path plus global properties, that flag produced a distinct evaluation from the instances the preceding `Build` already produced — effectively doubling evaluations for every affected target framework and project reference in a multi-targeting graph. Preview 7 drops that global property from the inner calls so pack reuses the already-built evaluations. It also removes a second source of redundant evaluations that was specific to single-targeting projects. The change is safe because `BuildProjectReferences` only influences MSBuild's project-to-project reference protocol (whether a reference is built or its outputs are predicted), not any of the targets pack actually invokes on those inner calls ([NuGet/NuGet.Client #7541](https://github.com/NuGet/NuGet.Client/pull/7541), [NuGet/Home #11530](https://github.com/NuGet/Home/issues/11530), [NuGet/Home #14998](https://github.com/NuGet/Home/issues/14998)).

No project changes are required; the improvement applies automatically when the SDK is upgraded:

```console
dotnet pack MySolution.sln
```

## Restore skips full version scans of the global packages folder

When restore can't find an exact version of a package in a package source, it scans the source's version list and falls back to the closest match with an `NU1601` warning. That fallback isn't meaningful for the global packages folder or fallback folders — the version list of a local folder is never used to satisfy a graph — but the scan still ran and could be expensive on large machines. Restore now skips the scan for those local locations and only performs it for real package sources, so warm restores against a large global packages folder do less work ([NuGet/NuGet.Client #7569](https://github.com/NuGet/NuGet.Client/pull/7569), [NuGet/Home #14963](https://github.com/NuGet/Home/issues/14963), [NuGet/Home #14974](https://github.com/NuGet/Home/issues/14974)).

## Fix Vulnerabilities is available from the Error List

Visual Studio's Error List now offers a "Fix Vulnerabilities with GitHub Copilot" sparkle action on NuGet Audit warnings `NU1901`–`NU1904`, next to the existing entry point in the Solution Explorer info bar. A new `NuGetErrorListEntryFixerBase` provides shared error-list fixer infrastructure that future `NU*` codes can plug into, and the NuGet fixer is ordered before Visual Studio's built-in Copilot fixer so NuGet takes priority for these codes. Because audit warnings originate from the build/restore pipeline, the fixer inspects entries whose `ErrorSource` is `Build`. Each launch is attributed correctly through `FixVulnerabilitiesSource`, which pairs an entry point with its telemetry `NavigationOrigin` and its Copilot client id ([NuGet/NuGet.Client #7556](https://github.com/NuGet/NuGet.Client/pull/7556)).

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - Nullable annotation phases across NuGet.Protocol V3 search/list/autocomplete, LocalRepositories, remote find-by-id, find/download/dependency/update core resources, and V2Feed/V3 metadata leaves (#7519, #7527, #7567, #7570, #7587): a maintenance cleanup; library annotations only, no behavior change.
  - Restore/PMUI telemetry: project-system adapter usage (#7522), floating-version counts (#7550), and the fix to scope the package-id character-set flag to actual packages (#7576). Internal signal collection, no user-facing surface.
  - Package Manager UI robustness follow-ups: unused Product Update InfoBar removal (#7547), unused codespaces NuGetSolutionService removal (#7592), unused SatisfyImportsOnce swap (#7586), defer ISettings load (#7588). Small perf/hygiene wins with no user-facing behavior change.
  - `Microsoft.DotNet.Sdk.Root` AppContext lookup for trusted-root bundles (#7562): only observable under the still-experimental Native AOT `dotnet` CLI.
  - Test/build engineering: retarget to 7.10 (#7548), ship public APIs for release/7.9.x (#7546), flaky test relaxations (#7555), IL warning re-enablement (#7566), Find-Package/Get-Package E2E→unit migration (#7526), OptProf cloudtest migration (#7572, #7589), .agents skill files (#7577, #7582, #7584, #7591), MSBuild.Tasks.Core removal via PrunedPackageReference (#7599), localization drop (#7544), source-code updates from dotnet/dotnet (#7559, #7564), dependency bumps (#7574).
-->

## Bug fixes

- **Pack**
  - `GetPackOutputItemsTask` now computes the same `.nupkg` file name that `PackTask` writes when a project uses `NuspecFile` or `NuspecProperties` (including dynamically generated versions), and respects `OutputFileNamesWithoutVersion` when producing the version-less output name ([NuGet/NuGet.Client #7531](https://github.com/NuGet/NuGet.Client/pull/7531), [NuGet/Home #14711](https://github.com/NuGet/Home/issues/14711), [NuGet/Home #12644](https://github.com/NuGet/Home/issues/12644)).
  - `GetPackOutputItems` no longer fails when a nuspec is generated later in the pack pipeline (for example by Roslyn's analyzer packages, which produce their nuspec in a `BeforeTargets="GenerateNuspec"` target that runs after `GetPackOutputItems`) ([NuGet/NuGet.Client #7565](https://github.com/NuGet/NuGet.Client/pull/7565), [NuGet/Home #14711](https://github.com/NuGet/Home/issues/14711)).
- **Visual Studio**
  - When the Package Manager UI fails to construct, a document window now opens with the exception message and stack trace so customers can see what went wrong instead of an empty tab. Fault telemetry is still recorded ([NuGet/NuGet.Client #7542](https://github.com/NuGet/NuGet.Client/pull/7542), [NuGet/Home #14977](https://github.com/NuGet/Home/issues/14977)).
  - Locating an already-open Package Manager UI window now queries Visual Studio's UI shell for the specific editor GUID instead of enumerating open windows and forcing each tab's document view to load. Lazy-loaded tabs stay lazy ([NuGet/NuGet.Client #7568](https://github.com/NuGet/NuGet.Client/pull/7568), [NuGet/Home #14995](https://github.com/NuGet/Home/issues/14995)).

## Community contributors

Thank you contributors! ❤️

- [@OvesN](https://github.com/NuGet/NuGet.Client/pulls?q=is%3Apr+is%3Amerged+author%3AOvesN)
