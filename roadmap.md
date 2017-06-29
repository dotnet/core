# .NET Core Roadmap

We aim to continuously deliver updates to the .NET Core Runtime and Tools and our primary focus right now is on .NET Core 2.0. 

We shipped Visual Studio 2017 RTM with .NET Core 1.X support. [Please try VS 2017][vs2017].

[vs2017]: https://www.visualstudio.com/downloads/

## Primary scenarios for .NET Core 2.0

* **Lower the Barrier of Entry and Reach**. .NET Standard 2.0 standardizes the
  shared APIs across .NET Framework, .NET Core and Xamarin making it easy to
  share code across all of .NET. .NET Core gain over 5,000 APIs from .NET
  Framework as part of this work making it a broader platform. Simplifying how a
  developer references .NET Core from many packages to one. Simplified
  acquisition of runtime and tools. And easier to reference Linux platforms and
  their dependencies. You can follow this work in the
  [dotnet/standard](https://github.com/dotnet/standard) and
  [dotnet/corefx](https://github.com/dotnet/corefx) repos.

* **.NET Core Tooling**. Evolve the tooling aligned with the next .NET Core
  runtime release. This will include tooling for choosing which .NET Core
  version to target, to change the version of .NET Core for existing projects,
  full package IntelliSense in .csproj files and more. You can follow this work
  in the
  [dotnet/project-system](https://github.com/dotnet/project-system),
  [dotnet/sdk](https://github.com/dotnet/sdk), 
  [microsoft/msbuild](https://github.com/microsoft/msbuild), and 
  [dotnet/cli](https://github.com/dotnet/cli) 
  repos.

* **Performance**. Continue to make the performance of building .NET Core
  applications faster, especially in the inner loop. This is the cycle of
  changing the source code and then restarting the application and making that
  as fast as possible. You can follow part of this work in the
  [dotnet/sdk](https://github.com/dotnet/sdk) repo.

* **.NET Core and Cloud**. Continue to improve how you run .NET Core
  applications in Azure. Better logging, tracing and diagnosing errors in your
  applications when running in the cloud. You can follow this work in the
  [dotnet/corefx](https://github.com/dotnet/corefx),
  [dotnet/corefxlab](https://github.com/dotnet/corefxlab/blob/master/docs/roadmap.md),
  and
  [aspnet](https://github.com/aspnet) repos.

* **Build from Source**. Make it very easy to clone the .NET Core repository at
  GitHub and build the product. Great for experimenting with customizing the
  product or trying to get it to run on Linux distributions other than the ones
  we officially support. You can follow the bulk of the work in the
  [dotnet/coreclr](https://github.com/dotnet/coreclr) and
  [dotnet/corefx](https://github.com/dotnet/corefx) repos.

As mentioned above these are just some of the early big themes we are going to
invest in, we will also continue to invest in ASP.NET, Entity Framework,
Languages and many other parts of .NET.

## Ship Dates

| Milestone                 | Release Date |
|---------------------------|--------------|
| .NET Core 2.0 Preview 1   | [Released on 2017/5/10](https://github.com/dotnet/core/issues/640), see [announcement](https://blogs.msdn.microsoft.com/dotnet/2017/05/10/announcing-net-core-2-0-preview-1/) |
| .NET Standard 2.0 Preview 1 | [Released on 2017/5/10](https://github.com/dotnet/core/issues/640), see [announcement](https://blogs.msdn.microsoft.com/dotnet/2017/05/10/announcing-net-core-2-0-preview-1/) |
| .NET Core 2.0 Preview 2   | [Released on 2017/6/28](https://github.com/dotnet/core/issues/711), see [announcement](https://blogs.msdn.microsoft.com/dotnet/2017/06/28/announcing-net-core-2-0-preview-2/) |
| .NET Core 2.0             | Q3 2017, see also [latest build](https://github.com/dotnet/cli/tree/release/2.0.0#installers-and-binaries) |
| .NET Standard 2.0         | Q3 2017      |
| UWP 6.0 (implements .NET Standard 2.0) | Q4 2017 ([Win10 Fall Creators Update](https://www.microsoft.com/en-us/windows/upcoming-features)) |
| .NET Core 2.1 | Q4 2017 (after UWP 6.0) |

Details on sub-milestones are also captured in milestone details of our repos, e.g. [CoreFX repo milestones](https://github.com/dotnet/corefx/milestones).

# Components

.NET Core is a general purpose, modular, cross-platform and open source
implementation of .NET. It includes a runtime, framework libraries, compilers
and tools that support a variety of chip and OS targets. These components can be
used together or separately.

Major .NET Core components are listed below. Please note that this is not meant
to be an exhaustive list.

* [Runtime](https://github.com/dotnet/coreclr)
* [Libraries](https://github.com/dotnet/corefx)
* [.NET Standard](https://github.com/dotnet/standard)
* [C#/VB compiler](https://github.com/dotnet/roslyn)
* [F# compiler](https://github.com/microsoft/visualfsharp)
* [SDK](https://github.com/dotnet/sdk)
* [CLI tools](https://github.com/dotnet/cli) / [CLI documentation](https://docs.microsoft.com/en-us/dotnet/articles/core/tools/index)
* [NuGet](https://github.com/NuGet/Home)
* [ASP.NET](https://github.com/aspnet)
* [MSBuild](https://github.com/microsoft/msbuild)
* [Docker Images](https://github.com/dotnet/dotnet-docker)

This roadmap is intended to communicate project priorities for evolving and
extending the scope of .NET Core.

# Supported OS Versions

## .NET Core 2.0 - Supported OS Versions

Proposal:

OS                            |Version                        |Architectures  |Notes
------------------------------|-------------------------------|---------------|-----
Windows Client                | 7 SP1+                        | x64, x86      |
Windows Server                | 2008 R2 SP1+                  | x64, x86      | Configurations: Full, Server Core, Nano
Windows IoT                   | 10+                           | [C] arm32     | IoT Core - see [Raspberry Pi instructions](https://github.com/dotnet/core/blob/master/samples/RaspberryPiInstructions.md)
Red Hat Enterprise Linux      | 7.3+                          | x64           | This includes Centos and Oracle Linux
Fedora                        | 25+                           | x64           | 
Debian                        | 8.7+                          | x64           | [Debian 9 (Stretch) workaround](https://github.com/dotnet/corefx/issues/8951#issuecomment-299927277)
Ubuntu                        | 14.04+                        | x64, [C] arm32 | This includes Linux Mint 17 for x64 <br/> For arm32, see [Raspberry Pi instructions](https://github.com/dotnet/core/blob/master/samples/RaspberryPiInstructions.md)
openSUSE                      | 42.2+                         | x64           | 
Tizen                         | 4+                            | [S] arm32     | [Tizen .NET Developer Preview](https://developer.tizen.org/development/tizen-.net-preview/introduction)
Mac OS X                      | 10.12+                        | x64           | 
**In Progress OS's**          |                               |               | 
Arch Linux                    | [C] TBD                       | TBD           | Blocked on [missing OpenSSL 1.0 package](https://github.com/dotnet/corefx/issues/9855#issuecomment-298982251) in distro. <br/> Arch Linux community efforts tracked [here](https://bbs.archlinux.org/viewtopic.php?pid=1708479).
FreeBSD & NetBSD              | [C] TBD                       | TBD           | Tracking [main issue](https://github.com/dotnet/coreclr/issues/6115) and [label](https://github.com/dotnet/coreclr/labels/os-freebsd). <br/> NetBSD packages for [.NET Core 1.0.0](https://github.com/dotnet/coreclr/issues/6115#issuecomment-233151220) |

* Note: The goal is to support these OS's up to the version that has released when .NET Core 2.0 releases. Some will be officially supported by Microsoft and/or Samsung while others may be made available with community support. Entries will be supported by Microsoft per the Microsoft support policy except where support is explicitly called out as coming from elsewhere.
* [S] This is supported by Samsung.
* [C] This is supported by the Community

## .NET Core 1.0 - Supported OS Versions

OS                            |Version                        |Architectures|Configurations|Notes
------------------------------|-------------------------------|-------------|--------------|-----
Windows Client                | 7 SP1 - 10                    | x64, x86    |              |
Windows Server                | 2008 R2 SP1 - 2016            | x64, x86    | Full, Server Core, Nano (2016 only) |
Red Hat Enterprise Linux      | 7.2                           | x64         |              |
~~Fedora~~ *                        | ~~23~~                            | ~~x64~~         |              |
Debian                        | 8.2                           | x64         |              |
Ubuntu                        | 14.04 LTS, 16.04 LTS          | x64         |              |
Linux Mint                    | 17                            | x64         |              |
~~openSUSE~~ *                      | ~~13.2~~                          | ~~x64~~         |              |
Centos                        | 7.1                           | x64         |              |
Oracle Linux                  | 7.1                           | x64         |              |
Mac OS X                      | 10.11, 10.12                  | x64         |              | 10.12 added in 1.0.2

(* See the note regarding changes to supported Linux distros in the [RC4 Release Notes](https://github.com/dotnet/core/blob/master/release-notes/1.0/1.0.3-SDK-RC4.md).)

There will be packages available for the native package managers for each OS.
(e.g. apt-get, rpm, pkg, msi) as well as zips.

Microsoft provides commercially reasonable support for ASP.NET Core 1.0, .NET
Core 1.0 and Entity Framework Core 1.0 on the OS and Version detailed in the
table above. Microsoft provides support for ASP.NET Core 1.0, .NET Core 1.0 and
Entity Framework Core 1.0 on Windows, Linux, and Mac OS X.  For an explanation
of available support options, please visit [Support for Business and
Developers](https://support.microsoft.com/en-us/gp/contactus81?Audience=Commercial&SegNo=4).

# Project Goals

Broad goals:

* .NET Core code is high quality, has compelling performance, and is highly
  reliable.
* .NET Core can be ported to a broad set of OS platforms and chip architectures.
* .NET Core can be deployed with the application, side-by-side with other
  versions.
* .NET Core has a broad API surface that makes it suitable for most payloads.
* Developers can acquire a .NET Core developer environment quickly and
  intuitively.
* Developers can productively and intuitively build apps, using documentation,
  samples, community resources, and NuGet packages.

# Contributions

Contribution goals:

* Encourage an active community welcoming contributions from all.

The .NET Core maintainers have taken a liberal approach to contributions since
the outset of the .NET Core open source project.

# Microsoft Distro

Microsoft ships multiple .NET Core distros. It is important that Microsoft can
successfully ship .NET Core at quality and meet its desired dates.

# Other Distros

.NET Core will ship as part of many Linux distros and we are actively working
with key partners in the Linux community to make it natural for .NET Core to go
everywhere people need it. We are constantly looking to expand our distro
support and welcome contributions and collaborations in this direction.

## Goals

* There are high-quality ports for Linux, macOS and Windows.
* There are high-quality ports for X64, X86, ARM32, and ARM64.
* .NET Core ships stable releases multiple times a year.
* Contributions should be prioritized that align with these goals.

## Workloads

The Microsoft distro currently supports the following workloads:

* Console Apps
* ASP.NET Core
* Windows 10 UWP
