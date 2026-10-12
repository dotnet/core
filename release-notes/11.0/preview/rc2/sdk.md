# SDK in .NET 11 RC 2 - Release Notes

.NET 11 RC 2 improves file-based program configuration and launch-profile arguments:

- [Quoted file-level directive values](#quoted-file-level-directive-values)
- [MSBuild properties in launch-profile arguments](#msbuild-properties-in-launch-profile-arguments)

## Quoted file-level directive values

File-based programs can use quoted values containing spaces in `#:property` directives. The `#:package`, `#:project`, and `#:ref` directives also accept trailing `Name=Value` tokens for MSBuild item metadata. This example uses the `Aliases` metadata on a package directive and references the package through the resulting C# extern alias ([dotnet/sdk #55960](https://github.com/dotnet/sdk/pull/55960)).

```csharp
#:property Company="RC2 Validation Team"
#:property AssemblyTitle="RC2 Directive Validation"
#:package System.CommandLine@2.0.1 Aliases=CommandLine

extern alias CommandLine;
using System.Reflection;

string? company = Assembly.GetExecutingAssembly()
    .GetCustomAttribute<AssemblyCompanyAttribute>()?.Company;
var nameOption = new CommandLine::System.CommandLine.Option<string>("--name");
var command = new CommandLine::System.CommandLine.RootCommand();
command.Options.Add(nameOption);
string? name = command.Parse(args).GetValue(nameOption);
if (company != "RC2 Validation Team" || name != "RC2")
{
    throw new Exception($"Unexpected metadata or argument: {company}, {name}.");
}

Console.WriteLine($"Company: {company}; name: {name}");
```

Run the file with `dotnet run Program.cs -- --name RC2`. The quoted value becomes the generated assembly's `Company` metadata, and `System.CommandLine` parses the supplied option through the `CommandLine` alias.

See the [file-based apps documentation](https://learn.microsoft.com/dotnet/core/sdk/file-based-apps) for supported directives and the broader workflow.

## MSBuild properties in launch-profile arguments

`dotnet run` now expands MSBuild properties in a launch profile's `commandLineArgs` using the evaluated project. For example, a profile argument such as `--name $(AssemblyName)` receives the project's assembly name when you run `dotnet run --launch-profile <profile>` ([dotnet/sdk #56064](https://github.com/dotnet/sdk/pull/56064)).
