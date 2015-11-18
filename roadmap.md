.NET Core Roadmap
=================

.NET Core is a general purpose, modular, cross-platform and open source implementation of .NET. It includes runtime, framework, compiler and tools components that support a variety of chip and OS targets. These components can be used together or separately.

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

- [.NET Platform Standard](https://github.com/dotnet/corefx/blob/master/Documentation/project-docs/standard-platform.md)
- [Native Compilation](https://github.com/dotnet/corert/blob/master/Documentation/intro-to-corert.md)
- [.NET Core Tools/CLI](https://github.com/dotnet/cli/blob/master/Documentation/intro-to-cli.md)

Active ports:

- Languages: F# (C# and VB are done).
- OSes: Linux, OS X, FreeBSD and Windows.
- Linux distros: RHEL, Debian family, CentOS.
- Windows versions: Win7+ (client and server).
- Chips: X64, X86, ARM32, ARM64.
- Specialized hardware: RPi2

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
- There are high-quality ports for X64, X86 and ARM32.
- .NET Core can be shipped on a schedule that aligns with ASP.NET and Windows 10 UWP dates and quality (e.g. Beta, RTM) requirements.
- Contributions should be prioritized that align with these goals.

Workloads
---------

The Microsoft distro currently supports the following workloads.

- Console
- ASP.NET 5
- Windows 10 UWP

Ship Dates
----------

At Microsoft, .NET has always been an important component of other teams' products and has largely shipped on their schedules. It means that we have to take their dates seriously and integrate them into the .NET Core schedule.

|Milestone|Release Date|
|---------|------------|
|RTM      |     Q1 2016|

Notes:

- The RC1 release candidate will be a supported and production ready cross-platform release. 
- Depending on feedback from RC1, we will ship additional release candidates as necessary.
- CoreFX API contracts may need to be at RTM quality in RC releases, to support the already RTM Windows 10 UWP release.
- The [ASP.NET 5 roadmap](https://github.com/aspnet/Home/wiki/Roadmap) articulates the ASP.NET projects's roadmap and dates.

TBD
===

There are several areas of the product that are TBD. This designation doesn't mean that they are not important, just that there is no plan in place yet. Feel free to contribute that plan.

- OS package manager support (e.g. apt-get, brew).
- Broader Linux distro support (beyond Debian and CentOS).
- Create low-level FX APIs for Linux (e.g. daemon support) and OSX, much like exists for Windows (e.g. Windows registry).
