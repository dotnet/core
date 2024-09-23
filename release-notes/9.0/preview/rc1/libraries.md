# Libraries updates in .NET 9 Release Candidate 1

Here's a summary of what's new in .NET Libraries in this release:

* [WebSocket `Keep-Alive` Ping and Timeout APIs](#websocket-keep-alive-ping-and-timeout)
* [Add ZLib, Brotli compression options](#add-zlib-and-brotli-compression-options)
* [Add TarEntry.DataOffset](#add-tarentrydataoffset)
* [`HttpClientFactory` no longer logs header values by default](#httpclientfactory-no-longer-logs-header-values-by-default)
* [Out-of-proc Meter wildcard listening](#out-of-proc-meter-wildcard-listening)

Libraries updates in .NET 9 Release Candidate 1:

* [Release notes](libraries.md)
* [What's new in .NET 9](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) documentation

.NET 9 Release Candidate 1:

* [Discussion](https://aka.ms/dotnet/9/rc1)
* [Release notes](README.md)

## WebSocket `Keep-Alive` Ping and Timeout

We've [added new APIs](https://github.com/dotnet/runtime/pull/105841) on `ClientWebSocketOptions` and `WebSocketCreationOptions` that let you opt-in to sending WebSocket pings, and abort the connection if the peer does not respond in time.

Until now, you could specify a `KeepAliveInterval` to keep the connection from staying idle, but there was no built-in mechanism to enforce that the peer is responding.

The following example pings the server every 5 seconds and aborts the connection if it does not respond within a second.

```csharp
using var cws = new ClientWebSocket();
cws.Options.HttpVersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
cws.Options.KeepAliveInterval = TimeSpan.FromSeconds(5);
cws.Options.KeepAliveTimeout = TimeSpan.FromSeconds(1);

await cws.ConnectAsync(uri, httpClient, cancellationToken);
```

## Add ZLib and Brotli compression options

We added `ZLibCompressionOptions` and `BrotliCompressionOptions` types for setting algorithm specific compression level and compression strategy for users who would like to set more fine-tuned settings than the only existing option [CompressionLevel](https://learn.microsoft.com/dotnet/api/system.io.compression.compressionlevel). The new compression options are designed to allow for expanding to more options in the future.

```diff
namespace System.IO.Compression
{
+    public enum ZLibCompressionStrategy
+    {
+        Default = 0,
+        Filtered = 1,
+        HuffmanOnly = 2,
+        RunLengthEncoding = 3,
+        Fixed = 4,
+    }
+    public sealed class ZLibCompressionOptions
+    {
+        public int CompressionLevel { get; set; }
+        public ZLibCompressionStrategy CompressionStrategy { get; set; }
+    }
    public sealed class ZLibStream : Stream
    {
+        public ZLibStream(Stream stream, ZLibCompressionOptions compressionOptions, bool leaveOpen = false);
    }
    public partial class DeflateStream : Stream
    {
+        public DeflateStream(Stream stream, ZLibCompressionOptions compressionOptions, bool leaveOpen = false);
    }
    public partial class GZipStream : Stream
    {
+        public GZipStream(Stream stream, ZLibCompressionOptions compressionOptions, bool leaveOpen = false);
    }
+    public sealed class BrotliCompressionOptions
+    {
+        public int Quality { get; set; }
+    }
    public sealed partial class BrotliStream : System.IO.Stream
    {
+        public BrotliStream(Stream stream, BrotliCompressionOptions compressionOptions, bool leaveOpen = false) { }
    }
}
```

API Usage:

```csharp
private MemoryStream CompressStream(Stream uncompressedStream)
{
    var compressorOutput = new MemoryStream();
    using var compressionStream = new ZLibStream(compressorOutput, new ZLibCompressionOptions() { CompressionLevel = 6, CompressionStrategy = ZLibCompressionStrategy.HuffmanOnly });
    uncompressedStream.CopyTo(compressionStream);
    compressionStream.Flush();

    return compressorOutput;
}
```

## Add TarEntry.DataOffset

We've [made the position or offset of the data in the enclosing stream for a `System.Formats.Tar.TarEntry` object a public property](https://github.com/dotnet/runtime/pull/105007).

```diff
public abstract partial class TarEntry
{
+        public long DataOffset { get; }
}
```

`TarEntry.DataOffset` returns a position in the entry's archive stream where the entry's first data byte is located. The entry's data is encapsulated in a sub-stream which users can access via `TarEntry.DataStream`, which hides the real position of the data relative to the archive stream. This is enough for most users, but for those who need more flexibility and want to know the real starting position of the data in the archive stream, we added this new API, which should make it easy to support features like concurrent access with very large TAR files.

```csharp
// Create stream for tar ball data in Azure Blob Storage
var blobClient = Azure.Storage.Blobs.BlobClient(....);
var blobClientStream = await blobClient.OpenReadAsync(...);

// Create TarReader for the stream and get a TarEntry
var tarReader = new System.Formats.Tar.TarReader(blobClientStream);
var tarEntry = await tarReader.GetNextEntryAsync();

// get position of TarEntry data in blob stream
var entryOffsetInBlobStream = tarEntry.DataOffset;
var entryLength =  tarEntry.Length;

// create a separate stream
var newBlobClientStream = await TarBlob.OpenReadAsync(...);
newBlobClientStream.Seek(entryOffsetInBlobStream, SeekOrigin.Begin);

// read tar ball content from separate BlobClient stream
var bytes = new byte[length];
await tarBlobStream.ReadAsync(bytes, 0, (int)entryLength);
```

## `HttpClientFactory` no longer logs header values by default

`LogLevel.Trace` events logged by `HttpClientFactory` no longer include header values by default. You may opt-in to logging values for specific headers via the `RedactLoggedHeaders` helper method.

The following example redacts all headers, except for the user agent.

```csharp
services.AddHttpClient("myClient")
    .RedactLoggedHeaders(name => name != "User-Agent");
```

See the [documentation](https://learn.microsoft.com/dotnet/core/compatibility/networking/9.0/redact-headers) for detailed breaking change guidance.

## Out-of-proc Meter wildcard listening

It is already possible to listen to meters out-of-process using the `System.Diagnostics.Metrics` event source provider, but the current implementation requires specifying the full meter name. [This update](https://github.com/dotnet/runtime/pull/105581) introduces support for listening to all meters by using the wildcard character `*`, allowing you to capture metrics from every meter in a process. Additionally, it adds support for listening by meter prefix, so you can listen to all meters whose names start with a specified prefix. For example, using `MyMeter*` will enable listening to all meters with names beginning with `MyMeter`.

```csharp
using System.Diagnostics.Metrics;
using System.Diagnostics.Tracing;

var meter = new Meter("MyCompany.MyMeter"); // Note the complete meter name is "MyCompany.MyMeter"
meter.CreateObservableCounter("MyCounter", () => 1); // Create a counter and allow publishing values.

// Create the listener to use the wildcard character to listen to all meters using prefix names.
MyEventListener listener = new MyEventListener();

// Press Enter to exit the program.
Console.ReadLine();

```

The MyEventListener class is defined as follows:

```csharp
internal class MyEventListener : EventListener
{
    protected override void OnEventSourceCreated(EventSource eventSource)
    {
        Console.WriteLine(eventSource.Name);
        if (eventSource.Name == "System.Diagnostics.Metrics")
        {
            // Listening to all meters with names starting with "MyCompany".
            // If using "*" allow listening to all meters.
            EnableEvents(eventSource, EventLevel.Informational, (EventKeywords)0x3, new Dictionary<string,string?>() { { "Metrics", "MyCompany*" } });
        }
    }

    protected override void OnEventWritten(EventWrittenEventArgs eventData)
    {
        if (eventData.EventSource.Name != "System.Diagnostics.Metrics" || eventData.EventName == "CollectionStart" || eventData.EventName == "CollectionStop" || eventData.EventName == "InstrumentPublished")
        {
            // ignore all events we are not interested in
            return;
        }

        Console.WriteLine(eventData.EventName);

        if (eventData.Payload is not null)
        {
            for (int i = 0; i < eventData.Payload.Count; i++)
            {
                Console.WriteLine($"\t{eventData.PayloadNames![i]}: {eventData.Payload[i]}");
            }
        }
    }
}
```

Upon executing the code, the output displaying the published counter values should appear:

```txt
CounterRateValuePublished
        sessionId: 7cd94a65-0d0d-460e-9141-016bf390d522
        meterName: MyCompany.MyMeter
        meterVersion:
        instrumentName: MyCounter
        unit:
        tags:
        rate: 0
        value: 1
        instrumentId: 1
CounterRateValuePublished
        sessionId: 7cd94a65-0d0d-460e-9141-016bf390d522
        meterName: MyCompany.MyMeter
        meterVersion:
        instrumentName: MyCounter
        unit:
        tags:
        rate: 0
        value: 1
        instrumentId: 1
```

Monitoring tools like [dotnet-counters](https://learn.microsoft.com/dotnet/core/diagnostics/dotnet-counters) can also be used to listen to the metrics using the wildcard.

---

* [Support listening to meters out-of-proc using a wildcard](https://github.com/dotnet/runtime/pull/105581)
* [Add `JsonEnumMemberNameAttribute`](https://github.com/dotnet/runtime/pull/105032)
