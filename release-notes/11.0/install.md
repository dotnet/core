# .NET 11 installation instructions

Concise install instructions are provided in this document and may be augmented in [release notes](README.md) for a given update. Complete [.NET installation instructions for Windows, macOS, and Linux](https://learn.microsoft.com/dotnet/core/install/) are provided for supported releases in [.NET documentation](https://learn.microsoft.com/dotnet).

Operating system specific instructions:

- [Linux](install-linux.md)
- [macOS](install-macos.md)
- [Windows](install-windows.md)

## [Using dotnet-install-scripts](https://learn.microsoft.com/dotnet/core/tools/dotnet-install-script)

### Install the latest preview version of the 11.0.1xx SDK to the specified location

Windows:

```console
./dotnet-install.ps1 -Channel 11.0.1xx -Quality preview -InstallDir C:\cli
```

macOS/Linux:

```console
./dotnet-install.sh --channel 11.0.1xx --quality preview --install-dir ~/cli
```

### Install the latest preview version of the 11.0.0 runtime to the specified location

Windows:

```console
.\.dotnet\dotnet-install.ps1 -Channel 11.0 -Runtime dotnet -Quality preview -InstallDir c:\cli
```

macOs/Linux:

```console
./dotnet-install.sh --runtime dotnet --channel 11.0 --quality preview --install-dir ~/cli
```

## Distributions

The following distributions are available for all operating systems:

- .NET SDK: includes tools for building and testing applications, and includes the runtime distributions that follow.
- .NET Runtime: includes the .NET runtime and libraries, enabling running console applications.
- ASP.NET Core Runtime: includes the .NET and ASP.NET Core runtimes, enabling running console, and web applications.

We recommend that you install the .NET SDK to develop and build applications, and to install one of the runtime packages (like ASP.NET Core) to (exclusively) run applications.

## Downloads

Download links are provided for each of the distributions at:

- [Microsoft .NET website](https://dotnet.microsoft.com/download/dotnet/11.0)
- [.NET 11 release notes](README.md)

[Container images](https://hub.docker.com/_/microsoft-dotnet) are provided for Linux (Alpine, Debian, Ubuntu, Azure Linux, and distroless variants of Ubuntu and Azure Linux) and Windows (Nano Server and Server Core).

## What's installed?

You can determine what is installed on your machine (assuming .NET is installed) using the following approach, with `dotnet --info`.

```console
C:\>dotnet --info
.NET SDK (reflecting any global.json):
Version:   11.0.100-preview.2.26159.112
Commit:    abcdef1234

Runtime Environment:
 OS Name:     Mac OS X
 OS Version:  15.0
 OS Platform: Darwin
 RID:         osx-arm64
 Base Path:   /usr/local/share/dotnet/sdk/11.0.100-preview.2.26159.112/

Host:
  Version:      11.0.0-preview.2.26159.112
  Architecture: arm64
  Commit:       abcdef1234

.NET SDKs installed:
11.0.100-preview.2.26159.112 [/usr/local/share/dotnet/sdk]

.NET runtimes installed:
  Microsoft.AspNetCore.App 11.0.0-preview.2.26159.112 [/usr/local/share/dotnet/shared/Microsoft.AspNetCore.App]
  Microsoft.NETCore.App 11.0.0-preview.2.26159.112 [/usr/local/share/dotnet/shared/Microsoft.NETCore.App]
```

If you have the .NET SDK installed, you can also use `dotnet --version` as demonstrated in the following example:

```console
C:\>dotnet --version
11.0.100-preview.2.26159.112
```
