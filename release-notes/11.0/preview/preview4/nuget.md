# NuGet in .NET 11 Preview 4 - Release Notes

.NET 11 Preview 4 includes the following NuGet client changes:

- [Opt out of writing the dependency graph spec file during restore](#opt-out-of-writing-the-dependency-graph-spec-file-during-restore)

## Opt out of writing the dependency graph spec file during restore

Restore now honors a new MSBuild property, `RestoreDoNotWriteDependencyGraphSpec`, that suppresses writing the `*.dgspec.json` file to the `obj/` folder. On large solutions the dgspec write is measurable overhead, and the file is only needed when a subsequent restore on the same machine wants to short-circuit ([NuGet/NuGet.Client #7239](https://github.com/NuGet/NuGet.Client/pull/7239), [NuGet/Home #14114](https://github.com/NuGet/Home/issues/14114)).

The intended use is hosted/CI builds, where each build starts from a clean state and the cached dgspec offers no benefit. Local developer builds should leave the default behavior in place so that incremental restore continues to work.

```xml
<PropertyGroup>
  <!-- Skip writing NuGet's dgspec file in CI to shave restore overhead. -->
  <RestoreDoNotWriteDependencyGraphSpec Condition="'$(ContinuousIntegrationBuild)' == 'true'">true</RestoreDoNotWriteDependencyGraphSpec>
</PropertyGroup>
```

<!-- Filtered features (engineering work, but not user-facing enough for a writeup):
  - PR pipeline / agent pool / 1ES SBOM / OneLocBuild / lscache ignore / branding 7.7: build infrastructure.
  - PowerShell-to-Apex test migrations (#7246, #7270) and MockServer flake fix (#7296): test-only.
  - NuGet.Protocol nullability Phase 1 (#7267) and PackageIdValidator env-var caching (#7266): internal refactors / micro-optimizations with no observable behavior change.
  - "update public API shipping in 7.6.x" (#7269): internal API tracking file.
  - "Simplify localization docs" (#7262): repo docs only.
  - PM UI restore refresh (#7209), GetInstalledVersions init (#7245), EnvDTE.Project thread affinity (#7292): Visual Studio Package Manager UI work — product-boundary rule, belongs to VS tooling notes.
-->

## Bug fixes

- **dotnet CLI**
  - `dotnet add package` no longer writes `PrivateAssets` or `IncludeAssets` metadata onto the `<PackageVersion>` item in `Directory.Packages.props` when a Central Package Management project adds a development dependency such as `xunit.runner.visualstudio`. Asset metadata is now correctly placed only on the `<PackageReference>` in the project file ([NuGet/NuGet.Client #7258](https://github.com/NuGet/NuGet.Client/pull/7258), [NuGet/Home #14601](https://github.com/NuGet/Home/issues/14601)).
- **NuGet.exe**
  - `nuget.exe restore` and related commands now report a clear error when a `.NET (Core) SDK` MSBuild directory is passed via `-MSBuildPath`. NuGet.exe runs on .NET Framework and requires the .NET Framework build of MSBuild ([NuGet/NuGet.Client #7261](https://github.com/NuGet/NuGet.Client/pull/7261), [NuGet/Home #14844](https://github.com/NuGet/Home/issues/14844)).
- **NuGet.Protocol**
  - Stricter validation when reading `.nupkg` files surfaces malformed packages earlier instead of failing later in restore ([NuGet/NuGet.Client #7284](https://github.com/NuGet/NuGet.Client/pull/7284)).
- **Package signing**
  - Fixed a non-DER-compliant encoding in generated `TSTInfo` structures used by NuGet's RFC 3161 timestamp handling. Existing consumers were lenient enough to accept the prior output, and remain compatible with the corrected encoding ([NuGet/NuGet.Client #7248](https://github.com/NuGet/NuGet.Client/pull/7248), [NuGet/Home #14838](https://github.com/NuGet/Home/issues/14838)).

## Community contributors

Thank you contributors! ❤️

<!-- TODO: confirm @agr (Andrei Grigorev, PR #7248) is an external community contributor before crediting; remove this section if they are a Microsoft employee. -->
