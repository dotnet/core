# .NET Runtime in .NET 11 Preview 7 - Release Notes

.NET 11 Preview 7 includes new runtime features and performance work:

- [Runtime-async tiering and tail-await optimizations](#runtime-async-tiering-and-tail-await-optimizations)
- [CoreCLR on WebAssembly runs the libraries test suite](#coreclr-on-webassembly-runs-the-libraries-test-suite)
- [JIT and code generation](#jit-and-code-generation)
- [NativeAOT](#nativeaot)
- [Runtime diagnostics](#runtime-diagnostics)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET Runtime updates in .NET 11:

- [What's new in the .NET 11 runtime](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/runtime)

## Runtime-async tiering and tail-await optimizations

Runtime-async — the runtime's built-in implementation of `async`/`await` — continues to close the gap with (and now beat) the compiler-generated state-machine model.

### Tiered compilation for async versions

Async versions of methods are now compiled through the tiered compilation pipeline ([dotnet/runtime #129985](https://github.com/dotnet/runtime/pull/129985)). Async methods previously bypassed tiering and always ran the tier0 code, which was optimized for compilation speed rather than steady-state throughput. Under load this showed up in traces as a large amount of allocation until everything warmed up.

Two tier0 changes make the transition cheaper as well as unlocking the tier1 wins:

- The tail-await optimization now runs in tier0 ([dotnet/runtime #130181](https://github.com/dotnet/runtime/pull/130181)). On the TechEmpower `platform-json` benchmark, the max allocation rate during warmup dropped from 110,580,952 B/sec to 8,030,616 B/sec.
- The JIT can inline `AsyncHelpers.TransparentAwait`, so a hot `await` on an already-completed `Task` folds into a check on the task's status flags instead of a helper call ([dotnet/runtime #130482](https://github.com/dotnet/runtime/pull/130482)). A tight loop that awaits an already-completed `Task` 100,000,000 times went from ~191 ms to ~32 ms.

### Task and ValueTask factory intrinsics and adaptation

The JIT now recognizes common `Task`/`ValueTask` factory methods when they appear in an async version and folds them into direct fast paths ([dotnet/runtime #129810](https://github.com/dotnet/runtime/pull/129810)). This covers `Task.FromResult`, `Task.CompletedTask`, `ValueTask.FromResult`, `ValueTask.CompletedTask`, `default(ValueTask)`, `new ValueTask()`, and `new ValueTask<T>(T)`.

Async-adapting wrappers between `Task` and `ValueTask` are also recognized and unwrapped ([dotnet/runtime #130081](https://github.com/dotnet/runtime/pull/130081)):

```csharp
[MethodImpl(MethodImplOptions.NoInlining)]
private static ValueTask TestTaskToValueTask() => new ValueTask(TestTask());

[MethodImpl(MethodImplOptions.NoInlining)]
private static async Task TestTask() => await Task.Yield();
```

The wrapping `new ValueTask(...)` used to compile to 115 bytes with a full frame, a `ValueTask` constructor call, and a `TransparentAwaitWithResult` helper call. It now compiles to 29 bytes — a straight tail call into `TestTask()` followed by a status check.

### Implicit tailcalls for tail-awaits and `await Task.Yield()`

Implicit tailcalls are re-enabled from async methods when the callee's returned task is what the method itself would return ([dotnet/runtime #129255](https://github.com/dotnet/runtime/pull/129255)). A method that dispatches `return b ? Bar() : Baz();` between two `async Task` methods drops from 52 bytes and 19 instructions to 20 bytes and 6 instructions, with both branches becoming `tail.jmp`.

`await Task.Yield()` in a runtime-async method now skips the internal thread-pool box allocation the same way `IStateMachineBoxAwareAwaiter` already lets the state-machine model skip it ([dotnet/runtime #130170](https://github.com/dotnet/runtime/pull/130170)). A benchmark that runs `await Task.Yield()` 10,000,000 times in a loop dropped from ~723 ms to ~534 ms — matching the compiler-generated state-machine time.

`await` also now correctly saves and restores async contexts for `ValueTask`-returning methods; a flag check bug was causing this to be skipped ([dotnet/runtime #129890](https://github.com/dotnet/runtime/pull/129890)).

## CoreCLR on WebAssembly runs the libraries test suite

.NET 11 is bringing CoreCLR to WebAssembly with a portable interpreter-plus-R2R model that reuses RyuJIT for ahead-of-time codegen. In Preview 6 this configuration could start up; in Preview 7 it runs the libraries test suite end to end.

The work behind that milestone: WebAssembly exception handling moved to the standardized `exnref` proposal (`try_table`/`throw_ref`) across Emscripten, wasm-opt, and the jiterpreter ([dotnet/runtime #129851](https://github.com/dotnet/runtime/pull/129851), [dotnet/runtime #130550](https://github.com/dotnet/runtime/pull/130550)); RyuJIT gained SIMD lightup for most `PackedSimd` intrinsics, inline P/Invoke, and a batch of R2R codegen fixes; Composite ReadyToRun now emits per-assembly stubs as webcil-in-wasm ([dotnet/runtime #130394](https://github.com/dotnet/runtime/pull/130394)); a CoreCLR-WASI corehost (`wasihost`) enables the WASI library-test leg ([dotnet/runtime #130816](https://github.com/dotnet/runtime/pull/130816)); and cDAC learned WebAssembly stack walking so diagnostic tools can traverse a WASM CoreCLR process ([dotnet/runtime #130988](https://github.com/dotnet/runtime/pull/130988)).

The Emscripten toolchain moved to 6.0.2 and the browser runtime is relinked with `-O3` for a smaller, faster binary ([dotnet/runtime #130614](https://github.com/dotnet/runtime/pull/130614), [dotnet/runtime #130772](https://github.com/dotnet/runtime/pull/130772)).

## JIT and code generation

### AVX-VNNI-512 hardware intrinsics

`System.Runtime.Intrinsics.X86.AvxVnni.V512` exposes the AVX-512 forms of the AVX-VNNI multiply-add instructions ([dotnet/runtime #128365](https://github.com/dotnet/runtime/pull/128365)). CPUID `AVX512-VNNI` is wired into the JIT ISA flag, and the codegen emits the EVEX-512 encodings of `VPDPBUSD`, `VPDPBUSDS`, `VPDPWSSD`, and `VPDPWSSDS`.

```csharp
using System.Runtime.Intrinsics;
using System.Runtime.Intrinsics.X86;

if (AvxVnni.V512.IsSupported)
{
    Vector512<int>   acc = Vector512<int>.Zero;
    Vector512<byte>  a   = Vector512.Create((byte)1);
    Vector512<sbyte> b   = Vector512.Create((sbyte)2);

    // One VPDPBUSD zmm, zmm, zmm
    Vector512<int> result = AvxVnni.V512.MultiplyWideningAndAdd(acc, a, b);
}
```

Thanks [@jamesburton](https://github.com/jamesburton) for the contribution.

### Arm64: FEAT_CSSC `cnt`/`ctz` for `PopCount` and `TrailingZeroCount`

On Armv8.9/Armv9.4 with FEAT_CSSC (Common Short Sequence Compression), `BitOperations.PopCount` and `BitOperations.TrailingZeroCount` compile to a single scalar `cnt`/`ctz` instruction instead of moving through the SIMD unit ([dotnet/runtime #130332](https://github.com/dotnet/runtime/pull/130332)):

```asm
; PopCount(uint)
-   movi    v16.8b, #0
-   ins     v16.s[0], w0
-   cnt     v16.8b, v16.8b
-   addv    b16, v16.8b
-   umov    w0, v16.s[0]
+   cnt     w0, w0

; TrailingZeroCount(uint)
-   rbit    w0, w0
-   clz     w0, w0
+   ctz     w0, w0
```

### Coalesce adjacent constant-address stores

The JIT's store-coalescing pass now recognizes `STOREIND` nodes whose address is an absolute non-relocatable constant, so adjacent writes to non-GC static struct fields fuse into a single store ([dotnet/runtime #130107](https://github.com/dotnet/runtime/pull/130107)):

```csharp
private struct S2 { public int A, B; }
private static S2 s_static2;

[MethodImpl(MethodImplOptions.NoInlining | MethodImplOptions.AggressiveOptimization)]
private static void Test()
{
    s_static2.A = 1;
    s_static2.B = 2;
}
```

```asm
-   mov  rax, 0x1E049543570      ; data for s_static2
-   mov  dword ptr [rax], 1
-   mov  rax, 0x1E049543574
-   mov  dword ptr [rax], 2
+   mov  rax, 0x200000001
+   mov  rcx, 0x1F549543570
+   mov  qword ptr [rcx], rax
```

Store-coalescing also now folds the non-GC field stores produced by struct copies, so an `Int128` field assignment becomes a single 16-byte `vmovups` instead of two 8-byte writes ([dotnet/runtime #130535](https://github.com/dotnet/runtime/pull/130535)).

### Devirtualize `Activator.CreateInstance<T>` and instantiating-stub virtuals

The JIT now knows that `Activator.CreateInstance<T>()` — and the constrained call the compiler emits for `where T : new()` — always produces an exact `T`, so subsequent virtual calls on the fresh instance can be devirtualized ([dotnet/runtime #130074](https://github.com/dotnet/runtime/pull/130074)):

```csharp
static T Get<T>() where T : new() => new T();

class A { public virtual int Value => 1; }
class B : A { public override int Value => 2; }

Console.WriteLine(Get<A>().Value); // Devirtualized to A.get_Value
Console.WriteLine(Get<B>().Value); // Devirtualized to B.get_Value
```

Thanks [@hez2010](https://github.com/hez2010) for the contribution.

Devirtualization also now handles virtual methods whose call target needs an instantiating stub — both shared generic virtual methods that don't need a runtime lookup and generic interface methods with default implementations ([dotnet/runtime #128702](https://github.com/dotnet/runtime/pull/128702)). Non-shared GVM devirtualization is wired up for NativeAOT as well ([dotnet/runtime #130202](https://github.com/dotnet/runtime/pull/130202)). Thanks [@hez2010](https://github.com/hez2010) for both changes.

### Fold `insertps` chains that source scalar extractions

On x86, chains that build a vector by inserting a scalar extracted from another vector now fold into a single `insertps` reading the source lane directly ([dotnet/runtime #130422](https://github.com/dotnet/runtime/pull/130422)):

```csharp
// Insert lane idx1 of `src` into lane idx2 of `dst`
Vector128<float> r = Sse41.Insert(dst, Vector128.CreateScalarUnsafe(src.GetElement(idx1)), idx2);
```

`insertps` operates on the low 128 bits of its source register and encodes the source lane in bits 6–7 of the `imm8`, so this fold is valid for any 4-byte element type, and for source vectors of 128, 256, or 512 bits (as long as the extracted lane is one of the first four). The separate `movshdup`/`unpckhps`/`shufps` used to materialize the scalar is eliminated.

### Fold trivial redundant comparisons on loop induction variables

Loop optimizations now propagate simple non-negativity facts about induction variables and remove branches that are always taken ([dotnet/runtime #130205](https://github.com/dotnet/runtime/pull/130205)):

```csharp
for (int i = 0; i < 100; i++)
{
    if (i >= 0) // always true
        Console.WriteLine("Hi");
}
```

The `i >= 0` test and its side branch are removed entirely; the compiled loop becomes a straight-line body plus an `inc`/`cmp`/`jl` back-edge.

### Saturating `float`/`double` conversions to small integral types

Unchecked `float`/`double` conversions to `sbyte`, `byte`, `short`, `ushort`, and `char` now saturate at the destination type's bounds ([dotnet/runtime #128604](https://github.com/dotnet/runtime/pull/128604)). Previously `(short)(double)32768.000000000007` produced `-32768` because the JIT expanded the cast as `R → int → smallT`; the inner `R → int` saturated, but the outer `int → smallT` only truncated the low bits. The fix covers xarch, x86, arm64, riscv64, LoongArch64, arm32, and WebAssembly, plus the CoreCLR interpreter VM helper and the NativeAOT type preinitializer.

### Tier0 `Enum.HasFlag` box elision

`Enum.HasFlag` boxes could be elided in tier1 but not in tier0, because the tier0 "reusable box temp" carve-out for integral boxes contained an inverted condition that excluded actual enums — the case it was written for ([dotnet/runtime #130590](https://github.com/dotnet/runtime/pull/130590)). Enum boxes now get an exact-typed temp in tier0, so `enumValue.HasFlag(flag)` folds to a couple of `and`/`cmp` instructions instead of allocating and calling.

### Remove the 128-bit limit on `Vector<T>` for Arm64 SVE

When SVE is available, `Vector<T>` can now report its actual width (up to the SVE vector length) rather than being capped at 128 bits ([dotnet/runtime #129852](https://github.com/dotnet/runtime/pull/129852)). Combined with Preview 6's by-reference calling convention for `Vector<T>` under SVE, `Vector<T>`-based code paths can now match native SVE performance on hardware with wide vectors. Thanks [@snickolls-arm](https://github.com/snickolls-arm) for the contribution.

### More if-conversion shapes are optimized

The JIT's if-conversion pass allows more shapes to be considered — `GT_SELECT` for floats is permitted through optimization (though not into codegen yet), simple constant folding is applied to conditional selects, and the 32-bit bailout moves after optimizations run so that partial improvements stick even when the final select can't be emitted ([dotnet/runtime #128449](https://github.com/dotnet/runtime/pull/128449)). Thanks [@BoyBaykiller](https://github.com/BoyBaykiller) for the contribution.

## NativeAOT

### Faster generic virtual method dispatch

Generic virtual method (GVM) dispatch now goes through the same dispatch cell infrastructure as interface dispatch ([dotnet/runtime #129609](https://github.com/dotnet/runtime/pull/129609)):

| Callsite kind        | Before        | After         |
|----------------------|--------------:|--------------:|
| Monomorphic GVM      | 2.45 ns/call | 1.74 ns/call  |
| Polymorphic GVM      | 2.45 ns/call | 2.10 ns/call  |

GVM methods are also no longer implicitly reflection-visible via the `LDTOKEN` used as an implementation detail, and the internal `RuntimeMethodHandle` for async variants is no longer exposed.

### Faster ILC compiles

Virtual method resolution in the ILC compiler now caches slot enumerations and resolutions ([dotnet/runtime #130405](https://github.com/dotnet/runtime/pull/130405)). Compiling `dotnet new webapiaot` dropped from 7.4 seconds to 6.2 seconds; the `DynamicGenerics` test compile dropped from 2.45 seconds to 2.09 seconds.

### `Assembly.GetCallingAssembly` on NativeAOT

`Assembly.GetCallingAssembly()` now works under Native AOT, walking the stack trace data to find the calling assembly ([dotnet/runtime #129963](https://github.com/dotnet/runtime/pull/129963)). Because the implementation depends on stack trace data being available, calling the API without stack trace data throws — see the [Breaking changes](#breaking-changes) section below.

### Arm64 pointer authentication for NativeAOT

The final piece of `PAC-RET` (return address pointer authentication) support for Arm64 landed in NativeAOT ([dotnet/runtime #128950](https://github.com/dotnet/runtime/pull/128950)). PAC-RET signs return addresses on function entry and authenticates them on return, making stack-based ROP attacks substantially harder on Arm64 hardware that supports the FEAT_PAuth extension. Thanks [@SwapnilGaikwad](https://github.com/SwapnilGaikwad) for the contribution.

### Runtime CPU feature detection via `elf_aux_info`

FreeBSD/arm64 NativeAOT smoke tests were aborting with "The current CPU is missing one or more of the following instruction sets: AdvSimd" because the FreeBSD path had no way to query the CPU's ISA. FreeBSD's `elf_aux_info` API is now used to detect Arm64 CPU features ([dotnet/runtime #130901](https://github.com/dotnet/runtime/pull/130901)), fixing that regression. Thanks [@am11](https://github.com/am11) for the contribution.

## Runtime diagnostics

The async profiler now instruments the compiler-generated state-machine async path in addition to the runtime-async path, so both async models emit a uniform event stream and profiling tools can follow async causality chains without knowing which model produced them ([dotnet/runtime #129043](https://github.com/dotnet/runtime/pull/129043)). Coverage extends to pooled `ValueTask` methods and custom awaiters, and the per-suspension dispatcher allocation is eliminated on the default `Task`/`ValueTask` path ([dotnet/runtime #129801](https://github.com/dotnet/runtime/pull/129801), [dotnet/runtime #130297](https://github.com/dotnet/runtime/pull/130297), [dotnet/runtime #130299](https://github.com/dotnet/runtime/pull/130299), [dotnet/runtime #130877](https://github.com/dotnet/runtime/pull/130877)).
Additional runtime diagnostics improvements:

- The CoreCLR interpreter can now log its IR ranges to the perf map when `DOTNET_PerfMapEnabled=1` and `DOTNET_PerfMapStubGranularity=2` are set, enabling profiler tools to attribute interpreter samples to specific methods ([dotnet/runtime #129989](https://github.com/dotnet/runtime/pull/129989)).
- `CORECLR_NOTIFICATION_PROFILERS` no longer drops the final entry when the list is not `;`-terminated ([dotnet/runtime #130584](https://github.com/dotnet/runtime/pull/130584)).

## Breaking changes

- **`Assembly.GetCallingAssembly` on Native AOT requires stack trace data.** As part of implementing `Assembly.GetCallingAssembly` for Native AOT ([dotnet/runtime #129963](https://github.com/dotnet/runtime/pull/129963)), the API now throws when stack trace data is not available (including under F5 debugging on CoreCLR, for parity). Previously it always threw on Native AOT. Apps that publish with `StackTraceSupport=false` will not be able to call `Assembly.GetCallingAssembly` on Native AOT.

## Bug fixes

- **GC / thread state**
  - Fixed cgroup v2 memory limit extraction to stop walking past the root cgroup mount, which caused a NativeAOT app to crash in environments (e.g. Google Colab) where the process is assigned to the root cgroup ([dotnet/runtime #130377](https://github.com/dotnet/runtime/pull/130377)).
  - `GCHandle` assignments now publish with release semantics, so weak-reference readers on weakly ordered Arm64 hardware can no longer observe a partially initialized object through a handle. This showed up as rare `NullReferenceException`s from `Regex.Replace` ([dotnet/runtime #130213](https://github.com/dotnet/runtime/pull/130213)). Thanks [@BradBarnich](https://github.com/BradBarnich)!
  - Fixed a thread-static bootstrap infinite recursion on WebAssembly ([dotnet/runtime #131120](https://github.com/dotnet/runtime/pull/131120)).
- **JIT / code generation**
  - Fixed incorrect bounds-check removal for `Phi` indices whose minimum was negative ([dotnet/runtime #130217](https://github.com/dotnet/runtime/pull/130217)).
  - Fixed range-check monotonicity for multiplication ([dotnet/runtime #130426](https://github.com/dotnet/runtime/pull/130426)).
  - Fixed stale value numbers in the redundant-branch dominating-branch simplification ([dotnet/runtime #129914](https://github.com/dotnet/runtime/pull/129914)).
  - Fixed a GC hole in large stack-target struct block copies ([dotnet/runtime #130352](https://github.com/dotnet/runtime/pull/130352)).
  - Fixed x86 codegen non-determinism across host architectures ([dotnet/runtime #130059](https://github.com/dotnet/runtime/pull/130059)).
  - Fixed folding of scalar/vector `CompareScalar` `True`/`False` intrinsic constants ([dotnet/runtime #130222](https://github.com/dotnet/runtime/pull/130222)).
  - Fixed two latent `HWIntrinsic` miscompiles and side-effect reordering when folding a constant zero-mask `BlendVariable` ([dotnet/runtime #130832](https://github.com/dotnet/runtime/pull/130832), [dotnet/runtime #130946](https://github.com/dotnet/runtime/pull/130946)).
  - Folded floating-point comparisons against a constant `NaN` in morph ([dotnet/runtime #130838](https://github.com/dotnet/runtime/pull/130838)).
- **Runtime-async**
  - Preview 6 disabled runtime-async compilation of synchronous `Task`-returning methods in crossgen2 to fix a correctness bug; that code path is re-enabled with the underlying fix ([dotnet/runtime #129474](https://github.com/dotnet/runtime/pull/129474), [dotnet/runtime #129884](https://github.com/dotnet/runtime/pull/129884)).
  - Fixed the async resumption stub with `byref` parameters ([dotnet/runtime #129999](https://github.com/dotnet/runtime/pull/129999)).
  - Blocked async version inlining for P/Invokes and fixed generation of instantiating stubs for the target encoded in async return-dropping thunk IL ([dotnet/runtime #129797](https://github.com/dotnet/runtime/pull/129797), [dotnet/runtime #130424](https://github.com/dotnet/runtime/pull/130424)).
- **NativeAOT**
  - Fixed `NativeAOT` reflection invoke copyback of ref parameters ([dotnet/runtime #130065](https://github.com/dotnet/runtime/pull/130065)).
  - Fixed the reverse delegate stub signature when runtime marshalling is disabled ([dotnet/runtime #130239](https://github.com/dotnet/runtime/pull/130239)).
  - Fixed assembly name mangling collisions that could produce clashing symbol names in the compiled output ([dotnet/runtime #130012](https://github.com/dotnet/runtime/pull/130012)).
  - Aligned the NativeAOT array element size limit with CoreCLR ([dotnet/runtime #130019](https://github.com/dotnet/runtime/pull/130019)).
  - Emitted correct ELF symbol types for data in NativeAOT objects, so tools that inspect the output don't misclassify data symbols as code ([dotnet/runtime #129950](https://github.com/dotnet/runtime/pull/129950)).
- **Interop / marshalling**
  - `Delegate.GetHashCode` now returns the same value for type-equivalent delegates that point to the same method, fixing a violation of the `Equals`/`GetHashCode` contract discovered while reviewing [dotnet/runtime #99200](https://github.com/dotnet/runtime/pull/99200) ([dotnet/runtime #130542](https://github.com/dotnet/runtime/pull/130542)).
  - Fixed HFA/HVA by-value argument marshalling on Arm64 in `CallTargetWorker` ([dotnet/runtime #130580](https://github.com/dotnet/runtime/pull/130580)).
  - Pinned blittable layout classes in NativeAOT marshalling to keep them stable across GC ([dotnet/runtime #130279](https://github.com/dotnet/runtime/pull/130279)).
- **WebAssembly / Mono**
  - Fixed reverse-P/Invoke thunk key computation for nested `[UnmanagedCallersOnly]` types on both CoreCLR and Mono ([dotnet/runtime #130740](https://github.com/dotnet/runtime/pull/130740)).
  - Fixed Mono `[UnmanagedCallersOnly]` exports with more than 8 arguments and P/Invokes with 64-bit `enum` arguments on WASM ([dotnet/runtime #131058](https://github.com/dotnet/runtime/pull/131058), [dotnet/runtime #131021](https://github.com/dotnet/runtime/pull/131021)).
  - Fixed AOT + `BlazorWebAssemblyLazyLoad` startup crash ([dotnet/runtime #131020](https://github.com/dotnet/runtime/pull/131020)).
  - Fixed a Mono interpreter crash when `MethodImpl.override` was used on portable entry points ([dotnet/runtime #126124](https://github.com/dotnet/runtime/pull/126124)).
  - Fixed EventPipe CPU sampling stalls under coarse browser timer resolution ([dotnet/runtime #129848](https://github.com/dotnet/runtime/pull/129848)).
- **Type system**
  - Fixed variant interface GVM resolution in the managed type system ([dotnet/runtime #130218](https://github.com/dotnet/runtime/pull/130218)). Thanks [@hez2010](https://github.com/hez2010)!
  - Optimized `MethodDataObject::FillEntryDataForAncestor` for `MethodImpl` hierarchies ([dotnet/runtime #130151](https://github.com/dotnet/runtime/pull/130151)).
- **Mobile**
  - `SslStream` on Android now consults the platform's `X509TrustManager`, so `network_security_config.xml` — including certificate pinning — is honored during the TLS handshake ([dotnet/runtime #124173](https://github.com/dotnet/runtime/pull/124173)).
  - `CompareStringNative` on iOS drops a redundant `stringByFoldingWithOptions` call that consumed ~9% of native time ([dotnet/runtime #130691](https://github.com/dotnet/runtime/pull/130691)).

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - cDAC (data contract abstraction) API buildout: dozens of PRs implementing DacDbi APIs, contract registration, and per-architecture GC-info decoders. Enables cross-platform SOS/debugger work but is invisible to app authors.
  - Async return-dropping thunk RDT lookup, thunk NonVersionable marking, synchronized async variant handling: internal runtime-async plumbing already covered structurally in preview 5/6.
  - `crossgen2` framework-crossgen concurrency tuning on macOS.
  - Numerous test/CI enabling PRs (mobile NativeAOT, Android CoreCLR runtime tests, OpenBSD runtime tests).
  - Delegate layout size reduction (#99200): correctness follow-up (Delegate.GetHashCode) is called out; the layout change is covered in bug fixes context.
  - Small SIMD/HWIntrinsic emitter cleanups and lowering hardening (many PRs) that don't change observable behavior.
-->

## Community contributors

Thank you contributors! ❤️

- [@a74nh](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aa74nh)
- [@am11](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aam11)
- [@BoyBaykiller](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ABoyBaykiller)
- [@BradBarnich](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ABradBarnich)
- [@eterekhin](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aeterekhin)
- [@gbalykov](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Agbalykov)
- [@hez2010](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Ahez2010)
- [@huoyaoyuan](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Ahuoyaoyuan)
- [@jamesburton](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Ajamesburton)
- [@jonathandavies-arm](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Ajonathandavies-arm)
- [@kant2002](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Akant2002)
- [@LuckyXu-HF](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ALuckyXu-HF)
- [@MichalPetryka](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3AMichalPetryka)
- [@sethjackson](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Asethjackson)
- [@SingleAccretion](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ASingleAccretion)
- [@snickolls-arm](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Asnickolls-arm)
- [@SwapnilGaikwad](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ASwapnilGaikwad)
- [@ylpoonlg](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aylpoonlg)

<!-- Verified against Microsoft.NETCore.App.Ref@11.0.0-preview.7.26381.103 (AvxVnni.V512 present with IsSupported and MultiplyWideningAndAdd/MultiplyWideningAndAddSaturate). Community contributor list vetted via `gh api users/<login>` for non-Microsoft affiliation; `kg` (Katelyn Gadd) excluded as MSFT. -->
