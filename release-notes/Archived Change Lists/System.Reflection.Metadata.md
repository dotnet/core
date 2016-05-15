# System.Reflection.Metadata

## Information

* [NuGet Package](https://www.nuget.org/packages/System.Reflection.Metadata)
* [Report an issue](http://github.com/dotnet/corefx/issues/new)
* [Source](https://github.com/dotnet/corefx/tree/master/src)

## Version History

### 1.0.21

* First stable release
* [Breaking change] Support for very large heaps. Introduces `EntityHandle`
  for non-heap handles and modifies the API to work with them wherever possible.
* Fix issue running in a Windows Store App on a machine with .NET 4.6 installed.

### 1.0.19-rc

* Small bug fixes

### 1.0.18-beta

* [Breaking change] Fix spelling error in `MetadataTokens.ExportedTypeHandle`
  method
* Fix race condition when calling `GetMetadataReader` concurrently on the same
  `PEReader`
* Minor performance optimizations

### 1.0.17-beta

* Renamed the package from `Microsoft.Bcl.Metadata` to `System.Reflection.Metadata`
    - In order to get the new version, uninstall `Microsoft.Bcl.Metadata` and
      install `System.Reflection.Metadata` instead
    - The name of the .DLL is unchanged
* Minor bug fixes

### 1.0.11-alpha (Microsoft.Bcl.Metadata)

* Optimization data added for Roslyn
* Minor bug fixes

### 1.0.9-alpha (Microsoft.Bcl.Metadata)

* Initial release
