# .NET SDK in .NET 11 Preview 4 - Release Notes

.NET 11 Preview 4 includes new SDK and CLI improvements:

- [`dotnet watch` adds device selection for MAUI and mobile projects](#dotnet-watch-adds-device-selection-for-maui-and-mobile-projects)
- [`dotnet watch` reliability fixes for Ctrl+R restart, iOS, and the TFM prompt](#dotnet-watch-reliability-fixes-for-ctrlr-restart-ios-and-the-tfm-prompt)
- [Fish shell completions match Bash, Zsh, and PowerShell](#fish-shell-completions-match-bash-zsh-and-powershell)
- [`dotnet reference` and similar commands fall back to the current directory](#dotnet-reference-and-similar-commands-fall-back-to-the-current-directory)
- [`dotnet nuget <subcommand> --help` forwards to the NuGet CLI again](#dotnet-nuget-subcommand---help-forwards-to-the-nuget-cli-again)
- [Launch settings notice moved to stderr](#launch-settings-notice-moved-to-stderr)
- [Asset Groups for Static Web Assets](#asset-groups-for-static-web-assets)
- [OpenTelemetry replaces Application Insights for CLI telemetry](#opentelemetry-replaces-application-insights-for-cli-telemetry)
- [NativeAOT entry point for the `dotnet` CLI (foundation)](#nativeaot-entry-point-for-the-dotnet-cli-foundation)
- [Smaller SDK archives continue to shrink](#smaller-sdk-archives-continue-to-shrink)
- [Partial Ready-to-Run for upstack tooling](#partial-ready-to-run-for-upstack-tooling)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET SDK updates in .NET 11:

- [What's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/sdk)

## `dotnet watch` adds device selection for MAUI and mobile projects

`dotnet watch` now mirrors the `dotnet run` device-selection flow for MAUI and
mobile targets ([dotnet/sdk #53631](https://github.com/dotnet/sdk/pull/53631)).
After picking a target framework, `dotnet watch` calls the
`ComputeAvailableDevices` MSBuild target, auto-selects when there is a single
device, and shows an interactive Spectre.Console prompt with search when there
are several. The chosen device flows through to `dotnet build` (`-p:Device`,
`-p:RuntimeIdentifier`) and the launched `dotnet run` subprocess, including a
re-restore when the device requires a `RuntimeIdentifier` not present in the
original restore.

You can also pre-select a device on the command line:

```bash
dotnet watch --device <device-id>
```

`dotnet watch` works for Android devices and emulators, in addition to iOS
Simulators.

![GIF of `dotnet watch` on Windows for Android](media/net11p4-dotnet-watch-android.gif)

The framework prompt itself was upgraded to use Spectre.Console as well, so
arrow-key navigation, search, and pagination now work the same way as in
`dotnet run` ([dotnet/sdk #53540](https://github.com/dotnet/sdk/pull/53540)).

## `dotnet watch` reliability fixes for Ctrl+R restart, iOS, and the TFM prompt

Several long-standing `dotnet watch` issues are fixed in Preview 4:

- The Spectre.Console TFM picker no longer appears stuck because two readers
  were both calling `Console.ReadKey()`. Keys now flow through a single
  `PhysicalConsole.KeyPressed` event
  ([dotnet/sdk #53675](https://github.com/dotnet/sdk/pull/53675)).
- Ctrl+C and Ctrl+R no longer surface a spurious `WebSocketException` /
  `ObjectDisposedException` when the WebSocket transport tears down
  ([dotnet/sdk #53648](https://github.com/dotnet/sdk/pull/53648)).
- Hot Reload no longer deadlocks on iOS when `UIKitSynchronizationContext` is
  installed before the startup hook runs
  ([dotnet/sdk #54023](https://github.com/dotnet/sdk/pull/54023)).

Together these make `dotnet watch` usable end-to-end on a `dotnet new maui`
project running in the iOS Simulator.

![GIF of `dotnet watch` on macOS for iOS](media/net11p4-dotnet-watch-ios.gif)

### Known issue: `dotnet watch` requires `MtouchLink=None` for iOS Simulator

`dotnet watch` does not work for iOS projects unless `<MtouchLink>None</MtouchLink>`
is set in the `.csproj` file
([dotnet/macios #25295](https://github.com/dotnet/macios/issues/25295)). Add the
following to your project file:

```xml
<PropertyGroup>
  <MtouchLink>None</MtouchLink>
</PropertyGroup>
```

## Fish shell completions match Bash, Zsh, and PowerShell

The fish shell provider previously emitted a one-liner that delegated every
completion to a dynamic `dotnet complete` call. Preview 4 replaces it with a
full static + dynamic completion generator, matching the Bash, Zsh, and
PowerShell providers
([dotnet/sdk #53716](https://github.com/dotnet/sdk/pull/53716)). The generated
script walks the tokenized command line, emits static completions for
subcommands, options, and positional arguments, and falls back to dynamic
`complete` calls only where required.

Thank you [@slang25](https://github.com/slang25) for this contribution!

## `dotnet reference` and similar commands fall back to the current directory

`dotnet reference add` and `dotnet reference remove` now fall back to the
current directory when no `--project` is supplied, matching the long-standing
behavior of `dotnet reference list`
([dotnet/sdk #53594](https://github.com/dotnet/sdk/pull/53594), fixes
[dotnet/sdk #51897](https://github.com/dotnet/sdk/issues/51897)).

```bash
cd ClassLib2
dotnet reference add ../ClassLib1/ClassLib1.csproj      # now works
dotnet reference remove ../ClassLib1/ClassLib1.csproj   # now works
```

Previously these commands failed with `Could not find project or directory ''`
when run from a directory that already contained a project file.

## `dotnet nuget <subcommand> --help` forwards to the NuGet CLI again

`dotnet nuget add source --help` and other NuGet subcommands now correctly
forward to the NuGet CLI's help output instead of falling back to generic
System.CommandLine help
([dotnet/sdk #53723](https://github.com/dotnet/sdk/pull/53723), fixes
[dotnet/sdk #53673](https://github.com/dotnet/sdk/issues/53673)). This was a
regression in the 11.0 SDK.

## Launch settings notice moved to stderr

The `Using launch settings from ...` informational message now writes to
`stderr` instead of `stdout`
([dotnet/sdk #53797](https://github.com/dotnet/sdk/pull/53797), fixes
[dotnet/sdk #45640](https://github.com/dotnet/sdk/issues/45640)). Scripts that
capture the standard output of `dotnet run` no longer have to strip this line
out.

Thank you [@Christian-Sidak](https://github.com/Christian-Sidak) for this
contribution!

## Asset Groups for Static Web Assets

The Static Web Assets SDK adds support for **Asset Groups**, a way to declare
groups of related assets that share publish, fingerprinting, and endpoint
metadata ([dotnet/sdk #53187](https://github.com/dotnet/sdk/pull/53187)). The
related `DefineStaticWebAssetEndpoints` task gains an
`AdditionalEndpointDefinitions` parameter, and the glob matcher exposes the
captured `**` stem so additional endpoints (for example default-document routes
like `/` for `**/index.html`) can be defined declaratively without
suffix-stripping logic in user MSBuild
([dotnet/sdk #53593](https://github.com/dotnet/sdk/pull/53593)).

This is plumbing for ASP.NET Core component authors and SDK extension authors;
most app developers will see the result indirectly as their Razor and Blazor
component packages ship cleaner static-asset metadata.

## OpenTelemetry replaces Application Insights for CLI telemetry

The `dotnet` CLI now uses OpenTelemetry (with the Azure Monitor and OTLP
exporters) for its opt-in telemetry, replacing the previous
`Microsoft.ApplicationInsights` dependency
([dotnet/sdk #53181](https://github.com/dotnet/sdk/pull/53181) and
[dotnet/sdk #53800](https://github.com/dotnet/sdk/pull/53800)).

The user-facing behavior is unchanged — the same telemetry is collected, with
the same opt-out via `DOTNET_CLI_TELEMETRY_OPTOUT`. The motivation is to make
the CLI AOT-friendly: `Microsoft.ApplicationInsights` was not, and removing it
unblocks the NativeAOT entry point work below. As a side effect of the
exporters not yet being source-buildable, telemetry is currently emitted only
on Windows builds; non-Windows builds remain telemetry-free until the
OpenTelemetry packages are available in source-build.

## NativeAOT entry point for the `dotnet` CLI (foundation)

Preview 4 lays the groundwork for a NativeAOT-compiled `dotnet` CLI host
([dotnet/sdk #54002](https://github.com/dotnet/sdk/pull/54002)). The work
introduces three layers:

- `dn.exe` — a NativeAOT host that resolves `DOTNET_ROOT` and `hostfxr` and
  marshals arguments into a NativeAOT shared library. This is for SDK-repo
  dogfooding, not for production usage.
- `dotnet-aot.dll` — a NativeAOT shared library that handles simple commands
  such as `--version` and `--info` directly, and falls back to the full managed
  CLI via `hostfxr` for everything else.
- `dotnet.dll` — the existing managed CLI, with `#if CLI_AOT` conditionals so
  the same source files can be compiled into both paths.

The goal is near-instant startup for the most common CLI invocations while
preserving full functionality for the rest. The new entry point is not yet the
default `dotnet` binary; it ships as architectural foundation in this preview
and you can read the included `DESIGN.md` for the build and debugging workflow.

## Smaller SDK archives continue to shrink

Preview 2 introduced smaller SDK installers on Linux and macOS by deduplicating
assemblies. Preview 4 trims the SDK further by skipping crossgen for assemblies
that only exist under `DotnetTools/`
([dotnet/sdk #53659](https://github.com/dotnet/sdk/pull/53659)). Assemblies
that also exist outside `DotnetTools/` are still crossgen'd — they get the
startup benefit and the duplicate is then removed — but assemblies unique to
`DotnetTools/` are left as IL only. The `Microsoft.CodeAnalysis.VisualBasic*`
crossgen exclusion was also broadened to apply globally rather than only under
`Roslyn/bincore`.

On a `linux-x64` dev build this reduces the SDK tarball by **23.6 MB**.

## Partial Ready-to-Run for upstack tooling

A new MSBuild property lets upstack tooling (for example `dotnet/macios` and
`dotnet/maui`) declare a list of assemblies that should be partially R2R-compiled
and excluded from the composite image
([dotnet/sdk #53635](https://github.com/dotnet/sdk/pull/53635)). The motivating
scenario is precompiling generated XAML code in Debug builds to speed up F5,
without paying the full crossgen cost for the rest of the app. App developers
do not set this property directly — it is a hook the mobile workloads will use
in their targets.

## Breaking changes

- **Template engine drops `netstandard2.0`.** All template engine projects
  (`Microsoft.TemplateEngine.Abstractions`, `Core`, `Core.Contracts`, `Edge`,
  `IDE`, `Orchestrator.RunnableProjects`, `Utils`, and `TemplateLocalizer.Core`)
  now target only `$(NetMinimum)`, `$(NetCurrent)`, and `$(NetFrameworkToolCurrent)`
  ([dotnet/sdk #54041](https://github.com/dotnet/sdk/pull/54041)). NuGet 7.0
  dropped netstandard support, so keeping the template engine on
  `netstandard2.0` had become impractical. Tools that consume the template
  engine libraries directly will need to retarget; the `dotnet new` CLI is
  unaffected.

## Bug fixes

- **CLI**
  - `dotnet publish` no longer removes native DLLs on subsequent runs of
    single-file publish
    ([dotnet/sdk #52755](https://github.com/dotnet/sdk/pull/52755), fixes
    [dotnet/sdk #52151](https://github.com/dotnet/sdk/issues/52151)).
  - `NET10_0_OR_GREATER` (and the cumulative `NET*_OR_GREATER` defines) is now
    emitted when targeting `net10.0` on MSBuild < 18 (for example VS 17.14)
    ([dotnet/sdk #53976](https://github.com/dotnet/sdk/pull/53976)).
- **Containers**
  - Ubuntu codename resolution updated for the noble → resolute change so SDK
    container builds work on .NET 11
    ([dotnet/sdk #53371](https://github.com/dotnet/sdk/pull/53371)). Thank you
    [@hwoodiwiss](https://github.com/hwoodiwiss)!
  - Container image digest validation aligns more closely with the OCI spec,
    using anchored digest regexes and centralizing format checks in
    `DigestUtils`
    ([dotnet/sdk #53724](https://github.com/dotnet/sdk/pull/53724),
    [dotnet/sdk #53933](https://github.com/dotnet/sdk/pull/53933)).
- **Workloads**
  - Built-in workload manifests in preview SDK archives are now placed under
    the preview feature band (for example `sdk-manifests/11.0.100-preview.4/`)
    instead of the stable band
    ([dotnet/sdk #53857](https://github.com/dotnet/sdk/pull/53857), fixes
    [dotnet/sdk #53234](https://github.com/dotnet/sdk/issues/53234)).
- **Aspire integration**
  - `dotnet run` correctly launches the Aspire host again
    ([dotnet/sdk #53877](https://github.com/dotnet/sdk/pull/53877)).
- **Process redirection**
  - `dotnet watch` and the underlying process launcher no longer redirect child
    process output unnecessarily, which previously prevented a child process
    console from being created on Windows
    ([dotnet/sdk #53539](https://github.com/dotnet/sdk/pull/53539), fixes
    [dotnet/sdk #53091](https://github.com/dotnet/sdk/issues/53091)).

## Community contributors

Thank you contributors! ❤️

- [@Christian-Sidak](https://github.com/dotnet/sdk/pulls?q=is%3Apr+is%3Amerged+author%3AChristian-Sidak)
- [@hwoodiwiss](https://github.com/dotnet/sdk/pulls?q=is%3Apr+is%3Amerged+author%3Ahwoodiwiss)
- [@slang25](https://github.com/dotnet/sdk/pulls?q=is%3Apr+is%3Amerged+author%3Aslang25)
