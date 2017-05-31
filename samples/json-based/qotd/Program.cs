using System;
using System.IO;

namespace Qotd 
{
	public static class Program 
	{
		public static void Main(string[] args) 
		{
			if (args.Length <=0)
			{
				Console.ForegroundColor = ConsoleColor.Red;
				Console.WriteLine("You must specify a quotes file.");
				Console.ResetColor();
				return;
			}
			var quotes = File.ReadAllLines(args[0]);
			var randomQuote = quotes[new Random().Next(0, quotes.Length-1)];
			
			Console.WriteLine("[QOTD]: {0}", randomQuote);
		}
	}
}