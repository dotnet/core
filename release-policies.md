# Release Policies

The .NET team uses the following policies for [.NET releases](releases.md).

## Release cadence

New major .NET versions are released annually in November, at [.NET Conf](https://www.dotnetconf.net/).

Patch updates are released monthly on the second Tuesday of each month, also known as Patch Tuesday.

Minor versions of the .NET SDK are released approximately quarterly. These are known as [feature bands](https://learn.microsoft.com/dotnet/core/releases-and-support#feature-bands-sdk-only).

## Release types

Each .NET release is defined as either **Standard Term Support (STS)** or **Long Term Support (LTS)**, at the beginning of the release.

* **STS** releases are supported for eighteen months, released in even-numbered years. They are intended for users that want to take advantage of the newest features and improvements and to stay on the leading edge of .NET innovation.
* **LTS** releases are supported for three years, released in odd-numbered years. They are intended for users that want the stability and lower cost of maintaining an application for an extended period, only needing to upgrade their .NET version for security patches.

Note: **Standard Term Support** releases were previously called **Current**.

LTS and STS releases differ only by support duration. The .NET team follows the same software engineering and release processes for both release types, including for security, compatibility, and reliability. Both releases may contain major new features and breaking changes. The .NET team aspires to enable straightforward migration from one release to another, for both release types.

## Support phases

.NET releases go through multiple support phases, with varying support levels.

* **Preview** releases are not supported but are offered for the community to test and give feedback.
* **Go-Live** releases are supported by Microsoft in production. These are typically our release candidate builds, just before the Generally Available (GA) release.
* **Active** support is provided for the majority of the period after a release is GA. Functional and security improvements will be provided, including support for new operating system versions.
* **Maintenance** support is provided for the last six months of support. Improvements are limited to security fixes. Support for new operating system versions will be provided on a best-effort basis.
* **End of life (EOL)** marks the end of support.

## Servicing

Improvements are released as as a cumulative "patch release", typically monthly. Patches releases are announced and published on the Microsoft "Patch Tuesday" (second Tuesday of each month), however there is no guarantee that there will be a .NET release on any given Patch Tuesday.

Breaking changes are not accepted during servicing, except in the rare case to mitigate a security vulnerability or other critical issue.

Patches are announced in [release notes](release-notes/README.md) and [dotnet/announcements](https://github.com/dotnet/announcements/labels/Monthly-Update).

Patches are published at the [.NET Website](https://dotnet.microsoft.com/download/dotnet), [Microsoft Update](https://devblogs.microsoft.com/dotnet/net-core-updates-coming-to-microsoft-update/), and in [Linux archives and registries](./linux.md).

## End of support

As the end of support nears for a given .NET version, we strongly recommend you move to a newer, supported version of .NET.

Support ends for a given .NET version when its published end of support date has passed. Support typically ends on a patch day. If there is a critical issue for that .NET version, it will be patched for the last time on that day. There will not be any patches after that point. Continuing to use an unsupported version will expose you to security vulnerabilities.

### Tooling

The month after a .NET version goes out of support, we mark that version as optional and out of support in Visual Studio. Customers can remove it from their Visual Studio installs by using the [remove out of support components](https://devblogs.microsoft.com/visualstudio/removing-out-of-support-components-from-your-visual-studio-installations/) experience.

Additionally, customers targeting an out-of-support .NET version in their projects will get a notification in Visual Studio.

6 months after a .NET version goes out of support, newer in-support .NET SDK versions are updated to produce warning [NETSDK1138: The target framework is out of support](https://learn.microsoft.com/dotnet/core/tools/sdk-errors/netsdk1138) when targeting the out-of-support version.

### Packages

[.NET packages](https://www.nuget.org/profiles/dotnetframework) are no longer supported when either of the following occurs:

- A new version of the package is available. Some packages support multiple patches versions at once, one per major version matching a supported major .NET version.
- The package exclusively includes implementations for out-of-support .NET versions.

Nuget.org includes [version](https://www.nuget.org/packages/System.Text.Json/#versions-body-tab) and [supported framework](https://www.nuget.org/packages/System.Text.Json/#supportedframeworks-body-tab) information that can be used to determine support status for packages.

## Support requirements

To remain supported, you must do the following:

- Use a supported SDK
- Target a supported .NET version (via the `TargetFramework` property)
- Reference supported packages

## Operating System support

Each [supported operating system](os-lifecycle-policy.md) has a lifecycle. The .NET team applies each of the lifecycle policies to inform adding and removing support for operating system versions. Support is typically removed when an operating system version is no longer publicly supported for free, at which point we stop testing and supporting it.

Operating system policies and schedules do not always align with the .NET lifecycle. We have sometimes supported operating system versions after mainline support has lapsed as a service to users to provide more time to transition to newer releases. We may also stop supporting an operating system before support has ended, particularly if support time frames are very long.

## Vendor support

Multiple commercial vendors provide support for .NET, including:

* [Canonical](https://ubuntu.com/blog/install-dotnet-on-ubuntu)
* [Microsoft](microsoft-support.md)
* [Red Hat](http://redhatloves.net/)
