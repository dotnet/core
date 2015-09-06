.NET Core Roadmap
=================

.NET Core is a general purpose, modular, cross-platform and open source implementation of .NET. The .NET Core team (anyone contributing to .NET Core) aspires to enable it to work for many interesting scenarios. Some of those are already part-way to completion. Nice work, team! 

This roadmap is intended to communicate the team's priorities for evolving and extending the scope of .NET Core.

Microsoft is very invested in .NET Core and makes multiple "official Microsoft" .NET Core distributions available to its customers. Sweet! It is expected (and desired) that other groups (corporations or otherwise) will also become significantly invested in .NET Core, possibly making other distros available. As a result, this roadmap is written from a neutral perspective, not a Microsoft one (unless specifically called out). This document is therefore naturally open to PRs.

Project Goals
=============

Broad goals:

- .NET Core code is high quality (important consideration for contributions).
- .NET Core can be ported to a broad set of OS platforms and chip architectures.
- .NET Core has compelling performance and is highly reliable.
- Developers can acquire a .NET Core developer environment quickly and intuitively.
- Developers can productively and intuitively build apps, using documentation, samples and NuGet components.

Active ports:

- OSes: Linux, OS X, FreeBSD, Rasberry Pi2 (Linux) and Windows.
- Linux distros: Debian family, CentOS.
- Windows versions: Win7+ (client and server).
- Chips: X64, X86, ARM32.

Microsoft Distro
================

Microsoft ships multiple .NET Core distros. It is important that Microsoft can successfully ship .NET Core at quality and meet it's desired dates.

Goals
-----

- There are high-quality ports for Linux, OS X and Windows.
- There are high-quality ports for X64, X86 and ARM32.
- .NET Core can be shipped on a schedule that aligns with ASP.NET and Windows 10 UWP dates and quality (e.g. Beta, RTM) requirements.
- Contributions should be prioritized that align with these goals.

Ship Dates
----------

At Microsoft, .NET has always been an important component of other teams' products and has largely shipped on their schedules. It's important to have customers! It means that we have to take their dates seriously and integrate them into the .NET Core schedule.

|Milestone|Release Date|Partner|Quality|
|---------|------------|-------|-------|
|Beta8    |    Oct 2015|ASP.NET|Beta   |
|RC1      |    Nov 2015|ASP.NET|RC     |
|v5 RTM   |     Q1 2016|ASP.NET|RTM    |

Notes:

- The RC1 release candidate will be a supported and production ready cross-platform release. 
- Depending on feedback from RC1, we will ship additional release candidates as necessary.
- The RTM release is **CY** Q1 2016.
- CoreFX API contracts may need to be at RTM quality in RC releases, to support the already RTM Windows 10 UWP release.
- The [ASP.NET 5 roadmap](https://github.com/aspnet/Home/wiki/Roadmap) articulates the ASP.NET projects's roadmap and dates.
- More partners will be added to this list over time.

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

Contributions
=============

The .NET Core maintainers have taken a liberal approach to contributions since the outset of the .NET Core open source project and have taken changes outside of the published [priorities](https://github.com/dotnet/coreclr/blob/master/Documentation/project-docs/project-priorities.md). That approach isn't intended to change. 

Contribution goals: 

- Encourage an active community.
- Make changes easy to code review (smaller vs. bigger). 
- Keep a single "repo of truth" for the project. 
- Support multiple release trains (released, about to release, vNext).
