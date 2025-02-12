# C# 14 updates in .NET 10 Preview 1 - Release Notes

.NET 10 Preview 1 includes the following C# features & enhancements:

- [`nameof` in unbound generics](#unbound-generic-support-for-nameof)
- [`field` backed properties](#field-backed-properties)

C# 14 updates:

- [What's new in C# 14](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-14) documentation
- [Breaking changes in C# 14](https://learn.microsoft.com/dotnet/csharp/whats-new/breaking-changes/compiler%20breaking%20changes%20-%20dotnet%2010)

## Unbound generic support for `nameof`

The argument to a `nameof` expression can be an unbound generic type, like `List<>`. The result of the expression is "List". Previously, you'd need to supply a type argument for each type parameter.  You can learn more in our docs on the [`nameof`](https://learn.microsoft.com/dotnet/csharp/language-reference/operators/nameof) expression.

## Field-backed properties

Field-backed properties provide a smoother path from auto-implemented properties to writing your own `get` and `set` accessors. You can access the compiler-generated backing field using the `field` contextual keyword in a `get` or `set` accessor. You can learn more about this feature in the article on the new [`field` keyword](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/field).
