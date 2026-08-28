# .NET Runtime in .NET 11 RC 1 - Release Notes

.NET 11 RC 1 includes new runtime platform and diagnostics capabilities:

- [CoreCLR support for linux-bionic](#coreclr-support-for-linux-bionic)
- [In-process crash reporting on Unix](#in-process-crash-reporting-on-unix)
- [Half operations use FP16 hardware instructions](#half-operations-use-fp16-hardware-instructions)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET Runtime updates in .NET 11:

- [What's new in the .NET 11 runtime](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/runtime)

## CoreCLR support for linux-bionic

CoreCLR is now enabled for `linux-bionic-arm64` and `linux-bionic-x64`, including Termux scenarios on Android ([dotnet/runtime #131115](https://github.com/dotnet/runtime/pull/131115)). The linux-bionic AppHost pack now includes `singlefilehost`, so self-contained single-file applications use the expected bundled host instead of falling back to an apphost that cannot launch the bundle.

The build selects CoreCLR alongside Mono, the libraries, host, and packs on the supported linux-bionic architectures. NativeAOT remains the fallback for linux-bionic architectures where CoreCLR isn't enabled.

## In-process crash reporting on Unix

The in-process crash reporter is now available on Linux and macOS through the existing crash-report settings ([dotnet/runtime #131410](https://github.com/dotnet/runtime/pull/131410)). When `DOTNET_DbgEnableMiniDump` isn't enabled, setting `DOTNET_EnableCrashReport=1` or `DOTNET_EnableCrashReportOnly=1` selects the in-process reporter. Existing createdump behavior remains in place when minidumps are enabled.

Community contributions extended the in-process reporter across the remaining Unix platforms and added s390x support ([dotnet/runtime #131604](https://github.com/dotnet/runtime/pull/131604), [dotnet/runtime #131796](https://github.com/dotnet/runtime/pull/131796)). Thank you [@am11](https://github.com/am11) and [@saitama951](https://github.com/saitama951) for these contributions!

## Half operations use FP16 hardware instructions

The JIT now uses hardware FP16 instructions for `System.Half` arithmetic and conversions when the processor supports them ([dotnet/runtime #130512](https://github.com/dotnet/runtime/pull/130512)). On x64, arithmetic uses AVX10.1 while conversions between `Half` and `float` can use F16C. On Arm64, arithmetic uses the optional FP16 instruction set, while conversions between `Half` and `float` or `double` use baseline Arm64 instructions.

The optimization requires no application changes and preserves the existing ABI representation of `Half`.

<!-- Filtered features (significant engineering work, but too niche for standalone release-note sections):
  - On-demand in-process crash-report generation (dotnet/runtime #131220): Internal infrastructure for native fatal-error handlers, not a public user-facing capability.
  - WebAssembly RyuJIT and ReadyToRun fixes: Important stabilization work, but the individual changes are architecture-specific fixes rather than a new RC 1 capability.
  - cDAC debugger contract expansion: Primarily diagnostics-tool implementation work without a broad end-user workflow to announce in RC 1.
  - Arm64 SVE constant vectors and masks: Valuable architecture enablement, but limited to specialized SVE code generation and not supported by RC 1 benchmark evidence.
-->

## Bug fixes

- **Garbage collection**
  - `GC.GetTotalMemory` no longer reports negative values when regions are enabled ([dotnet/runtime #130888](https://github.com/dotnet/runtime/pull/130888)).
  - `GC.GetTotalAllocatedBytes` remains monotonic with Dynamic Adaptation To Application Sizes (DATAS) under Server GC ([dotnet/runtime #131069](https://github.com/dotnet/runtime/pull/131069)).
- **Hosting**
  - `Environment.GetCommandLineArgs()[0]` now reports the host invocation name instead of a rewritten path in affected hosting scenarios ([dotnet/runtime #131671](https://github.com/dotnet/runtime/pull/131671)).
  - Native exception handling in external shared libraries works correctly on macOS ([dotnet/runtime #130693](https://github.com/dotnet/runtime/pull/130693)).
- **Runtime diagnostics**
  - In-process crash reports no longer assert while processing certain stack frames ([dotnet/runtime #131273](https://github.com/dotnet/runtime/pull/131273)).
  - Concurrent in-process crash-report requests are serialized to protect shared reporting state ([dotnet/runtime #130436](https://github.com/dotnet/runtime/pull/130436)).
- **Type system and interop**
  - Loading recursive nullable types that implement static abstract interfaces no longer crashes on Linux ([dotnet/runtime #130088](https://github.com/dotnet/runtime/pull/130088)).
  - The `ComWrappers` runtime-callable-wrapper cache is partitioned into per-processor buckets, reducing contention between native-to-managed transitions and finalization ([dotnet/runtime #132033](https://github.com/dotnet/runtime/pull/132033)).

## Community contributors

Thank you contributors! ❤️

- [@abhishekabhi73cc-design](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aabhishekabhi73cc-design)
- [@am11](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aam11)
- [@saitama951](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Asaitama951)
- [@Sergio0694](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ASergio0694)
