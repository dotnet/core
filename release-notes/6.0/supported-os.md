# .NET 6 - Supported OS versions

Last updated: 2024-08-26

[.NET 6](README.md) is a [Long Term Support (LTS)](../../release-policies.md) release and [is supported](../../support.md) on multiple operating systems per their lifecycle policy.

This file is generated from [supported-os.json](supported-os.json) and is based on support information from [endoflife.date](https://endoflife.date/).

## Android

OS                              | Versions                    | Architectures         | Lifecycle
------------------------------- | --------------------------- | --------------------- | ----------------------
[Android][0]                    | 14, 13, 12.1, 12            | Arm32, Arm64, x64     | [Lifecycle][1]

Notes:

* Android: API 21 is used as the minimum SDK target.

[0]: https://www.android.com/
[1]: https://support.google.com/android

## Apple

OS                              | Versions                    | Architectures
------------------------------- | --------------------------- | ----------------------
[iOS][2]                        | 17, 16, 15                  | Arm64
[iPadOS][3]                     | 17, 16, 15                  | Arm64
[macOS][4]                      | 14, 13, 12                  | Arm64, x64
[tvOS][5]                       | 17, 16, 15                  | Arm64

Notes:

* iOS: iOS 10.0 is used as the minimum SDK target.
* macOS: The iOS and tvOS simulators are supported on macOS Arm64 and x64.
* macOS: The x64 emulator (Rosetta 2) is supported on macOS Arm64.
* macOS: Mac Catalyst apps are supported on macOS Arm64 and x64.

[2]: https://developer.apple.com/ios/
[3]: https://developer.apple.com/ipados/
[4]: https://developer.apple.com/macos/
[5]: https://developer.apple.com/tvos/

## Linux

OS                              | Versions                    | Architectures         | Lifecycle
------------------------------- | --------------------------- | --------------------- | ----------------------
[Alpine][6]                     | 3.20, 3.19, 3.18, 3.17      | Arm32, Arm64, x64     | [Lifecycle][7]
[CentOS][8]                     | [None][None]                | x64                   | [Lifecycle][9]
[CentOS Stream][8]              | 9                           | Arm64, s390x, x64     | [Lifecycle][10]
[Debian][11]                    | 12, 11                      | Arm32, Arm64, x64     | [Lifecycle][12]
[Fedora][13]                    | 40, 39                      | Arm32, Arm64, x64     | [Lifecycle][14]
[openSUSE Leap][15]             | 15.6, 15.5                  | Arm64, x64            | [Lifecycle][16]
[Red Hat Enterprise Linux][17]  | 9, 8                        | Arm64, x64            | [Lifecycle][18]
[SUSE Enterprise Linux][19]     | 15.6, 15.5, 12.5            | Arm64, x64            | [Lifecycle][20]
[Ubuntu][21]                    | 24.04, 22.04, 20.04         | Arm32, Arm64, x64     | [Lifecycle][22]

Notes:

* CentOS: The CentOS project has moved to [supporting CentOS Stream as its future](https://blog.centos.org/2020/12/future-is-centos-stream/). Users can consider [migrating to Red Hat Enterprise Linux](https://www.redhat.com/en/blog/centos-linux-has-reached-its-end-life-eol) or another distro.
* Red Hat Enterprise Linux: RHEL-compatible derivatives are supported per [.NET Support](../../support.md).

[6]: https://alpinelinux.org/
[7]: https://alpinelinux.org/releases/
[8]: https://centos.org/
[9]: https://blog.centos.org/2023/04/end-dates-are-coming-for-centos-stream-8-and-centos-linux-7/
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

OS                              | Versions                    | Architectures         | Lifecycle
------------------------------- | --------------------------- | --------------------- | ----------------------
[Nano Server][23]               | 2022, 2019                  | x64                   | [Lifecycle][24]
[Windows][25]                   | 11 23H2, 11 22H2, 10 22H2, 11 21H2 (E), 10 21H2 (E), 10 21H2 (IoT), 10 1809 (E), 10 1607 (E) | Arm64, x64, x86 | [Lifecycle][26]
[Windows Server][27]            | 23H2, 2022, 2019, 2016, 2012-R2, 2012 | x64, x86    | [Lifecycle][24]
[Windows Server Core][23]       | 2022, 2019, 2016, 2012-R2, 2012 | x64, x86          | [Lifecycle][24]

Notes:

* Windows: The x64 emulator is supported on Windows 11 Arm64.
* Windows Server: Windows Server 2012 and 2012 R2 are supported with [Extended Security Updates](https://learn.microsoft.com/windows-server/get-started/extended-security-updates-overview).

[23]: https://learn.microsoft.com/virtualization/windowscontainers/manage-containers/container-base-images
[24]: https://learn.microsoft.com/windows-server/get-started/windows-server-release-info
[25]: https://www.microsoft.com/windows/
[26]: https://support.microsoft.com/help/13853/windows-lifecycle-fact-sheet
[27]: https://www.microsoft.com/windows-server

## Linux compatibility

Microsoft-provided [portable Linux builds](../../linux.md) define minimum compatibility primarily via libc version.

Libc            | Version | Architectures         | Source
--------------- | ------- | --------------------- | --------------
glibc           | 2.17    | x64                   | CentOS 7
glibc           | 2.23    | Arm64, Arm32          | Ubuntu 16.04
musl            | 1.2.2   | Arm64, x64            | Alpine 3.13

Note: Microsoft-provided portable Arm32 glibc builds are supported on distro versions with a [Y2038 incompatible glibc](https://github.com/dotnet/core/discussions/9285) or a Y2038 compatible glibc with [_TIME_BITS](https://www.gnu.org/software/libc/manual/html_node/Feature-Test-Macros.html) set to 32-bit, for example Debian 12, Ubuntu 22.04, and lower versions.

## Notes

* The [QEMU](https://www.qemu.org/) emulator is not supported to run .NET apps. QEMU is used, for example, to emulate Arm64 containers on x64, and vice versa.

## Out of support OS versions

Support for the following operating system versions has ended.

OS                      | Version       | Date
----------------------- | ------------- | ----------------------
Alpine                  | 3.16          | [2024-05-23](https://alpinelinux.org/posts/Alpine-3.16.9-3.17.7-3.18.6-released.html)
Alpine                  | 3.15          | [2023-11-01](https://alpinelinux.org/posts/Alpine-3.15.10-3.16.7-3.17.5-3.18.3-released.html)
Alpine                  | 3.14          | [2023-05-01](https://alpinelinux.org/posts/Alpine-3.14.10-3.15.8-3.16.5-released.html)
Alpine                  | 3.13          | [2022-11-01](https://alpinelinux.org/posts/Alpine-3.12.12-3.13.10-3.14.6-3.15.4-released.html)
Alpine                  | 3.12          | [2022-05-01](https://alpinelinux.org/posts/Alpine-3.12.12-3.13.10-3.14.6-3.15.4-released.html)
Android                 | 11            | 2024-02-05
Android                 | 10            | 2023-03-06
Android                 | 9             | [2022-01-01](https://developer.android.com/about/versions/pie)
CentOS                  | 7             | [2024-06-30](https://web.archive.org/web/20230711113909/https://wiki.centos.org/Manuals/ReleaseNotes/CentOS7.2009)
CentOS                  | 8             | [2021-12-31](https://web.archive.org/web/20230711113909/https://wiki.centos.org/Manuals/ReleaseNotes/CentOS8.2111)
CentOS Stream           | 8             | [2024-05-31](http://web.archive.org/web/20230417021744/https://wiki.centos.org/Manuals/ReleaseNotes/CentOSStream)
Debian                  | 10            | [2022-09-10](https://www.debian.org/News/2022/20220910)
Fedora                  | 38            | 2024-05-21
Fedora                  | 37            | 2023-12-05
Fedora                  | 36            | 2023-05-16
Fedora                  | 35            | 2022-12-13
Fedora                  | 34            | 2022-06-07
Fedora                  | 33            | 2021-11-30
iOS                     | 12            | [2023-01-23](https://support.apple.com/HT209084)
iPadOS                  | 12            | -
macOS                   | 11            | [2023-09-26](https://support.apple.com/HT211896)
macOS                   | 10.15         | [2022-09-12](https://support.apple.com/HT210642)
Nano Server             | 20H2          | [2022-08-09](https://learn.microsoft.com/lifecycle/announcements/windows-server-20h2-retiring)
Nano Server             | 2004          | [2021-12-14](https://learn.microsoft.com/lifecycle/announcements/windows-server-version-2004-end-of-servicing)
openSUSE Leap           | 15.4          | 2023-12-07
openSUSE Leap           | 15.3          | [2022-12-31](https://web.archive.org/web/20230521063245/https://doc.opensuse.org/release-notes/x86_64/openSUSE/Leap/15.3/)
openSUSE Leap           | 15.2          | [2022-01-04](https://web.archive.org/web/20230529015218/https://doc.opensuse.org/release-notes/x86_64/openSUSE/Leap/15.2/)
Red Hat Enterprise Linux | 7            | 2024-06-30
SUSE Enterprise Linux   | 15.4          | 2023-12-31
SUSE Enterprise Linux   | 15.3          | 2022-12-31
SUSE Enterprise Linux   | 15.2          | 2021-12-31
SUSE Enterprise Linux   | 12.4          | 2020-06-30
SUSE Enterprise Linux   | 12.3          | 2019-06-30
SUSE Enterprise Linux   | 12.2          | 2018-03-31
tvOS                    | 12            | -
Ubuntu                  | 23.10         | 2024-07-11
Ubuntu                  | 23.04         | 2024-01-20
Ubuntu                  | 22.10         | 2023-07-20
Ubuntu                  | 18.04         | 2023-05-31
Ubuntu                  | 21.10         | 2022-07-14
Ubuntu                  | 21.04         | 2022-01-20
Windows                 | 10 21H2 (E)   | [2024-06-11](https://learn.microsoft.com/lifecycle/products/windows-10-enterprise-and-education)
Windows                 | 11 21H2 (W)   | [2023-10-10](https://learn.microsoft.com/windows/release-health/windows11-release-information)
Windows                 | 10 21H2 (W)   | [2023-06-13](https://learn.microsoft.com/windows/release-health/release-information)
Windows                 | 10 20H2 (E)   | [2023-05-09](https://learn.microsoft.com/windows/release-health/status-windows-10-20h2)
Windows                 | 8.1           | [2023-01-10](https://learn.microsoft.com/lifecycle/products/windows-81)
Windows                 | 10 21H1       | [2022-12-13](https://learn.microsoft.com/windows/release-health/status-windows-10-21h1)
Windows                 | 10 20H2 (W)   | [2022-05-10](https://learn.microsoft.com/windows/release-health/status-windows-10-20h2)
Windows                 | 10 1909 (E)   | [2022-05-10](https://learn.microsoft.com/lifecycle/announcements/windows-10-1909-enterprise-education-eos)
Windows                 | 10 2004       | [2021-12-14](https://learn.microsoft.com/lifecycle/announcements/windows-10-version-2004-end-of-servicing)
Windows                 | 7 SP1         | [2020-01-14](https://learn.microsoft.com/lifecycle/products/windows-7)
Windows Server          | 20H2          | [2022-08-09](https://learn.microsoft.com/lifecycle/announcements/windows-server-20h2-retiring)
Windows Server          | 2004          | [2021-12-14](https://learn.microsoft.com/lifecycle/announcements/windows-server-version-2004-end-of-servicing)
Windows Server Core     | 20H2          | [2022-08-09](https://learn.microsoft.com/lifecycle/announcements/windows-server-20h2-retiring)
Windows Server Core     | 1607          | [2022-01-11](https://learn.microsoft.com/virtualization/windowscontainers/deploy-containers/base-image-lifecycle)
Windows Server Core     | 2004          | [2021-12-14](https://learn.microsoft.com/lifecycle/announcements/windows-server-version-2004-end-of-servicing)

[None]: #out-of-support-os-versions
