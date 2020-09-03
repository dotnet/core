# .NET Product Roadmap

This document provides a peek into the work we've planned for .NET through __December 2020__.

The .NET product roadmap communicates project priorities for evolving and extending the scope of the product. New product experiences and features will include changes in various [layers of the product](../Documentation/core-repos.md), in some combination of the runtime, framework, language compilers and tools. Each component may have its own component-level roadmap that is available in the repository for that component.

These are some of the high level themes for the .NET 5.0 release. A more comprehensive list of the work we’re doing organized by technology can be found further below in this document.
- Developers can build great cloud infrastructure components with .NET.
- Developers can build great mobile apps for new devices with .NET 5 – we will support not only the latest in iOS and Android, but unify the platform and deliver first-class support for delivering cross-platform applications.
- .NET 5.0 has excellent fundamentals - continue to deliver on reliability, performance, diagnosability, compliance, security, acquisition and deployment.  

These are some key moments in our .NET 5.0 roadmap. 

| Date      | Moment/Rally Point | Key Message     |
| :-------- | :----------------- | :-------------- |
|  Sep 2020 | Ignite             |                 |
|  Nov 2020 | .NET Conf          | .NET 5.0 Launch |
|  Nov 2020 | **.NET 5.0 GA**    |                 |

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

## gRPC

- ![Completed](media/status-completed.png "Completed icon") gRPC-web
- ![Completed](media/status-completed.png "Completed icon") gRPC-web client support in Blazor
- ![Completed](media/status-completed.png "Completed icon") Improve gRPC server performance (to match C++/Go)
- ![Completed](media/status-completed.png "Completed icon") Use Span APIs in protobuf marshaller (to reduce allocations)
- ![Completed](media/status-completed.png "Completed icon") Configurable HTTP/2 PING frames
- ![Completed](media/status-completed.png "Completed icon") Instrument gRPC for use with OpenTelemetry
- ![Completed](media/status-completed.png "Completed icon") Add support for HttpSysServer
- ![In Progress](media/status-in-progress.png "In Progress icon") Add support for IIS
- ![In Progress](media/status-in-progress.png "In Progress icon") Introduce additional transports (e.g., Unix-domain sockets, Windows Named Pipes)

## Tye

- ![Completed](media/status-completed.png "Completed icon") Run many services with one command
- ![Completed](media/status-completed.png "Completed icon") Use dependencies in containers
- ![Completed](media/status-completed.png "Completed icon") Discover addresses of other services using simple conventions
- ![Completed](media/status-completed.png "Completed icon") Automatically containerizing .NET applications
- ![Completed](media/status-completed.png "Completed icon") Deploy to Kubernetes
- ![Completed](media/status-completed.png "Completed icon") Generating Kubernetes manifests with minimal knowledge or configuration
- ![Completed](media/status-completed.png "Completed icon") Using the same conventions as development to keep it consistent
- ![Completed](media/status-completed.png "Completed icon") Support Azure Functions in development
- ![In Progress](media/status-in-progress.png "In Progress icon") VS Code tooling
 
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
 
- ![Completed](media/status-completed.png "Completed icon") Local GPU training for Image Classification in Model Builder
- ![Completed](media/status-completed.png "Completed icon") Add Ranking scenario to local ML.NET AutoML API
- ![Completed](media/status-completed.png "Completed icon") Add new algorithm and root cause detection for anomaly detection
- ![Completed](media/status-completed.png "Completed icon") Add time series seasonality and de-seasonality
- ![In Progress](media/status-in-progress.png "In Progress icon") GA Model Builder in Visual Studio
- ![In Progress](media/status-in-progress.png "In Progress icon") Add Azure Object Detection training to Model Builder
- ![In Progress](media/status-in-progress.png "In Progress icon") Add local Image Classification training scenario to ML.NET CLI
- ![In Progress](media/status-in-progress.png "In Progress icon") Add advanced options for data loading in Model Builder
- ![In Progress](media/status-in-progress.png "In Progress icon") Improve Azure training from Model Builder (better errors, multi-GPU multi-machine, reduced overhead)
- ![In Planning](media/status-in-planning.png "In Planning icon") Add local Ranking scenario to tooling
- ![In Progress](media/status-in-progress.png "In Progress icon") Add support for re-opening Model Builder and adding multiple models to a project
- ![In Planning](media/status-in-planning.png "In Planning icon") Add integration with MLOps
- ![In Planning](media/status-in-planning.png "In Planning icon") Support all local and Azure AutoML supported scenarios in tooling

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

### Visual Basic

- ![Completed](media/status-completed.png "Completed icon") .NET Core appropriate features of the Visual Basic Runtime (Microsoft.VisualBasic.dll) ported to .NET 5.0
- ![Completed](media/status-completed.png "Completed icon") Single instance application support
- ![In Progress](media/status-in-progress.png "In Progress icon") WinForms support in Visual Studio (designer and events)
- ![In Progress](media/status-in-progress.png "In Progress icon") Visual Basic Application Models ported to .NET 5.0
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

## CLI/SDK and MSBuild


- ![Completed](media/status-completed.png "Completed icon") [Changes to Target Framework Moniker - TFM](https://github.com/dotnet/designs/blob/master/accepted/2020/net5/net5.md)
- ![In Planning](media/status-in-planning.png "In Planning icon") Xamarin runs on .NET and via the CLI
- ![In Progress](media/status-in-progress.png "In Progress icon") [Optional Workload infrastructure](https://github.com/dotnet/designs/blob/107b50feec105b7c2b67b37acb322054e2255df5/accepted/2020/workloads/workloads.md)
- ![In Planning](media/status-in-planning.png "In Planning icon") Acquisition improvements
- ![In Progress](media/status-in-progress.png "In Progress icon") Improvements to templates (performance and list output)
- ![In Planning](media/status-in-planning.png "In Planning icon") Improvements to tab CLI tab completion and parsing
- ![Completed](media/status-completed.png "Completed icon") [Online Structured Log Viewer for MSBuild](https://live.msbuildlog.com)
- ![Completed](media/status-completed.png "Completed icon") [Solution filter support in MSBuild](https://github.com/dotnet/msbuild/issues/4097)
- ![Completed](media/status-completed.png "Completed icon") [Low priority builds for MSBuild](https://github.com/dotnet/msbuild/pull/4162)
- ![In Progress](media/status-in-progress.png "In Progress icon") [Resolve Assembly References (RAR) pre-built cache](https://github.com/dotnet/msbuild/issues/5247)
- ![In Progress](media/status-in-progress.png "In Progress icon") [Share RAR cache between projects](https://github.com/dotnet/msbuild/blob/master/documentation/specs/rar-as-service.md)

## Desktop

### WPF

- ![In Progress](media/status-in-progress.png "In Progress icon") WPF Integration with .NET 5
- ![In Progress](media/status-in-progress.png "In Progress icon") Accessibility updates on app sample bugs

### WinForms

-	![In Progress](media/status-in-progress.png "In Progress icon") Visual Studio WinForms .NET Core Designer
-	![In Progress](media/status-in-progress.png "In Progress icon") Accessibility enhancements to support common UIA patterns so that Accessibility tools (like Narrator and others) can more easily interact with our controls
-	![In Progress](media/status-in-progress.png "In Progress icon") Customer reported issues and migration blockers
-	![In Progress](media/status-in-progress.png "In Progress icon") Keep pace with changes in the underlying OS to ensure compatibility with the latest changes in Win10.

## Xamarin
- ![Completed](media/status-completed.png "Completed icon") [Android 11 / API 30 Support](https://docs.microsoft.com/en-us/xamarin/android/release-notes/11/11.0)
- ![Completed](media/status-completed.png "Completed icon") [Android smaller APK sizes](https://docs.microsoft.com/en-us/xamarin/android/release-notes/11/11.0#smaller-app-package-sizes)
- ![In Progress](media/status-in-progress.png "In Progress icon") [Xcode 12 and iOS 14 Support](https://github.com/xamarin/xamarin-macios/issues/8931)
- ![In Progress](media/status-in-progress.png "In Progress icon") Hot Restart for Android
- ![In Progress](media/status-in-progress.png "In Progress icon") AndroidX and Google Play Services Bindings Updates
- ![In Progress](media/status-in-progress.png "In Progress icon") .NET 6 Support
- ![In Planning](media/status-in-planning.png "In Planning icon") Xamarin.Essentials integration to .NET 6 BCL (System namespace)

### Xamarin.Forms 5
- ![Completed](media/status-completed.png "Completed icon") [AppTheme aka Dark Mode support](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/user-interface/theming/system-theme-changes)
- ![In Progress](media/status-in-progress.png "In Progress icon") [CarouselView](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/user-interface/carouselview/)
- ![In Progress](media/status-in-progress.png "In Progress icon") [Drag-and-drop Gestures](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/app-fundamentals/gestures/drag-and-drop)
- ![In Progress](media/status-in-progress.png "In Progress icon") [Gradient and Solid Brushes](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/user-interface/brushes/)
- ![In Progress](media/status-in-progress.png "In Progress icon") [Shapes and Paths](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/user-interface/shapes/)
- ![In Progress](media/status-in-progress.png "In Progress icon") [SwipeView](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/user-interface/swipeview)

### Xamarin.Forms vNext (.NET MAUI)
- ![In Progress](media/status-in-progress.png "In Progress icon") [Slim Renderers](https://github.com/dotnet/maui/issues/28) - performance improvements, decouple from bindable, and introduce interfaces 
- ![In Planning](media/status-in-planning.png "In Planning icon") WinUI 3 Support - [testing integration](https://github.com/xamarin/Xamarin.Forms/pull/11955)
