# .NET Core Home

The core repository is the starting point to engage in and learn about the
.NET Core stack. 

> **Note:** please note that this repository is not for filing product issues.
> If you run into an issue using .NET Core, there are multiple repos where you can 
> file an issue:
> * [dotnet/cli](https://github.com/dotnet/cli) - for CLI tools and questions
> * [dotnet/corefx](https://github.com/dotnet/corefx) - for API issues and questions
> * [dotnet/coreclr](https://github.com/dotnet/coreclr) - for runtime issues
> * [dotnet/standard](https://github.com/dotnet/standard) - for .NET Standard issues and questions
> * [nuget/home](https://github.com/nuget/home) - for NuGet questions and issues
> * [aspnet/home](https://github.com/aspnet/home) - for ASP.NET Core questions and issues.
> * [dotnet/netcorecli-fsc](https://github.com/dotnet/netcorecli-fsc) - for F# questions and issues

> 
> We will be removing the ability to file issues on this repo in the near future.

## Get Started

If you're new to .NET Core and have 10 minutes to try it, start here: 
- [What is .NET Core?](https://www.microsoft.com/net/core/platform)
- [Get Started with the Official releases of .NET Core on Windows, OSX and Linux](https://www.microsoft.com/net/core)

If you have some more time and want to go deeper or get the latest builds:
- [Get the latest builds of .NET Core on Windows, OSX and Linux](https://github.com/dotnet/core-setup/blob/master/README.md)
- [Get the latest builds of ASP.NET Core on Windows, OSX and Linux](https://github.com/aspnet/home)

## .NET Core Platform

The .NET Core platform is made of several components, which includes the
managed compilers, the runtime, the base class libraries, and numerous application models such as
ASP.NET.

* [Roadmap](roadmap.md)
* [.NET Core Framework](https://github.com/dotnet/corefx)
* [.NET Core Runtime](https://github.com/dotnet/coreclr)
* [.NET Compiler Platform ("Roslyn")](https://github.com/dotnet/roslyn)
* [ASP.NET Core](https://github.com/aspnet/home)

## How to Engage, Contribute and Provide Feedback

All projects accept contributions:

* [.NET Core Contributing Guide](https://github.com/dotnet/corefx/blob/master/Documentation/project-docs/contributing.md)
* [.NET Compiler Platform ("Roslyn")](https://github.com/dotnet/roslyn/wiki/Contributing-Code)
* [ASP.NET Contributing Guide](https://github.com/aspnet/Home/blob/master/CONTRIBUTING.md)

You are also encouraged to start a discussion by posting on the
[.NET Foundation Forums](http://forums.dotnetfoundation.org/) or filing an
issue in the corresponding GitHub project. See the contributing guides for more
details.

## .NET Foundation

The .NET Core platform is part of the [.NET Foundation](http://www.dotnetfoundation.org/projects).

* [.NET Core Project](http://www.dotnetfoundation.org/net-core)
* [.NET Compiler Platform ("Roslyn" Project)](http://www.dotnetfoundation.org/net-compiler-platform-roslyn)
* [ASP.NET Core Project](http://www.dotnetfoundation.org/asp-net-core)

## Licenses

.NET Core platform projects typically use either the [MIT](LICENSE) or
[Apache 2](http://www.apache.org/licenses/LICENSE-2.0) licenses for code.
Some projects license documentation and other forms of content under
[Creative Commons Attribution 4.0](http://creativecommons.org/licenses/by/4.0/).

See specific projects to understand the license used.

## Understanding the relationship between .NET Core and the .NET Framework

.NET Core and the .NET Framework have (for the most part) a subset-superset
relationship. .NET Core is named "Core" since it contains the core features from
the .NET Framework, for both the runtime and framework libraries. For example,
.NET Core and the .NET Framework share the GC, the JIT and types such as
`String` and `List<T>`.

.NET Core was created so that .NET could be open source, cross platform and be
used in more resource-constrained environments. We have also published a subset
of the [.NET Reference Source](https://github.com/Microsoft/referencesource)
under the MIT license, so that you and the community can port additional .NET
Framework features to .NET Core.

## Understanding the relationship between .NET Core and Mono

Mono is an important part of the .NET ecosystem, particularly for client
scenarios (for example, Xamarin). We will look for ways to collaborate with Mono
developers and encourage them to take our code to improve Mono. We will also
look for opportunities to improve .NET Core with MIT-licensed Mono code.

An important collaboration opportunity is making .NET Core NuGet packages
(produced from this code) work on Mono. The SIMD NuGet package is a perfect
example.

## Learning about ASP.NET and .NET Core

[ASP.NET Core](https://github.com/aspnet/home) is a new cross-platform version of
ASP.NET that is designed for the cloud, and runs on Windows, Linux and Mac. It
targets .NET Core by default, but you may choose to target the .NET Framework on
Windows.
