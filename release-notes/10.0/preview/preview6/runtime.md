
# .NET Runtime in .NET 10 Preview 6 - Release Notes

Here's a summary of what's new in the .NET Runtime in this preview release:

- [Improved Code Generation for Struct Arguments](#improved-code-generation-for-struct-arguments)
- [Improved Loop Inversion](#improved-loop-inversion)

.NET Runtime updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Improved Code Generation for Struct Arguments

.NET's JIT compiler is capable of an optimization called physical promotion, where the members of a struct are placed in registers rather than on the stack, eliminating memory accesses. This optimization is particularly useful when passing a struct to a method, and the calling convention requires the struct members to be passed in registers. Consider the following example:

```csharp
struct Point
{
    public long X;
    public long Y;

    public Point(long x, long y)
    {
        X = x;
        Y = y;
    }
}

[MethodImpl(MethodImplOptions.NoInlining)]
private static void Consume(Point p)
{
    Console.WriteLine(p.X + p.Y);
}

private static void Main()
{
    Point p = new Point(10, 20);
    Consume(p);
}
```

On x64, we pass the members of `Point` to `Consume` in separate registers, and since physical promotion kicked in for the local `p`, we don't allocate anything on the stack first:

```asm
Program:Main() (FullOpts):
       mov      edi, 10
       mov      esi, 20
       tail.jmp [Program:Consume(Program+Point)]
```

Now, suppose we changed the members of `Point` to be `ints` instead of `longs`. Because `ints` are four bytes wide, and registers are eight bytes wide on x64, the calling convention requires us to pass the members of `Point` in one register. However, the JIT compiler's internal representation of struct members previously wasn't flexible enough to represent values that share a register. Thus, the JIT compiler would first store the values to memory, and then load the eight-byte chunk into a register, like so:

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

The need to load the struct argument from memory defeats the benefits of physical promotion, in this case. Thanks to [dotnet/runtime #115977](https://github.com/dotnet/runtime/pull/115977), the JIT compiler can now place the promoted members of struct arguments into shared registers. The assembly for the above example now looks like this:

```asm
Program:Main() (FullOpts):
       mov      rdi, 0x140000000A
       tail.jmp [Program:Consume(Program+Point)]
```

## Improved Loop Inversion

The JIT compiler can hoist the condition of a `while` loop, and transform the loop body into a `do-while` loop, producing the final shape:

```csharp
if (loopCondition)
{
    do
    {
        // loop body
    } while (loopCondition);
}
```

This transformation is called loop inversion. By moving the condition to the bottom of the loop, the JIT removes the need to branch to the top of the loop to test the condition, improving code layout. Numerous optimizations (like loop cloning, loop unrolling, and induction variable optimizations) also depend on loop inversion to produce this shape to aid analysis.

 .NET 9 enhanced code quality for loops by switching over numerous optimizations to use a graph-based loop recognition implementation, bringing improved precision over the lexical analysis it replaced. Preview 6 switches over loop inversion, the only loop optimization still using the lexical implementation, to the graph-based implementation. Thanks to [dotnet/runtime #116017](https://github.com/dotnet/runtime/pull/116017), loop inversion now considers all natural loops -- loops with a single entry point -- and ignores the false positives previously considered by the lexical implementation. This translates into higher optimization potential for .NET programs with `for` and `while` statements.
