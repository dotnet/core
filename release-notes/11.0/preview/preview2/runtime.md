# .NET Runtime in .NET 11 Preview 2

## Runtime Async (V2)

Preview 2 brings significant progress toward runtime-native async. Instead of the compiler generating state-machine classes, the runtime itself manages async suspension and resumption, producing cleaner stack traces, better debuggability, and lower overhead.

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

```text
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

```text
   at Program.<<Main>$>g__InnerAsync|0_2() in Program.cs:line 24
   at Program.<<Main>$>g__MiddleAsync|0_1() in Program.cs:line 14
   at Program.<<Main>$>g__OuterAsync|0_0() in Program.cs:line 8
   at Program.<Main>$(String[] args) in Program.cs:line 3
   at Program.<Main>(String[] args)
```

(Note: methods are named `$>g__` because they are local functions, not because they are async)

This improvement benefits profiling tools, diagnostic logging, and the debugger call stack window — anything that inspects the live execution stack rather than exception traces.

> **Note:** Exception stack traces (`catch (Exception ex) { Console.WriteLine(ex); }`) already look the same with or without runtime async, thanks to existing `ExceptionDispatchInfo` cleanup in the compiler-generated code. The improvement is in what you see *during* execution.

### Debugging improvements

Breakpoints now bind correctly inside runtime-async methods, and the debugger can step through `await` boundaries without jumping into compiler-generated infrastructure. This is the result of [dotnet/runtime #123644](https://github.com/dotnet/runtime/pull/123644), which teaches the debugger to recognize async thunks and map them back to the original source locations.

---

## JIT

### Bounds check removal for `i + cns < len` pattern

The JIT now eliminates bounds checks for the common pattern where an index plus a constant is compared against a length. ([dotnet/runtime #124242](https://github.com/dotnet/runtime/pull/124242))

### Redundant checked context removal

Checked arithmetic contexts that the JIT can prove are redundant (e.g. the value is already in range) are now optimized away. ([dotnet/runtime #124147](https://github.com/dotnet/runtime/pull/124147), [dotnet/runtime #124184](https://github.com/dotnet/runtime/pull/124184))

### Devirtualization of non-shared generic virtual methods in R2R

ReadyToRun images can now devirtualize non-shared generic virtual method calls, improving ahead-of-time compiled code performance. ([dotnet/runtime #123183](https://github.com/dotnet/runtime/pull/123183))

### SVE2 intrinsics

New ARM SVE2 intrinsics: [`ShiftRightLogicalNarrowingSaturate(Even|Odd)`](https://github.com/dotnet/runtime/blob/main/src/libraries/System.Private.CoreLib/src/System/Runtime/Intrinsics/Arm/Sve2.cs). These require both JIT support and managed API surface. ([dotnet/runtime #123888](https://github.com/dotnet/runtime/pull/123888))

---

## VM

### Cached interface dispatch on non-JIT platforms

Interface dispatch on platforms that lack JIT support (e.g. iOS) was falling back to an expensive generic fixup path. Enabling cached dispatch by default yields up to 200x improvements in interface-heavy code on these targets. ([dotnet/runtime #123776](https://github.com/dotnet/runtime/pull/123776))

### `Guid.NewGuid()` on Linux

Switches from reading `/dev/urandom` to the `getrandom()` syscall with batch caching, yielding roughly a 12% throughput improvement for GUID generation on Linux. ([dotnet/runtime #123540](https://github.com/dotnet/runtime/pull/123540))

### CoreCLR iOS-like mode

A new `--dynamiccodecompiled false` build option configures CoreCLR + crossgen2 to behave like iOS (JIT disabled, interpreter enabled, cached interface dispatch), enabling desktop testing of iOS-like scenarios without device deployment. ([dotnet/runtime #124168](https://github.com/dotnet/runtime/pull/124168))
