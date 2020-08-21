using System;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using static System.Console;

namespace RuntimeEnvironment
{
    class Program
    {
        static void Main(string[] args)
        {
            WriteLine("**.NET information");
            WriteLine($"{nameof(Environment.Version)}: {Environment.Version}");
            WriteLine($"{nameof(RuntimeInformation.FrameworkDescription)}: {RuntimeInformation.FrameworkDescription}");
            var assemblyInformation = ((AssemblyInformationalVersionAttribute[])typeof(object).Assembly.GetCustomAttributes(typeof(AssemblyInformationalVersionAttribute),false))[0];
            WriteLine($"Libraries version: {assemblyInformation.InformationalVersion.Split('+')[0]}");
            WriteLine($"Libraries hash: {assemblyInformation.InformationalVersion.Split('+')[1]}");
            WriteLine();
            WriteLine("**Environment information");
            WriteLine($"{nameof(RuntimeInformation.OSDescription)}: {RuntimeInformation.OSDescription}");
            WriteLine($"{nameof(Environment.OSVersion)}: {Environment.OSVersion}");
            WriteLine($"{nameof(RuntimeInformation.OSArchitecture)}: {RuntimeInformation.OSArchitecture}");
            WriteLine($"{nameof(Environment.ProcessorCount)}: {Environment.ProcessorCount}");
            WriteLine();

            if(RuntimeInformation.OSDescription.StartsWith("Linux") && Directory.Exists("/sys/fs/cgroup"))
            {
                WriteLine("**CGroup info**");
                WriteLine($"cfs_quota_us: {System.IO.File.ReadAllLines("/sys/fs/cgroup/cpu/cpu.cfs_quota_us")[0]}");
                WriteLine($"memory.limit_in_bytes: {System.IO.File.ReadAllLines("/sys/fs/cgroup/memory/memory.limit_in_bytes")[0]}");
                WriteLine($"memory.usage_in_bytes: {System.IO.File.ReadAllLines("/sys/fs/cgroup/memory/memory.usage_in_bytes")[0]}");
            }
        }
    }
}
