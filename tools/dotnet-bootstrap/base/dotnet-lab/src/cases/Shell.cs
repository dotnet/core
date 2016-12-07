using static System.Console;

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
        public static void Call(string complete_cmd, bool lenient = false)
        {
            WriteLine(complete_cmd);
            // TODO. 
        }
    }
}