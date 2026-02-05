# C# in .NET 11 Preview 1 - Release Notes

.NET 11 Preview 1 includes two new features in C#:

- [Collection expression arguments](#collection-expression-arguments)
- [Extended layout support](#extended-layout-support)

## Collection expression arguments

This feature enables developers to pass arguments to the constructor of a collection using [collection expression](https://learn.microsoft.com/dotnet/csharp/language-reference/operators/collection-expressions) syntax. You use the `with()` contextual keyword for the first element in the collection expression:

```csharp
// Initialize to twice the capacity since we'll have to add
// more values later.
List<string> names = [with(capacity: values.Count * 2), .. values];
```

The compiler generates code to call the []`List<T>` constructor](https://learn.microsoft.com/dotnet/api/system.collections.generic.list-1.-ctor#system-collections-generic-list-1-ctor(system-int32)) with the `capacity` argument set to `values.Count * 2`.

You can learn more about this new feature in the [What's new in C# 15](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-15) article. You'll find a longer description, and links to other documentation on the feature.

## Extended layout support

The C# compiler emits the `TypeAttributes.ExtendedLayout` for types that have the `System.Runtime.InteropServices.ExtendedLayoutAttribute` applied. This is primarily intended for the .NET runtime team to use for types in interop scenarios.

C# updates:

- [What's new in C#](https://learn.microsoft.com/dotnet/csharp/whats-new/) documentation
- [Breaking changes](https://learn.microsoft.com/dotnet/csharp/whats-new/breaking-changes/)
