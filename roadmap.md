.NET Core Roadmap
=================

.NET Core is a general purpose, modular, cross-platform and open source implementation of .NET. It includes a set of [framework libraries](https://github.com/dotnet/corefx) and a [runtime](https://github.com/dotnet/coreclr). Both together support a set of OS platforms and chip architectures, enabling a broad set of .NET apps to be built and run. Much of this support is in progress.

The team (anyone contributing to .NET Core) is composed of many individuals and groups. They (separately) have been adding support for the scenarios they are most interested in. That ranges from Windows to FreeBSD. Some contributors, likely companies, will create official distributions (AKA "distros") that they support and potentially sell as part of their offering. A distro is an official build of .NET Core (e.g. zip, apt-get, brew, msi), much like Linux distros.

Microsoft makes multiple "official" .NET Core distributions (libraries and/or runtime) available to its customers. It is expected (and desired) that other groups (corporations or otherwise) will also become significantly invested in .NET Core, making other distros available.

This roadmap is intended to communicate the team's priorities for evolving and extending the scope of .NET Core.

Project Goals
=============

Broad goals:

- .NET Core code is high quality, has compelling performance, and is highly reliable.
- .NET Core can be ported to a broad set of OS platforms and chip architectures.
- .NET Core can be deployed with the application, side-by-side with orher versions.
- .NET Core has a broad API surface that makes it suitable for most payloads.
- Developers can acquire a .NET Core developer environment quickly and intuitively.
- Developers can productively and intuitively build apps, using documentation, samples and NuGet components.

Active ports:

- OS: Linux, macOS, FreeBSD and Windows.
- Linux distros: RHEL, Fedora, Debian family, CentOS.
- Windows versions: Win7+ (client and server).
- Chips: X64, X86, ARM32, ARM64.
- Specialized hardware: Raspberry Pi.

Contributions
=============

The .NET Core maintainers have taken a liberal approach to contributions since the outset of the .NET Core open source project and have taken changes outside of the published [priorities](https://github.com/dotnet/coreclr/blob/master/Documentation/project-docs/project-priorities.md). 

Contribution goals:

- Encourage an active community.
- Make changes easy to code review (smaller vs. bigger). 
- Keep a single "repo of truth" for the project. 
- Support multiple release trains (released, about to release, vNext).

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
