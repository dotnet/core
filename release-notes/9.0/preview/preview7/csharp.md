# C# updates in .NET 9 Preview 7

Summary of what's new in C# in this release:

* [Prioritize better overloads with `OverloadResolutionPriority` attribute](#prioritize-better-overloads-with-overloadresolutionpriority-attribute)

What's new in C# for .NET 9:

* [Release notes](csharp.md)
* [What's new in C# 13](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-13) documentation.
* [Breaking changes in C# 13](https://learn.microsoft.com/dotnet/csharp/whats-new/breaking-changes/compiler%20breaking%20changes%20-%20dotnet%209) documentation.

.NET 9 Preview 7:

* [Discussion](https://aka.ms/dotnet/9/preview7)
* [Release notes](README.md)

## Prioritize better overloads with `OverloadResolutionPriority` attribute

C# introduces a new attribute, `System.Runtime.CompilerServices.OverloadResolutionPriority`, that can be used by API authors to adjust the relative priority of overloads within a single type as a means of steering API consumers to use specific APIs, even if those APIs would normally be considered ambiguous or otherwise not be chosen by C#'s overload resolution rules. This helps framework and library authors guide API usage as they APIs as they develop new and better patterns.

The `OverloadResolutionPriorityAttribute` can be used in conjunction with the [`ObsoleteAttribute`](https://learn.microsoft.com/dotnet/api/system.obsoleteattribute). A library author may mark properties, methods, types and other programming elements as obsolete, while leaving them in place for backwards compatibility. Using programming elements marked with the `ObsoleteAttribute` will result in compiler warnings or errors. However, the type or member is still visible to overload resolution and may be selected over a better overload or cause an ambiguity failure. The `OverloadResolutionPriorityAttribute` lets library authors fix these problems by lowering the priority of obsolete members when there are better alternatives.

We've already started using this attribute in the .NET libraries, with [Debug.Assert](https://github.com/dotnet/runtime/blob/019d7580a27db97f1fbdcf0d26f7ae3fa54fc2d1/src/libraries/System.Private.CoreLib/src/System/Diagnostics/Debug.cs#L81). This particular change is discussed in more detail in the [Libraries release notes](./libraries.md#debugassert-now-reports-assert-condition-by-default).