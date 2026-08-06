# .NET SDK in .NET 11 Preview 7 - Release Notes

<!-- Verified against installed SDK 11.0.100-preview.7.26381.103; no ref-pack API diff applies to SDK -->

.NET 11 Preview 7 promotes two large opt-in behaviors to default (NativeAOT CLI,
MSBuild server), adds run-level policy options to `dotnet test`, and rounds out
file-based apps and container publishing:

- [NativeAOT `dotnet` CLI is now enabled by default](#nativeaot-dotnet-cli-is-now-enabled-by-default)
- [MSBuild server is enabled by default](#msbuild-server-is-enabled-by-default)
- [`dotnet test` adds run-level `--timeout` and `--maximum-failed-tests`](#dotnet-test-adds-run-level---timeout-and---maximum-failed-tests)
- [`dotnet test` supports `Microsoft.Build.Traversal` projects](#dotnet-test-supports-microsoftbuildtraversal-projects)
- [`dotnet test` reporter improvements on Microsoft.Testing.Platform](#dotnet-test-reporter-improvements-on-microsofttestingplatform)
- [`dotnet test` gains MAUI device and environment support](#dotnet-test-gains-maui-device-and-environment-support)
- [File-based apps get `dotnet reference` and up-to-date-check fixes](#file-based-apps-get-dotnet-reference-and-up-to-date-check-fixes)
- [Container publishing prefers platform-native local runtimes](#container-publishing-prefers-platform-native-local-runtimes)
- [.NET tool packaging supports custom RID matrices](#net-tool-packaging-supports-custom-rid-matrices)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET SDK updates in .NET 11:

- [What's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/sdk)

## NativeAOT `dotnet` CLI is now enabled by default

Preview 6 shipped a NativeAOT `dotnet` command-handling fast path behind the
`DOTNET_CLI_ENABLEAOT` opt-in. Preview 7 flips that default: the AOT entry point
now runs by default on every platform, and users opt out by setting
`DOTNET_CLI_ENABLEAOT` to a falsy value (`false`, `0`, `no`, `off`)
([dotnet/sdk #55144](https://github.com/dotnet/sdk/pull/55144)), including on
macOS and Linux, where a platform gate previously kept it disabled.

```bash
# Opt back out of the NativeAOT path for a single command
DOTNET_CLI_ENABLEAOT=false dotnet --info
```

Native AOT mode delivers measured startup wins: matched managed/AOT runs of
`dotnet tool list` dropped from
378 ms to 68 ms (5.5× faster, an 82% cut)
([dotnet/sdk #54827](https://github.com/dotnet/sdk/pull/54827)), and
tool-dispatch commands like `dotnet dev-certs https` and `dotnet ef` fell from
roughly 700 ms to 200-220 ms (3.2-3.5× faster)
([dotnet/sdk #54810](https://github.com/dotnet/sdk/pull/54810)) — in both
cases from skipping a second CoreCLR boot for the managed CLI fallback.

As of this release, the AOT fast path serves a specific command set, and
everything else still falls back to the managed CLI:

- Built-in commands: `dotnet --version`, `dotnet --info`, `dotnet sdk check`,
  `dotnet sln list`, `sln migrate`, and `sln remove`
  ([dotnet/sdk #54384](https://github.com/dotnet/sdk/pull/54384)), and
  `dotnet tool list --local`, `tool run`, `tool uninstall --local`, and
  `tool search`.
- External-command resolution and invocation — global tools, local tools,
  PATH commands, and app-base commands such as `dotnet dev-certs https` and
  `dotnet ef` — also run from the AOT path.
- Still falls back to the managed CLI: commands that depend on MSBuild or
  NuGet in-process, such as `build`, `run`, `test`, `pack`, and `publish`,
  along with `sln add` and file-based app execution, while that work
  continues.

Additional AOT-path features landed alongside the default flip:

- `dotnet --info` now emits the workload version, workload list, and MSBuild
  version from the AOT binary, matching the managed CLI line for line
  ([dotnet/sdk #55084](https://github.com/dotnet/sdk/pull/55084)).
- `dotnet sdk check` is served from the AOT path
  ([dotnet/sdk #54391](https://github.com/dotnet/sdk/pull/54391)).
- The first-run experience (welcome banner, telemetry notice, workload manifest
  setup) is served from the AOT entry point
  ([dotnet/sdk #54970](https://github.com/dotnet/sdk/pull/54970)).
- The AOT muxer resolves the versioned SDK directory the same way the managed
  muxer does, so multi-SDK installs pick the right sdk folder
  ([dotnet/sdk #55110](https://github.com/dotnet/sdk/pull/55110)).
- `hostfxr` resolution no longer fails on musl-based distros when
  `HOSTFXR_PATH` is unset
  ([dotnet/sdk #55270](https://github.com/dotnet/sdk/pull/55270)).
- The NativeAOT CLI is now built and shipped from Source Build
  ([dotnet/sdk #55329](https://github.com/dotnet/sdk/pull/55329)) with Linux
  build legs added on x64 and arm64
  ([dotnet/sdk #55143](https://github.com/dotnet/sdk/pull/55143)) and same-OS
  cross-architecture builds (arm64 built on x64) enabled in CI
  ([dotnet/sdk #55205](https://github.com/dotnet/sdk/pull/55205)).

Thanks to [@pkubaj](https://github.com/pkubaj) for skipping the ILCompiler
bundle on unsupported architectures such as `ppc64le`
([dotnet/sdk #55051](https://github.com/dotnet/sdk/pull/55051)).

## MSBuild server is enabled by default

The MSBuild server keeps a warm MSBuild worker process alive between CLI
invocations so back-to-back `dotnet build`, `dotnet test`, and `dotnet run`
skip MSBuild startup. Preview 6 stopped the CLI from unconditionally overriding
`MSBUILDUSESERVER`; Preview 7 flips the default so the server is on unless you
opt out ([dotnet/sdk #55231](https://github.com/dotnet/sdk/pull/55231)). See
[MSBuild server improvements](msbuild.md#msbuild-server-improvements) in the
MSBuild release notes for the engine-side changes behind this default.

Opt-out honors both variables:

```bash
# Either of these keeps the classic single-shot MSBuild behavior
export DOTNET_CLI_USE_MSBUILD_SERVER=false
export MSBUILDUSESERVER=0
```

`DOTNET_CLI_USE_MSBUILD_SERVER=false` is now authoritative — it forwards
`MSBUILDUSESERVER=0` so the server can't be silently re-enabled by response
files, `MSBUILDFORCEMULTITHREADED=1`, or `/mt`
([dotnet/sdk #55393](https://github.com/dotnet/sdk/pull/55393)).

CLI hot paths also adopt MSBuild's new partial-evaluation API, so commands like
`dotnet sln add`, `dotnet reference list`, and release-property lookups stop
evaluation after the pass that produces the data they need instead of running a
full evaluation ([dotnet/sdk #55271](https://github.com/dotnet/sdk/pull/55271)).
See
[Partial (stop-after-pass) project evaluation](msbuild.md#partial-stop-after-pass-project-evaluation)
in the MSBuild release notes for details on the underlying API.

## `dotnet test` adds run-level `--timeout` and `--maximum-failed-tests`

Under Microsoft.Testing.Platform, `dotnet test` now accepts two new run-level
policy options placed **before** `--`. Passed after `--` they continue to apply
per test application, matching MTP's native behavior
([dotnet/sdk #55458](https://github.com/dotnet/sdk/pull/55458)).

```bash
# Abort the whole run after 90 seconds; exit code 3 (TestSessionAborted)
dotnet test --timeout 90s

# Stop the run once 5 failures accumulate across all test apps; exit code 13
dotnet test --maximum-failed-tests 5
```

`--timeout` accepts `ms`, `s`, and `m` suffixes; the clock only advances while
at least one test app is running. Both policies fire cooperative cancellation
over a new reverse control pipe (advertised as protocol capability
`ServerControlPipeName`), and the SDK now negotiates MTP 2.4 so the host can
honor `CancelSession` messages.

## `dotnet test` supports `Microsoft.Build.Traversal` projects

`dotnet test` on MTP now accepts a `Microsoft.Build.Traversal` project as input.
The SDK expands nested traversal graphs, de-duplicates diamond references, and
forwards per-reference `Configuration` and `Platform` metadata during build and
evaluation ([dotnet/sdk #55411](https://github.com/dotnet/sdk/pull/55411),
backported from [dotnet/sdk #55297](https://github.com/dotnet/sdk/pull/55297)).

```bash
dotnet test dirs.proj
```

This lets teams that curate their test suites through traversal projects run
`dotnet test` directly against the top-level traversal file instead of
enumerating individual test projects.

## `dotnet test` reporter improvements on Microsoft.Testing.Platform

Several MTP reporter capabilities landed in Preview 7:

- **Azure Pipelines log-command grouping** — the SDK now negotiates MTP
  protocol versions `1.2.0` and `1.3.0` and forwards the host's
  `AzureDevOpsLogMessage` (field id 11) and `DisplayMessage` (field id 12)
  frames to the console. Azure DevOps `##[group]` / `##[endgroup]` /
  `##vso[...]` commands emitted by the `AzureDevOpsReport` extension now
  render in the pipeline log, and generic host warnings/errors (hang and
  crash dumps, retry summaries) are surfaced through the terminal reporter
  ([dotnet/sdk #55221](https://github.com/dotnet/sdk/pull/55221)).
- **Expected/actual diffs on multi-assembly runs** — when the host reports
  `Expected` and `Actual` on a failed test result (field ids 10 and 11), the
  terminal reporter now renders the same assertion diff for multi-assembly
  runs that single-assembly runs already showed
  ([dotnet/sdk #55235](https://github.com/dotnet/sdk/pull/55235)).
- **Whole-run zero-tests verdict** — a solution run no longer fails just
  because one project matched no tests. The verdict is now computed once from
  the whole-run test count, but the per-module `Exit code: 8` diagnostic is
  preserved for troubleshooting
  ([dotnet/sdk #55362](https://github.com/dotnet/sdk/pull/55362)).
- **`--no-artifact-post-processing`** — a new opt-out skips the merge step
  that relaunches test applications to combine TRX and code coverage
  artifacts, and post-processing failures (including Ctrl+C) can no longer
  crash a completed run
  ([dotnet/sdk #55493](https://github.com/dotnet/sdk/pull/55493)).
- **CLI polish** — `dotnet test` now exposes `-nologo`, `--no-logo`, and
  `--no-banner` for suppressing the header
  ([dotnet/sdk #55454](https://github.com/dotnet/sdk/pull/55454),
  [dotnet/sdk #55409](https://github.com/dotnet/sdk/pull/55409)), and honors
  an ambient `Configuration` environment variable when the command line omits
  `-c`/`--configuration`
  ([dotnet/sdk #55452](https://github.com/dotnet/sdk/pull/55452)).
- **`--list-tests json`** — `--list-tests` now takes an optional output
  format, `text` (the default) or `json`, so discovered tests can be consumed
  by tooling instead of scraped from human-readable output
  ([dotnet/sdk #55299](https://github.com/dotnet/sdk/pull/55299)). The SDK
  renders the JSON itself from the discovery data it already receives over the
  `dotnettestcli` protocol, so it works with any MTP test host without a
  matching host-side change:

  ```bash
  dotnet test --list-tests json
  ```

  ```json
  {
    "version": "1.0",
    "testContainers": [
      {
        "assemblyPath": "MyTests.dll",
        "targetFramework": "net11.0",
        "architecture": "x64",
        "tests": [
          { "uid": "MyTests.CalculatorTests.Add", "displayName": "Add" }
        ]
      }
    ]
  }
  ```

## `dotnet test` gains MAUI device and environment support

`dotnet test` continues to pick up the device-oriented capabilities that
`dotnet run` already has for MAUI, Android, and iOS projects:

- **`--list-devices`** lists the device identifiers you can pass to
  `--device`, so you can discover targets without first running a build
  ([dotnet/sdk #54565](https://github.com/dotnet/sdk/pull/54565)). It resolves
  a single project and rejects solutions, because each project can have its
  own device list.
- **Device selection, build, and deployment now happen in the right order** —
  `dotnet test` picks a device (explicitly via `--device`, or automatically)
  *before* building, so that device's runtime identifier participates in the
  build for each target framework. After a successful build, `dotnet test`
  runs `DeployToDevice` for that device — before computing the test host's run
  arguments — so the tests actually execute against what was just deployed,
  not a stale copy on the device
  ([dotnet/sdk #55260](https://github.com/dotnet/sdk/pull/55260)). This is
  consistent whether you're testing a single project, a solution (deployed
  project-by-project and framework-by-framework), or a multi-targeted
  project, and it still runs on `--no-build` since a different device may
  need a fresh deployment of an existing build. A deployment failure stops
  the run with an error instead of launching tests against a broken deploy.
  Because devices are project- and platform-specific, `--device` requires
  `--project` and is rejected together with `--solution`.

  ```bash
  # Build for and deploy to a specific device, then run its tests
  dotnet test --project MyMauiTests.csproj --device <device-id>
  ```

- **`-e`/`--environment` parity** — environment variables set on the command
  line now flow through the whole MTP project pipeline rather than only
  reaching the test process. Projects that declare
  `RuntimeEnvironmentVariableSupport` see them as `@(RuntimeEnvironmentVariable)`
  items during build, device selection, deployment, and `ComputeRunArguments`
  ([dotnet/sdk #55325](https://github.com/dotnet/sdk/pull/55325)). Solution
  builds intentionally skip build-time injection, since the capability opt-in
  can't be applied per project through a single global MSBuild property.

## File-based apps get `dotnet reference` and up-to-date-check fixes

File-based apps, introduced in .NET 10, now integrate with the existing
`dotnet reference` command. `dotnet reference add --file app.cs <project>`
inserts a `#:project` directive into the C# file, and the sibling `list` and
`remove` subcommands manage it in place
([dotnet/sdk #54443](https://github.com/dotnet/sdk/pull/54443)).

```bash
dotnet new classlib -n MyLib -o MyLib
echo 'Console.WriteLine(MyLib.Class1.Greet());' > app.cs
dotnet reference add --file app.cs MyLib/MyLib.csproj
# app.cs now begins with:
#   #:project MyLib/MyLib.csproj
```

Additional file-based app polish:

- The `RunCommand` up-to-date check no longer treats an unchanged file as stale
  after project properties are updated
  ([dotnet/sdk #54556](https://github.com/dotnet/sdk/pull/54556)).
- The "missing shebang" analyzer now flags `#:ref` directives in addition to
  the previously supported directive set
  ([dotnet/sdk #54553](https://github.com/dotnet/sdk/pull/54553)).
- More logger arguments (`/bl`, `/binaryLogger`, `/nodeReuse`, `/tl`, and
  friends) are recognized on `dotnet run <file>.cs`, and unknown arguments now
  produce a clearer error
  ([dotnet/sdk #54637](https://github.com/dotnet/sdk/pull/54637)).
- The virtual project used for file-based apps is no longer evicted from the
  in-memory cache between related commands, which was causing intermittent
  `MSB4025: The project file could not be loaded` failures when a second
  command (for example, a build following a restore) raced the eviction of
  the first command's cached project
  ([dotnet/sdk #54958](https://github.com/dotnet/sdk/pull/54958)).
- Deletion of the shared artifacts directory between runs no longer crashes
  subsequent invocations
  ([dotnet/sdk #55057](https://github.com/dotnet/sdk/pull/55057)).

## Container publishing prefers platform-native local runtimes

The SDK's container publish pipeline now recognizes platform-native local
container CLIs — `wslc` on Windows and `container` on macOS — in addition to
Docker and Podman. Selection is automatic: the platform-native runtime is
preferred when present, with Docker and then Podman as fallbacks
([dotnet/sdk #55249](https://github.com/dotnet/sdk/pull/55249)). Each runtime
now owns its own readiness probe, archive format, load command, manifest
handling, and multi-platform capability, so behaviors that differ across
engines (for example, WSLC not supporting multi-arch local loads) are surfaced
as clear errors instead of confusing failures.

Set `LocalRegistry` explicitly to pin a runtime — the property now accepts
`Docker`, `Podman`, `Wslc`, and the new `MacOSContainer` value:

```xml
<PropertyGroup>
  <PublishProfile>DefaultContainer</PublishProfile>
  <LocalRegistry>Wslc</LocalRegistry>
</PropertyGroup>
```

Multi-arch container publishing also handles labels with colons in the value
correctly; source URLs and RFC 3339 timestamps are no longer truncated at the
second colon during inner builds
([dotnet/sdk #55437](https://github.com/dotnet/sdk/pull/55437)). Podman also
no longer skips image index creation, so multi-arch publishing to a local
Podman registry produces a proper manifest list
([dotnet/sdk #54614](https://github.com/dotnet/sdk/pull/54614)).

## .NET tool packaging supports custom RID matrices

Package authors publishing AOT-compiled .NET tools can now implement a
`ComputeToolPackageRuntimeIdentifiersToPack` target to declare which RIDs
their toolchain can build, and the SDK orchestrates one inner pack per RID.
Without a custom toolchain, the SDK falls back to a conservative default
matrix — Windows x64 packs `win-x64` and `win-arm64`, macOS x64 and arm64 pack
both `osx-x64` and `osx-arm64`, and every other host packs only itself
([dotnet/sdk #55250](https://github.com/dotnet/sdk/pull/55250)). This
unblocks external toolchains such as
[AotAnywhere](https://github.com/slang25/AotAnywhere) from participating in
multi-RID Native AOT tool packaging.

## Breaking changes

- **NativeAOT `dotnet` CLI enabled by default** — commands are served by the
  AOT binary unless `DOTNET_CLI_ENABLEAOT=false`
  ([dotnet/sdk #55144](https://github.com/dotnet/sdk/pull/55144)).
- **Local container runtime auto-selection** — Windows `wslc` and macOS
  `container` are preferred over Docker and Podman when installed. The legacy
  standalone `containerize` CLI is no longer packaged
  ([dotnet/sdk #55249](https://github.com/dotnet/sdk/pull/55249)).
- **`.NET tool` packages use the portable RID graph** — tool restore and
  install now resolve RIDs against the portable RID graph. Distributions that
  are only known to the legacy graph (for example, some BSD variants) now need
  a portable RID entry
  ([dotnet/sdk #55046](https://github.com/dotnet/sdk/pull/55046)).
- **`NoBuild=true` no longer builds project references** — SDK projects
  default `BuildProjectReferences` to `false` when `NoBuild=true`, so
  `dotnet publish --no-build` and `dotnet pack --no-build` no longer trigger a
  hidden `NETSDK1085`
  ([dotnet/sdk #55259](https://github.com/dotnet/sdk/pull/55259)).

  > [!IMPORTANT]
  > If your build depends on `--no-build` still building out-of-date project
  > references, set `BuildProjectReferences=true` explicitly to restore the
  > previous behavior.

## Bug fixes

- **CLI**
  - [Update FindSolutionFilesAtOrAbovePath to prioritize *.slnx over *.sln found in parent directories](https://github.com/dotnet/sdk/pull/55048)
  - [Fix `dotnet sln` failing to parse `.slnf` files with unescaped backslashes in path](https://github.com/dotnet/sdk/pull/54622)
  - [Emit more descriptive error when running .NET Framework exe on non-Windows](https://github.com/dotnet/sdk/pull/54581)
  - [Fix ObjectDisposedException in UnixProcessReaper during Ctrl+C shutdown](https://github.com/dotnet/sdk/pull/55121)
  - [Fix Native AOT SDK version lookup](https://github.com/dotnet/sdk/pull/55410)
  - [Fix Mark of the Web detection by removing MUTZ_ISFILE flag](https://github.com/dotnet/sdk/pull/54937)
- **`dotnet run`**
  - [Honor @(RuntimeEnvironmentVariable) item changes when launching the app](https://github.com/dotnet/sdk/pull/54922)
- **`dotnet watch`**
  - [Normalize IntermediateOutputPath slashes on POSIX platforms](https://github.com/dotnet/sdk/pull/54536)
  - [Update GenerateRuntimeConfigurationFiles task to generate Hot Reload runtime options](https://github.com/dotnet/sdk/pull/53715)
- **Publish**
  - [Fix composite ReadyToRun publish when RelativePath has a path component](https://github.com/dotnet/sdk/pull/55200)
- **Source generators**
  - [Don't generate embedded ValidatableTypeAttribute for .NET 11 and later](https://github.com/dotnet/sdk/pull/55163)
- **Analyzers**
  - [Do not report `CA2007` for pattern-based `await using` and `await foreach`](https://github.com/dotnet/sdk/pull/55036)
  - [Make CA1860 work with abstract collections](https://github.com/dotnet/sdk/pull/50461)
  - [CA1873: Fix log level comparison](https://github.com/dotnet/sdk/pull/54891)
- **Tools**
  - [Pack RID-specific tool pointer packages with DotnetToolSettings.xml under tools/any/any](https://github.com/dotnet/sdk/pull/55107)
- **Templates**
  - The `dotnet/templating` repository has been merged into `dotnet/sdk` — file
    template and `dotnet new` issues there going forward
    ([dotnet/sdk #55108](https://github.com/dotnet/sdk/pull/55108)).
  - [Retry `NuGet.org` template discovery with backoff before falling back to an offline error](https://github.com/dotnet/sdk/pull/55041)
  - [Fix case-sensitive path comparison in GlobalSettingsTemplatePackageProvider.EnsureInstallPrerequisites](https://github.com/dotnet/sdk/pull/55105)

## Community contributors

Thank you contributors! ❤️

- [@dnnr](https://github.com/dotnet/sdk/pulls?q=is%3Apr+is%3Amerged+author%3Adnnr)
- [@DoctorKrolic](https://github.com/dotnet/sdk/pulls?q=is%3Apr+is%3Amerged+author%3ADoctorKrolic)
- [@jithu7432](https://github.com/dotnet/sdk/pulls?q=is%3Apr+is%3Amerged+author%3Ajithu7432)
- [@pkubaj](https://github.com/dotnet/sdk/pulls?q=is%3Apr+is%3Amerged+author%3Apkubaj)
- [@verdie-g](https://github.com/dotnet/sdk/pulls?q=is%3Apr+is%3Amerged+author%3Averdie-g)
