# ASP.NET Core in .NET 11 Preview 4 - Release Notes

.NET 11 Preview 4 includes new ASP.NET Core features and improvements:

- [HTTP QUERY in generated OpenAPI documents](#http-query-in-generated-openapi-documents)
- [SupplyParameterFromTempData for Blazor](#supplyparameterfromtempdata-for-blazor)
- [Server-initiated Blazor Server circuit pause](#server-initiated-blazor-server-circuit-pause)
- [Virtualize keeps the viewport stable when content above it changes](#virtualize-keeps-the-viewport-stable-when-content-above-it-changes)
- [Virtualize AnchorMode for stable viewports during prepend and append](#virtualize-anchormode-for-stable-viewports-during-prepend-and-append)
- [Blazor WebAssembly service defaults template](#blazor-webassembly-service-defaults-template)
- [MCP Server template ships with the .NET SDK](#mcp-server-template-ships-with-the-net-sdk)
- [Blazor Web Worker template updates](#blazor-web-worker-template-updates)
- [TLS handshake observability in Kestrel](#tls-handshake-observability-in-kestrel)
- [Response compression always emits `Vary: Accept-Encoding`](#response-compression-always-emits-vary-accept-encoding)
- [File result types appear in OpenAPI documents](#file-result-types-appear-in-openapi-documents)
- [Endpoint filters observe parameter-binding failures](#endpoint-filters-observe-parameter-binding-failures)
- [Smaller Blazor WebAssembly publish output](#smaller-blazor-webassembly-publish-output)
- [Runtime-async enabled for shared framework libraries](#runtime-async-enabled-for-shared-framework-libraries)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

ASP.NET Core updates in .NET 11:

- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-11)

## HTTP QUERY in generated OpenAPI documents

OpenAPI document generation now recognizes [HTTP QUERY](https://datatracker.ietf.org/doc/draft-ietf-httpbis-safe-method-w-body/) as a known operation type ([dotnet/aspnetcore #65714](https://github.com/dotnet/aspnetcore/pull/65714)). QUERY is a proposed safe, idempotent method that lets clients send a request body when describing a search — useful when a query is too large or too structured to fit in a URL. Routing already accepted arbitrary verb strings via `MapMethods`, and OpenAPI 3.2 adds a [`query` field to the Path Item Object](https://spec.openapis.org/oas/v3.2.0.html#fixed-fields-6) so this can be described in the OpenAPI document. This change makes QUERY endpoints show up correctly in the generated OpenAPI document so client generators and API explorers can consume them.

Note that `query` is only valid in an OpenAPI 3.2 document, so you'll want to set the `OpenApiVersion` in the `OpenApiOptions`. In earlier OpenAPI versions, the `query` operation is generated within an `x-oai-additionalOperations` specification extension in the Path Item Object.

```csharp
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi(options =>
{
    options.OpenApiVersion = OpenApiSpecVersion.OpenApi3_2;
});

var app = builder.Build();

app.MapOpenApi();

app.MapMethods("/search", ["QUERY"], (SearchRequest request) =>
    SearchService.Run(request));

app.Run();
```

In an OpenAPI 3.2 document, the QUERY operation is described inline as a sibling of `get`, `post`, and friends:

```json
"paths": {
  "/search": {
    "query": {
      "requestBody": { ... },
      "responses": { "200": { ... } }
    }
  }
}
```

In OpenAPI 3.0 and 3.1 documents, the same operation is represented under the `x-oai-additionalOperations` extension on the Path Item:

```json
"paths": {
  "/search": {
    "x-oai-additionalOperations": {
      "QUERY": {
        "requestBody": { ... },
        "responses": { "200": { ... } }
      }
    }
  }
}
```

Thank you [@kilifu](https://github.com/kilifu) for this contribution!

## `SupplyParameterFromTempData` for Blazor

A new `[SupplyParameterFromTempData]` attribute reads and writes TempData values directly on a Blazor SSR component property, in the same style as `[SupplyParameterFromQuery]` and `[SupplyParameterFromForm]` ([dotnet/aspnetcore #65306](https://github.com/dotnet/aspnetcore/pull/65306)).

```razor
@page "/account/manage"

<StatusMessage Message="@StatusMessage" />

@code {
    [SupplyParameterFromTempData]
    public string? StatusMessage { get; set; }
}
```

If the property name doesn't match the TempData key you want, set `Name` on the attribute. Setting the property writes through to TempData so the next request can read it — handy for status messages that survive a redirect-after-post.

The Blazor Identity project template was rewritten to use this attribute instead of the previous custom status-message cookie ([dotnet/aspnetcore #65752](https://github.com/dotnet/aspnetcore/pull/65752)).

## Server-initiated Blazor Server circuit pause

`Circuit.RequestCircuitPauseAsync` lets server-side code ask the connected Blazor client to begin the graceful circuit-pause flow ([dotnet/aspnetcore #66455](https://github.com/dotnet/aspnetcore/pull/66455)). Until now, pause was only triggered by client-side navigation; this gives operators a programmatic way to drain circuits during deployments or load-balancer rebalancing.

There is no public registry of active circuits, so the supported way to obtain a `Circuit` instance is to capture it from `CircuitHandler.OnConnectionUpAsync`. A small handler that tracks circuits and lets a hosted service drain them looks like this:

```csharp
public class CircuitTracker : CircuitHandler
{
    private static readonly ConcurrentDictionary<string, Circuit> _circuits = new();

    public static IReadOnlyCollection<Circuit> ActiveCircuits => _circuits.Values.ToArray();

    public override Task OnConnectionUpAsync(Circuit circuit, CancellationToken cancellationToken)
    {
        _circuits[circuit.Id] = circuit;
        return Task.CompletedTask;
    }

    public override Task OnCircuitClosedAsync(Circuit circuit, CancellationToken cancellationToken)
    {
        _circuits.TryRemove(circuit.Id, out _);
        return Task.CompletedTask;
    }
}

// In Program.cs:
builder.Services.AddScoped<CircuitTracker>();
builder.Services.AddScoped<CircuitHandler>(sp => sp.GetRequiredService<CircuitTracker>());

// In a drain service:
foreach (var circuit in CircuitTracker.ActiveCircuits)
{
    await circuit.RequestCircuitPauseAsync();
}
```

`RequestCircuitPauseAsync` returns `true` when the client was successfully asked to begin pausing, and `false` if the circuit is already disposed, not yet initialized, or not currently connected. On the JS side, clients can defer the request via the optional `onPauseRequested` callback on the Blazor.start() options.

## Virtualize keeps the viewport stable when content above it changes

Blazor's `Virtualize<TItem>` no longer shifts visible content when items above the viewport change height ([dotnet/aspnetcore #65951](https://github.com/dotnet/aspnetcore/pull/65951)). Previously the component disabled the browser's native scroll anchoring (to avoid an infinite render loop) which meant any height change above the viewport — item expansion, data updates, lazy-loaded content — would cause visible items to jump on screen.

The fix uses a hybrid approach: native CSS scroll anchoring on browsers that support it for non-`<table>` layouts, with a manual `ResizeObserver`-based scroll-compensation fallback for `<table>` layouts and Safari (where native anchoring miscalculates positions on `<tr>` candidates). Apps using `Virtualize` get this automatically — no API changes required.

## Virtualize AnchorMode for stable viewports during prepend and append

A new `AnchorMode` parameter on `Virtualize<TItem>` controls viewport behavior at list edges when items are added dynamically — for chat UIs, news feeds, log viewers, and similar scenarios ([dotnet/aspnetcore #66521](https://github.com/dotnet/aspnetcore/pull/66521)). The component snapshots an anchor element before each render and restores its position after, so the visible items stay where the user is looking even when items are inserted before the current viewport (prepend) or after it (append). The mechanism works for both fixed- and variable-height items.

```razor
<Virtualize Items="@notifications"
            AnchorMode="VirtualizeAnchorMode.Beginning"
            ItemComparer="@_notificationById">
    <ItemContent Context="item">@item.Text</ItemContent>
</Virtualize>

@code {
    private static readonly IEqualityComparer<Notification> _notificationById =
        EqualityComparer<Notification>.Create((a, b) => a?.Id == b?.Id, n => n.Id.GetHashCode());
}
```

`AnchorMode` is a `[Flags]` enum that accepts:

- `VirtualizeAnchorMode.Beginning` (default) — pins the first visible item. When the user is at or near the top of the list and items are prepended, the viewport stays at the top showing the newest items — matching news feed and notification list UX.
- `VirtualizeAnchorMode.End` — pins the last visible item. When the user is at or near the bottom of the list and items are appended, the viewport auto-scrolls to show them — matching chat and log viewer UX. If the user has scrolled away, auto-scroll disengages until they return to the bottom.
- `VirtualizeAnchorMode.None` — no edge pinning. The viewport stays at its current scroll position regardless of item changes.

Combine `Beginning | End` to pin both edges.

For reference-type items, also supply an `ItemComparer` so the component can correlate items across renders. Without one, `Virtualize` falls back to `EqualityComparer<T>.Default`, which uses reference equality for reference types and won't recognize a re-fetched item as the same logical entity.

## Blazor WebAssembly service defaults template

A new `blazor-wasm-servicedefaults` template scaffolds a service-defaults library for Blazor WebAssembly clients with .NET Aspire integration ([dotnet/aspnetcore #64807](https://github.com/dotnet/aspnetcore/pull/64807)). It mirrors the service-defaults pattern that Aspire already uses for server projects and `dotnet/maui` ships for MAUI clients.

```bash
dotnet new blazor-wasm-servicedefaults -o MyBlazorApp.ServiceDefaults
```

The generated library wires up OpenTelemetry logging/metrics/tracing with the OTLP exporter, service discovery via `Microsoft.Extensions.ServiceDiscovery`, and standard HTTP resilience handlers from `Microsoft.Extensions.Http.Resilience`. Reference the project from your Blazor WebAssembly client and call the generated extension method during startup:

```csharp
builder.AddBlazorClientServiceDefaults();
```

## MCP Server template ships with the .NET SDK

The `mcpserver` project template, previously available only by installing `Microsoft.McpServer.ProjectTemplates`, now ships as a bundled template in the .NET SDK ([dotnet/aspnetcore #66520](https://github.com/dotnet/aspnetcore/pull/66520)).

```bash
dotnet new mcpserver -o MyMcpServer
```

Moving the template into ASP.NET Core makes it discoverable from `dotnet new list` without a separate install step, and aligns its servicing with the rest of the web stack.

## Blazor Web Worker template updates

The standalone `.NET Web Worker` template — which scaffolds a Web Worker client for offloading long-running work to a background thread in Blazor WebAssembly and Blazor Web apps — was renamed to **`Blazor Web Worker`** to make it clearer that it's part of the Blazor stack ([dotnet/aspnetcore #66070](https://github.com/dotnet/aspnetcore/pull/66070)). The same change adds two often-requested capabilities to the generated `WebWorkerClient`:

- **`InvokeVoidAsync`** for fire-and-forget worker calls that don't return a value, mirroring the shape on `IJSRuntime`.
- **Cancellation and timeout support** on both worker creation and worker invocations, so callers can pass a `CancellationToken` and tear down a stuck worker cleanly.

```bash
dotnet new blazorwebworker -o MyApp.Worker
```

Existing projects created with the old template continue to work — the rename only affects the template name shown in `dotnet new list` and Visual Studio.

## TLS handshake observability in Kestrel

Two related changes make it easier to diagnose and customize TLS connections in Kestrel.

`ITlsHandshakeFeature` now exposes an `Exception` property containing the exception thrown during a failed TLS handshake, so middleware and logging can record why a connection failed instead of seeing a bare `IOException` further up the stack ([dotnet/aspnetcore #65807](https://github.com/dotnet/aspnetcore/pull/65807)). The feature continues to work after the handshake fails — Kestrel snapshots the relevant fields off the underlying `SslStream` before it is disposed.

The `TlsClientHelloBytesCallback` option on `HttpsConnectionAdapterOptions` was reworked as a connection middleware ([dotnet/aspnetcore #65808](https://github.com/dotnet/aspnetcore/pull/65808)). The previous callback shape is now obsolete; configure ClientHello inspection via the new `ListenOptions.UseTlsClientHelloListener` extension instead. The example below uses both features together — connection middleware reads `ITlsHandshakeFeature.Exception` after the handshake, and `UseTlsClientHelloListener` inspects the ClientHello before TLS:

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5001, listenOptions =>
    {
        listenOptions.Use(next => async context =>
        {
            await next(context);

            var tlsHandshakeFeature = context.Features.Get<ITlsHandshakeFeature>();
            if (tlsHandshakeFeature?.Exception is { } ex)
            {
                Console.WriteLine($"[TLS Handshake Failed] ConnectionId={context.ConnectionId}, Exception={ex.GetType().Name}: {ex.Message}");
            }
        });

        // UseTlsClientHelloListener must be called before UseHttps()
        listenOptions.UseTlsClientHelloListener((connection, clientHelloBytes) =>
        {
            Console.WriteLine($"TLS Client Hello received on {connection.ConnectionId}, {clientHelloBytes.Length} bytes");
        });
        listenOptions.UseHttps();
    });
});
```

## Response compression always emits `Vary: Accept-Encoding`

The response-compression middleware now adds `Vary: Accept-Encoding` to every response when compression is enabled, even when the response itself isn't compressed ([dotnet/aspnetcore #55092](https://github.com/dotnet/aspnetcore/pull/55092)). This prevents shared caches and CDNs from serving a compressed payload to a client that didn't ask for one (or vice versa).

Thank you [@pedrobsaila](https://github.com/pedrobsaila) for this contribution!

## File result types appear in OpenAPI documents

`FileStreamResult`, `FileContentHttpResult`, and `FileStreamHttpResult` are now described as binary string schemas in generated OpenAPI documents, so clients see accurate response shapes for endpoints that stream files ([dotnet/aspnetcore #64562](https://github.com/dotnet/aspnetcore/pull/64562)). Annotate the endpoint with `.Produces<FileContentHttpResult>(contentType: "application/pdf")` (or the equivalent `*StreamHttpResult`/`FileStreamResult` type) so OpenAPI sees the result type and emits the binary schema.

Thank you [@marcominerva](https://github.com/marcominerva) for this contribution!

## Endpoint filters observe parameter-binding failures

When a minimal API endpoint has any filters or filter factories configured, the filter pipeline now runs even if parameter binding fails ([dotnet/aspnetcore #64539](https://github.com/dotnet/aspnetcore/pull/64539)). Filters can read `HttpContext.Response.StatusCode == 400` and substitute their own response body.

In the `Development` environment, set `RouteHandlerOptions.ThrowOnBadRequest = false` so the framework returns a 400 the filter can observe instead of throwing `BadHttpRequestException` to the developer exception page. This is already the default in non-`Development` environments.

This change has also been backported to 10.0.8.

Thank you [@marcominerva](https://github.com/marcominerva) for this contribution!

## Smaller Blazor WebAssembly publish output

Two trimming changes shrink published Blazor WebAssembly apps that don't use OpenTelemetry or hot reload:

- The `ComponentsMetrics` and `ComponentsActivitySource` types are now gated behind a `[FeatureSwitchDefinition]`, so the trimmer can drop the metrics and tracing call paths from `Renderer` and friends when `System.Diagnostics.Metrics.Meter.IsSupported` is `false` (the default for trimmed apps) ([dotnet/aspnetcore #65901](https://github.com/dotnet/aspnetcore/pull/65901)).
- `HotReloadManager` now exposes a feature-switched `IsSupported` property tied to `System.Reflection.Metadata.MetadataUpdater.IsSupported`, so the trimmer can eliminate hot-reload caches and metadata-update handler registrations across the renderer when published ([dotnet/aspnetcore #65903](https://github.com/dotnet/aspnetcore/pull/65903)).

Apps that use OpenTelemetry or hot reload aren't affected — the feature switches default on in those configurations.

## Runtime-async enabled for shared framework libraries

ASP.NET Core's shared-framework-only libraries are now compiled with the `runtime-async` feature on `net11.0+` ([dotnet/aspnetcore #66200](https://github.com/dotnet/aspnetcore/pull/66200)). Runtime-async lets the runtime, rather than the C# compiler, generate the state machine for `async`/`await`, which can reduce per-await allocations and improve diagnostics. This is an internal codegen change with no public API impact — apps targeting `net11.0` automatically benefit when they call into the affected ASP.NET Core libraries.

Libraries that ship as both shared-framework members and standalone NuGet packages are excluded, because runtime-async is incompatible with WebAssembly and would otherwise break wasm consumers of those packages.

Because runtime-async changes how `async`/`await` is generated for a large portion of the ASP.NET Core stack, please try your apps against this preview and [file an issue](https://github.com/dotnet/aspnetcore/issues/new/choose) if you hit unexpected behavior — particularly around exception stacks, `ExecutionContext`/`AsyncLocal` flow, or anything that looks like a regression from .NET 10.

## Breaking changes

- **`%2F` is preserved in HTTP/1.1 absolute-form request targets.** Previously, a request like `GET http://host/a%2Fb` was decoded to a path of `/a/b`, while `GET /a%2Fb` (origin-form) preserved the encoded slash. Both forms now resolve to `/a%2Fb`. Apps that depended on the inconsistent absolute-form behavior should update their routing or middleware to expect the encoded segment ([dotnet/aspnetcore #65930](https://github.com/dotnet/aspnetcore/pull/65930)).
- **`HttpsConnectionAdapterOptions.TlsClientHelloBytesCallback` is obsolete.** Use the new connection middleware shape introduced in [dotnet/aspnetcore #65808](https://github.com/dotnet/aspnetcore/pull/65808). The property continues to work in 11.0 but produces an obsoletion warning.

## Bug fixes

- **Blazor**
  - Fixed an `InvalidOperationException` when navigating to `/Error` in newly scaffolded Blazor Server apps. The template now declares `RequestId` as `public` so `[PersistentState]` can read it ([dotnet/aspnetcore #66245](https://github.com/dotnet/aspnetcore/pull/66245)).
  - Fixed a truncated gzip payload for `resource-collection.js.gz` that caused some clients to reject the response. The endpoint now writes the gzip footer before serving the bytes ([dotnet/aspnetcore #66242](https://github.com/dotnet/aspnetcore/pull/66242)).
  - Fixed an "Interop methods are already registered for renderer 1" error when a Blazor Server reconnect fell back to resume after the original circuit had expired ([dotnet/aspnetcore #66275](https://github.com/dotnet/aspnetcore/pull/66275)).
  - Fixed the Blazor Web Worker template failing in published Blazor WebAssembly apps. Workers don't inherit the page's import map, so fingerprinted `_framework/dotnet.js` couldn't be resolved from the worker context; the worker client now resolves the URL on the main thread via `import.meta.resolve()` and passes it to the worker through `postMessage` ([dotnet/aspnetcore #65885](https://github.com/dotnet/aspnetcore/pull/65885)).
- **Routing**
  - Fixed `NegotiationMatcherPolicy` invalidating higher-priority endpoints when a lower-priority endpoint shared a DFA path node and carried `ContentEncodingMetadata`. Content-encoding negotiation now disambiguates only between representations of the same resource ([dotnet/aspnetcore #65973](https://github.com/dotnet/aspnetcore/pull/65973)).
- **MVC**
  - Fixed `JsonSerializerSettings.DateFormatString` overwriting `DateFormatHandling` when copying serializer settings ([dotnet/aspnetcore #61251](https://github.com/dotnet/aspnetcore/pull/61251)).
- **Templates**
  - Added `Microsoft.Data.SqlClient.Extensions.Azure` to the MVC, Blazor, and Razor Pages Individual Auth templates so Azure App Service deployments using `Authentication=Active Directory Default` work without a separate package install ([dotnet/aspnetcore #66179](https://github.com/dotnet/aspnetcore/pull/66179)).
  - Removed the obsolete `net11.0` framework-choice descriptions from the `BlazorWebWorker` template ([dotnet/aspnetcore #66261](https://github.com/dotnet/aspnetcore/pull/66261)).
- **Middleware**
  - Clarified `UseStatusCodePages` documentation to call out that the default options handler prefers Problem Details when `IProblemDetailsService` is registered, and falls back to plain text otherwise ([dotnet/aspnetcore #66172](https://github.com/dotnet/aspnetcore/pull/66172)).

## Community contributors

Thank you contributors! ❤️

- [@Emik03](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3AEmik03+milestone%3A11.0-preview4)
- [@kilifu](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Akilifu+milestone%3A11.0-preview4)
- [@marcominerva](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Amarcominerva+milestone%3A11.0-preview4)
- [@MatthewSteeples](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3AMatthewSteeples+milestone%3A11.0-preview4)
- [@pedrobsaila](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Apedrobsaila+milestone%3A11.0-preview4)
