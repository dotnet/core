.NET Core Roadmap
=================

.NET Core is a general purpose, modular, cross-platform and open source implementation of .NET. It includes a set of [framework libraries](https://github.com/dotnet/corefx) and a [runtime](https://github.com/dotnet/coreclr). Both together support a set of OS platforms and chip architectures, enabling a broad set of .NET apps to be built and run. Much of this support is in progress.

The team (anyone contributing to .NET Core) is composed of many individuals and groups. They (separately) have been adding support for the scenarios they are most interested in. That ranges from Windows to FreeBSD. Some of the projects are half-way to completion. Nice work, team! Some contributors, likely companies, will create official distributions (AKA "distros") that they support and potentially sell as part of some offering. A distro is an official build of .NET Core (e.g. zip, apt-get, brew, msi), much like Linux distros.

Microsoft makes multiple "official" .NET Core distributions (libraries and/or runtime) available to its customers. It is expected (and desired) that other groups (corporations or otherwise) will also become significantly invested in .NET Core, making other distros available.

This roadmap is intended to communicate the team's priorities for evolving and extending the scope of .NET Core.

Project Goals
=============

Broad goals:

- .NET Core code is high quality (important consideration for contributions).
- .NET Core can be ported to a broad set of OS platforms and chip architectures.
- .NET Core has compelling performance and is highly reliable.
- Developers can acquire a .NET Core developer environment quickly and intuitively.
- Developers can productively and intuitively build apps, using documentation, samples and NuGet components.

Active ports:

- OSes: Linux, OS X, FreeBSD and Windows.
- Linux distros: Debian family, CentOS.
- Windows versions: Win7+ (client and server).
- Chips: X64, X86, ARM32, ARM64.
- Specialized hardware: RPi2

Contributions
=============

The .NET Core maintainers have taken a liberal approach to contributions since the outset of the .NET Core open source project and have taken changes outside of the published [priorities](https://github.com/dotnet/coreclr/blob/master/Documentation/project-docs/project-priorities.md). That approach isn't intended to change. 

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
|Beta8    |    Oct 2015|
|RC1      |    Nov 2015|
|RTM      |     Q1 2016|

Notes:

- The RC1 release candidate will be a supported and production ready cross-platform release. 
- Depending on feedback from RC1, we will ship additional release candidates as necessary.
- CoreFX API contracts may need to be at RTM quality in RC releases, to support the already RTM Windows 10 UWP release.
- The [ASP.NET 5 roadmap](https://github.com/aspnet/Home/wiki/Roadmap) articulates the ASP.NET projects's roadmap and dates.

Feature Roadmaps
================

This is where links to feature-area roadmaps would go.

TBD
===

There are several areas of the product that are TBD. This designation doesn't mean that they are not important, just that there is no plan in place yet. Feel free to contribute that plan.

- Console appmodel.
- F# suppport for .NET Core.
- OS package manager support (e.g. apt-get, brew).
- Broader Linux distro support (beyond Debian and CentOS).
- Create low-level FX APIs for Linux (e.g. daemon support) and OSX, much like exists for Windows (e.g. Windows registry).
