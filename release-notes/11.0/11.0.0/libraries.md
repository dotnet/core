# Libraries updates in .NET 11

For features introduced throughout the release, see [What's new in the .NET 11 libraries](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/libraries).

See the [runtime repository changelog](https://github.com/dotnet/runtime/compare/474ed963699fc29809015392738a15231aaae2de...5a720bffcf31577eff28c81adb6f7b7788172ece) for library and runtime changes since RC3.

## Breaking changes from .NET 10

Before upgrading an existing app or updating library packages, review [Breaking changes in .NET 11](https://learn.microsoft.com/dotnet/core/compatibility/11), including the guidance on [tensor shape alignment](https://learn.microsoft.com/dotnet/core/compatibility/core-libraries/11/tensor-shape-alignment) and [tensor storage-layout validation](https://learn.microsoft.com/dotnet/core/compatibility/core-libraries/11/tensor-storage-layout-validation).

## Changes for users of earlier release candidates

`ZstandardDictionary.Train` now returns raw dictionary bytes (`byte[]`) instead of a prepared `ZstandardDictionary`. Pass those bytes to `ZstandardDictionary.Create` to prepare a dictionary with your chosen compression quality ([dotnet/runtime#135756](https://github.com/dotnet/runtime/pull/135756)).

<!-- API signatures and replacement usage verified against the supplied local .NET 11.0.0 build with SDK 11.0.100. Correlation with the final public GA artifact is pending. -->
