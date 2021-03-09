# .NET Supported OS Policy

.NET is [supported by Microsoft](microsoft-support.md) on multiple operating systems, defined per .NET version.

Each supported operating system has a lifecycle defined by its sponsor organization (for example, Microsoft, Red Hat, Debian, or Apple). The .NET team applies each of those lifecycle schedules to inform adding and removing support for operating system versions.

When an operating system version goes out of "mainstream" or "free" support, we stop testing that version and providing support for that version. This means that users will need to move forward to a supported operating system version to get support.

The following documents define currently supported operating system versions for supported .NET Core versions:

* [.NET 6 supported OS versions](release-notes/6.0/6.0-supported-os.md)
* [.NET 5 supported OS versions](release-notes/5.0/5.0-supported-os.md)
* [.NET Core 3.1 supported OS versions](release-notes/3.1/3.1-supported-os.md)
* [.NET Core 2.1 supported OS versions](release-notes/2.1/2.1-supported-os.md)

The following documents define (historical) operating system support for out-of-support .NET Core versions:

* [.NET Core 3.0 supported OS versions](release-notes/3.0/3.0-supported-os.md)
* [.NET Core 2.2 supported OS versions](release-notes/2.2/2.2-supported-os.md)
* [.NET Core 2.0 supported OS versions](release-notes/2.0/2.0-supported-os.md)
* [.NET Core 1.x supported OS versions](release-notes/1.0/1.0-supported-os.md)

## Change Process

Operating system versions are added and go out of support on a regular basis. We record these changes in two places:

* The support documents listed above
* [Monthly Update Announcements](https://github.com/dotnet/announcements/labels/Monthly-Update)

## Exceptions to the supported platform policy

Occasionally, we may choose to offer support on an OS platform that is out of support. Or we may choose to exclude a supported platform for specific reasons.

One example is Windows 7 SP1. Windows 7 SP1 is out of support, but enterprise customers can buy [Extended Security Updates](https://docs.microsoft.com/troubleshoot/windows-client/windows-7-eos-faq/windows-7-extended-security-updates-faq), and many do. Given the widespread use of Windows 7 in the .NET ecosystem we chose to include Windows 7 SP1 (with Extended Security Updates installed) as a supported platform for .NET 5.0. Another example is Windows Server 2012. Windows Server 2012 is currently in support but not included in the supported platform list for .NET 5.0 because a newer version is available in the Server 2012 family - Server 2012 R2.
