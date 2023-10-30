# .NET 7 installation instructions

Concise install instructions are provided in this document and may be augmented in [release notes](README.md) for a given update. Complete [.NET installation instructions for Windows, macOS, and Linux](https://learn.microsoft.com/dotnet/core/install/) are provided for supported releases in [.NET documentation](https://learn.microsoft.com/dotnet).

Operating system specific instructions:

- [Linux](install-linux.md)
- [macOS](install-macos.md)
- [Windows](install-windows.md)

## [Using dotnet-install-scripts](https://learn.microsoft.com/dotnet/core/tools/dotnet-install-script)

### Install the latest preview version of the 7.0.1xx SDK to the specified location

Windows:

```console
./dotnet-install.ps1 -Channel 7.0.1xx -Quality preview -InstallDir C:\cli
```

macOS/Linux:

```console
./dotnet-install.sh --channel 7.0.1xx --quality preview --install-dir ~/cli
```

### Install the latest preview version of the 7.0.0 runtime to the specified location

Windows:

```console
.\.dotnet\dotnet-install.ps1 -Channel 7.0 -Runtime dotnet -Quality preview -InstallDir c:\cli
```

macOs/Linux:

```console
./dotnet-install.sh --runtime dotnet --channel 7.0 --quality preview --install-dir ~/cli
```

## Distributions

The following distributions are available for all operating systems:

- .NET SDK: includes tools for building and testing applications, and includes the runtime distributions that follow.
- .NET Runtime: includes the .NET runtime and libraries, enabling running console applications.
- ASP.NET Core Runtime: includes the .NET and ASP.NET Core runtimes, enabling running console, and web applications.

We recommend that you install the .NET SDK to develop and build applications, and to install one of the runtimes packages (like ASP.NET Core) to (exclusively) run applications.

## Downloads

Download links are provided for each of the distributions at:

- [Microsoft .NET website](https://dotnet.microsoft.com/download/dotnet/7.0)
- [.NET 7 release notes](README.md)

[Container images](https://hub.docker.com/r/microsoft/dotnet/) are provided for Windows (Nano Server, and Server Core) and Linux (Alpine, Debian, and Ubuntu).

## What's installed?

You can determine what is installed on your machine (assuming .NET is installed) using the following approach, with `dotnet --info`.

```console
C:\>dotnet --info
.NET SDK (reflecting any global.json):
Version:   7.0.100-rc.2.22477.23
 Commit:    0a5360315a

Runtime Environment:
 OS Name:     Mac OS X
 OS Version:  12.6
 OS Platform: Darwin
 RID:         osx.12-x64
 Base Path:   /usr/local/share/dotnet/x64/sdk/7.0.100-rc.2.22477.23/

Host:
  Version:      7.0.0-rc.2.22472.3
  Architecture: x64
  Commit:       550605cc93

.NET SDKs installed:
  7.0.100-rc.2.22477.23 [/usr/local/share/dotnet/x64/sdk]

.NET runtimes installed:
  Microsoft.AspNetCore.App 7.0.0-rc.2.22476.2 [/usr/local/share/dotnet/x64/shared/Microsoft.AspNetCore.App]
  Microsoft.NETCore.App 7.0.0-rc.2.22472.3 [/usr/local/share/dotnet/x64/shared/Microsoft.NETCore.App]
```

If you have the .NET SDK installed, you can also use `dotnet --version` as demonstrated in the following example:

```console
C:\>dotnet --version
7.0.100-rc.2.22477.23
```
