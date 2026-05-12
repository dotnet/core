# F# in .NET 11 Preview 4 - Release Notes

Here's a summary of what's new in F# in this Preview 4 release:

- [Improved diagnostic messages](#improved-diagnostic-messages)
- [Codegen correctness — fewer runtime crashes from valid F# code](#codegen-correctness--fewer-runtime-crashes-from-valid-f-code)
- [Signature generation roundtrips cleanly](#signature-generation-roundtrips-cleanly)
- [Missing implementations for C# `abstract override` are now caught at compile time](#missing-implementations-for-c-abstract-override-are-now-caught-at-compile-time)
- [Faster IDE responsiveness with generative type providers](#faster-ide-responsiveness-with-generative-type-providers)
- [Bug fixes and other improvements](#bug-fixes-and-other-improvements)

## Improved diagnostic messages

A batch of long-standing usability issues with compiler diagnostics has been addressed. The focus is clearer wording, actionable hints, and catching common beginner mistakes that previously produced opaque error text ([dotnet/fsharp #19398](https://github.com/dotnet/fsharp/pull/19398)).

Highlights:

- **New informational warning FS3886** for a single tuple in a list literal — `[1, 2, 3]` is almost always a typo for `[1; 2; 3]`. Suppressible via `#nowarn "3886"`.
- **New error FS3885** when `let!`/`use!` is used as the final expression in a computation expression, replacing the confusing `Unexpected symbol }`.
- **FS0670** (the "code is not sufficiently generic" error) now suggests concrete fixes: add a type annotation, convert to a function, or mark the binding `inline`.
- **FS3082** lists the available static parameter names (truncated at 5) when an unknown one is supplied.
- **FS0072** ("Lookup on object of indeterminate type...") rewritten in plain English with an example annotation.
- **Tuple-shaped errors** now say "is a tuple of type" / "given a tuple of type" when the actual type is a tuple, and the parser hints at unintended commas instead of reporting a generic missing argument.
- **Elif chains without a final `else`** now report "missing else branch" instead of a confusing type-mismatch error.
- **FS0597** reworked with a concrete example: `printfn "%s" (arg.Trim())`.
- **SRTP errors on function or tuple types** now append the hint "or the operator may not be in scope".

```fsharp
let xs = [1, 2, 3]
// warning FS3886: This list contains a single tuple element. Did you mean to use ';' instead of ','?

let compute x =
    async {
        let! result = doWorkAsync x
    }
// error FS3885: 'let!' / 'use!' cannot be the final construct in a computation expression.
```

## Codegen correctness — fewer runtime crashes from valid F# code

Several long-standing IL-emit bugs that produced `TypeLoadException`, `InvalidProgramException`, or stack corruption at runtime for otherwise valid F# programs are now fixed ([dotnet/fsharp #19338](https://github.com/dotnet/fsharp/pull/19338)). This continues the codegen-correctness work started in Preview 3, which dropped the F# compiler's ILVerify error count from 551 to 56.

Fixes in this preview:

- `voidptr` in delegate generic arguments and interface instantiations is now correctly encoded as `nativeint` in closure metadata.
- Tail calls are now suppressed in methods that use `NativePtr.stackalloc` / `localloc`, where they were unsafe.
- Generic type parameter constraints are no longer stripped from `Specialize<>` closure methods.
- The `box` instruction is no longer emitted spuriously for literal upcasts (including default parameter values) or for decimal literals in debug builds.

## Signature generation roundtrips cleanly

`FSharpCheckFileResults.GenerateSignature` and `fsc --sig` now produce signatures that roundtrip-compile against their implementations across a much wider range of inputs ([dotnet/fsharp #19586](https://github.com/dotnet/fsharp/pull/19586), [dotnet/fsharp #19609](https://github.com/dotnet/fsharp/pull/19609)). A corpus-wide sweep of 1,483 standalone test files was used to drive out the remaining bugs.

Fixes include:

- Recursive module `do` bindings no longer leak compiler-generated `val`s into the signature.
- Literal values in attribute arguments are preserved as identifiers instead of being reduced to constants.
- Struct types now carry the correct `[<NoComparison>]` / `[<NoEquality>]` attributes in display.
- Backtick escaping is correct for identifiers that themselves contain backticks.
- The `private` keyword is placed correctly in prefix-style type abbreviation signatures.
- Types without visible constructors now emit the `[<Class>]` attribute.
- `namespace global` is detected on the `fsc --sig` path, not just through the FCS API.

The on-disk pickle format is unchanged — old compilers read new DLLs identically. Display improvements also flow into IDE tooltips.

## Missing implementations for C# `abstract override` are now caught at compile time

When a non-abstract F# class inherited from a C# class containing `abstract override` members (for example `public abstract override string ToString()`), the F# compiler did not flag the missing implementation, and the program failed at runtime with `TypeLoadException`. The compiler now correctly reports FS0365 at compile time ([dotnet/fsharp #19503](https://github.com/dotnet/fsharp/pull/19503)).

```csharp
// C#
public abstract class Base {
    public abstract override string ToString();
}
```

```fsharp
// F#
type Derived() =
    inherit Base()
// error FS0365: No implementation was given for 'Base.ToString() : string'
```

## Faster IDE responsiveness with generative type providers

Solutions using generative type providers no longer pin the IDE language service at high CPU. `TypeStructure.GetHashCode` previously computed an O(n) hash over the underlying `TypeToken[]` on every cache lookup, and the type-subsumption cache rehashed all entries on each `rebuildStore`. The hash is now precomputed once at construction (O(1) lookup), with a fast-path equality check that compares cached hashes before token arrays ([dotnet/fsharp #19369](https://github.com/dotnet/fsharp/pull/19369)).

The reported scenario — a multi-project solution referencing a generative type provider with ~15 provided types — saw sustained ~150% CPU on the F# language service that no longer reproduces. Thank you [@OnurGumus](https://github.com/OnurGumus) for this contribution!

## Bug fixes and other improvements

### Computation expressions and SRTP

- Pattern-based extension method lookups for computation-expression members (`Bind`, `Delay`, `Run`, etc.) and for the `Dispose` pattern in `use` bindings now honor accessibility and type-compatibility checks. Previously they could resolve to private extension methods or methods on incompatible types ([dotnet/fsharp #19536](https://github.com/dotnet/fsharp/pull/19536)). Thank you [@evgTSV](https://github.com/evgTSV)!
- Fixed `seq { }` `try`/`with` running the handler body twice when the handler itself yielded ([dotnet/fsharp #19660](https://github.com/dotnet/fsharp/pull/19660)).
- Fixed a `builder@` variable leak in resumable state machines introduced by the Preview 2 task-builder optimization ([dotnet/fsharp #19630](https://github.com/dotnet/fsharp/pull/19630)). Thank you [@majocha](https://github.com/majocha)!
- Fixed SRTP trait call overload resolution returning the wrong typed value across multiple FSI submissions ([dotnet/fsharp #19471](https://github.com/dotnet/fsharp/pull/19471)).
- Fixed a `NullReferenceException` when calling virtual `Object` methods on value types through inline SRTP code ([dotnet/fsharp #8098](https://github.com/dotnet/fsharp/pull/8098)).

### Symbols API, tooltips, and completion

- `CLIEvent` properties are now reported as events through the Symbols API: `IsEvent` returns `true`, the XML doc signature uses the `E:` prefix, and tooltips render `event EventName` ([dotnet/fsharp #18584](https://github.com/dotnet/fsharp/pull/18584)).
- Methods are now tagged as `Method` rather than `Member` in tooltips, fixing a regression that affected colorization and classification ([dotnet/fsharp #19507](https://github.com/dotnet/fsharp/pull/19507)).
- Compiler-generated auto-property symbols (the `v` setter parameter and `Foo@` backing field for `member val Foo = 123 with get, set`) are no longer surfaced through `GetAllUsesOfAllSymbolsInFile` ([dotnet/fsharp #19498](https://github.com/dotnet/fsharp/pull/19498)).
- Completion now consistently filters obsolete fields and events ([dotnet/fsharp #13512](https://github.com/dotnet/fsharp/pull/13512)).
- `IlxGen` now emits the `CompilationMapping` attribute for generic values ([dotnet/fsharp #19643](https://github.com/dotnet/fsharp/pull/19643)). Thank you [@auduchinok](https://github.com/auduchinok)!

### Compiler correctness

- `AttributeUsage.AllowMultiple` is now correctly inherited through C#-defined attribute hierarchies — the inheritance walk previously only consulted F# augmentation data and missed IL-imported supertypes ([dotnet/fsharp #19315](https://github.com/dotnet/fsharp/pull/19315)). Thank you [@edgarfgp](https://github.com/edgarfgp)!
- Type definitions no longer emit duplicate or incorrect metadata: DU case names that match IWSAM member names no longer produce duplicate property entries, `DefaultAugmentation(false)` no longer causes duplicate method-table entries, and abstract event `add_`/`remove_` accessors are now emitted with the `SpecialName` flag ([dotnet/fsharp #19341](https://github.com/dotnet/fsharp/pull/19341)).
- Fixed FS0452 in quotations that pattern-match an empty string (`match s with "" -> ...`) — the empty-string optimization to `mkNonNullTest` had no quotation translator handler ([dotnet/fsharp #19532](https://github.com/dotnet/fsharp/pull/19532)).
- Fixed an incorrect range on warning 20 inside sequential expressions ([dotnet/fsharp #5735](https://github.com/dotnet/fsharp/pull/5735)).

## Community contributors

Thank you contributors! ❤️

- [@auduchinok](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Aauduchinok)
- [@edgarfgp](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Aedgarfgp)
- [@evgTSV](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3AevgTSV)
- [@majocha](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Amajocha)
- [@Martin521](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3AMartin521)
- [@omajid](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Aomajid)
- [@OnurGumus](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3AOnurGumus)
- [@techiedesu](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3Atechiedesu)
- [@Youssef1313](https://github.com/dotnet/fsharp/pulls?q=is%3Apr+is%3Amerged+author%3AYoussef1313)

F# updates:

- [F# release notes](https://fsharp.github.io/fsharp-compiler-docs/release-notes/About.html)
- [dotnet/fsharp repository](https://github.com/dotnet/fsharp)
