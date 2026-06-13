# C# in .NET 11 Preview 5 - Release Notes

.NET 11 Preview 5 includes the following C# language and compiler updates:

- [Closed class hierarchies](#closed-class-hierarchies)
- [Union declarations and union patterns](#union-declarations-and-union-patterns)
- [Unsafe code focuses on unsafe operations](#unsafe-evolution)

C# updates:

- [What's new in C# 15](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-15)

## Closed class hierarchies

A `closed` class can only be directly derived from in the same assembly. The compiler can then use the known derived types when it checks switch-expression exhaustiveness ([dotnet/roslyn #83120](https://github.com/dotnet/roslyn/pull/83120), [dotnet/roslyn #83736](https://github.com/dotnet/roslyn/pull/83736)).

```csharp
public closed record class GateState;
public record class Closed : GateState;
public record class Open(float Percent) : GateState;

static string Describe(GateState state) => state switch
{
    Closed => "closed",
    Open(var percent) => $"{percent}% open"
};
```

Closed class rules:

- A `closed` class is implicitly abstract.
- Direct subtypes must be declared in the same assembly as the closed base class.
- A switch expression over a closed class is exhaustive when it handles all reachable direct subtypes.

In this preview, projects that define closed classes also need the compiler support attribute available to the compilation:

```csharp
namespace System.Runtime.CompilerServices;

[AttributeUsage(AttributeTargets.Class, AllowMultiple = false, Inherited = false)]
public sealed class ClosedAttribute : Attribute { }
```

## Union declarations and union patterns

A `union` declaration creates a value type whose value can be one of a fixed set of case types. Pattern matching unwraps the union value, and switch expressions are exhaustive when they handle every case type ([dotnet/roslyn #83705](https://github.com/dotnet/roslyn/pull/83705)).

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

Union rules in this preview:

- The compiler generates a public constructor for each case type.
- A case value converts implicitly to the union type.
- Pattern matching applies most patterns to the union's contained value.
- Ambiguous union conversions are errors ([dotnet/roslyn #83625](https://github.com/dotnet/roslyn/pull/83625)).

The compiler also recognizes hand-authored union types marked with `System.Runtime.CompilerServices.UnionAttribute`, including union members supplied by a nested `IUnionMembers` provider interface ([dotnet/roslyn #83048](https://github.com/dotnet/roslyn/pull/83048), [dotnet/roslyn #83208](https://github.com/dotnet/roslyn/pull/83208)).

## Unsafe Evolution

> This is a preview feature for .NET 11.

Unsafe Evolution is the ongoing work to let `unsafe` denote *requires-unsafe* members directly, rather than relying on a separate `[RequiresUnsafe]` attribute.

Tracked under the [Unsafe Evolution test plan](https://github.com/dotnet/roslyn/issues/81207); the corresponding language-spec change is in [dotnet/csharplang #10091](https://github.com/dotnet/csharplang/pull/10091). Unsafe Evolution remains a preview feature; the surface and rules can still change before it ships.

In Preview 5, pointer types and pointer values can now appear outside an `unsafe` context; the `unsafe` boundary moves to operations that dereference unmanaged memory or call members that are marked `unsafe` ([dotnet/roslyn #83133](https://github.com/dotnet/roslyn/pull/83133), [dotnet/roslyn #83295](https://github.com/dotnet/roslyn/pull/83295), [dotnet/roslyn #83452](https://github.com/dotnet/roslyn/pull/83452)).

```csharp
int value = 42;
int* pointer = &value;

unsafe
{
    System.Console.WriteLine(*pointer);
}
```

The pointer declaration and address-of expression are allowed outside the `unsafe` block. The pointer dereference still requires an `unsafe` context.

The stack allocation rule is now opt-in: a `stackalloc` converted to `Span<T>` or `ReadOnlySpan<T>` inside a `[SkipLocalsInit]` member only requires an `unsafe` context when the project opts in to the updated memory-safety rules ([dotnet/roslyn #83639](https://github.com/dotnet/roslyn/pull/83639)).

## Community contributors

Thank you contributors! ❤️

- [@Crashdummyy](https://github.com/dotnet/roslyn/pulls?q=is%3Apr+is%3Amerged+author%3ACrashdummyy)
- [@CyrusNajmabadi](https://github.com/dotnet/roslyn/pulls?q=is%3Apr+is%3Amerged+author%3ACyrusNajmabadi)
- [@DoctorKrolic](https://github.com/dotnet/roslyn/pulls?q=is%3Apr+is%3Amerged+author%3ADoctorKrolic)
- [@GustavEikaas](https://github.com/dotnet/roslyn/pulls?q=is%3Apr+is%3Amerged+author%3AGustavEikaas)
- [@olegtk](https://github.com/dotnet/roslyn/pulls?q=is%3Apr+is%3Amerged+author%3Aolegtk)
