# .NET 6 installation instructions

Concise install instructions for Windows are provided in this document, and may be augmented in [release notes](README.md) for a given update. Complete [.NET installation instructions for Windows, macOS, and Linux](https://docs.microsoft.com/dotnet/core/install/) are provided for supported releases in [.NET documentation](https://docs.microsoft.com/dotnet).

Operating system specific instructions:

- [Linux](install-linux.md)
- [macOS](install-macos.md)
- [Windows](install-windows.md)

## Distributions

The following distributions are available for all operating systems:

- .NET SDK: includes tools for building and testing applications, and includes the runtime distributions that follow.
- .NET Runtime: includes the .NET runtime and libraries, enabling running console applications.
- ASP.NET Core Runtime: includes the .NET and ASP.NET Core runtimes, enabling running console, and web applications.

You are recommended to install the .NET SDK to develop and build applications, and to install one of the runtimes packages (like ASP.NET Core) to (exclusively) run applications.

## Downloads

Download links are provided for each of the distributions at:

- [Microsoft .NET website](https://dotnet.microsoft.com/download/dotnet/6.0)
- [.NET 6 release notes](README.md)

[Container images](https://hub.docker.com/r/microsoft/dotnet/) are provided for Windows (Nano Server, and Server Core) and Linux (Alpine, Debian, and Ubuntu).

## Installing from a binary archive

You can install .NET with a binary archive. This option is required if you want to install .NET for a single user. It is also recommended if you want to install .NET temporarily.

The following workflow demonstrates downloading, unpacking, configuring, and running the .NET SDK from the command line. You may choose to do some of these tasks via the browser and functionality provided by your operating system.

On Windows:

```console
C:\>curl -o dotnet.zip https://download.visualstudio.microsoft.com/download/pr/5b31ca8e-f684-4de7-9889-c53ce6cf9a3c/e85b1ef8dc6004c5f5bd0019771b21c5/dotnet-sdk-6.0.100-preview.2.21155.3-win-x64.zip
C:\>tar -C dotnet -xf dotnet.zip
C:\>del dotnet.zip
C:\>set DOTNET_ROOT=C:\dotnet
C:\>set PATH=%PATH%;C:\dotnet
C:\>dotnet --version
6.0.100-preview.2.21155.3
```

On macOS and Linux:

```bash
~# curl -o dotnet.tar.gz https://download.visualstudio.microsoft.com/download/pr/25c7e38e-0a6a-4d66-ac4e-b550a44b8a98/49128be84b903799259e7bebe8e9d969/dotnet-sdk-6.0.100-preview.2.21155.3-linux-x64.tar.gz
~# mkdir dotnet
~# tar -C dotnet -xf dotnet.tar.gz
~# rm dotnet.tar.gz
~# export DOTNET_ROOT=~/dotnet
~# export PATH=$PATH:~/dotnet
~# dotnet --version
6.0.100-preview.2.21155.3
```

The `DOTNET_ROOT` environment variable is required in order to launch application with their executables (like `myapp.exe`). The executables look for this environment variable to find the runtime if it is not installed in its regular location. The `PATH` environment variable must be updated if you want to use `dotnet` without absolute paths to its location. Setting both of these environment variables is optional.

You can add your .NET install location permanently to your path using the approach recommended for your operating system.

## What's installed?

You can determine what is installed on your machine using the following approach, with `dotnet --info`.

```console
C:\>dotnet --info
.NET SDK (reflecting any global.json):
 Version:   6.0.100-preview.2.21155.3
 Commit:    1a9103db2d

Runtime Environment:
 OS Name:     Windows
 OS Version:  10.0.17763
 OS Platform: Windows
 RID:         win10-x64
 Base Path:   C:\Program Files\dotnet\sdk\6.0.100-preview.2.21155.3\

Host (useful for support):
  Version: 6.0.0-preview.2.21154.6
  Commit:  3eaf1f316b

.NET SDKs installed:
  6.0.100-preview.2.21155.3 [C:\Program Files\dotnet\sdk]

.NET runtimes installed:
  Microsoft.AspNetCore.App 6.0.0-preview.2.21154.6 [C:\Program Files\dotnet\shared\Microsoft.AspNetCore.App]
  Microsoft.NETCore.App 6.0.0-preview.2.21154.6 [C:\Program Files\dotnet\shared\Microsoft.NETCore.App]
  Microsoft.WindowsDesktop.App 6.0.0-preview.2.21154.2 [C:\Program Files\dotnet\shared\Microsoft.WindowsDesktop.App]
```

If you have the .NET SDK installed, you can also use `dotnet --version` as demonstrated in the following example:

```console
C:\>dotnet --version
6.0.100-preview.2.21155.3
```
