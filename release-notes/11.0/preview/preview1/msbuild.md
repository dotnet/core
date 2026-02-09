# MSBuild in .NET 11 Preview 1 - Release Notes

MSBuild 18.4 includes numerous performance improvements, bug fixes, new APIs for programmatic integration, and Terminal Logger enhancements. This release spans changes from MSBuild 18.0 through 18.4.

- [Terminal Logger improvements](#terminal-logger-improvements)
  - [Test summary always reported](#test-summary-always-reported)
  - [Node status restoration after task yields](#node-status-restoration-after-task-yields)
  - [Forwarding logger support for API-based builds](#forwarding-logger-support-for-api-based-builds)
- [MSBuild language and evaluation fixes](#msbuild-language-and-evaluation-fixes)
  - [Item function chaining with whitespace](#item-function-chaining-with-whitespace)
  - [NoWarn honored when MSBuildWarningsAsMessages is set](#nowarn-honored-when-msbuildwarningsasmessages-is-set)
  - [Whitespace-only element evaluation fix](#whitespace-only-element-evaluation-fix)
  - [Property function: Regex.Replace fix](#property-function-regexreplace-fix)
- [New APIs and capabilities](#new-apis-and-capabilities)
  - [BinaryLogger parameter parsing API](#binarylogger-parameter-parsing-api)
  - [`System.Uri::EscapeDataString` in property functions](#systemuriescapedatastring-in-property-functions)
  - [WriteLinesToFile transactional mode](#writelinestofile-transactional-mode)
  - [`MSBUILDDEBUGONSTART=3` for task hosts](#msbuilddebugonstart3-for-task-hosts)
- [Performance improvements](#performance-improvements)
- [Bug fixes](#bug-fixes)

## Terminal Logger improvements

### Test summary always reported

Fixed an issue where test summaries could be missing from the Terminal Logger output when the terminal node became null before receiving the finish message. Test results are now always accounted for in the final summary. ([#12801](https://github.com/dotnet/msbuild/pull/12801))

### Node status restoration after task yields

Fixed a bug where the Terminal Logger's node status display would not properly restore after an MSBuild task yields execution. ([#12820](https://github.com/dotnet/msbuild/pull/12820))

### Forwarding logger support for API-based builds

People using the MSBuild APIs to execute builds with the Terminal Logger can now benefit from forwarding logger support in multi-node builds. Forwarding loggers are a special kind of MSBuild logger that enable much more performant logging in multi-node builds. As part of this release, we've added new methods to the Terminal Logger's parsing/construction APIs that make it possible to configure the Terminal Logger as a forwarding logger. The command-line experience has always done this, but API-based users, like `dotnet run` or `dotnet watch`, were forced to use the much-less efficient approach. ([#12827](https://github.com/dotnet/msbuild/pull/12827))

## MSBuild language and evaluation fixes

### Item function chaining with whitespace

Fixed a long-standing parser bug where item function chaining would fail if whitespace preceded the second or subsequent `->` operator. Previously, `@(I -> WithMetadataValue('M', 'T') -> WithMetadataValue('M', 'T'))` (with a space before the second `->`) would be treated as a literal string instead of being evaluated for its values. ([#12772](https://github.com/dotnet/msbuild/pull/12772))

### NoWarn honored when MSBuildWarningsAsMessages is set

Fixed a bug where `NoWarn` was silently ignored when `MSBuildWarningsAsMessages` was already set. The targets now always append `$(NoWarn)` to `$(MSBuildWarningsAsMessages)`, ensuring both properties work together as expected. ([#12828](https://github.com/dotnet/msbuild/pull/12828))

### Whitespace-only element evaluation fix

Fixed project evaluation when an XML element contains only whitespace characters, which previously could cause incorrect evaluation behavior. ([#11978](https://github.com/dotnet/msbuild/pull/11978))

### Property function: Regex.Replace fix

Fixed incorrect invocation of `Regex.Replace(...)` in property function evaluation that could produce wrong results. ([#12924](https://github.com/dotnet/msbuild/pull/12924))

## New APIs and capabilities

### BinaryLogger parameter parsing API

Added a new public static method `BinaryLogger.ParseParameters(string)` that parses binary logger parameter strings into a typed `BinaryLoggerParameters` object. This enables tools like `dotnet-watch` to parse `/bl` command-line options without duplicating MSBuild's internal parsing logic. ([#12606](https://github.com/dotnet/msbuild/pull/12606))

```csharp
var parsed = BinaryLogger.ParseParameters("LogFile=build.binlog;ProjectImports=None");
Console.WriteLine(parsed.LogFilePath); // "build.binlog"
Console.WriteLine(parsed.ProjectImportsCollectionMode); // None
```

### `System.Uri::EscapeDataString` in property functions

`System.Uri::EscapeDataString` and `System.Uri::UnescapeDataString` are now available as MSBuild property functions. Previously, URL-encoding strings in MSBuild required workarounds with `UriBuilder.Path`. ([#12572](https://github.com/dotnet/msbuild/pull/12572))

```xml
<PropertyGroup>
  <QueryParam>hello world &amp; test=123</QueryParam>
  <Encoded>$([System.Uri]::EscapeDataString($(QueryParam)))</Encoded>
  <!-- Result: hello%20world%20%26%20test%3D123 -->
</PropertyGroup>
```

### WriteLinesToFile transactional mode

The `WriteLinesToFile` task now writes or appends content in a transactional way. New files are first created in a temporary location, then atomically moved to the final location. Appended-to files are atomically appended to using a `FileShare.Read` handle, so only one process can acquire the write lock at a time. Together, this should prevent errors during parallel builds where multiple processes may attempt to write to the same file concurrently. ([#12627](https://github.com/dotnet/msbuild/pull/12627))

### `MSBUILDDEBUGONSTART=3` for task hosts

A new value `3` for the `MSBUILDDEBUGONSTART` environment variable allows developers to skip the debugger-attach prompt for TaskHost child processes, making it easier to debug the main MSBuild process without interruption from task host prompts. ([#12679](https://github.com/dotnet/msbuild/pull/12679))

## Performance improvements

This release includes numerous performance improvements across the build engine's internals. Many of these optimizations were driven by profiling real-world large builds and addressing specific bottlenecks, and were contributed by the Visual Studio team. We can't thank them enough for their analysis and contributions!

- **ItemDictionary**: Replaced `LinkedList` with a more cache-friendly data structure ([#12345](https://github.com/dotnet/msbuild/pull/12345))
- **Lookup.Scope**: Reimplemented scope tables without `ItemDictionary` for faster lookups ([#12320](https://github.com/dotnet/msbuild/pull/12320))
- **RAR metadata copies**: Reordered output metadata copy operations for better performance ([#12298](https://github.com/dotnet/msbuild/pull/12298))
- **WorkUnitResult**: Converted from class to struct to reduce allocations ([#12403](https://github.com/dotnet/msbuild/pull/12403))
- **ProjectMetadataInstance**: Avoided unnecessary allocations ([#12599](https://github.com/dotnet/msbuild/pull/12599))
- **LazyItemEvaluator**: Reduced allocations by avoiding enumerator boxing in `ProcessMetadataElements` ([#12908](https://github.com/dotnet/msbuild/pull/12908))
- **EndsWith fast path**: Added optimized path for `EndsWith` with `StringComparison` parameter in `WellKnownFunctions` ([#12401](https://github.com/dotnet/msbuild/pull/12401))
- **GetEnumerator optimization**: Added `ICollection<T>` check to avoid unnecessary allocations ([#12562](https://github.com/dotnet/msbuild/pull/12562))
- **Single capture optimization**: Optimized for the common single-capture case in regex operations ([#12569](https://github.com/dotnet/msbuild/pull/12569))
- **Lookup.ExplicitModifications**: Switched to concrete dictionary type to avoid enumerator boxing ([#11985](https://github.com/dotnet/msbuild/pull/11985))
- **ImmutableDictionary.SetItems**: Used builder pattern for more efficient batch updates ([#12402](https://github.com/dotnet/msbuild/pull/12402))
- **BuildGlobResultFromIncludeItem**: Streamlined glob result construction ([#12178](https://github.com/dotnet/msbuild/pull/12178))
- **RAR node log buffering**: Buffered log events from ResolveAssemblyReference nodes to client for reduced overhead ([#12558](https://github.com/dotnet/msbuild/pull/12558))
- **WriteLinesToFile**: Internal improvements to file writing performance ([#12707](https://github.com/dotnet/msbuild/pull/12707))
- **FileSystems abstraction**: Systematically replaced direct BCL file operations with the `FileSystems` abstraction for consistency and potential I/O optimization ([#12602](https://github.com/dotnet/msbuild/pull/12602))

## Bug fixes

- **DistributedFileLogger**: Fixed MSB1025 error when using the `-dfl` flag ([#13040](https://github.com/dotnet/msbuild/pull/13040))
- **`/getItem` and `/getTargetResult`**: Fixed unhandled exception when items contain illegal path characters ([#12841](https://github.com/dotnet/msbuild/pull/12841))
- **Thread working directory**: Saved thread working directory for fallback in `Expander` and `Modifiers` to prevent incorrect path resolution ([#12875](https://github.com/dotnet/msbuild/pull/12875))
- **Assembly resolution**: Fixed resolution for `.exe` files and legacy .NET Framework tasks (CLR35 and CLR2) ([#12823](https://github.com/dotnet/msbuild/pull/12823))
- **slnf path separators**: Fixed path separator handling to support both Unix and Windows style paths in solution filter files ([#12730](https://github.com/dotnet/msbuild/pull/12730))
- **deps.json determinism**: Fixed non-deterministic resources section ordering in some `deps.json` files ([#12811](https://github.com/dotnet/msbuild/pull/12811))
- **Copy task case sensitivity**: Fixed case sensitivity issue on Unix systems ([#12147](https://github.com/dotnet/msbuild/pull/12147))
- **Inline task code file resolution**: Inline task code files are now resolved relative to the project directory instead of the current working directory ([#12687](https://github.com/dotnet/msbuild/pull/12687))
- **Preprocess crash**: Fixed a crash when using the `/preprocess` (`/pp`) option ([#12396](https://github.com/dotnet/msbuild/pull/12396))
- **Project-to-project batching**: Tolerated duplication in project-to-project negotiation batches ([#11878](https://github.com/dotnet/msbuild/pull/11878))
- **DrainPacketQueue**: Fixed thread that could hang after build completes ([#12561](https://github.com/dotnet/msbuild/pull/12561))
- **Infinite debug loops**: Fixed condition that could cause infinite build loops with infinite log file creation when debug path redirected to temp folder ([#12540](https://github.com/dotnet/msbuild/pull/12540))
- **app.config errors**: Now report line numbers in app.config parse errors for easier debugging ([#12535](https://github.com/dotnet/msbuild/pull/12535))
- **SDK environment variable logging**: Environment variable messages are now only logged when values actually differ, reducing noise ([#12918](https://github.com/dotnet/msbuild/pull/12918))
- **RunningObjectTable errors**: Enhanced error handling in `RunningObjectTable` ([#12755](https://github.com/dotnet/msbuild/pull/12755))
- **HostObjectException**: Added catch for `HostObjectException` to prevent unhandled crashes ([#12829](https://github.com/dotnet/msbuild/pull/12829))
- **SDK resolver fallback**: Added fallback behavior for `Microsoft.DotNet.MsBuildSdkResolver` loading in external API scenarios ([#12703](https://github.com/dotnet/msbuild/pull/12703))
- **XamlPreCompile targets**: Removed obsolete `GeneratedFilesOutputPath` parameter ([#12885](https://github.com/dotnet/msbuild/pull/12885))
- **Null check**: Added null check for `environmentVariableProperties` to prevent `NullReferenceException` ([#12594](https://github.com/dotnet/msbuild/pull/12594))
