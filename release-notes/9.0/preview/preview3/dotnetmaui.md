# .NET MAUI in .NET 9 Preview 3 - Release Notes

The team is continuing work on core fundamentals of the .NET MAUI SDK to improve overall product quality. This includes expanding test coverage, end to end scenario testing, and bug fixing.

Here's a summary of what's new in .NET MAUI in this preview release:

- Multi-target versions of .NET for iOS bindings
- Android Asset Packs

.NET MAUI updates in .NET 9 Preview 3:

* [What's new in .NET MAUI in .NET 9](https://learn.microsoft.com/dotnet/maui/whats-new/dotnet-9) documentation
* [GitHub Release](https://aka.ms/maui9p3)

.NET 9 Preview 3:
* [Discussion](https://aka.ms/dotnet/9/preview3)
* [Release notes](./README.md)

## .NET for Android

### Asset packs

.NET Android 9 Preview 3 introduces the ability to place assets into a separate package, known as an *asset pack*. This enables you to upload games and apps that would normally be larger than the basic package size allowed by Google Play. By putting these assets into a separate package you gain the ability to upload a package which is up to 2Gb in size, rather than the basic package size of 200Mb.

> [!IMPORTANT]
> Asset packs can only contain assets. In the case of .NET Android this means items that have the `AndroidAsset` build action.

.NET MAUI apps define assets via the `MauiAsset` build action. An asset pack can be specified via the `AssetPack` attribute:

```xml
<MauiAsset
    Include="Resources\Raw\**"
    LogicalName="%(RecursiveDir)%(Filename)%(Extension)"
    AssetPack="myassetpack" />
```

> [!NOTE]
> The additional metadata will be ignored by other platforms.

If you have specific items you want to place in an asset pack you can use the `Update` attribute to define the `AssetPack` metadata:

```xml
<MauiAsset Update="Resources\Raw\MyLargeAsset.txt" AssetPack="myassetpack" />
```

Asset packs can have different delivery options, which control when your assets will install on the device:

- Install time packs are installed at the same time as the app. This pack type can be up to 1Gb in size, but you can only have one of them. This delivery type is specified with `InstallTime` metadata.
- Fast follow packs will install at some point shortly after the app has finished installing. The app will be able to start while this type of pack is being installed so you should check it has finished installing before trying to use the assets. This kind of asset pack can be up to 512Mb in size. This delivery type is specified with `FastFollow` metadata.
- On demand packs will never be downloaded to the device unless the app specifically requests it. The total size of all your asset packs can't exceed 2Gb, and you can have up to 50 separate asset packs. This delivery type is specified with `OnDemand` metadata.

In .NET MAUI apps, the delivery type can be specified with the `DeliveryType` attribute on a `MauiAsset`:

```xml
<MauiAsset Update="Resources\Raw\myvideo.mp4" AssetPack="myassetpack" DeliveryType="FastFollow" />
```
 
- [Android Asset Packs](https://github.com/dotnet/android/blob/main/Documentation/guides/AndroidAssetPacks.md)
- [GitHub Release](https://github.com/dotnet/android/releases/)

## .NET for iOS

Projects can now multi-target versions of .NET for iOS bindings. For example, a library project may need to build for 2 distinct versions.

```xml
<TargetFrameworks>net9.0-ios17.0;net9.0-ios17.2</TargetFrameworks>
```

This will produce 2 libraries, one using iOS 17.0 bindings, and one using iOS 17.2 bindings. An app project should always target the latest iOS SDK.

- [Multi-targeting iOS](https://github.com/xamarin/xamarin-macios/blob/main/docs/multi-target-framework.md) documentation
- [GitHub Release](https://github.com/xamarin/xamarin-macios/releases/)
- [Known issues](https://github.com/xamarin/xamarin-macios/wiki/Known-issues-in-.NET9)

## Community Contributions

Thanks to contributors [@wcoder](https://github.com/wcoder), [@rpendleton](https://github.com/rpendleton), [@filipnavara](https://github.com/filipnavara), [@snechaev](https://github.com/snechaev), [@symbiogenesis](https://github.com/symbiogenesis), [@bradencohen](https://github.com/bradencohen), [@licon4812](https://github.com/licon4812), [@kubaflo](https://github.com/kubaflo).