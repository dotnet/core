# C# in .NET 11 Preview 3 - Release Notes

C# in Preview 3 includes an update for `union` types:

- [`union` type support](#union-type-support)

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
