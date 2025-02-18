# .NET MAUI in .NET 10 Preview 1 - Release Notes

This release was focused on quality improvements to .NET MAUI. You can find detailed information about the improvements in the GitHub Release below:

- [CollectionView enhancements for iOS and Mac Catalyst](#collectionview-enhancements-for-ios-and-mac-catalyst)
- [.NET MAUI GitHub Release Notes](https://aka.ms/maui10p1)
- [.NET for Android](#net-for-android)
- [.NET for iOS, Mac Catalyst, macOS, tvOS](#net-for-ios-mac-catalyst-macos-tvos)

.NET MAUI updates in .NET 10:

- [What's new in .NET MAUI in .NET 10](https://learn.microsoft.com/dotnet/maui/whats-new/dotnet-10) documentation.

> **Known Issue:** building `net8.0-*` target frameworks with the .NET 10 SDK does not work in Preview 1.

## CollectionView enhancements for iOS and Mac Catalyst

Two new handlers for `CollectionView` and `CarouselView` on iOS and Mac Catalyst that brought performance and stability improvements were available optionally in [.NET 9](https://learn.microsoft.com/dotnet/maui/whats-new/dotnet-9?view=net-maui-9.0#collectionview-and-carouselview). In this release they are now on by default. 

You can _opt out_ of these handlers by adding the following code to your `MauiProgram` class if you want to revert back.

```csharp
#if IOS || MACCATALYST
builder.ConfigureMauiHandlers(handlers =>
{
    handlers.AddHandler<Microsoft.Maui.Controls.CollectionView, Microsoft.Maui.Controls.Handlers.Items.CollectionViewHandler>();
    handlers.AddHandler<Microsoft.Maui.Controls.CarouselView, Microsoft.Maui.Controls.Handlers.Items.CarouselViewHandler>();
});
#endif
```

We are excited for you to give these new handlers a try. As a reminder, if you have .NET 9 applications you can try them today with the following code:

```csharp
#if IOS || MACCATALYST
builder.ConfigureMauiHandlers(handlers =>
{
    handlers.AddHandler<Microsoft.Maui.Controls.CollectionView, Microsoft.Maui.Controls.Handlers.Items2.CollectionViewHandler2>();
    handlers.AddHandler<Microsoft.Maui.Controls.CarouselView, Microsoft.Maui.Controls.Handlers.Items2.CarouselViewHandler2>();
});
#endif
```

## .NET for Android

This release was focused on quality improvements. A detailed list can be found on [dotnet/android GitHub releases](https://github.com/dotnet/android/releases/).

## .NET for iOS, Mac Catalyst, macOS, tvOS

This release was focused on quality improvements. A details list can be found on [xamarin/xamarin-macios GitHub released](https://github.com/xamarin/xamarin-macios/releases/) including a list of [Known issues](https://github.com/xamarin/xamarin-macios/wiki/Known-issues-in-.NET10).

## Community Contributions

Thanks to contributors ...
