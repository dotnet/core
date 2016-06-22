.NET Core Roadmap
=================

.NET Core is a general purpose, modular, cross-platform and open source implementation of .NET. It includes a runtime, framework libraries, compilers and tools that support a variety of chip and OS targets. These components can be used together or separately.

Major .NET Core components:
- [Base Class Libraries](https://github.com/dotnet/corefx)
- [CoreCLR runtime and RyuJIT compiler](https://github.com/dotnet/coreclr)
- [CoreRT runtime and .NET Native compiler](https://github.com/dotnet/corert)
- [Roslyn compiler](https://github.com/dotnet/roslyn)
- [LLILC compiler](https://github.com/dotnet/llilc)
- [CLI tools](https://github.com/dotnet/cli)

This roadmap is intended to communicate project priorities for evolving and extending the scope of .NET Core.

Technology Roadmaps
===================

Architecture:

- [.NET Platform Standard](https://github.com/dotnet/corefx/blob/master/Documentation/architecture/net-platform-standard.md)
- [Native Compilation](https://github.com/dotnet/corert/blob/master/Documentation/intro-to-corert.md)
- [.NET Core Tools/CLI](https://github.com/dotnet/cli/blob/rel/1.0.0/Documentation/intro-to-cli.md)

Active ports:

- Languages: C#, VB, and F#.
- OS: Linux, macOS, FreeBSD and Windows.
- Linux distros: RHEL, Fedora, Debian family, CentOS, Oracle Linux, Linux Mint.
- Windows versions: Win7+ (client and server).
- Chips: X64, X86, ARM32, ARM64.
- Specialized hardware: Raspberry Pi.

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

- Encourage an active community.
- Make changes easy to code review (smaller vs. bigger). 

The .NET Core maintainers have taken a liberal approach to contributions since the outset of the .NET Core open source project and have taken changes outside of the published [priorities](https://github.com/dotnet/coreclr/blob/master/Documentation/project-docs/project-priorities.md). 

Microsoft Distro
================

Microsoft ships multiple .NET Core distros. It is important that Microsoft can successfully ship .NET Core at quality and meet it's desired dates.

Goals
-----

- There are high-quality ports for Linux, macOS and Windows.
- There are high-quality ports for X64, X86 and ARM32.
- .NET Core can be shipped on a schedule that aligns with ASP.NET and Windows 10 UWP dates and quality (e.g. Beta, RTM) requirements.
- Contributions should be prioritized that align with these goals.

Workloads
---------

The Microsoft distro currently supports the following workloads:

- Console
- ASP.NET Core (MVC and WebAPI)
- Windows 10 UWP

Ship Dates
----------

At Microsoft, .NET has always been an important component of other teams' products and has largely shipped on their schedules. It means that we have to take their dates seriously and integrate them into the .NET Core schedule.

|Milestone|Release Date|
|---------|------------|
|RTM      |   June 2016|
|1.1      |   Fall 2016|

Planned 1.1 features
--------------------

- Broader API support, bringing parity with .NET Framework and Mono.
- Transition to MSBuild and csproj as the default build system and project model for all versions of .NET. 

Notes:

- The RTM release is accompanied with a preview version of the Visual Studio and command-line tooling. The tooling should reach RTM quality with version 1.1 of the .NET Core runtime in Fall 2016.
- The [ASP.NET Core 1.0 roadmap](https://github.com/aspnet/Home/wiki/Roadmap) articulates the ASP.NET projects's roadmap and dates.

TBD
===

There are several areas of the product that are TBD. This designation doesn't mean that they are not important, just that there is no plan in place yet. Feel free to contribute that plan.

- OS package manager support (e.g. apt-get, brew).
- Broader Linux distro support.
- Create low-level FX APIs for Linux (e.g. daemon support) and OSX, much like exists for Windows (e.g. Windows registry).
