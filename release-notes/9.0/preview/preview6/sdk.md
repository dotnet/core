# SDK updates in .NET 9 Preview 6

Here's a summary of what's new in the .NET SDK in this preview release:

- [SDK updates in .NET 9 Preview 6](#sdk-updates-in-net-9-preview-6)
  - [NuGetAudit now raises warnings for vulnerabilities in transitive dependencies](#nugetaudit-now-raises-warnings-for-vulnerabilities-in-transitive-dependencies)
  - [`dotnet nuget why`](#dotnet-nuget-why)
  - [MSBuild BuildChecks](#msbuild-buildchecks)

SDK updates in .NET 9 Preview 6:

- [What's new in the .NET Runtime in .NET 9](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) documentation

.NET 9 Preview 6:

- [Discussion](https://aka.ms/dotnet/9/preview6)
- [Release notes](./README.md)
- [Runtime release notes](./runtime.md)
- [Libraries release notes](./libraries.md)

## NuGetAudit now raises warnings for vulnerabilities in transitive dependencies

NuGetAudit, first added in .NET 8, provides warnings during restore if any packages used by your project have known vulnerabilities.
It requires a package source that provides a vulnerability database, so in practise you need to use https://api.nuget.org/v3/index.json as a package source, and [we have plans to allow auditing without nuget.org as a package source](https://github.com/NuGet/Home/issues/12698)).
For more information on NuGet Audit, including all configuration options, see [the documentation on NuGet Audit](https://learn.microsoft.com/nuget/concepts/auditing-packages).

In the .NET 9 SDK, NuGetAudit defaults for NuGetAuditMode has changed.
Previously, only direct package references were being reported by default (`<NuGetAuditMode>direct</NuGetAuditMode>`).
Now, by default it will warn on both direct and transitive packages (`<NuGetAuditMode>all</NuGetAuditMode>`) with known vulnerabilities.

To retain the previous defaults, you can explicitly set your preferred value of `NuGetAuditMode` in your project or *Directory.Build.props* file.
Alternatively you can set `SdkAnalysisLevel` to a version number lower than `9.0.100`, but be aware this will affect all features that use `SdkAnalysisLevel`.

## `dotnet nuget why`

`dotnet nuget why` can be used to find out why a transitive package is being used by your project.

```console
> dotnet nuget why .\my.csproj Microsoft.Extensions.Primitives
Project 'my' has the following dependency graph(s) for 'Microsoft.Extensions.Primitives':

  [net8.0]
   │
   └─ Microsoft.Extensions.Logging (v8.0.0)
      └─ Microsoft.Extensions.Options (v8.0.0)
         └─ Microsoft.Extensions.Primitives (v8.0.0)
```

## MSBuild BuildChecks

MSBuild has introduced a new tool called BuildChecks to help users enforce rules and invariants during their builds.

Like Roslyn Analyzers, the goal of this feature is to not only detect problems, but ensure that problems don't re-introduce themselves into the build once fixed.

In this release, we have added two BuildCheck rules
- [BC0101 - Shared Output Path](https://github.com/dotnet/msbuild/blob/main/documentation/specs/BuildCheck/Codes.md#bc0101---shared-output-path)
- [BC0102 - Double Write detection](https://github.com/dotnet/msbuild/blob/main/documentation/specs/BuildCheck/Codes.md#bc0102---double-writes)

BuildCheck analysis can be used by adding the `/analyze` flag to any MSBuild-invoking call, both for `dotnet` and for `msbuild.exe`.
For example, `dotnet build myapp.sln /analyze` would build the `myapp` solution and run all configured BuildChecks.

When a BuildCheck detects a problem, you should see a diagnostic just like any other MSBuild diagnostic for the project that triggered the problem.

You can read more about the BuildCheck system in our [design documentation](https://github.com/dotnet/msbuild/blob/main/documentation/specs/BuildCheck/BuildCheck.md).