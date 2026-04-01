# Runtime Examples

## Array Enumeration De-Abstraction

Preview 1 brought enhancements to the JIT compiler's devirtualization abilities for array interface methods; this was our first step in reducing the abstraction overhead of array iteration via enumerators. Preview 2 continues this effort with improvements to many other optimizations. Consider the following benchmarks:

```csharp
public class ArrayDeAbstraction
{
    static readonly int[] array = new int[512];

    [Benchmark(Baseline = true)]
    public int foreach_static_readonly_array()
    {
        int sum = 0;
        foreach (int i in array) sum += i;
        return sum;
    }

    [Benchmark]
    public int foreach_static_readonly_array_via_interface()
    {
        IEnumerable<int> o = array;
        int sum = 0;
        foreach (int i in o) sum += i;
        return sum;
    }
}
```

In `foreach_static_readonly_array`, the type of `array` is transparent, so it is easy for the JIT to generate efficient code. In `foreach_static_readonly_array_via_interface`, the type of `array` is hidden behind an `IEnumerable`, introducing an object allocation and virtual calls for advancing and dereferencing the iterator. In .NET 9, this overhead impacts performance profoundly:

| Method                                                       | Mean       | Ratio | Allocated |
|------------------------------------------------------------- |-----------:|------:|----------:|
| foreach_static_readonly_array (.NET 9)                       |   150.8 ns |  1.00 |         - |
| foreach_static_readonly_array_via_interface (.NET 9)         |   851.8 ns |  5.65 |      32 B |

Thanks to improvements to the JIT's inlining, stack allocation, and loop cloning abilities (all of which are detailed in [dotnet/runtime #108913](https://github.com/dotnet/runtime/issues/108913)), the object allocation is gone, and runtime impact has been reduced substantially:

| Method                                                       | Mean       | Ratio | Allocated |
|------------------------------------------------------------- |-----------:|------:|----------:|
| foreach_static_readonly_array (.NET 9)                       |   150.8 ns |  1.00 |         - |
| foreach_static_readonly_array_via_interface (.NET 10)        |   280.0 ns |  1.86 |         - |

---
Source: [.NET 10 Preview 2 — Runtime](../../../../release-notes/10.0/preview/preview2/runtime.md)
Commentary: Progressive benchmark narrative — the best style for JIT optimization stories.
Why it works: Multiple benchmark tables tell a story (problem → partial fix → harder problem → better fix). Each table shows measurable improvement. The reader follows the JIT's reasoning through escalating complexity.
---

## Improved Code Generation for Struct Arguments

.NET's JIT compiler is capable of an optimization called physical promotion, where the members of a struct are placed in registers rather than on the stack, eliminating memory accesses. This optimization is particularly useful when passing a struct to a method, and the calling convention requires the struct members to be passed in registers. Consider the following example:

```csharp
struct Point
{
    public int X;
    public int Y;
    public Point(int x, int y) { X = x; Y = y; }
}

[MethodImpl(MethodImplOptions.NoInlining)]
private static void Consume(Point p) => Console.WriteLine(p.X + p.Y);

private static void Main()
{
    Point p = new Point(10, 20);
    Consume(p);
}
```

Because `ints` are four bytes wide, and registers are eight bytes wide on x64, the calling convention requires us to pass the members of `Point` in one register. However, the JIT compiler's internal representation of struct members previously wasn't flexible enough to represent values that share a register. Thus, the JIT compiler would first store the values to memory, and then load the eight-byte chunk into a register:

```asm
Program:Main() (FullOpts):
       push     rax
       mov      dword ptr [rsp], 10
       mov      dword ptr [rsp+0x04], 20
       mov      rdi, qword ptr [rsp]
       call     [Program:Consume(Program+Point)]
       nop
       add      rsp, 8
       ret
```

Thanks to [dotnet/runtime #115977](https://github.com/dotnet/runtime/pull/115977), the JIT compiler can now place the promoted members of struct arguments into shared registers:

```asm
Program:Main() (FullOpts):
       mov      rdi, 0x140000000A
       tail.jmp [Program:Consume(Program+Point)]
```

---
Source: [.NET 10 Preview 6 — Runtime](../../../../release-notes/10.0/preview/preview6/runtime.md)
Commentary: Before/after assembly comparison — the gold standard for codegen improvements.
Why it works: The reader can count the instructions eliminated. The assembly speaks for itself — no prose needed to explain the magnitude of the improvement.
---

## JIT: Loop Optimizations

RyuJIT already supports multiple powerful loop optimizations, and we plan to expand these capabilities for .NET 9. For Preview 1, we've focused on improving the applicability of existing optimizations by refactoring how loops are represented in RyuJIT. This new graph-based representation is simpler and more effective than the old lexical representation, enabling RyuJIT to recognize -- and thus optimize -- more loops.

Here's a quick breakdown of the improvements:

- **Loop hoisting** -- finds expressions that don't change in value as the containing loop iterates, and moves (or "hoists") the expressions to above the loop so they evaluate at most once. In our test collections, we saw up to 35.8% more hoisting performed with the new loop representation.
- **Loop cloning** -- determines if a conditional check (like a bounds check on an array) inside a loop can be safely eliminated for some of its iterations, and creates a "fast" copy of the loop without the check. With the new loop representation, we saw up to 7.3% more loop cloning.
- **Loop alignment** -- improves instruction cache performance by adjusting the offset of a loop to begin at a cache line. With the new loop representation, we saw about 5% more loops aligned across our test collections.

This is just a snippet of the improvements RyuJIT's new loop representation brings. To take a closer look at the loop optimization work planned for .NET 9, check out [dotnet/runtime #93144](https://github.com/dotnet/runtime/issues/93144).

---
Source: [.NET 9 Preview 1 — Runtime](../../../../release-notes/9.0/preview/preview1/runtime.md)
Commentary: Metric-heavy prose with no code — good for infrastructure improvements where breadth of impact matters more than a single before/after.
Why it works: Percentages sell the improvement without needing code. Each bullet is self-contained. Links to the tracking issue for depth.
Style note: L111 "snippet" is ambiguous in a programming context — readers may expect a code snippet. Prefer plain language like "a sample of" or "some of."
---
