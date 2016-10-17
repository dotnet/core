.NET Core Roadmap
=================

.NET Core is a general purpose, modular, cross-platform and open source implementation of .NET. It includes a runtime, framework libraries, compilers and tools that support a variety of chip and OS targets. These components can be used together or separately.

Major .NET Core components:
- [Runtime](https://github.com/dotnet/coreclr)
- [Libraries](https://github.com/dotnet/corefx)
- [C#/VB compiler](https://github.com/dotnet/roslyn)
- [CLI tools](https://github.com/dotnet/cli)
- [NuGet](https://github.com/NuGet/Home)
- [MSBuild](https://github.com/microsoft/msbuild)

This roadmap is intended to communicate project priorities for evolving and extending the scope of .NET Core.

Ship Dates
----------

At Microsoft, .NET has always been an important component of other teams' products and has largely shipped on their schedules. It means that we have to take their dates seriously and integrate them into the .NET Core schedule.

|Milestone|Release Date|
|---------|------------|
|1.1      |   Fall 2016|
|1.2      |   Spring 2017|

Planned 1.1 features
--------------------
- Lots of fixes based on feedback. 
- Support for more popular OS's/distro's that have been released since 1.0.

Planned 1.2 features
--------------------

- .NET Standard 2.0 support, bringing .NET Core to parity with .NET Framework and Mono for a large collection of base types.

Notes:

- The 1.0 release is accompanied with a preview version of the Visual Studio and command-line tooling. The Visual Studio tooling for 1.0 through 1.2 based on MSBuild and csproj should be publicly available in Fall 2016 and reach RTM quality in Spring 2017. 

- The [ASP.NET Core roadmap](https://github.com/aspnet/Home/wiki/Roadmap) articulates the ASP.NET projects' roadmap and dates.

Technology Roadmaps
===================

Architecture:

- [.NET Platform Standard](https://github.com/dotnet/corefx/blob/master/Documentation/architecture/net-platform-standard.md)
- [.NET Core Tools/CLI](https://docs.microsoft.com/en-us/dotnet/articles/core/tools/index)

Version 1.0 OS Support:

OS|Version|Architectures|Configurations|Notes
------------------------------|-------------------------------|----------|----------|---------|
Windows Client                | 7 SP1 - 10                    | x64, x86 | |
Windows Server                | 2008 R2 SP1 - 2016            | x64, x86 | Full, Server Core, Nano (2016 only) |
Red Hat Enterprise Linux      | 7.2                           | x64      | |
Fedora                        | 23                            | x64      | |
Debian                        | 8.2                           | x64      | |
Ubuntu                        | 14.04 LTS, 16.04 LTS          | x64      | |
Linux Mint                    | 17                            | x64      | |
openSUSE                      | 13.2                          | x64      | |
Centos                        | 7.1                           | x64      | |
Oracle Linux                  | 7.1                           | x64      | |
Mac OS X                       | 10.11, 10.12            | x64      | | 10.12 added in 1.0.2

There will be packages available for the native package managers for each OS. (e.g. apt-get, rpm, pkg, msi) as well as zips.

Microsoft provides commercially reasonable support for ASP.NET Core 1.0, .NET Core 1.0 and Entity Framework Core 1.0 on the OS and Version detailed in the table above.
Microsoft provides support for ASP.NET Core 1.0, .NET Core 1.0 and Entity Framework Core 1.0 on Windows, Linux, and Mac OS X.  For an explanation of available support options, please visit [Support for Business and Developers](https://support.microsoft.com/en-us/gp/contactus81?Audience=Commercial&SegNo=4).

Project Goals
=============

Broad goals:

- .NET Core code is high quality, has compelling performance, and is highly reliable.
- .NET Core can be ported to a broad set of OS platforms and chip architectures.
- .NET Core can be deployed with the application, side-by-side with other versions.
- .NET Core has a broad API surface that makes it suitable for most payloads.
- Developers can acquire a .NET Core developer environment quickly and intuitively.
- Developers can productively and intuitively build apps, using documentation, samples, community resources, and NuGet packages.

Contributions
=============

Contribution goals: 

- Encourage an active community welcoming contributions from all.

The .NET Core maintainers have taken a liberal approach to contributions since the outset of the .NET Core open source project and have taken changes outside of the published [priorities](https://github.com/dotnet/coreclr/blob/master/Documentation/project-docs/project-priorities.md). 

Microsoft Distro
================

Microsoft ships multiple .NET Core distros. It is important that Microsoft can successfully ship .NET Core at quality and meet its desired dates.

Other Distros
================
.NET Core will ship as part of many Linux distros and we are actively working with key partners in the Linux community to make it natural for .NET Core to go everywhere people need it. We are constantly looking to expand our distro support and welcome contributions and collaborations in this direction.

Goals
-----

- There are high-quality ports for Linux, macOS and Windows.
- There are high-quality ports for X64, X86, ARM32, and ARM64.
- .NET ships stable releases multiple times a year.
- Contributions should be prioritized that align with these goals.

Workloads
---------

The Microsoft distro currently supports the following workloads:

- Console Apps
- ASP.NET Core
- Windows 10 UWP
