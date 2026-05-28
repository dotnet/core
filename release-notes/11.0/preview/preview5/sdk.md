# .NET SDK in .NET 11 Preview 5 - Release Notes

.NET 11 Preview 5 includes new SDK, CLI, and template improvements:

- [File-based apps can reference other C# files](#file-based-apps-can-reference-other-c-files)
- [CLI commands handle file-based apps more consistently](#cli-commands-handle-file-based-apps-more-consistently)
- [SDK vulnerability and EOL checks are available during build](#sdk-vulnerability-and-eol-checks-are-available-during-build)
- [`dotnet new` includes the MCP Server template](#dotnet-new-includes-the-mcp-server-template)
- [Console apps include `System.Net.Http.Json` by default](#console-apps-include-systemnethttpjson-by-default)
- [Container publishing validates bearer-token realms](#container-publishing-validates-bearer-token-realms)
- [`dotnet test` disables ANSI output in LLM environments](#dotnet-test-disables-ansi-output-in-llm-environments)
- [NativeAOT CLI fast path is packaged and opt-in](#nativeaot-cli-fast-path-is-packaged-and-opt-in)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET SDK updates in .NET 11:

- [What's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/sdk)

## File-based apps can reference other C# files

File-based apps can now split code across files without first creating a
project. The new `#:ref` directive references another file-based app as a
library, and transitive references are supported
([dotnet/sdk #53480](https://github.com/dotnet/sdk/pull/53480)).

```csharp
// app.cs
#:ref lib.cs

Console.WriteLine(MyLib.Greeter.Greet("World"));
```

```csharp
// lib.cs
namespace MyLib;

public static class Greeter
{
    public static string Greet(string name) => $"Hello, {name}!";
}
```

The `#:include` and `#:exclude` directives no longer require feature flags
([dotnet/sdk #53775](https://github.com/dotnet/sdk/pull/53775)), and directives
inside included files are processed transitively without a feature flag
([dotnet/sdk #54012](https://github.com/dotnet/sdk/pull/54012)). Duplicate
`#:project` and `#:ref` entries are allowed, matching MSBuild item behavior
([dotnet/sdk #54035](https://github.com/dotnet/sdk/pull/54035)). Other
duplicate directives across included files now produce a diagnostic instead of
being accepted silently ([dotnet/sdk #54101](https://github.com/dotnet/sdk/pull/54101)).

## CLI commands handle file-based apps more consistently

More SDK commands now understand file-based app paths. Package and NuGet
commands can operate on the virtual project for a file-based app, so package
operations work before you convert the file into a project
([dotnet/sdk #53535](https://github.com/dotnet/sdk/pull/53535)).

```bash
dotnet package add app.cs System.CommandLine
dotnet package list app.cs
dotnet nuget why app.cs System.CommandLine
```

`dotnet watch` now follows the same file selection rules as `dotnet run` for
file-based apps. It skips options such as `-e` and `-bl` while looking for the
entry-point file, so commands like this parse correctly
([dotnet/sdk #53698](https://github.com/dotnet/sdk/pull/53698)):

```bash
dotnet watch -e ASPNETCORE_ENVIRONMENT=Development -bl app.cs
```

The CLI also warns about common file-based app mistakes. For example, if a
`.cs` file is passed to `dotnet run` from a directory that contains a project,
the warning suggests `dotnet run --file <file>` for a file-based app or
`dotnet run -- <file>` for an application argument
([dotnet/sdk #53833](https://github.com/dotnet/sdk/pull/53833)). File-based apps
that are meant to run directly from a shell can also get an analyzer warning
when the shebang is missing ([dotnet/sdk #53614](https://github.com/dotnet/sdk/pull/53614)).

## SDK vulnerability and EOL checks are available during build

Projects can opt in to SDK vulnerability and end-of-life checks during build
([dotnet/sdk #53557](https://github.com/dotnet/sdk/pull/53557)). NuGet already
warns about vulnerable packages; this check covers the resolved .NET SDK
version.

Enable the check in a project file or `Directory.Build.props`:

```xml
<PropertyGroup>
  <CheckSdkVulnerabilities>true</CheckSdkVulnerabilities>
</PropertyGroup>
```

When enabled, restore refreshes SDK release metadata in the background and
caches it under the user's `.dotnet` directory. The build task reads that cache
and does not contact the network itself. If no cache is available, the build
continues without warnings.

The feature uses two warning codes:

```text
warning NETSDK1236: The current .NET SDK (9.0.100) has known vulnerabilities (CVE-2025-12345, CVE-2025-99999). Update to version 9.0.102: https://dotnet.microsoft.com/download
warning NETSDK1237: The current .NET SDK (7.0.410) is end of life as of 2024-05-14. It will receive no further security updates: https://dotnet.microsoft.com/download
```

You can suppress one warning code without suppressing the other by using
`<NoWarn>`.

## `dotnet new` includes the MCP Server template

The SDK now bundles the MCP Server project template, so `dotnet new` can create
Model Context Protocol server projects without installing a separate template
package ([dotnet/sdk #54132](https://github.com/dotnet/sdk/pull/54132),
[dotnet/sdk #54409](https://github.com/dotnet/sdk/pull/54409)).

```bash
dotnet new mcpserver --transport local
```

The template supports local and remote transports. It also has options for
self-contained publishing and AOT scenarios, which are covered by the SDK's
integration tests for the bundled template.

## Console apps include `System.Net.Http.Json` by default

C# projects that use `Microsoft.NET.Sdk`, target `net11.0` or later, and enable
implicit usings now get `System.Net.Http.Json` automatically
([dotnet/sdk #54272](https://github.com/dotnet/sdk/pull/54272)). This aligns
console and worker projects with ASP.NET Core projects for common JSON-over-HTTP
code.

```csharp
using System.Net.Http;

HttpClient client = new();
Todo? todo = await client.GetFromJsonAsync<Todo>("https://example.com/todos/1");

record Todo(int Id, string Title);
```

No explicit `using System.Net.Http.Json;` is required when implicit usings are
enabled for `net11.0` or later.

## Container publishing validates bearer-token realms

The SDK's built-in container publishing support now validates the bearer-token
`realm` returned by a registry authentication challenge before using it
([dotnet/sdk #54225](https://github.com/dotnet/sdk/pull/54225)). The realm must
be an absolute URI. It must use HTTPS, except for registries explicitly
configured as insecure. The SDK also rejects realm hosts that resolve to blocked
IP literal forms such as loopback, private, link-local, or unspecified
addresses.

This validation still allows the normal OCI pattern where the registry host and
authentication host differ. For example, a registry can challenge from one host
and return a bearer-token realm on another public HTTPS host.

For private development registries, HTTP realms are allowed only when the
registry has already been configured as insecure and the realm host matches the
registry host.

## `dotnet test` disables ANSI output in LLM environments

When `dotnet test` runs through Microsoft.Testing.Platform in an LLM-oriented
environment, the SDK now disables ANSI escape sequences in test output
([dotnet/sdk #53654](https://github.com/dotnet/sdk/pull/53654)). This keeps test
logs easier to parse in tools that consume plain text.

The SDK recognizes the same family of LLM environment signals used by CLI
telemetry. Preview 5 also adds `COPILOT_CLI` to that detection set
([dotnet/sdk #54227](https://github.com/dotnet/sdk/pull/54227)).

## NativeAOT CLI fast path is packaged and opt-in

Preview 4 introduced the NativeAOT `dotnet` CLI fast-path foundation. Preview 5
packages the `dotnet-aot` native library into SDK layouts and installers
([dotnet/sdk #54056](https://github.com/dotnet/sdk/pull/54056),
[dotnet/sdk #54175](https://github.com/dotnet/sdk/pull/54175)). On Windows the
library is named `dotnet-aot.dll`; on Linux it is `libdotnet-aot.so`; on macOS
it is `libdotnet-aot.dylib`.

The AOT parser is gated by `DOTNET_CLI_ENABLEAOT=true`
([dotnet/sdk #54047](https://github.com/dotnet/sdk/pull/54047)). When the
environment variable is unset, the bridge falls through to the managed CLI path.
This keeps the fast path available for SDK development and testing without
changing the default command behavior.

## Breaking changes

- **Container registry auth challenges are validated more strictly.** Container
  publishing can now fail earlier when a registry returns a malformed realm, a
  non-HTTPS realm for a secure registry, or a realm that points to a blocked IP
  literal ([dotnet/sdk #54225](https://github.com/dotnet/sdk/pull/54225)).
- **Duplicate file-based app directives are diagnosed across included files.**
  Duplicate directives other than `#:project` and `#:ref` now produce an error
  even when the duplicate appears in a file brought in through `#:include`
  ([dotnet/sdk #54101](https://github.com/dotnet/sdk/pull/54101)).

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - Template engine System.Text.Json migration: internal dependency cleanup with no user-facing CLI behavior change.
  - Template engine README and search-cache updates: documentation and repo-consolidation plumbing.
  - IMultiThreadableTask migrations: SDK/MSBuild integration cleanup, not a feature most SDK users act on directly.
  - `-skipCrossgen` repo build option: useful for SDK contributors, not product release-note material.
-->

## Bug fixes

- **File-based apps**
  - File-based virtual projects keep a strong reference to their
    `ProjectRootElement`, preventing garbage collection from breaking later
    evaluation ([dotnet/sdk #53807](https://github.com/dotnet/sdk/pull/53807)).
  - `dotnet clean-file-based-app-artifacts` documentation and command naming were
    corrected ([dotnet/sdk #53806](https://github.com/dotnet/sdk/pull/53806)).
- **Tools**
  - `dnx` and `dotnet tool exec` now preserve NuGet configuration when executing
    tools from authenticated private feeds
    ([dotnet/sdk #53322](https://github.com/dotnet/sdk/pull/53322)).
  - Tool configuration deserialization no longer throws a `NullReferenceException`
    when `<RuntimeIdentifierPackages>` is omitted
    ([dotnet/sdk #53369](https://github.com/dotnet/sdk/pull/53369)).
- **Build and publish**
  - `dotnet publish -o .` no longer excludes the project source files from the
    build when the publish directory is the project directory
    ([dotnet/sdk #53923](https://github.com/dotnet/sdk/pull/53923)).
  - Deps file generation no longer fails with `An item with the same key has
    already been added` when the project name matches a dependency reference
    assembly name ([dotnet/sdk #53450](https://github.com/dotnet/sdk/pull/53450)).
- **Static web assets**
  - HTML placeholder endpoint regeneration now preserves additional endpoint
    routes such as default-document and SPA fallback endpoints
    ([dotnet/sdk #54353](https://github.com/dotnet/sdk/pull/54353)).
- **Templates**
  - Template loading now tolerates exact duplicate JSON keys by falling back to
    last-wins parsing, matching the previous Newtonsoft.Json behavior
    ([dotnet/sdk #54161](https://github.com/dotnet/sdk/pull/54161)).
- **Analyzers**
  - CA1033 is no longer reported for interfaces with default implementations
    ([dotnet/sdk #50339](https://github.com/dotnet/sdk/pull/50339)).
- **Telemetry**
  - The OTLP exporter is now disabled by default and can be enabled with
    `DOTNET_CLI_TELEMETRY_ENABLE_EXPORTER=true`
    ([dotnet/sdk #54193](https://github.com/dotnet/sdk/pull/54193)).
  - CLI telemetry avoids HTTP client instrumentation and only creates the
    in-memory exporter when disk logging is enabled
    ([dotnet/sdk #54153](https://github.com/dotnet/sdk/pull/54153)).

## Community contributors

Thank you contributors! ❤️

- [@Alex-Sob](https://github.com/dotnet/sdk/pulls?q=is%3Apr+is%3Amerged+author%3AAlex-Sob+milestone%3A11.0-preview5)
- [@elias-io](https://github.com/dotnet/sdk/pulls?q=is%3Apr+is%3Amerged+author%3Aelias-io+milestone%3A11.0-preview5)
- [@robertcoltheart](https://github.com/dotnet/sdk/pulls?q=is%3Apr+is%3Amerged+author%3Arobertcoltheart+milestone%3A11.0-preview5)
- [@trungnt2910](https://github.com/dotnet/sdk/pulls?q=is%3Apr+is%3Amerged+author%3Atrungnt2910+milestone%3A11.0-preview5)
- [@victorfrye](https://github.com/dotnet/sdk/pulls?q=is%3Apr+is%3Amerged+author%3Avictorfrye+milestone%3A11.0-preview5)
