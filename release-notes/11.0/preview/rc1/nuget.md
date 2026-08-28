# NuGet in .NET 11 RC 1 - Release Notes

.NET 11 RC 1 includes new NuGet client features and improvements:

- [Pack reuses existing project evaluations](#pack-reuses-existing-project-evaluations)
- [Vulnerable package updates work with warnings as errors](#vulnerable-package-updates-work-with-warnings-as-errors)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)

## Pack reuses existing project evaluations

`dotnet pack` reuses project evaluations created by the preceding build instead
of forcing separate evaluations with `BuildProjectReferences=false`
([NuGet/NuGet.Client #7603](https://github.com/NuGet/NuGet.Client/pull/7603)).
This reduces redundant evaluation work, particularly for multi-targeted
projects with project references. No project-file change is required.

The implementation retains `BuildProjectReferences=false` for the framework
assembly reference lookup when `NoBuild=true`, so `dotnet pack --no-build`
continues not to build referenced projects.

## Vulnerable package updates work with warnings as errors

`dotnet package update --vulnerable` now works when a project enables
`TreatWarningsAsErrors`
([NuGet/NuGet.Client #7605](https://github.com/NuGet/NuGet.Client/pull/7605)).
The command's in-memory preview restore no longer turns audit warnings NU1901
through NU1904 into restore-stopping errors, while unrelated restore failures
still prevent the update from continuing.

```xml
<PropertyGroup>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
</PropertyGroup>
```

```console
dotnet package update --vulnerable
```

## Breaking changes

- **Deterministic package timestamps are opt-in.** RC 1 disables deterministic
  pack timestamps by default
  ([NuGet/NuGet.Client #7652](https://github.com/NuGet/NuGet.Client/pull/7652)).
  Projects that require reproducible package timestamps must set
  `DeterministicTimestamp` to `true` or to a specific timestamp.

  ```xml
  <PropertyGroup>
    <DeterministicTimestamp>true</DeterministicTimestamp>
  </PropertyGroup>
  ```

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - NuGet.Config cooldown settings: RC 1 adds configuration read/write support for minPublishAgeHours and minPublishAgeExceptions, but the authoritative change does not establish that package acquisition enforces the cooldown in this release.
  - Package Source Mapping Copilot command and vulnerability InfoBar: Visual Studio-specific experiences outside the NuGet CLI/client release-note boundary.
  - Nullable annotation completion: API annotation maintenance without a distinct package-management workflow.
-->

## Bug fixes

- **Pack**
  - [Apply property substitution when reading a nuspec in `GetPackOutputItemsTask`](https://github.com/NuGet/NuGet.Client/pull/7612)
  - [Fall back to `PackageVersion` when the nuspec version is unavailable](https://github.com/NuGet/NuGet.Client/pull/7619)
- **Configuration**
  - [Fix `PackageSourceProvider.UpdatePackageSource` when enabling sources](https://github.com/NuGet/NuGet.Client/pull/7641)
- **Package Manager Console**
  - [Preserve supplementary Unicode characters when processing backspace](https://github.com/NuGet/NuGet.Client/pull/7621)
