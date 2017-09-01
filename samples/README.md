# .NET Core Samples

This directory contains samples that you can use to test out [.NET Core](http://dotnet.github.io). They are small and simple, and are used to get your feet wet with .NET Core as fast as possible. 

## How to run the samples?

In order to run these samples, you first need to [install .NET Core](http://dotnet.github.io/getting-started/). After that, you can clone this repo, go into each of the samples folders and either:

* Run from source using the following commands:
	* `dotnet restore`
	* `dotnet run`
* Compile and run using the following commands
	* `dotnet restore`
	* `dotnet build`
	* `dotnet bin/Debug/[framework]/[binary name]`

## Samples list

* **dotnetbot** - Let dotnetbot say Hi!
* **helloworld** - because no sample is complete without Hello World!
* **qotd** - a simple "quote of the day" console application.
* **core-with-framework-dependency** - a simple .NET Core app with a .NET Framework 4.6.1 dependency.
