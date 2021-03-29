# .NET 6 installation instructions for macOS

The following instructions demonstrate installing .NET 6 on macOS. These instructions augment the more general [.NET install instructions](install.md), including installing with `.tar.gz` files, that work on multiple operating systems.

## Distributions

The following distributions are available for Linux:

- .NET SDK: includes tools for building and testing applications, and includes the runtime distributions that follow.
- .NET Runtime: includes the .NET runtime and libraries, enabling running console applications.
- ASP.NET Core Runtime: includes the .NET and ASP.NET Core runtimes, enabling running console, and web applications.

You are recommended to install the .NET SDK to develop and build applications, and to install one of the runtimes packages (like ASP.NET Core) to exclusively run applications.

## Downloads

Each of the distributions can be downloaded from:

- [Microsoft .NET website](https://dotnet.microsoft.com/download/dotnet/6.0)
- [.NET 6 release notes](README.md)

[Container images](https://hub.docker.com/r/microsoft/dotnet/) are provided for Linux (Alpine, Debian, and Ubuntu).

## Install using PKG

You can install any of the distributions with PKG. The following image demonstrates installing the .NET SDK. After launching the PKG, click "Continue" and you will be taken through the process of installing the SDK.

![image](https://user-images.githubusercontent.com/2608468/112776700-355d5280-8ff5-11eb-979c-8cab273f5f97.png)
