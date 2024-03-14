# .NET 9 installation instructions for Windows

The following instructions demonstrate installing .NET 9 on Windows. These instructions augment the more general [.NET install instructions](install.md), including installing with `.zip` files, that work on multiple operating systems.

## Distributions

The following distributions are available for Windows:

- .NET SDK: includes tools for building and testing applications, and includes the runtime distributions that follow.
- .NET Runtime: includes the .NET runtime and libraries, enabling running console applications.
- .NET Desktop Runtime: includes the .NET runtime and Windows desktop libraries, enabling running console, Windows Forms, and Windows Presentation Framework (WPF) applications.
- ASP.NET Core Runtime: includes the .NET and ASP.NET Core runtimes, enabling running console, and web applications.
- ASP.NET Core Hosting Bundle: includes the ASP.NET Core runtime and IIS support (for running both in- and out-of-process with IIS).

We recommend you install the .NET SDK to develop and build applications, and to install one of the runtime packages (like ASP.NET Core) to exclusively run applications.

## Downloads

Each of the distributions can be downloaded from:

- [Microsoft .NET website](https://dotnet.microsoft.com/download/dotnet/9.0)
- [.NET 9 release notes](README.md)

[Container images](https://hub.docker.com/_/microsoft-dotnet) are provided for Windows (Nano Server and Server Core) and Linux (Alpine, Debian, and Ubuntu).

## Windows Package Manager CLI (winget)

You can now install .NET updates using the Windows Package Manager CLI (winget):

- To install the .NET 9 runtime: `winget install dotnet-runtime-9`
- To install the .NET 9 SDK: `winget install dotnet-sdk-9`
- To update an existing installation: `winget upgrade`

See [Install with Windows Package Manager (winget)](https://learn.microsoft.com/dotnet/core/install/windows?tabs=net70#install-with-windows-package-manager-winget) for more information.

## Install using MSI

You can install any of the distributions with MSI. The following image demonstrates installing the .NET SDK. After launching the MSI, click "Install" and you will be taken through the process of installing the SDK.

![dotnet installer](https://github.com/dotnet/core/assets/44339330/62cbf002-89ab-4d63-9f0a-69460a6ab3d0)

## Windows Server Hosting with IIS

You should install the Hosting Bundle MSI if you want to enable hosting ASP.NET Core with IIS.

## Installing from a binary archive

You can install .NET with a binary archive. This option is required if you want to install .NET for a single user. It is also recommended if you want to install .NET temporarily.

The following workflow demonstrates downloading, unpacking, configuring, and running the .NET SDK from the command line. You may choose to do some of these tasks via the browser and functionality provided by your operating system.

```console
C:\>curl -Lo dotnet.zip https://download.visualstudio.microsoft.com/download/pr/e120265e-8b49-4faf-ae33-7828bbec8375/8d607b56fb4d92f8c456eff315d3d687/dotnet-sdk-9.0.100-preview.2.24157.14-win-x64.exe
C:\>tar -C dotnet -xf dotnet.zip
C:\>del dotnet.zip
C:\>set DOTNET_ROOT=C:\dotnet
C:\>set PATH=%PATH%;C:\dotnet
C:\>dotnet --version
9.0.100-preview.2.24157.14
```

The `DOTNET_ROOT` environment variable is required to launch an application with their executables (like `myapp.exe`). The executables look for this environment variable to find the runtime if it isn't installed in its regular location. The `PATH` environment variable must be updated if you want to use `dotnet` without absolute paths to its location. Setting both of these environment variables is optional.

You can add your .NET install location permanently to your path if you'd like.
