# Using the .NET IL Linker

The .NET team has built a linker to reduce the size of applications. In trivial cases, it can reduce the size of applications by 50%. The size wins may be more favorable or more moderate for larger applications.

The linker currently only supports publishing self-contained applications. It will fail unless you specify a runtime ID. It is currently an experimental feature. We intend to productize it in a subsequent .NET Core release.

You can test the linker with a sample application:

* [.NET Core self-contained application Docker Production Sample -- using .NET IL Linker](https://github.com/dotnet/dotnet-docker-samples/blob/master/dotnetapp-selfcontained/README.md#build-run-and-publish-the-sample-locally)

## Instructions

The instructions assume you are using [.NET Core 2.0](https://github.com/dotnet/core/blob/master/release-notes/download-archive.md) or [.NET Core daily builds](https://github.com/dotnet/core/blob/master/daily-builds.md). You can validate your .NET Core SDK version by typing `dotnet --version`.

1. Select a project to test with. If you don't have one, you can do one of the following:
   * Create one with `dotnet new console`, or
   * Clone / download the [.NET Core self-contained application Docker Production Sample -- using .NET IL Linker].
1. Add a NuGet.Config file in the root of your project, using the following:
  * `dotnet new nuget`
  * Add this line to nuget.config: `<add key="dotnet-core" value="https://dotnet.myget.org/F/dotnet-core/api/v3/index.json" />`
  * The final file should look like [nuget.config](nuget.config).
1. Add a reference to the [latest version of the linker package](https://dotnet.myget.org/feed/dotnet-core/package/nuget/Illink.Tasks) in your .csproj, using the following:
   * `dotnet add package ILLink.Tasks -v 0.1.4-preview-906439`
1. Publish the application, using the following:
   * `dotnet publish -c release -r <RID> -o out`
   * where `<RID>` is one of `win-x64`, `win-x86`, `linux-x64`, `osx-x64` depending the OS that you want to publish for.
1. Run the application, with the following and depending the name of the application:
   * Windows: `out\app`
   * Linux/macOS: `./out/app`

### Linker Switches

The linker can be controlled with the following commandline switches.

* `/p:LinkDuringPublish=false` -- Disable the linker.
* `/p:ShowLinkerSizeComparison=true` -- Displays a table of size reductions for the application.

You must disable the linker if you want to publish a [framework dependent application](https://docs.microsoft.com/en-us/dotnet/core/deploying/) while you have ILLink.Tasks as a dependency. This behavior will b changed in a later release.

### Determining the Benefit of the linker

There are two straightforward approaches to determining the benefit of the linker.

* Publish an application with the linker enabled and pass the `/p:ShowLinkerSizeComparison=true` flag. The output will describe the benefit.
* Publish an application two different ways:
  * `dotnet publish -c release -r linux-x64 -o linkedapp`
  * `dotnet publish -c release -r linux-x64 -o notlinkedapp /p:LinkDuringPublish=false`

Note: The `linux-x64` runtime ID is used in the example above. Feel free to use any runtime ID that you would like.

### Feedback

Please provide feedback on your use of the linker. We are actively looking for feedback to improve the linker. In particular, we are looking for feedback on the following topics:

* Linker throughput.
* Cases where the linker can be more aggressive.
* Cahses where the link is too aggressive and causes applications to fail at runtime.

Please create issue with your feedback at either [mono/linker](https://github.com/mono/linker) or [dotnet/core](https://github.com/dotnet/core).
