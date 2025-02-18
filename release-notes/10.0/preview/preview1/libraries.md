# .NET Libraries in .NET 10 Preview 1 - Release Notes

.NET 10 Preview 1 includes new .NET Libraries features & enhancements:

- [Feature](#feature)

.NET Libraries updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Finding Certificates By Thumbprints Other Than SHA-1

Finding certificates uniquely by thumbprint is a fairly common operation,
but the `X509Certificate2Collection.Find` method (for the `FindByThumbprint` mode) only searches for the SHA-1 Thumbprint value.

Since SHA-2-256 ("SHA256") and SHA-3-256 have the same lengths,
we decided that it wasn't pure goodness to let the Find method find any vaguely matching thumbprints.
Instead, we introduced a new method that accepts the name of the hash algorithm that you want to use for matching.

```C#
X509Certificate2Collection coll = store.Certificates.FindByThumbprint(HashAlgorithmName.SHA256, thumbprint);
Debug.Assert(coll.Count < 2, "Collection has too many matches, has SHA-2 been broken?");
return coll.SingleOrDefault();
```

## Finding PEM-encoded Data in ASCII/UTF-8

The PEM encoding (originally "Privacy Enhanced Mail", but now used widely outside of email) is defined for "text",
which means that the `PemEncoding` class was designed to run on `System.String` and `ReadOnlySpan<char>`.
But, it's quite common (especially on Linux) to have something like a certificate written in a file that uses the ASCII (string) encoding.
Historically, that meant you needed to open the file, convert the bytes to chars (or a string), and then you can use PemEncoding.

Taking advantage of the fact that PEM is only defined for 7-bit ASCII characters, and that 7-bit ASCII has a perfect overlap with single-byte UTF-8 values,
you can now skip the UTF-8/ASCII to char conversion and read the file directly.

```diff
byte[] fileContents = File.ReadAllBytes(path);
-char[] text = Encoding.ASCII.GetString(fileContents);
-PemFields pemFields = PemEncoding.Find(text);
+PemFields pemFields = PemEncoding.FindUtf8(fileContents);

-byte[] contents = Base64.DecodeFromChars(text.AsSpan()[pemFields.Base64Data]);
+byte[] contents = Base64.DecodeFromUtf8(fileContents.AsSpan()[pemFields.Base64Data]);
```

## New Method Overloads in ISOWeek for DateOnly Type

The ISOWeek class was originally designed to work exclusively with DateTime, as it was introduced before the DateOnly type existed. Now that DateOnly is available, it makes sense for ISOWeek to support it as well.

```C#
    public static class ISOWeek
    {
        // New overloads
        public static int GetWeekOfYear(DateOnly date);
        public static int GetYear(DateOnly date);
        public static DateOnly ToDateOnly(int year, int week, DayOfWeek dayOfWeek);
    }
```

## String Normalization APIs to Work with Span of Characters

Unicode string normalization has been supported for a long time, but existing APIs have only worked with the string type. This means that callers with data stored in different forms, such as character arrays or spans, must allocate a new string to use these APIs.
Additionally, APIs that return a normalized string always allocate a new string to represent the normalized output.

The change introduces new APIs that work with spans of characters, reducing the restriction to string types and helping to avoid unnecessary allocations.

```C#
    public static class StringNormalizationExtensions
    {
        public static int GetNormalizedLength(this ReadOnlySpan<char> source, NormalizationForm normalizationForm = NormalizationForm.FormC);
        public static bool IsNormalized(this ReadOnlySpan<char> source, NormalizationForm normalizationForm = NormalizationForm.FormC);
        public static bool TryNormalize(this ReadOnlySpan<char> source, Span<char> destination, out int charsWritten, NormalizationForm normalizationForm = NormalizationForm.FormC);
    }
```


## Numeric Ordering for String Comparison

Numerical string comparison is a highly requested feature (https://github.com/dotnet/runtime/issues/13979) for comparing strings numerically instead of lexicographically. For example, `2` is less than `10`, so `"2"` should appear before `"10"` when ordered numerically. Similarly, `"2"` and `"02"` are equal numerically. With the new `CompareOptions.NumericOrdering` option, it is now possible to do these types of comparisons:

```cs
StringComparer numericStringComparer = StringComparer.Create(CultureInfo.CurrentCulture, CompareOptions.NumericOrdering);

Console.WriteLine(numericStringComparer.Equals("02", "2"));
// Output: True

foreach (string os in new[] { "Windows 8", "Windows 10", "Windows 11" }.Order(numericStringComparer))
{
    Console.WriteLine(os);
}

// Output:
// Windows 8
// Windows 10
// Windows 11

HashSet<string> set = new HashSet<string>(numericStringComparer) { "007" };
Console.WriteLine(set.Contains("7"));
// Output: True
```

Note that this option is not valid for the following index based string operations: `IndexOf`, `LastIndexOf`, `StartsWith`, `EndsWith`, `IsPrefix`, and `IsSuffix`.

## Adding TimeSpan.FromMilliseconds Overload with a Single Parameter

Previously, we introduced the following method without adding an overload that takes a single parameter:

```C#
public static TimeSpan FromMilliseconds(long milliseconds, long microseconds = 0);
```

Although this works since the second parameter is optional, it causes a compilation error when used in a LINQ expression like:

```C#
Expression<Action> a = () => TimeSpan.FromMilliseconds(1000);
```

The issue arises because LINQ expressions cannot handle optional parameters. To address this, we are introducing an overload that takes a single parameter and modifying the existing method to make the second parameter mandatory:

```C#
public readonly struct TimeSpan
{
    public static TimeSpan FromMilliseconds(long milliseconds, long microseconds); // Second parameter is no longer optional
    public static TimeSpan FromMilliseconds(long milliseconds);  // New overload
}
```

## ZipArchive performance and memory improvements

Two significant PRs have been made by contributor @edwardneal in .NET 10 Preview 1 to improve the performance and memory usage of `ZipArchive`:

- [dotnet/runtime #102704](https://github.com/dotnet/runtime/pull/102704) optimizes the way entries are written to a `ZipArchive` when in `Update` mode. Previously, all `ZipArchiveEntries` would be loaded into memory and rewritten, which could lead to high memory usage and performance bottlenecks. The optimization reduces memory usage and improves performance by avoiding the need to load all entries into memory.


    Adding a 2GB zip file to an existing archive showed:

    - A 99.8% reduction in execution time.
    - A 99.9996% reduction in memory usage.

    Benchmarks:

    | Method    | Job      | Runtime   | Mean         | Error      | StdDev      | Ratio | RatioSD | Gen0      | Gen1      | Gen2      | Allocated  | Alloc Ratio |
    |---------- |--------- |---------- |-------------:|-----------:|------------:|------:|--------:|----------:|----------:|----------:|-----------:|------------:|
    | Benchmark | Baseline | .NET 9.0  | 4.187 s | 83.3751 ms | 177.6792 ms | 1.002 |    0.06 | 1000.0000 | 1000.0000 | 1000.0000 | 2 GB |       1.000 |
    | Benchmark | CoreRun  | .NET 10.0 |     9.452 ms |  0.1583 ms |   0.1322 ms | 0.002 |    0.00 |         - |         - |         - |    7.01 KB |       0.000 |

  Additional details are provided in [dotnet/runtime #102704](https://github.com/dotnet/runtime/pull/102704#issue-2317941700).


- [dotnet/runtime #103153](https://github.com/dotnet/runtime/pull/103153) enhances the performance of `ZipArchive` by parallelizing the extraction of entries and optimizing internal data structures for better memory usage. These improvements address issues related to performance bottlenecks and high memory usage, making `ZipArchive` more efficient and faster, especially when dealing with large archives.


    Reading a zip archive showed:

    - An 18% reduction in execution time.
    - An 18% reduction in memory usage.

    Benchmarks:

    | Method    | Job      | Runtime   | NumberOfFiles | Mean            | Error         | StdDev        | Ratio | RatioSD | Gen0      | Gen1     | Gen2     | Allocated  | Alloc Ratio |
    |---------- |--------- |---------- |-------------- |----------------:|--------------:|--------------:|------:|--------:|----------:|---------:|---------:|-----------:|------------:|
    |     Benchmark     |     Baseline     |     .NET 9.0      |     2                 |          1,178.6 ns     |          23.23 ns     |          22.81 ns     |      1.00     |        0.03     |        0.3700     |            -     |            -     |        1.52 KB     |            1.00     |
    | Benchmark | CoreRun  | .NET 10.0 | 2             |        821.6 ns |      12.45 ns |      11.65 ns |  0.70 |    0.02 |    0.2899 |        - |        - |    1.19 KB |        0.78 |
    |           |          |           |               |                 |               |               |       |         |           |          |          |            |             |
    |     Benchmark     |     Baseline     |     .NET 9.0      |     10                |          4,205.5 ns     |          62.41 ns     |          55.33 ns     |      1.00     |        0.02     |        1.4954     |            -     |            -     |        6.13 KB     |            1.00     |
    | Benchmark | CoreRun  | .NET 10.0 | 10            |      3,467.5 ns |      67.25 ns |      66.05 ns |  0.82 |    0.02 |    1.2054 |        - |        - |    4.93 KB |        0.80 |
    |           |          |           |               |                 |               |               |       |         |           |          |          |            |             |
    |     Benchmark     |     Baseline     |     .NET 9.0      |     25                |         10,201.5 ns     |         190.59 ns     |         187.18 ns     |      1.00     |        0.02     |        3.5095     |            -     |            -     |       14.38 KB     |            1.00     |
    | Benchmark | CoreRun  | .NET 10.0 | 25            |      8,210.2 ns |     152.35 ns |     142.51 ns |  0.81 |    0.02 |    2.8229 |        - |        - |   11.54 KB |        0.80 |
    |           |          |           |               |                 |               |               |       |         |           |          |          |            |             |
    |     Benchmark     |     Baseline     |     .NET 9.0      |     50                |         20,152.7 ns     |         333.29 ns     |         311.76 ns     |      1.00     |        0.02     |        7.0496     |            -     |            -     |       28.91 KB     |            1.00     |
    | Benchmark | CoreRun  | .NET 10.0 | 50            |     20,109.1 ns |     517.18 ns |   1,500.43 ns |  1.00 |    0.08 |    5.7068 |        - |        - |   23.34 KB |        0.81 |
    |           |          |           |               |                 |               |               |       |         |           |          |          |            |             |
    |     Benchmark     |     Baseline     |     .NET 9.0      |     100               |         46,986.2 ns     |         923.08 ns     |       1,906.33 ns     |      1.00     |        0.06     |       14.2822     |       0.1221     |            -     |       58.42 KB     |            1.00     |
    | Benchmark | CoreRun  | .NET 10.0 | 100           |     37,767.2 ns |     752.51 ns |   1,554.06 ns |  0.81 |    0.05 |   11.5967 |   0.0610 |        - |   47.38 KB |        0.81 |
    |           |          |           |               |                 |               |               |       |         |           |          |          |            |             |
    |     Benchmark     |     Baseline     |     .NET 9.0      |     250               |        115,159.8 ns     |       2,211.52 ns     |       2,271.07 ns     |      1.00     |        0.03     |       34.5459     |       0.1221     |            -     |      141.42 KB     |            1.00     |
    | Benchmark | CoreRun  | .NET 10.0 | 250           |     94,148.7 ns |   1,842.33 ns |   3,414.87 ns |  0.82 |    0.03 |   27.8320 |   0.3662 |        - |  113.97 KB |        0.81 |
    |           |          |           |               |                 |               |               |       |         |           |          |          |            |             |
    |     Benchmark     |     Baseline     |     .NET 9.0      |     500               |        241,338.5 ns     |       4,726.33 ns     |       7,896.64 ns     |      1.00     |        0.05     |       69.8242     |       0.4883     |            -     |      285.86 KB     |            1.00     |
    | Benchmark | CoreRun  | .NET 10.0 | 500           |    184,869.9 ns |   2,969.04 ns |   4,162.18 ns |  0.77 |    0.03 |   56.1523 |   0.7324 |        - |  231.06 KB |        0.81 |
    |           |          |           |               |                 |               |               |       |         |           |          |          |            |             |
    |     Benchmark     |     Baseline     |     .NET 9.0      |     1000              |        510,114.6 ns     |      10,092.12 ns     |      20,386.57 ns     |      1.00     |        0.05     |      114.2578     |      72.2656     |            -     |       577.2 KB     |            1.00     |
    | Benchmark | CoreRun  | .NET 10.0 | 1000          |    404,349.3 ns |   7,289.88 ns |  16,153.88 ns |  0.79 |    0.04 |   93.2617 |  52.7344 |        - |  467.72 KB |        0.81 |
    |           |          |           |               |                 |               |               |       |         |           |          |          |            |             |
    |     Benchmark     |     Baseline     |     .NET 9.0      |     10000             |     13,950,239.9 ns     |     273,372.39 ns     |     345,728.57 ns     |      1.00     |        0.03     |     1000.0000     |     687.5000     |     218.7500     |     5786.24 KB     |            1.00     |
    | Benchmark | CoreRun  | .NET 10.0 | 10000         | 10,911,298.0 ns | 204,013.47 ns | 226,760.43 ns |  0.78 |    0.02 |  843.7500 | 609.3750 | 250.0000 | 4692.19 KB |        0.81 |

    Creating an archive showed:

    - A 23-35% reduction in execution time.
    - A 2% reduction in memory usage.

    Benchmarks:

    | Method    | Job      | Runtime   | NumberOfFiles | Mean      | Error     | StdDev     | Median    | Ratio | RatioSD | Gen0    | Gen1    | Allocated | Alloc Ratio |
    |---------- |--------- |---------- |-------------- |----------:|----------:|-----------:|----------:|------:|--------:|--------:|--------:|----------:|------------:|
    |     Benchmark     |     Baseline     |     .NET 9.0      |     2                 |      2.729 μs     |     0.0538 μs     |      0.0449 μs     |      2.706 μs     |      1.00     |        0.02     |      2.2697     |           -     |       9.28 KB     |            1.00     |
    | Benchmark | CoreRun  | .NET 10.0 | 2             |  1.665 μs | 0.0256 μs |  0.0239 μs |  1.659 μs |  0.61 |    0.01 |  2.2259 |       - |    9.1 KB |        0.98 |
    |           |          |           |               |           |           |            |           |       |         |         |         |           |             |
    |     Benchmark     |     Baseline     |     .NET 9.0      |     10                |     10.341 μs     |     0.1988 μs     |      0.2289 μs     |     10.266 μs     |      1.00     |        0.03     |      9.7046     |           -     |      39.76 KB     |            1.00     |
    | Benchmark | CoreRun  | .NET 10.0 | 10            |  7.937 μs | 0.1514 μs |  0.2487 μs |  7.831 μs |  0.77 |    0.03 |  9.5215 |       - |  39.02 KB |        0.98 |
    |           |          |           |               |           |           |            |           |       |         |         |         |           |             |
    |     Benchmark     |     Baseline     |     .NET 9.0      |     25                |     24.677 μs     |     0.4903 μs     |      0.8842 μs     |     24.563 μs     |      1.00     |        0.05     |     20.1721     |      3.3569     |      82.92 KB     |            1.00     |
    | Benchmark | CoreRun  | .NET 10.0 | 25            | 18.247 μs | 0.3474 μs |  0.3412 μs | 18.192 μs |  0.74 |    0.03 | 19.7754 |  3.2654 |  81.13 KB |        0.98 |
    |           |          |           |               |           |           |            |           |       |         |         |         |           |             |
    |     Benchmark     |     Baseline     |     .NET 9.0      |     50                |     67.420 μs     |     5.7447 μs     |     16.9384 μs     |     57.185 μs     |      1.05     |        0.35     |     40.5273     |     13.4888     |     166.71 KB     |            1.00     |
    | Benchmark | CoreRun  | .NET 10.0 | 50            | 41.443 μs | 0.7212 μs |  0.8306 μs | 41.493 μs |  0.65 |    0.13 | 39.6729 |  0.0610 | 163.16 KB |        0.98 |

    Additional benchmarking details provided [in the PR description](https://github.com/dotnet/runtime/pull/103153#issue-2339713028).

## Additional `TryAdd` and `TryGetValue` overloads for `OrderedDictionary<TKey, TValue>`

`OrderedDictionary<TKey, TValue>` provides `TryAdd` and `TryGetValue` for addition and retrieval like any other `IDictionary<TKey, TValue>` implementation. However, there are scenarios where you might want to perform additional operations, so new overloads have been added which return an index to the entry:

```cs
public class OrderedDictionary<TKey, TValue>
{
    // New overloads
    public bool TryAdd(TKey key, TValue value, out int index);
    public bool TryGetValue(TKey key, out TValue value, out int index);
}
```

This index can then be used with `GetAt`/`SetAt` for fast access to the entry. An example usage of the new `TryAdd` overload is to add or update a key/value pair in the ordered dictionary:

```cs
public static void IncrementValue(OrderedDictionary<string, int> orderedDictionary, string key)
{
    // Try to add a new key with value 1.
    if (!orderedDictionary.TryAdd(key, 1, out int index))
    {
        // Key was present, so increment the existing value instead.
        int value = orderedDictionary.GetAt(index).Value;
        orderedDictionary.SetAt(index, value + 1);
    }
}
```

This new API is now being used in `JsonObject` to improve the performance of updating properties by 10-20%.

## Allow specifying ReferenceHandler in `JsonSourceGenerationOptions`

When using source generators for JSON serialization, the generated context will throw when cycles are serialized or deserialized. This behavior can now be customized by specifying the `ReferenceHandler` in the `JsonSourceGenerationOptionsAttribute`. Here is an example using `JsonKnownReferenceHandler.Preserve`:

```cs
SelfReference selfRef = new SelfReference();
selfRef.Me = selfRef;

Console.WriteLine(JsonSerializer.Serialize(selfRef, ContextWithPreserveReference.Default.SelfReference));
// Output: {"$id":"1","Me":{"$ref":"1"}}

[JsonSourceGenerationOptions(ReferenceHandler = JsonKnownReferenceHandler.Preserve)]
[JsonSerializable(typeof(SelfReference))]
internal partial class ContextWithPreserveReference : JsonSerializerContext
{
}

internal class SelfReference
{
    public SelfReference Me { get; set; }
}
```

## More Left-Handed Matrix Transformation Methods

The remaining APIs for creating left-handed tranformation matrices have been added for billboard and constrained billboard matrices. These can be used like their existing right-handed counterparts when using a left-handed coordinate system instead.

```cs
public partial struct Matrix4x4
{
   public static Matrix4x4 CreateBillboardLeftHanded(Vector3 objectPosition, Vector3 cameraPosition, Vector3 cameraUpVector, Vector3 cameraForwardVector)
   public static Matrix4x4 CreateConstrainedBillboardLeftHanded(Vector3 objectPosition, Vector3 cameraPosition, Vector3 rotateAxis, Vector3 cameraForwardVector, Vector3 objectForwardVector)
}
```
