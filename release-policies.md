# Release Policies

The .NET team uses the following policies for [.NET releases](releases.md). They define what you can expect when you use a given .NET release.

## Release cadence

New major .NET versions are released annually in November. .NET 5.0 was the first version to be released according to this schedule. Minor releases may also be released, with no pre-defined or regular schedule.

## Release types

Each .NET release is defined (prior to initial release) as either **Long Term Support (LTS)** or **Current**. The difference is support time frame, as defined below:

* **LTS** releases are supported for three years. They are intended for users that want the stability and lower cost of maintaining an application on a single (major.minor) .NET version for an extended period.
* **Current** releases are supported for (typically) fifteen months. They are intended for users that want to take advantage of the newest features and improvements and to stay on the leading edge of .NET innovation. Current release users need to upgrade to later .NET releases more often to stay in support.

LTS and Current releases have many similarities. The .NET team follows the same software engineering and release processes for both release types, including for security, compatibility, and reliability. Both releases may contain major new features and breaking changes. The .NET team aspires to enable straightforward migration from one release to another (LTS or Current, in either direction), and has processes in place to achieve that intention.

## Servicing periods

.NET Core releases are supported -- during the servicing period -- according to the following policies. Servicing policies are the same for LTS and Current releases.

A single "bug bar" is used to decide if a change is warranted and safe for servicing updates. A given fix is often applied to multiple [servicing branches](https://github.com/dotnet/core/blob/main/daily-builds.md#servicing-releases), independent of release type. Breaking changes are not accepted during servicing, except (in the very rare case) to resolve a security vulnerability.

Improvements are released as "patches". Patch releases are cumulative. Patches are released on the Microsoft "Patch Tuesday" (second Tuesday of each month), however there is no guarantee that there will be a .NET release on any given Patch Tuesday. Patches are announced on the [.NET blog](https://devblogs.microsoft.com/dotnet/). A digest of monthly releases is published to [dotnet/announcements](https://github.com/dotnet/announcements/labels/Monthly-Update).

### Full support

During the full support period, .NET releases are updated to improve functional capabilities and mitigate security vulnerabilities.

Functional improvements are typically very targeted, and may address the following:

* Resolve reported crashes.
* Resolve severe performance issues.
* Resolve functional bugs in mainline scenarios.
* Add support for a new [operating system version](os-lifecycle-policy.md) or new hardware platform.

### Maintenance support

During the maintenance support period, .NET releases are updated to mitigate security vulnerabilities, only.

### End of support

"End of support", "out of support", or "end of life" refers to the date after which fixes, updates, or technical assistance are no longer provided. As the end of support nears for a given .NET version, we recommend that you move to a newer .NET version, and reduce/remove your use of the given .NET version. After support ends, we recommend that you uninstall a given .NET version if you are no longer using it, or install the latest patch, and accelerate your plans to remove your use of that .NET version.

Your use of out-of-support .NET versions may put your applications, application data, and computing environment at risk. You are strongly recommended to not use out-of-support software.

## Support Policies

The following policies are used to determine support length and kind.

* LTS releases are supported for three years. They receive full support for the first two years and are in maintenance for the third year. After that time, the release will be out-of-support.
* Current releases are typically supported for fifteen months. They receive full support for the first twelve months and are in maintenance for the last three months. After that time, the release will be out-of-support.
* A Current release will be supported for a shorter period if a new release (LTS or Current) is released within twelve months of that Current release. In that case, the Current release will immediately transition to three months of maintenance support. After that time, the release will be out-of-support.

## Vendor support

[Microsoft offers support](microsoft-support.md) for in-support releases. Updates are provided at [dotnet.microsoft.com](https://dotnet.microsoft.com/download/dotnet) and [Microsoft Update](https://devblogs.microsoft.com/dotnet/net-core-updates-coming-to-microsoft-update/).
