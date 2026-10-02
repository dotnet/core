#:property AssemblyName=LaunchProfileExpansion

if (args.Length != 1 || args[0] != "LaunchProfileExpansion")
{
    throw new Exception($"Expected expanded AssemblyName argument; got '{string.Join(' ', args)}'.");
}

Console.WriteLine($"Expanded launch-profile argument: {args[0]}");
