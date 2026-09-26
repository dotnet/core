# F# in .NET 11 RC 2 - Release Notes

- [Bound concurrent asynchronous work](#bound-concurrent-asynchronous-work)
- [Require named arguments for selected APIs](#require-named-arguments-for-selected-apis)
- [Reraise from a computation expression handler](#reraise-from-a-computation-expression-handler)

## Bound concurrent asynchronous work

`Async.parallelLimit` runs a sequence of async computations with a specified maximum number in flight and returns their results in input order. This helps control how much work a batch starts at once without writing a concurrency limiter yourself. Related helpers include `Async.parallelDoLimit`, `Task.parallelLimit`, and sequential variants ([dotnet/fsharp #20294](https://github.com/dotnet/fsharp/pull/20294)).

```fsharp
let results =
    [ for i in 1..5 -> async { return i * i } ]
    |> Async.parallelLimit 2
    |> Async.RunSynchronously
// [| 1; 4; 9; 16; 25 |]
```

## Require named arguments for selected APIs

With `<LangVersion>preview</LangVersion>`, F# recognizes `System.Diagnostics.CodeAnalysis.RequireNamedArgumentsAttribute` on a method or constructor and reports `FS3923` when a caller passes the required arguments positionally. This lets API authors make call sites more explicit ([dotnet/fsharp #20340](https://github.com/dotnet/fsharp/pull/20340)).

The RC 2 BCL does not yet include the attribute. Define the attribute in your project or use a library that provides it before marking a member:

```fsharp
open System.Diagnostics.CodeAnalysis

type Calculator() =
    [<RequireNamedArguments>]
    member _.Double(value: int) = value * 2

let answer = Calculator().Double(value = 21) // 42
```

The [maintained fixture](../../samples/fsharp/README.md) includes the attribute definition and verifies the named call against the RC 2 SDK.

## Reraise from a computation expression handler

With the preview language version, `reraise ()` works inside the `with` handler of an `async`, `task`, or custom computation expression. The handler propagates the original exception with its stack trace, avoiding the loss of origin information that can result from `raise e` ([dotnet/fsharp #20405](https://github.com/dotnet/fsharp/pull/20405)).

```fsharp
let operation = async {
    try
        failwith "operation failed"
    with _ ->
        reraise ()
}
```
