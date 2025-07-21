# .NET MAUI in .NET 10 Preview 5 - Release Notes

Here's a summary of what's new in .NET MAUI, .NET for Android, and .NET for iOS, Mac Catalyst, macOS, and tvOS in this preview release:

- .NET MAUI
  - [XAML Global Namespaces](#xaml-global-namespaces)
  - [XAML Implicit Namespaces](#xaml-global-namespaces)
  - [Intercept web requests](#intercept-web-requests)
- [.NET for Android](#net-for-android)
- [.NET for iOS, Mac Catalyst, macOS, tvOS](#net-for-ios-mac-catalyst-macos-tvos)

.NET MAUI updates in .NET 10:

- [What's new in .NET MAUI in .NET 10](https://learn.microsoft.com/dotnet/maui/whats-new/dotnet-10) documentation.

## XAML Global Namespaces

In your projects you can now glob together XML-namespaces into a new global namespace `xmlns="http://schemas.microsoft.com/dotnet/maui/global"`, and use them without prefixes. The .NET MAUI namespace is included already.

By convention the new project template creates a file `GlobalXmlns.cs`.

```csharp
[assembly: XmlnsDefinition(
    "http://schemas.microsoft.com/dotnet/maui/global",
    "MyApp.Views")]
[assembly: XmlnsDefinition(
    "http://schemas.microsoft.com/dotnet/maui/global",
    "MyApp.Controls")]
[assembly: XmlnsDefinition(
    "http://schemas.microsoft.com/dotnet/maui/global",
    "MyApp.Converters")]
[assembly: XmlnsDefinition(
    "http://schemas.microsoft.com/dotnet/maui/global",
    "http://schemas.syncfusion.com/maui/toolkit")]
```

You can then use anything in those namespaces like you do .NET MAUI controls, without prefix.

```xml
<ContentPage 
    xmlns="http://schemas.microsoft.com/dotnet/maui/global"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    x:Class="MyApp.MainPage">
    <TagView x:DataType="Tag" />
</ContentPage>
```

The `x` namespace cannot be globbed into the global namespace since it's used for parsing.

## XAML Implicit Namespaces

You can opt-in to this feature by adding the following to your project file. As of now, turning this on may cause errors to be reported by various XAML tools.

```xml
<PropertyGroup>
  <DefineConstants>$(DefineConstants);MauiAllowImplicitXmlnsDeclaration</DefineConstants>
  <EnablePreviewFeatures>true</EnablePreviewFeatures>
</PropertyGroup>
```

With this change you can also eliminate `xmlns` and `xmlns:x` from XAML files.

```xml
<ContentPage x:Class="MyApp.MainPage">
    <TagView x:DataType="Tag" />
</ContentPage>
```

In this usage:

- the default xmlns is the global one
- the `x:` prefix is added by default
- all `xmlns` with a `XmlnsPrefix` are also accessible with their prefix, even if they are included in the global `xmlns`. These are useful for disambiguating a name. For example, the `maui:` prefix points to the maui `xmlns`.
- you still need to use the `x:` prefix (e.g. `x:Class`, `x:DataType`), but you don't have to declare it

## Intercept Web Requests

The `HybridWebView` now allows you to intercept when the browser requests a web resource in order to take action before it executes, such as adding a header to the request. The do this, add a listener to the `WebResourceRequested` event.

```xml
<HybridWebView WebResourceRequested="HybridWebView_WebResourceRequested" />
```

```csharp
private void HybridWebView_WebResourceRequested(object sender, HybridWebViewWebResourceRequestedEventArgs e)
{
  // NOTES:
  // * This method MUST be synchronous, as it is called from the WebView's thread.
  // * This method MUST return a response (even if it is not yet complete), otherwise the 
  //   WebView may freeze or return a error response.
  // * The response must be set using the SetResponse method of the event args.

  // Only handle requests for the specific image URL
  if (!e.Uri.ToString().Contains("sample-image.png"))
    return;

  // Prevent the default behavior of the web view
  e.Handled = true;

  // Return the stream or task of stream that contains the content
  // NOTE: the method is NOT awaited, the WebView will continue to load the content
  e.SetResponse(200, "OK", "image/png", GetStreamAsync());
  }
```

## .NET for Android

This release was focused on quality improvements. A detailed list can be found on [dotnet/android GitHub releases](https://github.com/dotnet/android/releases/).

## .NET for iOS, Mac Catalyst, macOS, tvOS

This release was focused on quality improvements. A detailed list can be found on [dotnet/macios GitHub releases](https://github.com/dotnet/macios/releases/) including a list of [Known issues](https://github.com/dotnet/macios/wiki/Known-issues-in-.NET10).

## Contributors

Thank you contributors! ❤️

[@Ahamed-Ali](https://github.com/Ahamed-Ali), [@Dhivya-SF4094](https://github.com/Dhivya-SF4094), [@HarishKumarSF4517](https://github.com/HarishKumarSF4517), [@KarthikRajaKalaimani](https://github.com/KarthikRajaKalaimani), [@LogishaSelvarajSF4525](https://github.com/LogishaSelvarajSF4525), [@MartyIX](https://github.com/MartyIX), [@NafeelaNazhir](https://github.com/NafeelaNazhir), [@NanthiniMahalingam](https://github.com/NanthiniMahalingam), [@NirmalKumarYuvaraj](https://github.com/NirmalKumarYuvaraj), [@PaulAndersonS](https://github.com/PaulAndersonS), [@PureWeen](https://github.com/PureWeen), [@Shalini-Ashokan](https://github.com/Shalini-Ashokan), [@StephaneDelcroix](https://github.com/StephaneDelcroix), [@SubhikshaSf4851](https://github.com/SubhikshaSf4851), [@SuthiYuvaraj](https://github.com/SuthiYuvaraj), [@SyedAbdulAzeemSF4852](https://github.com/SyedAbdulAzeemSF4852), [@Tamilarasan-Paranthaman](https://github.com/Tamilarasan-Paranthaman), [@TamilarasanSF4853](https://github.com/TamilarasanSF4853), [@Vignesh-SF3580](https://github.com/Vignesh-SF3580), [@anandhan-rajagopal](https://github.com/anandhan-rajagopal), [@bhavanesh2001](https://github.com/bhavanesh2001), [@corvinsz](https://github.com/corvinsz), [@devanathan-vaithiyanathan](https://github.com/devanathan-vaithiyanathan), [@drasticactions](https://github.com/drasticactions), [@jfversluis](https://github.com/jfversluis), [@jonathanpeppers](https://github.com/jonathanpeppers), [@jsuarezruiz](https://github.com/jsuarezruiz), [@kubaflo](https://github.com/kubaflo), [@mattleibow](https://github.com/mattleibow), [@moljac](https://github.com/moljac), [@nivetha-nagalingam](https://github.com/nivetha-nagalingam), [@pjcollins](https://github.com/pjcollins), [@prakashKannanSf3972](https://github.com/prakashKannanSf3972), [@praveenkumarkarunanithi](https://github.com/praveenkumarkarunanithi), [@rmarinho](https://github.com/rmarinho), [@simonrozsival](https://github.com/simonrozsival), [@tj-devel709](https://github.com/tj-devel709)
