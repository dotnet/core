# .NET Runtime in .NET 9 Preview 4- Release Notes

Here's a summary of what's new in the .NET Runtime in this preview release:

- [`UnsafeAccessorAttribute` supports generic parameters](#unsafeaccessorattribute-supports-generic-parameters)
- [Feature switches with trimming support](#feature-switches-with-trimming-support)

Runtime updates in .NET 9 Preview 4:

- [What's new in the .NET Runtime in .NET 9](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) documentation

.NET 9 Preview 4:

- [Discussion](https://aka.ms/dotnet/9/preview4)
- [Release notes](./README.md)
- [Libraries release notes](./libraries.md)

## `UnsafeAccessorAttribute` supports generic parameters

The [`UnsafeAccessorAttribute`](https://learn.microsoft.com/dotnet/api/system.runtime.compilerservices.unsafeaccessorattribute) feature allows unsafe access to type members that are unaccessible to the caller. This feature was [designed in .NET 8](https://github.com/dotnet/runtime/issues/81741) but implemented without support for generic parameters. In .NET 9, based on community feedback, we prioritized adding this support and it is now available for [CoreCLR and native AOT scenarios](https://github.com/dotnet/runtime/pull/99468). Remaining work, including support in mono, can be found [here](https://github.com/dotnet/runtime/issues/89439).

Usage example:

```csharp
public class Class<T>
{
    private T _field;
    private void M<U>(T t, U u) { }
}

class Accessors<V>
{
    [UnsafeAccessor(UnsafeAccessorKind.Field, Name = "_field")]
    public extern static ref V GetSetPrivateField(Class<V> c);

    [UnsafeAccessor(UnsafeAccessorKind.Method, Name = "M")]
    public extern static void CallM<W>(Class<V> c, V v, W w);
}

public void AccessGenericType(Class<int> c)
{
    ref int f = ref Accessors<int>.GetSetPrivateField(c);

    Accessors<int>.CallM<string>(c, 1, string.Empty);
}
```

## Feature switches with trimming support

Two new attributes make it possible to define [feature switches](https://github.com/dotnet/designs/blob/main/accepted/2020/feature-switch.md) that can be used to toggle areas of functionality in .NET libraries, with support for removing unused features when trimming or native AOT compiling. For example, these attributes are used in the definitions of [`RuntimeFeature.IsDynamicCodeSupported`](https://github.com/dotnet/runtime/blob/24562bcabefaea5e03c74d01e4df8fc7c112a13a/src/libraries/System.Private.CoreLib/src/System/Runtime/CompilerServices/RuntimeFeature.NonNativeAot.cs#L10-L11) and [`RuntimeFeature.IsDynamicCodeCompiled`](https://github.com/dotnet/runtime/blob/24562bcabefaea5e03c74d01e4df8fc7c112a13a/src/libraries/System.Private.CoreLib/src/System/Runtime/CompilerServices/RuntimeFeature.NonNativeAot.cs#L19-L20)


### FeatureSwitchDefinition

`FeatureSwitchDefinitionAttribute` can be used to treat a feature switch property as a constant when trimming:

```csharp
public class Feature
{
    [FeatureSwitchDefinition("Feature.IsSupported")]
    internal static bool IsSupported => AppContext.TryGetSwitch("Feature.IsSupported", out bool isEnabled) ? isEnabled : true;

    internal static Implementation() => ...;
}
```

This allows dead code guarded by the switch to be removed. For example:

```csharp
if (Feature.IsSupported)
    Feature.Implementation();
```

When the app is trimmed with the following feature settings, `Feature.IsSupported` is treated as `false`, and `Feature.Implementation` is removed.

```xml
<ItemGroup>
  <RuntimeHostConfigurationOption Include="Feature.IsSupported" Value="false" Trim="true" />
</ItemGroup>
```

### FeatureGuard

`FeatureGuardAttribute` can be used to treat a feature switch property as a guard for code annotated with `RequiresUnreferencedCodeAttribute`, `RequiresAssemblyFilesAttribute`, or `RequiresDynamicCodeAttribute`:

```csharp
public class Feature
{
    [FeatureGuard(typeof(RequiresDynamicCodeAttribute))]
    internal static bool IsSupported => RuntimeFeature.IsDynamicCodeSupported;

    [RequiresDynamicCode("Feature requires dynamic code support.")]
    internal static Implementation() => ...; // Uses dynamic code
}
```

Because the `IsSupported` property returns false whenever dynamic code is not supported, `Feature.IsSupported` can be used as a guard for methods that requires dynamic code at runtime. The `FeatureGuardAttribute` makes this known to the trim analyzer and the trimming tools. For example:

```csharp
if (Feature.IsSupported)
    Feature.Implementation();
```

When built with `<PublishAot>true</PublishAot>`, the call to `Feature.Implementation()` will not produce analyzer warning [IL3050](https://learn.microsoft.com/dotnet/core/deploying/native-aot/warnings/il3050), and `Feature.Implementation` will be removed when publishing.