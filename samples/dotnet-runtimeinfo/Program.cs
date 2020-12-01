using System;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using static System.Console;
using static System.IO.File;

AssemblyInformationalVersionAttribute assemblyInformation = ((AssemblyInformationalVersionAttribute[])typeof(object).Assembly.GetCustomAttributes(typeof(AssemblyInformationalVersionAttribute), false))[0];
string[] informationalVersionSplit = assemblyInformation.InformationalVersion.Split('+');

WriteLine("**.NET information");
WriteLine($"{nameof(Environment.Version)}: {Environment.Version}");
WriteLine($"{nameof(RuntimeInformation.FrameworkDescription)}: {RuntimeInformation.FrameworkDescription}");
WriteLine($"Libraries version: {informationalVersionSplit[0]}");
WriteLine($"Libraries hash: {informationalVersionSplit[1]}");
WriteLine();
WriteLine("**Environment information");
WriteLine($"{nameof(RuntimeInformation.OSDescription)}: {RuntimeInformation.OSDescription}");
WriteLine($"{nameof(Environment.OSVersion)}: {Environment.OSVersion}");
WriteLine($"{nameof(RuntimeInformation.OSArchitecture)}: {RuntimeInformation.OSArchitecture}");
WriteLine($"{nameof(Environment.ProcessorCount)}: {Environment.ProcessorCount}");
WriteLine();

if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux) && 
    Directory.Exists("/sys/fs/cgroup/cpu") &&
    Directory.Exists("/sys/fs/cgroup/memory"))
{
    WriteLine("**CGroup info");
    WriteLine($"cfs_quota_us: {ReadAllLines("/sys/fs/cgroup/cpu/cpu.cfs_quota_us")[0]}");
    WriteLine($"memory.limit_in_bytes: {ReadAllLines("/sys/fs/cgroup/memory/memory.limit_in_bytes")[0]}");
    WriteLine($"memory.usage_in_bytes: {ReadAllLines("/sys/fs/cgroup/memory/memory.usage_in_bytes")[0]}");
}
