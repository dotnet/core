# F# in .NET 11 RC 2 - Release Notes

.NET 11 RC 2 includes the following F# updates:

- [Lower allocations in collections and compilation](#lower-allocations-in-collections-and-compilation)
- [Bound concurrent asynchronous work](#bound-concurrent-asynchronous-work)
- [Require named arguments for selected APIs](#require-named-arguments-for-selected-apis)
- [Reraise from a computation expression handler](#reraise-from-a-computation-expression-handler)
- [Trimming and Native AOT improvements](#trimming-and-native-aot-improvements)
- [Preview catch-up: extension members and operators](#preview-catch-up-extension-members-and-operators)
- [Other preview feature status](#other-preview-feature-status)
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

## Lower allocations in collections and compilation

More `List` and `Array` traversal functions, including `fold`, `exists`, and `tryPick`, can now inline their callback lambdas.
This removes callback closures from common collection operations
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

In the author-reported self-build for [dotnet/fsharp#20422](https://github.com/dotnet/fsharp/pull/20422), compiler closure allocations fell from 231,625,834 to 149,844,308 (35.31%).
That comparison used SDK 10.0.400/FSharp.Core 10.1 versus the PR's compiler/Core 11.
It measures that workload's closure allocations, not a general build-time speedup.
RC 2 also avoids duplicate expression copying during inlining and reduces constraint-solver closures
([dotnet/fsharp#20363](https://github.com/dotnet/fsharp/pull/20363),
[dotnet/fsharp#20367](https://github.com/dotnet/fsharp/pull/20367)).

FSharp.Compiler.Service shares imported assembly data between projects by default, reducing retained metadata in multi-project tools.
Tool authors can opt out with `shareImportedAssemblies = false` on `FSharpChecker.Create`
([dotnet/fsharp#20296](https://github.com/dotnet/fsharp/pull/20296)).
These compiler-service improvements do not require the preview language version.
Thank you [@auduchinok](https://github.com/auduchinok) for this contribution!

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

## Require named arguments for selected APIs

> This feature requires `<LangVersion>preview</LangVersion>` or `--langversion:preview` in RC 2.

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

The [maintained fixture](../../samples/fsharp/README.md) includes the attribute definition.
It verifies that the named call runs and that `Calculator().Double(21)` reports `FS3923` under preview.
The default language version does not enforce this attribute.

## Reraise from a computation expression handler

> This feature requires `<LangVersion>preview</LangVersion>` or `--langversion:preview` in RC 2.

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
These changes do not require the preview language version.

## Preview catch-up: extension members and operators

> This feature requires `<LangVersion>preview</LangVersion>` or `--langversion:preview`. It was already available in RC 1.

Extension members can satisfy statically resolved type parameter (SRTP) constraints, including constraints used by operators.
This feature was omitted from the [RC 1 article](../rc1/fsharp.md), rather than newly implemented in RC 2
([dotnet/fsharp#19602](https://github.com/dotnet/fsharp/pull/19602)).

```fsharp
type System.String with
    static member (*) (s: string, n: int) =
        System.String.Concat(Array.replicate n s)

let repeated = "ha" * 3 // "hahaha"

type System.Int32 with
    static member (++) (a: int, b: int) = a + b + 1

let inline incAdd (x: ^T) (y: ^T) = x ++ y
let result = incAdd 3 4 // 8
```

The first call resolves an extension operator on a concrete type.
The second resolves one through a generic inline function.
The preview requirement applies to extension-based constraint resolution, not to ordinary extension-member calls.
Thank you [@gusty](https://github.com/gusty) for this contribution!

## Other preview feature status

> Runtime-async compiler support requires `<LangVersion>preview</LangVersion>` or `--langversion:preview` in RC 2.

RC 2 adds compiler support for .NET runtime-async intrinsics for custom computation-expression builder authors
([dotnet/fsharp#20235](https://github.com/dotnet/fsharp/pull/20235)).
This also requires a target/runtime that supports runtime-async.
The stock `task {}` and `async {}` builders do not use this path in RC 2.

[Record constructors](../rc1/fsharp.md#record-constructors) remain **preview**, unchanged from RC 1.
The other features described in the RC 1 article are not reannounced here.

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
