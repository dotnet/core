# Runtime updates in .NET 9 Preview 6

Here's a summary of what's new in the .NET Runtime in this preview release:

- [ARM64 Code Generation](#arm64-code-generation) now adds ability to store operations
- [Code Layout](#code-layout) - RyuJIT's block reordering algorithm with a simpler, more global approach
- [Loop Optimizations](#loop-optimizations) for code size reduction and performance improvements
- [Reduced Address Exposure](#reduced-address-exposure) through RyuJIT improvements to better track usage of local variable addreses.
- [AVX10v1 Support](#avx10v1-support), a new SIMD instruction set from Intel
- [Hardware Intrinsic Code Generation](#hardware-intrinsic-code-generation)
- [Constant Folding for Floating Point and SIMD Operations](#constant-folding-for-floating-point-and-simd-operations)

Runtime updates in .NET 9 Preview 6:

- [What's new in the .NET Runtime in .NET 9](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) documentation

.NET 9 Preview 6:

- [Discussion](https://aka.ms/dotnet/9/preview6)
- [Release notes](./README.md)
- [SDK release notes](./sdk.md)
- [Libraries release notes](./libraries.md)

## ARM64 Code Generation

ARM64 supports multiple instructions for loading and storing data. For example, the `str` instruction stores data from a single register to memory, while the `stp` instruction stores data from a pair of registers. Leveraging `stp` in lieu of `str` allows us to accomplish the same task with fewer store operations, improving execution time.

For example, consider the following snippet:

```csharp
class Body { public double x, y, z, vx, vy, vz, mass; }

static void Advance(double dt, Body[] bodies)
{
    foreach (Body b in bodies)
    {
        b.x += dt * b.vx;
        b.y += dt * b.vy;
        b.z += dt * b.vz;
    }
}
```

In the loop body, we are updating the values of `b.x`, `b.y`, and `b.z`; notice how these members are contiguous in `Body`'s definition. At the assembly level, we could store to each member with a `str` instruction, or we could use `stp` to handle two of the stores (`b.x` and `b.y`, or `b.y` and `b.z` -- the two members we are storing to with `stp` have to be next to each other in memory) with one instruction. Shaving off one instruction may seem like a small improvement, but if the above loop runs for a nontrivial number of iterations, the performance gains can add up quickly.

In this example, if we want to use the `stp` instruction to store to `b.x` and `b.y` simultaneously, RyuJIT needs to be able to determine that the computations `b.y + (dt * b.vy)` and `b.x + (dt * b.vx)` are independent of one another, and can be performed before storing to `b.x` and `b.y`. With this ordering, RyuJIT will generate one instruction for the stores to `b.x` and `b.y`.

The opportunity to use `stp` may seem obvious, but the decision to use a specific assembly instruction is made late in RyuJIT's compilation phases. Before we get to that point, RyuJIT, like many compilers, builds an architecture-agnostic internal representation of your program's logic to simplify optimizations performed later during compilation. Applying architecture-specific optimizations, such as using `stp` instead of `str`, requires RyuJIT to tweak this representation such that during code generation, RyuJIT will recognize the pattern needed to apply the assembly-level optimization.

RyuJIT already has the ability to transform its representation of contiguous loads to leverage the `ldp` (analog of `stp` for loading values) instruction on ARM64, and Preview 6 extends this ability to store operations.

Here's what the assembly for storing to `b.x` and `b.y` used to look like:

```asm
ldr     x3, [x0, w1, UXTW #3]
ldp     d16, d17, [x3, #0x08]
ldp     d18, d19, [x3, #0x20]
fmul    d18, d0, d18
fadd    d16, d16, d18 
str     d16, [x3, #0x08] // Here, we were storing to b.x
fmul    d16, d0, d19
fadd    d16, d17, d16
str     d16, [x3, #0x10] // Here, we were storing to b.y
```

And here's what it looks like now:

```asm
ldr     x3, [x0, w1, UXTW #3]
ldp     d16, d17, [x3, #0x08]
ldp     d18, d19, [x3, #0x20]
fmul    d18, d0, d18
fadd    d16, d16, d18 
fmul    d18, d0, d19
fadd    d17, d17, d18
stp     d16, d17, [x3, #0x08] // Now, we're storing to b.x and b.y with one instruction
```

Check out [dotnet/runtime #102133](https://github.com/dotnet/runtime/pull/102133) for more details on the implementation of this optimization!

## Code Layout

Compilers typically reason about a program's control flow using basic blocks, where each block is a chunk of code that can only be entered at the first instruction, and exited via the last instruction; this means if a block ends with a branch instruction, control flow transfers to another block. In methods with linear control flow (such as one without any loops, if-statements, etc.), determining a reasonable basic block order is trivial: we can just lay out the blocks in execution order. But as we introduce more branches into the program's control flow, we give the compiler more possible block orderings to consider.


Why is the order of basic blocks important? One goal of block reordering is to reduce the number of branch instructions in the generated code by maximizing fallthrough behavior, or the property that each basic block is followed by its most-likely successor, such that it can "fall into" its successor without needing a jump. Reducing code size is usually ideal, but producing a block ordering where every block falls into its most-likely successor frequently isn't possible.

Consider the below snippet:

```csharp
// BB01
var random = new Random();
int number = random.Next(100);

if (number < 99)
{
    // BB02
    Console.WriteLine("We're in BB02");

}
else
{
    // BB03
    Console.WriteLine("We're in BB03");
}

// BB04
Console.WriteLine("We're in BB04 -- the successor of BB02 and BB03");
```

There are two possible paths of execution: [BB01, BB02, BB04], and [BB01, BB03, BB04]. Since both BB02 and BB03 are succeeded by BB04, we cannot create fallthrough for both of them, so we have to introduce a branch on one of the paths to improve code quality for the other path. Based on the if-statement's condition, we know [BB01, BB02, BB04] is the more likely path (and we can leverage profile data during compilation to determine this -- more on that later), so [BB01, BB02, BB04, BB03] is probably a better ordering than [BB01, BB03, BB04, BB02]. Not only does this ordering reduce the number of branches on the most-likely path of execution, but it also has the nice property of pushing BB03 -- the coldest (i.e. least-frequently-executed) block -- to the end of the method. This increases the likelihood of the instructions on the hot path sharing a line of the CPU's instruction cache, thus reducing the likelihood of cache misses during program execution. When reordering blocks, compilers frequently consider maximizing fallthrough behavior and hot code density in tandem.

RyuJIT already reorders blocks, but until recently, was limited by the flowgraph implementation it uses and wasn't able take full advantage of the profiling infrastructure in dynamic PGO. Over the last several months, we've refactored RyuJIT's flowgraph data structures to remove various restrictions around block ordering, and to ingrain execution likelihoods into every control flow change between blocks. We've also invested into ensuring profile data is propagated and maintained as we transform the method's flowgraph. This has enabled us to replace RyuJIT's block reordering algorithm with a simpler, more global approach.

Using execution likelihoods derived from profile data or heuristics, we first build a reverse post-order traversal of the method's basic blocks, greedily placing the most-likely successor of each block next. This traversal has the nice property of ensuring each block is visited before its successor, unless the block's successor is behind it in a loop. 

Using the earlier example, the reverse post-order makes the following decisions:

- BB01's possible successors are BB02 and BB03. BB02 is more likely, so place that next.
- BB04 is reachable from BB02 and BB03, so place BB04 at the end of the method.

Thus, our initial ordering is [BB01, BB02, BB03, BB04]. The initial traversal avoided creating any backward jumps, hence the suboptimal decision to place BB04 after BB03 instead of BB02. To improve upon this, for each block that doesn't fall into its most-likely successor, we compare the profile data of this block with the block that does fall into the shared successor, and move the successor up if the former block is sufficiently hot, thus pushing cold blocks further down the method. For our current layout, BB02 is the only block that doesn't fall into its most-likely successor (BB04), and since profile data suggests BB02 will execute in lieu of BB03 the overwhelming majority of the time, we should switch the order of BB03 and BB04. Thus, we get [BB01, BB02, BB04, BB03] as our final ordering.

This is a broad overview of the changes we've made to RyuJIT's flowgraph implementation for .NET 9. To get a deeper dive into the specifics of this effort, as well as some of the improvements we have planned for future releases, check out our flowgraph modernization meta-issue, [dotnet/runtime #93020](https://github.com/dotnet/runtime/issues/93020). As we iterate upon RyuJIT's PGO story, you can expect our new block reordering implementation to further improve code layout over time.

## Loop Optimizations
Loops in .NET code frequently use counter variables to control the number of iterations. In the idiomatic `for (int i = ...)` pattern, the counter variable typically increases.

Consider the following example:
```csharp
for (int i = 0; i < 100; i++)
{
    Foo();
}
```

On many architectures, it is more performant to decrement the loop's counter, like so:
```csharp
for (int i = 100; i > 0; i--)
{
    Foo();
}
```

For the first example, we need to emit an instruction to increment `i`, followed by an instruction to perform the `i < 100` comparison, followed by a conditional jump to continue the loop if the condition is still true -- that's three instructions in total. However, if we flip the counter's direction, we need one fewer instruction. For example, on x64, we can use the `dec` instruction to decrement `i`; when `i` reaches zero, the `dec` instruction sets a CPU flag that can be used as the condition for a jump instruction immediately following the `dec`.

Here's what the x64 assembly looks like for the first example:
```asm
G_M35517_IG02:  ;; offset=0x0005
       xor      ebx, ebx            // Set i to 0
G_M35517_IG03:  ;; offset=0x0007
       call     [Foo()]
       inc      ebx                 // Increment i
       cmp      ebx, 100            // Compare i to 100
       jl       SHORT G_M35517_IG03 // Continue loop if (i < 100)
```

And for the second example:
```asm
G_M35517_IG02:  ;; offset=0x0005
       mov      ebx, 100            // Set i to 100
G_M35517_IG03:  ;; offset=0x000A
       call     [Foo()]
       dec      ebx                 // Decrement i
       jne      SHORT G_M35517_IG03 // Continue loop if (i != 0)
```

The code size reduction is small, but if the loop runs for a nontrivial number of iterations, the performance improvement can be significant. RyuJIT now recognizes when the direction of a loop's counter variable can be flipped without affecting the program's behavior, and does the transformation. To learn more about this work, check out [dotnet/runtime #102261](https://github.com/dotnet/runtime/pull/102261).

## Reduced Address Exposure
When the address of a local variable is used, it is considered "address-exposed," and RyuJIT must take extra precautions when optimizing the method. For example, suppose RyuJIT is optimizing a method which passes the address of a local variable in a call to another method. Since the callee may use the address to access the local variable, RyuJIT will avoid transforming the variable when optimizing to maintain correctness. Addressed-exposed locals can significantly inhibit RyuJIT's optimization potential.

Consider the following example:
```csharp
public struct Awaitable
{
    public int Opts;

    public Awaitable(bool value)
    {
        Opts = value ? 1 : 2;
    }
}

[MethodImpl(MethodImplOptions.NoInlining)]
public static int Test() => new Awaitable(false).Opts;
```

In `Test`, we create an `Awaitable` instance, and then access its `Opts` member. By implicitly taking the address of the `Awaitable` instance to access `Opts`, the instance is marked as address-exposed, blocking multiple optimization opportunities.

Here's what the x64 assembly for `Test` looks like:
```asm
G_M59043_IG01:  ;; offset=0x0000
       push     rax
G_M59043_IG02:  ;; offset=0x0001
       xor      eax, eax
       mov      dword ptr [rsp], eax
       mov      dword ptr [rsp], 2   // Set Opts to 2
       mov      eax, dword ptr [rsp] // Return Opts
G_M59043_IG03:  ;; offset=0x0010
       add      rsp, 8
       ret
; Total bytes of code: 21
```

RyuJIT can now better track the usage of local variables' addresses, and avoid unnecessary address exposure. In this example, the more precise address exposure detection allows RyuJIT to replace usages of the `Awaitable` instance with its `Opts` field, and then eliminate `Opts` altogether by evaluating the constant expression `value ? 1 : 2`, where `value` is known to be `false`.

Here's what the updated x64 assembly looks like:
```asm
G_M59043_IG02:  ;; offset=0x0000
       mov      eax, 2  // Return 2
G_M59043_IG03:  ;; offset=0x0005
       ret
```

Check out [dotnet/runtime #102808](https://github.com/dotnet/runtime/pull/102808) for more details.

## AVX10v1 Support

New APIs have been added for AVX10, a new SIMD instruction set by Intel. You'll be able to accelerate your .NET applications on AVX10-enabled hardware with vectorized operations using the new `System.Runtime.Intrinsics.X86.Avx10v1` APIs. Check out [dotnet/runtime #101938](https://github.com/dotnet/runtime/pull/101938).

## Hardware Intrinsic Code Generation

Many hardware intrinsic APIs expect users to pass constant values for certain parameters, as these constants are encoded directly into the intrinsic's underlying instruction, rather than being loaded into registers or accessed from memory. If a constant isn't provided, the intrinsic will be replaced with a call to a fallback implementation that is functionally-equivalent, but slower.

Consider the following example:

```csharp
static byte Test1()
{
    Vector128<byte> v = Vector128<byte>.Zero;
    byte size = 1;
    v = Sse2.ShiftRightLogical128BitLane(v, size);
    return Sse41.Extract(v, 0);
}
```

The usage of `size` in the call to `Sse2.ShiftRightLogical128BitLane` can be substituted with the constant `1`, and under normal circumstances, RyuJIT is already capable of this substitution optimization. But when determining whether to generate the accelerated or fallback code for `Sse2.ShiftRightLogical128BitLane`, RyuJIT would detect that a variable is being passed instead of a constant, and prematurely decide against intrisifying the call.

This is what the generated code used to look like:

```asm
; Method Program:Test1():ubyte (FullOpts)
G_M000_IG01:                ;; offset=0x0000
       sub      rsp, 72

G_M000_IG02:                ;; offset=0x0004
       vxorps   xmm0, xmm0, xmm0
       vmovaps  xmmword ptr [rsp+0x20], xmm0
       lea      rdx, [rsp+0x20]
       lea      rcx, [rsp+0x30]
       mov      r8d, 1
       call     [System.Runtime.Intrinsics.X86.Sse2:ShiftRightLogical128BitLane(System.Runtime.Intrinsics.Vector128`1[ubyte],ubyte):System.Runtime.Intrinsics.Vector128`1[ubyte]]
       vmovaps  xmm0, xmmword ptr [rsp+0x30]
       vpextrb  eax, xmm0, 0

G_M000_IG03:                ;; offset=0x0030
       add      rsp, 72
       ret      
; Total bytes of code: 53
```

RyuJIT now recognizes many more cases like this example, and substitutes the variable argument with its constant value, thus generating the accelerated code.

Here's what the new code generation looks like for the above example:

```asm
; Method Program:Test1():ubyte (FullOpts)
G_M11031_IG01:  ;; offset=0x0000

G_M11031_IG02:  ;; offset=0x0000
       vxorps   xmm0, xmm0, xmm0
       vpsrldq  xmm0, xmm0, 1
       vpextrb  eax, xmm0, 0

G_M11031_IG03:  ;; offset=0x000F
       ret      
; Total bytes of code: 16
```

## Constant Folding for Floating Point and SIMD Operations

Constant folding is an existing optimization in RyuJIT where expressions that can be computed at compile-time are replaced with the constants they evaluate to, thus eliminating computations at runtime.

Examples of the many new capabilities:

- Floating-point binary operations, where one of the operands is a constant:
  - `x + NaN` is now folded into `NaN`.
  - `x * 1.0` is now folded into `x`.
  - `x + -0` is now folded into `x`.
- Hardware intrinsics, for example, assuming `x` is a `Vector<T>`:
  - `x + Vector<T>.Zero` is now folded into `x`.
  - `x & Vector<T>.Zero` is now folded into `Vector<T>.Zero`.
  - `x & Vector<T>.AllBitsSet` is now folded into `x`.

Check out [dotnet/runtime #103206](https://github.com/dotnet/runtime/pull/103206) and [dotnet/runtime #103143](https://github.com/dotnet/runtime/pull/103143) for a deeper dive.