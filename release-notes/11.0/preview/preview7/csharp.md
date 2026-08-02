# C# in .NET 11 Preview 7 - Release Notes

.NET 11 Preview 7 includes the following C# language and compiler updates:

- [Labeled `break` and `continue`](#labeled-break-and-continue)
- [Union patterns match the union or its value](#union-patterns-match-the-union-or-its-value)
- [Exhaustiveness for type parameters constrained to a closed type](#exhaustiveness-for-type-parameters-constrained-to-a-closed-type)
- [Unsafe Evolution: compat mode and `nameof`](#unsafe-evolution-compat-mode-and-nameof)
- [Null check in compiler-synthesized inline-array helpers](#null-check-in-compiler-synthesized-inline-array-helpers)
- [Clearer runtime-async unsupported-feature diagnostic](#clearer-runtime-async-unsupported-feature-diagnostic)

C# updates:

- [What's new in C# 15](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-15)

## Labeled `break` and `continue`

`break` and `continue` can now name an enclosing loop or `switch`, so you can exit or continue an outer construct directly from an inner one without threading state through a flag or resorting to `goto` ([dotnet/roslyn #84281](https://github.com/dotnet/roslyn/pull/84281)). The corresponding language proposal lives at [dotnet/csharplang labeled-break-continue](https://github.com/dotnet/csharplang/blob/main/proposals/labeled-break-continue.md).

Prefix the target loop with a label, then reference it from `break` or `continue`:

```csharp
string? foundValue = null;
outer:
for (int x = 0; x < xMax; x++)
{
    for (int y = 0; y < yMax; y++)
    {
        if (GetValue(x, y) is { } value && value == target)
        {
            foundValue = value;
            break outer;
        }
    }
}
```

The same label can drive `continue`:

```csharp
row:
for (int i = 0; i < rows; i++)
{
    for (int j = 0; j < cols; j++)
    {
        if (ShouldSkipRestOfRow(i, j)) continue row;
        Process(i, j);
    }
}
```

The label must be attached directly to a `for`, `foreach`, `while`, `do`, or `switch` statement, and the labeled `break`/`continue` must appear inside that statement.

## Union patterns match the union or its value

`union` types now use the **Try-Both** matching approach: when a pattern is applied to a union value, the compiler first tests the pattern against the union instance itself, and — if that test fails — against the union's contained `Value`. This aligns matching semantics with the [updated `unions` speclet](https://github.com/dotnet/csharplang/blob/main/proposals/unions.md#union-matching) and applies to type, `var`, declaration, list, and recursive patterns ([dotnet/roslyn #84323](https://github.com/dotnet/roslyn/pull/84323), [dotnet/roslyn #84365](https://github.com/dotnet/roslyn/pull/84365), [dotnet/roslyn #84418](https://github.com/dotnet/roslyn/pull/84418), [dotnet/roslyn #84531](https://github.com/dotnet/roslyn/pull/84531)).

```csharp
public record class Dog(string Name);
public record class Cat(int Lives);

public union Pet(Dog, Cat);

Pet pet = new Cat(9);

// Match against the union instance itself
if (pet is Pet)              // true — the union type is a valid match target
    Console.WriteLine("got a pet");

// Match against the contained value
if (pet is Cat { Lives: > 0 } cat)
    Console.WriteLine($"cat has {cat.Lives} lives");
```

Alongside this shift, type-checking during binding stops propagating union type information as soon as the output value is narrowed to a specific case type, aligning behavior with non-union scenarios ([dotnet/roslyn #84248](https://github.com/dotnet/roslyn/pull/84248)). Custom union declarations use a new `UnionMatchingMode` property to control how patterns are lowered, replacing earlier ad-hoc flags ([dotnet/roslyn #84436](https://github.com/dotnet/roslyn/pull/84436), [dotnet/roslyn #84499](https://github.com/dotnet/roslyn/pull/84499)). Unions remain a preview feature; enable `<LangVersion>preview</LangVersion>` to use them, and expect the surface to keep evolving.

## Exhaustiveness for type parameters constrained to a closed type

Switch-expression exhaustiveness now understands generic parameters constrained to a `closed` type ([dotnet/roslyn #83979](https://github.com/dotnet/roslyn/pull/83979), tracking [dotnet/roslyn #81039](https://github.com/dotnet/roslyn/issues/81039)). When every direct subtype of the closed base is handled, the compiler no longer warns that the switch is non-exhaustive — even when the input is typed as the type parameter rather than the base type itself.

```csharp
public closed record class Shape;
public record class Circle(double Radius) : Shape;
public record class Square(double Side) : Shape;

static double Area<T>(T shape) where T : Shape => shape switch
{
    Circle(var r) => Math.PI * r * r,
    Square(var s) => s * s
};
```

The compiler decides `T` cannot introduce any additional case, because every derived type of `Shape` is already covered. The closed-hierarchies metadata format also stabilizes in this preview: `IsClosedTypeAttribute` now carries a `DerivedTypes` property, matching the format decided in [dotnet/runtime #129009](https://github.com/dotnet/runtime/issues/129009) ([dotnet/roslyn #84350](https://github.com/dotnet/roslyn/pull/84350)).

## Unsafe Evolution: compat mode and `nameof`

> This is a preview feature for .NET 11.

Unsafe Evolution continues to refine the boundary between "code that mentions pointers" and "code that dereferences unmanaged memory". This preview delivers two follow-up rules from the [Unsafe Evolution speclet](https://github.com/dotnet/csharplang/blob/main/proposals/unsafe-evolution.md):

- **Compat mode extends to legacy callers.** Members marked as *requires-unsafe* under the updated memory-safety rules now require an `unsafe` context even when they are called from code that hasn't opted into those rules ([dotnet/roslyn #83660](https://github.com/dotnet/roslyn/pull/83660), fixes [dotnet/roslyn #81967](https://github.com/dotnet/roslyn/issues/81967)). Without this, projects that only bumped `LangVersion` — but not their memory-safety rules version — could end up *less* protected than before by silently calling requires-unsafe members from safe contexts.
- **`nameof` no longer reports requires-unsafe errors.** Referencing a requires-unsafe member inside `nameof(...)` no longer reports an unsafe-context error, matching how `nameof` already handled most other member kinds ([dotnet/roslyn #84325](https://github.com/dotnet/roslyn/pull/84325)).

Unsafe Evolution remains a preview feature; the exact rules and diagnostics can still change. Follow the [test plan](https://github.com/dotnet/roslyn/issues/81207) for status.

## Null check in compiler-synthesized inline-array helpers

Element access and `Span<T>` conversion for an `[InlineArray]` value are lowered to calls into synthesized helpers in `<PrivateImplementationDetails>` (`InlineArrayElementRef`, `InlineArrayElementRefReadOnly`, `InlineArrayAsSpan`, `InlineArrayAsReadOnlySpan`). Those helpers previously accepted any byref — including a null byref — and returned a ref or `Span<T>` at a caller-controlled offset. Reading or writing through the result did not reliably fault; instead it produced arbitrary reads and writes, and this was reachable from safe code (for example, via `Unsafe.NullRef<T>()`).

The helpers now null-check the incoming buffer, so forming a ref or span from a null inline-array reference throws `NullReferenceException` deterministically ([dotnet/roslyn #84488](https://github.com/dotnet/roslyn/pull/84488), [dotnet/roslyn #84523](https://github.com/dotnet/roslyn/pull/84523), closes [dotnet/roslyn #84344](https://github.com/dotnet/roslyn/issues/84344)). In the common case where the JIT can prove the base is non-null, the check is elided. No source change is needed to pick up the fix — rebuild against the Preview 7 compiler.

## Clearer runtime-async unsupported-feature diagnostic

The runtime-async diagnostic that reports "this method uses a feature that runtime-async doesn't support yet" no longer implies that support will eventually arrive for `__arglist` ([dotnet/roslyn #84263](https://github.com/dotnet/roslyn/pull/84263)). `__arglist` cannot be lowered by the runtime-async transform, so the updated message states that plainly. The diagnostic is also removed from the build-only list, since the remaining reporting site runs during initial binding.

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - Allow literals in attributes that target unions (roslyn #84247). Razor-facing; covered in the ASP.NET Core notes instead.
  - [EE] using static for non-static classes (roslyn #84042). Expression evaluator, not a language change.
  - Handle instrumented conditions in post-lowering passes (roslyn #84244). Internal lowering fix.
  - Dispose builders in declaration computer (roslyn #84339). Internal compiler cleanup.
  - Remove unused ID field from SyntaxAnnotation (roslyn #84295). Internal API cleanup.
  - Make Microsoft.Build.Tasks.CodeAnalysis AOT/single-file clean (roslyn #84335). Compiler task hardening.
  - Extension constants tracking issue (roslyn #84270). Docs-only; no shipping surface yet.
  - Roslyn IDE work (extension completion, refactorings, LSP, Razor). Excluded by product-boundary rule.
-->

## Community contributors

Thank you contributors! ❤️

- [@corentingallet](https://github.com/dotnet/roslyn/pulls?q=is%3Apr+is%3Amerged+author%3Acorentingallet)
- [@DoctorKrolic](https://github.com/dotnet/roslyn/pulls?q=is%3Apr+is%3Amerged+author%3ADoctorKrolic)
- [@neoGeneva](https://github.com/dotnet/roslyn/pulls?q=is%3Apr+is%3Amerged+author%3AneoGeneva)
- [@seblyng](https://github.com/dotnet/roslyn/pulls?q=is%3Apr+is%3Amerged+author%3Aseblyng)
- [@teo-tsirpanis](https://github.com/dotnet/roslyn/pulls?q=is%3Apr+is%3Amerged+author%3Ateo-tsirpanis)

<!-- Verified by compiling labeled break/continue, union Try-Both matching, and closed-class exhaustiveness samples against the .NET 11 Preview 7 SDK (11.0.100-preview.7.26381.103) with LangVersion=preview. -->
