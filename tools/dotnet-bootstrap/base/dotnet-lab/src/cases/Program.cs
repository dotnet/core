using System;
using System.Reflection;

using static System.IO.Path;
using static System.Console;

namespace Lab
{
    static class Program
    {
        internal static string _Path; 
        static Program()
        {
            // this actually runs before Main...
            Program._Path = GetDirectoryName(Assembly.GetEntryAssembly().Location);

            WriteLine($"... Initializing lab in {Program._Path} ...");
        }
        static void Main(string[] args)
        {
            Cases all_cases = new Cases(Program._Path);
                        
            all_cases.RunAll();
        }
    }
}
