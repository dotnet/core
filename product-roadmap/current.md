# .NET 5 Product Roadmap

This document provides a peek into the work we've planned for .NET through December 2020.

The .NET product roadmap communicates project priorities for evolving and extending the scope of the product. New product experiences and features will include changes in various [layers of the product](../Documentation/core-repos.md), in some combination of the runtime, framework, language compilers and tools. Each component may have its own component-level roadmap that is available in the repository for that component.

Items in each section include the following icons:

- No icon - Planned
- ![In Progress](media/in-progress.png "In Progress icon") - In Progress
- ![Completed](media/completed.png "Completed icon") - Completed

## ASP.NET

- ![In Progress](media/in-progress.png "In Progress icon") [Blazor](https://github.com/dotnet/aspnetcore/issues/21514)
  - ![Completed](media/completed.png "Completed icon") [Move Blazor to .NET 5](https://github.com/dotnet/aspnetcore/issues/20519)
  - ![Completed](media/completed.png "Completed icon") [CSS Isolation](https://github.com/dotnet/aspnetcore/issues/10170)
  - ![Completed](media/completed.png "Completed icon") [Support IAsyncDisposable](https://github.com/dotnet/aspnetcore/issues/9960)
  - ![Completed](media/completed.png "Completed icon") [Lazy loading of application areas](https://github.com/dotnet/aspnetcore/issues/5465)
  - ![Completed](media/completed.png "Completed icon") [Add focus support to BrowserRenderer](https://github.com/dotnet/aspnetcore/issues/17472)
  - ![Completed](media/completed.png "Completed icon") [Protected Browser Storage](https://github.com/dotnet/aspnetcore/issues/18755)
  - ![In Progress](media/in-progress.png "In Progress icon") [Build performance improvements for Blazor](https://github.com/dotnet/aspnetcore/issues/22566)
  - ![Completed](media/completed.png "Completed icon") [Blazor performance optimizations](https://github.com/dotnet/aspnetcore/issues/22432)
  - ![In Progress](media/in-progress.png "In Progress icon") [How to upload files in Blazor App](https://github.com/dotnet/aspnetcore/issues/12205)
  - ![In Progress](media/in-progress.png "In Progress icon") [Required parameters to blazor components (runtime check)](https://github.com/dotnet/aspnetcore/issues/11815)

## EF

## ML.NET

## Runtime

- ![Completed](media/completed.png "Completed icon") [Improving P95+ latency](https://github.com/dotnet/runtime/issues/37534)
- ![In Progress](media/in-progress.png "In Progress icon") [Improving ARM64 Performance in .NET 5.0 – Closing the gap with x64](https://github.com/dotnet/runtime/issues/35853)
- ![In Progress](media/in-progress.png "In Progress icon") [Support Windows ARM64](https://github.com/dotnet/runtime/issues/36699)
- ![In Progress](media/in-progress.png "In Progress icon") [Support Single-File Apps](https://github.com/dotnet/runtime/issues/36590)
- ![Completed](media/completed.png "Completed icon") [Support WinRT APIs in .NET 5](https://github.com/dotnet/runtime/issues/35318)
- ![Completed](media/completed.png "Completed icon") [Support WebAssembly (Mono Runtime)](https://github.com/dotnet/runtime/issues/38367)

## .NET Interactive

## Languages

[Language Feature Status](https://github.com/dotnet/roslyn/blob/master/docs/Language%20Feature%20Status.md)

### C# 9

- ![Completed](media/completed.png "Completed icon") [Target-typed new](https://github.com/dotnet/csharplang/issues/100)  
- ![In Progress](media/in-progress.png "In Progress icon") [Relax ordering of `ref` and `partial` modifiers](https://github.com/dotnet/csharplang/issues/946)
- ![In Progress](media/in-progress.png "In Progress icon") [Parameter null-checking](https://github.com/dotnet/csharplang/issues/2145)
- ![Completed](media/completed.png "Completed icon") [Skip locals init](https://github.com/dotnet/csharplang/issues/1738)
- ![Completed](media/completed.png "Completed icon") [Lambda discard parameters](https://github.com/dotnet/csharplang/issues/111)
- ![Completed](media/completed.png "Completed icon") [Native ints](https://github.com/dotnet/csharplang/issues/435)
- ![Completed](media/completed.png "Completed icon") [Attributes on local functions](https://github.com/dotnet/csharplang/issues/1888)
- ![Completed](media/completed.png "Completed icon") [Function pointers](https://github.com/dotnet/csharplang/issues/191)
- ![Completed](media/completed.png "Completed icon") [Pattern matching improvements](https://github.com/dotnet/csharplang/issues/2850)
- ![Completed](media/completed.png "Completed icon") [Static lambdas](https://github.com/dotnet/csharplang/issues/275)
- ![Completed](media/completed.png "Completed icon") [Records](https://github.com/dotnet/csharplang/issues/39)
- ![Completed](media/completed.png "Completed icon") [Target-typed conditional](https://github.com/dotnet/csharplang/issues/2460)
- ![In Progress](media/in-progress.png "In Progress icon") [Covariant](https://github.com/dotnet/csharplang/issues/49) [Returns](https://github.com/dotnet/csharplang/issues/2844)
- ![Completed](media/completed.png "Completed icon") [Extension GetEnumerator](https://github.com/dotnet/csharplang/issues/3194)
- ![Completed](media/completed.png "Completed icon") [Module initializers](https://github.com/dotnet/csharplang/blob/master/proposals/csharp-9.0/module-initializers.md)
- ![Completed](media/completed.png "Completed icon") [Extending Partial](https://github.com/dotnet/csharplang/blob/master/proposals/csharp-9.0/extending-partial-methods.md)
- ![Completed](media/completed.png "Completed icon") [Top-level statements](https://github.com/dotnet/csharplang/blob/master/proposals/csharp-9.0/top-level-statements.md)

### C# Next

- ![In Progress](media/in-progress.png "In Progress icon") [Caller expression attribute](https://github.com/dotnet/csharplang/issues/287)
- ![In Progress](media/in-progress.png "In Progress icon") [Generic attributes](https://github.com/dotnet/csharplang/issues/124)
- ![Completed](media/completed.png "Completed icon") [Default in deconstruction](https://github.com/dotnet/roslyn/pull/25562)
- ![In Progress](media/in-progress.png "In Progress icon") [Constant Interpolated Strings](https://github.com/dotnet/csharplang/issues/2951)

### Visual Basic 16.0

- ![Completed](media/completed.png "Completed icon") [Line continuation comments](https://github.com/dotnet/vblang/issues/65)
- ![Completed](media/completed.png "Completed icon") [Relax null-coalescing operator requirements](https://github.com/dotnet/vblang/issues/339)

### F# 5

- ![Completed](media/completed.png "Completed icon") Complete the open type declarations implementation
- ![Completed](media/completed.png "Completed icon") Complete the nameof implementation
- ![Completed](media/completed.png "Completed icon") Address design questions/issues in string interpolation
- ![Completed](media/completed.png "Completed icon") Finish design for unamanged generic constraints
- ![Completed](media/completed.png "Completed icon") FSharp.Core is .NET Standard 2.0 only
- ![Completed](media/completed.png "Completed icon") Remove the preview attribute from non-slicing APIs in FSharp.Core

## CLI
