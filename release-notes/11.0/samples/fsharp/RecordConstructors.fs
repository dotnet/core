module RecordConstructorSamples

type Point = { X: int; Y: int }
let origin = Point(0, 0)

let validate () =
    if origin <> { X = 0; Y = 0 } then failwith "Unexpected record constructor result."
    printfn "Carry-forward preview record constructor passed."
