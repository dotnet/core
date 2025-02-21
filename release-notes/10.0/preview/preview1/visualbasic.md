# Visual Basic updates in .NET 10 Preview 1 - Release Notes

.NET 10 Preview 1 includes the following Visual Basic features & enhancements:

- [`unmanaged` constraint support](#unmanaged-constraint-support)
- [Honor overload resolution priority](#honor-overload-resolution-priority)

These features are part of our strategy to ensure that Visual Basic can consume updated features in C# and the runtime. These features won't change how you write Visual Basic code, you'll just find it easier to use the latest runtime APIs.

Visual Basic updates:

- [What's new in Visual Basic](https://learn.microsoft.com/dotnet/visual-basic/whats-new/) documentation
- [Breaking changes](https://learn.microsoft.com/dotnet/visual-basic/whats-new/breaking-changes)

## `unmanaged` constraint support

C# added the `unmanaged` generic constraint. The Visual Basic compiler now interprets that constraint and enforces it. Previously, the Visual Basic compiler issues an error if you access a type parameter with the `unmanaged` constraint. You can learn more in the article on [generic types](https://learn.microsoft.com//dotnet/visual-basic/programming-guide/language-features/data-types/generic-types#types-of-constraints) in the Visual Basic documentation.

## Honor overload resolution priority

The Visual Basic compiler now respects the [`OverloadResolutionPriorityAttribute`](https://learn.microsoft.com/dotnet/api/system.runtime.compilerservices.overloadresolutionpriorityattribute) used to resolve ambiguities among method overloads. This feature means that new, faster Span-based overloads are preferred by the VB compiler. Without this, VB would either get a slower overload, or have an ambiguity. You can learn how it works in the article on [overload resolution](https://learn.microsoft.com/dotnet/visual-basic/programming-guide/language-features/procedures/overload-resolution)
