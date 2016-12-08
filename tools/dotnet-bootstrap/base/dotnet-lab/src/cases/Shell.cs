using static System.Diagnostics.Process;
using static System.Console;

using System.Diagnostics;

namespace Lab 
{
    public static class Shell 
    {
        private static bool _lenient;

        static Shell()
        {
            _lenient = true;
            
        }

        /*
            Literally no additional processing will be done to the string, so only pass the equivalent string you would to a shell here.
        */
        public static void Call(string processEntrypoint, string arguments, bool lenient = false)
        {
            WriteLine($"starting process : {processEntrypoint} {arguments}");
            
            var process = Start(new ProcessStartInfo()
            {
                FileName = processEntrypoint,
                Arguments = arguments,
                UseShellExecute = true       
            });

            process.WaitForExit();
        }
    }
}