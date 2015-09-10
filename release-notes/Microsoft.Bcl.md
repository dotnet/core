# Microsoft.Bcl

## Information

* [NuGet Package](https://nuget.org/packages/Microsoft.Bcl)
* [Report an issue](https://www.nuget.org/packages/Microsoft.Bcl/ContactOwners)

## Version History

### 1.1.10

* Added specific lib folder for Xamarin.iOS Unified API.

### 1.1.9

* Added specific lib folders for `monotouch` and `monoandroid`.

### 1.1.8

* Updated package dependencies and clarified supported platforms.

### 1.1.7

* Added Windows Phone 8.1 support

### 1.1.6

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/11/13/pcl-and-net-nuget-libraries-are-now-enabled-for-xamarin.aspx)
* Updated license to remove Windows-only restriction

### 1.1.3

* Marked as stable

### 1.1.2-rc

* Added `System.IO.InvalidDataException`.

### 1.1.0-beta

* Added `InvalidDataException` so that this type will unify on platforms that support compression

### 1.0.19

* Marked as stable

### 1.0.16-rc

* Fixed: Adding empty content to .NET 4.5, Windows Phone 8, Windows 8 and
  portable combinations, so that `app.config` transforms are not applied to
  projects targeting them
* Fixed: `System.Runtime` is missing a type forward for `Tuple<T1, T2>`
* Fixed: `System.Runtime` now has a fixed version for Phone 7.x due to the lack
  of a way to redirect them to a later version.
* Fixed: First-chance exceptions when running on Phone 7.x
* Fixed: `Microsoft.Bcl.targets` are not imported when using NuGet 2.0 to
  install `Microsoft.Bcl`
* Changed: Pulled build targets into a separate package (`Microsoft.Bcl.Build`)
  so other BCL packages can depend on it.

### 1.0.11-beta

* [Announcement](http://blogs.msdn.com/b/bclteam/archive/2012/10/22/using-async-await-without-net-framework-4-5.aspx)
* Initial release
