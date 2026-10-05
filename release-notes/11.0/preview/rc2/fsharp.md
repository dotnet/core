# F# in .NET 11 RC 2 - Release Notes

.NET 11 RC 2 includes the following F# updates:

- [SRTP for extension members and operators](#srtp-for-extension-members-and-operators)
- [Runtime async support](#runtime-async-support)
- [reraise in computation expressions](#reraise-in-computation-expressions)
- [Require named arguments for selected APIs](#require-named-arguments-for-selected-apis)
- [Lower allocations in FSharp.Core collections](#lower-allocations-in-fsharpcore-collections)
- [Compiler memory usage improvements](#compiler-memory-usage-improvements) - [Read the full performance evaluation](./fsharp-memory-savings.md)
- [Bound concurrent asynchronous work](#bound-concurrent-asynchronous-work)
- [Trimming and Native AOT improvements](#trimming-and-native-aot-improvements)
- [Breaking changes from .NET 10](#breaking-changes-from-net-10)
- [Bug fixes and other improvements](#bug-fixes-and-other-improvements)
- [Community contributors](#community-contributors)

Features marked **preview** require this setting in your project:

```xml
<PropertyGroup>
  <LangVersion>preview</LangVersion>
</PropertyGroup>
```

For F# Interactive, use `dotnet fsi --langversion:preview`. Other updates use the default F# 11 language version.

## SRTP for extension members and operators

> **Preview.**

Bring existing .NET and third-party types into generic F# algorithms without changing those types or introducing wrappers.
Statically resolved type parameter (SRTP) constraints can select extension members, including operators, supplied by your code or a library.
An algorithm no longer needs every operation to be declared inside the original type.

```fsharp
open System

type MyOffset = { Hours: float }

type System.DateTime with
    static member (+) (date: DateTime, offset: MyOffset) =
        date.AddHours(offset.Hours)

let inline shift (date: DateTime) offset = date + offset

let oneHourLater = shift DateTime.MinValue (TimeSpan.FromHours 1.0)
let twoHoursLater = shift DateTime.MinValue { Hours = 2.0 }
```

The same `shift` function accepts the built-in `TimeSpan` and a domain-specific offset added through an extension.
Inline overload resolution stays open until the call site instead of fixing the offset type to `TimeSpan` at the function definition.
Libraries can use this mechanism to adapt existing types to generic operations.

Only public extensions can satisfy these constraints.
When using extensions from another assembly, open their defining module at the call site.
Built-in operations still take precedence when they already apply.
Ordinary extension-member calls do not require preview.

This capability was already available in RC 1
([dotnet/fsharp#19602](https://github.com/dotnet/fsharp/pull/19602)).
Thank you [@gusty](https://github.com/gusty) for this contribution!

## Runtime async support

> **Preview.**

Library authors can build custom computation-expression builders on .NET's runtime-async execution model.
RC 2 supplies compiler-recognized return and await intrinsics for generating runtime-async methods
([dotnet/fsharp#20235](https://github.com/dotnet/fsharp/pull/20235)).
The runtime manages asynchronous suspension and continuation instead of requiring a compiler-generated await state machine.

The [compiler's prototype builder](https://github.com/dotnet/fsharp/blob/9cd6167a7265ce7264b22719503b7dfa9eb8f83c/tests/FSharp.Compiler.ComponentTests/Language/RuntimeAsync/RuntimeTaskBuilder.fs) demonstrates familiar `let!`, `return`, loops, exception handling, and resource management on these mechanics:

```fsharp
let calculation () =
    runtimeTask {
        let captured = 40
        let! delta = delayed 2
        return captured + delta
    }
```

Here `runtimeTask` is the custom builder defined by the tests, not a shipped FSharp.Core symbol.
Its `Run` method passes the delayed body to `StateMachineHelpers.__runtimeAsyncReturn`.
Its `Source` methods use `AsyncHelpers.Await` to await tasks before handing their results to the continuation.

This release gives library authors the building blocks to create their own computation-expression APIs.
FSharp.Core does not yet ship a builder using these mechanics.
The existing `task {}` and `async {}` builders are unchanged.
The example targets `net11.0` and runs on the .NET 11 RC 2 runtime.
The intrinsics come from FSharp.Core's `net10.0` asset, not its `netstandard2.0` asset; the target and executing runtime must support runtime-async.

## reraise in computation expressions

> **Preview.**

`reraise ()` now works inside the `with` handler of an `async`, `task`, or custom computation expression.
It propagates the original exception and preserves its stack trace, unlike rethrowing with `raise e`
([dotnet/fsharp#20405](https://github.com/dotnet/fsharp/pull/20405)).

```fsharp
let operation = async {
    try
        failwith "operation failed"
    with _ ->
        reraise ()
}
```

## Require named arguments for selected APIs

> **Preview.**

API authors can apply `System.Diagnostics.CodeAnalysis.RequireNamedArgumentsAttribute` to methods and constructors.
With preview enabled, positional calls report `FS3923`, requiring callers to name the affected arguments
([dotnet/fsharp#20340](https://github.com/dotnet/fsharp/pull/20340)).

The RC 2 BCL does not include the attribute.
Define it in your project or use a library that provides it before marking a member:

```fsharp
open System.Diagnostics.CodeAnalysis

type Calculator() =
    [<RequireNamedArguments>]
    member _.Double(value: int) = value * 2

let answer = Calculator().Double(value = 21) // 42
```

`Calculator().Double(21)` reports `FS3923` under preview.
The default language version does not enforce this attribute.

## Lower allocations in FSharp.Core collections

More `List` and `Array` traversal functions, including `fold`, `exists`, and `tryPick`, can now inline their callback lambdas.
This removes callback closures from common collection operations in your applications
([dotnet/fsharp#20422](https://github.com/dotnet/fsharp/pull/20422)).

```fsharp
let sumWithOffset k xs =
    List.fold (fun total value -> total + value + k) 0 xs

let total = sumWithOffset 1 [ 1; 2; 3 ] // 9
```

The author's capturing-lambda microbenchmarks report 24 bytes per call with FSharp.Core 9.0.100 versus zero with the updated Core.
This applies to the measured `List.fold`, `List.exists`, `Array.fold`, and `Array.fold2` calls, not every collection function.
`OptimizeClosureIfNotInlined` is also enabled by default in F# 11.
It lets library authors adapt non-literal callbacks outside an inlined loop
([dotnet/fsharp#20571](https://github.com/dotnet/fsharp/pull/20571)).

## Compiler memory usage improvements

Compilation and project analysis create fewer temporary objects and retain less duplicated assembly metadata.
RC 2 combines expression copying and type instantiation during inlining, removes constraint-solver closures, and reuses metadata objects
([dotnet/fsharp#20363](https://github.com/dotnet/fsharp/pull/20363),
[dotnet/fsharp#20367](https://github.com/dotnet/fsharp/pull/20367),
[dotnet/fsharp#20255](https://github.com/dotnet/fsharp/pull/20255),
[dotnet/fsharp#20489](https://github.com/dotnet/fsharp/pull/20489)).

The PE-reader reuse PR's FSharp.Common build benchmark reports allocated bytes decreasing from 2,912 MB to 2,606 MB (10.5%).
These are cumulative allocations during compilation, separate from the application runtime allocations described above.

FSharp.Compiler.Service also shares imported assembly data between projects by default and creates referenced-type metadata only when needed
([dotnet/fsharp#20296](https://github.com/dotnet/fsharp/pull/20296),
[dotnet/fsharp#20494](https://github.com/dotnet/fsharp/pull/20494)).
The sharing PR's 10-project ReSharper.FSharp benchmark reports retained memory decreasing from 1,547 MB to 1,002 MB (35.2%).
Tool authors can opt out with `shareImportedAssemblies = false` on `FSharpChecker.Create`.

These measurements describe their specific workloads, not peak process memory or a universal build-time speedup.
The compiler improvements are enabled by default.
Thank you [@auduchinok](https://github.com/auduchinok) for this contribution!

For the measured combined impact of F# 11 compiler and FSharp.Core improvements, see [the full performance evaluation](./fsharp-memory-savings.md).

## Bound concurrent asynchronous work

`Async.parallelLimit` runs asynchronous computations with a maximum number in flight and returns results in input order.
Use it to limit concurrent work in a batch without writing a separate concurrency limiter.
Related helpers include `Async.parallelDoLimit`, `Task.parallelLimit`, and sequential variants
([dotnet/fsharp#20294](https://github.com/dotnet/fsharp/pull/20294)).
The task helpers accept functions that start tasks, so the limit applies before the work starts.

```fsharp
let results =
    [ for i in 1..5 -> async { return i * i } ]
    |> Async.parallelLimit 2
    |> Async.RunSynchronously
// [| 1; 4; 9; 16; 25 |]
```

Thank you [@bartelink](https://github.com/bartelink) for this contribution!

## Trimming and Native AOT improvements

`Array2D.create`, `init`, `rebase`, `map`, `mapi`, and `copy` no longer report `IL3050` when targeting .NET 11.
Non-zero-based `*Based` operations still have Native AOT restrictions, now reported at the call site
([dotnet/fsharp#20338](https://github.com/dotnet/fsharp/pull/20338)).

```fsharp
let matrix = Array2D.init 2 3 (fun row column -> row * 10 + column)
let value = matrix[1, 2] // 12
```

Compiled F# assemblies now embed their metadata-trimming rules, including when assemblies are linked
([dotnet/fsharp#20527](https://github.com/dotnet/fsharp/pull/20527)).

## Breaking changes from .NET 10

With F# 11, `|||`, `&&&`, and `^^^` on enums with non-integer underlying types, such as `char`, now report `FS0001`.
These expressions previously compiled but threw `NotSupportedException` at runtime.
Use an integer-backed enum for bit flags
([dotnet/fsharp#20322](https://github.com/dotnet/fsharp/pull/20322)).
This check is enabled by default, not restricted to preview.
Thank you [@edgarfgp](https://github.com/edgarfgp) for this contribution!

<!-- Editorial cuts:
  - FCS FileSignature and WithNullnessAnnotations APIs: specialized tooling surfaces; full evidence retained in the source audit.
  - Visual Studio navigation/cache fixes: not presented as SDK-delivered IDE features.
  - Always-enabled flag removal, repository automation, whitespace, and dependency changes: no new reader-facing capability.
-->

## Bug fixes and other improvements

### Compiler

- [Avoid stack overflow when checking long sequence expressions](https://github.com/dotnet/fsharp/pull/20480)
- [Check active-pattern let bindings like equivalent match expressions](https://github.com/dotnet/fsharp/pull/20383)
- [Resolve generic arguments in constraint-dependency order](https://github.com/dotnet/fsharp/pull/20342)
- [Fix final do! expressions being treated as return! or yield!](https://github.com/dotnet/fsharp/pull/20449)
- [Handle optional indexer setter arguments and caller information](https://github.com/dotnet/fsharp/pull/20570)
- [Avoid false nullness warnings for recursive union types](https://github.com/dotnet/fsharp/pull/20562)
- [Resolve recursive inline members in dependency order](https://github.com/dotnet/fsharp/pull/20111)

### FSharp.Core

- [Reuse empty arrays in collection operations and conversions](https://github.com/dotnet/fsharp/pull/20388)
- [Return correctly shaped empty slices for extreme reversed bounds](https://github.com/dotnet/fsharp/pull/20557)

### Tooling and F# Interactive

- [Avoid repeated background type checking during concurrent requests](https://github.com/dotnet/fsharp/pull/20481)
- [Preserve tuple-pattern parentheses in generated signatures](https://github.com/dotnet/fsharp/pull/20589)
- [Support IAsyncDisposable use bindings in F# Interactive task expressions](https://github.com/dotnet/fsharp/pull/20555)
- [Avoid unnecessary PDB generation with --multiemit+ --debug-](https://github.com/dotnet/fsharp/pull/20394)

## Community contributors

Thank you contributors!

- [@auduchinok](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Aauduchinok)
- [@bartelink](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Abartelink)
- [@edgarfgp](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Aedgarfgp)
- [@gusty](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Agusty)
- [@Happypig375](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3AHappypig375)
- [@majocha](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Amajocha)
- [@nojaf](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Anojaf)
- [@xperiandri](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Axperiandri)

F# updates:

- [F# release notes](https://fsharp.github.io/fsharp-compiler-docs/release-notes/About.html)
- [dotnet/fsharp repository](https://github.com/dotnet/fsharp)
