# .NET 5 installation instructions for Linux

The following instructions demonstrate installing .NET 5 on Linux. These instructions augment the more general [.NET install instructions](install.md), including installing with `.tar.gz` files, that work on multiple operating systems.

[Linux package dependencies](linux-packages.md) describes the set of packages required to run .NET on Linux.

## Distributions

The following distributions are available for Linux:

- .NET SDK: includes tools for building and testing applications, and includes the runtime distributions that follow.
- .NET Runtime: includes the .NET runtime and libraries, enabling running console applications.
- ASP.NET Core Runtime: includes the .NET and ASP.NET Core runtimes, enabling running console, and web applications.

We recommend you install the .NET SDK to develop and build applications, and to install one of the runtimes packages (like ASP.NET Core) to exclusively run applications.

## Downloads

Each of the distributions can be downloaded from:

- [Microsoft .NET website](https://dotnet.microsoft.com/download/dotnet/5.0)
- [.NET 5 release notes](README.md)

[Container images](https://hub.docker.com/r/microsoft/dotnet/) are provided for Linux (Alpine, Debian, and Ubuntu).

## Install using deb/rpm packages


DEB and RPM install packages for Linux are available from Microsoft or, natively from some Linux distributions. It is recommended that you use packages provided by distribution, when available. See [Install .NET on Linux](https://docs.microsoft.com/en-us/dotnet/core/install/linux) for a complete list of supported Linux distributions and installer package options for each.

## Install using Snap

You can use Snap is to install and try .NET Previews on [Linux distributions that support Snap](https://docs.snapcraft.io/installing-snapd/6735).

After configuring Snap on your system, run the following command to install the latest .NET Core SDK.

`sudo snap install dotnet-sdk --channel=5.0/stable --classic`

When .NET Core is installed using the Snap package, the default .NET Core command is `dotnet-sdk.dotnet`, as opposed to just `dotnet`. The benefit of the namespaced command is that it will not conflict with a globally installed .NET Core version you may have. This command can be aliased to `dotnet` with:

`sudo snap alias dotnet-sdk.dotnet dotnet`

**Note:** Some distributions require an additional step to enable access to the SSL certificate. If you experience SSL errors when running `dotnet restore`, see [Linux Setup](https://github.com/dotnet/core/blob/main/Documentation/linux-setup.md) for a possible resolution.

## Installing from a binary archive

You can install .NET with a binary archive. This option is required if you want to install .NET for a single user. It is also recommended if you want to install .NET temporarily.

The following workflow demonstrates downloading, unpacking, configuring, and running the .NET SDK from the command line. You may choose to do some of these tasks via the browser and functionality provided by your operating system.

```bash
~# curl -Lo dotnet.tar.gz http://aka.ms/dotnet/5.0/dotnet-sdk-linux-x64.tar.gz
~# mkdir dotnet
~# tar -C dotnet -xf dotnet.tar.gz
~# rm dotnet.tar.gz
~# export DOTNET_ROOT=~/dotnet
~# export PATH=$PATH:~/dotnet
~# dotnet --version
5.0.301
```

The `DOTNET_ROOT` environment variable is required to launch an application with their executables (like `myapp.exe`). The executables look for this environment variable to find the runtime if it isn't installed in its regular location. The `PATH` environment variable must be updated if you want to use `dotnet` without absolute paths to its location. Setting both of these environment variables is optional.

You can add your .NET install location permanently to your path if you'd like.
