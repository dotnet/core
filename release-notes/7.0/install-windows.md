# .NET 7 installation instructions for Windows

The following instructions demonstrate installing .NET 7 on Windows. These instructions augment the more general [.NET install instructions](install.md), including installing with `.zip` files, that work on multiple operating systems.

## Distributions

The following distributions are available for Windows:

- .NET SDK: includes tools for building and testing applications, and includes the runtime distributions that follow.
- .NET Runtime: includes the .NET runtime and libraries, enabling running console applications.
- .NET Desktop Runtime: includes the .NET runtime and Windows desktop libraries, enabling running console, Windows Forms, and Windows Presentation Framework (WPF) applications.
- ASP.NET Core Runtime: includes the .NET and ASP.NET Core runtimes, enabling running console, and web applications.
- ASP.NET Core Hosting Bundle: includes the ASP.NET Core runtime and IIS support (for running both in- and out-of-process with IIS).

We recommend you install the .NET SDK to develop and build applications, and to install one of the runtimes packages (like ASP.NET Core) to exclusively run applications.

## Downloads

Each of the distributions can be downloaded from:

- [Microsoft .NET website](https://dotnet.microsoft.com/download/dotnet/7.0)
- [.NET 7 release notes](README.md)

[Container images](https://hub.docker.com/r/microsoft/dotnet/) are provided for Windows (Nano Server and Server Core) and Linux (Alpine, Debian, and Ubuntu).

## Windows Package Manager CLI (winget)

You can now install .NET updates using the Windows Package Manager CLI (winget):

- To install the .NET 7 runtime: `winget install dotnet-runtime-7`
- To install the .NET 7 SDK: `winget install dotnet-sdk-7`
- To update an existing installation: `winget upgrade`

See [Install with Windows Package Manager (winget)](https://learn.microsoft.com/dotnet/core/install/windows?tabs=net70#install-with-windows-package-manager-winget) for more information.

## Install using MSI

You can install any of the distributions with MSI. The following image demonstrates installing the .NET SDK. After launching the MSI, click "Install" and you will be taken through the process of installing the SDK.

![image](https://user-images.githubusercontent.com/94140381/186767749-45306b95-cd1b-4d85-9634-42fb83a1cf4b.png)

## Windows Server Hosting with IIS

You should install the Hosting Bundle MSI if you want to enable hosting ASP.NET Core with IIS.

## Installing from a binary archive

You can install .NET with a binary archive. This option is required if you want to install .NET for a single user. It is also recommended if you want to install .NET temporarily.

The following workflow demonstrates downloading, unpacking, configuring, and running the .NET SDK from the command line. You may choose to do some of these tasks via the browser and functionality provided by your operating system.

```console
C:\>curl -Lo dotnet.zip https://download.visualstudio.microsoft.com/download/pr/d0114a9c-5b5a-4af7-aa63-076f318ad181/e13facbfca6798141e1c67ae0c83f8d1/dotnet-sdk-7.0.100-rc.2.22477.23-win-x86.zip
C:\>tar -C dotnet -xf dotnet.zip
C:\>del dotnet.zip
C:\>set DOTNET_ROOT=C:\dotnet
C:\>set PATH=%PATH%;C:\dotnet
C:\>dotnet --version
7.0.100-rc.2.22477.23
```

The `DOTNET_ROOT` environment variable is required to launch an application with their executables (like `myapp.exe`). The executables look for this environment variable to find the runtime if it isn't installed in its regular location. The `PATH` environment variable must be updated if you want to use `dotnet` without absolute paths to its location. Setting both of these environment variables is optional.

You can add your .NET install location permanently to your path if you'd like.
