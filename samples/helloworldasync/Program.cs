using System;
using System.Threading.Tasks;

namespace HelloWorldSample 
{
	public static class Program 
	{
		public static async Task Main()
		{
			await Task.Run(() => Console.WriteLine("Hello World!"));
		}
	}
}