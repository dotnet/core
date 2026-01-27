# .NET 3.1 installation instructions for macOS

The following instructions demonstrate installing .NET 3.1 on macOS. These instructions augment the more general [.NET install instructions](install.md), including installing with `.tar.gz` files, that work on multiple operating systems.

## Distributions

The following distributions are available for Linux:

- .NET SDK: includes tools for building and testing applications, and includes the runtime distributions that follow.
- .NET Runtime: includes the .NET runtime and libraries, enabling running console applications.
- ASP.NET Core Runtime: includes the .NET and ASP.NET Core runtimes, enabling running console, and web applications.

We recommend you install the .NET SDK to develop and build applications, and to install one of the runtimes packages (like ASP.NET Core) to exclusively run applications.

## Downloads

Each of the distributions can be downloaded from:

- [Microsoft .NET website](https://dotnet.microsoft.com/download/dotnet/3.1)
- [.NET 3.1 release notes](README.md)

[Container images](https://hub.docker.com/r/microsoft/dotnet/) are provided for Linux (Alpine, Debian, and Ubuntu).

## Install using PKG

You can install any of the distributions with PKG. The following image demonstrates installing the .NET SDK. After launching the PKG, click "Continue" and you will be taken through the process of installing the SDK.

![image](https://user-images.githubusercontent.com/2212879/125341114-1d8dae00-e308-11eb-8af1-f5a147fd1c60.png)

## Installing from a binary archive

You can install .NET with a binary archive. This option is required if you want to install .NET for a single user. It is also recommended if you want to install .NET temporarily.

The following workflow demonstrates downloading, unpacking, configuring, and running the .NET SDK from the command line. You may choose to do some of these tasks via the browser and functionality provided by your operating system.

```bash
~# curl -Lo dotnet.tar.gz https://download.visualstudio.microsoft.com/download/pr/9db4cce9-8c78-47af-b3a1-b05e98870ab0/1d6062e2cc4ab529c0c1857a2c099b4e/dotnet-sdk-3.1.410-osx-x64.tar.gz
~# mkdir dotnet
~# tar -C dotnet -xf dotnet.tar.gz
~# rm dotnet.tar.gz
~# export DOTNET_ROOT=~/dotnet
~# export PATH=$PATH:~/dotnet
~# dotnet --version
3.1.410
```

The `DOTNET_ROOT` environment variable is required to launch an application with their executables (like `myapp.exe`). The executables look for this environment variable to find the runtime if it isn't installed in its regular location. The `PATH` environment variable must be updated if you want to use `dotnet` without absolute paths to its location. Setting both of these environment variables is optional.

You can add your .NET install location permanently to your path if you'd like.
