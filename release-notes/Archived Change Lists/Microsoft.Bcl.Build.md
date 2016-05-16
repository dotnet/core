# Microsoft.Bcl.Build

## Information

* [NuGet Package](https://nuget.org/packages/Microsoft.Bcl.Build)
* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/08/12/improved-package-restore.aspx)
* [Report an issue](https://www.nuget.org/packages/Microsoft.Bcl.Build/ContactOwners)

## Version History

### 1.0.21

* Updated to stable, no other changes.

### 1.0.20-Beta

* Remove PowerShell scripts and use Nuget's built-in targets file support.

### 1.0.17-Beta

* Updated to use in-box binding redirect functionality for supported projects
  types from VS2013 onwards

### 1.0.14

* Added Windows Phone 8.1 support

### 1.0.13

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/11/13/pcl-and-net-nuget-libraries-are-now-enabled-for-xamarin.aspx)
* Updated license to remove Windows-only restriction

### 1.0.10

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/08/12/improved-package-restore.aspx)
* Marked as stable

### 1.0.9-beta

* Improved experience around package restore. The import to the targets is now
  optional which allows VS to load the project, even if the package is missing.
  A build that restored packages will now fail with an error message asking to
  build again.

### 1.0.8

* Marked as stable

### 1.0.7

* Fixed issues with building on a .NET 4 machine