# .NET Runtime in .NET 9 Preview 1 Release Notes

.NET 9 Preview 1 includes several new runtime features. We focused on the following areas:

- Native AOT
- JIT

Runtime updates in .NET 9 Preview 1:
* [Discussion](https://github.com/dotnet/runtime/discussions/98372)
* [What's new in .NET 9](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) documentation.

.NET 9 Preview 1:
* [Discussion](https://aka.ms/dotnet/9/preview1)
* [Release notes](README.md) 

## Native AOT: Object Writer

Object writer is a component we use to write debug info into symbols files for native AOT. For .NET 7 and 8, we us an LLVM-based library called objwriter for this purpose. In Preview 1, this functionality has been replaced by a new C# implementation, implemented by [@filipnavara](https://github.com/filipnavara). The C# implementation enables us to remove a dependency from the native AOT toolchain.

This change doesn't significantly affect the output (the actual executable code is completely unaffected), but should be a slightly faster and more lightweight implementation. The output debugging info looks to be at least as good as the old debug info. The performance also looks at least as good, and there is opportunity to improve it more.

We want to hear about any issues that people run into with the new object writer. Please share those, however small.

While we expect the results to be as good or better than the old object writer, we will continue to ship the old writer as a fallback until (and including) Preview 4 while we test it in the real world. To use the old object writer instead, set the environment variable `DOTNET_USE_LLVM_OBJWRITER=1`.

## JIT: Loop Optimizations

RyuJIT already supports multiple powerful loop optimizations, and we plan to expand these capabilities for .NET 9. For Preview 1, we've focused on improving the applicability of existing optimizations by refactoring how loops are represented in RyuJIT. This new graph-based representation is simpler and more effective than the old lexical representation, enabling RyuJIT to recognize -- and thus optimize -- more loops. 

Here's a quick breakdown of the improvements:

* **Loop hoisting** -- finds expressions that don't change in value as the containing loop iterates, and moves (or "hoists") the expressions to above the loop so they evaluate at most once. In our test collections, we saw up to 35.8% more hoisting performed with the new loop representation.
* **Loop cloning** -- determines if a conditional check (like a bounds check on an array) inside a loop can be safely eliminated for some of its iterations, and creates a "fast" copy of the loop without the check. At runtime, execution switches between the normal and fast copy of the loop depending on if the check is needed. With the new loop representation, we saw up to 7.3% more loop cloning.
* **Loop alignment** -- improves instruction cache performance by adjusting the offset of a loop to begin at a cache line. During execution, modern CPUs fetch instructions from memory in multi-byte chunks, and place them in a small, high-speed cache. If a loop crosses cache lines, the CPU might have to evict and re-cache the loop's instructions with every iteration, causing unnecessary stalling; for hot loops, these performance penalties quickly add up. Aligning a loop to the beginning of a cache line may significantly improve the instruction cache's hit rate. With the new loop representation, we saw about 5% more loops aligned across our test collections.

This is just a snippet of the improvements RyuJIT's new loop representation brings. To take a closer look at the loop optimization work planned for .NET 9, check out [dotnet/runtime #93144](https://github.com/dotnet/runtime/issues/93144).

## JIT: ARM64 SVE/SVE2 Support

We are adding support for the Scalable Vector Extension (SVE) instruction set among many [ARM64-specific improvements](https://github.com/dotnet/runtime/issues/94464). On SVE-enabled hardware, these instructions enable flexible vectorization of high-performance workloads. Much of this flexibility comes from the fact that vector registers can be used with a variety of widths, ranging from 128 bits to 2048 bits. According to Arm Holdings, SVE was designed to accelerate workloads in relatively few domains, like machine learning and high-performance computing; [SVE2 extends the instruction set's applicability](https://developer.arm.com/documentation/102340/0100/Introducing-SVE2) to domains like computer vision, multimedia, and general-purpose software.

Supporting SVE/SVE2 in .NET requires work across the stack, starting in RyuJIT. We now support emitting many instruction encodings. You can track our progress in real time via [dotnet/runtime #94549](https://github.com/dotnet/runtime/issues/94549), or check out some of the [API proposals](https://github.com/dotnet/runtime/issues/93095#issuecomment-1778932195) that enable the SVE/SVE2 features we are considering for .NET 9.


## JIT: Register Allocator Improvements

Startup performance is a major focus for .NET 9, and profiling reveals RyuJIT spends a nontrivial amount of time in its register allocation phase. Effective register allocation is crucial for generating performant code, and RyuJIT leverages various heuristics to do so. When generating unoptimized code, we assume hot methods will eventually be recompiled with optimizations via tiered compilation, or optimized code won't be needed at all (such as when compiling debug builds); in the former case, it is especially important that RyuJIT prioritizes quick compilation over code quality to improve startup time. For Preview 1, RyuJIT now uses a faster, simpler approach to register allocation when compiling unoptimized code. In our testing, this change improves throughput by over 10% in some cases. Check out the [dotnet/runtime #96386](https://github.com/dotnet/runtime/pull/96386) to see the dramatic throughput improvements this brings.

## Community Contributions

Thanks to everyone for their contributions, as issues, PRs, and other types of engagement.

Notable contributions:

- [@a74nh](https://github.com/a74nh),  [@snickolls-arm](https://github.com/snickolls-arm), and [@SwapnilGaikwad](https://github.com/SwapnilGaikwad) for their ARM64 contributions to RyuJIT!
- [@MichalPetryka](https://github.com/MichalPetryka) for his contributions to RyuJIT and related functionality.

## Community Spotlight (Michał Petryka)

The `dotnet/runtime` repo community benefits from the work and passions of many developers. We'd like to recognize [Michał Petryka](https://github.com/MichalPetryka) for [his efforts](https://github.com/dotnet/runtime/pulls?q=author%3AMichalPetryka) on the runtime and library codebase.

In his own words:

<i>
Hello everybody, my name is Michał and I am from Warsaw, Poland.

My first experience with C# (and real programming too) was back in 2016 when I’ve stumbled upon a game development live-stream while browsing the internet out of boredom. Since then I’ve gone a long way with my skills, first using them with Unity and then moving onto library development with .NET Core 3.1 and later versions.

While I was doing it as a hobby before, now I am starting to do so professionally as I’ve recently finished school.

I’ve loved working in C# more than with any other language as it managed to be an amazing middle ground between languages like JavaScript or Python - which made me feel like they were hiding too much from me and ones like C or C++ - which on the other hand forced me to constantly worry about things like memory management and others.

I’ve always been interested in performance optimizations, which have also been the center of my contributions to .NET. At first, I’ve only commented on issues that affected me but after joining the DotNetEvolution and the C# Community Discord servers and seeing other contributors - both from the community and Microsoft - discuss their changes, I’ve started opening Pull Requests myself.

Thanks to the mentorship I’ve received from others, I’ve been able to have almost 40 PR of mine that targeted the dotnet/runtime repository be merged, all targeting various areas ranging from the C# runtime libraries to the C++ RyuJIT codebase (which is responsible for compiling C# to native code).

While working on such parts of .NET might seem scary at first, since a mistake done there could affect every single app there is, the extensive testing done on every contribution and the thorough reviews made by the code maintainers helped me ensure that my ideas could cause no issues for others.

As such, I’d like to invite everybody to join various .NET and C# communities - both the Discord servers mentioned before and other platforms - and to start contributing to .NET yourself, either via discussing your ideas with existing contributors, filing issues whenever you encounter any or making PRs when you think you have an idea how to fix an existing issue. Don’t be afraid of doing so, you’ll surely have others help you, just as they have helped me and anything you learn by doing so can then be shared with others that also need help!
</i>

These are the links to the Discord servers that he mentions:

- [C# Discord](https://discord.gg/csharp)
- [DotNetEvolution](https://aka.ms/dotnet-discord) 
