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

OS                              | Version                      | Architectures      | Lifecycle          |
--------------------------------|------------------------------|--------------------|--------------------|
[iOS][2]                        | 17, 16, 15                   | Arm64              | N/A                |
[iPadOS][3]                     | 17, 16, 15                   | Arm64              | N/A                |
[macOS][4]                      | 14, 13, 12                   | Arm64, x64         | N/A                |
[tvOS][5]                       | 17, 16, 15, 14, 13, 12.2     | Arm64              | N/A                |

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
[Debian][8]                     | 12                           | Arm32, Arm64, x64  | [Lifecycle][9]     |
[Fedora][10]                    | 40                           | Arm32, Arm64, x64  | [Lifecycle][11]    |
[openSUSE Leap][12]             | 15.6, 15.5                   | Arm64, x64         | [Lifecycle][13]    |
[Red Hat Enterprise Linux][14]  | 9, 8                         | Arm64, ppc64le, s390x, x64 | [Lifecycle][15]    |
[SUSE Enterprise Linux][16]     | 15.5                         | Arm64, x64         | [Lifecycle][17]    |
[Ubuntu][18]                    | 24.04, 22.04, 20.04          | Arm32, Arm64, x64  | [Lifecycle][19]    |

Notes:

* Red Hat Enterprise Linux: Red Hat family distributions are supported per [Linux compatibility and support](../../linux-support.md).

[6]: https://alpinelinux.org/
[7]: https://alpinelinux.org/releases/
[8]: https://www.debian.org/
[9]: https://wiki.debian.org/DebianReleases
[10]: https://fedoraproject.org/
[11]: https://fedoraproject.org/wiki/End_of_life
[12]: https://www.opensuse.org/
[13]: https://en.opensuse.org/Lifetime
[14]: https://access.redhat.com/
[15]: https://access.redhat.com/support/policy/updates/errata/
[16]: https://www.suse.com/
[17]: https://www.suse.com/lifecycle/
[18]: https://ubuntu.com/
[19]: https://wiki.ubuntu.com/Releases

## Windows

OS                              | Version                      | Architectures      | Lifecycle          |
--------------------------------|------------------------------|--------------------|--------------------|
[Nano Server][20]               | 2022, 2019                   | x64                | [Lifecycle][21]    |
[Windows][22]                   | 11 23H2, 11 22H2, 10 22H2, 11 21H2 (E), 10 21H2 (E), 10 21H2 (IoT), 10 1809 (E), 10 1607 (E) | Arm64, x64, x86    | [Lifecycle][23]    |
[Windows Server][24]            | 23H2, 2022, 2019, 2016, 2012-R2, 2012 | x64, x86           | [Lifecycle][25]    |
[Windows Server Core][26]       | 23H2, 2022, 2019, 2016       | x64, x86           | [Lifecycle][27]    |

Notes:

* Windows: The x64 emulator is supported on Windows 11 Arm64.
* Windows Server: Windows Server 2012 and 2012 R2 are supported with [Extended Security Updates](https://learn.microsoft.com/windows-server/get-started/extended-security-updates-overview).

[20]: https://learn.microsoft.com/virtualization/windowscontainers/manage-containers/container-base-images
[21]: https://learn.microsoft.com/windows-server/get-started/windows-server-release-info
[22]: https://www.microsoft.com/windows/
[23]: https://support.microsoft.com/help/13853/windows-lifecycle-fact-sheet
[24]: https://www.microsoft.com/windows-server
[25]: https://learn.microsoft.com/windows-server/get-started/windows-server-release-info
[26]: https://learn.microsoft.com/virtualization/windowscontainers/manage-containers/container-base-images
[27]: https://learn.microsoft.com/windows-server/get-started/windows-server-release-info

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
