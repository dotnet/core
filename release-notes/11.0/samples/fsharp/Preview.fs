module PreviewSamples

open System
open System.Diagnostics.CodeAnalysis
open System.Runtime.CompilerServices
open System.Threading.Tasks

type Calculator() =
    [<RequireNamedArguments>]
    member _.Double(value: int) = value * 2

[<MethodImpl(MethodImplOptions.NoInlining)>]
let throwOriginal (original: exn) = raise original

type IdentityBuilder() =
    member _.Return(value) = value
    member _.Delay(body) = body
    member _.Run(body) = body ()
    member _.TryWith(body, handler) =
        try body () with ex -> handler ex

let assertReraised label original run =
    try
        run ()
        failwithf "Expected the original exception from %s." label
    with ex when obj.ReferenceEquals(ex, original) ->
        if not (ex.StackTrace.Contains("throwOriginal")) then
            failwithf "The original exception stack trace was lost in %s." label
        printfn "%s reraise retained the exception and stack trace." label

let validate () =
    let actual = Calculator().Double(value = 21)
    if actual <> 42 then failwithf "Expected 42, got %d" actual
    printfn "Named argument validation passed."

    let original = InvalidOperationException("original exception")
    let operation = async {
        try
            do! Async.Sleep 1
            throwOriginal original
        with _ ->
            reraise ()
    }

    assertReraised "Async" original (fun () -> operation |> Async.RunSynchronously)

    let taskOperation () = task {
        try
            do! Task.Delay 1
            throwOriginal original
        with _ ->
            reraise ()
    }
    assertReraised "Task" original (fun () -> (taskOperation ()).GetAwaiter().GetResult())

    let identity = IdentityBuilder()
    assertReraised "Custom builder" original (fun () ->
        identity {
            try
                return throwOriginal original
            with _ ->
                return reraise ()
        })
