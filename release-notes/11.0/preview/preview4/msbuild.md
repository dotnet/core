# MSBuild in .NET 11 Preview 4 - Release Notes

.NET 11 Preview 4 includes new MSBuild features & enhancements:

- [TaskHost callbacks enabled by default](#taskhost-callbacks-enabled-by-default)
- [SdkResolver environment variables take precedence over the ambient environment](#sdkresolver-environment-variables-take-precedence-over-the-ambient-environment)
- [Multithreaded build: more in-box tasks enlightened](#multithreaded-build-more-in-box-tasks-enlightened)

These features are mostly in service of the [Multithreaded execution](https://github.com/dotnet/msbuild/blob/main/documentation/specs/multithreading/multithreaded-msbuild.md) feature, which is still under active development.

## TaskHost callbacks enabled by default

Tasks that run in an out-of-process TaskHost — for example, when a project uses `-mt` (multithreaded) builds or when a task explicitly opts into `TaskHostFactory` — can now call back into the engine through `IBuildEngine` to build other projects. The `BuildProjectFile`, `BuildProjectFilesInParallel`, and related overloads are forwarded from the TaskHost to the owning worker node, so callbacks behave the same as in-proc builds ([dotnet/msbuild #13350](https://github.com/dotnet/msbuild/pull/13350), [dotnet/msbuild #13579](https://github.com/dotnet/msbuild/pull/13579)).

The most visible impact is WPF: XAML compilation uses `GenerateTemporaryTargetAssembly`, which calls `BuildProjectFile` from a TaskHost. Before this change, building any WPF project with `-mt` failed with `MSB5022`. With Preview 4, this works without any opt-in.

```shell
dotnet build MyWpfApp.csproj -mt
```

The previous opt-in environment variable (`MSBUILDENABLETASKHOSTCALLBACKS=1`) is no longer required; the feature is on by default.

## SdkResolver environment variables take precedence over the ambient environment

When an SDK resolver provides environment variables for a project, those values now win over variables of the same name in the ambient process environment ([dotnet/msbuild #12655](https://github.com/dotnet/msbuild/pull/12655)).

Previously, an ambient environment variable would silently override the value supplied by the resolver, which made the resolver an unreliable source of truth for SDK-provided configuration. The new precedence order, from highest to lowest, is:

1. Properties defined in XML
2. SDK-resolved environment variables (first SDK to set a name wins)
3. Ambient process environment variables

When an SDK overrides an existing ambient value, MSBuild logs a diagnostic showing both the ambient and the SDK-provided value so the change is auditable. This fix also includes a serialization fix so the SDK-provided variables flow correctly to out-of-proc nodes.

## Multithreaded build: more in-box tasks enlightened

The MSBuild multithreaded build mode (`-mt`) requires built-in tasks to declare that they are safe to run on multiple threads in the same process. Preview 4 enlightens additional in-box tasks so they can participate in `-mt` builds without falling back to a TaskHost:

- `RequiresFramework35SP1Assembly` ([dotnet/msbuild #13575](https://github.com/dotnet/msbuild/pull/13575))
- `ToolTask` and `Al` ([dotnet/msbuild #13423](https://github.com/dotnet/msbuild/pull/13423))
- `AspNetCompiler` ([dotnet/msbuild #13424](https://github.com/dotnet/msbuild/pull/13424))
- `GetReferenceAssemblyPaths` ([dotnet/msbuild #13495](https://github.com/dotnet/msbuild/pull/13495))
- `SGen` ([dotnet/msbuild #13457](https://github.com/dotnet/msbuild/pull/13457))

No project changes are needed; these tasks now run directly on worker threads when a build uses `-mt`, reducing the number of out-of-process TaskHost handoffs during a multithreaded build.

## Bug fixes

- **Build engine**
  - `BuildManager.ShutdownAllNodes()` again cleans up idle `MSBuild.exe` processes — fixes a regression from 18.5 that caused Visual Studio to leave MSBuild processes running after shutdown ([dotnet/msbuild #13501](https://github.com/dotnet/msbuild/pull/13501)).
  - Fixed a race condition in out-of-process TaskHost path resolution that caused `ArgumentNullException` in `Path.Combine` when multiple `RequestBuilder` threads resolved the task host executable name simultaneously under `-mt` ([dotnet/msbuild #13485](https://github.com/dotnet/msbuild/pull/13485)).
  - Fixed a `~200 MB` allocation regression in Visual Studio caused by the `TaskItem` modifier cache being copied across AppDomains on .NET Framework ([dotnet/msbuild #13493](https://github.com/dotnet/msbuild/pull/13493)).
  - Fixed `MSB1025` / `FormatException` when cancelling a build that uses the MSBuild server (`DOTNET_CLI_USE_MSBUILD_SERVER=1`) — caused by a stray `}` in a trace format string ([dotnet/msbuild #13535](https://github.com/dotnet/msbuild/pull/13535)).
- **Static graph**
  - Graph build errors for missing or invalid project references now name the referring project: `error MSB4025: The project file '...' could not be loaded when referenced by '<referrer>'.` ([dotnet/msbuild #12672](https://github.com/dotnet/msbuild/pull/12672)).
- **Terminal Logger**
  - Fixed a `Debug.Assert` failure for metaproj files (which have no evaluation phase) and a related issue where projects lost their evaluation ID after their `ProjectInstance` was cached or sent across nodes ([dotnet/msbuild #13480](https://github.com/dotnet/msbuild/pull/13480)).
- **Tasks**
  - `RoslynCodeTaskFactory` now logs the specific `MSB3753` diagnostic when an inline task class does not implement `ITask`, matching `CodeTaskFactory` behavior ([dotnet/msbuild #13517](https://github.com/dotnet/msbuild/pull/13517)).
  - ASP.NET Web Site projects that depend on `netstandard` now copy the `netstandard.dll` facade into the site `Bin` folder so `aspnet_compiler` succeeds ([dotnet/msbuild #13058](https://github.com/dotnet/msbuild/pull/13058)).
  - `GetCopyToOutputDirectoryItemsDependsOn` is appended to instead of overwritten, so projects can add custom targets at a specific build stage without losing the default dependencies ([dotnet/msbuild #13474](https://github.com/dotnet/msbuild/pull/13474)).
- **Performance**
  - Eliminated repeated `XmlChildNodes` allocations in `GetXmlNodeInnerContents`, a hot path during property and metadata evaluation on solution load ([dotnet/msbuild #13509](https://github.com/dotnet/msbuild/pull/13509)).
  - Removed `ToLowerInvariant`/`ToUpperInvariant` allocations from `TargetPlatformSDK.GetHashCode` and `SdkReference.GetHashCode` ([dotnet/msbuild #13475](https://github.com/dotnet/msbuild/pull/13475)).

## Community contributors

Thank you contributors! ❤️

- [@snechaev](https://github.com/dotnet/msbuild/pulls?q=is%3Apr+is%3Amerged+author%3Asnechaev)
- [@OvesN](https://github.com/dotnet/msbuild/pulls?q=is%3Apr+is%3Amerged+author%3AOvesN)
