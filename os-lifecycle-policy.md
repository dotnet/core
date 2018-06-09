# .NET Core Supported OS Lifecycle Policy

.NET Core is [supported by Microsoft](microsoft-support.md) on a range of operatings systems and versions. Each platform has distinct Lifecycles defined by the parent organization. .NET Core support will take these Lifecycle schedules into account when adding or removing versions from the supported list.

* [.NET Core 2.1 supported OS versions](release-notes/2.1/2.1-supported-os.md)
* [.NET Core 2.0 supported OS versions](release-notes/2.0/2.0-supported-os.md)
* [.NET Core 1.x supported OS versions](release-notes/1.0/1.0-supported-os.md)

## Support for new OS versions

When an OS which is part of the .NET Core supported set releases an update, support for that version will generally be available with the next update to .NET Core. For example Fedora 28 is available and will be supported by .NET Core 2.1. Fedora 29 is scheduled to release in the fall of 2018 and will be supported by a subsequent update of .NET Core.

'Support' means that .NET Core is built and tested on the OS and Microsoft Developer Support may be contacted for assistance with .NET Core on the environment.

## OS version end of life

When an OS version reaches end-of-life as defined by the OS owner, .NET Core will also cease to provide support for that OS version. Previously released packages will remain available for customers needing access but formal support and updates of any kind will no longer be provided.
