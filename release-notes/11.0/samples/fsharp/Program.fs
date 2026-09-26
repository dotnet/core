open System
open System.Diagnostics.CodeAnalysis
open System.Threading
open System.Runtime.CompilerServices

let mutable active = 0
let mutable peak = 0
let gate = obj()
let computations =
    [ for i in 1..5 ->
        async {
            let running = Interlocked.Increment &active
            lock gate (fun () -> peak <- max peak running)
            do! Async.Sleep 30
            Interlocked.Decrement &active |> ignore
            return i * i
        } ]

let results = computations |> Async.parallelLimit 2 |> Async.RunSynchronously
if results <> [| 1; 4; 9; 16; 25 |] || peak > 2 || peak < 1 then
    failwithf "Unexpected bounded-parallel results: %A; peak concurrency: %d" results peak
printfn "Bounded-parallel work passed (peak concurrency: %d)." peak

type Calculator() =
    [<RequireNamedArguments>]
    member _.Double(value: int) = value * 2

let actual = Calculator().Double(value = 21)
if actual <> 42 then failwithf "Expected 42, got %d" actual
printfn "Named argument validation passed."

let original = InvalidOperationException("original exception")

[<MethodImpl(MethodImplOptions.NoInlining)>]
let throwOriginal () = raise original

let operation = async {
    try
        throwOriginal ()
    with _ ->
        reraise ()
}

try
    operation |> Async.RunSynchronously
    failwith "Expected the original exception."
with ex when obj.ReferenceEquals(ex, original) ->
    if not (ex.StackTrace.Contains("throwOriginal")) then
        failwith "The original exception stack trace was lost."
    printfn "Computation-expression reraise retained the exception and stack trace."
