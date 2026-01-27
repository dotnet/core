# .NET 9.0 - Supported OS versions

Last Updated: 2025/11/19; Support phase: Active

[.NET 9.0](README.md) is an [STS](../../release-policies.md) release and [is supported](../../support.md) on multiple operating systems per their lifecycle policy.

## Android

| OS           | Versions       | Architectures     | Lifecycle      |
| ------------ | -------------- | ----------------- | -------------- |
| [Android][0] | 16, 15, 14, 13 | Arm32, Arm64, x64 | [Lifecycle][1] |

Notes:

* Android: API 21 is used as the minimum SDK target.

[0]: https://www.android.com/
[1]: https://support.google.com/android

## Apple

| OS         | Versions | Architectures | Lifecycle |
| ---------- | -------- | ------------- | --------- |
| [iOS][2]   | 26, 18   | Arm64         | None      |
| [iPadOS][3] | 26, 18, 17 | Arm64      | None      |
| [macOS][4] | 26, 15, 14 | Arm64, x64  | None      |
| [tvOS][5]  | 26       | Arm64         | None      |

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

| OS                  | Versions   | Architectures     | Lifecycle       |
| ------------------- | ---------- | ----------------- | --------------- |
| [Alpine][6]         | 3.22, 3.21, 3.20 | Arm32, Arm64, x64 | [Lifecycle][7] |
| [Azure Linux][8]    | 3.0        | Arm64, x64        | None            |
| [CentOS Stream][9]  | 10, 9      | Arm64, ppc64le, s390x, x64 | [Lifecycle][10] |
| [Debian][11]        | 13, 12     | Arm32, Arm64, x64 | [Lifecycle][12] |
| [Fedora][13]        | 43, 42, 41 | Arm32, Arm64, x64 | [Lifecycle][14] |
| [openSUSE Leap][15] | 16.0, 15.6 | Arm64, x64        | [Lifecycle][16] |
| [Red Hat Enterprise Linux][17] | 10, 9, 8 | Arm64, ppc64le, s390x, x64 | [Lifecycle][18] |
| [SUSE Linux Enterprise][19] | 16.0, 15.7, 15.6 | Arm64, x64 | [Lifecycle][20] |
| [Ubuntu][21]        | 25.10, 24.04, 22.04 | Arm32, Arm64, x64 | [Lifecycle][22] |

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

| OS                   | Versions                                    | Architectures | Lifecycle       |
| -------------------- | ------------------------------------------- | ------------- | --------------- |
| [Nano Server][23]    | 2025, 2022, 2019                            | x64           | [Lifecycle][24] |
| [Windows][25]        | 11 25H2, 11 24H2 (IoT), 11 24H2 (E), 11 24H2, 11 23H2, 10 21H2 (E), 10 21H2 (IoT), 10 1809 (E), 10 1607 (E) | Arm64, x64 | [Lifecycle][26] |
| [Windows Server][27] | 2025, 23H2, 2022, 2019, 2016, 2012-R2, 2012 | x64           | [Lifecycle][24] |
| [Windows Server Core][23] | 2025, 2022, 2019, 2016, 2012-R2, 2012  | x64, x86      | [Lifecycle][24] |

Notes:

* Windows: The x64 and x86 emulators are supported on Windows 11 Arm64.
* Windows: The x86 emulator is supported on x64.
* Windows Server: Windows Server 2012 and 2012 R2 are supported with [Extended Security Updates](https://learn.microsoft.com/windows-server/get-started/extended-security-updates-overview).
* Windows Server Core: Windows Server 2012 and 2012 R2 are supported with [Extended Security Updates](https://learn.microsoft.com/windows-server/get-started/extended-security-updates-overview).

[23]: https://learn.microsoft.com/virtualization/windowscontainers/manage-containers/container-base-images
[24]: https://learn.microsoft.com/windows-server/get-started/windows-server-release-info
[25]: https://www.microsoft.com/windows/
[26]: https://support.microsoft.com/help/13853/windows-lifecycle-fact-sheet
[27]: https://www.microsoft.com/windows-server

## Linux compatibility

Microsoft-provided [portable Linux builds](../../linux.md) define minimum compatibility primarily via libc version.

| Libc  | Version | Architectures | Source       |
| ----- | ------- | ------------- | ------------ |
| glibc | 2.23    | Arm64, x64    | Ubuntu 16.04 |
| glibc | 2.35    | Arm32         | Ubuntu 22.04 |
| musl  | 1.2.2   | Arm32, Arm64, x64 | Alpine 3.13 |

## Notes

* The [QEMU](https://www.qemu.org/) emulator is not supported to run .NET apps. QEMU is used, for example, to emulate Arm64 containers on x64, and vice versa.
* Microsoft-provided portable Arm32 glibc builds are supported on distro versions with a [Y2038 compatible glibc](https://github.com/dotnet/core/discussions/9285), for example Debian 12, Ubuntu 22.04, and higher versions.

## Out of support

The following operating system versions are no longer supported.

| OS     | Version | Date       |
| ------ | ------- | ---------- |
| Alpine | 3.19    | [2025-11-01](https://alpinelinux.org/posts/Alpine-3.17.10-3.18.9-3.19.4-3.20.3-released.html) |
| Android | 12.1   | [2025-03-03](https://developer.android.com/about/versions/12/12L) |
| Android | 12     | 2025-03-03 |
| Fedora | 40      | 2025-05-13 |
| iOS    | 16      | [2025-03-31](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-16-release-notes) |
| iOS    | 17      | 2024-11-19 |
| iPadOS | 16      | [2025-03-31](https://developer.apple.com/documentation/ios-ipados-release-notes/ipados-16-release-notes) |
| macOS  | 13      | 2025-09-15 |
| openSUSE Leap | 15.5 | 2024-12-31 |
| tvOS   | 18      | 2025-09-15 |
| tvOS   | 17      | 2024-09-16 |
| tvOS   | 16      | 2023-09-18 |
| tvOS   | 15      | 2022-09-12 |
| tvOS   | 14      | 2021-09-20 |
| tvOS   | 13      | 2020-09-16 |
| tvOS   | 12.2    | -          |
| Ubuntu | 25.04   | 2026-01-17 |
| Ubuntu | 24.10   | 2025-07-10 |
| Windows | 11 22H2 (E) | [2025-10-14](https://learn.microsoft.com/windows/release-health/windows11-release-information) |
| Windows | 10 22H2 | [2025-10-14](https://learn.microsoft.com/windows/release-health/release-information) |

## About

This file is generated from [supported-os.json](supported-os.json) and is based (with thanks) on support information from [endoflife.date](https://endoflife.date/).
