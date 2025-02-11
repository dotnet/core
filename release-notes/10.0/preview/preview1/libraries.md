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
    {
Unicode string normalization has been supported for a long time, but existing APIs have only worked with the string type. This means that callers with data stored in different forms, such as character arrays or spans, must allocate a new string to use these APIs.
Additionally, APIs that return a normalized string always allocate a new string to represent the normalized output.
The change introduces new APIs that work with spans of characters, reducing the restriction to string types and helping to avoid unnecessary allocations.
        public static int GetNormalizedLength(this ReadOnlySpan<char> source, NormalizationForm normalizationForm = NormalizationForm.FormC);
```C#
    public static class StringNormalizationExtensions
    {







    {

        public static int GetNormalizedLength(this ReadOnlySpan<char> source, NormalizationForm normalizationForm = NormalizationForm.FormC);

        public static bool IsNormalized(this ReadOnlySpan<char> source, NormalizationForm normalizationForm = NormalizationForm.FormC);

        public static bool TryNormalize(this ReadOnlySpan<char> source, Span<char> destination, out int charsWritten, NormalizationForm normalizationForm = NormalizationForm.FormC);

    }

```



## ZipArchive performance and memory improvements

Two significant PRs have been made by contributor @edwardneal in .NET 10 Preview 1 to improve the performance and memory usage of `ZipArchive`:

- [#102704](https://github.com/dotnet/runtime/pull/102704) - This PR optimizes the way entries are written to a `ZipArchive` when in `Update` mode. Previously, all `ZipArchiveEntries` would be loaded into memory and rewritten, which could lead to high memory usage and performance bottlenecks. The optimization reduces memory usage and improves performance by avoiding the need to load all entries into memory.

  Benchmark in Windows 11 intel Core i7:

    | Benchmark    | Mean    | Error    | StdDev   | Gen0      | Gen1      | Gen2      | Allocated |
    |---------- |--------:|---------:|---------:|----------:|----------:|----------:|----------:|
    | Pre-PR | 5.128 s | 0.1346 s | 0.3925 s | 1000.00 | 1000.00 | 1000.00 |      2 GB |
    | Post-PR | 8.169 ms | 0.2386 ms | 0.7036 ms | | | |      7.24 KB |

  Additional details provided [in the PR description](https://github.com/dotnet/runtime/pull/102704#issue-2317941700).

- [#103153](https://github.com/dotnet/runtime/pull/103153) - This PR enhances the performance of `ZipArchive` by parallelizing the extraction of entries and optimizing internal data structures for better memory usage. These improvements address issues related to performance bottlenecks and high memory usage, making `ZipArchive` more efficient and faster, especially when dealing with large archives.

    Read improvements:

    - 12-13% reduction in execution time as a baseline, rising to 18-19% as the number of entries in the archive increases.
    - 33-36% reduction in memory usage.
    - When latency is introduced, as the number of entries in the archive increases, the reduction in execution time becomes more pronounced - 99.6%.

    Creation improvements:

    - Execution time is almost identical assuming no latency. As latency increases, the execution time reduces by around 82%
    - 10% reduction in memory usage.

    Additional benchmarking details provided [in the PR description](https://github.com/dotnet/runtime/pull/103153#issue-2339713028).

