# .NET Core Samples

This directory contains samples that you can use to test out [.NET Core](http://dotnet.github.io). They are small and simple, and are used to get your feet wet with .NET Core as fast as possible. 

## How to run the samples?

In order to run these samples, you first need to [install .NET Core](http://dotnet.github.io/getting-started/). Note that because these samples use the recently improved .csproj project format you will need at least [CLI Preview 4](https://github.com/dotnet/cli#preview-4-release---msbuild-based-tools) or greater. After that, you can clone this repo, go into each of the samples folders and follow the corresponding instructions for each sample:

* Run from source using the following commands:
	* `dotnet restore`
	* `dotnet run`
* Compile and run using the following commands
	* `dotnet restore`
	* `dotnet build`
	* `dotnet bin/Debug/[framework]/[binary name]`

## Samples list

* [dotnetbot](dotnetbot/README.md) - Let dotnetbot say Hi!
* [helloworld](helloworld) - because no sample is complete without Hello World!
* [qotd](qotd) - a simple "quote of the day" console application (**note**: this sample is not yet capable of being compiled to a native binary).
