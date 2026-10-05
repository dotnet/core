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

let validate () =
    let result = (add 40 2).GetAwaiter().GetResult()
    if result <> 42 then failwithf "Expected runtime-async result 42, got %d" result
    printfn "Builder-author runtime-async intrinsic example passed."
