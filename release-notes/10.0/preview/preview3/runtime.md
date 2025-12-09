# .NET Runtime in .NET 10 Preview 3 - Release Notes

Here's a summary of what's new in the .NET Runtime in this preview release:

- [Stack Allocation of Small Arrays of Reference Types](#stack-allocation-of-small-arrays-of-reference-types)
- [Improved Code Layout](#improved-code-layout)

.NET Runtime updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Stack Allocation of Small Arrays of Reference Types

Since .NET 9's release, we have introduced new enhancements to the JIT compiler's ability to stack-allocate objects that don't outlive their creation contexts. Preview 1 expanded the JIT's stack allocation optimization to small, fixed-sized arrays of value types. This means small arrays of types not tracked by the garbage collector (GC) are allocated on the stack instead of the heap when it is safe to do so, reducing GC pressure and unlocking additional optimizations like scalar promotion. However, this optimization would not kick in for examples like the below:

```csharp
static void Print()
{
    string[] words = {"Hello", "World!"};
    foreach (var str in words)
    {
        Console.WriteLine(str);
    }
}
```

The lifetime of `words` is scoped to the `Print` method, and the JIT can already stack-allocate the strings `"Hello"` and `"world!"`. However, the fact that `words` is an array of `strings`, a reference type, would previously stop the JIT from stack-allocating it. Now, the JIT can eliminate every heap allocation in the above example. At the assembly level, the code for `Print` used to look like this:

```asm
Program:Print() (FullOpts):
       push     rbp
       push     r15
       push     rbx
       lea      rbp, [rsp+0x10]
       mov      rdi, 0x7624BAEF8360      ; System.String[]
       mov      esi, 2
       call     CORINFO_HELP_NEWARR_1_OBJ
       mov      rdi, 0x762534A02D10      ; 'Hello'
       mov      gword ptr [rax+0x10], rdi
       mov      rdi, 0x762534A02D30      ; 'World!'
       mov      gword ptr [rax+0x18], rdi
       lea      rbx, bword ptr [rax+0x10]
       mov      r15d, 2
G_M2084_IG03:  ;; offset=0x0043
       mov      rdi, gword ptr [rbx]
       call     [System.Console:WriteLine(System.String)]
       add      rbx, 8
       dec      r15d
       jne      SHORT G_M2084_IG03
       pop      rbx
       pop      r15
       pop      rbp
       ret
```

Notice how we call `CORINFO_HELP_NEWARR_1_OBJ` to allocate `words` on the heap. Now, the assembly looks like this:

```asm
Program:Print() (FullOpts):
       push     rbp
       push     r15
       push     rbx
       sub      rsp, 32
       lea      rbp, [rsp+0x30]
       vxorps   xmm8, xmm8, xmm8
       vmovdqu  ymmword ptr [rbp-0x30], ymm8
       mov      rdi, 0x700BFC98B0C0      ; System.String[]
       mov      qword ptr [rbp-0x30], rdi
       lea      rdi, [rbp-0x30]
       mov      dword ptr [rdi+0x08], 2
       lea      rbx, [rbp-0x30]
       mov      rdi, 0x700C76402D10      ; 'Hello'
       mov      gword ptr [rbx+0x10], rdi
       mov      rdi, 0x700C76402D30      ; 'World!'
       mov      gword ptr [rbx+0x18], rdi
       add      rbx, 16
       mov      r15d, 2
G_M2084_IG03:  ;; offset=0x005A
       mov      rdi, gword ptr [rbx]
       call     [System.Console:WriteLine(System.String)]
       add      rbx, 8
       dec      r15d
       jne      SHORT G_M2084_IG03
       add      rsp, 32
       pop      rbx
       pop      r15
       pop      rbp
       ret
```

For more information on stack allocation improvements in the JIT compiler, check out [dotnet/runtime #108913](https://github.com/dotnet/runtime/issues/108913).

## Improved Code Layout

The JIT compiler organizes your method's code into basic blocks that can only be entered at the first instruction, and exited via the last instruction. As long as the JIT appends a jump instruction to the end of each block, the program can be laid out in any block order without changing runtime behavior. However, some layouts produce better runtime performance than others:

- Placing a block before its successor in memory means the JIT does not need to emit a jump instruction to it, reducing code size and the potential for CPU pipelining penalties.
- Placing frequently-executed blocks near each other increases their likelihood of sharing an instruction cache line, reducing instruction cache misses.

Thus, the JIT has an optimization where it tries to find a block ordering that exhibits the above traits. Previously, the JIT would compute a reverse postorder (RPO) traversal of the program's flowgraph as an initial layout, and then make iterative transformations to it. RPO tends to produce layouts with little branching by placing each block before its successors, unless the block is in a loop. If profile data suggests a block is rarely executed, the JIT then moves it to the end of the method to compact the hotter parts of the method. Finally, the JIT tries to eliminate hot branches by moving the successor of the branch up to its predecessor.

The challenge of finding a performant block layout stems from the fact that the above goals are frequently orthogonal to each other. For example, in the process of eliminating a hot branch, the JIT might move other hot blocks further away from their successors, reducing hot code density overall. Because each transformation is local in scope, it's difficult to model how one transformation's changes affect another's. To solve this, the JIT now models the block reordering problem as a reduction of the asymmetric [Travelling Salesman Problem](https://en.wikipedia.org/wiki/Travelling_salesman_problem), and implements the [3-opt](https://en.wikipedia.org/wiki/3-opt) heuristic for finding a near-optimal traversal. The "distance" between each block is modeled by the execution count of the preceding block, multiplied by the likelihood that the block branches to its successor. The JIT then searches for a layout with the shortest distance from the method entry to the method exit, frequently yielding a layout with dense hot paths, and relatively short branches.

To learn more about improvements to code layout in .NET 10, check out [dotnet/runtime #107749](https://github.com/dotnet/runtime/issues/107749).
