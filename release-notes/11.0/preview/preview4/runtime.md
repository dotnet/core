# .NET Runtime in .NET 11 Preview 4 - Release Notes

.NET 11 Preview 4 includes new runtime features and performance work:

- [Runtime libraries are now compiled with runtime-async](#runtime-libraries-are-now-compiled-with-runtime-async)
- [JIT optimizations](#jit-optimizations)
- [Hardware intrinsics and code generation](#hardware-intrinsics-and-code-generation)
- [ReadyToRun improvements](#readytorun-improvements)
- [Browser/WebAssembly CoreCLR enablement](#browserwebassembly-coreclr-enablement)
- [Platform support: >1024 CPUs](#platform-support-1024-cpus)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET Runtime updates in .NET 11:

- [What's new in .NET 11 runtime](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/runtime)

## Runtime libraries are now compiled with runtime-async

The runtime libraries are now built with `runtime-async=on`. That means that the runtime libraries do not contain compiler-generated state machines, but rely on the runtime-provided async feature. Enabling runtime async for all runtime libraries provides excellent functional and performance testing. It also enables migrating an entire app (with only library dependencies) to the new model. This change builds on Preview 3, which removed the `[RequiresPreviewFeatures]` opt-in for runtime-async.

We expect runtime async to deliver throughput and library size improvements. Change is expected to be commensurate with the degree of async usage. We will appreciate any reports, with either positive or negative results.

Preview 4 also includes:

- **Covariant `Task` → `Task<T>` overrides** — when a derived class returns `Task<T>` for a base method that returns `Task`, the runtime now generates a void-returning thunk that bridges the calling convention difference, so virtual dispatch works for both flavors. The same fix landed for NativeAOT ([dotnet/runtime #125900](https://github.com/dotnet/runtime/pull/125900), [dotnet/runtime #126768](https://github.com/dotnet/runtime/pull/126768)).
- **Runtime-async method inlining in crossgen2.** Restrictions that prevented runtime-async methods from being inlined during ReadyToRun compilation have been removed; all 69 async tests pass with both crossgen2 and composite R2R, and inlining of awaitless async calls (the sync-fast-path) is now confirmed end-to-end ([dotnet/runtime #125472](https://github.com/dotnet/runtime/pull/125472)).

## JIT optimizations

Several JIT optimizations landed this preview that benefit normal C# without any source changes.

### Inlining improvements

Several JIT optimizations are included that are most visible after inlining, when constants and guards from different methods land in the same compiled body and become eligible for folding. The optimizations apply outside inlining too, but inlining is the most common way the necessary preconditions get exposed.

**Constant-folding `SequenceEqual`.** The JIT can now fold a `string.Equals` or `ReadOnlySpan<T>.SequenceEqual` call whose two operands are both constants, replacing the byte-by-byte compare with the constant `true`/`false` result ([dotnet/runtime #121985](https://github.com/dotnet/runtime/pull/121985)). Thanks [@hez2010](https://github.com/hez2010) for the contribution.

Here's the simplest possible case — two string literals compared directly:

```csharp
public static string Str1 => "abcdef";
public static string Str2 => "bcdefg";

[MethodImpl(MethodImplOptions.NoInlining)]
public static bool CompareStr() => Str1.Equals(Str2);
```

Before, the JIT emitted the full character-by-character compare:

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

After, the comparison folds to a constant `false`:

```asm
       xor      eax, eax
       ret
```

In typical code, it is rare to compare two literals against each other since the result is known by the developer while writing the code. The optimization matters because *inlining causes constants to collide*. A helper like `IsAdmin(role) => role == "Admin"` looks like a comparison between a parameter and a literal, but when it gets inlined into a caller that passes another literal — say `IsAdmin("Guest")` — the JIT ends up with `"Guest" == "Admin"` in one method body and can fold it. The same pattern is what makes a magic-number check (`if (bytes.SequenceEqual(GZipMagic)) ...`) disappear when the surrounding wrapper is inlined and `bytes` resolves to a known constant span.

What counts as a constant for this folding is whatever the JIT's *value numbering* can prove is a known, immutable value. Value numbering is the JIT pass that assigns each expression a tag identifying which value it computes; expressions tagged with a known literal value can then be folded directly. For this optimization, the candidates are: string literals (`"abc"`), `const string` fields (the C# compiler inlines them as `ldstr` at every use site), and UTF-8 literals (`"PNG"u8`, which compile to a `ReadOnlySpan<byte>` over an RVA blob). `static readonly string` fields generally do *not* qualify — the reference isn't known until the static constructor runs, so value numbering treats them as opaque. Enums aren't relevant here because `SequenceEqual` and `string.Equals` don't take enum operands; enum `==` is plain integer compare and the JIT has folded those for years.

**Folding dominated redundant branches.** When an outer predicate is already implied by an inner branch, the outer check is now removed:

```csharp
if (x > 0)
{
    if (x > 1) S();  // outer `x > 0` is now folded away
}
```

This shows up naturally after inlining, where a caller's guard and a callee's guard land in the same body and one ends up implying the other ([dotnet/runtime #126587](https://github.com/dotnet/runtime/pull/126587)).

### Eliminating bounds checks after an empty-span guard

A familiar pattern — peek at the first element only if the span isn't empty — used to keep a bounds check on `span[0]` even though `!span.IsEmpty` had just been proven:

```csharp
if (!span.IsEmpty && span[0] == value)
{
    // ...
}
```

The JIT now picks up the `length != 0` assertion from the empty check and combines it with the knowledge that `length >= 0` is always true to conclude `length >= 1`. That is enough to prove the bounds check on `span[0]` always succeeds, so the check is dropped ([dotnet/runtime #126856](https://github.com/dotnet/runtime/pull/126856)). The JIT previously didn't understand that `length` cannot be negative (since `length` is a signed `int`) which required a `length > 0` check in addition to `length != 0`.

### Skipping a redundant test after a branch

When code picks a value in one branch and then immediately tests it, the second test is often redundant — whichever arm of the first branch ran has already determined the answer. The JIT can now short-circuit more of these cases by routing each predecessor directly to its known outcome:

```csharp
int x = condition ? 1 : 2;
if (x == 1) A(); else B();   // the second test is now skipped
```

The `condition`-true arm goes straight to `A()` and the false arm goes straight to `B()`, with no separate `x == 1` test in between, provided by [dotnet/runtime #126812](https://github.com/dotnet/runtime/pull/126812) and [dotnet/runtime #127103](https://github.com/dotnet/runtime/pull/127103).

## Hardware intrinsics and code generation

**F16C acceleration for `Half` ↔ `float` conversions on x64.** When the CPU supports F16C (most AVX2-capable hardware), conversions between `System.Half` and `float`/`double` now use the dedicated `vcvtph2ps` / `vcvtps2ph` instructions instead of helper calls. On a simple `HalfToSingle`/`SingleToHalf` benchmark, this collapses a stack-spill + helper invocation down to a register-only sequence ([dotnet/runtime #127094](https://github.com/dotnet/runtime/pull/127094)). An earlier broader change that introduced a `TYP_HALF` kind was reverted for ABI reasons ([dotnet/runtime #127042](https://github.com/dotnet/runtime/pull/127042)); the F16C work is the simpler, ABI-safe replacement.

**Better cost modeling for x86/x64 SIMD and floating-point.** The JIT's floating-point execution and size costs still reflected x87-era assumptions — back when FP went through a separate coprocessor stack and was much slower than today's SSE/AVX register operations — and most hardware-intrinsic nodes were stuck at `costEx=1, costSz=1`, which actively suppressed CSE and other optimizations. The costs now reflect modern reality, which lets the JIT make better decisions about hoisting and CSE around SIMD code ([dotnet/runtime #127048](https://github.com/dotnet/runtime/pull/127048)).

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

**`Comparer<T>` and `EqualityComparer<T>` are specialized in R2R.** The default `Comparer<T>.Default` / `EqualityComparer<T>.Default` cctor used `CreateInstanceForAnotherGenericParameter` reflection that R2R could not see, so callers fell back to the interpreter / JIT. R2R now generates a specialized helper in the image, mirroring the NativeAOT approach. The PR reports `System.Collections.ContainsFalse_Int32_.ImmutableList` running 20× faster, with about a 0.5% R2R image size increase ([dotnet/runtime #126204](https://github.com/dotnet/runtime/pull/126204)).

## Browser/WebAssembly CoreCLR enablement

CoreCLR continues its bring-up on WebAssembly. Highlights from this preview:

- **WebCIL V1 is the default for CoreCLR WASM builds.** The shared WebCIL header gained a `TableBase` field (28 → 32 bytes), with both Mono and CoreCLR readers accepting V0 and V1. Crossgen2's `WasmObjectWriter` produces V1 directly, and CoreCLR-flavored WASM SDK builds default `WasmWebcilVersion` to `V1` ([dotnet/runtime #126709](https://github.com/dotnet/runtime/pull/126709), [dotnet/runtime #126876](https://github.com/dotnet/runtime/pull/126876)).
- **Native re-link works for CoreCLR WASM apps.** The previous stub `WasmBuildApp` / `WasmTriggerPublishApp` targets are replaced with a full Emscripten-based pipeline that re-links `dotnet.native.wasm` from the runtime pack and lets apps include custom native code via `NativeFileReference` ([dotnet/runtime #126946](https://github.com/dotnet/runtime/pull/126946)).
- **Six previously-excluded test projects are back.** With native relink in place, `System.Runtime`, `System.Reflection.MetadataLoadContext`, `System.Runtime.Loader`, `System.Diagnostics.StackTrace`, and related tests build and run again on browser-CoreCLR ([dotnet/runtime #127147](https://github.com/dotnet/runtime/pull/127147), [dotnet/runtime #126996](https://github.com/dotnet/runtime/pull/126996)).
- **JS minification in Release builds and TypeScript type exports.** Browser CoreCLR Release builds ship minified JS ([dotnet/runtime #126877](https://github.com/dotnet/runtime/pull/126877)), and the public TypeScript surface now exports the asset-related types that were previously buried in internal type declarations ([dotnet/runtime #127084](https://github.com/dotnet/runtime/pull/127084)).
- **RyuJIT WASM codegen progress.** Many incremental codegen fixes landed for the WASM-targeting RyuJIT — bounds checks on `GT_INDEX_ADDR` ([dotnet/runtime #126111](https://github.com/dotnet/runtime/pull/126111)), block-store edge cases ([dotnet/runtime #125770](https://github.com/dotnet/runtime/pull/125770)), int-to-float casts ([dotnet/runtime #126209](https://github.com/dotnet/runtime/pull/126209)), `genStructReturn` ([dotnet/runtime #126326](https://github.com/dotnet/runtime/pull/126326)), funclet prolog/epilog and EH/unwind frames ([dotnet/runtime #126663](https://github.com/dotnet/runtime/pull/126663), [dotnet/runtime #127043](https://github.com/dotnet/runtime/pull/127043)), and multi-entry try regions ([dotnet/runtime #126374](https://github.com/dotnet/runtime/pull/126374)). WASM vector width is now declared as 128 bits ([dotnet/runtime #126375](https://github.com/dotnet/runtime/pull/126375)).
- **NativeAOT publish for WASM no longer drops package satellites.** Satellite assemblies coming from NuGet packages are now passed to ILC via `--satellite:` and pruned from the publish output, fixing localization for AOT-published apps that depend on packages like `System.CommandLine` ([dotnet/runtime #127089](https://github.com/dotnet/runtime/pull/127089)).

## Platform support: >1024 CPUs

- **More than 1024 CPUs.** A customer report uncovered that .NET fails to initialize on machines with more than 1024 logical processors because `sched_getaffinity` was being called with the default `cpu_set_t` (capped at 1024). The runtime now allocates the CPU set dynamically, the GC keeps a 1024-heap limit but lifts the CPU limit, and `MAX_SUPPORTED_CPUS` was renamed to `MAX_SUPPORTED_HEAPS` to reflect what it actually bounds ([dotnet/runtime #126763](https://github.com/dotnet/runtime/pull/126763)).

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
  - Linux `madvise()` advice values were being combined incorrectly with bitwise-OR in `GCToOSInterface::VirtualReset` ([dotnet/runtime #126780](https://github.com/dotnet/runtime/pull/126780)).
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
