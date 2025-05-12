# .NET Libraries in .NET 10 Preview 4 - Release Notes

Here's a summary of what's new in .NET Libraries in this preview release:

- [Add Out-of-Proc Trace Support for Activity Events and Links](#add-out-of-proc-trace-support-for-activity-events-and-links)
- [Rate Limiting Trace Sampling Support](#rate-limiting-trace-sampling-support)
- [New async Zip APIs](#new-async-zip-apis)
- [Performance improvement in GZipStream for concatenated streams](#performance-improvement-in-gzipstream-for-concatenated-streams)

.NET Libraries updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Add Out-of-Proc Trace Support for Activity Events and Links

The .NET [Activity](https://learn.microsoft.com/dotnet/api/system.diagnostics.activity) class enables distributed tracing by tracking the flow of operations across services or components. .NET supports serializing this tracing data out-of-process via the `Microsoft-Diagnostics-DiagnosticSource` event source provider.

An Activity can include additional metadata such as [ActivityLink](https://learn.microsoft.com/dotnet/api/system.diagnostics.activitylink) and [ActivityEvent](https://learn.microsoft.com/dotnet/api/system.diagnostics.activityevent). We’ve added support for serializing these as well, so out-of-proc trace data can now include information representing links and events, like the following:

```
Events->"[(TestEvent1,​2025-03-27T23:34:10.6225721+00:00,​[E11:​EV1,​E12:​EV2]),​(TestEvent2,​2025-03-27T23:34:11.6276895+00:00,​[E21:​EV21,​E22:​EV22])]"
Links->"[(19b6e8ea216cb2ba36dd5d957e126d9f,​98f7abcb3418f217,​Recorded,​null,​false,​[alk1:​alv1,​alk2:​alv2]),​(2d409549aadfdbdf5d1892584a5f2ab2,​4f3526086a350f50,​None,​null,​false)]"
```

## Rate Limiting Trace Sampling Support

When distributed tracing data is serialized out-of-process via the `Microsoft-Diagnostics-DiagnosticSource` event source provider, all recorded activities can be emitted, or sampling can be applied based on a trace ratio.

We're introducing a new sampling option called **Rate Limiting Sampling**, which restricts the number of **root activities** serialized per second. This helps control data volume more precisely.

Out-of-proc trace data aggregators can enable and configure this sampling by specifying the option in [`FilterAndPayloadSpecs`](https://github.com/dotnet/runtime/blob/fb7050d93ea03854d469bb5f84c1f2addcd9e992/src/libraries/System.Diagnostics.DiagnosticSource/src/System/Diagnostics/DiagnosticSourceEventSource.cs#L43). For example:

```
[AS]*/-ParentRateLimitingSampler(100)
```

This setting limits serialization to **100 root activities per second** across all `ActivitySource` instances.


## New async Zip APIs

.NET 10 Preview 4 introduces new asynchronous APIs for working with ZIP archives, making it easier to perform non-blocking operations when reading from or writing to ZIP files. This feature was [highly requested by the community](https://github.com/dotnet/runtime/issues/1541).

The new APIs, added to the `System.IO.Compression` and `System.IO.Compression.ZipFile` assemblies, provide async methods for extracting, creating, and updating ZIP archives. These methods enable developers to efficiently handle large files and improve application responsiveness, especially in scenarios involving I/O-bound operations.

The [approved API surface](https://github.com/dotnet/runtime/issues/1541#issuecomment-2715269236) was implemented [here](https://github.com/dotnet/runtime/pull/114421).

**Usage examples:**

```csharp
// Extract a Zip archive
await ZipFile.ExtractToDirectoryAsync("archive.zip", "destinationFolder", overwriteFiles: true);

// Create a Zip archive
await ZipFile.CreateFromDirectoryAsync("sourceFolder", "archive.zip", CompressionLevel.SmallestSize, includeBaseDirectory: true, entryNameEncoding: Encoding.UTF8);

// Open an archive
await using ZipArchive archive = ZipFile.OpenReadAsync("archive.zip");

// Fine-grained manipulation
using FileStream archiveStream = File.OpenRead("archive.zip");
await using (ZipArchive archive = await ZipArchive.CreateAsync(archiveStream, ZipArchiveMode.Update, leaveOpen: false, entryNameEncoding: Encoding.UTF8))
{
    foreach (ZipArchiveEntry entry in archive.Entries)
    {
        // Extract an entry to the filesystem
        await entry.ExtractToFileAsync(destinationFileName: "file.txt", overwrite: true);

        // Open an entry's stream
        await using Stream entryStream = await entry.OpenAsync();

        // Create an entry from a filesystem object
        ZipArchiveEntry createdEntry = await archive.CreateEntryFromFileAsync(sourceFileName "path/to/file.txt", entryName: "file.txt");
    }
}
```

These new async methods complement the existing synchronous APIs, providing more flexibility for modern .NET applications.


## Performance improvement in GZipStream for concatenated streams

A community contribution by [@edwardneal](https://github.com/edwardneal) improved the performance and memory usage of `GZipStream` when processing concatenated GZip data streams. Previously, each new stream segment would dispose and reallocate the internal `ZLibStreamHandle`, resulting in additional memory allocations and initialization overhead. With this change, the handle is now reset and reused using `inflateReset2`, reducing both managed and unmanaged memory allocations and improving execution time.

**Highlights:**

- Eliminates repeated allocation of ~64-80 bytes of memory per concatenated stream, with additional unmanaged memory savings.

- Reduces execution time by approximately 400ns per concatenated stream.
- Largest impact (~35% faster) is seen when processing a large number of small data streams.
- No significant change for single-stream scenarios.

For more details, see the [pull request #113587](https://github.com/dotnet/runtime/pull/113587).
