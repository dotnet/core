# C# in .NET 11 Preview 3 - Release Notes

C# in Preview 3 is a small but important update for the ongoing unsafe-evolution
work:

- [Unsafe code gets clearer diagnostics and annotations](#unsafe-code-gets-clearer-diagnostics-and-annotations)
- [Breaking changes](#breaking-changes)

## Unsafe code gets clearer diagnostics and annotations

The Roslyn *Unsafe evolution* work continues in Preview 3 with clearer
language-version errors for updated memory-safety rules, better handling around
`new()` constraints, and new warnings for `unsafe` delegates
([dotnet/roslyn#82687](https://github.com/dotnet/roslyn/pull/82687),
[dotnet/roslyn#82647](https://github.com/dotnet/roslyn/pull/82647),
[dotnet/roslyn#82730](https://github.com/dotnet/roslyn/pull/82730)). The
runtime side also picked up supporting unsafe-evolution attributes
([dotnet/runtime#125721](https://github.com/dotnet/runtime/pull/125721)).

This is not a flashy feature, but it is exactly the kind of foundational language
work that benefits from being explained as one story instead of scattered across
multiple tiny PR notes.

```csharp
unsafe delegate int ReadCallback(byte* data, int length);

// Preview 3 adds clearer diagnostics when unsafe requirements flow through
// delegate signatures and related generic constraints.
```

## Breaking changes

- Advanced unsafe code may now produce new warnings or language-version errors
  that make previously implicit requirements explicit. Review new diagnostics and
  add `unsafe` or updated annotations where appropriate.
