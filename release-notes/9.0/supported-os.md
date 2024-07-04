# .NET 9 - Supported OS versions

[.NET 9](README.md) is a [Standard Term Support (STS)](../../release-policies.md) release and [is supported](../../support.md) on multiple operating systems per their lifecycle policy.

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

OS                              | Version                      | Architectures      |
--------------------------------|------------------------------|--------------------|
[iOS][2]                        | 17, 16, 15                   | Arm64              |
[iPadOS][3]                     | 17, 16, 15                   | Arm64              |
[macOS][4]                      | 14, 13, 12                   | Arm64, x64         |
[tvOS][5]                       | 17, 16, 15, 14, 13, 12.2     | Arm64              |

Notes:

* iOS: iOS 12.2 is used as the minimum SDK target.
* macOS: The iOS and tvOS simulators are supported on macOS Arm64 and x64.
* macOS: The x64 emulator (Rosetta 2) is supported on macOS Arm64.
* macOS: Mac Catalyst apps are supported on macOS Arm64 and x64.

[2]: https://developer.apple.com/ios/
[3]: https://developer.apple.com/ipados/
[4]: https://developer.apple.com/macos/
[5]: https://developer.apple.com/tvos/

## Linux

OS                              | Version                      | Architectures      | Lifecycle          |
--------------------------------|------------------------------|--------------------|--------------------|
[Alpine][6]                     | 3.20, 3.19                   | Arm32, Arm64, x64  | [Lifecycle][7]     |
[CentOS Stream][8]              | 9                            | Arm64, s390x, x64  |
[Debian][9]                     | 12                           | Arm32, Arm64, x64  | [Lifecycle][10]    |
[Fedora][11]                    | 40                           | Arm32, Arm64, x64  | [Lifecycle][12]    |
[openSUSE Leap][13]             | 15.6, 15.5                   | Arm64, x64         | [Lifecycle][14]    |
[Red Hat Enterprise Linux][15]  | 9, 8                         | Arm64, ppc64le, s390x, x64 | [Lifecycle][16]    |
[SUSE Enterprise Linux][17]     | 15.5                         | Arm64, x64         | [Lifecycle][18]    |
[Ubuntu][19]                    | 24.04, 22.04, 20.04          | Arm32, Arm64, x64  | [Lifecycle][20]    |

Notes:

* Red Hat Enterprise Linux: Red Hat family distributions are supported per [Linux compatibility and support](../../linux-support.md).

[6]: https://alpinelinux.org/
[7]: https://alpinelinux.org/releases/
[8]: https://centos.org/
[9]: https://www.debian.org/
[10]: https://wiki.debian.org/DebianReleases
[11]: https://fedoraproject.org/
[12]: https://fedoraproject.org/wiki/End_of_life
[13]: https://www.opensuse.org/
[14]: https://en.opensuse.org/Lifetime
[15]: https://access.redhat.com/
[16]: https://access.redhat.com/support/policy/updates/errata/
[17]: https://www.suse.com/
[18]: https://www.suse.com/lifecycle/
[19]: https://ubuntu.com/
[20]: https://wiki.ubuntu.com/Releases

## Windows

OS                              | Version                      | Architectures      | Lifecycle          |
--------------------------------|------------------------------|--------------------|--------------------|
[Nano Server][21]               | 2022, 2019                   | x64                | [Lifecycle][22]    |
[Windows][23]                   | 11 23H2, 11 22H2, 10 22H2, 11 21H2 (E), 10 21H2 (E), 10 21H2 (IoT), 10 1809 (E), 10 1607 (E) | Arm64, x64, x86    | [Lifecycle][24]    |
[Windows Server][25]            | 23H2, 2022, 2019, 2016, 2012-R2, 2012 | x64, x86           | [Lifecycle][26]    |
[Windows Server Core][27]       | 23H2, 2022, 2019, 2016       | x64, x86           | [Lifecycle][28]    |

Notes:

* Windows: The x64 emulator is supported on Windows 11 Arm64.
* Windows Server: Windows Server 2012 and 2012 R2 are supported with [Extended Security Updates](https://learn.microsoft.com/windows-server/get-started/extended-security-updates-overview).

[21]: https://learn.microsoft.com/virtualization/windowscontainers/manage-containers/container-base-images
[22]: https://learn.microsoft.com/windows-server/get-started/windows-server-release-info
[23]: https://www.microsoft.com/windows/
[24]: https://support.microsoft.com/help/13853/windows-lifecycle-fact-sheet
[25]: https://www.microsoft.com/windows-server
[26]: https://learn.microsoft.com/windows-server/get-started/windows-server-release-info
[27]: https://learn.microsoft.com/virtualization/windowscontainers/manage-containers/container-base-images
[28]: https://learn.microsoft.com/windows-server/get-started/windows-server-release-info

## Linux compatibility

Microsoft-provided [portable Linux builds](../../linux.md) define minimum compatibility primarily via libc version.

Libc                     | Version  | Architectures      | Source             |
-------------------------|----------|--------------------|--------------------|
glibc                    | 2.23     | Arm64, x64         | Ubuntu 16.04       |
glibc                    | 2.35     | Arm32              | Ubuntu 22.04       |
musl                     | 1.2.2    | Arm32, Arm64, x64  | Alpine 3.13        |

Note: Microsoft-provided portable Arm32 glibc builds are supported on distro versions with a [Y2038 compatible glibc](https://github.com/dotnet/core/discussions/9285), for example Debian 12, Ubuntu 22.04, and higher versions.

## Notes

* The [QEMU](https://www.qemu.org/) emulator is not supported to run .NET apps. QEMU is used, for example, to emulate Arm64 containers on x64, and vice versa.

## Out of support OS versions

Support for the following operating system versions has ended.

None currently.
