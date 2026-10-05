module DefaultSamples

open System.Threading
open System.Threading.Tasks

let sumWithOffset k xs =
    List.fold (fun total value -> total + value + k) 0 xs

let validate () =
    let resources = System.Reflection.Assembly.GetExecutingAssembly().GetManifestResourceNames()
    if not (Array.contains "ILLink.Substitutions.xml" resources) then
        failwith "The compiled assembly is missing its metadata-trimming rules."
    printfn "Assembly metadata-trimming rules passed."

    if sumWithOffset 1 [ 1; 2; 3 ] <> 9 then
        failwith "Unexpected List.fold result."
    let arrayTotal = [| 1; 2; 3 |] |> Array.fold (fun total value -> total + 2 * value) 0
    if arrayTotal <> 12 then failwith "Unexpected Array.fold result."
    let fold2Total = ClosureOptimizationSamples.fold2 (fun total x y -> total + x + y) 0 [| 1; 2 |] [| 3; 4 |]
    if fold2Total <> 10 then failwith "Unexpected optimized-closure fold2 result."
    let matrix = Array2D.init 2 3 (fun row column -> row * 10 + column)
    if matrix[1, 2] <> 12 then failwith "Unexpected Array2D.init result."
    printfn "Collection and Array2D examples passed."

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

    active <- 0
    peak <- 0
    let taskFactories =
        [ for i in 1..5 ->
            fun cancellationToken -> task {
                let running = Interlocked.Increment &active
                lock gate (fun () -> peak <- max peak running)
                do! Task.Delay(30, cancellationToken)
                Interlocked.Decrement &active |> ignore
                return i * i
            } ]
    let taskResults = (Task.parallelLimit 2 CancellationToken.None taskFactories).GetAwaiter().GetResult()
    if taskResults <> [| 1; 4; 9; 16; 25 |] || peak > 2 || peak < 1 then
        failwithf "Unexpected bounded-task results: %A; peak concurrency: %d" taskResults peak
    printfn "Bounded task factories passed (peak concurrency: %d)." peak
