# dotnetsay .NET Core Global Tools Sample

This sample demonstrates how to use and create .NET Core Global Tools. It works on Windows, macOS and Linux.

You must have [.NET Core 2.1 RC 1](https://blogs.msdn.microsoft.com/dotnet/2018/05/07/announcing-net-core-2-1-rc-1/) or higher installed.

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
dotnet pack -c release -o nupkg
dotnet tool install --source-feed C:\git\core\samples\dotnetsay\nupkg -g dotnetsay
dotnetsay
```

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
  <RepositoryType>git</RepositoryType>
  <PublishRepositoryUrl>true</PublishRepositoryUrl>
  <DebugType>embedded</DebugType>
  <EmbedUntrackedSources>true</EmbedUntrackedSources>
</PropertyGroup>

<ItemGroup>
  <PackageReference Include="Microsoft.SourceLink.GitHub" Version="1.0.0-beta-62905-03" PrivateAssets="All"/>
</ItemGroup>
```

Use [`DeterministicSourcePaths`](https://github.com/dotnet/sourcelink/blob/master/docs/README.md#deterministicsourcepaths) when producting official builds. The simplest way to do that is by packing with an additional property set.

```console
dotnet pack -c release -o nupkg /p:DeterministicSourcePaths=true
```

Make sure to build official packages from repositories with stable commit hashes. If you build from a branch who commits are later [squashed](https://help.github.com/articles/about-pull-request-merges/), then the commit hashs will not be found and sourcelink will not work correctly.