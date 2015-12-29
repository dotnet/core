# .NET Native Internal Compiler Errors

It looks like you probably hit a bug in .NET Native.
You can help make .NET better by sending a bug report.
However, take a look at the [Known Issues](#known-issues) section below
before sending a bug report. There may already be a
workaround for your issue.

## Creating and Sending a .NET Native repro

*NOTE: If you run this more than once, you'll want to make sure that the ilcRepro.zip doesn't already exist by deleting it out of the target folder. This is scheduled to be fixed for VS Update 2.*

1. Add `<NetNativeReproPath>C:\myReproDirectory</NetNativeReproPath>` to the primary PropertyGroup in your project file, the file ending in csproj, vsproj, vcxproj, or jsproj. You can set `C:\myReproDirectory` to any directory that exists. [Examples are below.](#examples)
2. Rebuild your app. You will find ilcRepro.zip in the repro directory you specified above.
3. Put ilcRepro.zip on your OneDrive, Dropbox, or another storage provider. Send a link to ilcRepro.zip and a description of your issue to dotnetnative@microsoft.com.
4. Remove `<NetNativeReproPath>` from your project file.

## Compilation Failure in Store

UWP apps containing managed code are compiled in Store using the .NET Native Toolchain. If there is a compilation failure in the Store, you will get an error message like the following:

`This submission failed due to compilation error {0}. More information about this error can be found here.`

In such a case, please ensure that you were able to build your application in Release mode successfully at the time you submitted it to Store. If it did, please send the error number you got in the message above and email dotnetnative@microsoft.com.

For help with any other issues, please share their details at https://connect.microsoft.com/visualstudio/

## Known Issues

### CoCreateInstance is not supported for this application type when running the Windows Application Certification Kit (WACK)
This error shows up in applications with a native code component:

`API CoCreateInstance in api-ms-win-core-com-l1-1-1.dll is not supported for this application type. SomeBinary.dll calls this API.`

This error can occur when running the WACK with your application in Release configuration and "Optimize Code" unchecked in your project properties. Ensure that "Optimize Code" is checked when submitting your application to the Store.

### Application was too large to be compiled in the Store
Some apps may successfully compile with the .NET Native Toolchain during development but fail to compile in Store due to their size. This issue has been mitigated with the release of the .NET Native Toolchain included in the Windows 10 Tools 1.1 Update.

You can see which version of the .NET Native Toolchain you have by opening AppxManifest.xml in the app package you submitted to Store and looking for `<build:Item Name="ilc.exe" Version="1.0.#####.00>`.  The initial release has version 1.0.23117.00, whereas the updated version in the Windows 10 Tools 1.1 update is 1.0.23303.00.

### Compilation Failure on Update 1

The error:

    RHBIND : error RHB0011: Internal error: 'declModule == m_pLoaderModule' at 'f:\dd\ndp\rh\src\tools\rhbind\methodtable.h:606'

A new .NET Native feature “SharedLibrary.dll” can expose an a bug in one of the compiler components "RHBind.exe". SharedLibrary is on be default for Update 1 but you can disable this feature to work around the issue by manipulating/adding this property to your project:
<UseDotNetNativeSharedAssemblyFrameworkPackage>false</UseDotNetNativeSharedAssemblyFrameworkPackage>

This will be fixed for Update 2 but anyone hitting this error will need to disable the SharedLibrary component until then. For more information about shared library please see: http://blogs.msdn.com/b/dotnet/archive/2015/09/28/what-s-new-for-net-and-uwp-in-win10-tools-1-1.aspx


### Other Known Issues
See: https://social.msdn.microsoft.com/Forums/en-US/home?forum=Win10SDKToolsIssues

## Examples

Below are examples of where to add the `<NetNativeReproPath>` tag.

### C# (*.csproj)

	<?xml version="1.0" encoding="utf-8"?>
	<Project ToolsVersion="14.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
	  <Import Project="$(MSBuildExtensionsPath)\$(MSBuildToolsVersion)\Microsoft.Common.props" Condition="Exists('$(MSBuildExtensionsPath)\$(MSBuildToolsVersion)\Microsoft.Common.props')" />
	  <PropertyGroup>
	    <Configuration Condition=" '$(Configuration)' == '' ">Debug</Configuration>
	    <Platform Condition=" '$(Platform)' == '' ">x86</Platform>
	    <ProjectGuid>{B44664F5-278C-4ABE-B62E-A5CA20E3DC48}</ProjectGuid>
	    <OutputType>AppContainerExe</OutputType>
	    <AppDesignerFolder>Properties</AppDesignerFolder>
	    <RootNamespace>App1</RootNamespace>
	    <AssemblyName>App1</AssemblyName>
	    <DefaultLanguage>en-US</DefaultLanguage>
	    <TargetPlatformIdentifier>UAP</TargetPlatformIdentifier>
	    <TargetPlatformVersion>10.0.10158.0</TargetPlatformVersion>
	    <TargetPlatformMinVersion>10.0.10158.0</TargetPlatformMinVersion>
	    <MinimumVisualStudioVersion>14</MinimumVisualStudioVersion>
	    <EnableDotNetNativeCompatibleProfile>true</EnableDotNetNativeCompatibleProfile>
	    <FileAlignment>512</FileAlignment>
	    <ProjectTypeGuids>{A5A43C5B-DE2A-4C0C-9213-0A381AF9435A};{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}</ProjectTypeGuids>
	    <PackageCertificateKeyFile>App1_TemporaryKey.pfx</PackageCertificateKeyFile>
	    <NetNativeReproPath>C:\myRepro</NetNativeReproPath>
	  </PropertyGroup>
	  ⋮
	</Project>

### VB (*.vbproj)

	<?xml version="1.0" encoding="utf-8"?>
	<Project ToolsVersion="14.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
	  <Import Project="$(MSBuildExtensionsPath)\$(MSBuildToolsVersion)\Microsoft.Common.props" Condition="Exists('$(MSBuildExtensionsPath)\$(MSBuildToolsVersion)\Microsoft.Common.props')" />
	  <PropertyGroup>
	    <Configuration Condition=" '$(Configuration)' == '' ">Debug</Configuration>
	    <Platform Condition=" '$(Platform)' == '' ">x86</Platform>
	    <ProjectGuid>{8C7ADA9E-47DF-4937-A1D9-62CA9B88A100}</ProjectGuid>
	    <OutputType>AppContainerExe</OutputType>
	    <RootNamespace>App4</RootNamespace>
	    <AssemblyName>App4</AssemblyName>
	    <DefaultLanguage>en-US</DefaultLanguage>
	    <TargetPlatformIdentifier>UAP</TargetPlatformIdentifier>
	    <TargetPlatformVersion>10.0.10158.0</TargetPlatformVersion>
	    <TargetPlatformMinVersion>10.0.10158.0</TargetPlatformMinVersion>
	    <MinimumVisualStudioVersion>14</MinimumVisualStudioVersion>
	    <EnableDotNetNativeCompatibleProfile>true</EnableDotNetNativeCompatibleProfile>
	    <FileAlignment>512</FileAlignment>
	    <ProjectTypeGuids>{A5A43C5B-DE2A-4C0C-9213-0A381AF9435A};{F184B08F-C81C-45F6-A57F-5ABD9991F28F}</ProjectTypeGuids>
	    <PackageCertificateKeyFile>App4_TemporaryKey.pfx</PackageCertificateKeyFile>
	    <NetNativeReproPath>C:\myRepro</NetNativeReproPath>
	  </PropertyGroup>
	  ⋮
	</Project>

### C++ (*.vcxproj)

	<?xml version="1.0" encoding="utf-8"?>
	<Project ToolsVersion="14.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
	  <PropertyGroup Label="Globals">
	    <ProjectGuid>{74010e92-8ead-4acc-8fc6-7db385af579b}</ProjectGuid>
	    <RootNamespace>App2</RootNamespace>
	    <DefaultLanguage>en-US</DefaultLanguage>
	    <MinimumVisualStudioVersion>14.0</MinimumVisualStudioVersion>
	    <AppContainerApplication>true</AppContainerApplication>
	    <ApplicationType>Windows Store</ApplicationType>
	    <WindowsTargetPlatformVersion>10.0.10158.0</WindowsTargetPlatformVersion>
	    <WindowsTargetPlatformMinVersion>10.0.10158.0</WindowsTargetPlatformMinVersion>
	    <ApplicationTypeRevision>10.0</ApplicationTypeRevision>
	    <EnableDotNetNativeCompatibleProfile>true</EnableDotNetNativeCompatibleProfile>
	    <NetNativeReproPath>C:\myRepro</NetNativeReproPath>
	  </PropertyGroup>
	  ⋮
	</Project>

### JS (*.jsproj)

	<?xml version="1.0" encoding="utf-8"?>
	<Project ToolsVersion="14.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
	  ⋮
	  <PropertyGroup>
	    <EnableDotNetNativeCompatibleProfile>true</EnableDotNetNativeCompatibleProfile>
	    <TargetPlatformIdentifier>UAP</TargetPlatformIdentifier>
	    <TargetPlatformVersion>10.0.10158.0</TargetPlatformVersion>
	    <TargetPlatformMinVersion>10.0.10158.0</TargetPlatformMinVersion>
	    <MinimumVisualStudioVersion>$(VersionNumberMajor).$(VersionNumberMinor)</MinimumVisualStudioVersion>
	    <DefaultLanguage>en-US</DefaultLanguage>
	    
	    <PackageCertificateKeyFile>App3_TemporaryKey.pfx</PackageCertificateKeyFile>
	    <NetNativeReproPath>C:\myRepro</NetNativeReproPath>
	  </PropertyGroup>
	  ⋮
	</Project>
