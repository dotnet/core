# C# updates in .NET 9 Preview 6

Here's a summary of what's new in C# in this preview release:

- [Partial properties](#partial-properties)

C# updates in .NET 9 Preview 6:
* [What's new in C# 13](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-13) documentation.
* [Breaking changes in C# 13](https://learn.microsoft.com/dotnet/csharp/whats-new/breaking-changes/compiler%20breaking%20changes%20-%20dotnet%209) documentation.

.NET 9 Preview 6:
* [Discussion](https://aka.ms/dotnet/9/preview6)
* [Release notes](./README.md)

## Partial properties
 
C# 13 adds partial properties. Like partial methods their primary purpose is to support source generators. Partial methods have been available for many releases with additional improvements in C# 9. Partial properties are much like their partial method counterparts.
 
For example, starting with .NET 7 (C# 12), the regular expression source generator creates efficient code for methods:
 
```csharp
[GeneratedRegex("abc|def")]
private static partial Regex AbcOrDefMethod();
 
if (AbcOrDefMethod().IsMatch(text))
{
   // Take action with matching text
}
```
 
The Regex source generator has been updated and if you prefer to use a property, you can also use:
 
```csharp
[GeneratedRegex("abc|def")]
private static partial Regex AbcOrDefProperty { get; }
 
if (AbcOrDefProperty.IsMatch(text))
{
   // Take action with matching text
}
```
 
Partial properties will make it easier for source generator designers to create natural feeling APIs.

## Get started with C# 13

There are a lot more features in C# 13 for you to try today. Be sure to read our recent [blog on all of the features available](https://devblogs.microsoft.com/dotnet/csharp-13-explore-preview-features) in preview and our always up to date documentation on [What's new in C# 13](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-13).
