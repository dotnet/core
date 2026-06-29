# .NET Runtime in .NET 11 Preview 6 - Release Notes

.NET 11 Preview 6 includes runtime performance work and continued WebAssembly bring-up:

- [Runtime-async keeps getting faster](#runtime-async-keeps-getting-faster)
- [Browser and WebAssembly on CoreCLR](#browser-and-webassembly-on-coreclr)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET Runtime updates in .NET 11:

- [What's new in the .NET 11 runtime](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/runtime)

## Runtime-async keeps getting faster

Runtime-async — the runtime's built-in implementation of `async`/`await` — continues to get faster in Preview 6, building on the suspension improvements from Preview 5. The JIT now compiles a dedicated runtime-async version of a synchronous, task-returning method rather than delegating to it through a thunk ([dotnet/runtime #128384](https://github.com/dotnet/runtime/pull/128384)). The JIT turns the method's tail calls into runtime-async calls and awaits the task that would otherwise have been returned, so the async path no longer pays for an extra layer of indirection.

Several related changes reduce suspension overhead further:

- The JIT tail-merges async suspension points so the generated code is smaller ([dotnet/runtime #128559](https://github.com/dotnet/runtime/pull/128559)).
- Continuations used for runtime-async callable task thunks are cached and reused ([dotnet/runtime #128320](https://github.com/dotnet/runtime/pull/128320)).
- Methods that are already pooled opt out of runtime-async, avoiding redundant work ([dotnet/runtime #128943](https://github.com/dotnet/runtime/pull/128943)).

These changes are automatic — no source or project changes are required to benefit from them.

## Browser and WebAssembly on CoreCLR

Bring-up of the CoreCLR runtime for `browser-wasm` continues in Preview 6. The WebAssembly RyuJIT back end gained more code generation support — including contained bitcast operands, `callfinally` codegen, and packed SIMD encodings — and the garbage collector now zero-initializes shadow-stack slots and emits write barriers correctly on WebAssembly ([dotnet/runtime #128472](https://github.com/dotnet/runtime/pull/128472), [dotnet/runtime #128348](https://github.com/dotnet/runtime/pull/128348), [dotnet/runtime #128229](https://github.com/dotnet/runtime/pull/128229), [dotnet/runtime #128225](https://github.com/dotnet/runtime/pull/128225), [dotnet/runtime #129073](https://github.com/dotnet/runtime/pull/129073)).

Browser CoreCLR remains opt-in this preview. As described in the Preview 5 notes, you can try it in a WebAssembly project that targets `net11.0` by setting `UseMonoRuntime` to `false`:

```xml
<PropertyGroup>
  <TargetFramework>net11.0</TargetFramework>
  <UseMonoRuntime>false</UseMonoRuntime>
</PropertyGroup>
```

A dedicated native WebAssembly toolchain for browser CoreCLR isn't available yet, so AOT and native build paths still require the Mono runtime.

<!-- Filtered features (significant engineering work, but too internal/incomplete for release notes):
  - Arm64 PAC-RET (pointer authentication for return addresses, dotnet/runtime #128147, #129130): security hardening, but disabled by default and still being landed in pieces. Document when it's enabled and user-facing.
  - NativeAOT aggregate executable shims (dotnet/runtime #128553): gated behind EnablePreviewFeatures, very narrow audience (NativeAOT shared libraries with multiple entry points).
  - Numerous cDAC / DAC and diagnostics-plumbing changes: internal diagnostics infrastructure with no direct developer-facing surface this preview.
-->

## Bug fixes

- **JIT / code generation**
  - Fixed an x86 GC hole in stack-to-stack struct copies ([dotnet/runtime #128805](https://github.com/dotnet/runtime/pull/128805)).
  - Stopped the JIT from killing floating-point, SIMD, and mask registers across x64 write barriers ([dotnet/runtime #128778](https://github.com/dotnet/runtime/pull/128778)).
  - Improved code generation for `PopCount` and `TrailingZeroCount` on Arm64 ([dotnet/runtime #128677](https://github.com/dotnet/runtime/pull/128677)).
- **NativeAOT**
  - Accepted full-width `0x`/`0X`-prefixed 64-bit hexadecimal environment configuration values ([dotnet/runtime #128462](https://github.com/dotnet/runtime/pull/128462)).
  - Fixed string-related GC configuration handling ([dotnet/runtime #128455](https://github.com/dotnet/runtime/pull/128455)).
- **Mono / interpreter**
  - Fixed stale GC liveness reporting for a variable before it is set ([dotnet/runtime #128709](https://github.com/dotnet/runtime/pull/128709)).
- **Runtime**
  - Fixed `ValueType.GetHashCode` for a type with a nested generic field ([dotnet/runtime #129728](https://github.com/dotnet/runtime/pull/129728)). Thank you [@huoyaoyuan](https://github.com/huoyaoyuan)!

## Community contributors

Thank you contributors! ❤️

- [@am11](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aam11)
- [@BoyBaykiller](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ABoyBaykiller)
- [@clamp03](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aclamp03)
- [@cshung](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Acshung)
- [@elringus](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aelringus)
- [@filipnavara](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Afilipnavara)
- [@gbalykov](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Agbalykov)
- [@jonathandavies-arm](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Ajonathandavies-arm)
- [@maximmenshikov](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Amaximmenshikov)
- [@MichalPetryka](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3AMichalPetryka)
- [@Ruihan-Yin](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ARuihan-Yin)
- [@saucecontrol](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Asaucecontrol)
- [@sethjackson](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Asethjackson)
- [@SwapnilGaikwad](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ASwapnilGaikwad)
