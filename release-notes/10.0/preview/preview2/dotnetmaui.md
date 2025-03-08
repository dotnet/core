# .NET MAUI in .NET 10 Preview 2 - Release Notes

This release is focused on quality improvements to .NET MAUI, .NET for Android, and .NET for iOS, Mac Catalyst, macOS, and tvOS. You can find detailed information about the improvements below:

- .NET MAUI
  - [ShadowTypeConverter](#shadowtypeconverter)
  - [SpeechOptions Rate](#speechoptions-rate)
  - [Styling Modal as Popover](#styling-modal-as-popover)
  - [Switch.OffColor](#switch.offcolor)
  - [HybridWebView new InvokeJavascriptAsync Method](#hybridwebview-new-invokejavascriptasync-method)
  - [Deprecations](#deprecations)
- [.NET for Android](#net-for-android)
  - [Feature](#feature-android)
- [.NET for iOS, Mac Catalyst, macOS, tvOS](#net-for-ios-mac-catalyst-macos-tvos)
  - [Feature](#feature-ios)

.NET MAUI updates in .NET 10:

- [What's new in .NET MAUI in .NET 10](https://learn.microsoft.com/dotnet/maui/whats-new/dotnet-10) documentation.

## ShadowTypeConverter

.NET 10 includes a `ShadowTypeConverter` type for converting a formatted string to a `Shadow` on a `VisualElement`.

- color, offset X, offset Y

    ```xaml
    <VerticalStackLayout BackgroundColor="#fff" Shadow="#000000 4 4" />
    ```

- offset X, offset Y, radius, color

    ```xaml
    <VerticalStackLayout BackgroundColor="#fff" Shadow="4 4 16 #000000" />
    ```

- offset X, offset Y, radius, color, opacity

    ```xaml
    <VerticalStackLayout BackgroundColor="#fff" Shadow="4 4 16 #000000 0.5" />
    ```
## SpeechOptions Rate

When using [Text-to-Speech](https://learn.microsoft.com/dotnet/maui/platform-integration/device-media/text-to-speech) in .NET 10 you now have the option to control the rate at which the audio plays by setting `Rate` on the `SpeechOptions`.

```csharp
public async void SpeakSettings()
{
    IEnumerable<Locale> locales = await TextToSpeech.Default.GetLocalesAsync();

    SpeechOptions options = new SpeechOptions()
    {
        Rate = 2.0f, // 0.1 - 2.0
        Pitch = 1.5f,   // 0.0 - 2.0
        Volume = 0.75f, // 0.0 - 1.0
        Locale = locales.FirstOrDefault()
    };

    await TextToSpeech.Default.SpeakAsync("How nice to meet you!", options);
}
```

## Styling Modal as Popover

With this new platform-specific you can display a modal page as a popover on iOS and Mac Catalyst. It's consumed by setting the `Page.ModalPopoverSourceView` bindable property to a `View` that defines the source of the modal, the `Page.ModalPopoverRect` bindable property to a `Rectangle` that defines the rectangle within the source of the modal, and the `Page.ModalPresentationStyle` bindable property to Popover:

```csharp
public partial class PopoverPage : ContentPage
{
  	public PopoverPage(View modal, Rectangle rectangle)
  	{
    		InitializeComponent();
    		On<iOS>().SetModalPopoverView(modal);
    		On<iOS>().SetModalPopoverRect(rectangle);
    		On<iOS>().SetModalPresentationStyle(UIModalPresentationStyle.Popover);
  	}
}
```

Then, navigate to the modal page with the `Navigation.PushModalAsync` method:

```csharp
Page modalPage = new PopoverPage(originButton, Rectangle.Empty);
await Navigation.PushModalAsync(modalPage);
```

More info: https://github.com/dotnet/maui/pull/23984

## Switch.OffColor

You can now set the `OffColor` in addition to `OnColor` for a `Switch` control.

```xaml
<Switch OffColor="Red"
        OnColor="Green" />
```

## SearchBar.SearchIconColor

You can now set the color of the search icon that appears with a `SearchBar` by setting `SearchIconColor`.

```xaml
<SearchBar Placeholder="Search items..." SearchIconColor="Red" />
```

## HybridWebView new InvokeJavascriptAsync Method

A method for `InvokeJavascriptAsync` has been made public for when you don't want a generic argument or return type argument to be required as was the case previously.

More info: https://github.com/dotnet/maui/pull/27594

## Deprecations

- The `FontImageExtension` XAML markup extension is deprecated. Use `FontImageSource` instead.
- MessagingCenter is now internal. It can be replaced with WeakReferenceMessenger in the [CommunityToolkit.Mvvm NuGet](https://www.nuget.org/packages/CommunityToolkit.Mvvm) package. For more information, see [Messenger](https://github.com/windows/communitytoolkit/mvvm/messenger).

## .NET for Android

This release was focused on quality improvements. A detailed list can be found on [dotnet/android GitHub releases](https://github.com/dotnet/android/releases/).

### Feature Android

This is a feature about Android.

## .NET for iOS, Mac Catalyst, macOS, tvOS

This release was focused on quality improvements. A details list can be found on [xamarin/xamarin-macios GitHub released](https://github.com/xamarin/xamarin-macios/releases/) including a list of [Known issues](https://github.com/xamarin/xamarin-macios/wiki/Known-issues-in-.NET10).

### Feature iOS

This is a feature about iOS.

## Community Contributors

Thank you to ...
