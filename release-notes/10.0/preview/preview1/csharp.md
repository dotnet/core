# C# 14 updates in .NET 10 Preview 1 - Release Notes

.NET 10 Preview 1 includes the following C# features & enhancements:

- [`nameof` in unbound generics](#unbound-generic-support-for-nameof)
- [Implicit span conversions](#implicit-span-conversions)
- [`field` backed properties](#field-backed-properties)
- [Modifiers on simple lambda parameters](#modifiers-on-simple-lambda-parameters)
- [Experimental feature - String literals in data section](#preview-feature-string-literals-in-data-section)


C# 14 updates:

- [What's new in C# 14](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-14) documentation
- [Breaking changes in C# 14](https://learn.microsoft.com/dotnet/csharp/whats-new/breaking-changes/compiler%20breaking%20changes%20-%20dotnet%2010)

## Field-backed properties

Field-backed properties provide a smoother path from auto-implemented properties to writing your own `get` and `set` accessors. You can access the compiler-generated backing field using the `field` contextual keyword in a `get` or `set` accessor. You can learn more about this feature in the article on the new [`field` keyword](https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/field).

## Unbound generic support for `nameof`

The argument to a `nameof` expression can be an unbound generic type, like `List<>`. The result of the expression is "List". Previously, you'd need to supply a type argument for each type parameter.  You can learn more in our docs on the [`nameof`](https://learn.microsoft.com/dotnet/csharp/language-reference/operators/nameof) expression.

## Implicit Span conversions

C# 14 introduces first-class support for `Span<T>` and `ReadOnlySpan<T>` in the language. `Span<T>` and `ReadOnlySpan<T>` are used in many key ways in C# and the runtime. This support involves new implicit conversions allowing more natural programming with these types.

You can learn more in the article on [built-in types](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/built-in-types.md) in the C# guide.

## Modifiers on simple lambda parameters

You can add parameter modifiers, such as `ref`, `in`, or `out` to lambda expressions without specifying the type of the parameters. This makes it easier for you to use these modifiers. You can learn more in the article on [lambda expressions](https://learn.microsoft.com/dotnet/csharp/language-reference/operators/lambda-expressions.md#input-parameters-of-a-lambda-expression) in the C# language reference.

## Experimental feature: String literals in data section


This opt-in experimental feature allows changing how string literals in C# programs are emitted into PE files. By turning on the feature flag, string literals (where possible) are emitted as UTF-8 data into a different section of the PE file without a data limit. The emit format is similar to explicit UTF-8 string literals.


You can learn more by reading the feature [documentation](https://github.com/dotnet/roslyn/blob/main/docs/features/string-literals-data-section.md).
