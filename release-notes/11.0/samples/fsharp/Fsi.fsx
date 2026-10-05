open System
open System.Threading.Tasks

let mutable disposed = false

type Resource() =
    interface IAsyncDisposable with
        member _.DisposeAsync() =
            disposed <- true
            ValueTask.CompletedTask

let operation = task {
    use resource = new Resource()
    do! Task.Delay 1
}

operation.GetAwaiter().GetResult()
if not disposed then failwith "FSI task use did not call DisposeAsync."
printfn "FSI task IAsyncDisposable use passed."
