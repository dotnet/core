using System;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using static System.Console;
using static System.IO.File;

string nl = Environment.NewLine;

// Variant of https://github.com/dotnet/core/tree/main/samples/dotnet-runtimeinfo
// Ascii text: https://ascii.co.uk/text (Univers font)
WriteLine(
$"         42{nl}" +
$"         42              ,d                             ,d{nl}" +
$"         42              42                             42{nl}" +
$" ,adPPYb,42  ,adPPYba, MM42MMM 8b,dPPYba,   ,adPPYba, MM42MMM{nl}" +
$"a8\"    `Y42 a8\"     \"8a  42    42P\'   `\"8a a8P_____42   42{nl}" +
$"8b       42 8b       d8  42    42       42 8PP\"\"\"\"\"\"\"   42{nl}" +
$"\"8a,   ,d42 \"8a,   ,a8\"  42,   42       42 \"8b,   ,aa   42,{nl}" +
$" `\"8bbdP\"Y8  `\"YbbdP\"\'   \"Y428 42       42  `\"Ybbd8\"\'   \"Y428{nl}");

AssemblyInformationalVersionAttribute assemblyInformation = ((AssemblyInformationalVersionAttribute[])typeof(object).Assembly.GetCustomAttributes(typeof(AssemblyInformationalVersionAttribute), false))[0];
string[] informationalVersionSplit = assemblyInformation.InformationalVersion.Split('+');

WriteLine("**.NET information");
WriteLine($"{nameof(Environment.Version)}: {Environment.Version}");
WriteLine($"{nameof(RuntimeInformation.FrameworkDescription)}: {RuntimeInformation.FrameworkDescription}");
WriteLine($"Libraries version: {informationalVersionSplit[0]}");
WriteLine($"Libraries hash: {informationalVersionSplit[1]}");
WriteLine();
WriteLine("**Environment information");
WriteLine($"{nameof(Environment.ProcessorCount)}: {Environment.ProcessorCount}");
WriteLine($"{nameof(RuntimeInformation.OSArchitecture)}: {RuntimeInformation.OSArchitecture}");
WriteLine($"{nameof(RuntimeInformation.OSDescription)}: {RuntimeInformation.OSDescription}");
WriteLine($"{nameof(Environment.OSVersion)}: {Environment.OSVersion}");

// Linux Pretty Name
const string OSRel = "/etc/os-release";
if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux) && 
    File.Exists(OSRel))
{
  const string PrettyName = "PRETTY_NAME";
  foreach(string line in File.ReadAllLines(OSRel))
  {
      if (line.StartsWith(PrettyName))
      {
          ReadOnlySpan<char> value = line.AsSpan()[(PrettyName.Length + 2)..^1];
          WriteLine($"PRETTY_NAME: {value.ToString()}");
          break;
      }
  }
}

WriteLine();
