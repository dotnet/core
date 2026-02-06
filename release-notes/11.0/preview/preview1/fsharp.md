# F# in .NET 11 Preview 1 - Release Notes

.NET 11 Preview 1 carries the same compiler improvements as .NET 10.0.200. There are no new version-enabled language features for F# 11 yet — all compiler improvements and bug fixes described below have been carried into the .NET 11 Preview 1 as well as .NET 10.0.200 (stable).

Here's a summary of what's new in F# in this preview release:

- [Performance: Parallel compilation enabled by default](#compiler-performance)
- [Performance: Faster compilation of CE-heavy code](#faster-compilation-of-computation-expression-heavy-code)
- [New features: `--disableLanguageFeature`, `--typecheck-only` for FSI](#new-features)
- [Breaking changes: ML compatibility removal](#breaking-changes)
- [Bug fixes](#bug-fixes-and-other-improvements)

## Compiler Performance

### Parallel compilation — enabled by default

In [F# 10](https://learn.microsoft.com/en-us/dotnet/fsharp/whats-new/fsharp-10#parallel-compilation-in-preview), parallel compilation was available as a preview feature, requiring `LangVersion=Preview` and `Deterministic=false`. Starting with this release, `--parallelcompilation` is enabled by default for all users.

The feature bundles four phases: parallel reference resolution, graph-based type checking, parallel optimizations, and parallel IL code generation. Build time improvements will vary by project. If you encounter issues, you can opt out with `--parallelcompilation-`.

This is the culmination of a multi-year community effort. We want to thank [**safesparrow**](https://github.com/safesparrow), [**nojaf**](https://github.com/nojaf), and [**majocha**](https://github.com/majocha) for their contributions across [#13521](https://github.com/dotnet/fsharp/pull/13521), [#14494](https://github.com/dotnet/fsharp/pull/14494), [#14390](https://github.com/dotnet/fsharp/pull/14390), [#18998](https://github.com/dotnet/fsharp/pull/18998), and [#19028](https://github.com/dotnet/fsharp/pull/19028). The final push of making parallel compilation the default and making it work correctly with deterministic builds was done by majocha, kindly sponsored by the [**Amplifying F#**](https://amplifyingfsharp.io/) initiative.

### Faster compilation of computation expression-heavy code

The F# compiler uses deeply recursive functions to traverse typed trees. To prevent stack overflows, it employed a mechanism called `StackGuard`: a depth counter that, upon hitting an arbitrary threshold (100), would spawn a new .NET thread with a fresh stack. For code with deeply nested computation expressions, this led to excessive thread creation — compiling IcedTasks.Tests triggered over 55,000 thread switches in a single build.

[PR #18971](https://github.com/dotnet/fsharp/pull/18971) by [**majocha**](https://github.com/majocha) replaced the depth counter with `RuntimeHelpers.TryEnsureSufficientExecutionStack()`, which performs an actual stack probe and only creates a new thread when genuinely needed. The PR includes benchmarks showing improvements for synthetic CE-heavy scenarios. If your projects use `task { }`, `async { }`, or other computation expression builders with deep nesting, you may see faster builds.

## New features

### `--disableLanguageFeature`

The new `--disableLanguageFeature:<FeatureName>` CLI switch ([#19167](https://github.com/dotnet/fsharp/pull/19167)) allows selectively disabling specific language features. It is repeatable and also available as a `<DisableLanguageFeature>` MSBuild ItemGroup in your `.fsproj`.

This is a diagnostic switch — a tool in the workaround arsenal for working around edge-case bugs until they are fixed. It is not intended for permanently opting out of features you do not prefer. Tooling layers such as formatters and IDEs do not support the full set of feature combinations that disabling arbitrary features can produce.

### `--typecheck-only` for `dotnet fsi`

The `--typecheck-only` flag for F# Interactive scripts was introduced in .NET 10 ([#18687](https://github.com/dotnet/fsharp/pull/18687)), but was not working correctly with `#load` directives — making it unreliable for real-world scripts. With the fix in [#19048](https://github.com/dotnet/fsharp/pull/19048), it now correctly processes `#load`-ed scripts, making it ready for use. This allows type-checking `.fsx` files without execution — useful for CI validation and quick feedback loops, incl use via LLM coding agents.

## Breaking changes

### ML compatibility removal

F# began its life as an OCaml dialect running on .NET, and for over two decades the compiler carried compatibility constructs from that heritage — `.ml` and `.mli` source file extensions, the `#light "off"` directive for switching to whitespace-insensitive syntax, and flags like `--mlcompatibility`. These served the language well during its early years, providing a bridge for developers coming from the ML family.

With [PR #19143](https://github.com/dotnet/fsharp/pull/19143) by [**kerams**](https://github.com/kerams), that chapter comes to a close. This was a big undertaking — about 7,000 lines of legacy code removed across the compiler, parser, and test suite. This release removes:

- Support for `.ml` and `.mli` source files
- The `#light` and `#indent` directives
- The `--mlcompatibility`, `--light`, `--indentation-syntax`, `--no-indentation-syntax`, and `--ml-keywords` compiler flags

The keywords `asr`, `land`, `lor`, `lsl`, `lsr`, and `lxor` — previously reserved for ML compatibility — are now available as identifiers.

## Bug fixes and other improvements

- Fixed SRTP resolution regression causing FS0030 value restriction errors with advanced SRTP patterns used by popular libraries like FSharpPlus. ([#19218](https://github.com/dotnet/fsharp/pull/19218))
- Fixed runtime crash when using interfaces with unimplemented static abstract members as constrained type arguments. ([#19185](https://github.com/dotnet/fsharp/pull/19185))
- Fixed units-of-measure changes not invalidating incremental builds. ([#19050](https://github.com/dotnet/fsharp/pull/19050))
- Fixed FS3261 nullness warning on CLIEvent properties. ([#19221](https://github.com/dotnet/fsharp/pull/19221))
- Fixed PackageFSharpDesignTimeTools causing NETSDK1085 errors during `dotnet pack`. ([#18929](https://github.com/dotnet/fsharp/pull/18929))
- Visual Studio: F# package initialization moved to background thread. ([#18646](https://github.com/dotnet/fsharp/pull/18646))

...and many others.

F# updates:

- [F# release notes](https://learn.microsoft.com/dotnet/fsharp/whats-new/)
- [dotnet/fsharp repository](https://github.com/dotnet/fsharp)
