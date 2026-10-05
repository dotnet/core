module SrtpSamples

type System.String with
    static member (*) (s: string, n: int) =
        System.String.Concat(Array.replicate n s)

let repeated = "ha" * 3

type System.Int32 with
    static member (++) (a: int, b: int) = a + b + 1

let inline incAdd (x: ^T) (y: ^T) = x ++ y
let result = incAdd 3 4

let validate () =
    if repeated <> "hahaha" || result <> 8 then
        failwithf "Unexpected extension-operator results: %s, %d" repeated result
    printfn "Preview SRTP extension operators passed."
