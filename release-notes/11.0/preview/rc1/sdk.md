# .NET SDK in .NET 11 RC 1 - Release Notes

.NET 11 RC 1 includes updates for testing, container publishing, formatting,
file-based programs, and other CLI workflows:

- [`dotnet test` improves mobile application testing](#dotnet-test-improves-mobile-application-testing)
- [`dotnet test` adds run-level controls and result layouts](#dotnet-test-adds-run-level-controls-and-result-layouts)
- [Container publishing produces reproducible images and skips redundant uploads](#container-publishing-produces-reproducible-images-and-skips-redundant-uploads)
- [File-based programs add Native AOT reuse and formatting support](#file-based-programs-add-native-aot-reuse-and-formatting-support)
- [`dotnet format` limits configuration discovery to included files](#dotnet-format-limits-configuration-discovery-to-included-files)
- [Additional CLI improvements](#additional-cli-improvements)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)

.NET SDK updates in .NET 11:

- [What's new in the .NET 11 SDK](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/sdk)

## `dotnet test` improves mobile application testing

The Microsoft.Testing.Platform path for `dotnet test` supports test projects
that target Android, iOS, macOS, and Mac Catalyst. For Android and iOS, it can
select connected devices, emulators, or simulators as applicable.

![GIF of `dotnet test` running tests on an Android emulator](media/dotnet-test-android.gif)

The workloads include test project templates for Android
(`dotnet new androidtest`), iOS (`dotnet new iostest`), macOS
(`dotnet new macostest`), and Mac Catalyst
(`dotnet new maccatalysttest`). They use MSTest by default, but you can configure
another framework supported by
[Microsoft.Testing.Platform](https://learn.microsoft.com/dotnet/core/testing/microsoft-testing-platform-intro#supported-test-frameworks).

RC 1 fixes a duplicate runtime-pack crash during device deployment
([dotnet/sdk #55502](https://github.com/dotnet/sdk/pull/55502)).
`dotnet test` now reports the underlying MSBuild errors when deployment or
run-argument discovery fails
([dotnet/sdk #55524](https://github.com/dotnet/sdk/pull/55524)).
`dotnet test -bl` also records device selection, deployment, and run-argument
builds in one coherent binary log
([dotnet/sdk #55589](https://github.com/dotnet/sdk/pull/55589)).

For device selection, deployment, and other command details, see the
[`dotnet run` and `dotnet test` specification](https://github.com/dotnet/sdk/blob/a7fba614103a81971c230953d05ce214e12a4e16/documentation/specs/dotnet-run-for-maui.md).

## `dotnet test` adds run-level controls and result layouts

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

```console
dotnet test --results-directory-layout per-module
```

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

`dotnet test --nologo` now maps to Microsoft.Testing.Platform's `--no-banner`
option, and `--no-banner` appears in the command help
([dotnet/sdk #55376](https://github.com/dotnet/sdk/pull/55376) and
[dotnet/sdk #55412](https://github.com/dotnet/sdk/pull/55412)).

An experimental affected-test workflow is also available through a separately
distributed Microsoft.Testing.Platform extension. It can collect a repository's
test map and then run the tests affected by a change
([dotnet/sdk #55574](https://github.com/dotnet/sdk/pull/55574)):

```powershell
$env:DOTNET_CLI_ENABLE_AFFECTED_TESTS = "1"
dotnet test --collect-test-map
dotnet test --affected-tests
```

Collection and affected-test selection are mutually exclusive and cannot be
combined with device testing, parallel modules, or minimum-test policies.

## Container publishing produces reproducible images and skips redundant uploads

Publishing the same application more than once could previously produce
different container image digests because timestamps, archive headers, and
directory enumeration order varied between builds. Set `SOURCE_DATE_EPOCH` to a
stable Unix timestamp to make independent publishes of the same inputs produce
the same digest ([dotnet/sdk #55836](https://github.com/dotnet/sdk/pull/55836)).

```bash
dotnet publish /t:PublishContainer \
  -p:ContainerRegistry=registry.example.com \
  -p:SOURCE_DATE_EPOCH="$(git log -1 --pretty=%ct)"
```

Remote registry publishes now check whether the computed image manifest already
exists in the destination repository. When it does, the SDK skips processing
the layers and configuration while still applying every requested image tag.
This optimization is enabled by default. Set `ContainerPushNoCache=true` to
bypass the manifest-level check. The SDK still checks each layer and
configuration blob and does not upload blobs that are already present
([dotnet/sdk #55838](https://github.com/dotnet/sdk/pull/55838)).

Thank you [@jetersen](https://github.com/jetersen) for the original work in
[dotnet/sdk #55689](https://github.com/dotnet/sdk/pull/55689) and
[dotnet/sdk #55690](https://github.com/dotnet/sdk/pull/55690)!

## File-based programs add Native AOT reuse and formatting support

The Native AOT command-line path can reuse existing build outputs when it runs
an unchanged file-based program. Supported cached launches include
`dotnet run --file app.cs`, `dotnet run app.cs`, and `dotnet app.cs`. If the
cached output does not match the current command arguments, the CLI falls back
to the managed path ([dotnet/sdk #55529](https://github.com/dotnet/sdk/pull/55529)).

`dotnet format` also accepts a file-based program
([dotnet/sdk #55626](https://github.com/dotnet/sdk/pull/55626)):

```console
dotnet format app.cs
```

When a repository enables the SDK artifacts layout, file-based program outputs
are now placed under that repository's artifacts directory instead of the
default per-user cache ([dotnet/sdk #55697](https://github.com/dotnet/sdk/pull/55697)).

## `dotnet format` limits configuration discovery to included files

In folder mode, `dotnet format` now finds `.editorconfig` files by walking the
ancestor directories of files that will actually be formatted. It no longer
scans unrelated subtrees such as large `node_modules` directories
([dotnet/sdk #55248](https://github.com/dotnet/sdk/pull/55248)).

```console
dotnet format whitespace . --folder --include src/App/Program.cs
```

In one monorepo benchmark, formatting one included file improved from
1.09 seconds to 0.55 seconds. Use `.globalconfig`, rather than an
`is_global = true` `.editorconfig` in an unrelated subtree, for configuration
that must apply globally.

Thank you [@wellWINeo](https://github.com/wellWINeo) for this contribution!

## Additional CLI improvements

- **Install prerelease templates.** `dotnet new install --prerelease` selects
  the latest available version, including prerelease versions, when a template
  package version is not specified explicitly. An explicit package version,
  such as `Contoso.Templates@2.0.0-preview.3`, continues to select that exact
  version ([dotnet/sdk #55503](https://github.com/dotnet/sdk/pull/55503)).
- **Report corrected workload set versions.** Workload operations and
  `global.json` now detect versions written in the internal NuGet package
  format. The error reports the corrected user-facing format instead of a
  package-not-found error
  ([dotnet/sdk #54929](https://github.com/dotnet/sdk/pull/54929)).

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
  - [Emit `NETSDK1244` when `IncludeAllContentForSelfExtract` enables legacy full extraction](https://github.com/dotnet/sdk/pull/55559).
    Remove the property to use the default in-memory single-file behavior, or
    use `IncludeNativeLibrariesForSelfExtract` when only native libraries must
    be extracted.
  - [Fix `dotnet publish -o .` excluding all source files](https://github.com/dotnet/sdk/pull/55461)
  - [Fix single-file publish when XML documentation isn't copied to output](https://github.com/dotnet/sdk/pull/53156)
- **Workloads**
  - [Fix preview workload version search](https://github.com/dotnet/sdk/pull/55685)
  - [Fix invalid workload search version argument handling](https://github.com/dotnet/sdk/pull/55682)
