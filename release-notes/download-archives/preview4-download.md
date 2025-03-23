# .NET Core SDK 1.0 Preview 4 build 004233

The installers and binary archives on this page include .NET Core 1.0 SDK Preview 4. [Checksums](https://builds.dotnet.microsoft.com/dotnet/checksums/1.0.1-SDK-Preview-4-4233-SHA.txt) are available to verify downloads.

| .NET Core 1.0 Preview 4 | SDK Installer                                        | SDK Binaries                                        | Runtime Installer | Runtime Binaries |
| ----------------------- | :----------------------------------------------: | :----------------------------------------------:| :--: | :--: |
| Windows                 | [32-bit](https://go.microsoft.com/fwlink/?linkid=838402) / [64-bit](https://go.microsoft.com/fwlink/?linkid=838401)  | [32-bit](https://go.microsoft.com/fwlink/?linkid=837978) / [64-bit](https://go.microsoft.com/fwlink/?linkid=837977) | [32-bit](https://go.microsoft.com/fwlink/?LinkID=827516) / [64-bit](https://go.microsoft.com/fwlink/?LinkID=827515) | [32-bit](https://go.microsoft.com/fwlink/?LinkID=825883) / [64-bit](https://go.microsoft.com/fwlink/?LinkID=825882) |
| macOS                   | [64-bit](https://go.microsoft.com/fwlink/?linkid=838403)  | [64-bit](https://go.microsoft.com/fwlink/?linkid=837973)                          | [64-bit](https://go.microsoft.com/fwlink/?LinkID=827517) | [64-bit](https://go.microsoft.com/fwlink/?LinkID=825884) |
| CentOS 7.1              | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?linkid=837969)                          | - | [64-bit](https://go.microsoft.com/fwlink/?LinkID=825888) |
| Debian 8                | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?linkid=837970)                          | - | [64-bit](https://go.microsoft.com/fwlink/?LinkID=825887) |
| Fedora 23               | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?linkid=837971)                          | - | [64-bit](https://go.microsoft.com/fwlink/?LinkID=825891) |
| openSUSE 13.2           | -                                                         | [64-bit](https://go.microsoft.com/fwlink/?linkid=837972)                          | - | [64-bit](https://go.microsoft.com/fwlink/?LinkID=825890) |
| Ubuntu 14.04            | See notes below for Ubuntu 14.04 and Mint 17 installers   | [64-bit](https://go.microsoft.com/fwlink/?linkid=837976)                          | - | [64-bit](https://go.microsoft.com/fwlink/?LinkID=825885) |
| Ubuntu 16.04            | See notes below for Ubuntu 16.04 and Mint 18 installers   | [64-bit](https://go.microsoft.com/fwlink/?linkid=837975)                          | - | [64-bit](https://go.microsoft.com/fwlink/?LinkID=825886) |

## Installation from a binary archive

When using binary archives to install, we recommend the contents be extracted to `/opt/dotnet` and a symbolic link created for `dotnet`. If an earlier release of .NET Core is already installed, the directory and symbolic link may already exist. Ubuntu and Mint users should follow the instructions in the Ubuntu Installation section below.

```bash
sudo mkdir -p /opt/dotnet
sudo tar zxf [tar.gz filename] -C /opt/dotnet
sudo ln -s /opt/dotnet/dotnet /usr/local/bin
```

## Ubuntu installation

```bash
dotnet-host-ubuntu-x64.deb
dotnet-hostfxr-ubuntu-x64.deb
dotnet-sharedframework-ubuntu-x64.deb
dotnet-sdk-ubuntu-x64.1.0.0-preview4-004233.deb
```

### Set up package source

The first step is to establish the source feed for the package manager. This is only needed if you have not previously set up the source or if you are installing for the first time.

#### Ubuntu 14.04 and Linux Mint 17

```bash
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ trusty main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893
sudo apt-get update
sudo apt-get install dotnet-dev-1.0.0-preview4-004233

```

Installed packages

```bash
dotnet-host-ubuntu-x64.1.0.1.deb
dotnet-hostfxr-ubuntu-x64.1.0.1.deb
dotnet-sharedframework-ubuntu-x64.1.0.1.deb
dotnet-sdk-ubuntu-x64.1.0.0-preview4-004233.deb
```

#### Ubuntu 16.04 and Linux Mint 18

```bash
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ xenial main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893
sudo apt-get update
sudo apt-get install dotnet-dev-1.0.0-preview4-004233
```

Installed packages

```bash
dotnet-host-ubuntu.16.04-x64.1.0.1.deb
dotnet-hostfxr-ubuntu.16.04-x64.1.0.1.deb
dotnet-sharedframework-ubuntu.16.04-x64.1.0.1.deb
dotnet-sdk-ubuntu.16.04-x64.1.0.0-preview4-004233.deb
```
