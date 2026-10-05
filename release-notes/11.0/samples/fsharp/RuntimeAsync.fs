module RuntimeAsyncSamples

open System.Runtime.CompilerServices
open System.Threading.Tasks
open Microsoft.FSharp.Core.CompilerServices

let delayed value = task {
    do! Task.Delay 1
    return value
}

let add (x: int) (y: int) : Task<int> =
    StateMachineHelpers.__runtimeAsyncReturn (
        let first = AsyncHelpers.Await(delayed x)
        first + y)

type RuntimeTaskBuilder() =
    member inline _.Return(value: 'T) = value
    member inline _.Bind(source, continuation) = continuation source
    member inline _.Delay([<InlineIfLambda>] generator: unit -> 'T) = generator
    member inline _.Run([<InlineIfLambda>] code: unit -> 'T) : Task<'T> =
        StateMachineHelpers.__runtimeAsyncReturn (code ())
    member inline _.Source(source: Task<'T>) = AsyncHelpers.Await source
    member inline _.Source(source: Task) = AsyncHelpers.Await source

let runtimeTask = RuntimeTaskBuilder()

let calculation () =
    runtimeTask {
        let captured = 40
        let! delta = delayed 2
        return captured + delta
    }

let validate () =
    let result = (add 40 2).GetAwaiter().GetResult()
    if result <> 42 then failwithf "Expected runtime-async result 42, got %d" result
    printfn "Builder-author runtime-async intrinsic example passed."
    let builderResult = (calculation ()).GetAwaiter().GetResult()
    if builderResult <> 42 then failwithf "Expected custom runtimeTask result 42, got %d" builderResult
    printfn "Custom test-derived runtimeTask builder passed across suspension."
