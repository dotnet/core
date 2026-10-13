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
