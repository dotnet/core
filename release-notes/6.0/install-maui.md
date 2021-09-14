# Install .NET Multi-platform App UI Workloads

As of .NET 6 rc 1, .NET MAUI is a .NET workload, and is available within the Visual Studio 2022 Preview 4 installer. 

## Visual Studio 2022 Installation

When installing Visual Studio 2022 Preview 4, select the "Mobile development with .NET" workload, and under Optional check the ".NET MAUI (Preview)" box. To enable desktop development, select the workloads: ".NET desktop development", "Desktop development with C++", and "Universal Windows Platform development".

To enable debugging Windows applications, install the [Single-project MSIX packaging tools for Visual Studio 2022 extension](https://marketplace.visualstudio.com/items?itemName=ProjectReunion.MicrosoftSingleProjectMSIXPackagingToolsDev17).

## CLI Installation

To install .NET MAUI with Android, iOS, and macOS (Mac Catalyst) SDKs:

```console
$ dotnet workload install maui
```

We also have targeted workload manifests for mobile and desktop only:

```console
$ dotnet workload install maui-desktop
$ dotnet workload install maui-mobile
```

Optionally, for more granular control you can install platform SDKs individually:

```console
$ dotnet workload install microsoft-android-sdk-full
$ dotnet workload install microsoft-ios-sdk-full
$ dotnet workload install microsoft-maccatalyst-sdk-full
$ dotnet workload install microsoft-macos-sdk-full
$ dotnet workload install microsoft-tvos-sdk-full
```

To check your environment for additional dependencies and obtain the latest .NET MAUI SDKs, we recommend using our `maui-check` dotnet tool.

```console
$ dotnet tool install -g redth.net.maui.check
```

Then run the tool and follow the instructions presented:

```console
$ maui-check
```

See our [documentation](https://docs.microsoft.com/dotnet/maui/get-started/installation) for further details about getting started, including installing Windows App SDK requirements.

### Android

Prerequisites:

* [Install .NET 6.0.0 rc 1](#downloads)
* Android SDK Platform API 31. One way to install API 31 is via Android Studio.
* [JDK 11](https://www.microsoft.com/openjdk)

### iOS, Mac Catalyst, and macOS (Cocoa)

Prerequisites:

* [Install .NET 6.0.0 rc 1](#downloads)
* Xcode 13.0 Beta (latest)

## Downloads

Download links are provided for each of the distributions at:

- [Microsoft .NET website](https://dotnet.microsoft.com/download/dotnet/6.0)
- [.NET 6 release notes](README.md)
