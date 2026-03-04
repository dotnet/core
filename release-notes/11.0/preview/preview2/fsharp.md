# F# in .NET 11 Preview 2 - Release Notes

Here's a summary of what's new in F# in this Preview 2 release:

- [New language feature: Simplified DIM interface hierarchies (preview)](#simplified-dim-interface-hierarchies)
- [Compiler performance: Overload resolution caching (preview)](#overload-resolution-caching)
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

This release fixes **10 longstanding bugs** affecting `query { }` expressions and LINQ provider compatibility, some open for over 10 years. This significantly improves the F# story for Entity Framework Core, Cosmos DB, and other LINQ providers:

- Tuple joins and groupBy now work correctly — `join b on ((a.Id1, a.Id2) = (b.Id1, b.Id2))` finally works. ([#7885](https://github.com/dotnet/fsharp/issues/7885), [#47](https://github.com/dotnet/fsharp/issues/47))
- Tuple projections preserve `IQueryable` instead of falling back to `Enumerable.Select`, enabling `ToListAsync()` and other async EF Core operations. ([#3782](https://github.com/dotnet/fsharp/issues/3782), [#15133](https://github.com/dotnet/fsharp/issues/15133))
- Array indexing in LINQ expressions generates proper `ArrayIndex` nodes, enabling Cosmos DB to translate array access. ([#16918](https://github.com/dotnet/fsharp/issues/16918))
- Anonymous record field ordering in expression trees is now consistent regardless of declaration order. ([#11131](https://github.com/dotnet/fsharp/issues/11131))
- Conditional queries without an else branch no longer cause type mismatch errors. ([#3445](https://github.com/dotnet/fsharp/issues/3445))
- Fixed false FS1182 warnings (unused variable) for query variables in `where`, `let`, `join`, and `select` clauses. ([#422](https://github.com/dotnet/fsharp/issues/422))

([PR #19243](https://github.com/dotnet/fsharp/pull/19243))

## Find All References and Rename overhaul

A comprehensive pass over the Find All References (FAR) and Rename Symbol features fixes **15+ longstanding bugs**, some open for over 7 years:

- Active pattern cases in signature files now found correctly. ([#19173](https://github.com/dotnet/fsharp/issues/19173), [#14969](https://github.com/dotnet/fsharp/issues/14969))
- Rename no longer incorrectly renames `get`/`set` keywords on properties. ([#18270](https://github.com/dotnet/fsharp/issues/18270))
- Rename now handles operators containing `.` (e.g., `-.-`). ([#17221](https://github.com/dotnet/fsharp/issues/17221))
- C# extension methods now found across all usages. ([#16993](https://github.com/dotnet/fsharp/issues/16993))
- DU case tester properties (`.IsCase`) now included. ([#16621](https://github.com/dotnet/fsharp/issues/16621))
- FAR on record types now includes copy-and-update expressions. ([#15290](https://github.com/dotnet/fsharp/issues/15290))
- Constructor definitions now find all usages. ([#14902](https://github.com/dotnet/fsharp/issues/14902))
- External DLL symbol searches now scoped to referencing projects only (performance). ([#10227](https://github.com/dotnet/fsharp/issues/10227))
- `#line` directive remapping now applied correctly. ([#9928](https://github.com/dotnet/fsharp/issues/9928))
- DU types inside modules now discoverable. ([#5545](https://github.com/dotnet/fsharp/issues/5545))
- Synthetic event handler values no longer appear in results. ([#4136](https://github.com/dotnet/fsharp/issues/4136))
- FAR no longer crashes on projects containing non-F# files like `.cshtml`. ([#16394](https://github.com/dotnet/fsharp/issues/16394))

([PR #19252](https://github.com/dotnet/fsharp/pull/19252), [PR #19311](https://github.com/dotnet/fsharp/pull/19311))

## Bug fixes and other improvements

- Nullness: `int<meter>.ToString()` no longer returns `string | null` for value types. ([#17539](https://github.com/dotnet/fsharp/issues/17539))
- Nullness: Pipe operator warnings now point at the nullable argument, not the pipe operator. ([#18013](https://github.com/dotnet/fsharp/issues/18013))
- Nullness: Fixed false positive warning when passing non-null `AllowNullLiteral` constructor result. ([#18021](https://github.com/dotnet/fsharp/issues/18021))
- Nullness: `not null` constraint on type extensions is now allowed. ([#18334](https://github.com/dotnet/fsharp/issues/18334))
- Nullness: Tuple null elimination no longer over-infers non-null in pattern matching. ([#19042](https://github.com/dotnet/fsharp/issues/19042))
- Fixed FS0229 error when reading metadata from assemblies compiled with `LangVersion < 9.0`. ([PR #19260](https://github.com/dotnet/fsharp/pull/19260))
- Fixed FS3356 false positive for instance extension members with the same name on different types. ([PR #19260](https://github.com/dotnet/fsharp/pull/19260))
- Fixed graph-based type checking dependency resolution for duplicate module names across files. ([PR #19280](https://github.com/dotnet/fsharp/pull/19280))
- Fixed F# script default reference paths when an SDK directory is specified. ([PR #19270](https://github.com/dotnet/fsharp/pull/19270))

...and many others.

F# updates:

- [F# release notes](https://fsharp.github.io/fsharp-compiler-docs/release-notes/About.html)
- [dotnet/fsharp repository](https://github.com/dotnet/fsharp)
