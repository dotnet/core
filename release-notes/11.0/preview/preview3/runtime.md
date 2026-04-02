# .NET Runtime in .NET 11 Preview 3 - Release Notes

.NET 11 Preview 3 includes new .NET Runtime features & performance improvements:

- [Runtime Async: Enabled by Default](#runtime-async-enabled-by-default)
- [JIT Optimizations](#jit-optimizations)
- [AVX-512 Bit-Matrix Multiply (BMM) Intrinsics](#avx-512-bit-matrix-multiply-bmm-intrinsics)
- [NativeAOT: Unix `lib` Prefix for Native Libraries](#nativeaot-unix-lib-prefix-for-native-libraries)
- [NativeAOT: Fix Satellite Assembly Embedding on Publish](#nativeaot-fix-satellite-assembly-embedding-on-publish)
- [Android CoreCLR: Managed Stack Traces on Native Crash](#android-coreclr-managed-stack-traces-on-native-crash)

.NET Runtime updates in .NET 11:

- [What's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/runtime) documentation

<!-- API verification notes:
  Avx512Bmm — verified in Microsoft.NETCore.App.Ref@11.0.0-preview.3.26179.102
    System.Runtime.Intrinsics.X86.Avx512Bmm : class, inherits Avx512F
    Properties: IsSupported
    Methods: ReverseBits (Vector128<byte>, Vector256<byte>, Vector512<byte>)
             BitMultiplyMatrix16x16WithOrReduction (Vector256<ushort>, Vector512<ushort>)
             BitMultiplyMatrix16x16WithXorReduction (Vector256<ushort>, Vector512<ushort>)
  Sve2.Match — verified: 4 overloads (byte, sbyte, short, ushort)
  Sve2.NoMatch — verified: 4 overloads (byte, sbyte, short, ushort)
-->

## Runtime Async: Enabled by Default

Runtime async is now **enabled by default** for `net11.0` — the biggest runtime-async story in Preview 3. The `[RequiresPreviewFeatures]` attribute has been removed from the runtime-async APIs, so you no longer need `<EnablePreviewFeatures>true</EnablePreviewFeatures>` in your project file. ([dotnet/runtime#124488](https://github.com/dotnet/runtime/pull/124488))

In Preview 2 you needed both flags:

```diff
 <PropertyGroup>
   <Features>runtime-async=on</Features>
-  <EnablePreviewFeatures>true</EnablePreviewFeatures>
 </PropertyGroup>
```

Now only the compiler feature flag is required.

### NativeAOT support

Runtime async now works with NativeAOT. The feature switch is enabled for NativeAOT's `System.Private.CoreLib`, so async methods compiled with `runtime-async=on` are supported by the NativeAOT compiler and toolchain. ([dotnet/runtime#123952](https://github.com/dotnet/runtime/pull/123952))

### ReadyToRun (crossgen2) support

Crossgen2 can now emit runtime-async methods into ReadyToRun images, including async thunks and resumption stubs. This means runtime-async methods benefit from ahead-of-time compilation at startup. ([dotnet/runtime#124203](https://github.com/dotnet/runtime/pull/124203))

Crossgen2 also enables devirtualization of async virtual and interface method calls. The compiler applies an async-aware resolution algorithm that resolves virtual calls through the async variant table — the same optimization the JIT applies at runtime, now applied ahead of time. ([dotnet/runtime#125420](https://github.com/dotnet/runtime/pull/125420))

### Continuation reuse

Two JIT optimizations reduce allocation pressure in runtime-async methods:

1. **Continuation instance reuse** — When an async method suspends multiple times, the runtime now reuses a single continuation object instead of allocating a new one at each suspension point. The continuation layout stores an offset for the return value, enabling sharing across different await shapes. ([dotnet/runtime#125556](https://github.com/dotnet/runtime/pull/125556))

2. **Skip saving unmutated locals** — When reusing a continuation, the JIT skips storing locals that have not changed since the previous suspension. This reduces write barriers and avoids redundant saves. ([dotnet/runtime#125615](https://github.com/dotnet/runtime/pull/125615))

### Architecture support

Runtime async was extended to LoongArch64 ([dotnet/runtime#125114](https://github.com/dotnet/runtime/pull/125114), thank you [@shushanhf](https://github.com/shushanhf)) and RISC-V64 ([dotnet/runtime#125446](https://github.com/dotnet/runtime/pull/125446), thank you [@tmds](https://github.com/tmds)).

---

## JIT Optimizations

### Convert multi-target switches to branchless checks

The JIT now converts eligible `switch` statements with multiple targets that produce the same result into branchless range checks. This is common in pattern matching with `is A or B or C` patterns. ([dotnet/runtime#124567](https://github.com/dotnet/runtime/pull/124567))

For example, checking `x is 0 or 1 or 2 or 3 or 4` previously generated a branch table. The JIT now emits:

```asm
; Before: jump table with 5 entries
       cmp      ecx, 4
       ja       NOT_MATCH
       ; ... jump table lookup ...

; After: single range comparison
       cmp      ecx, 4
       setbe    al
       movzx    rax, al
```

### Eliminate redundant bounds checks for index-from-end

After a successful bounds check for `arr[^N]`, the JIT now proves that `arr[^(N-1)]` through `arr[^1]` are also in range, eliminating their bounds checks. This benefits code that accesses the last several elements of an array or span. ([dotnet/runtime#124571](https://github.com/dotnet/runtime/pull/124571))

### Faster `uint` to floating-point casts on pre-AVX-512 x86

On x86 CPUs without AVX-512, `(float)someUint` and `(double)someUint` previously called a helper function. The JIT now emits inline vectorized code for these conversions, avoiding the call overhead entirely. ([dotnet/runtime#124114](https://github.com/dotnet/runtime/pull/124114))

Thank you [@saucecontrol](https://github.com/saucecontrol) for this contribution!

### Lower CSE promotion threshold

Common sub-expression elimination (CSE) now promotes expressions more aggressively by lowering the minimum reference-count threshold. Expressions that previously fell just below the cutoff — especially in loop-heavy code — now benefit from CSE. ([dotnet/runtime#125028](https://github.com/dotnet/runtime/pull/125028))

### Improved range analysis for checked bounds

Global assertion propagation now tracks tighter ranges for values used in checked arithmetic and bounds checks. This enables the JIT to remove more redundant range checks in indexed loops. ([dotnet/runtime#125056](https://github.com/dotnet/runtime/pull/125056))

### Range check cloning for return blocks

The JIT now applies range-check cloning to loops where the exit block is a `return`. Previously only loops exiting to fall-through blocks were eligible. This extends the fast-path/slow-path splitting to more loop shapes. ([dotnet/runtime#124705](https://github.com/dotnet/runtime/pull/124705))

### LSRA improvements

Two register-allocator improvements reduce unnecessary spills:

- Def/use conflicts are handled less conservatively — when a register is defined and immediately used by overlapping intervals, LSRA avoids unnecessary moves. ([dotnet/runtime#125214](https://github.com/dotnet/runtime/pull/125214))
- Single-def, single-use intervals are preferenced away from registers that are killed at call sites, reducing reload frequency. ([dotnet/runtime#125219](https://github.com/dotnet/runtime/pull/125219))

### Arm64 codegen improvements

- **Remove widening casts before truncating stores** — sequences like `ldrh` → `uxtb` → `strb` now fold to a single `ldrb`. ([dotnet/runtime#123546](https://github.com/dotnet/runtime/pull/123546), thank you [@a74nh](https://github.com/a74nh))
- **Fold negative variable comparisons** — `cmp x0, #0` / `blt` sequences for negative-check patterns now use `tbnz` (test bit and branch). ([dotnet/runtime#124332](https://github.com/dotnet/runtime/pull/124332), thank you [@a74nh](https://github.com/a74nh))
- **Fix `ands`/`bics` for unsigned constants** — constant-zero comparisons with unsigned values now generate correct flag-setting instructions. ([dotnet/runtime#124601](https://github.com/dotnet/runtime/pull/124601), thank you [@a74nh](https://github.com/a74nh))

### Normalize ConditionalSelect and BlendVariable

`ConditionalSelect` and `BlendVariable` intrinsics now produce consistent codegen regardless of how the condition mask is formed — whether from comparisons, constants, or other sources. This resolves cases where semantically identical inputs produced different instruction sequences. ([dotnet/runtime#123146](https://github.com/dotnet/runtime/pull/123146), thank you [@alexcovington](https://github.com/alexcovington))

---

## AVX-512 Bit-Matrix Multiply (BMM) Intrinsics

New `Avx512Bmm` APIs expose the AVX-512 bit-matrix multiply instructions for GF(2) operations and bit reversal. These are useful for cryptography, error-correction codes, and data-transformation pipelines that need fast bitwise linear algebra. ([dotnet/runtime#124804](https://github.com/dotnet/runtime/pull/124804))

Thank you [@BoyBaykiller](https://github.com/BoyBaykiller) for this contribution!

```csharp
using System.Runtime.Intrinsics;
using System.Runtime.Intrinsics.X86;

if (Avx512Bmm.IsSupported)
{
    Vector256<ushort> a = Vector256.Create<ushort>(0x00FF);
    Vector256<ushort> b = Vector256.Create<ushort>(0xFF00);
    Vector256<ushort> c = Vector256.Create<ushort>(0);

    // GF(2) bit-matrix multiply with OR reduction
    Vector256<ushort> orResult = Avx512Bmm.BitMultiplyMatrix16x16WithOrReduction(a, b, c);

    // GF(2) bit-matrix multiply with XOR reduction
    Vector256<ushort> xorResult = Avx512Bmm.BitMultiplyMatrix16x16WithXorReduction(a, b, c);

    // Reverse all bits in each byte
    Vector256<byte> data = Vector256.Create<byte>(0b10110001);
    Vector256<byte> reversed = Avx512Bmm.ReverseBits(data);
}
```

All methods are available in `Vector128`, `Vector256`, and `Vector512` widths.

---

## NativeAOT: Unix `lib` Prefix for Native Libraries

When publishing a native library (not an executable) with NativeAOT on Unix, the output file now uses the conventional `lib` prefix by default. A project named `MyLib` produces `libMyLib.so` on Linux and `libMyLib.dylib` on macOS, matching what tools like `dlopen` and linkers expect. ([dotnet/runtime#124611](https://github.com/dotnet/runtime/pull/124611))

To opt out:

```xml
<PropertyGroup>
  <UseNativeLibPrefix>false</UseNativeLibPrefix>
</PropertyGroup>
```

---

## NativeAOT: Fix Satellite Assembly Embedding on Publish

`dotnet publish` with NativeAOT previously included satellite assemblies as separate files even though they were already embedded in the native binary. This caused unnecessary duplication in the publish output. The fix removes the extra copies. ([dotnet/runtime#124192](https://github.com/dotnet/runtime/pull/124192))

---

## Android CoreCLR: Managed Stack Traces on Native Crash

On Android, CoreCLR now logs managed call stacks when a native crash occurs and a dump file is not available. This makes it far easier to diagnose crashes from tombstone logs, which typically lack usable runtime symbols. ([dotnet/runtime#123824](https://github.com/dotnet/runtime/pull/123824))

---

<!-- Filtered features:
  - cDAC diagnostics (area-Diagnostics-coreclr): internal diagnostics infrastructure. ~78 PRs including
    SOSDacImpl, cDAC data descriptor changes, contract implementations. Developers do not interact with
    these APIs directly.
  - Interpreter progress (area-CodeGen-Interpreter-coreclr): CoreCLR interpreter bring-up for WASM/iOS.
    ~13 PRs for Mono→CoreCLR migration. Implementation detail, developers do not target the interpreter.
  - Pre-compile interop type maps (dotnet/runtime#124352): COM interop startup optimization via
    crossgen2. Very narrow audience — only COM-heavy apps on Windows see benefit.
  - Profile optimization for single-file (dotnet/runtime#124501): engineering fix to support
    optimization profiles in single-file deployment. Two-sentence item.
  - EBR in VM HashMap (dotnet/runtime#124307, #124822): replaced GCX_COOP transitions with
    epoch-based reclamation in internal hash tables. Invisible latency improvement.
  - Delete ArrayEEClass (dotnet/runtime#124944): internal VM cleanup, compute multidim array rank from
    BaseSize. No user-visible change.
  - Rework tiering/versioning rules (dotnet/runtime#125243): internal simplification of JIT tiering
    logic. No observable behavior change for users.
  - WASM RyuJIT bring-up (~30 PRs): WebAssembly CoreCLR JIT infrastructure. Not ready for general use.
  - OpenBSD bring-up (~8 PRs): platform enablement work. Not yet a supported platform.
  - UCO conversions (~10 PRs): converting MethodDescCallSite calls to UnmanagedCallersOnly in VM.
    Internal refactoring only.
-->

## Bug Fixes

### JIT

- Fixed reordering of inlinee return expressions with async save/restore that could produce incorrect results. ([dotnet/runtime#125044](https://github.com/dotnet/runtime/pull/125044))
- Fixed invalid IR and incorrect block weights in if-conversion optimization. ([dotnet/runtime#125072](https://github.com/dotnet/runtime/pull/125072), thank you [@SingleAccretion](https://github.com/SingleAccretion))
- Fixed patchpoint info out-of-bounds read for special OSR locals. ([dotnet/runtime#125378](https://github.com/dotnet/runtime/pull/125378))
- Fixed `fgFoldCondToReturnBlock` for multi-statement return blocks. ([dotnet/runtime#124642](https://github.com/dotnet/runtime/pull/124642), thank you [@SingleAccretion](https://github.com/SingleAccretion))
- Fixed missing write barrier in static constructors of ref structs. ([dotnet/runtime#125418](https://github.com/dotnet/runtime/pull/125418))

### VM

- Fixed race condition leak in `RegisterResumptionStub` for runtime-async resumption stubs. ([dotnet/runtime#125407](https://github.com/dotnet/runtime/pull/125407))
- Fixed `CrstILStubGen`/`CrstLoaderAllocatorReferences` lock level violation that could cause deadlocks under contention. ([dotnet/runtime#125675](https://github.com/dotnet/runtime/pull/125675))
- Fixed reentrant `Monitor.Wait` causing hangs in certain threading scenarios. ([dotnet/runtime#126071](https://github.com/dotnet/runtime/pull/126071))

### NativeAOT

- Fixed 4 bugs in the TypePreinit IL interpreter affecting static constructor evaluation. ([dotnet/runtime#125947](https://github.com/dotnet/runtime/pull/125947))
- Fixed static virtual dispatch resolution for default interface methods with C# DIM. ([dotnet/runtime#125205](https://github.com/dotnet/runtime/pull/125205))
- Fixed crossgen2 crash on Apple mobile for `InstantiatedType` token resolution in async methods. ([dotnet/runtime#125444](https://github.com/dotnet/runtime/pull/125444))

### Hosting

- Fixed `dotnet-pgo dump` crash when `CallWeights` are present in profile data. ([dotnet/runtime#125936](https://github.com/dotnet/runtime/pull/125936), thank you [@filipnavara](https://github.com/filipnavara))
- Fixed crossgen2 `JitHost` OOM crash by throwing on allocation failure instead of returning null. ([dotnet/runtime#125422](https://github.com/dotnet/runtime/pull/125422))

---

## Community Contributors

Thank you contributors! ❤️

- [@a74nh](https://github.com/a74nh)
- [@alexcovington](https://github.com/alexcovington)
- [@am11](https://github.com/am11)
- [@benaadams](https://github.com/benaadams)
- [@BoyBaykiller](https://github.com/BoyBaykiller)
- [@filipnavara](https://github.com/filipnavara)
- [@FixBo](https://github.com/FixBo)
- [@gbalykov](https://github.com/gbalykov)
- [@gwr](https://github.com/gwr)
- [@jonathandavies-arm](https://github.com/jonathandavies-arm)
- [@LuckyXu-HF](https://github.com/LuckyXu-HF)
- [@mrvoorhe](https://github.com/mrvoorhe)
- [@Pietrodjaowjao](https://github.com/Pietrodjaowjao)
- [@saucecontrol](https://github.com/saucecontrol)
- [@sethjackson](https://github.com/sethjackson)
- [@shushanhf](https://github.com/shushanhf)
- [@SingleAccretion](https://github.com/SingleAccretion)
- [@SkyShield](https://github.com/SkyShield)
- [@snickolls-arm](https://github.com/snickolls-arm)
- [@tmds](https://github.com/tmds)
- [@tpa95](https://github.com/tpa95)
- [@ylpoonlg](https://github.com/ylpoonlg)
- [@yykkibbb](https://github.com/yykkibbb)
