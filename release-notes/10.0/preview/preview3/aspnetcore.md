# ASP.NET Core in .NET 10 Preview 3 - Release Notes

Here's a summary of what's new in ASP.NET Core in this preview release:

- [Declarative model for persisting state from components and services](
- #declarative-model-for-persisting-state-from-components-and-services)
- [Reference fingerprinted static web assets in standalone Blazor WebAssembly apps](#reference-fingerprinted-static-web-assets-in-standalone-blazor-webassembly-apps)
- [`HttpClient` response streaming enabled by default on WebAssembly](#httpclient-response-streaming-enabled-by-default-on-webassembly)
- [`DisableMatchAllIgnoresLeftUriPart` app context switch renamed to `EnableMatchAllForQueryStringAndFragment`](#disablematchallignoreslefturipart-app-context-switch-renamed-to-enablementchallofthequerystringandfragment)
- [Support for Server-Sent Events (SSE)](#support-for-server-sent-events-sse)

ASP.NET Core updates in .NET 10:

- [What's new in ASP.NET Core in .NET 10](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-10.0) documentation.
- [Breaking changes](https://docs.microsoft.com/dotnet/core/compatibility/10.0#aspnet-core)
- [Roadmap](https://github.com/dotnet/aspnetcore/issues/59443)

## Declarative model for persisting state from components and services

Blazor supports persisting component state during prerendering using the `PersistentComponentState` service, which helps prevent UI flickering when your component does asynchronous initialization.

You can now declarative specify state to persist from components and configured services using the the `SupplyParameterFromPersistentComponentState` attribute.

## Reference fingerprinted static web assets in standalone Blazor WebAssembly apps

Standalone Blazor WebAssembly apps can now reference framework static web assets using either a generated import map or using a fingerprinted URL. The import map and the fingerprinted URLs are generated as part of the build process when you specify the `<WriteImportMapToHtml>true</WriteImportMapToHtml>` property in the project file.

**blazorwasm.csproj**

```diff
<Project Sdk="Microsoft.NET.Sdk.BlazorWebAssembly">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
+   <WriteImportMapToHtml>true</WriteImportMapToHtml>
  </PropertyGroup>
</Project>
```

To specify where the import map should be generated, add an empty `<script type="importmap"></script>` element to your *index.html* file. To generate fingerprinted URLs for referenced static web assets, use the `#[.{fingerprint}]` placeholder.

**index.html**

```diff
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BlazorWasmFingerprintingE2E</title>
    <base href="/" />
    ....
+    <script type="importmap"></script>
</head>

<body>
    <div id="app">
        <svg class="loading-progress">
            <circle r="40%" cx="50%" cy="50%" />
            <circle r="40%" cx="50%" cy="50%" />
        </svg>
        <div class="loading-progress-text"></div>
    </div>

    <div id="blazor-error-ui">
        An unhandled error has occurred.
        <a href="." class="reload">Reload</a>
        <span class="dismiss">🗙</span>
    </div>
-   <script src="_framework/blazor.webassembly.js"></script>
+   <script src="_framework/blazor.webassembly#[.{fingerprint}].js"></script>
</body>

</html>
```

## `HttpClient` response streaming enabled by default on WebAssembly

Response streaming is now enabled by default for `HttpClient` in Blazor WebAssembly. This change improves performance and reduces memory usage when handling large responses. However, it also means the response stream no longer supports synchronous operations. If your code requires using synchronous operations, you can opt-out of response streaming for an individual request using the `SetBrowserResponseStreamingEnabled` extension method on the response message:

```csharp
requestMessage.SetBrowserResponseStreamingEnabled(false);
```

## `DisableMatchAllIgnoresLeftUriPart` app context switch renamed to `EnableMatchAllForQueryStringAndFragment`

The `Microsoft.AspNetCore.Components.Routing.NavLink.DisableMatchAllIgnoresLeftUriPart` app context switch was renamed to `Microsoft.AspNetCore.Components.Routing.NavLink.EnableMatchAllForQueryStringAndFragment`.

## Support for Server-Sent Events (SSE)

ASP.NET Core now supports returning a `ServerSentEvents` result using the `TypedResults.ServerSentEvents` API. This feature is supported in both minimal APIs and controller-based apps.

Server-Sent Events (SSE) is a server push technology that allows a server to send a stream of event messages to a client over a single HTTP connection. In .NET the event messages are represented as [SseItem<T>](https://learn.microsoft.com/dotnet/api/system.net.serversentevents.sseitem-1) objects, which may contain an event type, an ID, and a data payload of type `T`.

The `TypedResults` class has a new static `ServerSentEvents` method  that can be used to return a `ServerSentEvents` result. The first parameter to this method is an `IAsyncEnumerable<SseItem<T>>` that represents the stream of event messages to be sent to the client.

The following example illustrates how to use the  `TypedResults.ServerSentEvents` API to return a stream of heart rate events as JSON objects to the client:

```csharp
app.MapGet("/json-item", (CancellationToken cancellationToken) =>
{
    async IAsyncEnumerable<HeartRateEvent> GetHeartRate(
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            var heartRate = Random.Shared.Next(60, 100);
            yield return HeartRateEvent.Create(heartRate);
            await Task.Delay(2000, cancellationToken);
        }
    }

    return TypedResults.ServerSentEvents(GetHeartRate(cancellationToken), eventType: "heartRate");
});
```

## Community contributors

Thank you contributors! ❤️

- [@NSTom](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3ANSTom)
- [@Varorbc](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3AVarorbc)
- [@Youssef1313](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3AYoussef1313)
- [@alexbeeston](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Aalexbeeston)
- [@benhopkinstech](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Abenhopkinstech)
- [@jnjudge1](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Ajnjudge1)
- [@lextm](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Alextm)
- [@mapedersen](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Amapedersen)
- [@nidaca](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Anidaca)
- [@sander1095](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Asander1095)
- [@shethaadit](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Ashethaadit)
- [@smnsht](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Asmnsht)
- [@xt0rted](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Axt0rted)

