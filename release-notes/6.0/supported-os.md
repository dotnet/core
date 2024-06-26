# .NET 6 - Supported OS versions

[.NET 6](README.md) is a [Long Term Support (LTS)](../../release-policies.md) release and [is supported](../../support.md) on multiple operating systems per their lifecycle policy.

This file is generated from [supported-os.json](supported-os.json) and is based on support information from [endoflife.date](https://endoflife.date/).

## Android

OS                              | Version                      | Architectures      | Lifecycle          |
--------------------------------|------------------------------|--------------------|--------------------|
[Android][0]                    | 14, 13, 12.1, 12             | Arm32, Arm64, x64  | [Lifecycle][1]     |

Notes:

* Android: API 21 is used as the minimum SDK target.

[0]: https://www.android.com/
[1]: https://support.google.com/android

## Apple

OS                              | Version                      | Architectures      | Lifecycle          |
--------------------------------|------------------------------|--------------------|--------------------|
[iOS][2]                        | 17, 16, 15                   | Arm64              | [Lifecycle][3]     |
[iPadOS][4]                     | 17, 16, 15                   | Arm64              | [Lifecycle][5]     |
[macOS][6]                      | 14, 13, 12                   | Arm64, x64         | [Lifecycle][7]     |
[tvOS][8]                       | 17, 16, 15                   | Arm64              | [Lifecycle][9]     |

Notes:

* iOS: iOS 10.0 is used as the minimum SDK target.
* macOS: The iOS and tvOS simulators are supported on macOS Arm64 and x64.
* macOS: The x64 emulator (Rosetta 2) is supported on macOS Arm64.
* macOS: Mac Catalyst apps are supported on macOS Arm64 and x64.

[2]: https://developer.apple.com/ios/
[3]: https://support.apple.com/ios/
[4]: https://developer.apple.com/ipados/
[5]: https://support.apple.com/ipados/
[6]: https://developer.apple.com/macos/
[7]: https://support.apple.com/macos/
[8]: https://developer.apple.com/tvos/
[9]: https://support.apple.com/apple-tv/

## Linux

OS                              | Version                      | Architectures      | Lifecycle          |
--------------------------------|------------------------------|--------------------|--------------------|
[Alpine][10]                    | 3.20, 3.19, 3.18, 3.17       | Arm32, Arm64, x64  | [Lifecycle][11]    |
[Debian][12]                    | 12, 11                       | Arm32, Arm64, x64  | [Lifecycle][13]    |
[Fedora][14]                    | 40, 39                       | Arm32, Arm64, x64  | [Lifecycle][15]    |
[openSUSE Leap][16]             | 15.6, 15.5                   | Arm64, x64         | [Lifecycle][17]    |
[Red Hat Enterprise Linux][18]  | 9, 8, 7                      | Arm64, x64         | [Lifecycle][19]    |
[SUSE Enterprise Linux][20]     | 15.5, 12.5                   | Arm64, x64         | [Lifecycle][21]    |
[Ubuntu][22]                    | 24.04, 23.10, 22.04, 20.04   | Arm32, Arm64, x64  | [Lifecycle][23]    |

Notes:

* Red Hat Enterprise Linux: Red Hat family distributions are supported per [Linux compatibility and support](../../linux-support.md).

[10]: https://alpinelinux.org/
[11]: https://alpinelinux.org/releases/
[12]: https://www.debian.org/
[13]: https://wiki.debian.org/DebianReleases
[14]: https://fedoraproject.org/
[15]: https://fedoraproject.org/wiki/End_of_life
[16]: https://www.opensuse.org/
[17]: https://en.opensuse.org/Lifetime
[18]: https://access.redhat.com/
[19]: https://access.redhat.com/support/policy/updates/errata/
[20]: https://www.suse.com/
[21]: https://www.suse.com/lifecycle/
[22]: https://ubuntu.com/
[23]: https://wiki.ubuntu.com/Releases

## Windows

OS                              | Version                      | Architectures      | Lifecycle          |
--------------------------------|------------------------------|--------------------|--------------------|
[Nano Server][24]               | 2022, 2019                   | x64                | [Lifecycle][25]    |
[Windows][26]                   | 11 23H2, 11 22H2, 10 22H2, 11 21H2 (E), 10 21H2 (E), 10 21H2 (IoT), 10 20H2 (E), 10 1809 (E), 10 1607 (E) | Arm64, x64, x86    | [Lifecycle][27]    |
[Windows Server][28]            | 23H2, 2022, 2019, 2016, 2012-R2, 2012 | x64, x86           | [Lifecycle][29]    |
[Windows Server Core][30]       | 23H2, 2022, 2019, 2016, 2012 | x64, x86           | [Lifecycle][31]    |

Notes:

* Windows: The x64 emulator is supported on Windows 11 Arm64.
* Windows Server: Windows Server 2012 and 2012 R2 are supported with [Extended Security Updates](https://learn.microsoft.com/windows-server/get-started/extended-security-updates-overview).

[24]: https://learn.microsoft.com/virtualization/windowscontainers/manage-containers/container-base-images
[25]: https://learn.microsoft.com/windows-server/get-started/windows-server-release-info
[26]: https://www.microsoft.com/windows/
[27]: https://support.microsoft.com/help/13853/windows-lifecycle-fact-sheet
[28]: https://www.microsoft.com/windows-server
[29]: https://learn.microsoft.com/windows-server/get-started/windows-server-release-info
[30]: https://learn.microsoft.com/virtualization/windowscontainers/manage-containers/container-base-images
[31]: https://learn.microsoft.com/windows-server/get-started/windows-server-release-info

## Linux compatibility

Microsoft-provided [portable](../../linux-support.md) Linux builds define [minimum compatibility](/linux-support.md) primarily via libc version.

Libc                     | Version  | Architectures      | Source             |
-------------------------|----------|--------------------|--------------------|
glibc                    | 2.17     | x64                | CentOS 7           |
glibc                    | 2.23     | Arm64, Arm32       | Ubuntu 16.04       |
musl                     | 1.2.2    | Arm64, x64         | Alpine 3.13        |

Note: Microsoft-provided portable Arm32 glibc builds are supported on distro versions with a [Y2038 incompatible glibc](https://github.com/dotnet/core/discussions/9285)or a Y2038 compatible glibc with [_TIME_BITS](https://www.gnu.org/software/libc/manual/html_node/Feature-Test-Macros.html) set to 32-bit, for example Debian 12, Ubuntu 22.04, and lower versions.

## Notes

* The [QEMU](https://www.qemu.org/) emulator is not supported to run .NET apps. QEMU is used, for example, to emulate Arm64 containers on x64, and vice versa.

## Out of support OS versions

Support for the following operating system versions has ended.

OS                              | Version                      | End of Life        |
--------------------------------|------------------------------|--------------------|
iPadOS                          | 12                           | -                  |
tvOS                            | 12                           | -                  |
SUSE Enterprise Linux           | 12.2                         | 03/31/2018         |
SUSE Enterprise Linux           | 12.3                         | 06/30/2019         |
Windows                         | 7-sp1                        | [01/14/2020](https://learn.microsoft.com/lifecycle/products/windows-7) |
SUSE Enterprise Linux           | 12.4                         | 06/30/2020         |
Fedora                          | 33                           | 11/30/2021         |
Nano Server                     | 2004                         | [12/14/2021](https://learn.microsoft.com/lifecycle/announcements/windows-server-version-2004-end-of-servicing) |
Windows                         | 10-2004                      | [12/14/2021](https://learn.microsoft.com/lifecycle/announcements/windows-10-version-2004-end-of-servicing) |
Windows Server                  | 2004                         | [12/14/2021](https://learn.microsoft.com/lifecycle/announcements/windows-server-version-2004-end-of-servicing) |
Windows Server Core             | 2004                         | [12/14/2021](https://learn.microsoft.com/lifecycle/announcements/windows-server-version-2004-end-of-servicing) |
SUSE Enterprise Linux           | 15.2                         | 12/31/2021         |
Android                         | 9                            | [01/01/2022](https://developer.android.com/about/versions/pie) |
openSUSE Leap                   | 15.2                         | 01/04/2022         |
Windows Server Core             | 1607                         | [01/11/2022](https://learn.microsoft.com/virtualization/windowscontainers/deploy-containers/base-image-lifecycle) |
Ubuntu                          | 21.04                        | 01/20/2022         |
Alpine                          | 3.12                         | [05/01/2022](https://alpinelinux.org/posts/Alpine-3.12.12-3.13.10-3.14.6-3.15.4-released.html) |
Windows                         | 10-20h2-w                    | [05/10/2022](https://learn.microsoft.com/windows/release-health/status-windows-10-20h2) |
Windows                         | 10-1909-e                    | [05/10/2022](https://learn.microsoft.com/lifecycle/announcements/windows-10-1909-enterprise-education-eos) |
Fedora                          | 34                           | 06/07/2022         |
Ubuntu                          | 21.10                        | 07/14/2022         |
Nano Server                     | 20H2                         | [08/09/2022](https://learn.microsoft.com/lifecycle/announcements/windows-server-20h2-retiring) |
Windows Server                  | 20H2                         | [08/09/2022](https://learn.microsoft.com/lifecycle/announcements/windows-server-20h2-retiring) |
Windows Server Core             | 20H2                         | [08/09/2022](https://learn.microsoft.com/lifecycle/announcements/windows-server-20h2-retiring) |
Debian                          | 10                           | [09/10/2022](https://www.debian.org/News/2022/20220910) |
macOS                           | 10.15                        | [09/12/2022](https://support.apple.com/HT210642) |
Alpine                          | 3.13                         | [11/01/2022](https://alpinelinux.org/posts/Alpine-3.12.12-3.13.10-3.14.6-3.15.4-released.html) |
Fedora                          | 35                           | 12/13/2022         |
Windows                         | 10-21h1                      | [12/13/2022](https://learn.microsoft.com/windows/release-health/status-windows-10-21h1) |
openSUSE Leap                   | 15.3                         | 12/31/2022         |
SUSE Enterprise Linux           | 15.3                         | 12/31/2022         |
Windows                         | 8.1                          | [01/10/2023](https://learn.microsoft.com/lifecycle/products/windows-81) |
iOS                             | 12                           | [01/23/2023](https://support.apple.com/HT209084) |
Android                         | 10                           | 03/06/2023         |
Alpine                          | 3.14                         | [05/01/2023](https://alpinelinux.org/posts/Alpine-3.14.10-3.15.8-3.16.5-released.html) |
Windows                         | 10-20h2-e                    | [05/09/2023](https://learn.microsoft.com/windows/release-health/status-windows-10-20h2) |
Fedora                          | 36                           | 05/16/2023         |
Ubuntu                          | 18.04                        | 05/31/2023         |
Windows                         | 10-21h2-w                    | [06/13/2023](https://learn.microsoft.com/windows/release-health/release-information) |
Ubuntu                          | 22.10                        | 07/20/2023         |
macOS                           | 11                           | [09/26/2023](https://support.apple.com/HT211896) |
Windows                         | 11-21h2-w                    | [10/10/2023](https://learn.microsoft.com/windows/release-health/windows11-release-information) |
Alpine                          | 3.15                         | [11/01/2023](https://alpinelinux.org/posts/Alpine-3.15.10-3.16.7-3.17.5-3.18.3-released.html) |
Fedora                          | 37                           | 12/05/2023         |
openSUSE Leap                   | 15.4                         | 12/07/2023         |
SUSE Enterprise Linux           | 15.4                         | 12/31/2023         |
Ubuntu                          | 23.04                        | 01/20/2024         |
Android                         | 11                           | 02/05/2024         |
Fedora                          | 38                           | 05/21/2024         |
Alpine                          | 3.16                         | [05/23/2024](https://alpinelinux.org/posts/Alpine-3.16.9-3.17.7-3.18.6-released.html) |
Windows                         | 10-21h2-e                    | [06/11/2024](https://learn.microsoft.com/lifecycle/products/windows-10-enterprise-and-education) |

