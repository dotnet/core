# .NET 5 installation instructions

Concise install instructions are provided in this document and may be augmented in [release notes](README.md) for a given update. Complete [.NET installation instructions for Windows, macOS, and Linux](https://learn.microsoft.com/dotnet/core/install/) are provided for supported releases in [.NET documentation](https://learn.microsoft.com/dotnet).

Operating system specific instructions:

- [Linux](install-linux.md)
- [macOS](install-macos.md)
- [Windows](install-windows.md)

## Distributions

The following distributions are available for all operating systems:

- .NET SDK: includes tools for building and testing applications, and includes the runtime distributions that follow.
- .NET Runtime: includes the .NET runtime and libraries, enabling running console applications.
- ASP.NET Core Runtime: includes the .NET and ASP.NET Core runtimes, enabling running console, and web applications.

We recommend that you install the .NET SDK to develop and build applications, and to install one of the runtimes packages (like ASP.NET Core) to (exclusively) run applications.

## Downloads

Download links are provided for each of the distributions at:

- [Microsoft .NET website](https://dotnet.microsoft.com/download/dotnet/5.0)
- [.NET 5 release notes](README.md)

[Container images](https://hub.docker.com/r/microsoft/dotnet/) are provided for Windows (Nano Server, and Server Core) and Linux (Alpine, Debian, and Ubuntu).

## What's installed?

You can determine what is installed on your machine (assuming .NET is installed) using the following approach, with `dotnet --info`.

```console
# dotnet --info
.NET SDK (reflecting any global.json):
 Version:   5.0.301
 Commit:    ef17233f86

Runtime Environment:
 OS Name:     fedora
 OS Version:  34
 OS Platform: Linux
 RID:         fedora.34-x64
 Base Path:   /dotnet/sdk/5.0.301/

Host (useful for support):
  Version: 5.0.7
  Commit:  556582d964

.NET SDKs installed:
  5.0.301 [/dotnet/sdk]

.NET runtimes installed:
  Microsoft.AspNetCore.App 5.0.7 [/dotnet/shared/Microsoft.AspNetCore.App]
  Microsoft.NETCore.App 5.0.7 [/dotnet/shared/Microsoft.NETCore.App]
```

If you have the .NET SDK installed, you can also use `dotnet --version` as demonstrated in the following example:

```console
C:\>dotnet --version
5.0.301
```
