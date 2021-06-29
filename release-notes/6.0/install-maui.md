# Install .NET Multi-platform App UI Workloads

To check your environment for dependencies and obtain the latest .NET MAUI SDKs, we recommend using the `maui-check` dotnet tool.

```console
$ dotnet tool install -g redth.net.maui.check
```

Then run the tool and follow the instructions presented:

```console
$ maui-check
```

Optionally, you can also use `dotnet workload install` from the command line to install individual SDKs:

```console
$ dotnet workload install microsoft-android-sdk-full
$ dotnet workload install microsoft-ios-sdk-full
$ dotnet workload install microsoft-maccatalyst-sdk-full
$ dotnet workload install microsoft-macos-sdk-full
$ dotnet workload install microsoft-tvos-sdk-full
```

See the [dotnet/maui-samples](https://github.com/dotnet/maui-samples/) repo for sample projects and further details about getting started.

### Android

Prerequisites:

* [Install .NET 6.0.0 Preview 5](#downloads)
* You will need the Android SDK installed as well as `Android SDK Platform 30`. One way to acquire this is to install the Xamarin workload in the Visual Studio installer. You can manage Android SDKs from `Tools > Android > Android SDK Manager` from within Visual Studio.

### iOS, Mac Catalyst, and macOS (Cocoa)

Prerequisites:

* [Install .NET 6.0.0 Preview 5](#downloads)
* Xcode 12.5

## Downloads

Download links are provided for each of the distributions at:

- [Microsoft .NET website](https://dotnet.microsoft.com/download/dotnet/6.0)
- [.NET 6 release notes](README.md)