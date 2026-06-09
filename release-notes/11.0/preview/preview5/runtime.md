# .NET Runtime in .NET 11 Preview 5 - Release Notes

.NET 11 Preview 5 includes new runtime features and performance work:

- [Runtime-async suspension is faster](#runtime-async-suspension-is-faster)
- [JIT optimizations](#jit-optimizations)
- [Arm intrinsics add native integer and SVE2 predicates](#arm-intrinsics-add-native-integer-and-sve2-predicates)
- [GC trimming and compaction improvements](#gc-trimming-and-compaction-improvements)
- [Browser/WebAssembly CoreCLR enablement](#browserwebassembly-coreclr-enablement)
- [Diagnostics and loader messages](#diagnostics-and-loader-messages)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET Runtime updates in .NET 11:

- [What's new in .NET 11 runtime](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/runtime)
## Runtime-async suspension is faster

Runtime-async suspension and resumption continue to get faster in Preview 5. The biggest win is for async methods that are optimized by on-stack replacement (OSR). OSR is the JIT feature that lets a long-running method switch from initial code to optimized code while the method is still executing.

Runtime-async now resumes those methods directly into optimized code instead of taking the general-purpose OSR transition path. The PR reports that the transition overhead was around 10-20x, and the sample suspension-heavy benchmark improved from `Took 6357.1 ms` to `Took 457.1 ms` ([dotnet/runtime #127074](https://github.com/dotnet/runtime/pull/127074)).

Other runtime-async changes reduce the cost and size of generated suspension code:

- Common suspension paths now use smaller generated code. The PR reports an approximately 8% improvement on a suspension-heavy microbenchmark, and the generated code in the PR sample shrank from 766 bytes to 751 bytes ([dotnet/runtime #126041](https://github.com/dotnet/runtime/pull/126041)).
- Suspension and resumption now do less thread-local-storage work and avoid several write barriers on hot paths. The PR sample improved from `Took 350.3 ms` to `Took 291.3 ms` ([dotnet/runtime #127336](https://github.com/dotnet/runtime/pull/127336)).
- Runtime-async now reuses continuations when an `IValueTaskSource`-backed `ValueTask` suspends, removing an allocation on that path ([dotnet/runtime #127973](https://github.com/dotnet/runtime/pull/127973)).

## JIT optimizations

Several JIT optimizations landed this preview that benefit typical C# without source changes.

### Redundant span and null checks

The JIT now removes more range checks from span loops that repeatedly slice off a fixed-width prefix. These loops commonly use a length check to ask, "is at least this much data left?". In the following example, the `data.Length >= Vector128<int>.Count` guard proves that the next `Vector128.Create(data)` and `data.Slice(Vector128<int>.Count)` are in range across the loop back edge:

```csharp
int Sum(ReadOnlySpan<int> data)
{
    Vector128<int> sum = default;
    while (data.Length >= Vector128<int>.Count)
    {
        sum += Vector128.Create(data);
        data = data.Slice(Vector128<int>.Count);
    }

    int result = Vector128.Sum(sum);
    foreach (int t in data)
    {
        result += t;
    }

    return result;
}
```

The extra range-check block is gone, and the PR sample shrank from 113 bytes to 79 bytes ([dotnet/runtime #127117](https://github.com/dotnet/runtime/pull/127117)):

```diff
 G_M38854_IG03:
-       cmp      ecx, 4
-       jl       SHORT G_M38854_IG09
        vpaddd   xmm0, xmm0, xmmword ptr [rax]
        add      rax, 16
        add      ecx, -4
        cmp      ecx, 4
        jge      SHORT G_M38854_IG03
...
-G_M38854_IG09:
-       mov      ecx, 6
-       call     [System.ThrowHelper:ThrowArgumentOutOfRangeException(int)]
-       int3
-; Total bytes of code 113
+; Total bytes of code 79
```

A related value-numbering and range-check improvement removes redundant checks for `span.Slice(span.Length - constant)`. This makes patterns such as reading the final four bytes of a span compile directly to the load after the initial length guard ([dotnet/runtime #127488](https://github.com/dotnet/runtime/pull/127488)):

```csharp
int Test(ReadOnlySpan<byte> span)
{
    if (span.Length >= sizeof(int))
    {
        return BinaryPrimitives.ReadInt32BigEndian(span.Slice(span.Length - sizeof(int)));
    }

    return -1;
}
```

```diff
+       mov      rax, bword ptr [rcx]
+       mov      ecx, dword ptr [rcx+0x08]
+       cmp      ecx, 4
+       jl       SHORT G_M6173_IG05
+       add      ecx, -4
+       add      rax, rcx
+       movbe    eax, dword ptr [rax]
+       ret
        mov      eax, -1
-       lea      eax, [rdx-0x04]
-       cmp      eax, edx
-       ja       SHORT G_M27777_IG07
-       ...
-       call     [System.ThrowHelper:ThrowArgumentOutOfRangeException()]
-       int3
```

Null-check propagation also looks through PHIs that merge a newly-created value with an existing non-null value. For `(_inner ??= new Inner()).Do(n)`, the explicit null check before the branch is removed ([dotnet/runtime #127810](https://github.com/dotnet/runtime/pull/127810)):

```diff
 G_M*_IG04:
-       cmp      byte  ptr [rax], al
        test     ebx, ebx
        jg       SHORT G_M*_IG06
```

### Smaller arithmetic and faster casts

The JIT can now transform `CONST - x` into `x ^ CONST` when range information proves the identities are equivalent. This works when the constant is an all-ones mask for the bits that `x` can use. For a byte, `255` is `1111_1111`, so `x ^ 255` flips exactly those eight bits and produces the same result as `255 - x`. For `255 - byte`, the generated code changes from `neg` + `add` to a single `xor`; for `-1 - x`, it changes to `not` ([dotnet/runtime #126529](https://github.com/dotnet/runtime/pull/126529)). Thank you [@BoyBaykiller](https://github.com/BoyBaykiller) for this contribution!

```diff
        movzx    rax, dl
-       neg      eax
-       add      eax, 255
+       xor      eax, 255
```

On x86 processors with AVX-512 or AVX10.2, floating-point to `long`/`ulong` casts now use hardware conversion instructions for all non-overflow casts. The typical `double` to `long` diff replaces `CORINFO_HELP_DBL2LNG` with `vcvttpd2qq` and mask handling ([dotnet/runtime #125180](https://github.com/dotnet/runtime/pull/125180)). Thank you [@saucecontrol](https://github.com/saucecontrol) for this contribution!

```diff
-       call     CORINFO_HELP_DBL2LNG
+       vcmpordsd k1, xmm0, xmm0
+       vcmpge_oqsd k2, xmm0, qword ptr [@RWD00]
+       vcvttpd2qq xmm0 {k1}{z}, xmm0
+       vpblendmq xmm0 {k2}, xmm0, qword ptr [@RWD08] {1to2}
+       vmovd    eax, xmm0
+       vpextrd  edx, xmm0, 1
```

## Arm intrinsics add native integer and SVE2 predicates

`System.Runtime.Intrinsics.Arm` now has native-integer overloads for several scalar Arm intrinsics. `ArmBase.LeadingZeroCount`, `ArmBase.ReverseElementBits`, `Crc32.ComputeCrc32`, and `Crc32.ComputeCrc32C` accept `nint` or `nuint`, and the JIT lowers the 64-bit form directly to the Arm64 instruction width ([dotnet/runtime #127327](https://github.com/dotnet/runtime/pull/127327)).

```csharp
if (Crc32.IsSupported)
{
    nuint value = (nuint)0x1234_5678;
    uint crc = Crc32.ComputeCrc32(0, value);
}
```

SVE2 now has `CreateWhileGreaterThanMask*` and `CreateWhileReadAfterWriteMask*` predicate-generation intrinsics. The new `CreateWhileGreaterThanMask*` methods cover byte, signed byte, 16-bit, 32-bit, 64-bit, `double`, and `single` element masks, while `CreateWhileReadAfterWriteMask*` methods create masks from pointer ranges ([dotnet/runtime #127538](https://github.com/dotnet/runtime/pull/127538)).

## GC trimming and compaction improvements

A new GC configuration switch, `DOTNET_GCTrimYoungestKeepPercent`, lets memory-footprint latency mode keep a configurable percentage of the youngest generation during trimming. This gives applications another way to balance memory trimming against startup cost when using `DOTNET_GCLatencyLevel=0` ([dotnet/runtime #109863](https://github.com/dotnet/runtime/pull/109863)). Thank you [@ashaurtaev](https://github.com/ashaurtaev) for this contribution!

```powershell
$env:DOTNET_GCLatencyLevel = "0"
$env:DOTNET_GCTrimYoungestKeepPercent = "0xF"
```

GC compaction now keeps the `heap_segment_used` watermark accurate after relocating objects into a region. The fix avoids a stale gap that could retain dirty data when large pages or `never_decommit_p` caused `decommit_region` to clear only up to `used`. In the large-pages repro from the PR, the optimized fix was compared with a safe clear-all baseline over five-minute runs on .NET 11 Release standalone GC ([dotnet/runtime #128217](https://github.com/dotnet/runtime/pull/128217)). Thank you [@cshung](https://github.com/cshung) for this contribution!

| Metric | Clear-all | Optimized | Diff |
| ------ | --------: | --------: | ---: |
| Avg throughput (entries) | 3,322,843 | 3,391,784 | +2.1% |
| Peak throughput | 4,708,191 | 5,152,893 | +9.4% |
| OOM count | 52 | 34 | -35% |

## Browser/WebAssembly CoreCLR enablement

Browser CoreCLR continues its bring-up in Preview 5:

- **JS initializer hooks.** The browser CoreCLR loader now implements `invokeLibraryInitializers`, enabling the same library-initializer hook used by the Mono WebAssembly runtime ([dotnet/runtime #127551](https://github.com/dotnet/runtime/pull/127551)).
- **Download retry is on by default.** The browser loader now enables download retry by default and improves retry sequencing for framework assets ([dotnet/runtime #127559](https://github.com/dotnet/runtime/pull/127559)).
- **Reverse P/Invoke and `UnmanagedCallersOnly` codegen.** WASM RyuJIT can now generate code for reverse P/Invoke and `UnmanagedCallersOnly` paths ([dotnet/runtime #127751](https://github.com/dotnet/runtime/pull/127751)).
- **Interpreter code resolution on portable-entrypoint platforms.** Browser CoreCLR can resolve interpreter code when `FEATURE_PORTABLE_ENTRYPOINTS` is enabled, which supports diagnostics paths such as sampling and profiler lookups ([dotnet/runtime #127370](https://github.com/dotnet/runtime/pull/127370)).

### Try browser CoreCLR in a Blazor WebAssembly app

The browser CoreCLR runtime is opt-in this preview. To use it in a Blazor WebAssembly project that already targets `net11.0`, add the `UseMonoRuntime` property to the WebAssembly client project file:

```xml
<PropertyGroup>
  <TargetFramework>net11.0</TargetFramework>
  <UseMonoRuntime>false</UseMonoRuntime>
</PropertyGroup>
```

The same property (or `/p:UseMonoRuntime=false` on the command line) works for non-Blazor WebAssembly projects that use `<Project Sdk="Microsoft.NET.Sdk.WebAssembly">`.

To confirm the app is running on CoreCLR, open the browser developer console and run:

```javascript
globalThis.getDotnetRuntime(0).INTERNAL.GetDotNetRuntimeHeap()
```

CoreCLR exposes this `GetDotNetRuntimeHeap` hook (returning a `Uint8Array`); the Mono WebAssembly runtime does not, so a successful call is itself the signal you're on CoreCLR. The returned buffer may be empty depending on runtime state.

A dedicated native WebAssembly toolchain/workload for browser CoreCLR isn't available yet, so AOT and the native build paths still require the Mono runtime in Preview 5.

## Diagnostics and loader messages

Heap dumps are smaller and faster by default because `createdump` now uses HEAP2. HEAP2 uses a unified memory-region enumeration path for the runtime data diagnostic tools need, while skipping several older enumeration paths that made dumps slower and larger. The old environment-variable workarounds for slow dumps are deprecated ([dotnet/runtime #127321](https://github.com/dotnet/runtime/pull/127321)).

Assembly version conflicts now include details about the already-loaded assembly in `FileLoadException` messages. When a lower-versioned assembly is already loaded, the message can now include the loaded assembly identity and path ([dotnet/runtime #123969](https://github.com/dotnet/runtime/pull/123969)):

```text
A different copy of assembly 'LibA' is already loaded. Loaded assembly: 'LibA, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null' from 'C:\repos\helloworld\bin\Debug\net10.0\LibA.dll'
```

## Bug fixes

- **JIT / code generation**
  - Fixed data breakpoint handling after `CORINFO_HELP_ARRADDR_ST` inlining on x64 ([dotnet/runtime #127251](https://github.com/dotnet/runtime/pull/127251)).
  - Fixed profile inconsistency asserts in flow-graph optimization ([dotnet/runtime #127357](https://github.com/dotnet/runtime/pull/127357)).
  - Fixed register allocation around implicit kills and local liveness ([dotnet/runtime #127184](https://github.com/dotnet/runtime/pull/127184), [dotnet/runtime #127932](https://github.com/dotnet/runtime/pull/127932), [dotnet/runtime #127910](https://github.com/dotnet/runtime/pull/127910)).
  - Fixed runtime-async with ReadyToRun on RISC-V64 ([dotnet/runtime #128066](https://github.com/dotnet/runtime/pull/128066)).
  - Fixed Arm64 stack-allocated vector and mask loads/stores ([dotnet/runtime #128037](https://github.com/dotnet/runtime/pull/128037)).
  - Fixed SIGILL on ARM64 platforms with SME but no SVE ([dotnet/runtime #127398](https://github.com/dotnet/runtime/pull/127398)).
- **GC**
  - Fixed the remaining >1024 CPU affinity case in the GC Unix environment layer ([dotnet/runtime #127572](https://github.com/dotnet/runtime/pull/127572)).
  - Disabled an aggressive large-page collection mode for ReadyToRun/Crossgen2 scenarios ([dotnet/runtime #127571](https://github.com/dotnet/runtime/pull/127571)).
- **NativeAOT**
  - Fixed NativeAOT GC roots after universal transition; the PR stress loop improved from 69 runs with 6 fail-fast crashes to 132 runs with 132 successes, 0 crashes, and 0 test failures ([dotnet/runtime #127640](https://github.com/dotnet/runtime/pull/127640)).
  - Fixed dependent-handle secondary access with standalone GC ([dotnet/runtime #128118](https://github.com/dotnet/runtime/pull/128118)).
  - Preserved execution-aborted state in NativeAOT GC info ([dotnet/runtime #127680](https://github.com/dotnet/runtime/pull/127680)).
  - Fixed NativeAOT hexadecimal config parsing for `0x` and `0X` prefixes ([dotnet/runtime #127644](https://github.com/dotnet/runtime/pull/127644)).
- **Diagnostics / cDAC**
  - Implemented cDAC support for debugger attach state, compiler flags, heap segments, generic type context APIs, vararg signatures, type layouts, array layouts, partial user state, collectible type statics, and additional metadata enumeration APIs ([dotnet/runtime #126794](https://github.com/dotnet/runtime/pull/126794), [dotnet/runtime #127244](https://github.com/dotnet/runtime/pull/127244), [dotnet/runtime #128054](https://github.com/dotnet/runtime/pull/128054), [dotnet/runtime #128263](https://github.com/dotnet/runtime/pull/128263), [dotnet/runtime #128106](https://github.com/dotnet/runtime/pull/128106), [dotnet/runtime #127877](https://github.com/dotnet/runtime/pull/127877), [dotnet/runtime #127848](https://github.com/dotnet/runtime/pull/127848), [dotnet/runtime #128288](https://github.com/dotnet/runtime/pull/128288), [dotnet/runtime #127471](https://github.com/dotnet/runtime/pull/127471)).
  - Fixed stale `lastThrownObjectHandle` data in DAC `GetThreadData` during active exception dispatch, affecting commands such as `!PrintException`, `!Threads`, and `!clrstack -a` ([dotnet/runtime #127741](https://github.com/dotnet/runtime/pull/127741)).
  - Fixed `createdump` SIGSEGV when heap dumps include active interpreter frames ([dotnet/runtime #128163](https://github.com/dotnet/runtime/pull/128163)).
- **Runtime / VM**
  - Fixed possible race conditions in thread-static variable initialization ([dotnet/runtime #127843](https://github.com/dotnet/runtime/pull/127843)).
  - Fixed Linux runtime initialization when CPU hotplug is enabled ([dotnet/runtime #128069](https://github.com/dotnet/runtime/pull/128069)).
  - Handled the generic-context argument in runtime signature-key computation ([dotnet/runtime #128171](https://github.com/dotnet/runtime/pull/128171)).
- **Mono / interpreter**
  - Restored signal handlers during crash chaining on Mono ([dotnet/runtime #125835](https://github.com/dotnet/runtime/pull/125835)).
  - Added interpreter support for stack walking and diagnostics in cDAC ([dotnet/runtime #126520](https://github.com/dotnet/runtime/pull/126520)).
  - Fixed interpreter breakpoint handling for first-chance native exceptions ([dotnet/runtime #127592](https://github.com/dotnet/runtime/pull/127592)).

## Community contributors

Thank you contributors! ❤️

- [@am11](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aam11)
- [@ashaurtaev](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aashaurtaev)
- [@BoyBaykiller](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ABoyBaykiller)
- [@clamp03](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aclamp03)
- [@cshung](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Acshung)
- [@dovydenkovas](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Adovydenkovas)
- [@giritrivedi](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Agiritrivedi)
- [@hez2010](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Ahez2010)
- [@jbevain](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Ajbevain)
- [@Ruihan-Yin](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ARuihan-Yin)
- [@saucecontrol](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Asaucecontrol)
- [@SingleAccretion](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ASingleAccretion)
- [@snickolls-arm](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Asnickolls-arm)
- [@SwapnilGaikwad](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ASwapnilGaikwad)
