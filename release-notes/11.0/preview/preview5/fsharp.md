# F# in .NET 11 Preview 5 - Release Notes

Here's a summary of what's new in F# in this Preview 5 release:

- [Return-value attributes are preserved in more signatures](#return-value-attributes-are-preserved-in-more-signatures)
- [Script files participate in parallel graph checking](#script-files-participate-in-parallel-graph-checking)
- [Command-line warning controls apply during option parsing](#command-line-warning-controls-apply-during-option-parsing)
- [F# 11 exception serialization preserves fields](#f-11-exception-serialization-preserves-fields)
- [Bug fixes and other improvements](#bug-fixes-and-other-improvements)
- [Community contributors](#community-contributors)

## Return-value attributes are preserved in more signatures

Return-value attributes are now routed to the return metadata slot for more F# member shapes. Prefix `[<return: ...>]` attributes on class members are emitted to IL, no longer conflict with member-level attributes under `AllowMultiple = false`, and attributes on unparenthesized tuple return types are no longer dropped ([dotnet/fsharp #19738](https://github.com/dotnet/fsharp/pull/19738), [dotnet/fsharp #19714](https://github.com/dotnet/fsharp/pull/19714)). Thank you [@edgarfgp](https://github.com/edgarfgp) for these contributions!

```fsharp
open System

[<AttributeUsage(AttributeTargets.ReturnValue)>]
type ReturnDescriptionAttribute(text: string) =
    inherit Attribute()
    member _.Text = text

type Formatter =
    [<return: ReturnDescription("normalized text")>]
    member _.Normalize(value: string) = value.Trim()

    static member Pair(value: string) : [<return: ReturnDescription("two values")>] string * string =
        value, value.ToUpperInvariant()
```

## Script files participate in parallel graph checking

Graph-based type checking now records modules that are implicitly provided by script files. Projects that include `.fsx` files can stay on the parallel checking path instead of falling back to sequential checking up to the last script file ([dotnet/fsharp #19649](https://github.com/dotnet/fsharp/pull/19649)). Thank you [@majocha](https://github.com/majocha) for this contribution!

```fsharp
// A.fsx
let value = 41
```

```fsharp
// B.fsx
#load "A.fsx"

let result = A.value + 1
```

## Command-line warning controls apply during option parsing

`--nowarn` and `--warnaserror` now apply to warnings produced while the compiler parses command-line options. Option warnings now follow the same suppression and escalation rules as warnings reported later in compilation ([dotnet/fsharp #19776](https://github.com/dotnet/fsharp/pull/19776)).

```console
fsc --nowarn:75 --extraoptimizationloops:1 Program.fs
```

## F# 11 exception serialization preserves fields

When targeting frameworks where `ISerializable` exception serialization is available, F# 11 now emits serialization members for user-defined exceptions with fields. The generated members store and restore those fields through `SerializationInfo`, so round trips preserve the exception payload ([dotnet/fsharp #19342](https://github.com/dotnet/fsharp/pull/19342), [dotnet/fsharp #19746](https://github.com/dotnet/fsharp/pull/19746)). This codegen is gated behind `--langversion:11`; earlier language versions keep the previous exception shape.

```fsharp
exception ParseFailed of line: int * message: string

let error = ParseFailed(12, "Unexpected token")
// On supported target frameworks, F# 11 emits serialization members
// that preserve both the line number and message fields.
```

## Bug fixes and other improvements

### Compiler correctness

- Custom attribute arguments now handle more valid inputs: empty arrays of user-defined types compile, non-empty arrays of unencodable types report FS3887 instead of an internal compiler error, and optional primitive value-type attribute constructor parameters get the correct default values ([dotnet/fsharp #19472](https://github.com/dotnet/fsharp/pull/19472), [dotnet/fsharp #19484](https://github.com/dotnet/fsharp/pull/19484)).
- Attributes in `namespace rec` and `module rec` scopes now resolve opened namespaces before module attributes are checked ([dotnet/fsharp #19502](https://github.com/dotnet/fsharp/pull/19502)).
- Nested inline SRTP functions with multiple overloads no longer hit internal error FS0073 during IL generation ([dotnet/fsharp #19710](https://github.com/dotnet/fsharp/pull/19710)). Thank you [@gusty](https://github.com/gusty)!
- Pattern matching inside `seq`, list, and array comprehensions now narrows nullness correctly and avoids false-positive FS3261 warnings ([dotnet/fsharp #19743](https://github.com/dotnet/fsharp/pull/19743)).
- Signature conformance now accepts an implementation member written as `member M(())` for a signature member written as `member M: unit -> unit` when the generated IL shape is the same ([dotnet/fsharp #19615](https://github.com/dotnet/fsharp/pull/19615)).

### Diagnostics

- Overload-resolution errors now underline the terminal method identifier instead of the entire object access and argument expression. Symbol-use ranges reported through name resolution now use the terminal identifier for the same cases ([dotnet/fsharp #19505](https://github.com/dotnet/fsharp/pull/19505)).
- Parser diagnostics in debug builds no longer expose internal parser-state details, and related parse errors have clearer wording ([dotnet/fsharp #19730](https://github.com/dotnet/fsharp/pull/19730)). Thank you [@auduchinok](https://github.com/auduchinok)!
- `use` bindings no longer produce an internal compiler error when a C#-style `Dispose` extension method is in scope alongside `IDisposable.Dispose` ([dotnet/fsharp #19568](https://github.com/dotnet/fsharp/pull/19568)).

## Community contributors

Thank you contributors! ❤️

- [@auduchinok](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Aauduchinok)
- [@bbatsov](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Abbatsov)
- [@edgarfgp](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Aedgarfgp)
- [@gusty](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Agusty)
- [@majocha](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Amajocha)
- [@quyentho](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Aquyentho)

F# updates:

- [F# release notes](https://fsharp.github.io/fsharp-compiler-docs/release-notes/About.html)
- [dotnet/fsharp repository](https://github.com/dotnet/fsharp)
