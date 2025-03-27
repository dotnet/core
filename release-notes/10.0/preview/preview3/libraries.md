# .NET Libraries in .NET 10 Preview 3 - Release Notes

Here's a summary of what's new in .NET Libraries in this preview release:

- [Feature](#feature)

.NET Libraries updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Feature

Something about the feature.

## Introduce an AOT-Safe Constructor for `ValidationContext`

The `ValidationContext` class is used during options validation to provide validation context. Since extracting the `DisplayName` may involve reflection, all existing constructors of `ValidationContext` are currently marked as unsafe for AOT compilation. As a result, using `ValidationContext` in a native application build can generate warnings indicating that the type is unsafe.

To address this, we are introducing a new [`ValidationContext` constructor](https://github.com/dotnet/runtime/issues/113134#issuecomment-2715310131) that explicitly accepts the `displayName` as a parameter. This new constructor ensures AOT safety, allowing developers to use `ValidationContext` in native builds without encountering errors or warnings.

```csharp
namespace System.ComponentModel.DataAnnotations;

public sealed class ValidationContext
{
    public ValidationContext(object instance, string displayName, IServiceProvider? serviceProvider = null, IDictionary<object, object?>? items = null)
}
```

