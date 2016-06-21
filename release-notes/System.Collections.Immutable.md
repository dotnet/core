# System.Collections.Immutable

## Information

* [NuGet Package](http://nuget.org/packages/System.Collections.Immutable)
* [Documentation](https://msdn.microsoft.com/en-us/library/dn769092.aspx)
* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/09/25/immutable-collections-ready-for-prime-time.aspx)
* [Report an issue](http://github.com/dotnet/corefx/issues/new)
* [Source](https://github.com/dotnet/corefx/tree/master/src)

## Version History

### 1.1.36

* First stable release of version 1.1
* `ImmutableArray<T>`'s explicit implementation of `ICollection.SyncRoot`
  changed to throw `NotSupportedException` instead of returning new boxed
  instance on every call.

### 1.1.34-rc

* `ImmutableArray.MoveToImmutable` API added to avoid copying in known size scenario
* `ImmutableArray.Update` API added to support an arbitrary interlocked transformation
* **[Breaking change]** `ImmutableArray.Create<T, TDerived>` replaced by `ImmutableArray<T>.CastUp` and `ImmutableArray<T>.CastArray`
* **[Breaking change]** `ImmutableArray<T>.Builder.EnsureCapacity` replaced with `ImmutableArray<T>.Builder.Capacity` property
* **[Breaking change]** `ImmutableArray<T>.ReverseContents` renamed to `ImutableArray<T>.Reverse`
* Bug fixes and performance improvements

### 1.1.33-beta

* Several performance optimizations
* Thread-safety fix to `ImmutableArray`
* **[Breaking change]** Removal of `ImmutableArrayInterop`
* Allow null comparer arguments
* Doc comment updates
* Fix `DebuggerTypeProxy` issue on Windows Store apps
* Fix AVL tree balancing issues
* Add `ImmutableArrayExtensions.SelectMany`
* Add indexed to `ImmutableSortedSet<T>.Builder`
* Throw `ArgumentOutOfRangeException` instead of `OverflowException` for negative capacity passed to `ImmutableArray.CreateBuilder`

### 1.1.32-beta

* Renamed the package from `Microsoft.Bcl.Immutable` to `System.Collections.Immutable`
    - You can upgrade the existing package. It will automatically add and open a
      readme file explaining that you should now remove the reference to
      `Microsoft.Bcl.Immutable`
* Note that the name of the .DLL is unchanged

### 1.1.22-beta (Microsoft.Bcl.Immutable)

* Added support for Windows Phone 8.1

### 1.1.20-beta (Microsoft.Bcl.Immutable)

* Re-included ImmutableArray<T>

### 1.0.34 (Microsoft.Bcl.Immutable)

* Added support for Windows Phone 8.1

### 1.0.30 (Microsoft.Bcl.Immutable)

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/11/13/pcl-and-net-nuget-libraries-are-now-enabled-for-xamarin.aspx)
* Updated license to remove Windows-only restriction

### 1.0.27 (Microsoft.Bcl.Immutable)

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/09/25/immutable-collections-ready-for-prime-time.aspx)

### 1.0.23-rc (Microsoft.Bcl.Immutable)

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/09/12/immutable-collections-are-now-rc.aspx)

### 1.0.12-beta (Microsoft.Bcl.Immutable)

* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2013/06/24/please-welcome-immutablearray.aspx)

### 1.0.8-beta (Microsoft.Bcl.Immutable)

* [Announcement](http://blogs.msdn.com/b/bclteam/archive/2013/03/06/update-to-immutable-collections.aspx)

### 1.0.5-beta (Microsoft.Bcl.Immutable)

* [Announcement](http://blogs.msdn.com/b/bclteam/archive/2012/12/18/preview-of-immutable-collections-released-on-nuget.aspx)
