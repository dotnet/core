# .NET Runtime in .NET 9 Preview 3 - Release Notes

.NET 9 Preview 3 enables several new runtime features:

- Faster exception handling
- Inlining Improvements: Shared Generics with Runtime Lookups

Runtime updates in .NET 9 Preview 3:

- [What's new in .NET 9](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) documentation

.NET 9 Preview 3:

- [Discussion](https://aka.ms/dotnet/9/preview3)
- [Release notes](./README.md)
- [SDK release notes](./sdk.md)
- [Libraries release notes](./libraries.md)

## Faster exceptions

We have adopted a new exception handling approach for CoreCLR. It improves the performance of exception handling 2 to 4 times in our exception handling microbenchmarks. It was implemented on all platforms and architectures except for Windows x86 (32-bit). The new implementation is based on the NativeAOT exception handling model.

Here are several links to the perf improvements measured in the perf lab:

* Windows x64: https://github.com/dotnet/perf-autofiling-issues/issues/32280
* Windows Arm64: https://github.com/dotnet/perf-autofiling-issues/issues/32016
* Linux x64: https://github.com/dotnet/perf-autofiling-issues/issues/31367
* Linux Arm64: https://github.com/dotnet/perf-autofiling-issues/issues/31631

In preview 3, this new implementation has been enabled by default after making sure there are no known issues with either running or debugging .NET applications except for few minor ones that will be fixed in the next preview.

Here is a list of remaining known issues:

* WinDbg doesn't break on a first chance managed software exception. As a temporary mitigation, it is possible to set a breakpoint at the native `coreclr!DispatchManagedException`.
* Exception interception doesn't work on Windows Arm64 and Unix.
* Visual studio doesn't break on failed Asserts when debugging unit tests. With the legacy exception handling, it breaks on those and pops up a "user unhandled exception" dialog. The tests still execute correctly though.

These issues are already fixed in the main branch and the fixes will be included in preview 4.

If any of the issues listed above are blocking you or you hit a corner case that our testing has not uncovered, there is a way to switch back to the old legacy exception handling by either setting the `System.Runtime.LegacyExceptionHandling` [runtime configuration option](https://learn.microsoft.com/dotnet/core/runtime-config/#msbuild-properties) to true or setting the `DOTNET_LegacyExceptionHandling` environment variable to 1. This is a temporary configuration switch that will be removed in future.

We want to hear about any issues that people run into with the new exception handling.

## Inlining Improvements: Shared Generics with Runtime Lookups

Method inlining is one of RyuJIT's most effective optimizations, and we are always looking for opportunities to expand its capabilities. With Preview 3, RyuJIT can now inline shared generic methods that require runtime lookups.

Let's look at an example; consider the following methods:

```csharp
static bool Test<T>() => Callee<T>();

static bool Callee<T>() => typeof(T) == typeof(int);
```

When `T` is a reference type like `string`, the runtime creates special instantiations of `Test` and `Callee` that are shared by all ref-type `T`s (this is what we mean by "shared generics"). To make this work, the runtime builds dictionaries mapping generic types to internal types. These dictionaries are specialized per generic type (or per generic method), and are accessed at runtime to obtain information about `T` and types dependent on `T`. Historically, code compiled just-in-time was only capable of performing these runtime lookups against the root method's dictionary. This meant RyuJIT could not inline `Callee` into `Test`, as there was no way for the inlined code from `Callee` to access the proper dictionary, despite the fact that the two methods were instantiated over the same type.

Preview 3 lifts this restriction by freely enabling runtime type lookups in callees, meaning RyuJIT can now inline methods like `Callee` into `Test`.

Suppose we call `Test<string>` in another method. In pseudocode, the inlining looks like this:

```csharp
static bool Test<string>() => typeof(string) == typeof(int);
```

That type check can be computed during compilation, so the final code looks like this:

```csharp
static bool Test<string>() => false;
```

Note that the decision to inline `Callee` might enable the call to `Test<string>` to be inlined as well, and so on -- improvements to RyuJIT's inliner can have compound effects on other inlining decisions, resulting in significant performance wins. Out of [hundreds](https://github.com/dotnet/runtime/pull/99265#issuecomment-2007077353) of benchmark improvements, [at least eighty](https://gist.github.com/EgorBo/b6424f7118ff176682f63875d89fb52e) improved by ten percent or more! For more details, check out [#99265](https://github.com/dotnet/runtime/pull/99265) in [dotnet/runtime](https://github.com/dotnet/runtime).
