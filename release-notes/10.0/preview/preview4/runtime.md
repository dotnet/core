# .NET Runtime in .NET 10 Preview 4 - Release Notes

Here's a summary of what's new in the .NET Runtime in this preview release:

- [Escape Analysis for Local Struct Fields](#escape-analysis-for-local-struct-fields)
- [Inlining Improvements](#inlining-improvements)

.NET Runtime updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Escape Analysis for Local Struct Fields

Preview 4 expands the JIT compiler's escape analysis abilities to model references to objects from struct fields. As mentioned in prior release notes, the JIT performs escape analysis to determine if an object can outlive its parent method; if it cannot, the JIT can allocate it on the stack, removing the overhead of placing and tracking an object on the heap. Objects can "escape," for example, by being assigned to a non-local variable, or by being passed to or returned from a function that isn't eventually inlined by the JIT.

Consider the following example:

```csharp
public class Program
{
    struct GCStruct
    {
        public int[] arr;
    }

    public static void Main()
    {
        int[] x = new int[10];
        GCStruct y = new GCStruct() { arr = x };
        return y.arr[0];
    }
}
```

Normally, the JIT will stack-allocate small, fixed-sized arrays that do not escape, such as `x` -- its assignment to `y.arr` does not cause `x` to escape, because `y` does not escape either. However, the JIT's escape analysis implementation previously did not model struct field references. In .NET 9, the x64 assembly generated for `Main` looks like this:

```asm
Program:Main():int (FullOpts):
       push     rax
       mov      rdi, 0x719E28028A98      ; int[]
       mov      esi, 10
       call     CORINFO_HELP_NEWARR_1_VC
       mov      eax, dword ptr [rax+0x10]
       add      rsp, 8
       ret
```

Note the call to `CORINFO_HELP_NEWARR_1_VC` to allocate `x` on the heap, indicating it was marked as escaping. Thanks to [dotnet/runtime #113977](https://github.com/dotnet/runtime/pull/113977), the JIT will no longer mark objects referenced by local struct fields as escaping, so long as the struct in question does not escape. The assembly now looks like this:

```asm
Program:Main():int (FullOpts):
       sub      rsp, 56
       vxorps   xmm8, xmm8, xmm8
       vmovdqu  ymmword ptr [rsp], ymm8
       vmovdqa  xmmword ptr [rsp+0x20], xmm8
       xor      eax, eax
       mov      qword ptr [rsp+0x30], rax
       mov      rax, 0x7F9FC16F8CC8      ; int[]
       mov      qword ptr [rsp], rax
       lea      rax, [rsp]
       mov      dword ptr [rax+0x08], 10
       lea      rax, [rsp]
       mov      eax, dword ptr [rax+0x10]
       add      rsp, 56
       ret
```

Note the heap allocation helper call is gone. To learn more about de-abstraction improvements planned for .NET 10, check out [dotnet/runtime #108913](https://github.com/dotnet/runtime/issues/108913).

## Inlining Improvements

Preview 4 brings multiple enhancements to the JIT's inliner:

- [dotnet/runtime #112998](https://github.com/dotnet/runtime/pull/112998) enabled inlining of some methods with exception handling semantics, in particular those with try-finally blocks.
- Because the above change increased the number of candidate inlinees, the inliner started exhausting its budget more frequently. [dotnet/runtime #114191](https://github.com/dotnet/runtime/pull/114191) addressed this by doubling the inliner's time constraints
- To better take advantage of the JIT's ability to stack-allocate some arrays, [dotnet/runtime #114806](https://github.com/dotnet/runtime/pull/114806) adjusted the inliner's heuristics to increase the profitability of candidates that might be returning small, fixed-sized arrays.
- When the JIT decides a call site is not profitable for inlining, it marks the method with `NoInlining` to save future inlining attempts from considering it, reducing compile times. However, many inlining heuristics are sensitive to profile data. For example, the JIT might decide a method is too large to be worth inlining in the absence of profile data, whereas when the caller is sufficiently hot, the JIT might be willing to relax its size restriction and inline the call. With [dotnet/runtime #114821](https://github.com/dotnet/runtime/pull/114821), the JIT will no longer flag unprofitable inlinees with `NoInlining` to avoid pessimizing call sites with profile data.

The above changes correspond with [hundreds](https://github.com/dotnet/runtime/pull/114821#issuecomment-2825645564) of microbenchmark improvements, frequently unblocking the de-abstraction capabilities introduced in earlier Previews.
