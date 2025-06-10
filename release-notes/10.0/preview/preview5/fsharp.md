# F# updates in .NET 10 Preview 5 - Release Notes

Here's a summary of what's new in F# in this preview release:

- [F# Language](#f-language)
- [FSharp.Core standard library](#fsharpcore-standard-library)
- [FSharp.Compiler.Service](#fsharpcompilerservice)

> Note: Release notes for F# are generated for all contributions to the [dotnet/fsharp](https://github.com/dotnet/fsharp) repository and split across language, library and compiler changes.

## F# Language

### Scoped #nowarn/#warnon

We are thrilled to announce the integration of [FS-1146 Scoped Nowarn](https://github.com/fsharp/fslang-design/blob/main/RFCs/FS-1146-scoped-nowarn.md) into the preview version of F#.

F# 10 introduces scoped warning controls with the new `#warnon` directive, enabling fine-grained control over compiler diagnostics. Previously, `#nowarn` silenced warnings globally from its point to the end of the file—often hiding valuable issues elsewhere. Inspired by community feedback, this scoped approach strikes a balance: you can suppress a specific warning just for a targeted section, then restore normal checking immediately after. Let's have a look:

```fsharp
type CustomerStatus = Active | Deleted | [<System.Obsolete>] Inactive
let activeStatus = Status.Active
let inactiveStatus = Status.Inactive 
// ------------------^^^^^^^^^^^^^^^  warning FS0044: This construct is deprecated
#nowarn "44"
let processStatus s = 
    match s with
    | Active -> 1
    | Deleted -> -1
    | Inactive -> -1  // no warning here, since we are between opening "nowarn" and closing "warnon"
#warnon "44"

let userStatus = Status.Inactive
// --------------^^^^^^^^^^^^^^^  warning FS0044: This construct is deprecated
```

A heartfelt thank-you to Martin ([Martin521](https://github.com/Martin521)), who championed this feature from design to delivery. He crafted the RFC, implemented core logic, navigated intricate edge cases—especially around #line support—and resolved countless challenges along the way. His dedication has transformed scoped warning control from RFC to reality.

### More changes

[Release notes for new F# language features](https://fsharp.github.io/fsharp-compiler-docs/release-notes/Language.html) list language changes that have to be enabled by `<LangVersion>preview</LangVersion>` project property in `.fsproj` project file. They will become the default with .NET 10 release.

The following language features are currently under `preview`:

- Better generic unmanaged structs handling. ([Language suggestion #692](https://github.com/fsharp/fslang-suggestions/issues/692), [PR #12154](https://github.com/dotnet/fsharp/pull/12154))
- Deprecate places where `seq` can be omitted. ([Language suggestion #1033](https://github.com/fsharp/fslang-suggestions/issues/1033), [PR #17772](https://github.com/dotnet/fsharp/pull/17772))
- Added type conversions cache, only enabled for compiler runs ([PR#17668](https://github.com/dotnet/fsharp/pull/17668))
- Support ValueOption + Struct attribute as optional parameter for methods ([Language suggestion #1136](https://github.com/fsharp/fslang-suggestions/issues/1136), [PR #18098](https://github.com/dotnet/fsharp/pull/18098))
- Allow `_` in `use!` bindings values (lift FS1228 restriction) ([PR #18487](https://github.com/dotnet/fsharp/pull/18487))
- Warn when `unit` is passed to an `obj`-typed argument  ([PR #18330](https://github.com/dotnet/fsharp/pull/18330))
- Fix parsing errors using anonymous records and units of measures ([PR #18543](https://github.com/dotnet/fsharp/pull/18543))
- Scoped Nowarn: added the #warnon compiler directive ([Language suggestion #278](https://github.com/fsharp/fslang-suggestions/issues/278), [RFC FS-1146 PR](https://github.com/fsharp/fslang-design/pull/782), [PR #18049](https://github.com/dotnet/fsharp/pull/18049))
- Allow `let!` and `use!` type annotations without requiring parentheses. ([PR #18508](https://github.com/dotnet/fsharp/pull/18508))
- Warn on uppercase identifiers in patterns. ([PR #15816](https://github.com/dotnet/fsharp/pull/15816))

A monumental round of applause goes to [Edgar](https://github.com/edgarfgp), whose expertise and dedication brought most of these preview features to life!

## FSharp.Core Standard Library

[Changes to the FSharp.Core standard library](https://fsharp.github.io/fsharp-compiler-docs/release-notes/FSharp.Core.html#10.0.100-Added) are applied automatically to projects compiled with new SDK, unless they pin down a lower FSharp.Core version.
Upcoming improvements include a better performance for the `string` functions when dealing with enums and signed integer type, `and!` support for `task{}` expressions and improvements to the random functions introduced with F# 9.

Thank you [Brian](https://github.com/brianrourkeboll) and [Lanayx](https://github.com/dotnet/fsharp/commits?author=Lanayx) for continously making F# better!

## FSharp.Compiler.Service

General improvements and bugfixes in the compiler implementation are at [Release notes for FSharp.Compiler.Service](https://fsharp.github.io/fsharp-compiler-docs/release-notes/FSharp.Compiler.Service.html).
They cover tooling improvements, bugfixes and quality of live improvements for all F# contributors as well as our testing infrastructure. A special thank you goes to [majocha](https://github.com/dotnet/fsharp/commits?author=majocha), [auduchinok](https://github.com/dotnet/fsharp/commits?author=auduchinok), [ijklam](https://github.com/dotnet/fsharp/commits?author=ijklam), [DedSec256](https://github.com/dotnet/fsharp/commits?author=DedSec256) and numerous contributors who help by identifying issues, proposing suggestions and discussing design and implementation of new features.
