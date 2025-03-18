# C# 14 updates in .NET 10 Preview 2 - Release Notes

Here's a summary of what's new in C# in this preview release:

- [Partial events and constructors](#partial-events-and-constructors)

C# 14 updates:

- [What's new in C# 14](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-14) documentation
- [Breaking changes in C# 14](https://learn.microsoft.com/dotnet/csharp/whats-new/breaking-changes/compiler%20breaking%20changes%20-%20dotnet%2010)

## Partial events and constructors

C# 14 rounds out the set of partial members by adding partial instance constructors and partial events. These new partial member types join partial methods and partial properties that were added in C# 13. Partial members allow one part of a class to declare a member, which can then be implemented in another part of the same class, often in a different file. Partial members are often used by source generators.
