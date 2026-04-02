# .NET SDK in .NET 11 Preview 3 - Release Notes

.NET 11 Preview 3 includes new .NET SDK features & enhancements:

- [Solution filter CLI support](#solution-filter-cli-support)
- [File-based apps: `#:include` directive](#file-based-apps-include-directive)
- [CLI command improvements](#cli-command-improvements)
  - [`dotnet run -e`: Pass environment variables](#dotnet-run--e-pass-environment-variables)
  - [`dotnet run/watch`: Graceful Ctrl+C on Windows](#dotnet-runwatch-graceful-ctrlc-on-windows)
  - [Target framework selection for multi-targeted projects](#target-framework-selection-for-multi-targeted-projects)
  - [`dotnet format --framework` support](#dotnet-format---framework-support)
  - [`dotnet test --artifacts-path` in MTP mode](#dotnet-test---artifacts-path-in-mtp-mode)
  - [`dotnet tool exec` implicit approval](#dotnet-tool-exec-implicit-approval)
  - [`project convert --delete-source` option](#project-convert---delete-source-option)
- [`dotnet watch` improvements](#dotnet-watch-improvements)
  - [Aspire support](#aspire-support)
  - [Auto-relaunch on process crash](#auto-relaunch-on-process-crash)
- [Windows archive tarballs](#windows-archive-tarballs)
- [Code analyzer updates](#code-analyzer-updates)
- [Other improvements](#other-improvements)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET SDK updates in .NET 11:

- [What's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/overview) documentation

<!-- Filtered features: file-based app API cleanup (sdk#53056), file-based app virtual csproj naming (sdk#53182), directive parser and consolidation (sdk#53087, sdk#53136), websocket transport internals for mobile (sdk#52581, sdk#53108), R2R crossgen for DotnetTools (sdk#53266), MSBuild task multithreading (sdk#52938), Newtonsoft.Json to System.Text.Json migration (sdk#53345, templating#9956), Static Web Assets framework source type (sdk#53135), templating AOT compatibility (templating#10006), dotnet-format move (sdk#53138), VSHostObject refactoring (sdk#52856, sdk#53028), Hot Reload loop refactoring (sdk#53048), MTP command refactoring (sdk#53504), compatibility tools refactoring (sdk#53213), optimized run-file embedded content generation (sdk#53086), FrameworkList.xml for file-based app builds (sdk#53205), csc.rsp disk writes (sdk#53235), Apple mobile crossgen2 strip args (sdk#53514), binary logger parameter parsing (sdk#53492), CliFolderPathCalculator refactoring (sdk#53124) -->

## Solution filter CLI support

The `dotnet sln` command now supports creating and editing solution filter (`.slnf`) files directly from the CLI ([dotnet/sdk#51156](https://github.com/dotnet/sdk/pull/51156)). Solution filters let you work with a subset of projects in a large solution without modifying the `.sln` file. Previously, `.slnf` files could only be created in Visual Studio.

```bash
# Add a project to a solution filter
dotnet sln MyApp.slnf add src/Lib/Lib.csproj

# List projects in the filter
dotnet sln MyApp.slnf list

# Remove a project from the filter
dotnet sln MyApp.slnf remove src/Lib/Lib.csproj
```

## File-based apps: `#:include` directive

File-based apps now support a `#:include` directive to incorporate other source files ([dotnet/sdk#52347](https://github.com/dotnet/sdk/pull/52347)). This makes it practical to split larger file-based apps across multiple files and share common utilities between scripts.

```csharp
#:include helpers.cs
#:include models/customer.cs

Console.WriteLine(Helpers.FormatOutput(new Customer()));
```

## CLI command improvements

### `dotnet run -e`: Pass environment variables

`dotnet run` accepts a new `-e` flag to pass environment variables to the launched application ([dotnet/sdk#52664](https://github.com/dotnet/sdk/pull/52664)). Variables set with `-e` are forwarded as `@(RuntimeEnvironmentVariable)` items, so they reach the target process without affecting the build environment.

```bash
dotnet run -e ASPNETCORE_ENVIRONMENT=Development -e LOG_LEVEL=Debug
```

### `dotnet run/watch`: Graceful Ctrl+C on Windows

`dotnet run` and `dotnet watch` now gracefully handle Ctrl+C for Windows desktop applications including WinForms, WPF, and MAUI ([dotnet/sdk#53127](https://github.com/dotnet/sdk/pull/53127)). Previously, pressing Ctrl+C could leave child processes running or skip cleanup. The shutdown signal is now forwarded correctly to the target process.

### Target framework selection for multi-targeted projects

The interactive target framework selection introduced in Preview 1 now works with the build pipeline for multi-targeted projects ([dotnet/sdk#53466](https://github.com/dotnet/sdk/pull/53466)). When a project targets multiple frameworks and no `--framework` is specified, the SDK selects the appropriate framework rather than failing with an ambiguous build error.

### `dotnet format --framework` support

`dotnet format` accepts a new `--framework` argument to target a specific framework in multi-targeted projects ([dotnet/sdk#53202](https://github.com/dotnet/sdk/pull/53202)). This ensures formatters and analyzers run against the correct compilation, which can matter when code uses conditional compilation symbols.

```bash
dotnet format --framework net11.0
```

Thank you [@Hextaku](https://github.com/Hextaku) for this contribution!

### `dotnet test --artifacts-path` in MTP mode

`dotnet test` in Microsoft.Testing.Platform mode now supports `--artifacts-path` to specify the output directory for test results ([dotnet/sdk#53353](https://github.com/dotnet/sdk/pull/53353)). This brings parity with the existing artifacts-path support in the classic test runner.

```bash
dotnet test --artifacts-path ./test-results
```

### `dotnet tool exec` implicit approval

Running tools with `dotnet tool exec` (or the `dnx` shorthand) no longer prompts for user approval ([dotnet/sdk#52956](https://github.com/dotnet/sdk/pull/52956)). Invoking `dnx <tool>` is treated as implicit consent to execute the tool, removing an extra confirmation step in automated workflows and CI pipelines.

### `project convert --delete-source` option

`dotnet project convert` gains a `--delete-source` option and interactive prompt for removing original source files after a successful conversion ([dotnet/sdk#52802](https://github.com/dotnet/sdk/pull/52802)). When converting a `packages.config` project to `PackageReference`, you can now clean up the old files in one step.

```bash
dotnet project convert --delete-source
```

## `dotnet watch` improvements

### Aspire support

`dotnet watch` now integrates with .NET Aspire orchestration ([dotnet/sdk#53192](https://github.com/dotnet/sdk/pull/53192)). When running an Aspire app host, `dotnet watch` detects Aspire service projects and applies Hot Reload across the distributed application. This enables a single `dotnet watch` session to monitor changes across all projects in an Aspire solution.

### Auto-relaunch on process crash

`dotnet watch` can now automatically relaunch an application when it crashes ([dotnet/sdk#53314](https://github.com/dotnet/sdk/pull/53314)). After a process exit, `dotnet watch` waits for the next relevant source or dependency file change and restarts the application. This reduces manual restarts during iterative development.

## Windows archive tarballs

The SDK now produces archive tarballs for Windows, extending the installer deduplication work from Preview 2 ([dotnet/sdk#52910](https://github.com/dotnet/sdk/pull/52910)). Windows tarballs provide an xcopy-deployable SDK layout suitable for containers and CI environments that do not use MSI installers.

## Code analyzer updates

| Analyzer ID | Change | PR |
| --- | --- | --- |
| [CA1708](https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca1708) | The naming check now ignores C# `extension` blocks, eliminating false positives for extension member types | [dotnet/sdk#51838](https://github.com/dotnet/sdk/pull/51838) |
| [CA1825](https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca1825) | Fixed false positive when collection expressions are used | [dotnet/sdk#53521](https://github.com/dotnet/sdk/pull/53521) |

Thank you [@manfred-brands](https://github.com/manfred-brands) for the CA1708 contribution!

## Other improvements

- **OpenBSD RID support** — The SDK infrastructure now recognizes OpenBSD runtime identifiers ([dotnet/sdk#53227](https://github.com/dotnet/sdk/pull/53227)). Thank you [@am11](https://github.com/am11)!
- **`workload repair` recovers from corrupt workload sets** — `dotnet workload repair` can now detect and recover from corrupted workload set installations ([dotnet/sdk#52434](https://github.com/dotnet/sdk/pull/52434)).
- **Reject `--add-source` with package source mapping** — `dotnet restore` now rejects the `--add-source` option when package source mapping is enabled, preventing accidental bypass of source mapping rules ([dotnet/sdk#52863](https://github.com/dotnet/sdk/pull/52863)).
- **UTF-16 BOM support in `global.json`** — `global.json` files saved with a UTF-16 byte order mark are now read correctly ([dotnet/sdk#53141](https://github.com/dotnet/sdk/pull/53141)). PowerShell's `Out-File` writes UTF-16 by default on Windows, which previously caused SDK version resolution failures.
- **Boolean `--self-contained` flag** — The `--self-contained` flag now correctly accepts explicit `true`/`false` values ([dotnet/sdk#52333](https://github.com/dotnet/sdk/pull/52333)).
- **Include `localPath` in `deps.json`** — Runtime assets in `deps.json` now include the `localPath` property, improving runtime assembly resolution in complex deployment scenarios ([dotnet/sdk#50120](https://github.com/dotnet/sdk/pull/50120)).

## Bug fixes

- Fixed `dotnet tool install --source` not being respected for global and local tools ([dotnet/sdk#52787](https://github.com/dotnet/sdk/pull/52787)).
- Fixed `dotnet tool exec` / `dnx` failing when a tool exists in `dotnet-tools.json` but has not yet been restored ([dotnet/sdk#53361](https://github.com/dotnet/sdk/pull/53361)).
- Fixed `dotnet remove package` not recognizing the project argument ([dotnet/sdk#53401](https://github.com/dotnet/sdk/pull/53401)).
- Fixed `NETSDK1005` error when `dotnet run` targets a project that references projects with different target frameworks ([dotnet/sdk#53523](https://github.com/dotnet/sdk/pull/53523)).
- Fixed `dotnet watch` suppressing stdout when `--no-hot-reload` is used ([dotnet/sdk#52836](https://github.com/dotnet/sdk/pull/52836)).
- Fixed `$(Device)` global property missing during the `DeployToDevice` target in `dotnet run` ([dotnet/sdk#53018](https://github.com/dotnet/sdk/pull/53018)).
- Fixed crash in `VSTestForwardingApp` when trace is enabled with empty arguments ([dotnet/sdk#53307](https://github.com/dotnet/sdk/pull/53307)).
- Fixed `ExcludeList` handling in composite ReadyToRun and corrected entry-point assembly metadata ([dotnet/sdk#53084](https://github.com/dotnet/sdk/pull/53084)).

## Community contributors

Thank you to all the community contributors who helped make this release possible! 💜

- [@am11](https://github.com/am11) — OpenBSD RID support
- [@Hextaku](https://github.com/Hextaku) — `dotnet format --framework` support
- [@kasperk81](https://github.com/kasperk81)
- [@manfred-brands](https://github.com/manfred-brands) — CA1708 extension block fix
