#:property Company="RC2 Validation Team"
#:property AssemblyTitle="RC2 Directive Validation"

using System.Reflection;

string? company = Assembly.GetExecutingAssembly()
    .GetCustomAttribute<AssemblyCompanyAttribute>()?.Company;
if (company != "RC2 Validation Team")
{
    throw new Exception($"Expected quoted Company property; got '{company}'.");
}

Console.WriteLine("Quoted file-level property was applied.");
