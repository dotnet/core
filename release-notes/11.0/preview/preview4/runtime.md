# .NET Runtime in .NET 11 Preview 4 - Release Notes

.NET 11 Preview 4 includes new runtime features and performance work:

- [Runtime async is now built into the shared framework](#runtime-async-is-now-built-into-the-shared-framework)
- [JIT improvements for everyday code](#jit-improvements-for-everyday-code)
- [Hardware intrinsics and code generation for x86/x64 and Arm64](#hardware-intrinsics-and-code-generation-for-x86x64-and-arm64)
- [ReadyToRun improvements](#readytorun-improvements)
- [GC fixes for pinning, async returns, and background marking](#gc-fixes-for-pinning-async-returns-and-background-marking)
- [Browser/WebAssembly CoreCLR enablement](#browserwebassembly-coreclr-enablement)
- [Platform support: >1024 CPUs and Haiku bring-up](#platform-support-1024-cpus-and-haiku-bring-up)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET Runtime updates in .NET 11:

- [What's new in .NET 11 runtime](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/runtime)

## Runtime async is now built into the shared framework

Preview 3 removed the `[RequiresPreviewFeatures]` opt-in for runtime-async. Preview 4 takes the next step and turns runtime-async on inside the shared framework itself: every supported `IsNETCoreAppSrc` source project targeting `net11.0` is built with `runtime-async=on`, and the `DOTNET_RuntimeAsync` / `UNSUPPORTED_RuntimeAsync` config knob has been removed. The runtime no longer carries a "runtime-async off" code path ([dotnet/runtime #125406](https://github.com/dotnet/runtime/pull/125406), [dotnet/runtime #126754 and friends — see also "Enable runtime-async unconditionally in System.Private.CoreLib (CoreCLR and NativeAOT)"](https://github.com/dotnet/runtime/pull/125406)). Out-of-band NuGet packages that ship cross-runtime (for example `System.Text.Json`, `System.Collections.Immutable`) stay on compiler-generated async for now.

Runtime-async also picked up two notable capability fixes:

- **Covariant `Task` → `Task<T>` overrides** — when a derived class returns `Task<T>` for a base method that returns `Task`, the runtime now generates a void-returning thunk that bridges the calling convention difference, so virtual dispatch works for both flavors. The same fix landed for NativeAOT ([dotnet/runtime #125900](https://github.com/dotnet/runtime/pull/125900), [dotnet/runtime #126768](https://github.com/dotnet/runtime/pull/126768)).
- **Reclaimed continuation-dispatch performance** — earlier debugger/TPL instrumentation in `RuntimeAsyncTask::DispatchContinuations` had cost about 7%. Preview 4 splits the method into instrumented and non-instrumented variants and switches between them on demand, keeping the hot path 379 bytes smaller and recovering most of the lost throughput on Windows x64 ([dotnet/runtime #126091](https://github.com/dotnet/runtime/pull/126091)). Thanks [@lateralusX](https://github.com/lateralusX) for the measurement-driven fix.

The JIT also added a shared `GT_RETURN_SUSPEND` block when a method has more than one `await`, producing modest R2R size reductions across `System.IO.Compression`, `System.Linq.AsyncEnumerable`, `System.Net.Http`, and `System.Private.Xml` ([dotnet/runtime #125174](https://github.com/dotnet/runtime/pull/125174)).

```xml
<!-- Project files no longer need to opt in for the shared framework path. -->
<PropertyGroup>
  <TargetFramework>net11.0</TargetFramework>
  <!-- runtime-async is on by default for shared-framework source projects -->
</PropertyGroup>
```

To opt a specific project out, set `<UseRuntimeAsync>false</UseRuntimeAsync>`.

## JIT improvements for everyday code

Several JIT optimizations landed this preview that benefit normal C# without any source changes.

**`SequenceEqual` over constants folds away.** The JIT can now value-number through `SequenceEqual` and reduce a comparison of two known strings (or any constant span sequence) to a single `xor` ([dotnet/runtime #121985](https://github.com/dotnet/runtime/pull/121985)). Thanks [@hez2010](https://github.com/hez2010) for the contribution.

```csharp
public static string Str1 => "abcdef";
public static string Str2 => "bcdefg";

[MethodImpl(MethodImplOptions.NoInlining)]
public static bool CompareStr() => Str1.Equals(Str2);
```

Before:

```asm
       mov      rax, 0x2DA4A1AEFF0      ; 'abcdef'
       add      rax, 12
       mov      rcx, 0x2DA4A1AF024
       mov      rdx, qword ptr [rax]
       mov      rax, qword ptr [rax+0x04]
       mov      r8, qword ptr [rcx]
       xor      rdx, r8
       xor      rax, qword ptr [rcx+0x04]
       or       rax, rdx
       sete     al
       movzx    rax, al
       ret
```

After:

```asm
       xor      eax, eax
       ret
```

**`BOUNDS_CHECK(0, length)` is eliminated when `length != 0` is already known.** A common pattern after an empty-guard on a span — `if (!span.IsEmpty && span[0] == value)` — used to keep the bounds check on `span[0]`. The JIT now scans assertions for an `OAK_NOT_EQUAL` against `0` on the length and tightens the lower bound, dropping the check ([dotnet/runtime #126856](https://github.com/dotnet/runtime/pull/126856)).

**Dominating redundant branch elimination.** When a dominating predicate is implied by a dominated branch — for example `if (x > 0) if (x > 1) S();` — the JIT can now fold the outer `if (x > 0)` away ([dotnet/runtime #126587](https://github.com/dotnet/runtime/pull/126587)).

**SSA-aware PHI jump threading.** Redundant-branch jump threading now keeps working through PHI-based blocks when the PHI uses can be fully accounted for in the block and its immediate successors, expanding the cases where the JIT can short-circuit a control-flow diamond ([dotnet/runtime #126812](https://github.com/dotnet/runtime/pull/126812), [dotnet/runtime #127103](https://github.com/dotnet/runtime/pull/127103)).

**Loop cloning correctness for down-counting loops.** Down-counting loops were being cloned without verifying that the initial value was strictly less than the array length, which could let the fast path execute when it shouldn't ([dotnet/runtime #126770](https://github.com/dotnet/runtime/pull/126770)).

Other JIT items that landed this preview include shared funclet iteration ([dotnet/runtime #126491](https://github.com/dotnet/runtime/pull/126491), [dotnet/runtime #126588](https://github.com/dotnet/runtime/pull/126588)) and refined SSA in ambiguously-threaded blocks ([dotnet/runtime #126907](https://github.com/dotnet/runtime/pull/126907)).

## Hardware intrinsics and code generation for x86/x64 and Arm64

**F16C acceleration for `Half` ↔ `float` conversions on x64.** When the CPU supports F16C (most AVX2-capable hardware), conversions between `System.Half` and `float`/`double` now use the dedicated `vcvtph2ps` / `vcvtps2ph` instructions instead of helper calls. On a simple `HalfToSingle`/`SingleToHalf` benchmark, this collapses a stack-spill + helper invocation down to a register-only sequence ([dotnet/runtime #127094](https://github.com/dotnet/runtime/pull/127094)). An earlier broader change that introduced a `TYP_HALF` kind was reverted for ABI reasons ([dotnet/runtime #127042](https://github.com/dotnet/runtime/pull/127042)); the F16C work is the simpler, ABI-safe replacement.

**Better cost modeling for x86/x64 SIMD and floating-point.** Floating-point execution and size costs hadn't been refreshed since the x87 era, and most hardware-intrinsic nodes were stuck at `costEx=1, costSz=1`, which actively suppressed CSE and other optimizations. The costs now reflect modern reality, which lets the JIT make better decisions about hoisting and CSE around SIMD code ([dotnet/runtime #127048](https://github.com/dotnet/runtime/pull/127048)).

**Faster `DotProduct` on AVX-capable x86.** Lowering for `Vector128.Dot`-style operations now emits a `mul + permute + add` sequence instead of `vdpps`/`vdppd` when AVX is available, which is consistently faster:

| Benchmark | Baseline | New | Ratio |
| --------- | -------- | --- | ----- |
| `Perf_Plane.Dot` | 1.708 ns | 1.295 ns | 0.76 |
| `Perf_Quaternion.Dot` | 1.655 ns | 1.302 ns | 0.79 |

Numbers are from the `System.Numerics.Tests` perf harness and are pulled from the PR description ([dotnet/runtime #125666](https://github.com/dotnet/runtime/pull/125666)). Thanks [@alexcovington](https://github.com/alexcovington) for the contribution.

**Faster `IndexOfAnyAsciiSearcher` on Arm64.** Arm64 versions of `Vector*.Count`, `IndexOf`, and `LastIndexOf` no longer route through `ExtractMostSignificantBits`. The PR description reports a 5–50% improvement in workloads using these APIs in their core loop ([dotnet/runtime #126678](https://github.com/dotnet/runtime/pull/126678)).

**Arm64 `ToScalar` for 64-bit integers.** `ToScalar` on a `Vector*<long>` / `Vector*<ulong>` now uses `fmov` instead of `umov`, which is shorter and faster on most cores ([dotnet/runtime #126803](https://github.com/dotnet/runtime/pull/126803)).

**SVE `CreateWhile` API expansion.** `CreateWhile` gained signed, `double`, and `single` variants alongside the existing unsigned ones, completing the predicate-generation surface for SVE loops ([dotnet/runtime #124081](https://github.com/dotnet/runtime/pull/124081)).

**New SVE2 / Arm64 instruction-set detection.** The runtime now reports `SVE_AES`, `SVE_SHA3`, `SVE_SM4`, `SHA3`, and `SM4` as separate instruction sets, allowing `Sve2*.IsSupported` queries for those features to light up on capable hardware ([dotnet/runtime #124637](https://github.com/dotnet/runtime/pull/124637)).

**Avx10 detection fix.** The CPUID-bit cache for AVX10 was being clobbered by a later `__cpuidex` query, which could cause AVX10 to be misreported on capable hardware ([dotnet/runtime #126810](https://github.com/dotnet/runtime/pull/126810)).

## ReadyToRun improvements

**`Comparer<T>` and `EqualityComparer<T>` are intrinsified in R2R.** The default `Comparer<T>.Default` / `EqualityComparer<T>.Default` cctor used `CreateInstanceForAnotherGenericParameter` reflection that R2R could not see, so callers fell back to the interpreter / JIT. R2R now generates a specialized helper in the image, mirroring the NativeAOT approach. The PR reports `System.Collections.ContainsFalse_Int32_.ImmutableList` running 20× faster, with about a 0.5% R2R image size increase ([dotnet/runtime #126204](https://github.com/dotnet/runtime/pull/126204)).

**Async method inlining is no longer blocked in crossgen2.** Restrictions that prevented async methods from being inlined during ReadyToRun compilation have been removed; all 69 async tests pass with both crossgen2 and composite R2R, and inlining of awaitless async calls is now confirmed end-to-end ([dotnet/runtime #125472](https://github.com/dotnet/runtime/pull/125472)).

**A new `ILCompiler.ReadyToRun.Tests` project** lets the team assert structural facts about R2R output (which methods got inlined, which got compiled) instead of relying solely on behavioral tests ([dotnet/runtime #126486](https://github.com/dotnet/runtime/pull/126486)).

## GC fixes for pinning, async returns, and background marking

- **GC heap size with heavy pinning.** A regression in heap sizing when many pinned objects were present has been redone with a fix for the infinite loop in `allocate_in_condemned_generations` that the first attempt introduced ([dotnet/runtime #126043](https://github.com/dotnet/runtime/pull/126043)).
- **GC write barrier for async return values.** The interpreter was checking only whether the *type* contained GC refs when emitting the write barrier for an async method return into the continuation object, which could miss the case where an object without refs was returned. Fixes intermittent `System.Text.Json.Tests` GC crashes ([dotnet/runtime #126721](https://github.com/dotnet/runtime/pull/126721)).
- **Background GC mark phase join.** `background_mark_phase` was using `gc_t_join` (intended for foreground marking) instead of `bgc_t_join`, which could hang the runtime on certain `GCPerfSim` shapes ([dotnet/runtime #126389](https://github.com/dotnet/runtime/pull/126389)).

## Browser/WebAssembly CoreCLR enablement

CoreCLR continues its bring-up on WebAssembly. Highlights from this preview:

- **WebCIL V1 is the default for CoreCLR WASM builds.** The shared WebCIL header gained a `TableBase` field (28 → 32 bytes), with both Mono and CoreCLR readers accepting V0 and V1. Crossgen2's `WasmObjectWriter` produces V1 directly, and CoreCLR-flavored WASM SDK builds default `WasmWebcilVersion` to `V1` ([dotnet/runtime #126709](https://github.com/dotnet/runtime/pull/126709), [dotnet/runtime #126876](https://github.com/dotnet/runtime/pull/126876)).
- **Native re-link works for CoreCLR WASM apps.** The previous stub `WasmBuildApp` / `WasmTriggerPublishApp` targets are replaced with a full Emscripten-based pipeline that re-links `dotnet.native.wasm` from the runtime pack and lets apps include custom native code via `NativeFileReference` ([dotnet/runtime #126946](https://github.com/dotnet/runtime/pull/126946)).
- **Six previously-excluded test projects are back.** With native relink in place, `System.Runtime`, `System.Reflection.MetadataLoadContext`, `System.Runtime.Loader`, `System.Diagnostics.StackTrace`, and related tests build and run again on browser-CoreCLR ([dotnet/runtime #127147](https://github.com/dotnet/runtime/pull/127147), [dotnet/runtime #126996](https://github.com/dotnet/runtime/pull/126996)).
- **JS minification in Release builds and TypeScript type exports.** Browser CoreCLR Release builds ship minified JS ([dotnet/runtime #126877](https://github.com/dotnet/runtime/pull/126877)), and the public TypeScript surface now exports the asset-related types that were previously buried in internal type declarations ([dotnet/runtime #127084](https://github.com/dotnet/runtime/pull/127084)).
- **RyuJIT WASM codegen progress.** Many incremental codegen fixes landed for the WASM-targeting RyuJIT — bounds checks on `GT_INDEX_ADDR` ([dotnet/runtime #126111](https://github.com/dotnet/runtime/pull/126111)), block-store edge cases ([dotnet/runtime #125770](https://github.com/dotnet/runtime/pull/125770)), int-to-float casts ([dotnet/runtime #126209](https://github.com/dotnet/runtime/pull/126209)), `genStructReturn` ([dotnet/runtime #126326](https://github.com/dotnet/runtime/pull/126326)), funclet prolog/epilog and EH/unwind frames ([dotnet/runtime #126663](https://github.com/dotnet/runtime/pull/126663), [dotnet/runtime #127043](https://github.com/dotnet/runtime/pull/127043)), and multi-entry try regions ([dotnet/runtime #126374](https://github.com/dotnet/runtime/pull/126374)). WASM vector width is now declared as 128 bits ([dotnet/runtime #126375](https://github.com/dotnet/runtime/pull/126375)).
- **NativeAOT publish for WASM no longer drops package satellites.** Satellite assemblies coming from NuGet packages are now passed to ILC via `--satellite:` and pruned from the publish output, fixing localization for AOT-published apps that depend on packages like `System.CommandLine` ([dotnet/runtime #127089](https://github.com/dotnet/runtime/pull/127089)).

## Platform support: >1024 CPUs and Haiku bring-up

- **More than 1024 CPUs.** A customer report uncovered that .NET fails to initialize on machines with more than 1024 logical processors because `sched_getaffinity` was being called with the default `cpu_set_t` (capped at 1024). The runtime now allocates the CPU set dynamically, the GC keeps a 1024-heap limit but lifts the CPU limit, and `MAX_SUPPORTED_CPUS` was renamed to `MAX_SUPPORTED_HEAPS` to reflect what it actually bounds ([dotnet/runtime #126763](https://github.com/dotnet/runtime/pull/126763)).
- **Haiku initial managed libraries.** First managed libraries (notably `System.Private.CoreLib`) now build for Haiku, with the matching native PAL plumbing — part of the broader Haiku port ([dotnet/runtime #121880](https://github.com/dotnet/runtime/pull/121880)). Thanks [@trungnt2910](https://github.com/trungnt2910) for continuing the Haiku work.

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - cDAC plumbing — Loader/RuntimeTypeSystem/DacDbi/contract-versioning/typed-fields/etc. (~30 PRs). Important to the team building the new managed debugger contract, but reads as internal jargon to the 80/20 audience and does not yet expose mainstream developer-facing APIs.
  - ILTrim hackathon sources, descriptor support, property/event preservation. Foundation for a future trimmer story; Preview 4 only adds infrastructure with no end-user trimming behavior.
  - LoongArch64 emitter / SoftwareExceptionFrame fixes and RISC-V fence/CSE flag display. Ongoing arch-enablement work; valuable, but scoring near 1 by the 80/20 filter.
  - SuperPMI / SPMI infrastructure refactors (#125874, parallelsuperpmi cleanup). JIT-developer tooling.
  - COM stub rework (#126002, #127021, #126731, #127241). Internal interop refactor; behavior is unchanged for users.
  - iOS-CLR (`[ios-clr]`) bring-up commits. Active CoreCLR-on-Apple-mobile work, but still pre-shipping.
  - Cross-process synchronization, hotreload-utils repo merge, and createdump alt-stack detection. Diagnostics / build plumbing.
  - "Apply.Base.Relocs.For.Webcil" and other in-progress WIP items where the PR title itself flags incompleteness.
-->

## Breaking changes

- The `DOTNET_RuntimeAsync` / `UNSUPPORTED_RuntimeAsync` configuration switch is gone. There is no longer a way to disable runtime-async at the runtime level — code that relied on the env var to fall back to compiler-generated async will need to either rebuild with `UseRuntimeAsync=false` per project, or stop setting the variable ([dotnet/runtime #125406](https://github.com/dotnet/runtime/pull/125406)).

## Bug fixes

- **JIT**
  - Fixed `BOUNDS_CHECK(0, length)` not eliding when `length != 0` is already proven ([dotnet/runtime #126856](https://github.com/dotnet/runtime/pull/126856)).
  - Fixed loop cloning bug for down-counting loops that could let the fast path execute incorrectly ([dotnet/runtime #126770](https://github.com/dotnet/runtime/pull/126770)).
  - Fixed JIT assert with `UnsafeAccessor` and delegate constructors ([dotnet/runtime #125868](https://github.com/dotnet/runtime/pull/125868)).
  - Fixed disasm of register-to-register SIMD narrow/widen instructions ([dotnet/runtime #126371](https://github.com/dotnet/runtime/pull/126371)).
  - Fixed Arm64 outerloop jitstress failures in FMA ([dotnet/runtime #126434](https://github.com/dotnet/runtime/pull/126434)).
  - Disallowed using float callee-saves in x64 functions with patchpoints ([dotnet/runtime #127158](https://github.com/dotnet/runtime/pull/127158)); restore Arm64/LA64/RISC-V64 OSR callee-saves from the tier0 frame ([dotnet/runtime #126880](https://github.com/dotnet/runtime/pull/126880)).
  - Fixed `vcvtps2ph` encoding ([dotnet/runtime #126371](https://github.com/dotnet/runtime/pull/126371) and follow-ups).
- **GC**
  - Heap-size regression in heavily pinning scenarios ([dotnet/runtime #126043](https://github.com/dotnet/runtime/pull/126043)).
  - Wrong join in BGC mark phase causing rare hangs ([dotnet/runtime #126389](https://github.com/dotnet/runtime/pull/126389)).
  - Linux `madvise()` advice values were being combined incorrectly with bitwise-OR in `GCToOSInterface::VirtualReset` ([dotnet/runtime #126780](https://github.com/dotnet/runtime/pull/126780) <!-- TODO: confirm PR# — bitwise-OR madvise fix appears in slice but title-only -->).
- **Runtime async**
  - Missing GC write barrier when writing an async method return into the continuation object ([dotnet/runtime #126721](https://github.com/dotnet/runtime/pull/126721)).
  - x86 runtime-async frame pointer mismatch in `GetSpForDiagnosticReporting` and DBI generic-type resolution ([dotnet/runtime #126717](https://github.com/dotnet/runtime/pull/126717), [dotnet/runtime #126915](https://github.com/dotnet/runtime/pull/126915)).
  - GC hole when resuming an async continuation via the interpreter ([dotnet/runtime #127072](https://github.com/dotnet/runtime/pull/127072)).
- **Codegen / R2R**
  - `crossgen2` crash on composite images with multiple `TypeMap` nodes ([dotnet/runtime #126429](https://github.com/dotnet/runtime/pull/126429)).
  - R2R `TypeMap` fallback for unresolved assembly targets ([dotnet/runtime #126123](https://github.com/dotnet/runtime/pull/126123)).
  - `R2RDump` `ArgumentOutOfRangeException` for composite LVB images ([dotnet/runtime #126387](https://github.com/dotnet/runtime/pull/126387)).
- **Interop / NativeAOT**
  - NativeAOT GC crash from volatile arg registers not being populated by `UniversalTransitionThunk` ([dotnet/runtime #126328](https://github.com/dotnet/runtime/pull/126328)).
  - NativeAOT ILC failure on Android ([dotnet/runtime #126214](https://github.com/dotnet/runtime/pull/126214)).
  - NativeAOT publish leaked package satellite assemblies and failed to resolve localized resources at runtime ([dotnet/runtime #127089](https://github.com/dotnet/runtime/pull/127089)).
  - Arm64 interface dispatch cache torn read; race in cached interface dispatch stubs ([dotnet/runtime #126346](https://github.com/dotnet/runtime/pull/126346), and the dedicated race fix in this preview).
  - `COMDelegate::BindToMethod` with static virtuals ([dotnet/runtime #125875](https://github.com/dotnet/runtime/pull/125875)). Thanks [@MichalPetryka](https://github.com/MichalPetryka).
- **Diagnostics / debugger**
  - Crash in the debugger transport shutdown path during process exit ([dotnet/runtime #126372](https://github.com/dotnet/runtime/pull/126372)).
  - DAC `GetNativeCodeInfo` API now uses the async variant for thunk `MethodDesc`s ([dotnet/runtime #126728](https://github.com/dotnet/runtime/pull/126728)).
- **Runtime / VM**
  - Reverse P/Invoke initialization race for `t_MostRecentUMEntryThunkData` ([dotnet/runtime #126579](https://github.com/dotnet/runtime/pull/126579)).
  - Cached version-resilient hash code on `MethodTableAuxiliaryData` to avoid superlinear behavior with polymorphic recursion ([dotnet/runtime #126534](https://github.com/dotnet/runtime/pull/126534)).
  - Better `InvalidCastException` message for generic argument coming from a different `AssemblyLoadContext` ([dotnet/runtime #125973](https://github.com/dotnet/runtime/pull/125973)).
  - LoongArch64 floating-point register copy in `SoftwareExceptionFrame::UpdateContextFromTransitionBlock` ([dotnet/runtime #126597](https://github.com/dotnet/runtime/pull/126597)).
  - LoongArch64 emitter `getInsExecutionCharacteristics()` initialization for perfscore ([dotnet/runtime #126938](https://github.com/dotnet/runtime/pull/126938)).
  - RISC-V fine-grained fence variants for memory barriers ([dotnet/runtime #126566](https://github.com/dotnet/runtime/pull/126566)).
- **Mono**
  - Avoid incorrectly resolving a `MonoClass` for `MONO_TYPE_GENERICINST` when loading custom attribute values ([dotnet/runtime #123439](https://github.com/dotnet/runtime/pull/123439)).

## Community contributors

Thank you contributors! ❤️

- [@alexcovington](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aalexcovington)
- [@BoyBaykiller](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ABoyBaykiller)
- [@DoctorKrolic](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ADoctorKrolic)
- [@elringus](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aelringus)
- [@hez2010](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Ahez2010)
- [@LuckyXu-HF](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ALuckyXu-HF)
- [@MichalPetryka](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3AMichalPetryka)
- [@namu-lee](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Anamu-lee)
- [@sethjackson](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Asethjackson)
- [@tpa95](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Atpa95)
- [@trungnt2910](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Atrungnt2910)
- [@Venkad000](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3AVenkad000)
- [@ylpoonlg](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aylpoonlg)
