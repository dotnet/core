module SrtpSamples

open System

type MyOffset = { Hours: float }

type System.DateTime with
    static member (+) (date: DateTime, offset: MyOffset) =
        date.AddHours(offset.Hours)

let inline shift (date: DateTime) offset = date + offset

let oneHourLater = shift DateTime.MinValue (TimeSpan.FromHours 1.0)
let twoHoursLater = shift DateTime.MinValue { Hours = 2.0 }

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
    if oneHourLater <> DateTime.MinValue.AddHours 1.0 ||
       twoHoursLater <> DateTime.MinValue.AddHours 2.0 then
        failwith "Generic DateTime shifting did not retain both overload choices."
    printfn "Preview SRTP extension operators passed."
