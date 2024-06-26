# .NET 8 - Supported OS versions

[.NET 8](README.md) is a [Long Term Support (LTS)](../../release-policies.md) release and [is supported](../../support.md) on multiple operating systems per their lifecycle policy.

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
[tvOS][8]                       | 17, 16, 15, 14, 13, 12.2     | Arm64              | [Lifecycle][9]     |

Notes:

* iOS: iOS 12.2 is used as the minimum SDK target.
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
[Red Hat Enterprise Linux][18]  | 9, 8                         | Arm64, ppc64le, s390x, x64 | [Lifecycle][19]    |
[SUSE Enterprise Linux][20]     | 15.5                         | Arm64, x64         | [Lifecycle][21]    |
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
[Windows][26]                   | 11 23H2, 11 22H2, 10 22H2, 11 21H2 (E), 10 21H2 (E), 10 21H2 (IoT), 10 1809 (E), 10 1607 (E) | Arm64, x64, x86    | [Lifecycle][27]    |
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

Microsoft-provided [portable Linux builds](../../linux.md) define minimum compatibility primarily via libc version.

Libc                     | Version  | Architectures      | Source             |
-------------------------|----------|--------------------|--------------------|
glibc                    | 2.23     | Arm64, x64         | Ubuntu 16.04       |
glibc                    | 2.35     | Arm32              | Ubuntu 22.04       |
musl                     | 1.2.2    | Arm32, Arm64, x64  | Alpine 3.13        |

Note: Microsoft-provided portable Arm32 glibc builds are supported on distro versions with a [Y2038 incompatible glibc](https://github.com/dotnet/core/discussions/9285) or a Y2038 compatible glibc with [_TIME_BITS](https://www.gnu.org/software/libc/manual/html_node/Feature-Test-Macros.html) set to 32-bit, for example Debian 12, Ubuntu 22.04, and lower versions.

## Notes

* The [QEMU](https://www.qemu.org/) emulator is not supported to run .NET apps. QEMU is used, for example, to emulate Arm64 containers on x64, and vice versa.

## Out of support OS versions

Support for the following operating system versions has ended.

OS                              | Version                      | End of Life        |
--------------------------------|------------------------------|--------------------|
Alpine                          | 3.16                         | [2024-05-23](https://alpinelinux.org/posts/Alpine-3.16.9-3.17.7-3.18.6-released.html) |
Android                         | 11                           | 2024-02-05         |
Fedora                          | 38                           | 2024-05-21         |
Fedora                          | 37                           | 2023-12-05         |
Ubuntu                          | 23.04                        | 2024-01-20         |
Windows                         | 10 21H2 (E)                  | [2024-06-11](https://learn.microsoft.com/lifecycle/products/windows-10-enterprise-and-education) |
