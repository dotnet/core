# F# in .NET 11 Preview 2 - Release Notes

Here's a summary of what's new in F# in this Preview 2 release:

- [New language feature: Simplified DIM interface hierarchies (preview)](#simplified-dim-interface-hierarchies)
- [Compiler performance: Overload resolution caching (preview)](#overload-resolution-caching)
- [New language feature: `#elif` preprocessor directive](#elif-preprocessor-directive)
- [FSharp.Core: `partitionWith` for collections](#partitionwith-for-collections)
- [FSharp.Core: Big-O complexity documentation for all collection functions](#big-o-complexity-documentation)
- [Query expression fixes for EF Core and LINQ providers](#query-expression-fixes)
- [IDE: Find All References and Rename overhaul](#find-all-references-and-rename-overhaul)
- [Bug fixes](#bug-fixes-and-other-improvements)

## Simplified DIM interface hierarchies

When a C# interface provides a Default Interface Member (DIM) implementation for a base interface slot, F# no longer requires you to explicitly implement the already-covered slot. Given these C# interfaces:

```csharp
public interface IA { int M(); }
public interface IB : IA {
    new int M();
    int IA.M() => this.M() + 100;  // DIM covers IA.M
}
```

F# previously required implementing both `IA` and `IB`. Now you only implement `IB`:

```fsharp
type C() =
    interface IB with member _.M() = 42

(C() :> IB).M()   // 42
(C() :> IA).M()   // 142 (DIM forwards: this.M() + 100)
```

This also works with diamond inheritance, generic interfaces, properties, events, structs, and object expressions. Requires `--langversion:preview`. ([RFC FS-1336](https://github.com/fsharp/fslang-design/pull/826), [Language suggestion #1430](https://github.com/fsharp/fslang-suggestions/issues/1430), [PR #19241](https://github.com/dotnet/fsharp/pull/19241))

## Overload resolution caching

A new preview feature (`--langversion:preview`) caches overload resolution results for repeated method calls with the same argument types. In a benchmark compiling a file with 5,000 `Assert.Equal(x, y)` calls (a common pattern in test projects):

| Metric | .NET 9 SDK | .NET 10 SDK | This feature |
|---|---|---|---|
| Typecheck time | 40.8s | 6.5s | **2.9s** |
| GC0 collections | — | 115 | **21** |

The cache is keyed on method group identity, argument types, and return type. It is automatically disabled for named arguments, SRTP constraints, and other context-dependent scenarios. ([#18807](https://github.com/dotnet/fsharp/issues/18807), [PR #19072](https://github.com/dotnet/fsharp/pull/19072))

## `#elif` preprocessor directive

F# now supports `#elif` in conditional compilation directives, eliminating the need for deeply nested `#if`/`#else`/`#endif` chains. This has been a frequently requested feature — previously, targeting multiple platforms required awkward nesting:

```fsharp
#if WIN64
let path = "/library/x64/runtime.dll"
#elif WIN86
let path = "/library/x86/runtime.dll"
#elif MAC
let path = "/library/iOS/runtime-osx.dll"
#else
let path = "/library/unix/runtime.dll"
#endif
```

`#elif` supports `&&`, `||`, and `!` in conditions, arbitrary chaining, and nesting. Requires `--langversion:11.0`. ([RFC FS-1334](https://github.com/fsharp/fslang-design/blob/main/RFCs/FS-1334-elif-preprocessor-directive.md), [Language suggestion #1370](https://github.com/fsharp/fslang-suggestions/issues/1370), [PR #19323](https://github.com/dotnet/fsharp/pull/19323))

## `partitionWith` for collections

New `partitionWith` functions on `Array`, `List`, `Set`, and `Array.Parallel` split a collection into two using a `Choice<'T1, 'T2>` partitioner — allowing each partition to have a different element type, unlike `partition` which keeps the same type for both:

```fsharp
val inline partitionWith: partitioner: ('T -> Choice<'T1, 'T2>) -> list: 'T list -> 'T1 list * 'T2 list
```

Since a total active pattern `(|A|B|)` is already `'T -> Choice<'T1, 'T2>`, it can be passed directly:

```fsharp
let (|Valid|Invalid|) (s: string) =
    match System.Int32.TryParse s with
    | true, n -> Valid n
    | _ -> Invalid s

let parsed, errors =
    ["42"; "hello"; "7"; "oops"; "99"]
    |> List.partitionWith (|Valid|Invalid|)

// parsed = [42; 7; 99]
// errors = ["hello"; "oops"]
```

([Language suggestion #1119](https://github.com/fsharp/fslang-suggestions/issues/1119), [PR #19335](https://github.com/dotnet/fsharp/pull/19335))

## Big-O complexity documentation

All 462 functions across `Array`, `List`, `Seq`, `Map`, and `Set` now include Big-O complexity in their XML docs, visible in IDE tooltips:

```fsharp
/// <remarks>This is an O(n) operation, where n is the length of the first list.</remarks>
val append: list1: 'T list -> list2: 'T list -> 'T list

/// <remarks>This is an O(log(n)) operation.</remarks>
val tryFind: key: 'Key -> table: Map<'Key, 'Value> -> 'Value option
```

([PR #19240](https://github.com/dotnet/fsharp/pull/19240))

## Query expression fixes

This release fixes **10 longstanding bugs** affecting `query { }` expressions and LINQ provider compatibility, some open for over 10 years. Tuple joins, tuple projections preserving `IQueryable`, array indexing for Cosmos DB, anonymous record field ordering, conditional queries without `else`, and false FS1182 warnings on query variables are all resolved. This significantly improves the F# story for Entity Framework Core, Cosmos DB, and other LINQ providers. ([PR #19243](https://github.com/dotnet/fsharp/pull/19243))

## Find All References and Rename overhaul

A comprehensive pass over the Find All References (FAR) and Rename Symbol features fixes **15+ longstanding bugs**, some open for over 7 years — covering active patterns in signature files, rename of property accessors and operators, C# extension methods, DU case testers, record copy-and-update expressions, constructor usages, and more. ([PR #19252](https://github.com/dotnet/fsharp/pull/19252), [PR #19311](https://github.com/dotnet/fsharp/pull/19311), [PR #19358](https://github.com/dotnet/fsharp/pull/19358))

## Bug fixes and other improvements

- `Set.intersect` no longer has argument-order-dependent performance — previously, `Set.intersect huge tiny` was up to 8,000× slower than `Set.intersect tiny huge`. ([#19139](https://github.com/dotnet/fsharp/issues/19139), [PR #19292](https://github.com/dotnet/fsharp/pull/19292))
- Improved static compilation of state machines for `task { }` and resumable code patterns. ([#19296](https://github.com/dotnet/fsharp/issues/19296), [#12839](https://github.com/dotnet/fsharp/issues/12839), [PR #19297](https://github.com/dotnet/fsharp/pull/19297))
- Five fixes to nullable reference type checking — fewer false positives for value types with units of measure, `AllowNullLiteral` constructors, type extensions with `not null` constraints, tuple pattern matching, and better warning locations for piped expressions. ([PR #19262](https://github.com/dotnet/fsharp/pull/19262))
- Fixed cross-version metadata compatibility (FS0229) when referencing assemblies compiled with `LangVersion < 9.0`. ([PR #19260](https://github.com/dotnet/fsharp/pull/19260))

F# updates:

- [F# release notes](https://fsharp.github.io/fsharp-compiler-docs/release-notes/About.html)
- [dotnet/fsharp repository](https://github.com/dotnet/fsharp)
