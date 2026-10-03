open System.Diagnostics.CodeAnalysis

type Calculator() =
    [<RequireNamedArguments>]
    member _.Double(value: int) = value * 2

Calculator().Double(21) |> ignore
