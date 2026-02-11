# C# in .NET 11 Preview 1 - Release Notes

.NET 11 Preview 1 includes two new features in C#:

- [Collection expression arguments](#collection-expression-arguments)
- [Extended layout support](#extended-layout-support)

C# updates:

- [What's new in C#](https://learn.microsoft.com/dotnet/csharp/whats-new/) documentation
- [Breaking changes](https://learn.microsoft.com/dotnet/csharp/whats-new/breaking-changes/)

## Collection expression arguments

This feature supports scenarios where a collection expression doesn't produce the collection type you need. You might want to pre-allocate storage because you know how you'll use the collection. For sorted collections, you may want to specify a different expression to compare items in the collection. For dictionaries, you may need a different expression to compare or find keys.

You specify arguments to the constructor of the collection in a `with()` element in the [collection expression](https://learn.microsoft.com/dotnet/csharp/language-reference/operators/collection-expressions). The `with()` element must be the first element in the collection expression. You can specify values for any of the arguments to a specified constructor for the collection, as shown in the following example:

```csharp
// Initialize to twice the capacity since we'll have to add
// more values later.
List<string> names = [with(capacity: values.Count * 2), .. values];
```

The compiler generates code to call the [`List<T>` constructor](https://learn.microsoft.com/dotnet/api/system.collections.generic.list-1.-ctor#system-collections-generic-list-1-ctor(system-int32)) with the `capacity` argument set to `values.Count * 2`.

You can learn more about this new feature in the [What's new in C# 15](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-15) article. You'll find a longer description, and links to other documentation on the feature. This information includes information on how to specify arguments when the target type is an interface, such as `IEnumerable<T>`.

This feature will integrate with [dictionary expressions](https://github.com/dotnet/roslyn/blob/main/docs/Language%20Feature%20Status.md#working-set-c), which is in progress now.

## Extended layout support

The C# compiler emits the `TypeAttributes.ExtendedLayout` for types that have the `System.Runtime.InteropServices.ExtendedLayoutAttribute` applied. This is primarily intended for the .NET runtime team to use for types in interop scenarios.
