# .NET SDK in .NET 11 RC 1 - Release Notes

.NET 11 RC 1 includes new SDK features and improvements:

- [`dotnet test` coordinates complete test runs](#dotnet-test-coordinates-complete-test-runs)
- [`dotnet test` can select affected tests](#dotnet-test-can-select-affected-tests)
- [File-based programs integrate with more SDK workflows](#file-based-programs-integrate-with-more-sdk-workflows)
- [`dotnet format` narrows configuration discovery](#dotnet-format-narrows-configuration-discovery)
- [`dotnet new install` can select prerelease templates](#dotnet-new-install-can-select-prerelease-templates)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)

.NET SDK updates in .NET 11:

- [What's new in the .NET 11 SDK](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/sdk)

## `dotnet test` coordinates complete test runs

The Microsoft.Testing.Platform path for `dotnet test` adds options that apply to
the complete run rather than to each test application. Place these options
before `--`; options after `--` continue to be forwarded to each application
([dotnet/sdk #55458](https://github.com/dotnet/sdk/pull/55458)).

```console
# Stop the complete run after 90 seconds.
dotnet test --timeout 90s

# Stop after five failed, errored, timed-out, or cancelled results.
dotnet test --maximum-failed-tests 5
```

`--timeout` accepts `ms`, `s`, and `m` suffixes and counts time only while at
least one test application is running. A timeout returns exit code 3, while
`--maximum-failed-tests` returns exit code 13 when its limit is reached.

For solution and multi-targeted runs, the new
`--results-directory-layout per-module` option gives every test application a
separate output directory. This prevents reports with the same relative file
name from overwriting one another. The default remains `flat`
([dotnet/sdk #55475](https://github.com/dotnet/sdk/pull/55475)).

```text
TestResults/
  MyTests/
    net11.0_x64/
  OtherTests/
    net11.0_x64/
```

When the SDK's artifacts output layout is enabled, MTP test reports, coverage,
and diagnostics now default to
`<ArtifactsPath>/test/<project>/<pivot>`. An explicit
`--results-directory` or `--results-directory-layout` still takes precedence
([dotnet/sdk #55609](https://github.com/dotnet/sdk/pull/55609)).

`dotnet test` also accepts `Microsoft.Build.Traversal` projects. It recursively
expands nested traversal projects, de-duplicates diamond references, and honors
`Configuration` and `Platform` metadata on project references
([dotnet/sdk #55297](https://github.com/dotnet/sdk/pull/55297)).

```console
dotnet test dirs.proj
```

## `dotnet test` can select affected tests

An experimental Microsoft.Testing.Platform workflow can collect a repository's
test map and then run the tests affected by a change
([dotnet/sdk #55574](https://github.com/dotnet/sdk/pull/55574)).

```powershell
$env:DOTNET_CLI_ENABLE_AFFECTED_TESTS = "1"
dotnet test --collect-test-map
dotnet test --affected-tests
```

The repository analysis, test-map storage, and filtering are supplied by a
separately distributed MTP extension. Collection and affected-test selection
are mutually exclusive, and they can't be combined with device testing,
parallel modules, or minimum-test policies.

## File-based programs integrate with more SDK workflows

The Native AOT command-line path can now launch an unchanged file-based program
directly from its existing build outputs. Supported cached launches include
`dotnet run --file app.cs`, `dotnet run app.cs`, and `dotnet app.cs`. If the
cache or command shape can't be proven safe, the CLI falls back to the managed
path ([dotnet/sdk #55529](https://github.com/dotnet/sdk/pull/55529)).

`dotnet format` also accepts a file-based program
([dotnet/sdk #55626](https://github.com/dotnet/sdk/pull/55626)):

```console
dotnet format app.cs
```

When a repository enables the SDK artifacts layout, file-based program outputs
are now placed under that repository's artifacts directory instead of the
default per-user cache ([dotnet/sdk #55697](https://github.com/dotnet/sdk/pull/55697)).

## `dotnet format` narrows configuration discovery

In folder mode, `dotnet format` now finds `.editorconfig` files by walking the
ancestor directories of files that will actually be formatted. It no longer
scans unrelated subtrees such as large `node_modules` directories
([dotnet/sdk #55248](https://github.com/dotnet/sdk/pull/55248)).

```console
dotnet format whitespace . --folder --include src/App/Program.cs
```

The PR's monorepo measurement for formatting one included file improved from
1.09 seconds to 0.55 seconds. Use `.globalconfig`, rather than an
`is_global = true` `.editorconfig` in an unrelated subtree, for configuration
that must apply globally.

Thank you [@wellWINeo](https://github.com/wellWINeo) for this contribution!

## `dotnet new install` can select prerelease templates

`dotnet new install --prerelease` selects the latest available version,
including prerelease versions, when a template package version isn't specified
explicitly ([dotnet/sdk #55503](https://github.com/dotnet/sdk/pull/55503)).

```console
dotnet new install Contoso.Templates --prerelease
```

An explicit package version, such as
`Contoso.Templates@2.0.0-preview.3`, continues to select that exact version.

## Breaking changes

- **The `Configuration` environment variable now supplies the default value for
  shared `--configuration`/`-c` CLI options.** An explicit command-line option
  takes precedence, and empty or whitespace-only environment values are
  ignored ([dotnet/sdk #55431](https://github.com/dotnet/sdk/pull/55431)).
  Build and test scripts that set an ambient `Configuration` value may now
  select that configuration where they previously selected `Debug`. Pass
  `--configuration Debug` explicitly or unset the environment variable to
  preserve the previous result.
- **File-based property directives no longer permit `:` in the property name.**
  Replace syntax such as `#:property Foo:Bar=value` with a valid MSBuild
  property name ([dotnet/sdk #55671](https://github.com/dotnet/sdk/pull/55671)).

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - Shared SDK resolution during Pack and Publish discovery: internal evaluation reuse without a distinct user workflow.
  - NativeAOT CLI size optimization: useful engineering work, but no stable customer-facing command change or published size measurement in the authoritative entry.
  - MSBuild task multithreading migrations: implementation work covered by the broader MSBuild multithreading story in earlier previews.
-->

## Bug fixes

- **Testing**
  - [Harden MTP artifact post-processing and add an opt-out](https://github.com/dotnet/sdk/pull/55480)
  - [Close SDK-side gaps in MTP artifact post-processing](https://github.com/dotnet/sdk/pull/55554)
- **Publishing**
  - [Fix `dotnet publish -o .` excluding all source files](https://github.com/dotnet/sdk/pull/55461)
  - [Fix single-file publish when XML documentation isn't copied to output](https://github.com/dotnet/sdk/pull/53156)
- **Workloads**
  - [Fix preview workload version search](https://github.com/dotnet/sdk/pull/55685)
  - [Fix invalid workload search version argument handling](https://github.com/dotnet/sdk/pull/55682)
