# .NET 7 - Supported OS versions

[.NET 7](README.md) is a [Standard Term Support (STS)](../../release-policies.md) release and [is supported](../../support.md) on multiple operating systems per their lifecycle policy.

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
[tvOS][8]                       |                              | Arm64              | [Lifecycle][9]     |

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
[SUSE Enterprise Linux][20]     | 15.5, 15.4                   | Arm64, x64         | [Lifecycle][21]    |
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
[Windows][26]                   | 11 23H2, 10 22H2, 11 22H2, 10 21H2 (E), 10 21H2 (IoT), 11 21H2 (E), 10 1809 (E), 10 1607 (E) | Arm64, x64, x86    | [Lifecycle][27]    |
[Windows Server][28]            | 23H2, 2022, 2019, 2016       | x64, x86           | [Lifecycle][29]    |
[Windows Server Core][30]       | 2022, 2019, 2016             | x64, x86           | [Lifecycle][31]    |

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
glibc                    | 2.23     | Arm64              | Ubuntu 16.04       |
glibc                    | 2.27     | Arm32              | Ubuntu 18.04       |
musl                     | 1.2.2    | Arm64, x64         | Alpine 3.15        |

Note: Microsoft-provided portable Arm32 glibc builds are supported on distro versions with a [Y2038 incompatible glibc](https://github.com/dotnet/core/discussions/9285) or a Y2038 compatible glibc with [_TIME_BITS](https://www.gnu.org/software/libc/manual/html_node/Feature-Test-Macros.html) set to 32-bit, for example Debian 12, Ubuntu 22.04, and lower versions.

## Notes

* The [QEMU](https://www.qemu.org/) emulator is not supported to run .NET apps. QEMU is used, for example, to emulate Arm64 containers on x64, and vice versa.

## Out of support OS versions

Support for the following operating system versions has ended.

OS                              | Version                      | End of Life        |
--------------------------------|------------------------------|--------------------|
Alpine                          | 3.16                         | [2024-05-23](https://alpinelinux.org/posts/Alpine-3.16.9-3.17.7-3.18.6-released.html) |
Alpine                          | 3.15                         | [2023-11-01](https://alpinelinux.org/posts/Alpine-3.15.10-3.16.7-3.17.5-3.18.3-released.html) |
Android                         | 11                           | 2024-02-05         |
Android                         | 10                           | 2023-03-06         |
Debian                          | 10                           | [2022-09-10](https://www.debian.org/News/2022/20220910) |
Fedora                          | 38                           | 2024-05-21         |
Fedora                          | 37                           | 2023-12-05         |
Fedora                          | 36                           | 2023-05-16         |
Fedora                          | 35                           | 2022-12-13         |
iOS                             | 12                           | [2023-01-23](https://support.apple.com/HT209084) |
iPadOS                          | 12                           | -                  |
macOS                           | 11                           | [2023-09-26](https://support.apple.com/HT211896) |
macOS                           | 10.15                        | [2022-09-12](https://support.apple.com/HT210642) |
openSUSE Leap                   | 15.4                         | 2023-12-07         |
openSUSE Leap                   | 15.3                         | 2022-12-31         |
SUSE Enterprise Linux           | 12.5                         | 2024-10-31         |
SUSE Enterprise Linux           | 15.3                         | 2022-12-31         |
SUSE Enterprise Linux           | 12.4                         | 2020-06-30         |
SUSE Enterprise Linux           | 12.3                         | 2019-06-30         |
SUSE Enterprise Linux           | 12.2                         | 2018-03-31         |
tvOS                            | 17                           | -                  |
tvOS                            | 16                           | -                  |
tvOS                            | 15                           | -                  |
tvOS                            | 12                           | -                  |
Ubuntu                          | 23.04                        | 2024-01-20         |
Ubuntu                          | 22.10                        | 2023-07-20         |
Ubuntu                          | 18.04                        | 2023-05-31         |
Windows                         | 10 21H2 (E)                  | [2024-06-11](https://learn.microsoft.com/lifecycle/products/windows-10-enterprise-and-education) |
Windows                         | 11 21H2 (W)                  | [2023-10-10](https://learn.microsoft.com/windows/release-health/windows11-release-information) |
Windows                         | 10 21H2 (W)                  | [2023-06-13](https://learn.microsoft.com/windows/release-health/release-information) |
Windows                         | 10 20H2 (E)                  | [2023-05-09](https://learn.microsoft.com/windows/release-health/status-windows-10-20h2) |
Windows                         | 8.1                          | [2023-01-10](https://learn.microsoft.com/lifecycle/products/windows-81) |
Windows                         | 10 21H1                      | [2022-12-13](https://learn.microsoft.com/windows/release-health/status-windows-10-21h1) |
Windows                         | 7 SP1                        | [2020-01-14](https://learn.microsoft.com/lifecycle/products/windows-7) |
Windows Server                  | 2012-R2                      | [2023-10-10](https://learn.microsoft.com/lifecycle/products/windows-server-2012-r2) |
Windows Server                  | 2012                         | [2023-10-10](https://learn.microsoft.com/lifecycle/products/windows-server-2012) |
