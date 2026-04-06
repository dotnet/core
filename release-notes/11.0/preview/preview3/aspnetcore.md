# ASP.NET Core in .NET 11 Preview 3 - Release Notes

Here's a summary of what's new in ASP.NET Core in this preview release:

- [Zstandard response compression and request decompression](#zstandard-response-compression-and-request-decompression)
- [Virtualize now works better with variable-height items](#virtualize-now-works-better-with-variable-height-items)
- [HTTP/3 and Blazor WebAssembly both get faster paths](#http3-and-blazor-webassembly-both-get-faster-paths)
- [Generate Method now works in Razor files](#generate-method-now-works-in-razor-files)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

ASP.NET Core updates in .NET 11:

- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-11)
- [Roadmap](https://github.com/dotnet/aspnetcore/issues/64787)

<!-- Verified against Microsoft.AspNetCore.App.Ref@11.0.0-preview.3.26179.102 -->

## Zstandard response compression and request decompression

ASP.NET Core now supports [Zstandard (zstd)](https://facebook.github.io/zstd/)
for both response compression and request decompression
([dotnet/aspnetcore#65479](https://github.com/dotnet/aspnetcore/pull/65479)).
This gives web developers another standards-based compression option with a very
familiar programming model.

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

## Virtualize now works better with variable-height items

Blazor's `Virtualize<TItem>` component no longer assumes every item has the same
height. Preview 3 teaches it to adapt to measured item sizes at runtime, which
makes scenarios like chat transcripts, cards, and wrapped text lists behave much
more naturally
([dotnet/aspnetcore#64964](https://github.com/dotnet/aspnetcore/pull/64964)).

```razor
<Virtualize Items="messages" Context="message">
    <article class="message-card">
        <h4>@message.Author</h4>
        <p>@message.Text</p>
    </article>
</Virtualize>
```

## HTTP/3 and Blazor WebAssembly both get faster paths

Kestrel now starts processing HTTP/3 requests without waiting for the control
stream and SETTINGS frame first, which reduces first-request latency on new
connections ([dotnet/aspnetcore#65399](https://github.com/dotnet/aspnetcore/pull/65399)).

Blazor WebAssembly also moves more interop paths to `JSImport` / `JSExport`
([dotnet/aspnetcore#65895](https://github.com/dotnet/aspnetcore/pull/65895),
[dotnet/aspnetcore#65897](https://github.com/dotnet/aspnetcore/pull/65897)),
which is part of the broader runtime/browser work this preview.

## Generate Method now works in Razor files

The Razor editor now offers the familiar **Generate Method** code action inside
Razor files, so missing event handlers and helper methods are easier to stub out
without leaving the editor
([dotnet/razor#12960](https://github.com/dotnet/razor/pull/12960)).

<!-- Filtered features (significant engineering work, but too niche or already covered elsewhere):
  - OpenAPI 3.2 support: a real breaking-change story for OpenAPI users, but already documented in Preview 2 and not repeated here.
  - OpenBSD RID support: welcome platform work, but too narrow for the main ASP.NET Core notes.
-->

## Bug fixes

- **Blazor**
  - Fixed a null reference error in `Virtualize`
    ([dotnet/aspnetcore#65207](https://github.com/dotnet/aspnetcore/pull/65207)).
  - Fixed scroll-container detection when `overflow-x` is set
    ([dotnet/aspnetcore#65744](https://github.com/dotnet/aspnetcore/pull/65744)).
  - Fixed the Web Worker template in published Blazor WebAssembly apps
    ([dotnet/aspnetcore#65885](https://github.com/dotnet/aspnetcore/pull/65885)).
- **HTTP / Kestrel**
  - Fixed HTTP/2 and header-decoding issues in several edge cases
    ([dotnet/aspnetcore#65729](https://github.com/dotnet/aspnetcore/pull/65729),
    [dotnet/aspnetcore#65765](https://github.com/dotnet/aspnetcore/pull/65765),
    [dotnet/aspnetcore#65771](https://github.com/dotnet/aspnetcore/pull/65771)).
- **JSON Patch**
  - Fixed `JsonPatchDocument.Replace` for array items backed by `JsonArray` /
    `IList` ([dotnet/aspnetcore#65470](https://github.com/dotnet/aspnetcore/pull/65470)).

## Community contributors

Thank you contributors! ❤️

- [@am11](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3Aam11)
- [@DarianBaker](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3ADarianBaker)
- [@HPOD00019](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3AHPOD00019)
- [@kasperk81](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3Akasperk81)
- [@manandre](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview3+author%3Amanandre)
