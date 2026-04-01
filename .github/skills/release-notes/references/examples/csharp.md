# C# Examples

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

---
Source: [.NET 10 Preview 7 — C#](../../../../../release-notes/10.0/preview/preview7/csharp.md)
Commentary: Code-first — one sentence of context, then the syntax, then rule bullets. Language features need to be seen, not just described.
Why it works: Shows the code immediately. The rule bullets follow naturally as "here's what you need to know." No motivation section needed.
Style note: Line 21 ("Several of the rules for extension operators are demonstrated in the preceding example:") is stiff. Prefer something direct like "The rules for extension operators:" or "Extension operator rules:" — the reader can see the example is right above.

---
