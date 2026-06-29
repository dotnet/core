<!-- Verified by compiling against the .NET 11 Preview 6 SDK (11.0.100-preview.6) with LangVersion=preview -->
# C# in .NET 11 Preview 6 - Release Notes

.NET 11 Preview 6 includes the following C# language and compiler updates:

- [Extension indexers](#extension-indexers)
- [Unions ship their support types in the box](#unions-ship-their-support-types-in-the-box)

C# updates:

- [What's new in C# 15](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-15)

## Extension indexers

Extension members now include **indexers**, so you can add `this[...]` access to a type from an `extension` block ([dotnet/roslyn #81607](https://github.com/dotnet/roslyn/pull/81607)). This rounds out the extension members feature introduced in .NET 10, which already supported extension methods and properties.

An extension indexer is declared like an instance indexer inside an `extension` block. The following example adds from-the-end indexing to `IReadOnlyList<T>`, which defines `this[int]` but not `this[Index]`:

```csharp
using System;
using System.Collections.Generic;

IReadOnlyList<string> log = ["start", "work", "done"];

Console.WriteLine(log[^1]);   // done
Console.WriteLine(log[^2]);   // work

public static class ReadOnlyListExtensions
{
    extension<T>(IReadOnlyList<T> list)
    {
        public T this[Index index] => list[index.GetOffset(list.Count)];
    }
}
```

Extension indexers follow the same resolution rules as other extension members: they're only considered when no applicable instance indexer is found. They support multiple parameters, `get`/`set` accessors, and work in list patterns. Extension indexers remain a preview feature, so enable `<LangVersion>preview</LangVersion>` to use them.

## Unions ship their support types in the box

Preview 5 introduced `union` declarations and union patterns, but projects had to hand-author the compiler support types (`UnionAttribute` and `IUnion`). In Preview 6, those types ship in the framework as `System.Runtime.CompilerServices.UnionAttribute` and `System.Runtime.CompilerServices.IUnion`, so a `union` now compiles with no extra boilerplate:

```csharp
public record class Dog(string Name);
public record class Cat(int Lives);

public union Pet(Dog, Cat);

static string Describe(Pet pet) => pet switch
{
    Dog(var name) => $"dog: {name}",
    Cat(var lives) => $"cat: {lives}"
};
```

`System.Text.Json` now serializes union values, writing the active case directly ([dotnet/runtime #128162](https://github.com/dotnet/runtime/pull/128162)). Serializing a `Pet` that holds a `Dog("Rex")` produces `{"Name":"Rex"}`. See the [.NET Libraries release notes](./libraries.md) for the serialization details and the [ASP.NET Core release notes](./aspnetcore.md) for how unions appear in OpenAPI documents.

Preview 6 also refines the language rules for unions:

- A `union` declaration can use a non-public constructor that takes a single parameter ([dotnet/roslyn #83788](https://github.com/dotnet/roslyn/pull/83788)).
- A `not` pattern applies to the incoming union value rather than its contained value ([dotnet/roslyn #83904](https://github.com/dotnet/roslyn/pull/83904)).
- Custom union types support inheritance of their generated `Create` methods ([dotnet/roslyn #83991](https://github.com/dotnet/roslyn/pull/83991)).
- The compiler reports a clear error when a custom `union` declaration is missing the minimal set of required APIs ([dotnet/roslyn #83813](https://github.com/dotnet/roslyn/pull/83813)).

Unions remain a preview feature; enable `<LangVersion>preview</LangVersion>` to try them, and expect the surface to keep evolving before the feature ships.
