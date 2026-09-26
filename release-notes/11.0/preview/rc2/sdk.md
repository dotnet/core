# SDK in .NET 11 RC 2 - Release Notes

.NET 11 RC 2 improves file-based program configuration:

- [Quoted file-level directive values](#quoted-file-level-directive-values)

## Quoted file-level directive values

File-based programs can use quoted values containing spaces in `#:property` directives. The SDK also accepts additional property directives, so a single C# file can carry more of its own build configuration ([dotnet/sdk #55960](https://github.com/dotnet/sdk/pull/55960)).

```csharp
#:property Company="RC2 Validation Team"

using System.Reflection;
Console.WriteLine(Assembly.GetExecutingAssembly()
    .GetCustomAttribute<AssemblyCompanyAttribute>()?.Company);
// RC2 Validation Team
```

Run the file with `dotnet run Program.cs`. The quoted value becomes the generated assembly's `Company` metadata.

See the [file-based apps documentation](https://learn.microsoft.com/dotnet/core/sdk/file-based-apps) for supported directives and the broader workflow.
