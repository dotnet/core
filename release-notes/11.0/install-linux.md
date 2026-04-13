# .NET 11 installation instructions for Linux

The following instructions demonstrate installing .NET 11 on Linux. These instructions augment the more general [Install .NET on Linux](https://learn.microsoft.com/dotnet/core/install/linux) guidance, including installing with `.tar.gz` files.

For distro-specific guidance, see:

- [Supported Linux distributions](supported-os.md)
- [.NET 11 Linux package dependencies](dotnet-dependencies.md)
- [Linux package feeds and availability](../../linux.md#packages)

## Distributions

The following distributions are available for Linux:

- .NET SDK: includes tools for building and testing applications, and includes the runtime distributions that follow.
- .NET Runtime: includes the .NET runtime and libraries, enabling running console applications.
- ASP.NET Core Runtime: includes the .NET and ASP.NET Core runtimes, enabling running console, and web applications.

We recommend you install the .NET SDK to develop and build applications, and to install one of the runtime packages (like ASP.NET Core) to exclusively run applications.

## Downloads

Each of the distributions can be downloaded from:

- [`aka.ms/dotnet`](https://dotnet.microsoft.com/download)
- [.NET 11 release notes](README.md)

## Installing from a binary archive

You can install .NET with a binary archive. This option is required if you want to install .NET for a single user. It is also recommended if you want to install .NET temporarily.

The following workflow demonstrates downloading, unpacking, configuring, and running the .NET SDK from the command line. You may choose to do some of these tasks via the browser and functionality provided by your operating system.

```bash
~# curl -Lo dotnet.tar.gz https://aka.ms/dotnet/11.0/preview/dotnet-sdk-linux-x64.tar.gz
~# mkdir dotnet
~# tar -C dotnet -xf dotnet.tar.gz
~# rm dotnet.tar.gz
~# export DOTNET_ROOT=~/dotnet
~# export PATH=$PATH:~/dotnet
~# dotnet --version
11.0.100-preview.2.26159.112
```

The `DOTNET_ROOT` environment variable is required to launch an application with their executables (like `myapp.exe`). The executables look for this environment variable to find the runtime if it isn't installed in its regular location. The `PATH` environment variable must be updated if you want to use `dotnet` without absolute paths to its location. Setting both of these environment variables is optional.

You can add your .NET install location permanently to your path if you'd like.
