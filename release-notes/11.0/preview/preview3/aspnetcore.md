# ASP.NET Core in .NET 11 Preview 3 - Release Notes

.NET 11 Preview 3 includes new ASP.NET Core features and improvements:

- [Zstandard response compression and request decompression](#zstandard-response-compression-and-request-decompression)
- [Virtualize adapts to variable-height items at runtime](#virtualize-adapts-to-variable-height-items-at-runtime)
- [HTTP/3 starts processing requests earlier](#http3-starts-processing-requests-earlier)
- [Blazor WebAssembly moves more interop to JSImport and JSExport](#blazor-webassembly-moves-more-interop-to-jsimport-and-jsexport)
- [Generate Method now works in Razor files](#generate-method-now-works-in-razor-files)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

ASP.NET Core updates in .NET 11:

- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-11)
- [dotnet/aspnetcore #64787](https://github.com/dotnet/aspnetcore/issues/64787)

<!-- Verified against Microsoft.AspNetCore.App.Ref@11.0.0-preview.3.26179.102 -->

## Zstandard response compression and request decompression

ASP.NET Core now supports [Zstandard (zstd)](https://facebook.github.io/zstd/)
for both response compression and request decompression
([dotnet/aspnetcore #65479](https://github.com/dotnet/aspnetcore/pull/65479)).
This adds zstd support to the existing response-compression and
request-decompression middleware.

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddResponseCompression();
builder.Services.AddRequestDecompression();
builder.Services.Configure<ZstandardCompressionProviderOptions>(options =>
{
    options.CompressionOptions = new ZstandardCompressionOptions();
});
```

Thank you [@manandre](https://github.com/manandre) for this contribution!

## Virtualize adapts to variable-height items at runtime

Blazor's `Virtualize<TItem>` component no longer assumes every item has the same
height. Preview 3 updates it to adapt to measured item sizes at runtime, which
reduces incorrect spacing and scrolling when item heights vary
([dotnet/aspnetcore #64964](https://github.com/dotnet/aspnetcore/pull/64964)).

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

## Blazor WebAssembly moves more interop to JSImport and JSExport

Blazor WebAssembly now moves more interop paths to `JSImport` / `JSExport`
([dotnet/aspnetcore #65895](https://github.com/dotnet/aspnetcore/pull/65895),
[dotnet/aspnetcore #65897](https://github.com/dotnet/aspnetcore/pull/65897)),
which is part of the broader runtime/browser work in this preview.

## Generate Method now works in Razor files

The Razor editor now offers the familiar **Generate Method** code action inside
Razor files, so you can stub out missing event handlers and helper methods
directly in the editor
([dotnet/razor #12960](https://github.com/dotnet/razor/pull/12960)).

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
- **HTTP / Kestrel**
  - Fixed HTTP/2 and header-decoding issues in several edge cases
    ([dotnet/aspnetcore #65729](https://github.com/dotnet/aspnetcore/pull/65729),
    [dotnet/aspnetcore #65765](https://github.com/dotnet/aspnetcore/pull/65765),
    [dotnet/aspnetcore #65771](https://github.com/dotnet/aspnetcore/pull/65771)).
- **JSON Patch**
  - Fixed `JsonPatchDocument.Replace` for array items backed by `JsonArray` /
    `IList` ([dotnet/aspnetcore #65470](https://github.com/dotnet/aspnetcore/pull/65470)).

## Community contributors

Thank you contributors! ❤️

- [@am11](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3Aam11)
- [@DarianBaker](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3ADarianBaker)
- [@HPOD00019](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3AHPOD00019)
- [@kasperk81](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3Akasperk81)
- [@manandre](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3Amanandre)
