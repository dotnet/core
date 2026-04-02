# ASP.NET Core in .NET 11 Preview 3 - Release Notes

Here's a summary of what's new in ASP.NET Core in this preview release:

- [Zstd response compression and request decompression](#zstd-response-compression-and-request-decompression)
- [Virtualize supports variable-height items](#virtualize-supports-variable-height-items)
- [Faster HTTP/3 first requests in Kestrel](#faster-http3-first-requests-in-kestrel)
- [Generate Method code action in Razor files](#generate-method-code-action-in-razor-files)
- [Blazor WebAssembly interop performance improvements](#blazor-webassembly-interop-performance-improvements)
- [OpenBSD runtime identifier support](#openbsd-runtime-identifier-support)

ASP.NET Core updates in .NET 11:

- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-11) documentation.
- [Roadmap](https://github.com/dotnet/aspnetcore/issues/64787)

<!-- API verification notes:
  ZstandardCompressionProvider — confirmed in Microsoft.AspNetCore.ResponseCompression (Microsoft.AspNetCore.App.Ref 11.0.0-preview.3.26179.102)
  ZstandardCompressionProviderOptions — confirmed in Microsoft.AspNetCore.ResponseCompression
  ZstandardDecompressionProvider — not found as a public type; zstd request decompression is registered internally
  Virtualize<T> — confirmed in Microsoft.AspNetCore.Components.Web.Virtualization; ItemSize property still present (defaults to 50px)
-->

## Zstd response compression and request decompression

ASP.NET Core now supports [Zstandard (zstd)](https://facebook.github.io/zstd/) for both response compression and request decompression. Zstd offers higher compression ratios and faster decompression than gzip or Brotli, and is supported by all major browsers ([dotnet/aspnetcore#65479](https://github.com/dotnet/aspnetcore/pull/65479)).

Zstd is registered as a default provider for both response compression and request decompression middleware. When a client sends `Accept-Encoding: zstd`, ASP.NET Core automatically compresses the response using Zstandard.

```csharp
var builder = WebApplication.CreateBuilder(args);

// Zstd is included by default alongside Brotli and Gzip
builder.Services.AddResponseCompression();
builder.Services.AddRequestDecompression();

var app = builder.Build();

app.UseResponseCompression();
app.UseRequestDecompression();

app.MapGet("/", () => "Hello, compressed world!");

app.Run();
```

To customize zstd compression behavior, configure `ZstandardCompressionProviderOptions`:

```csharp
builder.Services.Configure<ZstandardCompressionProviderOptions>(options =>
{
    options.CompressionOptions = new ZstandardCompressionOptions
    {
        CompressionLevel = 3
    };
});
```

Thank you [@manandre](https://github.com/manandre) for this contribution!

## Virtualize supports variable-height items

The `Virtualize<T>` component now measures actual item heights at runtime instead of relying solely on a fixed `ItemSize` estimate ([dotnet/aspnetcore#64964](https://github.com/dotnet/aspnetcore/pull/64964)). This enables lists where items have different heights — such as chat messages, cards with variable content, or data grids with wrapping text — to render and scroll correctly.

Previously, `Virtualize` required setting `ItemSize` to a fixed pixel value and assumed all items had the same height, which caused visual glitches and incorrect scroll positions when item sizes varied. The component now observes rendered items and dynamically adjusts spacing to match their real dimensions.

```razor
<Virtualize Items="messages" Context="message">
    <div class="message-card">
        <h4>@message.Author</h4>
        <p>@message.Text</p>
    </div>
</Virtualize>
```

The `ItemSize` property is still available as an initial estimate for items that haven't been measured yet. For the best experience, you can omit it and let the component adapt automatically.

## Faster HTTP/3 first requests in Kestrel

Kestrel now starts processing HTTP/3 requests immediately instead of waiting for the QUIC control stream and SETTINGS frame to arrive ([dotnet/aspnetcore#65399](https://github.com/dotnet/aspnetcore/pull/65399)). This reduces first-request latency on new HTTP/3 connections, particularly on high-latency links where the control stream setup previously blocked request processing.

## Generate Method code action in Razor files

The Razor editor now supports the "Generate Method" code action. When a Razor component or code block references a method that doesn't exist, the editor offers a Quick Action to generate a method stub with the correct signature ([dotnet/razor#12960](https://github.com/dotnet/razor/pull/12960)). This works in both Visual Studio and VS Code.

## Blazor WebAssembly interop performance improvements

Blazor WebAssembly event dispatch now uses `[JSExport]` fast paths instead of the previous JSON and reflection-based approach ([dotnet/aspnetcore#65897](https://github.com/dotnet/aspnetcore/pull/65897)). Built-in browser events are dispatched through direct managed-to-JS entry points, reducing overhead on every user interaction.

Additional interop calls — including `ConsoleLog`, `NavigateTo`, and `Refresh` — have been migrated to `[JSImport]` for improved performance and smaller download sizes ([dotnet/aspnetcore#65895](https://github.com/dotnet/aspnetcore/pull/65895)).

## OpenBSD runtime identifier support

ASP.NET Core packages now include the OpenBSD runtime identifier, enabling builds targeting OpenBSD ([dotnet/aspnetcore#65628](https://github.com/dotnet/aspnetcore/pull/65628)).

Thank you [@am11](https://github.com/am11) for this contribution!

<!-- Filtered features:
  - OpenAPI 3.2.0 Microsoft.OpenApi update (PR 65415, already covered in Preview 2)
  - [blazor][wasm] Convert more interop to JSImport (PR 65895, covered above as perf improvement)
  - [wasm][coreCLR] do not use mono internals (PR 65029, internal migration to CoreCLR)
  - IIS in-process handler DEFAULT_STACK_SIZE migration (PR 65737, transparent runtime change)
  - [blazor] eslint (PR 65896, internal tooling)
  - Revert media type change for Newtonsoft JsonPatch package (PR 65559, revert of earlier change)
  - Razor: Remove the old language server (PR 12871, internal infrastructure cleanup)
  - Razor: Remove cohost feature flag (PR 12874, internal cleanup)
  - Razor: Create an indent cache for formatting (PR 12950, internal perf improvement)
  - Razor: Centralize C# using directive edits (PR 12895, internal refactoring)
  - Add E2E tests for webworker template (PR 65405, test-only)
  - Add test helper and test cases to validate EventSource IDs (PR 65408, test-only)
  - Upgrade cswin32 + fix build (PR 65516, build tooling)
  - Use Wix5 in SharedFx/Targeting Pack .msi's (PR 65576, build tooling)
  - Add FrameworkReference to Microsoft.AspNetCore.App for non-SharedFx projects (PR 65544, build fix)
-->

## Bug fixes

This release includes bug fixes across several areas:

- **Blazor**
  - Fixed TempData lazy loading so values aren't lost during enumeration and accessors trigger loading correctly ([dotnet/aspnetcore#65722](https://github.com/dotnet/aspnetcore/pull/65722))
  - Fixed null reference error in `Virtualize` when rapidly showing or hiding the component ([dotnet/aspnetcore#65207](https://github.com/dotnet/aspnetcore/pull/65207))
  - Fixed `Virtualize` scroll container detection when `overflow-x` is set, which previously selected the wrong vertical scroll container ([dotnet/aspnetcore#65744](https://github.com/dotnet/aspnetcore/pull/65744))
  - Fixed cache headers (`Cache-Control`, `Vary`, ETag) for the Blazor resource collection endpoint ([dotnet/aspnetcore#65513](https://github.com/dotnet/aspnetcore/pull/65513))
  - Fixed `IJSObjectReference` leak in `ResourceCollectionProvider` that occurred on every resource collection load ([dotnet/aspnetcore#65606](https://github.com/dotnet/aspnetcore/pull/65606))
  - Fixed Web Worker template failing in published Blazor WebAssembly apps by resolving the fingerprinted framework JS URL correctly ([dotnet/aspnetcore#65885](https://github.com/dotnet/aspnetcore/pull/65885))
- **Data Protection**
  - Fixed `ManagedAuthenticatedEncryptor` encryption calculations ([dotnet/aspnetcore#65890](https://github.com/dotnet/aspnetcore/pull/65890))
- **JSON Patch**
  - Fixed `JsonPatchDocument.Replace` when targeting array items backed by `JsonArray`/`IList` ([dotnet/aspnetcore#65470](https://github.com/dotnet/aspnetcore/pull/65470), thank you [@HPOD00019](https://github.com/HPOD00019)!)
- **Kestrel / HTTP**
  - Fixed HTTP/2 header payload padding parsing when `HEADERS` frames carry priority data ([dotnet/aspnetcore#65729](https://github.com/dotnet/aspnetcore/pull/65729))
  - Fixed HTTP/2 `Content-Length` mismatch when trailers are split across `CONTINUATION` frames ([dotnet/aspnetcore#65765](https://github.com/dotnet/aspnetcore/pull/65765))
  - Fixed QPACK/HPACK decoder limit validation to occur after decompression ([dotnet/aspnetcore#65771](https://github.com/dotnet/aspnetcore/pull/65771))
  - Fixed oversized TLS record length handling in `TlsListener` ([dotnet/aspnetcore#65558](https://github.com/dotnet/aspnetcore/pull/65558))
  - Tightened HTTP reason phrase validation ([dotnet/aspnetcore#65797](https://github.com/dotnet/aspnetcore/pull/65797))
  - Fixed memory leaks in `CertificateManager` by improving certificate disposal patterns ([dotnet/aspnetcore#63321](https://github.com/dotnet/aspnetcore/pull/63321))
- **Middleware**
  - Fixed output caching to accept responses when the cache freshness difference is zero ([dotnet/aspnetcore#65659](https://github.com/dotnet/aspnetcore/pull/65659))
- **MVC / Templates**
  - Fixed extraneous lines in generated `.http` files when using source modifiers ([dotnet/aspnetcore#65318](https://github.com/dotnet/aspnetcore/pull/65318))
- **Razor Tooling**
  - Fixed block-bodied lambda attribute formatting ([dotnet/razor#12913](https://github.com/dotnet/razor/pull/12913))
  - Fixed formatting of script tags that are tag helpers ([dotnet/razor#12922](https://github.com/dotnet/razor/pull/12922))
  - Fixed attribute formatting for short HTML tags ([dotnet/razor#12944](https://github.com/dotnet/razor/pull/12944))
  - Fixed parsing when non-whitespace content follows a Razor comment end ([dotnet/razor#12961](https://github.com/dotnet/razor/pull/12961))
  - Removed false "unused directive" diagnostics in VS Code ([dotnet/razor#12932](https://github.com/dotnet/razor/pull/12932))
  - Fixed code actions for unmapped directive spans ([dotnet/razor#12893](https://github.com/dotnet/razor/pull/12893))
- **SignalR**
  - Fixed cancellation handling with stateful reconnect ([dotnet/aspnetcore#65732](https://github.com/dotnet/aspnetcore/pull/65732))
- **Validation**
  - Fixed validation source generator to skip indexer properties like `JsonElement` and `Dictionary` ([dotnet/aspnetcore#65432](https://github.com/dotnet/aspnetcore/pull/65432))

## Community contributors

Thank you contributors! ❤️

- [@am11](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3Aam11)
- [@DarianBaker](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3ADarianBaker)
- [@HPOD00019](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3AHPOD00019)
- [@kasperk81](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3Akasperk81)
- [@manandre](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3Amanandre)
