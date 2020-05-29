# dotnetsay .NET Core Global Tools Sample

This sample demonstrates how to use and create .NET Core Global Tools. It works on Windows, macOS and Linux.

You must have [.NET Core 2.1](https://dotnet.microsoft.com/download/dotnet-core/2.1) or higher installed.

## Try the pre-built `dotnetsay` Global Tool

You can quickly install and try the [dotnetsay global tool from nuget.org](https://www.nuget.org/packages/dotnetsay/) using the following commands.

```console
dotnet tool install -g dotnetsay
dotnetsay
```

> Note: You may need to open a new command/terminal window the first time you install a tool.

You can uninstall the tool using the following command.

```console
dotnet tool uninstall -g dotnetsay
```

## Getting the sample

The easiest way to get the sample is by cloning the samples repository with [git](https://git-scm.com/downloads), using the following instructions.

```console
git clone https://github.com/dotnet/core/
```

You can also [download the repository as a zip](https://github.com/dotnet/core/archive/master.zip).

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

The `PackAsTool` property in the [project file](dotnetsay.csproj) enables packing a console application as a global tool, as you can see in the following simplified example. Applications must target .NET Core 2.1 or higher for global tools.

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netcoreapp2.1</TargetFramework>
    <PackAsTool>true</PackAsTool>
  </PropertyGroup>

</Project>
```

## Enabling SourceLink with Tools

You can make tools debuggable with [sourcelink](https://github.com/dotnet/sourcelink) by adding the following properties and `PackageReference`. The example is specific to git and GitHub. See [dotnet/sourcelink](https://github.com/dotnet/sourcelink) for other options.

```xml
<PropertyGroup>
  <PublishRepositoryUrl>true</PublishRepositoryUrl>
  <DebugType>embedded</DebugType>
  <EmbedUntrackedSources>true</EmbedUntrackedSources>
</PropertyGroup>

<ItemGroup Condition="'$(ContinuousIntegrationBuild)'=='true'">
  <PackageReference Include="Microsoft.SourceLink.GitHub" Version="1.0.0-beta-62909-01" PrivateAssets="All"/>
</ItemGroup>
```

> Note: This example conditionalizes the `PackageReference` to the `ContinuousIntegrationBuild` property being set. There is no problem running SourceLink on every build, however, it will fail if it cannot find a `.git` directory. Given that behavior, it may be easier to use the approach shown above.

Use [`ContinuousIntegrationBuild`](https://github.com/dotnet/sourcelink/blob/master/docs/README.md#continuousintegrationbuild) when producing official builds. The simplest way to do that is by packing with an additional property set.

```console
dotnet pack -c Release -o nupkg /p:ContinuousIntegrationBuild=true
```

Make sure to build official packages from repositories with stable commit hashes. If you build from a branch whose commits are later [squashed](https://help.github.com/articles/about-pull-request-merges/), then the commit hashs will not be found and sourcelink will not work correctly.

## Debug Tools with Visual Studio

You can debug sourcelink-enabled .NET Core Global tools with Visual Studio, using the `Developer Command Prompt for VS 2017`. The following example launches `dotnetsay` for debugging:

```console
devenv /debugexe c:\Users\rich\.dotnet\tools\dotnetsay.exe
```

Set `Debugger Type` to `Managed (CoreCLR)` in `Properties`. Then `Step Into new instance` from the `Debug` menu.

![debugging-dotnetsay-configure](https://user-images.githubusercontent.com/2608468/40098555-db8cd828-5890-11e8-9549-b3bb1746c187.png)

You will be asked if you want to download source from GitHub. After that, you will then be able to step through the execution of the tool. 

![debugging-dotnetsay](https://user-images.githubusercontent.com/2608468/40098638-5a2be8b8-5891-11e8-83e7-905aa445c2fe.png)
