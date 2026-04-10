# F# in .NET 11 Preview 3 - Release Notes

Here's a summary of what's new in F# in this Preview 3 release:

- [New warning FS3884: function values in interpolated strings](#warning-fs3884-function-values-in-interpolated-strings)
- [Bug fixes and other improvements](#bug-fixes-and-other-improvements)

## Warning FS3884: function values in interpolated strings

A new warning catches a common mistake where a function value is passed to an interpolated string hole — formatting via `ToString()` instead of being applied:

```fsharp
let myFunc (x: int) = string x
let bad  = $"result: {myFunc}"    // ⚠ FS3884
let good = $"result: {myFunc 42}" // OK
```

Requires `LangVersion=11.0` or higher. ([PR #19289](https://github.com/dotnet/fsharp/pull/19289))

## Bug fixes and other improvements

This release is heavy on codegen correctness. .NET's [ILVerify](https://github.com/dotnet/runtime/blob/main/src/coreclr/tools/ILVerify/README.md) tool checks that compiled IL conforms to the ECMA-335 spec — violations can cause unexpected runtime behavior or JIT failures on some platforms. F# compiler's ILVerify error count dropped from **551 to 56** (zero for FSharp.Core) through fixes to array instructions, value type dispatch, interface join points, exception handlers, and state machine struct layout ([PR #19372](https://github.com/dotnet/fsharp/pull/19372)). Four long-standing debugger issues were fixed — phantom sequence points at end of `match`, incorrect ranges for CE `return`/`yield`, backwards stepping with `use` in `task`, and breakpoints in list comprehension bodies ([PR #19278](https://github.com/dotnet/fsharp/pull/19278)).

Community contributions:

- New `#version;;` and `#exit;;` FSI directives. Thanks to [**bbatsov**](https://github.com/bbatsov). ([PR #19332](https://github.com/dotnet/fsharp/pull/19332), [PR #19329](https://github.com/dotnet/fsharp/pull/19329))
- `Seq.empty` no longer serializes as `"EmptyEnumerable"`. Thanks to [**apoorvdarshan**](https://github.com/apoorvdarshan). ([PR #19317](https://github.com/dotnet/fsharp/pull/19317))
- Fix culture-dependent interpolated string parsing. Thanks to [**brianrourkeboll**](https://github.com/brianrourkeboll). ([PR #19370](https://github.com/dotnet/fsharp/pull/19370))
- Fix strong name signing on Linux. Thanks to [**aw0lid**](https://github.com/aw0lid). ([PR #19242](https://github.com/dotnet/fsharp/pull/19242))
- `let!`/`use!` outside CEs now correctly errors. Thanks to [**evgTSV**](https://github.com/evgTSV). ([PR #19347](https://github.com/dotnet/fsharp/pull/19347))
- Alt+F1 momentary toggle for inlay hints in VS. Thanks to [**majocha**](https://github.com/majocha). ([PR #19421](https://github.com/dotnet/fsharp/pull/19421))

F# updates:

- [F# release notes](https://fsharp.github.io/fsharp-compiler-docs/release-notes/About.html)
- [dotnet/fsharp repository](https://github.com/dotnet/fsharp)
