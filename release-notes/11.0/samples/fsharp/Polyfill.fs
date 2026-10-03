namespace System.Diagnostics.CodeAnalysis

open System

[<AttributeUsage(AttributeTargets.Method ||| AttributeTargets.Constructor)>]
type RequireNamedArgumentsAttribute() =
    inherit Attribute()
