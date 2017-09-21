# .NET Core Support

## NET Core Support Lifecycle

Every Microsoft product has a lifecycle. The lifecycle begins when a product is released and ends when it's no longer supported. Knowing key dates in this lifecycle helps you make informed decisions about when to upgrade or make other changes to your software. This product is governed by the [Microsoft Modern Lifecycle](https://support.microsoft.com/en-us/help/30881/modern-lifecycle-policy)

The .NET Core support lifecycle offers 3 years of support for each Major and Minor release where:

* Major releases are any release which updates the Major version number. For example, 1.0 is updated to 2.0.
* Minor releases are any release which updates the Minor version number. For example, 1.0.0 is updated to 1.1.0.
* Patch releases are any release which update the Patch number. For example, 1.0.1 is updated to 1.0.2.

## What releases qualify for servicing and how do updates effect servicing qualifications?</h2>

Within the 3-year support lifecycle, systems must remain current on released patch updates for the Major.Minor release.

Customers can choose to use the Long Term Support (LTS) releases or Current releases. LTS releases will typically be Major releases (eg 1.0) and will only receive critical fixes throughout their lifecycle. Current releases will be Minor releases (eg 1.1.0) and receive these same fixes and will also be updated with compatible innovations and features.

### Long Term Support (LTS) releases are -

* Supported for three years after the general availability date of a LTS release
* Or one year after the general availability of a subsequent LTS release

### Current releases are -

* Supported within the same three-year window as the parent LTS release
* Supported for three months after the general availability of a subsequent Current release
* And one year after the general availability of a subsequent LTS release

### How do the different support tracks work?

Customers using LTS will need the latest patch update installed to qualify for support. If a system is running 1.0 and 1.0.1 has been released, 1.0.1 will need to be installed as a first step. Once a patch update has been installed applications will begin using the update by default. LTS releases will be supported for 3-years after general availability, or 12 months after the next LTS release ships, whichever is shorter.

In addition to staying current with the latest patch update, customers using Current will need to update as new minor versions are released. The latest released minor version will become the minimum serviceable baseline 3 months after release. For example, after 1.2 releases systems running version 1.1 will have 3 months to update to 1.2 to remain eligible for support. Applications do not automatically begin using the new minor update.

### .NET Core Release Lifecycles

This table tracks release dates and end of support dates for .NET Core versions.


|  Version  |  Release Date  | Latest Patch Version | Support Level | End of Support |
| -- | -- | -- | -- | -- |
| .NET Core 2.0 | August 14, 2017 | 2.0.0 | Current | August 14, 2020 or 3 months after next Current release or 12 months after next LTS release, whichever is shorter. |
| .NET Core 1.1 | November 16, 2016 | 1.1.4 | LTS* | June 27 2019 or 12 months after next LTS release, whichever is shorter. |
| .NET Core 1.0 | June 27, 2016 | 1.0.7 | LTS | June 27 2019 or 12 months after next LTS release, whichever is shorter. |
| .NET Core 1.0.0 RC2 | May 16, 2016 | n/a | n/a | September 27, 2016 |
| .NET Core 1.0.0 RC1 | February 15, 2016 | n/a | n/a | July 16, 2016 |

\* .NET Core 1.1 is adopted into the 1.0 LTS lifecycle and will share the same end of support dates.

### End of support

End of support refers to the date when Microsoft no longer provides fixes, updates, or online technical assistance. This is the time to make sure you have the latest available update* installed. Without Microsoft support, you will no longer receive security updates that can help protect your machine from harmful viruses, spyware, and other malicious software that can steal your personal information.

\* Updates are cumulative, with each update built upon all of the updates that preceded it. A device needs to install the latest update to remain supported. Updates may include new features, fixes (security and/or non-security), or a combination of both. Not all features in an update will work on all devices. Update availability may vary, for example by country, region, network connectivity, or hardware capabilities (including, e.g., free disk space).

### What Operating System versions are supported to run .NET Core applications?
    
.NET Core is supported across several operating systems and versions. The [.NET Core OS Lifecycle Policy](https://github.com/dotnet/core/blob/master/os-lifecycle-policy.md) provides current details on operating systems support policies and versions.