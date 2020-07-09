# Microsoft .NET Core support lifecycle

Every Microsoft product has a lifecycle, including .NET Core. The lifecycle begins when a product is released and ends when it's no longer supported. Knowing key dates in this lifecycle helps you make informed decisions about when to upgrade or make other changes to your software. This product is governed by the [Microsoft Modern Lifecycle](https://support.microsoft.com/help/30881/modern-lifecycle-policy).

This document describes the support lifecycle for: .NET Core, ASP.NET Core and EF Core.

The [.NET Core OS Lifecycle Policy](https://github.com/dotnet/core/blob/master/os-lifecycle-policy.md) describes support for various operating systems.

## .NET Core Releases

This table describes support type, supported patch version and end of support date for .NET Core releases.

|  Version  |  Release Date | Support Level | Supported Patch Version | End of Support |
| -- | -- | -- | -- | -- |
| [.NET Core 3.1](https://devblogs.microsoft.com/dotnet/announcing-net-core-3-1/) | December 3, 2019 | LTS | [3.1.5](https://dotnet.microsoft.com/download/dotnet-core/3.1) | December 3, 2022 |
| [.NET Core 2.1](https://blogs.msdn.microsoft.com/dotnet/2018/05/30/announcing-net-core-2-1) | May 30, 2018 | LTS | [2.1.19](https://dotnet.microsoft.com/download/dotnet-core/2.1) | August 21, 2021 |

For previous versions, [see here](https://dotnet.microsoft.com/platform/support/policy/dotnet-core).

## Release Types

Microsoft produces **Long Term Support (LTS)** and **Current** releases, which are defined as:

* **LTS** releases are designed for long-term support. They included features and components that have been stabilized, requiring few updates over a longer support release lifetime. These releases are a good choice for hosting applications that you do not intend to update.
* **Current** releases include new features that may undergo future change based on feedback. These releases are a good choice for applications in active development, giving you access to the latest features and improvements. You need to upgrade to later .NET Core releases more often to stay in support.

Both types of releases receive critical fixes throughout their lifecycle, for security, reliability, or to add support for new operating system versions. You must stay up-to-date with the latest patches to qualify for support.

## Release Support Policies

.NET Core releases are supported according to the following policies.

### Long Term Support (LTS) releases

LTS releases are supported for three years after the initial release.

Note: .NET Core 1.x was released under an earlier definition of LTS. See: [.NET Core 1.x "shorter" LTS definition](https://github.com/dotnet/core/blob/e2f22a7106860c0e5dc98bb36dc648a779944ad5/microsoft-support.md#long-term-support-lts-releases).

### Current releases

Current releases are supported for three months after a subsequent Current or LTS release.

### Maintenance releases

Maintenance releases are in the last stage of the lifecycle . During Maintenance, a release will receive security updates. The length of Maintenance time is 3 months for Current and 1 year for LTS.

### End of support

End of support refers to the date when Microsoft no longer provides fixes, updates, or online technical assistance. As this date nears, make sure you have the latest available update\* installed. Without Microsoft support, you will no longer receive security updates that can help protect your machine from harmful viruses, spyware, and other malicious software that can steal your personal information.

\* Updates are cumulative, with each update built upon all of the updates that preceded it. A device needs to install the latest update to remain supported. Updates may include new features, fixes (security and/or non-security), or a combination of both. Not all features in an update will work on all devices. Update availability may vary, for example by country, region, network connectivity, or hardware capabilities (including, for example, free disk space).

### Out of support .NET Core releases

|  Version  |  End of Support |
| -- | -- |
| [.NET Core 3.0](https://devblogs.microsoft.com/dotnet/announcing-net-core-3-0/) | [March 3, 2020](https://devblogs.microsoft.com/dotnet/net-core-3-0-end-of-life/) |
| [.NET Core 2.2](https://devblogs.microsoft.com/dotnet/announcing-net-core-2-2/) | [December 23, 2019](https://devblogs.microsoft.com/dotnet/net-core-2-2-will-reach-end-of-life-on-december-23-2019/)
| [.NET Core 2.0](https://blogs.msdn.microsoft.com/dotnet/2017/08/14/announcing-net-core-2-0/) | [October 1, 2018](https://devblogs.microsoft.com/dotnet/net-core-2-0-will-reach-end-of-life-on-september-1-2018/)
| [.NET Core 1.1](https://blogs.msdn.microsoft.com/dotnet/2016/11/16/announcing-net-core-1-1/) | [June 27, 2019](https://devblogs.microsoft.com/dotnet/net-core-1-0-and-1-1-will-reach-end-of-life-on-june-27-2019/)
| [.NET Core 1.0](https://blogs.msdn.microsoft.com/dotnet/2016/06/27/announcing-net-core-1-0/) | [June 27, 2019](https://devblogs.microsoft.com/dotnet/net-core-1-0-and-1-1-will-reach-end-of-life-on-june-27-2019/)
