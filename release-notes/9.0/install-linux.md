# .NET 9.0 installation instructions for Linux

The following instructions demonstrate installing .NET 9.0 on Linux. These instructions augment the more general [.NET install instructions](install.md), including installing with `.tar.gz` files, that work on multiple operating systems.

[.NET 9.0 Required Packages](os-packages.md) describes the set of packages required to run .NET on Linux.

## Distributions

The following distributions are available for Linux:

- .NET SDK: includes tools for building and testing applications, and includes the runtime distributions that follow.
- .NET Runtime: includes the .NET runtime and libraries, enabling running console applications.
- ASP.NET Core Runtime: includes the .NET and ASP.NET Core runtimes, enabling running console, and web applications.

We recommend you install the .NET SDK to develop and build applications, and to install one of the runtime packages (like ASP.NET Core) to exclusively run applications.

## Downloads

Each of the distributions can be downloaded from:

- [Microsoft .NET website](https://dotnet.microsoft.com/download/dotnet/9.0)
- [.NET 9.0 release notes](README.md)

[Container images](https://hub.docker.com/_/microsoft-dotnet) are provided for Linux (Alpine, Debian, and Ubuntu).

## Install using deb/rpm packages

Follow the [Linux package installation instructions](https://learn.microsoft.com/dotnet/core/install/linux) for your distribution and OS version, and select the .NET 9.0 packages. Package availability and repository setup differ between distributions and releases.

For Ubuntu 24.04, use the built-in Ubuntu feed or the Ubuntu .NET backports feed, depending on the .NET version. Microsoft does not publish .NET packages for Ubuntu 24.04 to its package feed. See the [Ubuntu installation instructions](https://learn.microsoft.com/dotnet/core/install/linux-ubuntu-install#ubuntu-2404) for the feed and package commands for each .NET version.

Use .NET packages from one publisher. Mixing packages from distribution and Microsoft feeds can cause [package resolution problems](https://learn.microsoft.com/dotnet/core/install/linux-package-mixup).

Package-manager installation also installs the required dependencies. For a manual installation, follow the binary archive instructions below and install the packages listed at the start of this guide.

## Installing from a binary archive

You can install .NET with a binary archive. This option is required if you want to install .NET for a single user. It is also recommended if you want to install .NET temporarily.

The following workflow demonstrates downloading, unpacking, configuring, and running the .NET SDK from the command line. You may choose to do some of these tasks via the browser and functionality provided by your operating system.

```bash
~# curl -Lo dotnet.tar.gz https://builds.dotnet.microsoft.com/dotnet/Sdk/9.0.308/dotnet-sdk-9.0.308-linux-x64.tar.gz
~# mkdir dotnet
~# tar -C dotnet -xf dotnet.tar.gz
~# rm dotnet.tar.gz
~# export DOTNET_ROOT=~/dotnet
~# export PATH=$PATH:~/dotnet
~# dotnet --version
9.0.308
```

The `DOTNET_ROOT` environment variable is required to launch an application with their executables (like `myapp.exe`). The executables look for this environment variable to find the runtime if it isn't installed in its regular location. The `PATH` environment variable must be updated if you want to use `dotnet` without absolute paths to its location. Setting both of these environment variables is optional.

You can add your .NET install location permanently to your path if you'd like.
