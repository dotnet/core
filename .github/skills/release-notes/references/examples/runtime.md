# Runtime Examples

## Array Enumeration De-Abstraction

> Source: [.NET 10 Preview 2 — Runtime](../../../../release-notes/10.0/preview/preview2/runtime.md)

Progressive benchmark narrative. Starts simple, escalates to harder cases, walks through each optimization layer with measured results.

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

| Method                                                       | Mean       | Ratio | Allocated |
|------------------------------------------------------------- |-----------:|------:|----------:|
| foreach_static_readonly_array (.NET 9)                       |   150.8 ns |  1.00 |         - |
| foreach_static_readonly_array_via_interface (.NET 9)         |   851.8 ns |  5.65 |      32 B |

Thanks to improvements to the JIT's inlining, stack allocation, and loop cloning abilities (all of which are detailed in [dotnet/runtime #108913](https://github.com/dotnet/runtime/issues/108913)), the object allocation is gone, and runtime impact has been reduced substantially:

| Method                                                       | Mean       | Ratio | Allocated |
|------------------------------------------------------------- |-----------:|------:|----------:|
| foreach_static_readonly_array (.NET 9)                       |   150.8 ns |  1.00 |         - |
| foreach_static_readonly_array_via_interface (.NET 10)        |   280.0 ns |  1.86 |         - |

**Why it works**: multiple benchmark tables tell a progressive story — problem, partial fix, harder problem, better fix. Each table shows measurable improvement. The reader follows the JIT's reasoning.

---

## Improved Code Generation for Struct Arguments

> Source: [.NET 10 Preview 6 — Runtime](../../../../release-notes/10.0/preview/preview6/runtime.md)

Before/after assembly comparison. Shows the C# code, the optimal case, the pathological case, and the fix — all through `asm` blocks.

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

Before — struct fields spill to stack then reload:

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

After — fields packed directly into a register:

```asm
Program:Main() (FullOpts):
       mov      rdi, 0x140000000A
       tail.jmp [Program:Consume(Program+Point)]
```

**Why it works**: the reader can count the instructions eliminated. No prose needed to explain the improvement — the assembly speaks for itself.

---

## JIT Loop Optimizations

> Source: [.NET 9 Preview 1 — Runtime](../../../../release-notes/9.0/preview/preview1/runtime.md)

Metric-heavy prose, no code. Three optimization categories with measured improvements.

> RyuJIT already supports multiple powerful loop optimizations, and we plan to expand these capabilities for .NET 9. For Preview 1, we've focused on improving the applicability of existing optimizations by refactoring how loops are represented in RyuJIT. This new graph-based representation is simpler and more effective than the old lexical representation, enabling RyuJIT to recognize -- and thus optimize -- more loops.
>
> Here's a quick breakdown of the improvements:
>
> - **Loop hoisting** -- finds expressions that don't change in value as the containing loop iterates, and moves (or "hoists") the expressions to above the loop so they evaluate at most once. In our test collections, we saw up to 35.8% more hoisting performed with the new loop representation.
> - **Loop cloning** -- determines if a conditional check (like a bounds check on an array) inside a loop can be safely eliminated for some of its iterations, and creates a "fast" copy of the loop without the check. With the new loop representation, we saw up to 7.3% more loop cloning.
> - **Loop alignment** -- improves instruction cache performance by adjusting the offset of a loop to begin at a cache line. With the new loop representation, we saw about 5% more loops aligned across our test collections.

**Why it works**: sells infrastructure improvements through percentages. No code needed because the value is breadth of impact, not a single dramatic before/after.
