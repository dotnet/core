# dotnetsay .NET Core Global Tools Sample

This sample demonstrates how to use and create .NET Core Global Tools. It works on Windows, macOS and Linux.

You must have [.NET Core 2.1 Preview 1](https://blogs.msdn.microsoft.com/dotnet/2018/02/27/announcing-net-core-2-1-preview-1/) or higher installed.

## Try the pre-built `dotnetsay` Global Tool

You can quickly try the `dotnetsay` global tool using the following commands:

```console
dotnet install tool -g dotnetsay
dotnetsay
```

This command will install [dotnetsay from nuget.org](https://www.nuget.org/packages/dotnetsay/).

> Note: You may need to open a new command/terminal window the first time you install a tool.

## Getting the sample

The easiest way to get the sample is by cloning the samples repository with [git](https://git-scm.com/downloads), using the following instructions.

```console
git clone https://github.com/dotnet/core/
```

You can also [download the repository as a zip](https://github.com/dotnet/core/archive/master.zip).

## Build the Tool

You can build and run the sample using the following commands. The instructions assume that you are in the root of the repository.

```console
cd samples
cd dotnetsay
dotnet pack -c release -o nupkg
```

The last command packs the tool as a NuGet package in the `nupkg` directory. You can host the package at [nuget.org](https://www.nuget.org/) or any other NuGet feed. The tool is ready to install and test.

The `PackAsTool` property in the project file makes it a global tool, as you can see in the following example. That's all you need to add to a console app to make it a tool.

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netcoreapp2.1</TargetFramework>
    <PackAsTool>true</PackAsTool>
  </PropertyGroup>

</Project>
```

## Install the Tool

You can build and run the sample using the following command.

```console
dotnet install tool -g dotnetsay
```

For Preview 1, defining the source during installation doesn't work correctly, so you need a nuget.config file to test your new tool without deploying it to a NuGet feed. You can do this by placing this nuget.config in your project directory that looking similar to the followin example:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
 <packageSources>
    <clear/>
    <add key="local-packages" value="./nupkg" />
 </packageSources>
</configuration>
```

## Run the Tool

You can install the sample using the following command.

```console
dotnet install tool -g dotnetsay
```
