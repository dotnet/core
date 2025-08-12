# .NET SDK in .NET 10 Preview 7 - Release Notes

Here's a summary of what's new in the .NET SDK in this preview release:

- [Use the `any` RuntimeIdentifier with platform-specific .NET Tools](#any-rid-in-multi-rid-tools)

.NET SDK updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Use the `any` RuntimeIdentifier with platform-specific .NET Tools {#any-rid-in-multi-rid-tools}

The [platform-specific .NET Tools](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-10/sdk#platform-specific-net-tools) feature released in preview 6
is great for making sure your tools are optimized for specific platforms that you target ahead-of-time. However, there are times where you won't know
all of the platforms that you'd like to target, or sometimes .NET itself will learn how to support a new platform, and you'd like your tool to be runnable there too!

The good news is that .NET is great at this - the platform at its heart is meant to support this kind of platform-agnostic execution. To make your new
platform-specific .NET Tools work this way, you only need to add one thing to your project file: the `any` Runtime Identifier.

```diff
<PropertyGroup>
  <RuntimeIdentifiers>
        linux-x64;
        linux-arm64;
        macos-arm64;
        win-x64;
-       win-arm64
+       win-arm64;
+       any
  </RuntimeIdentifiers>
</PropertyGroup>
```

This RuntimeIdentifier is at the 'root' of our platform-compatibility checking, and since it declares support for, well, _any_ platform, the tool that we package for you will be the most compatible kind of tool - a framework-dependent, platform-agnostic .NET dll, which requires a compatible .NET Runtime in order to execute. When you perform a `dotnet pack` to create your tool, you'll see a new package for the `any` RuntimeIdentifier appear alongside the other platform-specific packages and the top-level manifest package.

The eagle-eyed among you will note that this is the exact same kind of tool that you would make in .NET 9 and earlier, but now it fits into the overall goal of enabling platform-specific .NET Tools!
