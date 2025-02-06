# .NET 8.0 - Supported OS versions

Last Updated: 2025/02/03
Support phase: Active

[.NET 8.0](README.md) is an [LTS](../../release-policies.md) release and [is supported](../../support.md) on multiple operating systems per their lifecycle policy.

This file is generated from [supported-os.json](supported-os.json) and is based on support information from [endoflife.date](https://endoflife.date/).

## Android

| OS                            | Versions                    | Architectures         | Lifecycle            |
| ----------------------------- | --------------------------- | --------------------- | -------------------- |
| [Android][0]                  | 15, 14, 13, 12.1, 12        | Arm32, Arm64, x64     | [Lifecycle][1]       |

Notes:

* Android: API 21 is used as the minimum SDK target.

[0]: https://www.android.com/
[1]: https://support.google.com/android

## Apple

| OS                            | Versions                    | Architectures         | Lifecycle            |
| ----------------------------- | --------------------------- | --------------------- | -------------------- |
| [iOS][2]                      | 18, 17                      | Arm64                 | None                 |
| [iPadOS][3]                   | 18, 17                      | Arm64                 | None                 |
| [macOS][4]                    | 15, 14, 13                  | Arm64, x64            | None                 |
| [tvOS][5]                     | 18, 17, 16, 15, 14, 13, 12.2 | Arm64                | None                 |

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

| OS                            | Versions                    | Architectures         | Lifecycle            |
| ----------------------------- | --------------------------- | --------------------- | -------------------- |
| [Alpine][6]                   | 3.21, 3.20, 3.19, 3.18      | Arm32, Arm64, x64     | [Lifecycle][7]       |
| [Azure Linux][8]              | 3.0                         | Arm64, x64            | None                 |
| [CentOS Stream][9]            | 9                           | Arm64, ppc64le, s390x, x64 | [Lifecycle][10] |
| [Debian][11]                  | 12                          | Arm32, Arm64, x64     | [Lifecycle][12]      |
| [Fedora][13]                  | 41, 40                      | Arm32, Arm64, x64     | [Lifecycle][14]      |
| [openSUSE Leap][15]           | 15.6                        | Arm64, x64            | [Lifecycle][16]      |
| [Red Hat Enterprise Linux][17] | 9, 8                       | Arm64, ppc64le, s390x, x64 | [Lifecycle][18] |
| [SUSE Enterprise Linux][19]   | 15.6, 15.5                  | Arm64, x64            | [Lifecycle][20]      |
| [Ubuntu][21]                  | 24.10, 24.04, 22.04, 20.04  | Arm32, Arm64, x64     | [Lifecycle][22]      |

Notes:

* Red Hat Enterprise Linux: RHEL-compatible derivatives are supported per [.NET Support](../../support.md).

[6]: https://alpinelinux.org/
[7]: https://alpinelinux.org/releases/
[8]: https://github.com/microsoft/azurelinux
[9]: https://centos.org/
[10]: https://www.centos.org/cl-vs-cs/
[11]: https://www.debian.org/
[12]: https://wiki.debian.org/DebianReleases
[13]: https://fedoraproject.org/
[14]: https://fedoraproject.org/wiki/End_of_life
[15]: https://www.opensuse.org/
[16]: https://en.opensuse.org/Lifetime
[17]: https://access.redhat.com/
[18]: https://access.redhat.com/support/policy/updates/errata/
[19]: https://www.suse.com/
[20]: https://www.suse.com/lifecycle/
[21]: https://ubuntu.com/
[22]: https://wiki.ubuntu.com/Releases

## Windows

| OS                            | Versions                    | Architectures         | Lifecycle            |
| ----------------------------- | --------------------------- | --------------------- | -------------------- |
| [Nano Server][23]             | 2022, 2019                  | x64                   | [Lifecycle][24]      |
| [Windows][25]                 | 11 24H2 (IoT), 11 24H2 (E), 11 24H2, 11 23H2, 11 22H2 (E), 10 22H2, 10 21H2 (E), 10 21H2 (IoT), 10 1809 (E), 10 1607 (E) | Arm64, x64, x86 | [Lifecycle][26] |
| [Windows Server][27]          | 23H2, 2022, 2019, 2016, 2012-R2, 2012 | x64, x86    | [Lifecycle][24]      |
| [Windows Server Core][23]     | 2022, 2019, 2016, 2012-R2, 2012 | x64, x86          | [Lifecycle][24]      |

Notes:

* Windows: The x64 emulator is supported on Windows 11 Arm64.
* Windows Server: Windows Server 2012 and 2012 R2 are supported with [Extended Security Updates](https://learn.microsoft.com/windows-server/get-started/extended-security-updates-overview).
* Windows Server Core: Windows Server 2012 and 2012 R2 are supported with [Extended Security Updates](https://learn.microsoft.com/windows-server/get-started/extended-security-updates-overview).

[23]: https://learn.microsoft.com/virtualization/windowscontainers/manage-containers/container-base-images
[24]: https://learn.microsoft.com/windows-server/get-started/windows-server-release-info
[25]: https://www.microsoft.com/windows/
[26]: https://support.microsoft.com/help/13853/windows-lifecycle-fact-sheet
[27]: https://www.microsoft.com/windows-server

## Linux compatibility

Microsoft-provided [portable Linux builds](../../linux.md) define minimum compatibility primarily via libc version.

| Libc          | Version | Architectures         | Source       |
| ------------- | ------- | --------------------- | ------------ |
| glibc         | 2.23    | Arm32, Arm64, x64     | Ubuntu 16.04 |
| musl          | 1.2.2   | Arm32, Arm64, x64     | Alpine 3.13  |

## Notes

* The [QEMU](https://www.qemu.org/) emulator is not supported to run .NET apps. QEMU is used, for example, to emulate Arm64 containers on x64, and vice versa.
* Microsoft-provided portable Arm32 glibc builds are supported on distro versions with a [Y2038 incompatible glibc](https://github.com/dotnet/core/discussions/9285) or a Y2038 compatible glibc with [_TIME_BITS](https://www.gnu.org/software/libc/manual/html_node/Feature-Test-Macros.html) set to 32-bit, for example Debian 12, Ubuntu 22.04, and lower versions.

## Out of support

The following operating system versions are no longer supported.

| OS                    | Version       | Date                 |
| --------------------- | ------------- | -------------------- |
| Alpine                | 3.17          | [2024-11-22](https://alpinelinux.org/posts/Alpine-3.17.10-3.18.9-3.19.4-3.20.3-released.html) |
| Alpine                | 3.16          | [2024-05-23](https://alpinelinux.org/posts/Alpine-3.16.9-3.17.7-3.18.6-released.html) |
| Android               | 11            | 2024-02-05           |
| Debian                | 11            | [2024-08-14](https://lists.debian.org/debian-release/2024/06/msg00700.html) |
| Fedora                | 39            | 2024-11-26           |
| Fedora                | 38            | 2024-05-21           |
| Fedora                | 37            | 2023-12-05           |
| iOS                   | 15            | [2024-09-16](https://support.apple.com/HT212788) |
| iOS                   | 16            | [2024-08-07](https://support.apple.com/HT213407) |
| iPadOS                | 16            | [9999-12-31](https://developer.apple.com/documentation/ios-ipados-release-notes/ipados-16-release-notes) |
| iPadOS                | 15            | [2024-09-16](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-15-release-notes) |
| macOS                 | 12            | [2024-09-16](https://support.apple.com/HT212585) |
| openSUSE Leap         | 15.5          | 2024-12-31           |
| openSUSE Leap         | 15.4          | 2023-12-07           |
| SUSE Enterprise Linux | 12.5          | 2024-10-31           |
| SUSE Enterprise Linux | 15.4          | 2023-12-31           |
| Ubuntu                | 23.10         | 2024-07-11           |
| Ubuntu                | 23.04         | 2024-01-20           |
| Windows               | 11 22H2 (W)   | [2024-10-08](https://learn.microsoft.com/windows/release-health/windows11-release-information) |
| Windows               | 11 21H2 (E)   | [2024-10-08](https://learn.microsoft.com/windows/release-health/windows11-release-information) |
| Windows               | 10 21H2 (E)   | [2024-06-11](https://learn.microsoft.com/lifecycle/products/windows-10-enterprise-and-education) |
