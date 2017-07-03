using System;
using static System.Console;
using ClassLibrary1;

namespace CoreWithFrameworkDependency
{
    class Program
    {
        static void Main(string[] args)
        {
            WriteLine("Hello World from .NET Core!");
            WriteLine(Class1.GetMessage());
        }
    }
}
