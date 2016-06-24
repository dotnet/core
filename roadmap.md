.NET Core Roadmap
=================

.NET Core is a general purpose, modular, cross-platform and open source implementation of .NET. It includes runtime, framework, compiler and tools components that support a variety of chip and OS targets. These components can be used together or separately.

Major .NET Core components:

- [Base Class Libraries](https://github.com/dotnet/corefx)
- [CoreCLR runtime and RyuJIT compiler](https://github.com/dotnet/coreclr)
- [Roslyn compiler](https://github.com/dotnet/roslyn)
- [CLI tools](https://github.com/dotnet/cli)

This roadmap is intended to communicate project priorities for evolving and extending the scope of .NET Core.

Technology Roadmaps
===================

Architecture:

- [.NET Platform Standard](https://github.com/dotnet/corefx/blob/master/Documentation/architecture/net-platform-standard.md)
- [.NET Core Tools/CLI](https://github.com/dotnet/cli/blob/master/Documentation/intro-to-cli.md)

Version 1.0 OS Support:

OS|Version|Architectures|Configurations
------------------------------|-------------------------------|----------|---
Windows Client                | 7 SP1 - 10                    | x64, x86 |
Windows Server                | 2008 R2 SP1 - 2016            | x64, x86 | Full, Server Core, Nano (2016 only)
Red Hat Enterprise Linux      | 7.2                           | x64      |
Fedora                        | 23                            | x64      |
Debian                        | 8.2                           | x64      |
Ubuntu                        | 14.04 LTS, 16.04 LTS          | x64      |
Linux Mint                    | 17                            | x64      |
openSUSE                      | 13.2                          | x64      |
Centos                        | 7.1                           | x64      |
Oracle Linux                  | 7.1                           | x64      |
Mac OSX                       | 10.11 (El Capitan)            | x64      |

There will be packages available for the native package managers for each OS. (e.g. apt-get, rpm, pkg, msi) as well as zips.

Microsoft provides commercially reasonable support for ASP.NET Core 1.0, .NET Core 1.0 and Entity Framework Core 1.0 on the OS and Version detailed in the table above.

Microsoft provides support for ASP.NET Core 1.0, .NET Core 1.0 and Entity Framework Core 1.0 on Windows, Linux, and Mac OSX.  For an explanation of available support options, please visit [Support for Business and Developers](https://support.microsoft.com/en-us/gp/contactus81?Audience=Commercial&SegNo=4).

Project Goals
=============

Broad goals:

- .NET Core supports or can be be ported to a broad set of OS platforms and chip architectures.
- .NET Core has compelling performance and is highly reliable.
- Developers can acquire a .NET Core developer environment quickly and intuitively.
- Developers can productively and intuitively build apps, using documentation, samples and NuGet components.

Contributions
=============

Contribution goals: 

- Encourage an active community.
- Make changes easy to code review (smaller vs. bigger). 

The .NET Core maintainers have taken a liberal approach to contributions since the outset of the .NET Core open source project and have taken changes outside of the published [priorities](https://github.com/dotnet/coreclr/blob/master/Documentation/project-docs/project-priorities.md). 

Microsoft Distro
================

Microsoft ships multiple .NET Core distros. It is important that Microsoft can successfully ship .NET Core at quality and meet it's desired dates.

Goals
-----

- There are high-quality ports for Linux, OS X and Windows.
- There are high-quality ports for X64, X86.
- .NET Core can be shipped on a schedule that aligns with ASP.NET Core and Windows 10 UWP dates and quality requirements.
- Contributions should be prioritized that align with these goals.

Workloads
---------

The Microsoft distro currently supports the following workloads.

- Console
- ASP.NET Core
- Windows 10 UWP

Ship Dates
----------

At Microsoft, .NET has always been an important component of other teams' products and has largely shipped on their schedules. It means that we have to take their dates seriously and integrate them into the .NET Core schedule.

|Milestone|Release Date|
|---------|------------|
|RTM      | 6/27/2016  |

Notes:

- The RC1 release candidate will be a supported and production ready cross-platform release. 
- Depending on feedback from RC1, we will ship additional release candidates as necessary.
- The [ASP.NET Core roadmap](https://github.com/aspnet/Home/wiki/Roadmap) articulates the ASP.NET projects's roadmap and dates.

Future
===

There are several areas of the product that are planned for the future. This designation doesn't mean that they are not important, just that there is no plan in place yet for when they will be done. Feel free to contribute that plan.


- [Native Compilation](https://github.com/dotnet/corert/blob/master/Documentation/intro-to-corert.md)
- [CoreRT runtime and .NET Native compiler](https://github.com/dotnet/corert)
- [LLILC compiler](https://github.com/dotnet/llilc)

- Create low-level FX APIs for Linux (e.g. daemon support) and OSX, much like exists for Windows (e.g. Windows registry).
