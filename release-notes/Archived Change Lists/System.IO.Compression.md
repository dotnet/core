# System.IO.Compression

## Information

* [NuGet Package](http://nuget.org/packages/System.IO.Compression)
* [Documentation](https://msdn.microsoft.com/en-us/library/system.io.compression.aspx)
* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/08/22/portable-compression-is-now-stable.aspx)
* [Report an issue](http://github.com/dotnet/corefx/issues/new)
* [Source](https://github.com/dotnet/corefx/tree/master/src)

## Version History

### 4.0.0-beta-22231

* Package was renamed to `System.IO.Compression`

### 3.9.85 (Microsoft.Bcl.Compression)

* Updated to stable, no other changes.

### 3.9.84-beta (Microsoft.Bcl.Compression)

* Remove PowerShell scripts and use Nuget's built-in targets file support.

### 3.9.83 (Microsoft.Bcl.Compression)

* Added Windows Phone 8.1 support

### 3.9.73 (Microsoft.Bcl.Compression)

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/11/13/pcl-and-net-nuget-libraries-are-now-enabled-for-xamarin.aspx)
* Updated license to remove Windows-only restriction

### 3.9.69 (Microsoft.Bcl.Compression)

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/08/22/portable-compression-is-now-stable.aspx)
* Marked as stable
* Improved experience around package restore. The import to the targets is now
  optional which allows VS to load the project, even if the package is missing.
  A build that restored packages will now fail with an error message asking to
  build again.

### 3.9.66-rc (Microsoft.Bcl.Compression)

* Minor branding update

### 3.9.65-beta (Microsoft.Bcl.Compression)

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/06/06/portable-compression-and-httpclient-working-together.aspx)
* Initial Release

## Troubleshooting

### Issue 1

#### Symptom

When building a phone application you get the following error:

    Phone Application: Project must install NuGet package Microsoft.Bcl.Compression.

After adding the reference to `Microsoft.Bcl.Compression` and rebuilding your
app, a new MSBuild task (which comes with the NuGet package) will deploy CPU-
specific binaries as dependencies of your app. If your app is configured as Any
CPU, the build will fail again with this error message:

    Phone Application: Microsoft.Bcl.Compression does not support the currently selected platform of 'AnyCPU'. The supported platforms are 'x86' and 'ARM'.

##### Resolution

The project should build successfully after you change the platform target to
`X86` or `ARM`.

### Issue 2

#### Symptom

When creating large ZIP files, the resulting archive is corrupted and can't be
read by either the ZipArchive class nor by any other 3rd party compression tool.

#### Resolution

The problem occurs due to a bug in `ZipArchive`. Whenever the sized of the
compressed data exceeds 4GB the very next entry that is written will cause to
overwrite existing data.

The workaround is to avoid creating ZIP files where the compressed data exceeds
4GB. You can achieve this by compressing multiple ZIP files instead.

This problem exists on the following platforms:

* .NET Framework 4.5
* .NET for Windows Store apps
* Windows Phone 8
