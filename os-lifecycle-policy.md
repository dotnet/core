# .NET Supported OS Policy

.NET is [supported](support.md) on multiple operating systems.

## Supported .NET versions

The following documents describe supported operating systems:

* [.NET 8 supported OS versions](release-notes/8.0/supported-os.md)
* [.NET 7 supported OS versions](release-notes/7.0/supported-os.md)
* [.NET 6 supported OS versions](release-notes/6.0/supported-os.md)

## Out-of-support .NET versions

The following documents describe (historical) supported operating systems:

* [.NET Core 3.1 supported OS versions](release-notes/3.1/3.1-supported-os.md)
* [.NET 5 supported OS versions](release-notes/5.0/5.0-supported-os.md)
* [.NET Core 3.0 supported OS versions](release-notes/3.0/3.0-supported-os.md)
* [.NET Core 2.2 supported OS versions](release-notes/2.2/2.2-supported-os.md)
* [.NET Core 2.1 supported OS versions](release-notes/2.1/2.1-supported-os.md)
* [.NET Core 2.0 supported OS versions](release-notes/2.0/2.0-supported-os.md)
* [.NET Core 1.x supported OS versions](release-notes/1.0/1.0-supported-os.md)

## Change Process

Operating system versions are added and go out of support on a regular basis. We record these changes in three places:

* The support documents listed above
* [Monthly Update Announcements](https://github.com/dotnet/announcements/labels/Monthly-Update)
* [OS support tracking issues](https://github.com/dotnet/core/labels/os-support)

## Lifecycle Policy

Each supported operating system has a lifecycle defined by its sponsor organization (for example, Microsoft, Red Hat, Debian, or Apple). The .NET team applies each of those lifecycle schedules to inform adding and removing support for operating system versions. Support is typically removed when an operating system goes out of mainline support, at which point we stop testing and supporting it, and support documents are updated to match.

Operating system policies and schedules do not always align well with the annual .NET schedule. We have sometimes supported both [Windows](https://learn.microsoft.com/troubleshoot/windows-client/windows-7-eos-faq/windows-7-extended-security-updates-faq) and Linux versions after mainline (and possibly free) support has lapsed as a service to users to provide more time to transition to newer releases. The previous support documents are kept up to date and provide accurate information you can use to make your own support decisions.
