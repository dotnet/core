# .NET 6 installation instructions for Windows

The following instructions demonstrate installing .NET 6 on Windows. These instructions augment the more general [.NET install instructions](install.md), including installing with `.zip` files, that work on multiple operating systems.

## Distributions

The following distributions are available for Windows:

- .NET SDK: includes tools for building and testing applications, and includes the runtime distributions that follow.
- .NET Runtime: includes the .NET runtime and libraries, enabling running console applications.
- .NET Desktop Runtime: includes the .NET runtime and Windows desktop libraries, enabling running console, Windows Forms, and Windows Presentation Framework (WPF) applications.
- ASP.NET Core Runtime: includes the .NET and ASP.NET Core runtimes, enabling running console, and web applications.
- ASP.NET Core Hosting Bundle: includes the ASP.NET Core runtime and IIS support (for running both in- and out-of-process with IIS).

You are recommended to install the .NET SDK to develop and build applications, and to install one of the runtimes packages (like ASP.NET Core) to exclusively run applications.

## Downloads

Each of the distributions can be downloaded from:

- [Microsoft .NET website](https://dotnet.microsoft.com/download/dotnet/6.0)
- [.NET 6 release notes](README.md)

[Container images](https://hub.docker.com/r/microsoft/dotnet/) are provided for Windows (Nano Server, and Server Core) and Linux (Alpine, Debian, and Ubuntu).

## Install using MSI

You can install any of the distributions with MSI. The following image demonstrates installing the .NET SDK. After launching the MSI, click "Install" and you will be taken through the process of installing the SDK.

![image](https://user-images.githubusercontent.com/2608468/112773547-4a34e880-8feb-11eb-8671-59fffceffd42.png)

## Windows Server Hosting with IIS

You should install the Hosting Bundle MSI if you want to enable hosting ASP.NET Core with IIS.
