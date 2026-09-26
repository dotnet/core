# F# in .NET 11 RC 1 - Release Notes

.NET 11 RC 1 sets F# 11 as the default language version and includes the
following F# updates:

- [Record spreads](#record-spreads)
- [Record constructors](#record-constructors)
- [Direct delegate construction](#direct-delegate-construction)
- [Efficient interpolated strings](#efficient-interpolated-strings)
- [Reflection-free record and union formatting](#reflection-free-record-and-union-formatting)
- [XML documentation inheritance and inclusion](#xml-documentation-inheritance-and-inclusion)
- [`Async.RunSynchronouslyImmediate`](#asyncrunsynchronouslyimmediate)
- [Community contributors](#community-contributors)

F# updates:

- [F# release notes](https://fsharp.github.io/fsharp-compiler-docs/release-notes/About.html)
- [dotnet/fsharp repository](https://github.com/dotnet/fsharp)

## Record spreads

Record spreads let a new record type or value reuse fields from existing
records. They work with named and anonymous records, and explicit fields can
replace fields supplied by a spread
([dotnet/fsharp #18927](https://github.com/dotnet/fsharp/pull/18927)).

```fsharp
type Position = { X: int; Y: int }
type Style = { Color: string; Opacity: float }
type Shape = { ...Position; ...Style; Name: string }

let position = { X = 10; Y = 20 }
let style = { Color = "blue"; Opacity = 0.8 }
let shape = { ...position; ...style; Name = "marker" }
let highlighted = { ...shape; Color = "yellow" }
```

Record spreads are stabilized in F# 11 and enabled by default with the .NET 11
SDK ([dotnet/fsharp #20199](https://github.com/dotnet/fsharp/pull/20199),
[dotnet/fsharp #20219](https://github.com/dotnet/fsharp/pull/20219)).

## Record constructors

> This feature still requires `--langversion:preview` in RC 1.

F# can now call the all-fields constructor that record types expose in IL,
using positional or named arguments. Constructor accessibility follows the
record representation's accessibility
([dotnet/fsharp #19974](https://github.com/dotnet/fsharp/pull/19974)).

```fsharp
type Point = { X: int; Y: int }

let origin = Point(0, 0)
let offset = Point(Y = 20, X = 10)
```

## Direct delegate construction

When an F# method or function is passed directly to a compatible .NET delegate,
the compiler can now create the delegate without first allocating an
intermediate closure
([dotnet/fsharp #19993](https://github.com/dotnet/fsharp/pull/19993)).

```fsharp
open System

type Calculator =
    static member Add x y = x + y

let add = Func<int, int, int>(Calculator.Add)
printfn "%d" (add.Invoke(20, 22))
```

Direct delegate construction is stabilized in F# 11 and enabled by default
([dotnet/fsharp #20199](https://github.com/dotnet/fsharp/pull/20199)).

## Efficient interpolated strings

String-typed interpolated strings now lower to `System.String.Concat` instead
of the reflection-based `printf` engine. Plain and .NET-formatted holes are
therefore compatible with trimming and Native AOT. Printf-format holes, such as
`%d{value}`, continue to use the printf path
([dotnet/fsharp #19971](https://github.com/dotnet/fsharp/pull/19971)).

```fsharp
let name = "Ada"
let score = 42.5
let message = $"{name} scored {score:F1}"
```

Interpolated string holes now use invariant formatting through the F# `string`
operator rather than the current thread culture.

## Reflection-free record and union formatting

With `--reflectionfree`, records, anonymous records, and discriminated unions
now receive generated `ToString` implementations that include their fields.
The generated code is friendly to trimming and Native AOT when the contained
values also have compatible `ToString` implementations
([dotnet/fsharp #19976](https://github.com/dotnet/fsharp/pull/19976)).

```fsharp
type Point = { X: int; Y: int }
type Result = Success of string | Failure of int

printfn "%O" { X = 10; Y = 20 }
printfn "%O" (Failure 404)
```

## XML documentation inheritance and inclusion

F# XML documentation now supports the standard `<inheritdoc>` and `<include>`
workflows:

- `<inheritdoc>` resolves inherited documentation in IDE tooltips, completion,
  signature help, and the FSharp.Compiler.Service symbol API. The compiler
  leaves the tag in generated XML documentation, matching C#
  ([dotnet/fsharp #19188](https://github.com/dotnet/fsharp/pull/19188)).
- `<include>` copies XML selected by an XPath expression from an external file
  into generated documentation at compile time
  ([dotnet/fsharp #19186](https://github.com/dotnet/fsharp/pull/19186)).

```fsharp
type BaseService() =
    /// <summary>Returns the current service status.</summary>
    abstract GetStatus: unit -> string

type Service() =
    inherit BaseService()

    /// <inheritdoc/>
    override _.GetStatus() = "Ready"

/// <include file="docs.xml" path="/docs/member[@name='M:Helpers.Parse']/*"/>
let parse value = System.Int32.Parse value
```

## `Async.RunSynchronouslyImmediate`

`Async.RunSynchronouslyImmediate` starts an asynchronous computation on the
calling thread and stays on the same call stack until the first asynchronous
suspension. Compared with `Async.RunSynchronously`, this can produce simpler
debugger call stacks and exception traces, and it avoids the initial thread
hop. It doesn't honor the current `SynchronizationContext`
([dotnet/fsharp #19804](https://github.com/dotnet/fsharp/pull/19804),
[dotnet/fsharp #20245](https://github.com/dotnet/fsharp/pull/20245)).

```fsharp
let computation =
    async {
        printfn "Runs immediately on the calling thread"
        do! Async.Sleep 10
        return 42
    }

let result = Async.RunSynchronouslyImmediate computation
```

## Community contributors

Thank you contributors! ❤️

- [@bartelink](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Abartelink)
- [@brianrourkeboll](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Abrianrourkeboll)
- [@charlesroddie](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Acharlesroddie)
- [@kerams](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Akerams)
