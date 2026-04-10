# C# in .NET 11 Preview 3 - Release Notes

C# in Preview 3 continues the Unsafe Evolution preview feature:

- [Unsafe Evolution adds clearer warnings and errors](#unsafe-evolution-adds-clearer-warnings-and-errors)
- [Breaking changes](#breaking-changes)

## Unsafe Evolution adds clearer warnings and errors

> Unsafe Evolution remains a preview feature in .NET 11.

Preview 3 improves Unsafe Evolution diagnostics with clearer language-version
errors for updated memory-safety rules, better handling for `new()` constraints,
and new warnings for `unsafe` delegates
([dotnet/roslyn #82687](https://github.com/dotnet/roslyn/pull/82687),
[dotnet/roslyn #82647](https://github.com/dotnet/roslyn/pull/82647),
[dotnet/roslyn #82730](https://github.com/dotnet/roslyn/pull/82730)). The
runtime also adds supporting attributes for that feature work
([dotnet/runtime #125721](https://github.com/dotnet/runtime/pull/125721)).

These changes clarify when Unsafe Evolution rules apply and which annotations
are required in Preview 3.

```csharp
unsafe delegate int ReadCallback(byte* data, int length);

// Preview 3 adds clearer diagnostics when unsafe requirements flow through
// delegate signatures and related generic constraints.
```

## Breaking changes

- Advanced unsafe code may now produce new warnings or language-version errors
  that make previously implicit requirements explicit. Review new diagnostics and
  add `unsafe` or updated annotations where appropriate.
