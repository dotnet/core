# C# Examples

## Extension operators

> Source: [.NET 10 Preview 7 — C#](../../../../release-notes/10.0/preview/preview7/csharp.md)

Medium — one sentence of context, then a code block showing the new syntax, then rule bullets. Code-first because the syntax *is* the feature.

> The new extension blocks now include support for *operators*, with the exception of implicit and explicit conversion operators. You can declare operators in extension blocks, as shown in the following example:

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

> Several of the rules for extension operators are demonstrated in the preceding example:
>
> - At least one of the operands must be the *extended type*, `TElement[]` in the preceding example.
> - For operators that require pair-wise declarations, such as `==` and `!=`, both operators must be declared in the same static class.
> - Instance compound assignment operators, and instance increment and decrement operators are expected to mutate the current instance.
> - Extension operators, like other extension members, can't use the `abstract`, `virtual`, `override`, or `sealed` modifiers.

**Why it works**: shows the code immediately — language features need to be seen, not just described. The rule bullets follow naturally as "here's what you need to know." No motivation section needed because C# developers will already understand why extension operators are useful.
