# .NET Runtime in .NET 11 Preview 2

## New APIs

| API | Area | PR |
|-----|------|----|
| [`System.IO.Hashing.Adler32`](https://github.com/dotnet/runtime/blob/main/src/libraries/System.IO.Hashing/src/System/IO/Hashing/Adler32.cs) | Hashing | [dotnet/runtime #123601](https://github.com/dotnet/runtime/pull/123601) |
| [`DecompressionMethods.Zstandard`](https://github.com/dotnet/runtime/blob/main/src/libraries/System.Net.Primitives/src/System/Net/DecompressionMethods.cs) | HTTP | [dotnet/runtime #123531](https://github.com/dotnet/runtime/pull/123531) |
| [`ProcessExitStatus`](https://github.com/dotnet/runtime/blob/main/src/libraries/System.Diagnostics.Process/src/System/Diagnostics/ProcessExitStatus.cs) class | Diagnostics | [dotnet/runtime #124264](https://github.com/dotnet/runtime/pull/124264) |
| [`File.OpenNullHandle()`](https://github.com/dotnet/runtime/blob/main/src/libraries/System.Private.CoreLib/src/System/IO/File.cs) | IO | [dotnet/runtime #123483](https://github.com/dotnet/runtime/pull/123483) |
| [`Console.OpenStandard{Input,Output,Error}Handle()`](https://github.com/dotnet/runtime/blob/main/src/libraries/System.Console/src/System/Console.cs) | Console | [dotnet/runtime #123478](https://github.com/dotnet/runtime/pull/123478) |
| [`JsonSerializerOptions.GetTypeInfo<T>()`](https://github.com/dotnet/runtime/blob/main/src/libraries/System.Text.Json/src/System/Text/Json/Serialization/JsonSerializerOptions.Caching.cs) / `TryGetTypeInfo<T>()` | JSON | [dotnet/runtime #123940](https://github.com/dotnet/runtime/pull/123940) |
| [`IdnMapping.TryGetAscii`](https://github.com/dotnet/runtime/blob/main/src/libraries/System.Private.CoreLib/src/System/Globalization/IdnMapping.cs) / `TryGetUnicode` (span-based) | Globalization | [dotnet/runtime #123593](https://github.com/dotnet/runtime/pull/123593) |
| [`TarFile.CreateFromDirectory`](https://github.com/dotnet/runtime/blob/main/src/libraries/System.Formats.Tar/src/System/Formats/Tar/TarFile.cs) with `TarEntryFormat` | Archives | [dotnet/runtime #123407](https://github.com/dotnet/runtime/pull/123407) |
| [`PosixSignal.SIGKILL`](https://github.com/dotnet/runtime/blob/main/src/libraries/System.Private.CoreLib/src/System/Runtime/InteropServices/PosixSignal.cs) | Process | [dotnet/runtime #124256](https://github.com/dotnet/runtime/pull/124256) |
| [`[ExcludeFromCodeCoverage]`](https://github.com/dotnet/runtime/blob/main/src/libraries/System.Private.CoreLib/src/System/Diagnostics/CodeAnalysis/ExcludeFromCodeCoverageAttribute.cs) / `[StackTraceHidden]` on interfaces | Attributes | [dotnet/runtime #123686](https://github.com/dotnet/runtime/pull/123686) |
| [SVE2 `ShiftRightLogicalNarrowingSaturate(Even\|Odd)`](https://github.com/dotnet/runtime/blob/main/src/libraries/System.Private.CoreLib/src/System/Runtime/Intrinsics/Arm/Sve2.cs) | ARM intrinsics | [dotnet/runtime #123888](https://github.com/dotnet/runtime/pull/123888) |

### ISO 8601 end-of-day support

`DateTime`, `DateTimeOffset`, `TimeOnly`, `Utf8Parser`, and the JSON serializer now accept `24:00` / `24:00:00` as a valid ISO 8601 end-of-day representation, equivalent to midnight of the next day.

- DateTime/DateTimeOffset/TimeOnly parsing — [dotnet/runtime #124142](https://github.com/dotnet/runtime/pull/124142)
- XSD DateTime validation — [dotnet/runtime #124437](https://github.com/dotnet/runtime/pull/124437)

---

## Runtime Async (Async V2)

Preview 2 brings significant progress toward runtime-native async. Instead of the compiler generating state-machine classes, the runtime itself manages async suspension and resumption, producing cleaner stack traces, better debuggability, and lower overhead.

### What shipped in Preview 2

| PR | What |
|----|------|
| [dotnet/runtime #122126](https://github.com/dotnet/runtime/pull/122126), [dotnet/runtime #122651](https://github.com/dotnet/runtime/pull/122651) | Generic and virtual async methods now work correctly with runtime async, including in ReadyToRun images |
| [dotnet/runtime #123644](https://github.com/dotnet/runtime/pull/123644) | Debugger breakpoint and stepping support for runtime async methods |
| [dotnet/runtime #122722](https://github.com/dotnet/runtime/pull/122722) | `Exception.ToString()` includes runtime-async frames |
| [dotnet/runtime #124183](https://github.com/dotnet/runtime/pull/124183) | Async methods that never actually suspend (no incomplete awaits) can now be inlined |

### Opting in

Runtime async is still a preview feature. The compiler must emit methods with `MethodImplOptions.Async` for the runtime to treat them as runtime-async. Today this requires a compiler feature flag and the preview-features opt-in:

```xml
<PropertyGroup>
  <Features>runtime-async=on</Features>
  <EnablePreviewFeatures>true</EnablePreviewFeatures>
</PropertyGroup>
```

### Sample: cleaner live stack traces

The most visible difference is in **live stack traces** — what profilers, debuggers, and `new StackTrace()` see during execution. With compiler-generated async, every async method produces multiple frames for state-machine infrastructure. With runtime async, the real methods appear directly on the call stack.

```csharp
// async-test.csproj:
//   <Features>runtime-async=on</Features>
//   <EnablePreviewFeatures>true</EnablePreviewFeatures>

using System.Diagnostics;

await OuterAsync();

static async Task OuterAsync()
{
    await Task.CompletedTask;
    await MiddleAsync();
}

static async Task MiddleAsync()
{
    await Task.CompletedTask;
    await InnerAsync();
}

static async Task InnerAsync()
{
    await Task.CompletedTask;
    Console.WriteLine(new StackTrace(fNeedFileInfo: true));
}
```

**Without `runtime-async` — 13 frames, state-machine infrastructure visible:**

```
   at Program.<<Main>$>g__InnerAsync|0_2() in Program.cs:line 24
   at System.Runtime.CompilerServices.AsyncMethodBuilderCore.Start[TStateMachine](...)
   at Program.<<Main>$>g__InnerAsync|0_2()
   at Program.<<Main>$>g__MiddleAsync|0_1() in Program.cs:line 14
   at System.Runtime.CompilerServices.AsyncMethodBuilderCore.Start[TStateMachine](...)
   at Program.<<Main>$>g__MiddleAsync|0_1()
   at Program.<<Main>$>g__OuterAsync|0_0() in Program.cs:line 8
   at System.Runtime.CompilerServices.AsyncMethodBuilderCore.Start[TStateMachine](...)
   at Program.<<Main>$>g__OuterAsync|0_0()
   at Program.<Main>$(String[] args) in Program.cs:line 3
   at System.Runtime.CompilerServices.AsyncMethodBuilderCore.Start[TStateMachine](...)
   at Program.<Main>$(String[] args)
   at Program.<Main>(String[] args)
```

**With `runtime-async` — 5 frames, the real call chain:**

```
   at Program.<<Main>$>g__InnerAsync|0_2() in Program.cs:line 24
   at Program.<<Main>$>g__MiddleAsync|0_1() in Program.cs:line 14
   at Program.<<Main>$>g__OuterAsync|0_0() in Program.cs:line 8
   at Program.<Main>$(String[] args) in Program.cs:line 3
   at Program.<Main>(String[] args)
```

This improvement benefits profiling tools, diagnostic logging, and the debugger call stack window — anything that inspects the live execution stack rather than exception traces.

> **Note:** Exception stack traces (`catch (Exception ex) { Console.WriteLine(ex); }`) already look the same with or without runtime async, thanks to existing `ExceptionDispatchInfo` cleanup in the compiler-generated code. The improvement is in what you see *during* execution.

### Debugging improvements

Breakpoints now bind correctly inside runtime-async methods, and the debugger can step through `await` boundaries without jumping into compiler-generated infrastructure. This is the result of [dotnet/runtime #123644](https://github.com/dotnet/runtime/pull/123644), which teaches the debugger to recognize async thunks and map them back to the original source locations.

---

## Performance

### `Guid.NewGuid()` on Linux

Switches from reading `/dev/urandom` to the `getrandom()` syscall with batch caching, yielding roughly a 12% throughput improvement for GUID generation on Linux. ([dotnet/runtime #123540](https://github.com/dotnet/runtime/pull/123540))

### `Directory.GetFiles` on Windows

Safe search patterns (e.g. `*.jpg`, `prefix*`) are now pushed down to `NtQueryDirectoryFile` for OS-level filtering instead of client-side enumeration. Searching large directories with selective patterns is dramatically faster. ([dotnet/runtime #122947](https://github.com/dotnet/runtime/pull/122947))

### `FileSystemWatcher` on Linux — single inotify instance

Previously each `FileSystemWatcher` opened its own inotify file descriptor. Now a single instance is shared across all watchers, reducing resource pressure and staying well within the per-user inotify limit (default 128). ([dotnet/runtime #117148](https://github.com/dotnet/runtime/pull/117148))

### Cached interface dispatch on non-JIT platforms

Interface dispatch on platforms that lack JIT support (e.g. iOS) was falling back to an expensive generic fixup path. Enabling cached dispatch by default yields up to 200x improvements in interface-heavy code on these targets. ([dotnet/runtime #123776](https://github.com/dotnet/runtime/pull/123776))

### `Process.KillTree`

Eliminates excessive exception throwing during child-process enumeration on Windows. With a debugger attached, `KillTree` went from ~23 seconds to ~0.17 seconds. ([dotnet/runtime #123865](https://github.com/dotnet/runtime/pull/123865))

### `ImmutableArray.SequenceEqual`

Adds optimized paths for `ICollection<T>` types, achieving ~90% improvement for arrays and lists and ~54% for `IList` implementations. ([dotnet/runtime #118932](https://github.com/dotnet/runtime/pull/118932))

---

## Notable Bug Fixes

### `ZipArchive` Update mode no longer rewrites unchanged archives

Opening a zip in `Update` mode and disposing without making changes previously rewrote the entire archive, causing `NotSupportedException` on non-expandable streams (e.g. fixed-size `MemoryStream`). Now unchanged archives are left untouched. ([dotnet/runtime #123719](https://github.com/dotnet/runtime/pull/123719))

### `ZipArchiveEntry.ExtractToFile` corruption prevention

When extracting with `overwrite: true`, if the extraction fails mid-stream, the original destination file was left in a corrupted state. The fix ensures the original file is preserved when extraction encounters errors. ([dotnet/runtime #123991](https://github.com/dotnet/runtime/pull/123991))

### `XDocument.LoadAsync` now truly async

`XDocument.LoadAsync` was internally performing synchronous reads, blocking the calling thread. It now uses genuinely asynchronous I/O throughout. ([dotnet/runtime #123800](https://github.com/dotnet/runtime/pull/123800))

### `ServiceProviderEngineScope.Dispose` aggregates exceptions

Previously, if a scoped service threw during disposal, subsequent services were not disposed at all. Now all disposables are cleaned up and exceptions are aggregated into an `AggregateException`. ([dotnet/runtime #123342](https://github.com/dotnet/runtime/pull/123342))

### `WriteOnceBlock.ReceiveAsync` race condition

A race in TPL Dataflow's `WriteOnceBlock` could cause `ReceiveAsync` to return `null` instead of the posted value. Fixed by reordering value assignment before state updates with a memory barrier. ([dotnet/runtime #123435](https://github.com/dotnet/runtime/pull/123435))

### Certificate disposal in `RemoteCertificateValidationCallback`

`SslStream` was disposing certificates that the application provided via `RemoteCertificateValidationCallback`, causing `NullReferenceException` when the same certificate was reused across connections. ([dotnet/runtime #123875](https://github.com/dotnet/runtime/pull/123875))
