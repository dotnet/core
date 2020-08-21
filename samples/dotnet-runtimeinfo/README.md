# dotnet-runtimeinfo tool

`dotnet-runtimeinfo` prints information about your .NET, OS and hardware environment. It is also a demonstration of the APIs you can use to get this information for your own uses. This information is likely useful for logging.

You must have the .NET SDK installed, [.NET Core 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1) or higher.

## Installation

You can quickly install and try the [dotnet-runtimeinfo](https://www.nuget.org/packages/dotnet-runtimeinfo/):

```console
dotnet tool install -g dotnet-runtimeinfo
dotnet-runtimeinfo
```

> Note: You may need to open a new command/terminal window the first time you install a tool.

You can uninstall the tool using the following command.

```console
dotnet tool uninstall -g dotnet-runtimeinfo
```

## Usage

```console
dotnet-runtimeinfo
**.NET Core information
Version: 3.1.7
FrameworkDescription: .NET Core 3.1.7
Libraries version: 3.1.7-servicing.20366.2
Libraries hash: e8b17841cb5ce923aec48a1b0c12042d445d508f

**Environment information
OSDescription: Darwin 19.6.0 Darwin Kernel Version 19.6.0: Sun Jul  5 00:43:10 PDT 2020; root:xnu-6153.141.1~9/RELEASE_X86_64
OSVersion: Unix 19.6.0.0
OSArchitecture: X64
ProcessorCount: 8
```

## More information

The [dotnetsay tool sample](../dotnetsay/README.md) includes more information on .NET tools.
