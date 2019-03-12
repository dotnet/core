# Microsoft Support for .NET Core

Every Microsoft product has a lifecycle, including .NET Core. The lifecycle begins when a product is released and ends when it's no longer supported. Knowing key dates in this lifecycle helps you make informed decisions about when to upgrade or make other changes to your software. This product is governed by the [Microsoft Modern Lifecycle](https://support.microsoft.com/help/30881/modern-lifecycle-policy).

This document describes the support lifecycle for: .NET Core, ASP.NET Core and EF Core.

The [.NET Core OS Lifecycle Policy](https://github.com/dotnet/core/blob/master/os-lifecycle-policy.md) describes support for various operating systems.

## .NET Core Releases

This table describes support type, supported patch version and end of support date for .NET Core releases.

|  Version  |  Release Date | Support Level | Supported Patch Version | End of Support |
| -- | -- | -- | -- | -- |
| [.NET Core 2.2](https://aka.ms/netcore22announce) | December 04, 2018 | Current | [2.2.3](https://www.microsoft.com/net/download/dotnet-core/runtime-2.2.3) | |
| [.NET Core 2.1](https://blogs.msdn.microsoft.com/dotnet/2018/05/30/announcing-net-core-2-1) | May 30, 2018 | LTS | [2.1.9](https://www.microsoft.com/net/download/dotnet-core/runtime-2.1.9) | At least three years from LTS declaration (August 21, 2018). |
| [.NET Core 1.1](https://blogs.msdn.microsoft.com/dotnet/2016/11/16/announcing-net-core-1-1/) | November 16, 2016 | Maintenance | [1.1.12](https://www.microsoft.com/net/download/dotnet-core/runtime-1.1.12) | June 27, 2019 |
| [.NET Core 1.0](https://blogs.msdn.microsoft.com/dotnet/2016/06/27/announcing-net-core-1-0/) | June 27, 2016 | Maintenance | [1.0.15](https://www.microsoft.com/net/download/dotnet-core/runtime-1.0.15) | June 27, 2019 |

## Release Types

Microsoft produces **Long Term Support (LTS)** and **Current** releases, which are defined as:

* **LTS** releases are designed for long-term support. They included features and components that have been stabilized, requiring few updates over a longer support release lifetime. These releases are a good choice for hosting applications that you do not intend to update.
* **Current** releases include new features that may undergo future change based on feedback. These releases are a good choice for applications in active development, giving you access to the latest features and improvements. You need to upgrade to later .NET Core releases more often to stay in support.

Both types of releases receive critical fixes throughout their lifecycle, for security, reliability, or to add support for new operating system versions. You must stay up-to-date with the latest patches to qualify for support.

## Release Support Policies

.NET Core releases are supported according to the following policies.

### Long Term Support (LTS) releases

LTS releases are supported for the following timeframe, whichever is longer:

* Three years after initial release.
* One year after a subsequent **LTS** release.

Note: .NET Core 1.x was released under an earlier definition of LTS. See: [.NET Core 1.x "shorter" LTS definition](https://github.com/dotnet/core/blob/e2f22a7106860c0e5dc98bb36dc648a779944ad5/microsoft-support.md#long-term-support-lts-releases).

### Current releases

Current releases are supported for the following timeframe:

* Three months after a subsequent **Current** or **LTS** release

### Maintenance releases

Maintenance releases are in the last stage of the lifecycle . During Maintenance, a release will still receive security updates. The length of Maintenance time is determined by the type of release it was previously; as described in the above section.

### End of support

End of support refers to the date when Microsoft no longer provides fixes, updates, or online technical assistance. As this date nears, make sure you have the latest available update\* installed. Without Microsoft support, you will no longer receive security updates that can help protect your machine from harmful viruses, spyware, and other malicious software that can steal your personal information.

\* Updates are cumulative, with each update built upon all of the updates that preceded it. A device needs to install the latest update to remain supported. Updates may include new features, fixes (security and/or non-security), or a combination of both. Not all features in an update will work on all devices. Update availability may vary, for example by country, region, network connectivity, or hardware capabilities (including, for example, free disk space).

### Out of support .NET Core releases

|  Version  |  End of Support |
| -- | -- |
| [.NET Core 2.0](https://blogs.msdn.microsoft.com/dotnet/2017/08/14/announcing-net-core-2-0/) | October 1, 2018 |
