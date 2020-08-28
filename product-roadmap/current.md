# .NET Product Roadmap

This document provides a peek into the work we've planned for .NET through December 2020.

The .NET product roadmap communicates project priorities for evolving and extending the scope of the product. New product experiences and features will include changes in various [layers of the product](../Documentation/core-repos.md), in some combination of the runtime, framework, language compilers and tools. Each component may have its own component-level roadmap that is available in the repository for that component.

Items in each section include the following icons:

- ![In Planning](media/status-in-planning.png "In Planning icon") - In Planning
- ![In Progress](media/status-in-progress.png "In Progress icon") - In Progress
- ![Completed](media/status-completed.png "Completed icon") - Completed

## ASP.NET

- ![In Progress](media/status-in-progress.png "In Progress icon") [Blazor](https://github.com/dotnet/aspnetcore/issues/21514)
  - ![Completed](media/status-completed.png "Completed icon") [Move Blazor to .NET 5](https://github.com/dotnet/aspnetcore/issues/20519)
  - ![Completed](media/status-completed.png "Completed icon") [CSS Isolation](https://github.com/dotnet/aspnetcore/issues/10170)
  - ![Completed](media/status-completed.png "Completed icon") [Support IAsyncDisposable](https://github.com/dotnet/aspnetcore/issues/9960)
  - ![Completed](media/status-completed.png "Completed icon") [Lazy loading of application areas](https://github.com/dotnet/aspnetcore/issues/5465)
  - ![Completed](media/status-completed.png "Completed icon") [Add focus support to BrowserRenderer](https://github.com/dotnet/aspnetcore/issues/17472)
  - ![Completed](media/status-completed.png "Completed icon") [Protected Browser Storage](https://github.com/dotnet/aspnetcore/issues/18755)
  - ![In Progress](media/status-in-progress.png "In Progress icon") [Build performance improvements for Blazor](https://github.com/dotnet/aspnetcore/issues/22566)
  - ![Completed](media/status-completed.png "Completed icon") [Blazor performance optimizations](https://github.com/dotnet/aspnetcore/issues/22432)
  - ![In Progress](media/status-in-progress.png "In Progress icon") [How to upload files in Blazor App](https://github.com/dotnet/aspnetcore/issues/12205)
  - ![In Progress](media/status-in-progress.png "In Progress icon") [Required parameters to blazor components (runtime check)](https://github.com/dotnet/aspnetcore/issues/11815)

## EF

[EF Core 5.0 plan](https://docs.microsoft.com/ef/core/what-is-new/ef-core-5.0/plan)

- ![Completed](media/status-completed.png "Completed icon") Fully transparent many-to-many mapping by convention
- ![Completed](media/status-completed.png "Completed icon") Many-to-many navigation properties (a.k.a "skip navigations")
- ![Completed](media/status-completed.png "Completed icon") Table-per-type (TPT) inheritance mapping
- ![Completed](media/status-completed.png "Completed icon") Filtered Include
- ![Completed](media/status-completed.png "Completed icon") Split Include
- ![Completed](media/status-completed.png "Completed icon") Required one-to-one dependents
- ![Completed](media/status-completed.png "Completed icon") Rationalize ToTable, ToQuery, ToView, FromSql, etc.
- ![Completed](media/status-completed.png "Completed icon") General query enhancements
- ![Completed](media/status-completed.png "Completed icon") Migrations and deployment experience
- ![Completed](media/status-completed.png "Completed icon") EF Core platforms experience
- ![Completed](media/status-completed.png "Completed icon") Performance improvements

## ML.NET

## Spark

- ![Completed](media/status-completed.png "Completed icon") Improve debugging experience
- ![In Progress](media/status-in-progress.png "In Progress icon") Spark 2.4 API compatibility
- ![In Progress](media/status-in-progress.png "In Progress icon") Spark 3.0 API compatibility
- ![In Planning](media/status-in-planning.png "In Planning icon") .NET Core project templates for .NET for Spark
- ![In Planning](media/status-in-planning.png "In Planning icon") VS deploy for .NET for Spark jobs

## Runtime

- ![Completed](media/status-completed.png "Completed icon") [Improving P95+ latency](https://github.com/dotnet/runtime/issues/37534)
- ![In Progress](media/status-in-progress.png "In Progress icon") [Improving ARM64 Performance in .NET 5.0 – Closing the gap with x64](https://github.com/dotnet/runtime/issues/35853)
- ![In Progress](media/status-in-progress.png "In Progress icon") [Support Windows ARM64](https://github.com/dotnet/runtime/issues/36699)
- ![In Progress](media/status-in-progress.png "In Progress icon") [Support Single-File Apps](https://github.com/dotnet/runtime/issues/36590)
- ![Completed](media/status-completed.png "Completed icon") [Support WinRT APIs in .NET 5](https://github.com/dotnet/runtime/issues/35318)
- ![Completed](media/status-completed.png "Completed icon") [Support WebAssembly (Mono Runtime)](https://github.com/dotnet/runtime/issues/38367)

## .NET Interactive

[Details](https://github.com/dotnet/interactive/issues/392)

- ![Completed](media/status-completed.png "Completed icon") Multi Language support for Jupyter Notebooks (C#, F#, PowerShell)
- ![In Progress](media/status-in-progress.png "In Progress icon") .NET Notebooks support in VS code Support
- ![In Progress](media/status-in-progress.png "In Progress icon") Improve Productivity
- ![In Progress](media/status-in-progress.png "In Progress icon") .NET Interactive for makers
- ![Completed](media/status-completed.png "Completed icon") [Documentation](https://github.com/dotnet/interactive/tree/main/docs) - done but always improving
- ![In Planning](media/status-in-planning.png "In Planning icon") Automation / DevOps

Please see the following links to view work items and themes across:
- ![Completed](media/status-completed.png "Completed icon") [Preview 3](https://github.com/dotnet/interactive/issues/507)
- ![In Progress](media/status-in-progress.png "In Progress icon") [Preview 4](https://github.com/dotnet/interactive/issues/508)
- [.NET Interactive GA](https://github.com/dotnet/interactive/issues/509)

## Languages

[Language Feature Status](https://github.com/dotnet/roslyn/blob/master/docs/Language%20Feature%20Status.md)

### C# 9

- ![Completed](media/status-completed.png "Completed icon") [Target-typed new](https://github.com/dotnet/csharplang/issues/100)  
- ![In Progress](media/status-in-progress.png "In Progress icon") [Relax ordering of `ref` and `partial` modifiers](https://github.com/dotnet/csharplang/issues/946)
- ![In Progress](media/status-in-progress.png "In Progress icon") [Parameter null-checking](https://github.com/dotnet/csharplang/issues/2145)
- ![Completed](media/status-completed.png "Completed icon") [Skip locals init](https://github.com/dotnet/csharplang/issues/1738)
- ![Completed](media/status-completed.png "Completed icon") [Lambda discard parameters](https://github.com/dotnet/csharplang/issues/111)
- ![Completed](media/status-completed.png "Completed icon") [Native ints](https://github.com/dotnet/csharplang/issues/435)
- ![Completed](media/status-completed.png "Completed icon") [Attributes on local functions](https://github.com/dotnet/csharplang/issues/1888)
- ![Completed](media/status-completed.png "Completed icon") [Function pointers](https://github.com/dotnet/csharplang/issues/191)
- ![Completed](media/status-completed.png "Completed icon") [Pattern matching improvements](https://github.com/dotnet/csharplang/issues/2850)
- ![Completed](media/status-completed.png "Completed icon") [Static lambdas](https://github.com/dotnet/csharplang/issues/275)
- ![Completed](media/status-completed.png "Completed icon") [Records](https://github.com/dotnet/csharplang/issues/39)
- ![Completed](media/status-completed.png "Completed icon") [Target-typed conditional](https://github.com/dotnet/csharplang/issues/2460)
- ![In Progress](media/status-in-progress.png "In Progress icon") [Covariant](https://github.com/dotnet/csharplang/issues/49) [Returns](https://github.com/dotnet/csharplang/issues/2844)
- ![Completed](media/status-completed.png "Completed icon") [Extension GetEnumerator](https://github.com/dotnet/csharplang/issues/3194)
- ![Completed](media/status-completed.png "Completed icon") [Module initializers](https://github.com/dotnet/csharplang/blob/master/proposals/csharp-9.0/module-initializers.md)
- ![Completed](media/status-completed.png "Completed icon") [Extending Partial](https://github.com/dotnet/csharplang/blob/master/proposals/csharp-9.0/extending-partial-methods.md)
- ![Completed](media/status-completed.png "Completed icon") [Top-level statements](https://github.com/dotnet/csharplang/blob/master/proposals/csharp-9.0/top-level-statements.md)

### C# Next

- ![In Progress](media/status-in-progress.png "In Progress icon") [Caller expression attribute](https://github.com/dotnet/csharplang/issues/287)
- ![In Progress](media/status-in-progress.png "In Progress icon") [Generic attributes](https://github.com/dotnet/csharplang/issues/124)
- ![Completed](media/status-completed.png "Completed icon") [Default in deconstruction](https://github.com/dotnet/roslyn/pull/25562)
- ![In Progress](media/status-in-progress.png "In Progress icon") [Constant Interpolated Strings](https://github.com/dotnet/csharplang/issues/2951)

### Visual Basic 16.0

- ![Completed](media/status-completed.png "Completed icon") [Line continuation comments](https://github.com/dotnet/vblang/issues/65)
- ![Completed](media/status-completed.png "Completed icon") [Relax null-coalescing operator requirements](https://github.com/dotnet/vblang/issues/339)

### F# 5

- ![Completed](media/status-completed.png "Completed icon") `nameof` support
- ![Completed](media/status-completed.png "Completed icon") String interpolation
- ![Completed](media/status-completed.png "Completed icon") Open type declarations
- ![Completed](media/status-completed.png "Completed icon") Improved F# quotations: constraints retained in quotation metadata
- ![Completed](media/status-completed.png "Completed icon") Improved Computation Expressions: Applicative forms
- ![Completed](media/status-completed.png "Completed icon") Improved Computation Expressions: Overloads for custom keywords
- ![Completed](media/status-completed.png "Completed icon") Consistent slicing for FSharp.Core collection types
- ![Completed](media/status-completed.png "Completed icon") Fixed-index slicing for 3D and 4D arrays
- ![Completed](media/status-completed.png "Completed icon") Interfaces can be implemented at different generic instantiations
- ![Completed](media/status-completed.png "Completed icon") Improved .NET interop: consumption support for Default Interface Members
- ![Completed](media/status-completed.png "Completed icon") Improved .NET interop: type-directed implicit conversions for `Nullable` value types
- ![In Progress](media/status-in-progress.png "In Progress icon") Support for reverse indexes in collection types

## CLI

## Desktop

### WPF

### WinForms

## Xamarin
