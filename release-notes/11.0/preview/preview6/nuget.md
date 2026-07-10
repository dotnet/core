# NuGet in .NET 11 Preview 6 - Release Notes

<!-- Verified against preview6 changes.json, the NuGet/NuGet.Client PR slice, gh pr view metadata, and NuGet.Client source search for named APIs and switches. -->

.NET 11 Preview 6 includes the following NuGet client changes:

- [NuGet.Protocol adds an opt-in System.Text.Json path](#nugetprotocol-adds-an-opt-in-systemtextjson-path)
- [Package search supports package-type filters consistently](#package-search-supports-package-type-filters-consistently)
- [Pack warns about restricted package IDs](#pack-warns-about-restricted-package-ids)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

## NuGet.Protocol adds an opt-in System.Text.Json path

NuGet.Protocol now has a feature-flagged System.Text.Json deserialization path across plugin messages, V2 autocomplete, V3 search, package metadata, service-index, registration, repository-signature, and vulnerability metadata resources. The work also annotates AOT-incompatible paths and removes remaining Newtonsoft.Json calls from trimmed AOT paths, reducing one measured AOT-trimmed app by about 6 MB ([NuGet/NuGet.Client #7326](https://github.com/NuGet/NuGet.Client/pull/7326), [NuGet/NuGet.Client #7422](https://github.com/NuGet/NuGet.Client/pull/7422), [NuGet/NuGet.Client #7424](https://github.com/NuGet/NuGet.Client/pull/7424), [NuGet/NuGet.Client #7449](https://github.com/NuGet/NuGet.Client/pull/7449), [NuGet/NuGet.Client #7465](https://github.com/NuGet/NuGet.Client/pull/7465), [NuGet/NuGet.Client #7472](https://github.com/NuGet/NuGet.Client/pull/7472), [NuGet/NuGet.Client #7473](https://github.com/NuGet/NuGet.Client/pull/7473), [NuGet/NuGet.Client #7480](https://github.com/NuGet/NuGet.Client/pull/7480), [NuGet/NuGet.Client #7481](https://github.com/NuGet/NuGet.Client/pull/7481), [NuGet/NuGet.Client #7493](https://github.com/NuGet/NuGet.Client/pull/7493)).

```console
> set NUGET_USE_SYSTEM_TEXT_JSON_DESERIALIZATION=true
> dotnet restore
```

The environment variable enables the System.Text.Json path when set to `true`.

## Package search supports package-type filters consistently

NuGet.Protocol package search now sends the protocol-defined `packageType` query parameter for V3 feeds and reports whether a source supports package-type filtering through `PackageSearchResource.SupportsPackageTypeFiltering`. Local folder sources now apply the same filter, so callers can use one search shape across capable V3 sources and local package folders ([NuGet/NuGet.Client #7395](https://github.com/NuGet/NuGet.Client/pull/7395), [NuGet/NuGet.Client #7469](https://github.com/NuGet/NuGet.Client/pull/7469), [NuGet/NuGet.Client #7505](https://github.com/NuGet/NuGet.Client/pull/7505), [NuGet/Home #8915](https://github.com/NuGet/Home/issues/8915)).

```csharp
var filter = new SearchFilter(includePrerelease: false)
{
    PackageType = "Template"
};

if (searchResource.SupportsPackageTypeFiltering)
{
    var results = await searchResource.SearchAsync(searchTerm, filter, skip, take, logger, token);
}
```

Feeds that do not advertise `SearchQueryService/3.5.0` now throw `NotSupportedException` when a package type is requested instead of silently returning unfiltered results.

## Pack warns about restricted package IDs

`dotnet pack` now emits `NU5052` when an SDK-style project uses a package ID outside the restricted NuGet package ID character set. The warning is enabled when `SdkAnalysisLevel` is `11.0.100` or later. Package IDs must start with a letter, digit, or underscore and contain only ASCII letters, digits, dots (`.`), dashes (`-`), and underscores (`_`) with no consecutive dots or dashes ([NuGet/NuGet.Client #7487](https://github.com/NuGet/NuGet.Client/pull/7487), [NuGet/Home #14949](https://github.com/NuGet/Home/issues/14949), [NuGet/Home #14950](https://github.com/NuGet/Home/pull/14950)).

```xml
<PropertyGroup>
  <PackageId>Contoso--Tools</PackageId>
  <SdkAnalysisLevel>11.0.100</SdkAnalysisLevel>
</PropertyGroup>
```

```text
warning NU5052: The package ID 'Contoso--Tools' does not adhere to the restricted set of characters allowed in package IDs.
```

## Breaking changes

- `SearchFilter.PackageTypes` was removed and replaced with `SearchFilter.PackageType`. The protocol accepts one package type value, and the new property matches the query parameter NuGet sends to package sources ([NuGet/NuGet.Client #7469](https://github.com/NuGet/NuGet.Client/pull/7469), [NuGet/Home #14941](https://github.com/NuGet/Home/issues/14941)).
- Obsolete raw-search support in `PackageSearchResourceV3` no longer deserializes search results through `JToken`. This affects callers using the obsolete constructor that enabled raw search ([NuGet/NuGet.Client #7458](https://github.com/NuGet/NuGet.Client/pull/7458), [NuGet/Home #14935](https://github.com/NuGet/Home/issues/14935)).

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - XPlat migration to System.CommandLine: command-line parser modernization with no documented user-facing behavior change.
  - Nullable annotation phases in NuGet.Protocol: useful for maintainability and library annotations, but not a standalone feature for most NuGet users.
  - NuGet.Client Copilot skills and test migrations: internal engineering workflow and test-only changes.
  - Localization, dependency, MSBuild, and build feed updates: infrastructure updates without direct release-note value.
-->

## Bug fixes

- **NuGet Audit and Package Manager UI**
  - The Visual Studio solution-level Package Manager UI now shows vulnerability icons for each installed vulnerable version when multiple projects reference different vulnerable versions of the same package ([NuGet/NuGet.Client #7442](https://github.com/NuGet/NuGet.Client/pull/7442), [NuGet/Home #14024](https://github.com/NuGet/Home/issues/14024), [NuGet/Home #14322](https://github.com/NuGet/Home/issues/14322)).
  - The Package Manager UI now refreshes when it becomes visible again after a hidden restore or project edit, including the "Fix with GitHub Copilot" flow ([NuGet/NuGet.Client #7430](https://github.com/NuGet/NuGet.Client/pull/7430), [NuGet/Home #14761](https://github.com/NuGet/Home/issues/14761)).
  - "Fix Vulnerabilities with GitHub Copilot" now recognizes NuGet MCP server installations from public MCP registries and checks the MCP server state before starting a Copilot tool session ([NuGet/NuGet.Client #7445](https://github.com/NuGet/NuGet.Client/pull/7445), [NuGet/NuGet.Client #7453](https://github.com/NuGet/NuGet.Client/pull/7453), [NuGet/Home #14912](https://github.com/NuGet/Home/issues/14912)).
- **Pack**
  - Deterministic pack now uses stable package-services metadata naming without depending on input file ordering, and fixes a file-handle leak in deterministic package creation ([NuGet/NuGet.Client #7410](https://github.com/NuGet/NuGet.Client/pull/7410), [NuGet/NuGet.Client #7503](https://github.com/NuGet/NuGet.Client/pull/7503), [NuGet/Home #14916](https://github.com/NuGet/Home/issues/14916), [NuGet/Home #14959](https://github.com/NuGet/Home/issues/14959)).
- **Restore**
  - C++/CLI projects that use `AssetTargetFallback` now preserve the secondary `native` framework when shared restore caches compare compatibility criteria ([NuGet/NuGet.Client #7433](https://github.com/NuGet/NuGet.Client/pull/7433), [NuGet/Home #13326](https://github.com/NuGet/Home/issues/13326)).
  - Restore now warns when `RestoreForceEvaluate=true` overrides `RestoreLockedMode=true`, so lock-file regeneration is no longer silent when both properties are set ([NuGet/NuGet.Client #7451](https://github.com/NuGet/NuGet.Client/pull/7451), [NuGet/Home #8222](https://github.com/NuGet/Home/issues/8222)).
  - Restore content-file glob matching avoids repeated matcher allocations in Visual Studio restore paths ([NuGet/NuGet.Client #7405](https://github.com/NuGet/NuGet.Client/pull/7405)).
- **Visual Studio**
  - Installed-package extensibility APIs skip missing fallback package folders instead of faulting the entire installed-packages query. Restore behavior for missing fallback folders is unchanged ([NuGet/NuGet.Client #7504](https://github.com/NuGet/NuGet.Client/pull/7504)).
  - Package Manager UI avoids a timing window when migrating a legacy project from `packages.config` to `PackageReference` ([NuGet/NuGet.Client #7506](https://github.com/NuGet/NuGet.Client/pull/7506), [NuGet/Home #12397](https://github.com/NuGet/Home/issues/12397)).
  - Binding redirect failures now include inner exception details in logs ([NuGet/NuGet.Client #7468](https://github.com/NuGet/NuGet.Client/pull/7468), [NuGet/Home #14940](https://github.com/NuGet/Home/issues/14940)).
  - Build start avoids a blocking Visual Studio package-restore path that could spend more than 10 seconds constructing the returned task ([NuGet/NuGet.Client #7454](https://github.com/NuGet/NuGet.Client/pull/7454)).

## Community contributors

Thank you contributors! ❤️

- [@omajid](https://github.com/NuGet/NuGet.Client/pulls?q=is%3Apr+is%3Amerged+author%3Aomajid)
