# C# in .NET 11 RC 1 - Release Notes

.NET 11 RC 1 establishes C# 15 as the default language version and includes the
following C# updates:

- [C# 15 stabilizes unions and other language features](#c-15-stabilizes-unions-and-other-language-features)
- [Unsafe Evolution refinements](#unsafe-evolution-refinements)

C# updates:

- [What's new in C# 15](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-15)

## C# 15 stabilizes unions and other language features

C# 15 is now selected by default for projects targeting .NET 11
([dotnet/roslyn #84799](https://github.com/dotnet/roslyn/pull/84799)). The
language version stabilizes the features introduced during the .NET 11 preview
cycle: collection expression arguments, union types, non-virtual static
interface members, closed class hierarchies, labeled `break` and `continue`,
and extension indexers.

For example, union types no longer require `<LangVersion>preview</LangVersion>`:

```csharp
public record Success(string Message);
public record Failure(int ErrorCode);

public union Result(Success, Failure);

static string Describe(Result result) => result switch
{
    Success(var message) => message,
    Failure(var errorCode) => $"Error {errorCode}"
};
```

The compiler and Roslyn APIs also use the final `CSharp15` language-version
names, and `ITypeSymbol.UnionCaseTypes` exposes the cases of a union to analyzers
and other compiler-based tools
([dotnet/roslyn #84707](https://github.com/dotnet/roslyn/pull/84707)).

## Unsafe Evolution refinements

> This is a preview feature for .NET 11.

Unsafe Evolution remains independent of C# 15 and still requires C# language
preview and the feature flag for the new memory safety rules:

```xml
<LangVersion>preview</LangVersion>
<Features>$(Features);updated-memory-safety-rules</Features>
```

RC 1 completes several user-facing rules:

- `await` is allowed inside an `unsafe` context
  ([dotnet/roslyn #84616](https://github.com/dotnet/roslyn/pull/84616)).
- `safe` can be applied anywhere that `unsafe` could mark a declaration as
  *requires-unsafe*. This supports generated declarations such as
  `LibraryImport` methods, even when `safe` has no other effect
  ([dotnet/roslyn #84602](https://github.com/dotnet/roslyn/pull/84602)).
- `unsafe` on delegates, static constructors, destructors, and type
  declarations is now an error because it no longer establishes a meaningful
  unsafe context
  ([dotnet/roslyn #84378](https://github.com/dotnet/roslyn/pull/84378)).
- Unsafe Evolution diagnostics are now reported consistently in the IDE
  ([dotnet/roslyn #84603](https://github.com/dotnet/roslyn/pull/84603)).

```csharp
unsafe async Task<int> ReadAsync()
{
    int* value = stackalloc int[1];
    unsafe
    {
        *value = 42;
        int result = *value;
        await Task.Yield();
        return result;
    }
}

[LibraryImport("native")]
internal static safe partial int GetValue();
```

Roslyn also exposes the final approved symbol API for determining whether a
declaration requires an unsafe context
([dotnet/roslyn #84674](https://github.com/dotnet/roslyn/pull/84674),
[dotnet/roslyn #84784](https://github.com/dotnet/roslyn/pull/84784)).

<!-- Filtered features (significant engineering work, but not shipped in RC 1):
  - Sonic declaration/implementation split: the merge and dependent work were
    reverted by dotnet/roslyn #84831, so no Sonic feature is documented here.
-->
