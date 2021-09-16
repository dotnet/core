# .NET 6 - Supported OS versions

[.NET 6](README.md) is supported on multiple operating systems per their [lifecycle policy](../../os-lifecycle-policy.md).

## Windows

OS                                    | Version                 | Architectures   | Lifecycle
--------------------------------------|-------------------------|-----------------|----------
[Windows Client][Windows-client]      | 7 SP1(**\***), 8.1      | x64, x86        | [Windows][Windows-lifecycle]
[Windows 10 Client][Windows-client]   | Version 1607+           | x64, x86, Arm64 | [Windows][Windows-lifecycle]
[Windows Server][Windows-Server]      | 2012+                | x64, x86        | [Windows Server][Windows-Server-lifecycle]
[Windows Server Core][Windows-Server] | 2012+                | x64, x86        | [Windows Server][Windows-Server-lifecycle]
[Nano Server][Nano-Server]            | Version 1809+           | x64             | [Windows Server][Windows-Server-lifecycle]

**\*** Windows 7 SP1 is supported with [Extended Security Updates](https://docs.microsoft.com/troubleshoot/windows-client/windows-7-eos-faq/windows-7-extended-security-updates-faq) installed.

[Windows-client]: https://www.microsoft.com/windows/
[Windows-lifecycle]: https://support.microsoft.com/help/13853/windows-lifecycle-fact-sheet
[win-client-docker]: https://hub.docker.com/_/microsoft-windows
[Windows-Server-lifecycle]: https://docs.microsoft.com/windows-server/get-started/windows-server-release-info
[Nano-Server]: https://docs.microsoft.com/windows-server/get-started/getting-started-with-nano-server
[Windows-Server]: https://docs.microsoft.com/windows-server/

## Linux

OS                                    | Version               | Architectures     | Lifecycle
--------------------------------------|-----------------------|-------------------|----------
[Alpine Linux][Alpine]                | 3.13+                 | x64, Arm64, Arm32 | [Alpine][Alpine-lifecycle]
[CentOS][CentOS]                      | 7+                    | x64               | [CentOS][CentOS-lifecycle]
[Debian][Debian]                      | 10+                   | x64, Arm64, Arm32 | [Debian][Debian-lifecycle]
[Fedora][Fedora]                      | 33+                   | x64               | [Fedora][Fedora-lifecycle]
[openSUSE][OpenSUSE]                  | 15+                   | x64               | [OpenSUSE][OpenSUSE-lifecycle]
[Red Hat Enterprise Linux][RHEL]      | 7+                    | x64, Arm64        | [Red Hat][RHEL-lifecycle]
[SUSE Enterprise Linux (SLES)][SLES]  | 12 SP2+               | x64               | [SUSE][SLES-lifecycle]
[Ubuntu][Ubuntu]                      | 16.04, 18.04, 20.04+  | x64, Arm64, Arm32 | [Ubuntu][Ubuntu-lifecycle]

[Alpine]: https://alpinelinux.org/
[Alpine-lifecycle]: https://alpinelinux.org/releases/
[CentOS]: https://www.centos.org/
[CentOS-lifecycle]:https://wiki.centos.org/FAQ/General
[CentOS-docker]: https://hub.docker.com/_/centos
[CentOS-pm]: https://docs.microsoft.com/dotnet/core/install/linux-package-manager-centos8
[Debian]: https://www.debian.org/
[Debian-lifecycle]: https://wiki.debian.org/DebianReleases
[Debian-pm]: https://docs.microsoft.com/dotnet/core/install/linux-package-manager-debian10
[Fedora]: https://getfedora.org/
[Fedora-lifecycle]: https://fedoraproject.org/wiki/End_of_life
[Fedora-docker]: https://hub.docker.com/_/fedora
[Fedora-msft-pm]: https://docs.microsoft.com/dotnet/core/install/linux-package-manager-fedora32
[Fedora-pm]: https://fedoraproject.org/wiki/DotNet
[OpenSUSE]: https://opensuse.org/
[OpenSUSE-lifecycle]: https://en.opensuse.org/Lifetime
[OpenSUSE-docker]: https://hub.docker.com/r/opensuse/leap
[OpenSUSE-pm]: https://docs.microsoft.com/dotnet/core/install/linux-package-manager-opensuse15
[RHEL]: https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux
[RHEL-lifecycle]: https://access.redhat.com/support/policy/updates/errata/
[RHEL-msft-pm]: https://docs.microsoft.com/dotnet/core/install/linux-package-manager-rhel8
[RHEL-pm]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/developing_.net_applications_in_rhel_8/using-net-core-on-rhel_gsg#installing-net-core_gsg
[SLES]: https://www.suse.com/products/server/
[SLES-lifecycle]: https://www.suse.com/lifecycle/
[SLES-pm]: https://docs.microsoft.com/dotnet/core/install/linux-package-manager-sles15
[Ubuntu]: https://ubuntu.com/
[Ubuntu-lifecycle]: https://wiki.ubuntu.com/Releases
[Ubuntu-pm]: https://docs.microsoft.com/dotnet/core/install/linux-package-manager-ubuntu-2004

## macOS

OS                            | Version                   | Architectures     |
------------------------------|---------------------------|-------------------|
[macOS][macOS]                | 10.14+                    | x64, Arm64        |

[macOS]: https://support.apple.com/macos

## Android

OS                            | Version                 | Architectures     |
------------------------------|-------------------------|-------------------|
[Android][Android]            | API 21+                 | x64, Arm32, Arm64 |

[Android]: https://support.google.com/android

## iOS / tvOS

OS                            | Version                 | Architectures     |
------------------------------|-------------------------|-------------------|
[iOS][iOS]                    | 10.0+                   | x64, Arm32, Arm64 |

[iOS]: https://support.apple.com/ios

## Support changes from .NET 5.0

The following operating systems are no longer supported, starting with .NET 6.0.

None yet.

## Out of support OS versions

Support for the following versions was ended by the distribution owners and are [no longer supported by .NET 6.0][OS-lifecycle-policy].

None yet.

[OS-lifecycle-policy]: https://github.com/dotnet/core/blob/main/os-lifecycle-policy.md
