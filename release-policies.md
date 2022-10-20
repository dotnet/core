# Release Policies

The .NET team uses the following policies for [.NET releases](releases.md).

## Release cadence

New major .NET versions are released annually in November, at [.NET Conf](https://www.dotnetconf.net/).

Patch updates are released monthly on the second Tuesday of each month, also known as Patch Tuesday.

Minor versions of the .NET SDK are released approximately quarterly. These are known as [feature bands](https://learn.microsoft.com/dotnet/core/releases-and-support#feature-bands-sdk-only).

## Release types

Each .NET release is defined as either  **Standard Support** or **Long Term Support (LTS)**, at the beginning of the release.

The release types:

* **Standard Support** releases are supported for eighteen months, released in even-numbered years. They are intended for users that want to take advantage of the newest features and improvements and to stay on the leading edge of .NET innovation.
* **LTS** releases are supported for three years, released in odd-numbered years. They are intended for users that want the stability and lower cost of maintaining an application for an extended period, only needing to upgrade their .NET version for security patches.

Note: **Standard** releases were previously called **Current**.

LTS and Standard Support releases differ only by support duration. The .NET team follows the same software engineering and release processes for both release types, including for security, compatibility, and reliability. Both releases may contain major new features and breaking changes. The .NET team aspires to enable straightforward migration from one release to another, independent of release type.

## Support phases

.NET releases go through multiple support phases, with varying support levels.

* **Preview** releases are not supported but are offered for public testing and for the opportunity to give feedback.
* **Release Candidate** releases have a go-live support that enables users to deploy a pre-release build in production and are supported by Microsoft.
* **Active** support is provided for the majority of the period after a release is Generally Available (GA). Functional and security improvements will be provided, including support for new operating system versions.
* **Maintenance** support is provided for the last six months of support. Improvements are limited to security fixes. Support for new operating system versions will be provided on a best-effort basis.
* **End of support** or end-of-life (EOL) marks the point where a release is no longer supported.

[Support for various operating systems](os-lifecycle-policy.md) is defined for each release.

## Servicing

Improvements are released as full re-releases of the product, called "patch releases". Patch releases are cumulative. Patches are released on the Microsoft "Patch Tuesday" (second Tuesday of each month), however there is no guarantee that there will be a .NET release on any given Patch Tuesday.

Patches are announced in [release notes](release-notes/README.md), on the [.NET blog](https://devblogs.microsoft.com/dotnet/category/maintenance-and-updates/), and [dotnet/announcements](https://github.com/dotnet/announcements/labels/Monthly-Update).

Breaking changes are not accepted during servicing, except (in the very rare case) to resolve critical issues, such as a security vulnerability.

## End of support

As the end of support nears for a given .NET version, we recommend that you move to a newer .NET version, and reduce/remove your use of the given .NET version. After support ends, we recommend that you uninstall a given .NET version if you are no longer using it, or install the latest patch, and accelerate your plans to remove your use of that .NET version.

Your use of out-of-support .NET versions may put your applications, application data, and computing environment at risk. You are strongly recommended to not use out-of-support software.

## Vendor support

[Microsoft offers support](microsoft-support.md) for .NET releases, per these policies. Updates are provided at the [.NET Website](https://dotnet.microsoft.com/download/dotnet), [Microsoft Update](https://devblogs.microsoft.com/dotnet/net-core-updates-coming-to-microsoft-update/), [Linux Package Managers](https://docs.microsoft.com/dotnet/core/install/linux), and the [Microsoft Artifact Registry](https://mcr.microsoft.com/catalog?search=dotnet).
