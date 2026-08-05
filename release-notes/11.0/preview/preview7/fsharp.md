# F# in .NET 11 Preview 7 - Release Notes

<!-- Verified against dotnet/fsharp PR descriptions and by compiling each sample against the installed SDK 11.0.100-preview.7.26381.103. -->

Here's a summary of what's new in F# in this Preview 7 release:

- [Computation expression bindings inside a plain let RHS](#computation-expression-bindings-inside-a-plain-let-rhs)
- [Attributes resolve inside recursive modules and namespaces](#attributes-resolve-inside-recursive-modules-and-namespaces)
- [Clearer diagnostic for generic attribute type abbreviations](#clearer-diagnostic-for-generic-attribute-type-abbreviations)
- [Correct StructLayout size emission for data-less struct unions](#correct-structlayout-size-emission-for-data-less-struct-unions)
- [Community contributors](#community-contributors)

## Computation expression bindings inside a plain let RHS

A `let!`, `use!`, or `do!` on the right-hand side of a plain `let` binding inside a computation expression was previously rejected with FS0750. The compiler now desugars the RHS as a nested computation of the same builder, so its bindings stay scoped to the sub-computation instead of leaking into the continuation ([dotnet/fsharp #19868](https://github.com/dotnet/fsharp/pull/19868)).

```fsharp
open System.Threading.Tasks

task {
    let result =
        let! x = Task.FromResult 41
        x + 1
    return result   // now compiles; previously FS0750
}
```

## Attributes resolve inside recursive modules and namespaces

Attributes declared in a `module rec` or `namespace rec` can now be applied to types, union cases, record fields, and type parameters within the same recursive scope. Previously the attribute lookup could not see the attribute type before its own declaration was processed ([dotnet/fsharp #19744](https://github.com/dotnet/fsharp/pull/19744)).

```fsharp
module rec R =
    type MyAttr() = inherit System.Attribute()

    [<MyAttr>]
    type T = { X: int }

    [<MyAttr>]
    type U =
        | Case1
        | Case2 of value: int
```

## Clearer diagnostic for generic attribute type abbreviations

Applying a type abbreviation that refers to a generic attribute previously produced an internal compiler error (FS0193). The compiler now reports the same "Generic attribute types are not supported" diagnostic it already uses for direct generic attribute applications ([dotnet/fsharp #19915](https://github.com/dotnet/fsharp/pull/19915)).

```fsharp
type MyAttr<'T>() = inherit System.Attribute()
type B = MyAttr<int>
[<B>] let x = 1
// error FS3891: Generic attribute types are not supported in F#.
```

## Correct StructLayout size emission for data-less struct unions

Struct unions with no declared payload fields were emitted with `StructLayout(Size = 1)`, even when they were not actually empty value types. Union codegen now emits sequential layout without forcing an explicit size: multi-case struct unions carry a hidden tag field, and single-case struct unions rely on the CLR's minimum-1-byte guarantee for value types ([dotnet/fsharp #19759](https://github.com/dotnet/fsharp/pull/19759)).

```fsharp
[<Struct>] type SingleCase = | Only
[<Struct>] type MultiCase = | A | B | C

printfn "SingleCase size = %d" sizeof<SingleCase>   // 1
printfn "MultiCase size  = %d" sizeof<MultiCase>    // 4
```

<!-- Filtered features (real engineering work, but not release-note material):
  - Hot reload compiler foundations (#20017, #20018, #20024): internal Edit-and-Continue building
    blocks. No public surface area and no user-facing behavior change in Preview 7; the hot reload
    session tracked by dotnet/fsharp #19941 will consume them in a later preview.
  - Move VS language-service logic tests to FSharp.Compiler.Service.Tests (#20033): test reorganization.
  - Avoid leaking a MeterListener per Cache in DEBUG builds (#19995): DEBUG-only test-infra fix.
  - Bump FCSMinorVersion to 13 (#20045): versioning bookkeeping.
  - Tests/source context: support multiple carets (#20077): test harness change.
  - Localized file check-in by OneLocBuild (#20023): localization automation.
  - Dependency bumps to dotnet/msbuild, dotnet/roslyn, dotnet/arcade (#20041, #20042, #20048, #20049, #20051, #20052, #20054, #20055): repository infrastructure.
-->

## Community contributors

Thank you contributors! ❤️

- [@NatElkins](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3ANatElkins)

F# updates:

- [F# release notes](https://fsharp.github.io/fsharp-compiler-docs/release-notes/About.html)
- [dotnet/fsharp repository](https://github.com/dotnet/fsharp)
