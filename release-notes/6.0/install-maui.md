# Install .NET Multi-platform App UI Workloads

As of .NET 6 preview 6, .NET MAUI is a workload. To install .NET MAUI with Android, iOS, and macOS (Mac Catalyst) SDKs:

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

* [Install .NET 6.0.0 Preview 6](#downloads)
* You will need the Android SDK installed as well as `Android SDK Platform 30`. One way to acquire this is to install the Xamarin workload in the Visual Studio installer. You can manage Android SDKs from `Tools > Android > Android SDK Manager` from within Visual Studio.

### iOS, Mac Catalyst, and macOS (Cocoa)

Prerequisites:

* [Install .NET 6.0.0 Preview 6](#downloads)
* Xcode 13.0 Beta 1

## Downloads

Download links are provided for each of the distributions at:

- [Microsoft .NET website](https://dotnet.microsoft.com/download/dotnet/6.0)
- [.NET 6 release notes](README.md)
