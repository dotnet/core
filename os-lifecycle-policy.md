# .NET Core Supported OS Lifecycle Policy

.NET Core is [supported by Microsoft](microsoft-support.md) on a range of operating systems. 

Each supported operating system has a lifecycle defined by its sponsor organization (for example, Microsoft, Red Hat, or Apple). The .NET Core team applies each of those lifecycle schedules to inform adding and removing support for operating system versions.

The following support documents list currently supported operating system versions for supported .NET Core versions:

* [.NET 5 supported OS versions](release-notes/5.0/5.0-supported-os.md)
* [.NET Core 3.1 supported OS versions](release-notes/3.1/3.1-supported-os.md)
* [.NET Core 2.1 supported OS versions](release-notes/2.1/2.1-supported-os.md)

## Out-of-Support .NET Core versions

When an operating system version goes out of support, we stop testing that version and providing support for that version. This means that users will need to move forward to a supported operating system version to get support. Previously released packages will remain available for users needing access.

The following support documents list historical operating system support for out-of-support .NET Core versions:

* [.NET Core 3.0 supported OS versions](release-notes/3.0/3.0-supported-os.md)
* [.NET Core 2.2 supported OS versions](release-notes/2.2/2.2-supported-os.md)
* [.NET Core 2.0 supported OS versions](release-notes/2.0/2.0-supported-os.md)
* [.NET Core 1.x supported OS versions](release-notes/1.0/1.0-supported-os.md)

## Change Process

Operating system versions are added and go out of support on a regular basis. We record these changes in two places:

* The support documents listed above
* [Monthly Update Announcements](https://github.com/dotnet/announcements/labels/Monthly-Update)

When a new operating system version is made available, we will typically support it on a subset of supported .NET Core versions, potentially only with the latest .NET Core version.
