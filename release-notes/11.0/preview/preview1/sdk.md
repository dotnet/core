# .NET SDK in .NET 11 Preview 1 - Release Notes

.NET 11 Preview 1 includes new .NET SDK features & enhancements.

Here's a summary of what's new in .NET SDK in this Preview 1 release:

- [CLI command improvements](#cli-command-improvements)
  - [`dotnet run`: Interactive target framework and device selection](#dotnet-run-interactive-target-framework-and-device-selection)
  - [`dotnet test`: Positional arguments](#dotnet-test-positional-arguments)
  - [`dotnet watch`: Hot Reload reference changes and configurable ports](#dotnet-watch-hot-reload-reference-changes-and-configurable-ports)
  - [`dotnet format`: Hidden severity support](#dotnet-format-hidden-severity-support)
- [Code analyzers](#code-analyzers)
  - [New analyzers](#new-analyzers)
- [New .NET SDK capabilities](#new-net-sdk-capabilities)
  - [`PublishReferenceSymbols` property](#publishreferencesymbols-property)
- [Other changes](#other-changes)
  - [Opt-out of automatic UTF-8 console encoding (mostly for Windows users)](#opt-out-of-automatic-utf-8-console-encoding-mostly-for-windows-users)
  - [File based apps behave more like project based apps](#file-based-apps-behave-more-like-project-based-apps)
- [Community contributors](#community-contributors)
- [Useful Links](#useful-links)

## CLI command improvements

### `dotnet run`: Interactive target framework and device selection

`dotnet run` has been significantly enhanced to support interactive selection workflows, laying the foundation for improved .NET MAUI and mobile development scenarios.

> **Spec**: [`dotnet run` for MAUI scenarios](https://github.com/dotnet/sdk/blob/main/documentation/specs/dotnet-run-for-maui.md)

#### Target framework selection

When running a multi-targeted project without specifying `--framework`, `dotnet run` now interactively prompts you to select a target framework using arrow keys (powered by [Spectre.Console](https://spectreconsole.net/)). In non-interactive terminals, a formatted error lists the available frameworks instead.

#### Device selection for mobile workloads

`dotnet run` now supports device selection for mobile and embedded workloads. Projects that implement a `ComputeAvailableDevices` MSBuild target (provided by the iOS and Android workloads) can expose available devices, emulators, and simulators. When multiple devices are available, `dotnet run` will interactively prompt you to select one. The selected device's `RuntimeIdentifier` is automatically propagated to subsequent build, deploy, and run steps.

A new `--device` switch allows bypassing the interactive prompt by specifying the target device directly, and `--list-devices` prints the available devices without running the app.

After a device is selected, `dotnet run` will also invoke the `DeployToDevice` MSBuild target if available, enabling a full build-deploy-run pipeline from the command line.

While this work is intended to improve the mobile development experience, the underlying extensibility is available for any workload or project type. If your project provides the necessary MSBuild targets, you can leverage this interactive device selection experience your own scenarios.

![GIF of `dotnet run` selections on Windows for Android](media/dotnet-11/dotnet-run-android-preview1.gif)

![GIF of `dotnet run` selections on macOS for iOS](media/dotnet-11/dotnet-run-ios-preview1.gif)

### `dotnet test`: Positional arguments

`dotnet test` for Microsoft.Testing.Platform now accepts the project, solution, directory, or test module as a positional argument — you no longer need to specify `--project` or similar options explicitly. For example:

```bash
# Before (still works)
dotnet test --project MyProject.csproj

# Now also works
dotnet test MyProject.csproj
```

This brings parity with the behavior that was available with VSTest and makes the command more consistent with the rest of the `dotnet` CLI.

- [dotnet/sdk#52449](https://github.com/dotnet/sdk/pull/52449)

### `dotnet watch`: Hot Reload reference changes and configurable ports

#### Support for changing project and package references

`dotnet watch` can now handle adding project and package references at runtime during a Hot Reload session. Previously, adding a new `PackageReference` or `ProjectReference` required restarting the app. Now, when a reference is added:

1. Roslyn validates the change and determines which projects need redeployment.
2. `dotnet watch` executes the `ReferenceCopyLocalPathsOutputGroup` target to copy the new dependencies to the output directory.
3. The delta applier in the running app loads the new assemblies via the `AssemblyResolving` event.

This enables a more fluid development workflow when iterating on multi-project solutions, without needing to restart the application.

- [dotnet/sdk#49611](https://github.com/dotnet/sdk/pull/49611)

#### Configurable browser refresh port

A new `DOTNET_WATCH_AUTO_RELOAD_WS_PORT` environment variable allows you to configure the WebSocket port used by `dotnet watch` for browser refresh. This complements the existing `DOTNET_WATCH_AUTO_RELOAD_WS_HOSTNAME` variable and is particularly useful in container-based development workflows where specific port forwarding rules need to be defined in advance.

```bash
# Pin the browser refresh WebSocket to a specific port
export DOTNET_WATCH_AUTO_RELOAD_WS_HOSTNAME=0.0.0.0
export DOTNET_WATCH_AUTO_RELOAD_WS_PORT=6123
dotnet watch
```

Thank you to [@wes-sleeman](https://github.com/wes-sleeman) for this community contribution!

- [dotnet/sdk#50629](https://github.com/dotnet/sdk/pull/50629)

### `dotnet format`: Hidden severity support

`dotnet format` now supports the `hidden` diagnostic severity level for analyzers and code fixes. Previously, diagnostics configured with `hidden` severity could not be targeted, making it impossible to apply code fixes for rules like `VSTHRD111`. Now you can use:

```bash
dotnet format --diagnostics VSTHRD111 --severity hidden
```

- [dotnet/sdk#43929](https://github.com/dotnet/sdk/pull/43929)

## Code analyzers

### New analyzers

Several new .NET code analyzers have been added in this release:

| Analyzer ID | Description | PR |
|-------------|-------------|-----|
| [CA1517](https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca1517) | Prefer `ReadOnlySpan<char>` over `string` for constant values | [#51216](https://github.com/dotnet/sdk/pull/51216) |
| [CA1830](https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca1830) | Prefer `StringBuilder.Append(char)` over `StringBuilder.Append(new string(char, int))` | [#51215](https://github.com/dotnet/sdk/pull/51215) |
| [CA1876](https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca1876) | Detect misuse of `AsParallel()` in `foreach` loops | [#51287](https://github.com/dotnet/sdk/pull/51287) |
| [CA1877](https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca1877) | Collapse nested `Path.Combine`/`Path.Join` calls | [#51456](https://github.com/dotnet/sdk/pull/51456) |
| [CA2026](https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca2026) | Prefer `JsonElement.Parse` over `JsonDocument.Parse().RootElement` | [#51209](https://github.com/dotnet/sdk/pull/51209) |
| [CA2027](https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca2027) | Detect non-cancelable `Task.Delay` in `Task.WhenAny` | [#51452](https://github.com/dotnet/sdk/pull/51452) |

## New .NET SDK capabilities

### `PublishReferenceSymbols` property

A new `PublishReferenceSymbols` MSBuild property controls whether `.pdb` files from referenced projects are included in the publish output. This complements the existing `PublishDocumentationFile`, `PublishReferencesDocumentationFiles`, and `CopyOutputSymbolsToPublishDirectory` properties to provide complete control over which artifacts are published.

```xml
<PropertyGroup>
  <!-- Include .pdb files from referenced projects in publish output -->
  <PublishReferenceSymbols>true</PublishReferenceSymbols>
</PropertyGroup>
```

- [dotnet/sdk#49707](https://github.com/dotnet/sdk/pull/49707)

## Other changes

### Opt-out of automatic UTF-8 console encoding (mostly for Windows users)

MSBuild automatically sets the console encoding to UTF-8 for consistent output across platforms. However, in some non-English environments (e.g., Japanese or Chinese systems), when redirecting console output to a pipe, the UTF-8 encoding can cause garbled text because there is no way to detect the encoding of the destination.

A new `DOTNET_CLI_FORCE_UTF8_ENCODING` environment variable allows you to opt out of this behavior:

```batch
# Use the system's default encoding instead of UTF-8
set DOTNET_CLI_FORCE_UTF8_ENCODING=false
dotnet build
```

- [dotnet/sdk#51261](https://github.com/dotnet/sdk/pull/51261)

### File based apps behave more like project based apps

File-based apps (e.g., `dotnet build app.cs`) now share the same verbosity defaults as project-based apps (e.g., `dotnet build MyProject.csproj`). Both experiences should look and feel the same now - this is one of the goals of the feature, so let us know if you see any inconsistencies.

- [dotnet/sdk#50243](https://github.com/dotnet/sdk/pull/50243)

## Community contributors

Thank you to all the community contributors who helped make this release possible! 💜

- [@hohosznta](https://github.com/hohosznta)
- [@Muximize](https://github.com/Muximize)
- [@rsking](https://github.com/rsking)
- [@sailro](https://github.com/sailro)
- [@wes-sleeman](https://github.com/wes-sleeman)
- [@xtqqczze](https://github.com/xtqqczze)

## Useful Links

- [What's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/overview) documentation
