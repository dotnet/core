# .NET 8 - Supported OS versions

[.NET 8](README.md) is a [Long Term Support (LTS)](../../release-policies.md) release and [is supported](../../microsoft-support.md) on multiple operating systems per their lifecycle policy.

For issues with .NET on operating systems not listed here, please open a GitHub issue in the appropriate .NET repository or contact the OS maintainer community . See [.NET Repos](../../Documentation/core-repos.md) for the repository list.

## Windows

OS                                    | Version                 | Architectures   | Lifecycle
--------------------------------------|-------------------------|-----------------|----------
[Windows 10 Client][Windows-client]   | Version 1607+           | x64, x86, Arm64 | [Windows][Windows-lifecycle]
[Windows 11][Windows-client]          | Version 22000+          | x64, x86, Arm64 | [Windows][Windows-lifecycle]
[Windows Server][Windows-Server]      | 2012+                   | x64, x86        | [Windows Server][Windows-Server-lifecycle]
[Windows Server Core][Windows-Server] | 2012+                   | x64, x86        | [Windows Server][Windows-Server-lifecycle]
[Nano Server][Nano-Server]            | Version 1809+           | x64             | [Windows Server][Windows-Server-lifecycle]

[Windows-client]: https://www.microsoft.com/windows/
[Windows-lifecycle]: https://support.microsoft.com/help/13853/windows-lifecycle-fact-sheet
[win-client-docker]: https://hub.docker.com/_/microsoft-windows
[Windows-Server-lifecycle]: https://learn.microsoft.com/windows-server/get-started/windows-server-release-info
[Nano-Server]: https://learn.microsoft.com/windows-server/get-started/getting-started-with-nano-server
[Windows-Server]: https://learn.microsoft.com/windows-server/

.NET 8 is supported in the x64 emulator on Windows 11 Arm64.

## Linux

OS                                    | Version               | Architectures     | Lifecycle
--------------------------------------|-----------------------|-------------------|----------
[Alpine Linux][Alpine]                | 3.17+                 | x64, Arm64, Arm32 | [Alpine][Alpine-lifecycle]
[Debian][Debian]                      | 11+                   | x64, Arm64, Arm32 | [Debian][Debian-lifecycle]
[Fedora][Fedora]                      | 37+                   | x64               | [Fedora][Fedora-lifecycle]
[openSUSE][OpenSUSE]                  | 15+                   | x64               | [OpenSUSE][OpenSUSE-lifecycle]
[Oracle Linux][Oracle-Linux]          | 8+                    | x64               | [Oracle][Oracle-lifecycle]
[Red Hat Enterprise Linux][RHEL]      | 8+                    | x64, Arm64        | [Red Hat][RHEL-lifecycle]
[SUSE Enterprise Linux (SLES)][SLES]  | 12 SP5+               | x64               | [SUSE][SLES-lifecycle]
[Ubuntu][Ubuntu]                      | 20.04+                | x64, Arm64, Arm32 | [Ubuntu][Ubuntu-lifecycle]

Other distributions are supported at best effort, per [.NET Support and Compatibility for Linux Distributions](../../linux-support.md).

### Libc compatibility

- [glibc][glibc] 2.23 (from Ubuntu 16.04)
- Alpine: [musl][musl] 1.2.2 (from Alpine 3.13)

[Alpine]: https://alpinelinux.org/
[Alpine-lifecycle]: https://alpinelinux.org/releases/
[CentOS]: https://www.centos.org/
[CentOS-lifecycle]:https://wiki.centos.org/FAQ/General
[CentOS-docker]: https://hub.docker.com/_/centos
[CentOS-pm]: https://learn.microsoft.com/dotnet/core/install/linux-package-manager-centos8
[Debian]: https://www.debian.org/
[Debian-lifecycle]: https://wiki.debian.org/DebianReleases
[Debian-pm]: https://learn.microsoft.com/dotnet/core/install/linux-package-manager-debian10
[Fedora]: https://getfedora.org/
[Fedora-lifecycle]: https://fedoraproject.org/wiki/End_of_life
[Fedora-docker]: https://hub.docker.com/_/fedora
[Fedora-msft-pm]: https://learn.microsoft.com/dotnet/core/install/linux-package-manager-fedora32
[Fedora-pm]: https://fedoraproject.org/wiki/DotNet
[OpenSUSE]: https://opensuse.org/
[OpenSUSE-lifecycle]: https://en.opensuse.org/Lifetime
[OpenSUSE-docker]: https://hub.docker.com/r/opensuse/leap
[OpenSUSE-pm]: https://learn.microsoft.com/dotnet/core/install/linux-package-manager-opensuse15
[Oracle-Linux]: https://www.oracle.com/linux/
[Oracle-Lifecycle]: https://www.oracle.com/a/ocom/docs/elsp-lifetime-069338.pdf
[RHEL]: https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux
[RHEL-lifecycle]: https://access.redhat.com/support/policy/updates/errata/
[RHEL-msft-pm]: https://learn.microsoft.com/dotnet/core/install/linux-package-manager-rhel8
[RHEL-pm]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/developing_.net_applications_in_rhel_8/using-net-core-on-rhel_gsg#installing-net-core_gsg
[SLES]: https://www.suse.com/products/server/
[SLES-lifecycle]: https://www.suse.com/lifecycle/
[SLES-pm]: https://learn.microsoft.com/dotnet/core/install/linux-package-manager-sles15
[Ubuntu]: https://ubuntu.com/
[Ubuntu-lifecycle]: https://wiki.ubuntu.com/Releases
[Ubuntu-pm]: https://learn.microsoft.com/dotnet/core/install/linux-package-manager-ubuntu-2004
[glibc]: https://www.gnu.org/software/libc/
[musl]: https://musl.libc.org/

## macOS

OS                            | Version                   | Architectures     |
------------------------------|---------------------------|-------------------|
[macOS][macOS]                | 10.15+                    | x64, Arm64        |

.NET 8 is supported in the Rosetta 2 x64 emulator.

[macOS]: https://support.apple.com/macos

## Android

OS                            | Version                 | Architectures     |
------------------------------|-------------------------|-------------------|
[Android][Android]            | API 21+                 | x64, Arm32, Arm64 |

[Android]: https://support.google.com/android

## iOS / tvOS / MacCatalyst

OS                            | Version                 | Architectures     |
------------------------------|-------------------------|-------------------|
[iOS][iOS]                    | 11.0+                   | Arm64             |
[iOS Simulator][iOS]          | 11.0+                   | x64, Arm64        |
[tvOS][tvOS]                  | 11.0+                   | Arm64             |
[tvOS Simulator][tvOS]        | 11.0+                   | x64, Arm64        |
[MacCatalyst][macOS]          | 10.15+, 11.0+ on Arm64  | x64, Arm64        |

[iOS]: https://support.apple.com/ios
[tvOS]: https://support.apple.com/apple-tv

## QEMU

.NET 8 is not supported being run (emulated) via [QEMU](https://www.qemu.org/). QEMU is used, for example, to emulate Arm64 containers on x64, and vice versa.

## Support changes from .NET 6.0

The following operating systems are no longer supported, starting with .NET 7.0.

OS                                    | Version                 | Architectures     |
--------------------------------------|-------------------------|-------------------|
[Windows Client][Windows-client]      | 7 SP1, 8.1      | x64, x86          |

## Out of support OS versions

Support for the following versions was ended by the distribution owners and are [no longer supported by .NET 8.0][OS-lifecycle-policy].

None yet.

[OS-lifecycle-policy]: https://github.com/dotnet/core/blob/main/os-lifecycle-policy.md
