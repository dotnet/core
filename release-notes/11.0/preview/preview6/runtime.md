# .NET Runtime in .NET 11 Preview 6 - Release Notes

.NET 11 Preview 6 includes new runtime features and performance work:

- [Runtime-async performance improvements](#runtime-async-performance-improvements)
- [JIT improvements](#jit-improvements)
- [In-process crash report logging](#in-process-crash-report-logging)
- [NativeAOT: faster interface dispatch](#nativeaot-faster-interface-dispatch)
- [SIMD: Lane construction and composition APIs](#simd-lane-construction-and-composition-apis)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET Runtime updates in .NET 11:

- [What's new in the .NET 11 runtime](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/runtime)

## Runtime-async performance improvements

Runtime-async — the runtime's built-in implementation of `async`/`await` — continues to get faster in Preview 6, building on the suspension improvements from Preview 5.

### JIT async support

The JIT now compiles a dedicated runtime-async version of a synchronous, task-returning method rather than delegating to it through a thunk ([dotnet/runtime #128384](https://github.com/dotnet/runtime/pull/128384)). The JIT turns the method's tail calls into runtime-async calls and awaits the task that would otherwise have been returned, so the async path no longer pays for an extra layer of indirection.

Several related changes reduce suspension overhead further:

- The JIT tail-merges async suspension points so the generated code is smaller ([dotnet/runtime #128559](https://github.com/dotnet/runtime/pull/128559)).
- Continuations used for runtime-async callable task thunks are cached and reused ([dotnet/runtime #128320](https://github.com/dotnet/runtime/pull/128320)).
- Methods that are already pooled opt out of runtime-async, avoiding redundant work ([dotnet/runtime #128943](https://github.com/dotnet/runtime/pull/128943)).

### Async continuations without ExecutionContext

Async continuations can now opt out of `ExecutionContext` capture and restore ([dotnet/runtime #128323](https://github.com/dotnet/runtime/pull/128323)).

`ExecutionContext` carries ambient state — such as `AsyncLocal<T>` values — across `await` points. Every `Task` continuation previously captured a snapshot of the context and restored it before running, even when no `AsyncLocal<T>` state was in use and the restore was a no-op.

The runtime now detects when a continuation has nothing to restore and skips the capture/restore cycle entirely. `Task`, `Task<T>`, `ValueTask`, and `ValueTask<T>` all benefit from this change, as does the runtime-async implementation path. Applications that use `ConfigureAwait(false)` and `AsyncLocal<T>` sparingly will see reduced overhead in high-throughput async code paths.

## JIT improvements

### `Math.BigMul` performance on x64

`Math.BigMul(long, long, out long)` is now significantly faster on x64 ([dotnet/runtime #117261](https://github.com/dotnet/runtime/pull/117261)).

The JIT generates a single `MUL r/m64` instruction when both operands are 64-bit values and the caller requests the high half of the result. Previously the JIT emitted a helper call. The change eliminates the call overhead and makes code that multiplies large numbers tighter.

Thanks [@xtqqczze](https://github.com/xtqqczze) for the contribution.

### RyuJIT: single-IG prolog restriction removed

The JIT no longer requires the function prolog to fit in a single instruction group (IG) ([dotnet/runtime #126552](https://github.com/dotnet/runtime/pull/126552)).

Previously, complex prologues — for example, frames with many saved registers, large stack allocations, or runtime-async state setup — had to be squeezed into one IG or trigger fallback paths. Removing the restriction simplifies the code generator, enables better prolog code for complex methods, and removes an artificial size limit that occasionally affected generated assembly quality.

### `SELECT(cond, cns, cns)` → `cns`

The JIT now folds conditional selects whose two branches both produce the same constant into just that constant ([dotnet/runtime #127915](https://github.com/dotnet/runtime/pull/127915)).

```csharp
// Before: emit a conditional select instruction
int x = condition ? 42 : 42;

// After: JIT replaces the SELECT with the constant 42
```

While writing identical constants in both branches is rare in hand-authored code, it occurs after earlier optimizations simplify or unify branches. The fold eliminates the unnecessary comparison and select instruction.

Thanks [@DeaglePC](https://github.com/DeaglePC) for the contribution.

### ARM64: `Vector<T>` passed by reference for SVE

When the runtime is compiled with ARM SVE (Scalable Vector Extension) support, `Vector<T>` values are now passed by reference rather than by value ([dotnet/runtime #125729](https://github.com/dotnet/runtime/pull/125729)).

SVE vectors have runtime-determined widths, so passing them on the stack by value was both expensive and incorrect on some platforms. Passing by reference aligns with the ARM calling convention for scalable types and enables better code generation for SVE-intensive code.

Thanks [@SwapnilGaikwad](https://github.com/SwapnilGaikwad) for the contribution.

## In-process crash report logging

A new in-process crash reporting mechanism captures diagnostic information from within the crashing process before it terminates ([dotnet/runtime #128105](https://github.com/dotnet/runtime/pull/128105)). This capability is specific to mobile platforms.

Previously, crash diagnostics were collected by an out-of-process monitor. While the out-of-process approach is safe (the monitor isn't affected by the crash), it can miss information that is only available inside the dying process. The new in-process path logs the managed stack trace, module list, and key runtime state to a well-known path before the process exits.

## NativeAOT: faster interface dispatch

Native AOT now uses a dispatch helper for interface method calls ([dotnet/runtime #123252](https://github.com/dotnet/runtime/pull/123252)).

Instead of a direct fat-pointer call sequence, the runtime routes interface dispatch through a shared helper that can be patched to the correct implementation after the call site warms up. This reduces the binary size of interface call sites and improves throughput on workloads with many interface method calls.

## SIMD: Lane construction and composition APIs

`System.Runtime.Intrinsics` now includes lane construction and composition APIs for hardware vector types ([dotnet/runtime #127690](https://github.com/dotnet/runtime/pull/127690), [dotnet/runtime #129627](https://github.com/dotnet/runtime/pull/129627)).

The new APIs let you construct a vector from individually specified lanes and extract or reorder lanes between vectors. This enables precise, portable control over SIMD vector element placement without falling back to platform-specific intrinsics. These building blocks are useful for image processing, audio DSP, and other SIMD-intensive workloads that need fine-grained control over vector element layout.

## Bug fixes

- **JIT / code generation**
  - Fixed an x86 GC hole in stack-to-stack struct copies ([dotnet/runtime #128805](https://github.com/dotnet/runtime/pull/128805)).
  - Stopped the JIT from killing floating-point, SIMD, and mask registers across x64 write barriers ([dotnet/runtime #128778](https://github.com/dotnet/runtime/pull/128778)).
  - Improved code generation for `PopCount` and `TrailingZeroCount` on Arm64 ([dotnet/runtime #128677](https://github.com/dotnet/runtime/pull/128677)).
  - Fixed JIT native async compilation incorrectly stripping IL from non-async `Task`-returning methods, which caused failures when those methods were called through async dispatch paths ([dotnet/runtime #129975](https://github.com/dotnet/runtime/pull/129975)).
  - Fixed the async resumption stub incorrectly handling `byref` parameters, which could produce wrong values or crashes when an async method resumes after `await` with reference-typed arguments ([dotnet/runtime #130022](https://github.com/dotnet/runtime/pull/130022)).
- **GC / runtime**
  - Fixed a GC hole when a method return is hijacked for GC suspension — the return value could be collected before it was stored ([dotnet/runtime #129714](https://github.com/dotnet/runtime/pull/129714)).
  - Fixed alignment of 8-byte thread statics on the direct TLS path, which could cause misalignment faults on platforms with strict alignment requirements ([dotnet/runtime #129749](https://github.com/dotnet/runtime/pull/129749)).
  - Fixed `ValueType.GetHashCode` for a type with a nested generic field ([dotnet/runtime #129728](https://github.com/dotnet/runtime/pull/129728)). Thank you [@huoyaoyuan](https://github.com/huoyaoyuan)!
- **NativeAOT**
  - Accepted full-width `0x`/`0X`-prefixed 64-bit hexadecimal environment configuration values ([dotnet/runtime #128462](https://github.com/dotnet/runtime/pull/128462)).
  - Fixed string-related GC configuration handling ([dotnet/runtime #128455](https://github.com/dotnet/runtime/pull/128455)).
- **Mono / interpreter**
  - Fixed stale GC liveness reporting for a variable before it is set ([dotnet/runtime #128709](https://github.com/dotnet/runtime/pull/128709)).

## Community contributors

Thank you contributors! ❤️

- [@am11](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aam11)
- [@BoyBaykiller](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ABoyBaykiller)
- [@clamp03](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aclamp03)
- [@cshung](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Acshung)
- [@DeaglePC](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ADeaglePC)
- [@elringus](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aelringus)
- [@filipnavara](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Afilipnavara)
- [@gbalykov](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Agbalykov)
- [@hez2010](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Ahez2010)
- [@jonathandavies-arm](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Ajonathandavies-arm)
- [@maximmenshikov](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Amaximmenshikov)
- [@MichalPetryka](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3AMichalPetryka)
- [@Ruihan-Yin](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ARuihan-Yin)
- [@saucecontrol](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Asaucecontrol)
- [@sethjackson](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Asethjackson)
- [@SwapnilGaikwad](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ASwapnilGaikwad)
- [@xtqqczze](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Axtqqczze)
