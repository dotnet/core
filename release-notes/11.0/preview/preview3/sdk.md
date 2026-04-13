# .NET SDK in .NET 11 Preview 3 - Release Notes

.NET 11 Preview 3 includes new SDK and CLI improvements:

- [Solution filters can now be edited from the CLI](#solution-filters-can-now-be-edited-from-the-cli)
- [File-based apps can be split across files](#file-based-apps-can-be-split-across-files)
- [`dotnet run -e` passes environment variables from the command line](#dotnet-run--e-passes-environment-variables-from-the-command-line)
- [`dotnet watch` adds Aspire, crash recovery, and Windows desktop improvements](#dotnet-watch-adds-aspire-crash-recovery-and-windows-desktop-improvements)
- [Other CLI improvements](#other-cli-improvements)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET SDK updates in .NET 11:

- [What's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/sdk)

## Solution filters can now be edited from the CLI

`dotnet sln` can now create and edit solution filters (`.slnf`) directly from
the CLI ([dotnet/sdk #51156](https://github.com/dotnet/sdk/pull/51156)). This
lets large repositories load or build a subset of projects without changing the
main solution. You can learn more about solution filters
[in the documentation for them](https://learn.microsoft.com/visualstudio/msbuild/solution-filters).

```bash
dotnet new slnf --name MyApp.slnf
dotnet sln MyApp.slnf add src/Lib/Lib.csproj
dotnet sln MyApp.slnf list
dotnet sln MyApp.slnf remove src/Lib/Lib.csproj
```

## File-based apps can be split across files

File-based apps now support `#:include`, so shared helpers can move into
separate files without giving up the file-based workflow
([dotnet/sdk #52347](https://github.com/dotnet/sdk/pull/52347)). Roslyn also adds
editor completion for the directive
([dotnet/roslyn #82625](https://github.com/dotnet/roslyn/pull/82625)).

```csharp
#:include helpers.cs
#:include models/customer.cs

Console.WriteLine(Helpers.FormatOutput(new Customer()));
```

## `dotnet run -e` passes environment variables from the command line

`dotnet run -e FOO=BAR` lets you pass environment variables from the command
line for local app runs, without requiring you to export shell state or edit
launch profiles ([dotnet/sdk #52664](https://github.com/dotnet/sdk/pull/52664)).
This keeps short-lived configuration overrides on the command line instead of
in shell state or launch settings. Environment variables passed in this way will be available to MSBuild logic as `RuntimeEnvironmentVariable` Items for processing.

```bash
dotnet run -e ASPNETCORE_ENVIRONMENT=Development -e LOG_LEVEL=Debug
```

## `dotnet watch` adds Aspire, crash recovery, and Windows desktop improvements

Preview 3 adds several `dotnet watch` updates for long-running local development
loops. It can now integrate with Aspire app hosts
([dotnet/sdk #53192](https://github.com/dotnet/sdk/pull/53192)), automatically
relaunch after a crash when the next relevant file change arrives
([dotnet/sdk #53314](https://github.com/dotnet/sdk/pull/53314)), and handle
Ctrl+C more gracefully for Windows desktop apps such as WinForms and WPF
([dotnet/sdk #53127](https://github.com/dotnet/sdk/pull/53127)).

## Other CLI improvements

- `dotnet format` now accepts `--framework` for multi-targeted projects
  ([dotnet/sdk #53202](https://github.com/dotnet/sdk/pull/53202)).
- `dotnet test` in MTP mode now supports `--artifacts-path`
  ([dotnet/sdk #53353](https://github.com/dotnet/sdk/pull/53353)).
- `dotnet tool exec` and `dnx` no longer stop for an extra approval prompt
  ([dotnet/sdk #52956](https://github.com/dotnet/sdk/pull/52956)).

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - Windows archive tarballs: useful for some packaging scenarios, but narrower than the top CLI workflow stories.
  - OpenBSD RID support: good platform bring-up work, but too specialized for a broad SDK audience.
  - Several MTP and analyzer refinements: worthwhile polish, but better carried as shorter bullets or bug fixes than full sections.
-->

## Bug fixes

- Fixed `dotnet tool install --source` not being respected for global and local
  tools ([dotnet/sdk #52787](https://github.com/dotnet/sdk/pull/52787)).
- Fixed `dotnet remove package` not recognizing the project argument
  ([dotnet/sdk #53401](https://github.com/dotnet/sdk/pull/53401)).
- Fixed `NETSDK1005` when `dotnet run` targets a project that references
  projects with different target frameworks
  ([dotnet/sdk #53523](https://github.com/dotnet/sdk/pull/53523)).
- `dotnet workload repair` can recover from malformed/corrupted workload sets
  ([dotnet/sdk #52434](https://github.com/dotnet/sdk/pull/52434)).
- The `--self-contained` option now parses its passed-in value instead of
  always meaning `true`
  ([dotnet/sdk #52333](https://github.com/dotnet/sdk/pull/52333)).

## Community contributors

Thank you to all the community contributors who helped make this release
possible!

- [@am11](https://github.com/am11)
- [@Hextaku](https://github.com/Hextaku)
- [@kasperk81](https://github.com/kasperk81)
- [@manfred-brands](https://github.com/manfred-brands)
