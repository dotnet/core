# C# in .NET 11 Preview 3 - Release Notes

C# in Preview 3 continues the Unsafe Evolution preview feature:

- [`union` type support](#union-type-support)
- [Unsafe Evolution adds clearer warnings and errors](#unsafe-evolution-adds-clearer-warnings-and-errors)
- [Breaking changes](#breaking-changes)

## `union` type support

Compiler support for `union` types was added in preview 2. Preview 3 includes better IDE support for working with `union` types. You can read the details in our [blog post](https://devblogs.microsoft.com/dotnet/csharp-15-union-types/) on `union` types, and in the [C# Guide](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-15#union-types). The What's new page provides links to the language reference, and will include links to tutorials and more in the near future.

Note that in preview 3, you need to provide polyfills for the `UnionAttribute` type and the `IUnion` interface:

```csharp
namespace System.Runtime.CompilerServices
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Struct,
        AllowMultiple = false)]
    public sealed class UnionAttribute : Attribute;

    public interface IUnion
    {
        object? Value { get; }
    }
}
```

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
