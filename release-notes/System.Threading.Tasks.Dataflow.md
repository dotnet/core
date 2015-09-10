# System.Threading.Tasks.Dataflow

## Information

* [NuGet Package](http://nuget.org/packages/System.Threading.Tasks.Dataflow)
* [Documentation](http://msdn.microsoft.com/en-us/library/hh228603.aspx)
* [Report an issue](http://github.com/dotnet/corefx/issues/new)
* [Source](https://github.com/dotnet/corefx/tree/master/src)

## Version History

### 4.5.25-beta-23019

* Package has been renamed to `System.Threading.Tasks.Dataflow`

### 4.5.24

* Fix bug where `ActionBlock<T>` stopped once its bounded capacity was reached
* Fix bug where `InvalidOperationException` was thrown instead of
  `TaskCanceledException` in certain cases

### 4.5.23

* Updated to stable, no other changes

### 4.5.22-beta

* Fixed issue resulting in `ActionBlock<T>` stopping when its Bounded Capacity
  is reached.

### 4.5.20

* Updated to stable, no other changes

### 4.5.19-beta

* Added Windows Phone 8.1 support

### 4.5.16-alpha

* Added Windows Phone 8.0 support

### 4.5.14

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/11/13/pcl-and-net-nuget-libraries-are-now-enabled-for-xamarin.aspx)
* Updated license to remove Windows-only restriction

### 4.5.11

* Minor branding update

### 4.5.10.0

* Fixed bug that thorws when we connect `EncapsulateBlock` with a `TargetBlock`

### 4.5.7.0

* Added support for consuming nuget package from Portable Library project
* Platforms that are supported are Windows Store Apps and .Net 4.5

### 4.5.6.0

* Updated version information to .NET 4.5 RTM
* Added symbol package
* Updated branding to say "Windows Store Apps" instead of "Metro style apps"
