# .NET Runtime in .NET 10 Preview 5 - Release Notes

Here's a summary of what's new in the .NET Runtime in this preview release:

- [Escape Analysis for Delegate](#escape-analysis-for-delegates)
- [Inlining Improvements](#inlining-improvements)
- [ARM64 Write Barrier Improvements](#arm64-write-barrier-improvements)

.NET Runtime updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Escape Analysis for Delegates

Preview 5 extends the JIT compiler's escape analysis implementation to model delegate invokes. When compiling source code to IL, each delegate is transformed into a closure class with a method corresponding to the delegate's definition, and fields matching any captured variables. At runtime, a closure object is created to instantiate the captured variables, along with a `Func` object to invoke the delegate. Thanks to [dotnet/runtime #115172](https://github.com/dotnet/runtime/pull/115172), if escape analysis determines the `Func` object will not outlive its current scope, the JIT will allocate it on the stack.

Consider the following example:

```csharp
 public static int Main()
{
    int local = 1;
    int[] arr = new int[100];
    var func = (int x) => x + local;
    int sum = 0;

    foreach (int num in arr)
    {
        sum += func(num);
    }

    return sum;
}
```

Here is the abbreviated x64 assembly the .NET 9 JIT produces for `Main`:

```asm
       ; prolog omitted for brevity
       mov      rdi, 0x7DD0AE362E28      ; Program+<>c__DisplayClass0_0
       call     CORINFO_HELP_NEWSFAST
       mov      rbx, rax
       mov      dword ptr [rbx+0x08], 1
       mov      rdi, 0x7DD0AE268A98      ; int[]
       mov      esi, 100
       call     CORINFO_HELP_NEWARR_1_VC
       mov      r15, rax
       mov      rdi, 0x7DD0AE4A9C58      ; System.Func`2[int,int]
       call     CORINFO_HELP_NEWSFAST
       mov      r14, rax
       lea      rdi, bword ptr [r14+0x08]
       mov      rsi, rbx
       call     CORINFO_HELP_ASSIGN_REF
       mov      rsi, 0x7DD0AE461140      ; code for Program+<>c__DisplayClass0_0:<Main>b__0(int):int:this
       mov      qword ptr [r14+0x18], rsi
       xor      ebx, ebx
       add      r15, 16
       mov      r13d, 100

G_M24375_IG03:  ;; offset=0x0075
       mov      esi, dword ptr [r15]
       mov      rdi, gword ptr [r14+0x08]
       call     [r14+0x18]System.Func`2[int,int]:Invoke(int):int:this
       add      ebx, eax
       add      r15, 4
       dec      r13d
       jne      SHORT G_M24375_IG03
       ; epilog omitted for brevity
```

Before entering the loop, `arr`, `func`, and the closure class for `func` called `Program+<>c__DisplayClass0_0` are all allocated on the heap, as indicated by the `CORINFO_HELP_NEW*` calls. Preview 1 introduced stack allocation for fixed-sized arrays of value types, so we can expect the heap allocation for `arr` to go away. Because `func` is never referenced outside the scope of `Main`, it will also be allocated on the stack. Here is the code generated in Preview 5:

```asm
       ; prolog omitted for brevity
       mov      rdi, 0x7B52F7837958      ; Program+<>c__DisplayClass0_0
       call     CORINFO_HELP_NEWSFAST
       mov      rbx, rax
       mov      dword ptr [rbx+0x08], 1
       mov      rsi, 0x7B52F7718CC8      ; int[]
       mov      qword ptr [rbp-0x1C0], rsi
       lea      rsi, [rbp-0x1C0]
       mov      dword ptr [rsi+0x08], 100
       lea      r15, [rbp-0x1C0]
       xor      r14d, r14d
       add      r15, 16
       mov      r13d, 100

G_M24375_IG03:  ;; offset=0x0099
       mov      esi, dword ptr [r15]
       mov      rdi, rbx
       mov      rax, 0x7B52F7901638      ; address of definition for "func"
       call     rax
       add      r14d, eax
       add      r15, 4
       dec      r13d
       jne      SHORT G_M24375_IG03
       ; epilog omitted for brevity
```

Notice there is only one `CORINFO_HELP_NEW*` call remaining: the heap allocation for the closure. We plan to expand escape analysis to support stack allocation of closures in a future release.

## Inlining Improvements

Preview 5 further enhances the JIT's inlining policy to take better advantage of profile data. Among numerous heuristics, the JIT's inliner will not consider methods over a certain size to avoid bloating the caller method. When the caller has profile data that suggests an inlining candidate is frequently executed, the inliner increases its size tolerance for the candidate.

Suppose the JIT inlines some callee `Bar` without profile data into some caller `Foo` with profile data -- this discrepancy can happen if the callee is too small to be worth instrumenting, or if it is inlined too often to have a sufficient call count. If `Bar` has its own inlining candidates, the JIT would previously consider them with its default size limit due to `Bar` lacking profile data. With [dotnet/runtime #115119](https://github.com/dotnet/runtime/pull/115119), the JIT will now realize `Foo` has profile data, and loosen its size restriction (but not to the same degree as if `Bar` has profile data, to account for loss of precision). Like the inlining policy changes in Preview 4, this brought [hundreds](https://github.com/dotnet/runtime/pull/115119#issuecomment-2914325071) of improvements to our microbenchmarks.

## ARM64 Write Barrier Improvements

The .NET garbage collector (GC) is generational, meaning it separates live objects by age to improve collection performance. The GC collects younger generations more often under the assumption that long-lived objects are less likely to be unreferenced (or "dead") at any given time. However, suppose an old object starts referencing a young object; the GC needs to know it cannot collect the young object, but needing to scan older objects to collect a young object defeats the performance gains of a generational GC.

To solve this problem, the JIT inserts write barriers before object reference updates to keep the GC informed. On x64, the runtime can dynamically switch between write barrier implementations to balance write speeds and collection efficiency, depending on the GC's configuration. [dotnet/runtime #111636](https://github.com/dotnet/runtime/pull/111636) brings this functionality to ARM64 as well. In particular, the new default write barrier implementation on ARM64 handles GC regions more precisely, improving collection performance at slight expense to write barrier throughput: Our benchmarks show GC pause improvements from eight to over twenty percent with the new GC defaults.
