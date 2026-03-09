# .NET SDK in .NET 11 Preview 2 - Release Notes

.NET 11 Preview 2 includes new .NET SDK features & enhancements:

- [Smaller SDK installers on Linux and macOS](#smaller-sdk-installers-on-linux-and-macos)
- [Code analyzer improvements](#code-analyzer-improvements)
  - [CA1873: Reduced noise and better diagnostic messages](#ca1873-reduced-noise-and-better-diagnostic-messages)
  - [Analyzer bug fixes](#analyzer-bug-fixes)
  - [AnalysisLevel corrected for .NET 11](#analysislevel-corrected-for-net-11)
- [New SDK warnings and build targets](#new-sdk-warnings-and-build-targets)
  - [NETSDK1235: Warning for custom `.nuspec` with PackAsTool](#netsdk1235-warning-for-custom-nuspec-with-packastool)
- [Community contributors](#community-contributors)

.NET SDK updates in .NET 11:

- [What's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/overview) documentation

## Smaller SDK installers on Linux and macOS

SDK installer size on Linux and macOS has been reduced by deduplicating assemblies using symbolic links. Duplicate `.dll` and `.exe` files are identified by content hash and replaced with symbolic links pointing to a single copy. This affects tarballs, `.pkg`, `.deb`, and `.rpm` installers ([dotnet/sdk#52044](https://github.com/dotnet/sdk/pull/52044)).

Analysis of the .NET SDK layout found that **35% of the SDK directory is duplicate files** — 816 files totaling 140 MB on disk (53 MB compressed) on Linux x64. By replacing these duplicates with symbolic links, the Linux x64 archive drops significantly in size:

| Platform | SDK Artifact | 10.0.105 Size (MB) | 11.0.100-preview2 Size (MB) | % Gain |
|---|---|---|---|---|
| linux-x64 | tarball | 230 | 189 | 17.8% |
| linux-x64 | deb | 164 | 122 | 25.6% |
| linux-x64 | rpm | 165 | 122 | 26.0% |
| linux-x64 | containers | Varies per distro/image variant | Varies per distro/image variant | 8-17% |

These results are generally the same across other architectures as well!

Windows deduplication is planned separately and tracked in [dotnet/sdk#52182](https://github.com/dotnet/sdk/issues/52182). For preview 2, macOS tarball deduplication was implemented but caused regressions, so look forward to those starting in preview 3! For the full design and analysis of this feature, see the [Eliminate Duplicate SDK Files](https://github.com/dotnet/sdk/blob/main/documentation/general/eliminate-duplicate-files.md) spec ([dotnet/sdk#41128](https://github.com/dotnet/sdk/issues/41128)).

## Code analyzer improvements

### CA1873: Reduced noise and better diagnostic messages

Two improvements were made to [CA1873](https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca1873) (Avoid potentially expensive logging):

**Reduced false positives** — Property accesses, `GetType()`, `GetHashCode()`, and `GetTimestamp()` calls are no longer flagged. Diagnostics now only apply to Information-level and below by default, since warning/error/critical code paths are rarely hot paths ([dotnet/sdk#51818](https://github.com/dotnet/sdk/pull/51818)).

**Specific reasons in diagnostic messages** — The diagnostic message now includes *why* an argument was flagged, helping developers prioritize which warnings to address ([dotnet/sdk#53030](https://github.com/dotnet/sdk/pull/53030), [dotnet/sdk#53006](https://github.com/dotnet/sdk/issues/53006)):

```
// Before
warning CA1873: Evaluation of this argument may be expensive and unnecessary if logging is disabled

// After
warning CA1873: Evaluation of this argument may be expensive and unnecessary if logging is disabled (method invocation)
```

The nine specific reasons are: method invocation, object creation, array creation, boxing conversion, string interpolation, collection expression, anonymous object creation, await expression, and with expression.

### Analyzer bug fixes

| Analyzer ID | Fix | PR |
|-------------|-----|-----|
| [CA1515](https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca1515) | Fixed false positive when C# extension members are present | [dotnet/sdk#51772](https://github.com/dotnet/sdk/pull/51772) |
| [CA1034](https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca1034) | Fixed false positive when C# extension members are present | [dotnet/sdk#51773](https://github.com/dotnet/sdk/pull/51773) |
| [CA1859](https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca1859) | Fixed improper handling of default interface implementations | [dotnet/sdk#52320](https://github.com/dotnet/sdk/pull/52320) |

Thank you [@ezhevita](https://github.com/ezhevita) for the CA1515 and CA1034 contributions!

### AnalysisLevel corrected for .NET 11

Projects with `AnalysisLevel=latest` were incorrectly using .NET 9.0 analyzer rules instead of the expected 11.0 rules ([dotnet/sdk#52468](https://github.com/dotnet/sdk/pull/52468)). Thank you [@bording](https://github.com/bording) for reporting this!

## New SDK warnings and build targets

### NETSDK1235: Warning for custom `.nuspec` with PackAsTool

A new warning is emitted when a project has `PackAsTool=true` and specifies a custom `NuspecFile` property. Tool packages require specific layout and identifier conventions that custom `.nuspec` files typically violate ([dotnet/sdk#52810](https://github.com/dotnet/sdk/pull/52810)):

```
warning NETSDK1235: .NET Tools do not support using a custom .nuspec file, but the nuspec file 'custom.nuspec' was provided. Remove the NuspecFile property from this project to enable packing it as a .NET Tool.
```

The pack operation still proceeds with a warning to avoid breaking existing projects.

## Community contributors

Thank you to the following community contributors who helped make this release possible!

- [@ezhevita](https://github.com/dotnet/sdk/pulls?q=is%3Apr+is%3Amerged+author%3Aezhevita) — Fixed CA1515 and CA1034 analyzer false positives with C# extension members
