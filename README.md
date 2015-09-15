# .NET Core Home

The core repository is the starting point to engage in and learn about the
.NET Core stack.

## Get Started

If you're new to .NET Core and have 10 minutes to try it, start here: 
- [What is .NET Core?](http://dotnet.github.io/core/about/)
- [Get Started with .NET Core on Windows, OSX and Linux](http://dotnet.github.io/core/getting-started/)

If you have some more time and want to go deeper:
- [Install ASP.NET 5 on Windows, OSX and Linux](https://github.com/aspnet/home)
- [Install .NET Core on Windows, OSX and Linux](https://github.com/dotnet/coreclr#get-net-core)

## .NET Core Platform

The .NET Core platform is made of several components, which includes the
managed compilers, the runtime, the base class libraries, and numerous application models such as
ASP.NET.

* [Roadmap](roadmap.md)
* [.NET Core Framework](https://github.com/dotnet/corefx)
* [.NET Core Runtime](https://github.com/dotnet/coreclr)
* [.NET Compiler Platform ("Roslyn")](https://github.com/dotnet/roslyn)
* [ASP.NET 5](https://github.com/aspnet/home)

At present, only a few .NET Core libraries are available on GitHub. The rest of
the libraries, including the base runtime, will be added in the coming months.

## How to Engage, Contribute and Provide Feedback

All projects accept contributions:

* [.NET Core Contributing Guide](https://github.com/dotnet/corefx/wiki/Contributing)
* [.NET Compiler Platform ("Roslyn")](https://github.com/dotnet/roslyn/wiki/Contributing-Code)
* [ASP.NET Contributing Guide](https://github.com/aspnet/Home/blob/master/CONTRIBUTING.md)

You are also encouraged to start a discussion by posting on the
[.NET Foundation Forums](http://forums.dotnetfoundation.org/) or filing an
issue in the corresponding GitHub project. See the contributing guides for more
details.

## .NET Foundation

The .NET Core platform is part of the [.NET Foundation](http://www.dotnetfoundation.org/projects).

* [.NET Core Project](http://www.dotnetfoundation.org/netcore)
* [.NET Compiler Platform ("Roslyn" Project)](http://www.dotnetfoundation.org/dotnet-compiler-platform)
* [ASP.NET Project](http://www.dotnetfoundation.org/aspnet-5)

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
scenarios (e.g. Xamarin). We will look for ways to collaborate with Mono
developers and encourage them to take our code to improve Mono. We will also
look for opportunities to improve .NET Core with MIT-licensed Mono code.

An important collaboration opportunity is making .NET Core NuGet packages
(produced from this code) work on Mono. The SIMD NuGet package is a perfect
example.

## Learning about ASP.NET and .NET Core

[ASP.NET 5](https://github.com/aspnet/home) is a new cross-platform version of
ASP.NET that is designed for the cloud, and runs on Windows, Linux and Mac. It
uses the .NET Framework to run on Windows, and can also run on .NET Core for
greater deployment flexibility on Windows. It currently uses Mono for Linux and
Mac support but will move to .NET Core for those platforms when they are
supported.
