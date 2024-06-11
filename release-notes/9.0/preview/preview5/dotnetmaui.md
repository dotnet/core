# .NET MAUI in .NET 9 Preview 5 - Release Notes

Here's a summary of what's new in .NET MAUI in this preview release:

- [Updated Blazor Hybrid Templates](#blazor-hybrid-updated-templates)
- [Android API 35 Beta 2 Support](#android-api-35-beta-2)
- [Android - LLVM Marshalled Methods](#llvm-marshalled-methods)
- [Android - Trimming Enhancements](#trimming-enhancements)

.NET MAUI updates in .NET 9 Preview 5:
* [Release notes](https://github.com/dotnet/core/blob/main/release-notes/9.0/preview/preview5/dotnetmaui.md) 
* [What's new in .NET MAUI in .NET 9](https://learn.microsoft.com/dotnet/maui/whats-new/dotnet-9) documentation.
* [GitHub Release](https://aka.ms/maui9p5)

.NET 9 Preview 5:
* [Discussion](https://aka.ms/dotnet/9/preview5)
* [Release notes](https://github.com/dotnet/core/blob/main/release-notes/9.0/preview/preview5/README.md)

## Blazor Hybrid Updated Templates

We have added a [new project template](https://github.com/dotnet/maui/pull/22234) that includes a Blazor Web app project, .NET MAUI Blazor hybrid app project, and a Razor class library project to enable better code sharing across native and web application targets. Use the new template from the dotnet command line.

```console
dotnet new maui-blazor-web -n AllTheTargets
```

## .NET for Android

### Android API 35 Beta 2

This release includes [Android API 35 Beta 2](https://developer.android.com/about/versions/15#beta-2) bindings, and improvements for startup performance and app size.

### LLVM marshalled methods

LLVM marshalled methods are now enabled by default in non-Blazor applications targeting Android. We have [noted a ~10% improvement in startup performance](https://github.com/xamarin/xamarin-android/pull/8925) in our test app. You can disable this in your project file.

```xml
<PropertyGroup Condition="'$(TargetFramework)' == 'net9.0-android'">
  <AndroidEnableLLVM>false</AndroidEnableLLVM>
  <AndroidEnableLLVMOptimizations>false</AndroidEnableLLVMOptimizations>
</PropertyGroup>
```

### Trimming Enhancements

Various fixes have been made when using full trimming to result in smaller applications. This is usually only enabled for release builds of your application, and you can configure it in your project file.

```xml
<PropertyGroup Condition="'$(Configuration)' == 'Release' And '$(TargetFramework)' == 'net9.0-android'">
	<TrimMode>Full</TrimMode>
</PropertyGroup>
```

- [GitHub Release](https://github.com/xamarin/xamarin-android/releases/)

## .NET for iOS

This release was focused on quality.

- [GitHub Release](https://github.com/xamarin/xamarin-macios/releases/)
- [Known issues](https://github.com/xamarin/xamarin-macios/wiki/Known-issues-in-.NET9)

## Community Contributions

