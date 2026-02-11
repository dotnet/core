# .NET Runtime in .NET 11 Preview 1 - Release Notes

.NET 11 Preview 1 includes new .NET Runtime features & performance improvements.

## Features

These features are all in-progress.

- **Runtime async**: a new runtime-level async mechanism (including configuration, diagnostics, and AOT support).
- **CoreCLR on WebAssembly**: initial foundational work to bring CoreCLR support to WebAssembly (not yet ready for general use in Preview 1).
- **Interpreter expansion**: more IL coverage, better integration (async/ReJIT/debugging), plus new ports.
- **Targeted performance work**: JIT improvements, interpreter call and compilation performance improvements, and faster WASM allocation paths.

.NET Runtime updates in .NET 11:

- [What's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/overview)

## Runtime async

Runtime async is a major runtime feature in .NET 11 that introduces new runtime-level infrastructure for async methods. The goal is to improve tooling and performance for async-heavy codepaths. For more details and to track progress, see the [Runtime Async epic issue](https://github.com/dotnet/runtime/issues/109632).

### What changed in Preview 1

- **CoreCLR support**: the CoreCLR support for `RuntimeAsync` is now enabled by default, meaning no environment variables need to be set
- **NAOT support for RuntimeAsync**: Native AOT should now be able to compile runtime-async code.
- **Core libraries**: None of the core runtime libraries are compiled with runtime-async support enabled in Preview 1. We expect to start changing this in upcoming previews.

### Impact and how to use

- **If you just run .NET apps**: the runtime-side support is enabled by default. Most apps won’t need a specific action unless they’re experimenting with runtime async at the compiler level.
- **If you want to experiment with runtime-async compilation**: you’ll need enable preview features and recompile your code with compiler support enabled.
  - `<EnablePreviewFeatures>true</EnablePreviewFeatures>` must be set in the project file
  - `<Features>$(Features);runtime-async=on</Features>` must be set in the project file
- **If you use NativeAOT**: Preview 1 includes foundational support so runtime-async methods can be compiled and diagnosed (including continuation support and toolchain plumbing). Compiler support needs to be enabled as detailed above.

## WebAssembly

### CoreCLR on WebAssembly

.NET 11 includes the initial work to bring CoreCLR support to WebAssembly. This is foundational work that is not yet ready for general use in Preview 1. As part of this work, .NET 11 Preview 1 begins bringing up a WASM-targeting RyuJit that will be used for AOT compilation. For more details and to track progress, see the [CoreCLR WASM epic issue](https://github.com/dotnet/runtime/issues/121511) and the [WASM-targeting JIT tracking issue](https://github.com/dotnet/runtime/issues/121141).

## Interpreter (CoreCLR)

The CoreCLR interpreter continues to expand its supported IL surface and execution features, improving compatibility when the interpreter is enabled (notably for WASM/iOS scenarios) and improving debugging and toolchain integration. For more details and to track progress, see the [CoreCLR Interpreter epic issue](https://github.com/dotnet/runtime/issues/112748).

### New IL and call features supported by the interpreter

- Add `mkrefany`, `refanyval`, and `refanytype` support. ([dotnet/runtime#118753](https://github.com/dotnet/runtime/pull/118753))
- Implement tailcalls (CALL/CALLVIRT). ([dotnet/runtime#118901](https://github.com/dotnet/runtime/pull/118901))
- Implement pinned IL locals. ([dotnet/runtime#118975](https://github.com/dotnet/runtime/pull/118975))
- Implement `STELEM_U1` and `STELEM_U2`. ([dotnet/runtime#119026](https://github.com/dotnet/runtime/pull/119026))
- Implement `CEE_CKFINITE`. ([dotnet/runtime#119548](https://github.com/dotnet/runtime/pull/119548))
- Implement `CEE_JMP`. ([dotnet/runtime#121130](https://github.com/dotnet/runtime/pull/121130))
- Reverse P/Invoke support under the interpreter. ([dotnet/runtime#119133](https://github.com/dotnet/runtime/pull/119133))
- P/Invoke `calli` support under the interpreter. ([dotnet/runtime#119356](https://github.com/dotnet/runtime/pull/119356))

### Interpreter runtime integration (async, ReJIT, debugging)

- Runtime async support in the interpreter (context capture/restore + suspend/resume instruction set). ([dotnet/runtime#121862](https://github.com/dotnet/runtime/pull/121862))
- Synchronized methods support. ([dotnet/runtime#120006](https://github.com/dotnet/runtime/pull/120006))
- ReJIT support under the interpreter. ([dotnet/runtime#122626](https://github.com/dotnet/runtime/pull/122626))
- User breakpoints (`System.Diagnostics.Debugger.Break()`) in interpreted code. ([dotnet/runtime#121911](https://github.com/dotnet/runtime/pull/121911))
- Ability to build `clr-interp` in Release on desktop via a build flag (enables broader performance testing/usage). ([dotnet/runtime#121850](https://github.com/dotnet/runtime/pull/121850))

### Interpreter platform ports and interop

- Interpreter enabled for ARM32 SOFTFP. ([dotnet/runtime#120688](https://github.com/dotnet/runtime/pull/120688))
- CoreCLR interpreter port to riscv64. ([dotnet/runtime#121276](https://github.com/dotnet/runtime/pull/121276))
- Unmanaged `thiscall` calling convention support, including Windows Arm64 ABI specifics. ([dotnet/runtime#122600](https://github.com/dotnet/runtime/pull/122600), [dotnet/runtime#123519](https://github.com/dotnet/runtime/pull/123519))

### Interpreter performance improvements

- Faster interpreter calls by reducing per-invocation setup and avoiding unnecessary prestub work. ([dotnet/runtime#120067](https://github.com/dotnet/runtime/pull/120067))
- Improved compilation performance for very large methods in the interpreter compiler (algorithmic improvements). ([dotnet/runtime#119514](https://github.com/dotnet/runtime/pull/119514))
- Delegate tail-calling support and improved delegate handling, including WASM scenarios. ([dotnet/runtime#120205](https://github.com/dotnet/runtime/pull/120205))

## JIT

### Performance improvements

These changes focus on improving startup throughput, enabling more optimizations, and reducing overhead in key code patterns.

- Raise the Multicore JIT `MAX_METHODS` limit to better support large workloads and improve startup throughput in method-heavy apps. ([dotnet/runtime#119359](https://github.com/dotnet/runtime/pull/119359))
- Optimize `stackalloc` zeroing on Arm64 via `STORE_BLK` to reduce instruction count and improve throughput for stack allocations. ([dotnet/runtime#121986](https://github.com/dotnet/runtime/pull/121986))
- Generalize pattern-based induction-variable (IV) analysis to enable more loop analysis cases, opening the door to more loop optimizations. ([dotnet/runtime#119537](https://github.com/dotnet/runtime/pull/119537))
- Extract bitfields directly from parameter registers without spilling in more cases, improving codegen for certain struct/argument shapes. ([dotnet/runtime#112740](https://github.com/dotnet/runtime/pull/112740))
- Always create `FIELD_LIST` for promoted struct arguments in physical promotion, removing older backend-era constraints. ([dotnet/runtime#118778](https://github.com/dotnet/runtime/pull/118778))
- Devirtualize non-shared generic virtual methods to reduce virtual-call overhead and enable further inlining/optimization opportunities. ([dotnet/runtime#122023](https://github.com/dotnet/runtime/pull/122023))

### New/experimental SIMD work

- Introduce `TYP_SIMD` as an experimental JIT type for `Vector<T>` on Arm64, gated by `DOTNET_JitUseScalableVectorT=1`. This is an enabling step for future scalable-vector work. ([dotnet/runtime#121548](https://github.com/dotnet/runtime/pull/121548))

## GC

### New capabilities

- GC heap hard limit support is now available for 32-bit processes, improving operational control over heap growth in constrained 32-bit environments. ([dotnet/runtime#101024](https://github.com/dotnet/runtime/pull/101024))

## Threading & Synchronization (CoreCLR)

### Runtime subsystem improvements

CoreCLR moves more of its waiting/synchronization infrastructure onto the shared managed wait subsystem.

- Move CoreCLR over to the shared managed wait subsystem, reducing reliance on the Win32 PAL wait path for managed code. ([dotnet/runtime#117788](https://github.com/dotnet/runtime/pull/117788))
- Port cross-process shared mutex logic into managed code to work alongside the managed wait subsystem. ([dotnet/runtime#117635](https://github.com/dotnet/runtime/pull/117635))

## NativeAOT / Hosting

### New capabilities and operational improvements

- Implement `Thread.Interrupt` on NativeAOT on Windows, improving feature parity for interruption-based patterns. ([dotnet/runtime#118968](https://github.com/dotnet/runtime/pull/118968))
- Add `DOTNET_DbgCreateDumpToolPath` to locate `createdump` in NativeAOT scenarios where it isn’t shipped alongside the runtime. ([dotnet/runtime#122989](https://github.com/dotnet/runtime/pull/122989))
- Increase file descriptor limits in NativeAOT executables to better support FD-heavy workloads. ([dotnet/runtime#118995](https://github.com/dotnet/runtime/pull/118995))

## Diagnostics (DAC / cDAC)

### Expanded cDAC functionality

This preview expands cDAC’s ability to describe GC state and ship the data needed for postmortem diagnostics.

- Add the cDAC GC Contract and supporting descriptor mechanisms. ([dotnet/runtime#118050](https://github.com/dotnet/runtime/pull/118050))
- Save cDAC datadescriptor JSON blobs into minidumps to improve postmortem diagnostics. ([dotnet/runtime#121360](https://github.com/dotnet/runtime/pull/121360))
- Publish the cDAC managed transport package. ([dotnet/runtime#120851](https://github.com/dotnet/runtime/pull/120851))

### New cDAC APIs for profiling and inspection (selected)

These APIs improve what tools like SOS and diagnostics stacks can retrieve and present.

- `IXCLRDataMethodInstance::GetName` and related stack-walk APIs. ([dotnet/runtime#118966](https://github.com/dotnet/runtime/pull/118966))
- `GetReJITInformation`. ([dotnet/runtime#119111](https://github.com/dotnet/runtime/pull/119111))
- `GetILForModule`. ([dotnet/runtime#118546](https://github.com/dotnet/runtime/pull/118546))
- `GetMethodDescFromToken`. ([dotnet/runtime#118619](https://github.com/dotnet/runtime/pull/118619))
- Remaining GC data APIs (heap/segment/OOM/interesting info). ([dotnet/runtime#119324](https://github.com/dotnet/runtime/pull/119324))

### Architecture coverage

- Add riscv64 managed unwinder for cDAC. ([dotnet/runtime#117436](https://github.com/dotnet/runtime/pull/117436))
- Add loongarch64 managed unwinder for cDAC. ([dotnet/runtime#121039](https://github.com/dotnet/runtime/pull/121039))

## Mono Runtime

### New capabilities and performance-related configuration

- Add an UnhandledException hook for finalizer scenarios in Mono, improving exception reporting/behavior in finalizer execution paths. ([dotnet/runtime#118563](https://github.com/dotnet/runtime/pull/118563))
- Enable the compressed interface bitmap by default and provide runtime configuration to manage adoption. ([dotnet/runtime#119694](https://github.com/dotnet/runtime/pull/119694), [dotnet/runtime#119881](https://github.com/dotnet/runtime/pull/119881))

## Architecture enablement

### RISC-V and s390x improvements

- Add initial RISC-V “C” extension support (compressed integer register-register ops, alignment/unwind updates, and related tooling adjustments). ([dotnet/runtime#117408](https://github.com/dotnet/runtime/pull/117408))
- Add RISC-V `Zbs` extension support (single-bit instructions). ([dotnet/runtime#115335](https://github.com/dotnet/runtime/pull/115335))
- Add SIMD fallback support for older / unsupported s390x generations. ([dotnet/runtime#118376](https://github.com/dotnet/runtime/pull/118376))
