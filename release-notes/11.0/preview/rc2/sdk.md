# SDK in .NET 11 RC 2 - Release Notes

.NET 11 RC 2 improves file-based program configuration and launch-profile arguments:

- [Quoted file-level directive values](#quoted-file-level-directive-values)
- [MSBuild properties in launch-profile arguments](#msbuild-properties-in-launch-profile-arguments)

## Quoted file-level directive values

File-based programs can use quoted values containing spaces in `#:property` directives. The `#:package`, `#:project`, and `#:ref` directives also accept trailing `Name=Value` tokens for MSBuild item metadata ([dotnet/sdk #55960](https://github.com/dotnet/sdk/pull/55960)).

```csharp
#:property Company="RC2 Validation Team"

using System.Reflection;
Console.WriteLine(Assembly.GetExecutingAssembly()
    .GetCustomAttribute<AssemblyCompanyAttribute>()?.Company);
// RC2 Validation Team
```

Run the file with `dotnet run Program.cs`. The quoted value becomes the generated assembly's `Company` metadata.

See the [file-based apps documentation](https://learn.microsoft.com/dotnet/core/sdk/file-based-apps) for supported directives and the broader workflow.

## MSBuild properties in launch-profile arguments

`dotnet run` now expands MSBuild properties in a launch profile's `commandLineArgs` using the evaluated project. For example, a profile argument such as `--name $(AssemblyName)` receives the project's assembly name when you run `dotnet run --launch-profile <profile>` ([dotnet/sdk #56064](https://github.com/dotnet/sdk/pull/56064)).
