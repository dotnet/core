# .NET Runtime in .NET 9 Preview 2 Release Notes

.NET 9 Preview 2 includes several new runtime features. We focused on the following areas:

- RyuJIT enhancements
- Arm64 vectorization

Runtime updates in .NET 9 Preview 2:

- [Discussion](https://aka.ms/dotnet/9/preview2)
- [What's new in .NET 9](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) documentation

.NET 9 Preview 2:

- [Discussion](https://aka.ms/dotnet/9/preview2)
- [Release notes](README.md)


## Loop Optimizations: IV Widening

Improving code generation for loops is a priority for .NET 9. [Preview 1](../preview1/runtime.md) brought numerous improvements to RyuJIT's existing loop optimizations, and Preview 2 introduces a new optimization to x64 systems: induction variable (IV) widening (see [dotnet/runtime #97865](https://github.com/dotnet/runtime/pull/97865)). An IV is a variable whose value changes as the containing loop iterates; in the classic for-loop construct -- `for (int i = 0; i < 10; i++)` -- `i` is an IV. Being able to analyze how an IV's value evolves over its loop's iterations can enable compilers to produce more performant code for related expressions.

Array accesses in .NET are ripe for this optimization. Consider the following example:
```csharp
static int Sum(int[] arr)
{
    int sum = 0;
    for (int i = 0; i < arr.Length; i++)
    {
        sum += arr[i];
    }

    return sum;
}
```

Our index variable, `i`, is 4 bytes in size. At the assembly level, we typically use 64-bit registers to hold array indices on x64, as this allows us to access the entire addressable range of memory. Thus, RyuJIT would previously generate code that zero-extends `i` to 8 bytes for the array access, but continue to treat `i` as a 4-byte integer elsewhere; extending `i` to 8 bytes requires an additional instruction on x64. With IV widening, RyuJIT now widens `i` to 8 bytes throughout the loop, omitting the zero extension. Considering how common looping over arrays is in .NET, the benefits of this instruction removal quickly add up. In our testing, IV widening kicked in for 14% to 23% of compiled loops, depending on the test suite. Zero extensions are already handled efficiently on ARM64 when addressing memory, so we've decided not to perform this optimization when generating ARM64 instructions.

IV widening is just one of many optimizations we can implement, now that RyuJIT can analyze induction variables. Stay tuned for more!

## Inlining Improvements for NativeAOT: Thread-Local Storage Accesses

Method inlining is one of RyuJIT's most powerful optimizations. When compiling a method with optimizations on, RyuJIT determines at each callsite whether it would be profitable to remove the call, and instead place the body of the callee "in-line" in the caller. This removes the overhead of the method call, and potentially enables more optimizations (including more inlining). One of our ongoing goals for RyuJIT's inliner is to remove as many restrictions that block a method from being inlined as possible. For Preview 2, we've enabled inlining of accesses to thread-local statics.

When you declare a member of a class static, exactly one instance of the member exists across all instances of the class; in other words, the member is "shared" by all instances of the class. In multithreaded programs, safely accessing this shared data usually requires using a concurrency primitive like a lock, which comes with a performance penalty. If the value of a static member is unique to each thread, making that value thread-local can improve performance: This ensures the static is placed in thread-local storage, eliminating the need for a concurrency primitive to safely access the static from its containing thread.

Previously, accesses to thread-local statics in NativeAOT-compiled programs required RyuJIT to emit a call into the runtime to get the base address of the thread-local storage. Now, RyuJIT can inline these calls, resulting in far fewer instructions to access this data. The final instruction sequence varies depending on the target platform. [dotnet/runtime #97413](https://github.com/dotnet/runtime/pull/97910) has a great example of the improved codegen this change brings. With Preview 2, RyuJIT does this inlining on Windows x64, Linux x64, and Linux ARM64.

## PGO Improvements: Type Checks and Casts

.NET 8 enabled dynamic profile-guided optimization (PGO) -- one of RyuJIT's most exciting features -- by default, and Preview 2 expands RyuJIT's PGO implementation to profile more code patterns. When tiered compilation is enabled, RyuJIT already inserts instrumentation into your program to profile its behavior; when re-compiling with optimizations, RyuJIT leverages the profile it built at runtime to make decisions specific to the current run of your program. In Preview 2, RyuJIT will now use PGO data to improve the performance of type checks by default.

Determining the type of an object requires a call into the runtime, which comes with a performance penalty. When the type of an object needs to be checked, RyuJIT emits this call for the sake of correctness -- compilers usually cannot rule out any possibilities, even if they seem improbable. However, if PGO data suggests an object is likely to be a specific type, RyuJIT will now emit a fast path that cheaply checks for that type, falling back on the slow path of calling into the runtime if necessary. For example, consider the following example method:

```csharp
bool IsList<T>(IEnumerable<T> source) => source is IList<T>;
```

If PGO data suggests `source` is almost always an integer array, RyuJIT will emit code that looks like the following:

```csharp
if (source is int[])
{
    return true;
}
else
{
    return slow_path(); // Let the runtime figure it out
}
```

[dotnet/runtime #96597](https://github.com/dotnet/runtime/pull/96597) highlights dozens of benchmark improvements across our supported platforms.

## ARM64 Vectorization in .NET Libraries

Preview 2 enables a new `EncodeToUtf8` implementation that takes advantage of RyuJIT's ability to emit multi-register load/store instructions on ARM64. This allows programs to process larger chunks of data with fewer instructions -- by vectorizing an API as foundational as text encoding, .NET programs across various domains may enjoy throughput improvements on ARM64 hardware with support for these features. [dotnet/runtime #95513](https://github.com/dotnet/runtime/pull/95513) links to several [benchmarks](https://github.com/dotnet/perf-autofiling-issues/issues/27114) improved by this change, with some cutting their execution time by more than half.