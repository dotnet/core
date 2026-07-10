# .NET SDK in .NET 11 Preview 6 - Release Notes

<!-- Verified against changes.json for 11.0 Preview 6; no ref-pack API diff applies to SDK -->

.NET 11 Preview 6 includes significant SDK, CLI, and testing improvements:

- [NativeAOT CLI serves the full command surface](#nativeaot-cli-serves-the-full-command-surface)
- [`dotnet test` gains new options and improved output](#dotnet-test-gains-new-options-and-improved-output)
- [Test templates support xUnit v3 and NUnit on Microsoft.Testing.Platform](#test-templates-support-xunit-v3-and-nunit-on-microsofttestingplatform)
- [File-based apps support `#:include .dll` references](#file-based-apps-support-include-dll-references)
- [Container publishing supports multi-arch builds with Podman](#container-publishing-supports-multi-arch-builds-with-podman)
- [TypeScript outputs integrate with Static Web Assets](#typescript-outputs-integrate-with-static-web-assets)
- [CLI honors MSBuild server and standard OpenTelemetry env vars](#cli-honors-msbuild-server-and-standard-opentelemetry-env-vars)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET SDK updates in .NET 11:

- [What's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/sdk)

## NativeAOT CLI serves the full command surface

Preview 5 packaged the NativeAOT `dotnet-aot` library and gated it behind
`DOTNET_CLI_ENABLEAOT=true`. Preview 6 keeps the off-by-default behavior, but 
unifies the managed and NativeAOT CLI parsers into a single shared implementation, 
so the AOT fast path now parses, validates, and renders `--help` for every command 
— not just the small subset it previously handled
([dotnet/sdk #54653](https://github.com/dotnet/sdk/pull/54653)).

Commands that can run entirely without the managed runtime execute natively.
Every other command transparently falls back to the managed CLI. In Preview 6
the following commands are fully served from the AOT path:

- `dotnet --version`, `dotnet --info`, `dotnet --help`
- `dotnet <command> --help` for every built-in command
- `dotnet --cli-schema`
- `dotnet sln list`, `dotnet sln migrate`, `dotnet sln remove`
  ([dotnet/sdk #54384](https://github.com/dotnet/sdk/pull/54384))

Tool and external-command invocations (global tools, PATH commands, app-base
commands) now resolve and launch out-of-process from the AOT path as well,
skipping the 600–700 ms managed CLI startup for commands like `dotnet ef` or
`dotnet dev-certs`
([dotnet/sdk #54810](https://github.com/dotnet/sdk/pull/54810)).

OpenTelemetry tracing spans are emitted from the AOT path with correct
parent/child relationships to the managed CLI spans, enabling end-to-end
distributed trace analysis across both hosts
([dotnet/sdk #54544](https://github.com/dotnet/sdk/pull/54544)).

## `dotnet test` gains new options and improved output

Preview 6 adds several capabilities to `dotnet test` when running through
Microsoft.Testing.Platform (MTP):

**`--no-dependencies`** skips building project-to-project references, matching
the existing `dotnet build --no-dependencies` behavior
([dotnet/sdk #54435](https://github.com/dotnet/sdk/pull/54435)):

```bash
dotnet test --no-dependencies
```

**`DOTNET_TEST_RUNNER` environment variable** selects the test runner without
requiring a `global.json` change. Set it to `VSTest` or
`Microsoft.Testing.Platform` to override `global.json` for the current session
([dotnet/sdk #54482](https://github.com/dotnet/sdk/pull/54482)):

```bash
export DOTNET_TEST_RUNNER=Microsoft.Testing.Platform
dotnet test
```

**`--use-current-runtime` / `--ucr`** targets the current runtime during restore
and build, matching the option already available on `dotnet build` and
`dotnet publish`
([dotnet/sdk #54495](https://github.com/dotnet/sdk/pull/54495)).

**`--test-modules` exclusion patterns** — patterns starting with `!` are now
treated as excludes, and whitespace between semicolons is trimmed, making
YAML-folded CI expressions work correctly
([dotnet/sdk #54432](https://github.com/dotnet/sdk/pull/54432)):

```bash
dotnet test --test-modules "**/*.dll;!**/bin/Debug/**"
```

**Per-assembly test counts** appear in the summary line for multi-assembly runs
([dotnet/sdk #54513](https://github.com/dotnet/sdk/pull/54513)):

```text
MyTests.dll (net11.0|x64) passed [✓3/x0/↓1] (229ms)
```

**Terminal logger arguments** (`--tl`, `--terminallogger`, `--tlp`) are now
forwarded to MSBuild instead of being passed as test application arguments
([dotnet/sdk #54310](https://github.com/dotnet/sdk/pull/54310)).

**Protocol 1.1.0 output forwarding** — when the test host supports protocol
1.1.0, stdout/stderr and `IOutputDevice` messages are streamed live through the
terminal reporter instead of being shown only on failure
([dotnet/sdk #54825](https://github.com/dotnet/sdk/pull/54825)).

**Two-stage Ctrl+C cancellation** — the first press stops scheduling new test
apps and shows a hint; the second press force-kills all child test processes
([dotnet/sdk #54615](https://github.com/dotnet/sdk/pull/54615)).

**`--device` for MAUI** — select a device per target framework when running
tests for .NET MAUI projects
([dotnet/sdk #54295](https://github.com/dotnet/sdk/pull/54295)).

## Test templates support xUnit v3 and NUnit on Microsoft.Testing.Platform

The built-in `xunit` template adds a `--xunit-version` option. Use `v3` to
generate an xUnit v3 project that defaults to Microsoft.Testing.Platform as the
runner ([dotnet/sdk #54636](https://github.com/dotnet/sdk/pull/54636)):

```bash
dotnet new xunit --xunit-version v3
dotnet new xunit --xunit-version v3 --test-runner VSTest
```

The `nunit` template similarly adds a `--test-runner` option to opt in to
Microsoft.Testing.Platform
([dotnet/sdk #54638](https://github.com/dotnet/sdk/pull/54638)):

```bash
dotnet new nunit --test-runner Microsoft.Testing.Platform
```

Both options are available for C#, F#, and VB templates.

## File-based apps support `#:include .dll` references

File-based apps can now include compiled DLL references using `#:include`
without a feature flag. The default item-type mapping treats `.dll` files as
`Reference` items, so you can reference prebuilt libraries directly
([dotnet/sdk #54396](https://github.com/dotnet/sdk/pull/54396)):

```csharp
#:include ./libs/MyLibrary.dll

MyLibrary.Helper.DoWork();
```

Additionally, more `#:` directives are now allowed to appear as duplicates
across included files when their values match (`#:sdk`, `#:property`,
`#:package`), enabling self-contained library files that declare their own
dependencies without conflicting when multiple entry points include them
([dotnet/sdk #54206](https://github.com/dotnet/sdk/pull/54206)).

## Container publishing supports multi-arch builds with Podman

The SDK's built-in container publishing now supports building multi-architecture
container images when using Podman as the container engine
([dotnet/sdk #54575](https://github.com/dotnet/sdk/pull/54575)). Previously,
multi-arch builds required Docker. This unblocks rootless multi-arch workflows
on Linux distributions that ship Podman by default.

## TypeScript outputs integrate with Static Web Assets

Projects that use `Microsoft.TypeScript.MSBuild` in Razor Class Libraries now
properly integrate TypeScript compilation outputs with ASP.NET Core Static Web
Assets ([dotnet/sdk #52302](https://github.com/dotnet/sdk/pull/52302)). The new
integration hooks TypeScript outputs into the Static Web Assets pipeline after
compilation, enabling compression, fingerprinting, and correct rebuild behavior.
Previously, rebuild operations could fail because TypeScript outputs were
discovered before compilation or stale references persisted after clean.

## CLI honors MSBuild server and standard OpenTelemetry env vars

The `dotnet` CLI no longer suppresses the MSBuild build server when
`DOTNET_CLI_USE_MSBUILD_SERVER` is unset. Previously the CLI unconditionally
wrote `MSBUILDUSESERVER=0`, overriding any user-set value. Now, if
`DOTNET_CLI_USE_MSBUILD_SERVER` is not set, the CLI leaves `MSBUILDUSESERVER`
untouched so you can enable the MSBuild server directly
([dotnet/sdk #54918](https://github.com/dotnet/sdk/pull/54918)).

The OTLP telemetry exporter is now also enabled when any standard OpenTelemetry
`OTEL_EXPORTER_OTLP_*` environment variable is present (endpoint, protocol,
headers, or timeout — including signal-specific `_TRACES_*` and `_METRICS_*`
variants), in addition to the existing `DOTNET_CLI_TELEMETRY_ENABLE_EXPORTER`
flag ([dotnet/sdk #54386](https://github.com/dotnet/sdk/pull/54386)).

## Bug fixes

- **`dotnet test`**
  - `--environment` (`-e`) variables are now applied to the test process even
    when no launch profile is present
    ([dotnet/sdk #53306](https://github.com/dotnet/sdk/pull/53306)).
  - `KeyNotFoundException` no longer occurs in `TerminalTestReporter` when an
    assembly run completes
    ([dotnet/sdk #51608](https://github.com/dotnet/sdk/pull/51608)).
- **CLI**
  - The CLI parser no longer crashes when `global.json` is empty or unreadable;
    it falls back to the default VSTest runner
    ([dotnet/sdk #54433](https://github.com/dotnet/sdk/pull/54433)).
  - `launchSettings.json` files with JSON comments or trailing commas are now
    parsed correctly
    ([dotnet/sdk #54820](https://github.com/dotnet/sdk/pull/54820)).
  - A new `NETSDK1241` error is emitted when `TargetFramework` is present but
    empty, instead of a confusing "not recognized" message
    ([dotnet/sdk #54335](https://github.com/dotnet/sdk/pull/54335)).
- **`dotnet watch`**
  - A warning is now shown when project configuration disables Hot Reload
    (`MetadataUpdaterSupport` for .NET 11+, `Optimize`/`DebugSymbols` for older
    TFMs) ([dotnet/sdk #54264](https://github.com/dotnet/sdk/pull/54264)).
- **Publish**
  - `AppendPublishRuntimeIdentifierToRuntimeIdentifiers` can be set to `false`
    as an escape hatch for workloads that use `RuntimeIdentifiers` for
    multi-RID builds
    ([dotnet/sdk #54291](https://github.com/dotnet/sdk/pull/54291)).
- **Static Web Assets**
  - Blazor WebAssembly `blazor.webassembly.js` 404 errors caused by stale
    `AssetGroups` during framework asset materialization are fixed
    ([dotnet/sdk #54649](https://github.com/dotnet/sdk/pull/54649)).
- **Telemetry**
  - MAC address lookup failures no longer crash telemetry initialization when
    network interfaces are unavailable
    ([dotnet/sdk #54334](https://github.com/dotnet/sdk/pull/54334)).
  - Telemetry initialization in the NativeAOT muxer no longer crashes on macOS
    ([dotnet/sdk #54699](https://github.com/dotnet/sdk/pull/54699)).
- **Templates**
  - `dotnet new nunit-test -n <name>` no longer creates an unwanted `<name>/`
    subfolder ([dotnet/sdk #54602](https://github.com/dotnet/sdk/pull/54602)).
- **Tools**
  - Error messages for invalid `DotnetToolSettings.xml` now include the resolved
    package version
    ([dotnet/sdk #54822](https://github.com/dotnet/sdk/pull/54822)).

## Community contributors

Thank you contributors! ❤️

- [@HotCakeX](https://github.com/dotnet/sdk/pulls?q=is%3Apr+is%3Amerged+author%3AHotCakeX)
- [@sibber5](https://github.com/dotnet/sdk/pulls?q=is%3Apr+is%3Amerged+author%3Asibber5)
- [@SolalPirelli](https://github.com/dotnet/sdk/pulls?q=is%3Apr+is%3Amerged+author%3ASolalPirelli)
- [@WeihanLi](https://github.com/dotnet/sdk/pulls?q=is%3Apr+is%3Amerged+author%3AWeihanLi)
