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

Note: Microsoft-provided portable Arm32 glibc builds are supported on distro versions with a [Y2038 incompatible glibc](https://github.com/dotnet/core/discussions/9285)or a Y2038 compatible glibc with [_TIME_BITS](https://www.gnu.org/software/libc/manual/html_node/Feature-Test-Macros.html) set to 32-bit, for example Debian 12, Ubuntu 22.04, and lower versions.

## Notes

* The [QEMU](https://www.qemu.org/) emulator is not supported to run .NET apps. QEMU is used, for example, to emulate Arm64 containers on x64, and vice versa.

## Out of support OS versions

Support for the following operating system versions has ended.

OS                              | Version                      | End of Life        |
--------------------------------|------------------------------|--------------------|
SUSE Enterprise Linux           | 12.5                         | 10/31/2024         |
Windows                         | 10 21H2 (E)                  | [06/11/2024](https://learn.microsoft.com/lifecycle/products/windows-10-enterprise-and-education) |
Alpine                          | 3.16                         | [05/23/2024](https://alpinelinux.org/posts/Alpine-3.16.9-3.17.7-3.18.6-released.html) |
Fedora                          | 38                           | 05/21/2024         |
Android                         | 11                           | 02/05/2024         |
Ubuntu                          | 23.04                        | 01/20/2024         |
openSUSE Leap                   | 15.4                         | 12/07/2023         |
Fedora                          | 37                           | 12/05/2023         |
Alpine                          | 3.15                         | [11/01/2023](https://alpinelinux.org/posts/Alpine-3.15.10-3.16.7-3.17.5-3.18.3-released.html) |
Windows                         | 11 21H2 (W)                  | [10/10/2023](https://learn.microsoft.com/windows/release-health/windows11-release-information) |
Windows Server                  | 2012-R2                      | [10/10/2023](https://learn.microsoft.com/lifecycle/products/windows-server-2012-r2) |
Windows Server                  | 2012                         | [10/10/2023](https://learn.microsoft.com/lifecycle/products/windows-server-2012) |
macOS                           | 11                           | [09/26/2023](https://support.apple.com/HT211896) |
Ubuntu                          | 22.10                        | 07/20/2023         |
Windows                         | 10 21H2 (W)                  | [06/13/2023](https://learn.microsoft.com/windows/release-health/release-information) |
Ubuntu                          | 18.04                        | 05/31/2023         |
Fedora                          | 36                           | 05/16/2023         |
Windows                         | 10 20H2 (E)                  | [05/09/2023](https://learn.microsoft.com/windows/release-health/status-windows-10-20h2) |
Android                         | 10                           | 03/06/2023         |
iOS                             | 12                           | [01/23/2023](https://support.apple.com/HT209084) |
Windows                         | 8.1                          | [01/10/2023](https://learn.microsoft.com/lifecycle/products/windows-81) |
openSUSE Leap                   | 15.3                         | 12/31/2022         |
SUSE Enterprise Linux           | 15.3                         | 12/31/2022         |
Fedora                          | 35                           | 12/13/2022         |
Windows                         | 10 21H1                      | [12/13/2022](https://learn.microsoft.com/windows/release-health/status-windows-10-21h1) |
macOS                           | 10.15                        | [09/12/2022](https://support.apple.com/HT210642) |
Debian                          | 10                           | [09/10/2022](https://www.debian.org/News/2022/20220910) |
SUSE Enterprise Linux           | 12.4                         | 06/30/2020         |
Windows                         | 7 SP1                        | [01/14/2020](https://learn.microsoft.com/lifecycle/products/windows-7) |
SUSE Enterprise Linux           | 12.3                         | 06/30/2019         |
SUSE Enterprise Linux           | 12.2                         | 03/31/2018         |
iPadOS                          | 12                           | -                  |
tvOS                            | 17                           | -                  |
tvOS                            | 16                           | -                  |
tvOS                            | 15                           | -                  |
tvOS                            | 12                           | -                  |

17.7-3.18.6-released.html) |
Windows                         | 10 21H2 (E)                  | [06/11/2024](https://learn.microsoft.com/lifecycle/products/windows-10-enterprise-and-education) |
Red Hat Enterprise Linux        | 7                            | 06/30/2024         |
Ubuntu                          | 23.10                        | 07/11/2024         |
Debian                          | 11                           | [07/31/2024](https://www.debian.org/News/2024/2024021002) |
Windows                         | 11 22H2 (W)                  | [10/08/2024](https://learn.microsoft.com/windows/release-health/windows11-release-information) |
Windows                         | 11 21H2 (E)                  | [10/08/2024](https://learn.microsoft.com/windows/release-health/windows11-release-information) |
SUSE Enterprise Linux           | 12.5                         | 10/31/2024         |
Fedora                          | 39                           | 11/12/2024         |
Alpine                          | 3.17                         | [11/22/2024](https://alpinelinux.org/posts/Alpine-3.16.9-3.17.7-3.18.6-released.html) |
openSUSE Leap                   | 15.5                         | 12/31/2024         |
Ubuntu                          | 20.04                        | 04/02/2025         |
Alpine                          | 3.18                         | [05/09/2025](https://alpinelinux.org/posts/Alpine-3.16.9-3.17.7-3.18.6-released.html) |
Fedora                          | 40                           | 05/13/2025         |
Windows                         | 11 22H2 (E)                  | [10/14/2025](https://learn.microsoft.com/windows/release-health/windows11-release-information) |
Windows                         | 10 22H2                      | [10/14/2025](https://learn.microsoft.com/windows/release-health/release-information) |
Windows Server                  | 23H2                         | [10/24/2025](https://learn.microsoft.com/lifecycle/products/windows-server-annual-channel) |
Alpine                          | 3.19                         | [11/01/2025](https://alpinelinux.org/posts/Alpine-3.19.1-released.html) |
Windows                         | 11 23H2 (W)                  | [11/11/2025](https://learn.microsoft.com/windows/release-health/windows11-release-information) |
openSUSE Leap                   | 15.6                         | 12/31/2025         |
Alpine                          | 3.20                         | [04/01/2026](https://alpinelinux.org/posts/Alpine-3.20.0-released.html) |
Debian                          | 12                           | [06/10/2026](https://www.debian.org/News/2024/20240210) |
Windows                         | 10 1607 (E)                  | [10/13/2026](https://learn.microsoft.com/windows/release-health/supported-versions-windows-client#enterprise-and-iot-enterprise-ltsbltsc-editions) |
Windows                         | 11 23H2 (E)                  | [11/10/2026](https://learn.microsoft.com/windows/release-health/windows11-release-information) |
Windows                         | 10 21H2 (E)                  | [01/12/2027](https://learn.microsoft.com/windows/release-health/release-information#enterprise-and-iot-enterprise-ltsbltsc-editions) |
Windows Server                  | 2016                         | [01/12/2027](https://learn.microsoft.com/windows/release-health/windows-server-release-info) |
Windows Server Core             | 2016                         | [01/12/2027](https://learn.microsoft.com/virtualization/windowscontainers/deploy-containers/base-image-lifecycle) |
Ubuntu                          | 22.04                        | 04/01/2027         |
Nano Server                     | 2019                         | [01/09/2029](https://learn.microsoft.com/windows/release-health/windows-server-release-info) |
Windows                         | 10 1809 (E)                  | [01/09/2029](https://learn.microsoft.com/windows/release-health/supported-versions-windows-client#enterprise-and-iot-enterprise-ltsbltsc-editions) |
Windows Server                  | 2019                         | [01/09/2029](https://learn.microsoft.com/windows/release-health/windows-server-release-info) |
Windows Server Core             | 2019                         | [01/09/2029](https://learn.microsoft.com/windows/release-health/windows-server-release-info) |
Ubuntu                          | 24.04                        | 04/25/2029         |
Red Hat Enterprise Linux        | 8                            | 05/31/2029         |
Nano Server                     | 2022                         | [10/14/2031](https://learn.microsoft.com/windows/release-health/windows-server-release-info) |
Windows Server                  | 2022                         | [10/14/2031](https://learn.microsoft.com/windows/release-health/windows-server-release-info) |
Windows Server Core             | 2022                         | [10/14/2031](https://learn.microsoft.com/windows/release-health/windows-server-release-info) |
Windows                         | 10 21H2 (IoT)                | [01/13/2032](https://learn.microsoft.com/windows/release-health/release-information#enterprise-and-iot-enterprise-ltsbltsc-editions) |
Red Hat Enterprise Linux        | 9                            | 05/31/2032         |
Android                         | 14                           | 12/31/9999         |
Android                         | 13                           | 12/31/9999         |
Android                         | 12.1                         | [12/31/9999](https://developer.android.com/about/versions/12/12L) |
Android                         | 12                           | 12/31/9999         |
iOS                             | 17                           | [12/31/9999](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes) |
iOS                             | 16                           | [12/31/9999](https://support.apple.com/HT213407) |
iOS                             | 15                           | [12/31/9999](https://support.apple.com/HT212788) |
iPadOS                          | 17                           | [12/31/9999](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes) |
iPadOS                          | 16                           | [12/31/9999](https://developer.apple.com/documentation/ios-ipados-release-notes/ipados-16-release-notes) |
iPadOS                          | 15                           | [12/31/9999](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-15-release-notes) |
macOS                           | 14                           | [12/31/9999](https://support.apple.com/HT213895) |
macOS                           | 13                           | [12/31/9999](https://support.apple.com/HT213268) |
macOS                           | 12                           | [12/31/9999](https://support.apple.com/HT212585) |
SUSE Enterprise Linux           | 15.5                         | 12/31/9999         |
