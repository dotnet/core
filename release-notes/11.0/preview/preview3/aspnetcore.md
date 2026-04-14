# ASP.NET Core in .NET 11 Preview 3 - Release Notes

.NET 11 Preview 3 includes new ASP.NET Core features and improvements:

- [Zstandard response compression and request decompression](#zstandard-response-compression-and-request-decompression)
- [Virtualize adapts to variable-height items at runtime](#virtualize-adapts-to-variable-height-items-at-runtime)
- [HTTP/3 starts processing requests earlier](#http3-starts-processing-requests-earlier)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

ASP.NET Core updates in .NET 11:

- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-11)
- [Roadmap](https://github.com/dotnet/aspnetcore/issues/64787)

<!-- Verified against Microsoft.AspNetCore.App.Ref@11.0.0-preview.3.26179.102 -->

## Zstandard response compression and request decompression

ASP.NET Core now supports [Zstandard (zstd)](https://facebook.github.io/zstd/)
for both response compression and request decompression
([dotnet/aspnetcore #65479](https://github.com/dotnet/aspnetcore/pull/65479)).
This adds zstd support to the existing response-compression and
request-decompression middleware and enables it by default.

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddResponseCompression();
builder.Services.AddRequestDecompression();
builder.Services.Configure<ZstandardCompressionProviderOptions>(options =>
{
    options.CompressionOptions = new ZstandardCompressionOptions
    {
        Quality = 6 // 1-22, higher = better compression, slower
    };
});
```

Thank you [@manandre](https://github.com/manandre) for this contribution!

## Virtualize adapts to variable-height items at runtime

Blazor's `Virtualize<TItem>` component no longer assumes every item has the same height. The component now adapts to measured item sizes at runtime, which reduces incorrect spacing and scrolling when item heights vary. These updates include an update to the default value of `OverscanCount` from `3` to `15` to increase the precision of average item height calculations. `QuickGrid` continues to use an `OverscanCount` of `3` to reduce the potential for adverse performance impact ([dotnet/aspnetcore #64964](https://github.com/dotnet/aspnetcore/pull/64964)).

```razor
<Virtualize Items="messages" Context="message">
    <article class="message-card">
        <h4>@message.Author</h4>
        <p>@message.Text</p>
    </article>
</Virtualize>
```

## HTTP/3 starts processing requests earlier

Kestrel now starts processing HTTP/3 requests without waiting for the control
stream and SETTINGS frame first, which reduces first-request latency on new
connections ([dotnet/aspnetcore #65399](https://github.com/dotnet/aspnetcore/pull/65399)).

<!-- Filtered features (significant engineering work, but too niche or already covered elsewhere):
  - OpenAPI 3.2 support: a real breaking-change story for OpenAPI users, but already documented in Preview 2 and not repeated here.
  - OpenBSD RID support: welcome platform work, but too narrow for the main ASP.NET Core notes.
-->

## Bug fixes

- **Blazor**
  - Fixed a null reference error in `Virtualize`
    ([dotnet/aspnetcore #65207](https://github.com/dotnet/aspnetcore/pull/65207)).
  - Fixed scroll-container detection when `overflow-x` is set
    ([dotnet/aspnetcore #65744](https://github.com/dotnet/aspnetcore/pull/65744)).
  - Fixed the Web Worker template in published Blazor WebAssembly apps
    ([dotnet/aspnetcore #65885](https://github.com/dotnet/aspnetcore/pull/65885)).
  - Fixed TempData lazy loading: `Get`, `Remove`, `Keep`, and enumeration now correctly trigger lazy loading
    ([dotnet/aspnetcore #65722](https://github.com/dotnet/aspnetcore/pull/65722)).
  - Fixed `IJSObjectReference` leak in `ResourceCollectionProvider`
    ([dotnet/aspnetcore #65606](https://github.com/dotnet/aspnetcore/pull/65606)).
  - Fixed cache headers for the Blazor resource collection endpoint to include `no-transform` and correct `Vary` headers
    ([dotnet/aspnetcore #65513](https://github.com/dotnet/aspnetcore/pull/65513)).
- **Data Protection**
  - Fixed `ManagedAuthenticatedEncryptor` hash calculation and comparison on .NET Framework targets
    ([dotnet/aspnetcore #65890](https://github.com/dotnet/aspnetcore/pull/65890)).
- **HTTP / Kestrel**
  - Fixed HTTP/2 HEADERS frame padding length validation to account for PRIORITY flag bytes
    ([dotnet/aspnetcore #65729](https://github.com/dotnet/aspnetcore/pull/65729)).
  - Fixed HTTP/2 Content-Length mismatch with trailers split across CONTINUATION frames
    ([dotnet/aspnetcore #65765](https://github.com/dotnet/aspnetcore/pull/65765)).
  - Fixed HPACK/QPACK decoder to validate uncompressed header size limits per `MaxRequestHeaderFieldSize` documentation
    ([dotnet/aspnetcore #65771](https://github.com/dotnet/aspnetcore/pull/65771)).
  - Fixed oversized TLS record length handling in `TlsListener` per RFC 8446
    ([dotnet/aspnetcore #65558](https://github.com/dotnet/aspnetcore/pull/65558)).
  - Updated `ReasonPhrase` validation for HTTP responses
    ([dotnet/aspnetcore #65797](https://github.com/dotnet/aspnetcore/pull/65797)).
- **JSON Patch**
  - Fixed `JsonPatchDocument` operations on properties within array elements
    ([dotnet/aspnetcore #65470](https://github.com/dotnet/aspnetcore/pull/65470)).
- **Middleware**
  - Fixed output caching freshness check that incorrectly rejected cached entries when the request arrived on the same tick as the cache write
    ([dotnet/aspnetcore #65659](https://github.com/dotnet/aspnetcore/pull/65659)).
- **Minimal APIs**
  - Fixed validation source generator crash when encountering types with indexers like `JsonElement` and `Dictionary`
    ([dotnet/aspnetcore #65432](https://github.com/dotnet/aspnetcore/pull/65432)).
- **SignalR**
  - Fixed cancellation handling with `StatefulReconnect` to be more aggressive
    ([dotnet/aspnetcore #65732](https://github.com/dotnet/aspnetcore/pull/65732)).

## Community contributors

Thank you contributors! ❤️

- [@am11](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3Aam11)
- [@DarianBaker](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3ADarianBaker)
- [@HPOD00019](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3AHPOD00019)
- [@kasperk81](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3Akasperk81)
- [@kklocker](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3Akklocker)
- [@manandre](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3Amanandre)
- [@martincostello](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3Amartincostello)
