# dotnetsay .NET Tool Sample

This sample demonstrates how to use and create .NET Tools. It works on Windows, macOS and Linux.

You must have the .NET SDK installed. [.NET Core 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1) is recommended.

## Installation

You can quickly install and try the [dotnetsay](https://www.nuget.org/packages/dotnetsay/):

```console
dotnet tool install -g dotnetsay
dotnetsay
```

> Note: You may need to open a new command/terminal window the first time you install a tool.

You can uninstall the tool using the following command.

```console
dotnet tool uninstall -g dotnetsay
```

Also see [dotnet-runtimeinfo](../dotnet-runtimeinfo/README.md).

## Build the Tool from source

You can build and package the tool using the following commands. The instructions assume that you are in the root of the repository.

```console
cd samples
cd dotnetsay
dotnet pack -c Release -o nupkg
dotnet tool install --add-source .\nupkg -g dotnetsay
dotnetsay
```

> Note: On macOS and Linux, `.\nupkg` will need be switched to `./nupkg` to accomodate for the different slash directions.

You can uninstall the tool using the following command.

```console
dotnet tool uninstall -g dotnetsay
```

The `PackAsTool` property in the [project file](dotnetsay.csproj) enables packing a console application as a global tool, as you can see in the following simplified example. Applications must target .NET Core 2.1 or higher for .NET Tools.

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netcoreapp2.1</TargetFramework>
    <PackAsTool>true</PackAsTool>
  </PropertyGroup>

</Project>
```

## Enabling Source Link with Tools

You can make tools and libraries debuggable with [Source Link](https://github.com/dotnet/sourcelink) by adding the following properties and `PackageReference`. The example is specific to git and GitHub. See [dotnet/sourcelink](https://github.com/dotnet/sourcelink) for other options.

```xml
<PropertyGroup>
  <PublishRepositoryUrl>true</PublishRepositoryUrl>
  <DebugType>embedded</DebugType>
  <EmbedUntrackedSources>true</EmbedUntrackedSources>
</PropertyGroup>

<ItemGroup>
  <PackageReference Include="Microsoft.SourceLink.GitHub" Version="1.0.0" PrivateAssets="All"/>
</ItemGroup>
```

When you or your users debug your binaries with Source Link, the debugger will attempt to retrieve content (like `.cs` files) from the recorded git commit in your binaries. The given commit needs to be published to a public or accessible private repo in order for that to work. This means that you should build from a branch whose commits are stable and already published. You can build from a PR branch, but the commits may not remain stable for long, as the PRs may be [squashed on merge](https://help.github.com/articles/about-pull-request-merges/).

For official builds, we recommend that you enable [`ContinuousIntegrationBuild`](https://github.com/dotnet/sourcelink/blob/master/docs/README.md#continuousintegrationbuild), so that the built artifacts are [reproducible and deterministic](https://reproducible-builds.org/) (same outcome independent of build machine or time).

The [dotnetsay project](dotnetsay.csproj) doesn't add these properties or the `PackageReference` but relies on the same information in the [Directory.Build.props](../Directory.Build.props) in the parent directory. The use of a Directory.Build.props is recommended for Source Link, to avoid maintaining these settings in multiple project files.

Source Link will fail if it cannot find a `.git` directory. This can happen if you build projects in containers at solution root and not repo root for example. There are solutions to that problem described at the [dotnet/sourcelink repo](https://github.com/dotnet/sourcelink).

## Debug Tools with Visual Studio

You can debug Source Link enabled .NET Tools with Visual Studio, using the `Developer Command Prompt for VS 2017`. The following example launches `dotnetsay` for debugging:

```console
devenv /debugexe c:\Users\rich\.dotnet\tools\dotnetsay.exe
```

Set `Debugger Type` to `Managed (CoreCLR)` in `Properties`. Then `Step Into new instance` from the `Debug` menu.

![debugging-dotnetsay-configure](https://user-images.githubusercontent.com/2608468/40098555-db8cd828-5890-11e8-9549-b3bb1746c187.png)

You will be asked if you want to download source from GitHub. After that, you will then be able to step through the execution of the tool. 

![debugging-dotnetsay](https://user-images.githubusercontent.com/2608468/40098638-5a2be8b8-5891-11e8-83e7-905aa445c2fe.png)
