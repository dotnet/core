# C# in .NET 10 Preview 7 - Release Notes

Here's a summary of what's new in C# in this preview release:

- [Extension operators](#extension-operators)
- [Named and optional arguments in expression trees](#named-and-optional-parameters-in-expression-trees)

Preview 7 represents feature complete for C# 14. Any features available only in later previews will be gated behind feature flags. That enables a longer feedback cycle for any additional features.

C# updates in .NET 10:

- [What's new in C# 14](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-14) documentation
- [Breaking changes in C# 14](https://learn.microsoft.com/dotnet/csharp/whats-new/breaking-changes/compiler%20breaking%20changes%20-%20dotnet%2010)

## Extension operators

The new extension blocks now include support for *operators*, with the exception of implicit and explicit conversion operators. You can declare operators in extension blocks, as shown in the following example:

```csharp
public static class Operators
{
    extension<TElement>(TElement[] source) where TElement : INumber<TElement>
    {
        public static TElement[] operator *(TElement[] vector, TElement scalar) { ... }
        public static TElement[] operator *(TElement scalar, TElement[] vector) { ... }
        public void operator *=(TElement scalar) { ... }
        public static bool operator ==(TElement[] left, TElement[] right) { ... }
        public static bool operator !=(TElement[] left, TElement[] right) { ... }
    }
}
```

Several of the rules for extension operators are demonstrated in the preceding example:

- At least one of the operands must be the *extended type*, `TElement[]` in the preceding example.
- For operators that require pair-wise declarations, such as `==` and `!=` in the preceding example, both operators must be declared in the same static class. They are not required to be in the same `extension` container.
- Instance compound assignment operators, and instance increment and decrement operators are expected to mutate the current instance. Therefore reference type parameters must be passed by value and value type parameters must be passed by `ref`. These operators can't be declared when the extended type is an unconstrained type parameter.
- Extension operators, like other extension members, can't use the `abstract`, `virtual`, `override`, or `sealed` modifiers. This is consistent with other extension members.

Extension members are only considered for overload resolution when no applicable predefined or user defined non-extension members are found.

## Named and optional parameters in expression trees

This is a small feature that removes a limitation for *expression trees*. Code in lambda expressions can use optional parameters and named arguments when converted to an expression tree. The call rewriting orders named arguments and provides values for missing optional parameters. Query providers shouldn't need to make any adjustments for this support.
