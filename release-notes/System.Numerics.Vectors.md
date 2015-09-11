# System.Numerics.Vectors

## Information

* [NuGet Package](https://www.nuget.org/packages/System.Numerics.Vectors)
* [Documentation](https://msdn.microsoft.com/en-us/library/dn858218.aspx)
* [Samples](http://code.msdn.microsoft.com/SIMD-Sample-f2c8c35a)
* [Announcement](http://blogs.msdn.com/b/dotnet/archive/2014/04/07/the-jit-finally-proposed-jit-and-simd-are-getting-married.aspx)
* [Report an issue](http://github.com/dotnet/corefx/issues/new)
* [Source](https://github.com/dotnet/corefx/tree/master/src)

## Version History

### 4.0.0

* Stabilized surface area for fixed-size types and removed "beta" pre-release tag
* Removed `Vector` and `Vector<T>` from stable-version package, please continue
  using the pre-release package (1.1.6) if you rely on these types).

### 1.1.6

* Fixed an issue in `Matrix4x4.Decompose` which caused the method to return
  incorrect values when passed a matrix transform with a degenerate (zero)
  scale factor.

### 1.1.5

* Renamed `Microsoft.Bcl.Simd` NuGet package to `System.Numerics.Vectors`
* Expanded support for graphics programming by adding types for matrices,
  planes, and quaternions

### 1.0.2 (Microsoft.Bcl.Simd)

* Added support for new generic vector types:
    - `Byte`, `Sbyte`, `UInt16`, `Int16`
* Mutable Fixed Vector types
* (JIT) Added additional intrinsics for various operations:
    - `CopyTo` (array) method now intrinsic
    - Comparison operators completed for all types
    - `Min` / `Max` for all types
* Some performance improvements in the BCL code and general cleanup

### 1.0.1 (Microsoft.Bcl.Simd)

* Initial release