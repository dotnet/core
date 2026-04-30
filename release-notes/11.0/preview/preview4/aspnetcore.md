# ASP.NET Core in .NET 11 Preview 4 - Release Notes

.NET 11 Preview 4 includes new ASP.NET Core features and improvements:

- [Support for the HTTP QUERY method](#support-for-the-http-query-method)
- [SupplyParameterFromTempData for Blazor](#supplyparameterfromtempdata-for-blazor)
- [Server-initiated Blazor Server circuit pause](#server-initiated-blazor-server-circuit-pause)
- [Virtualize keeps the viewport stable when content above it changes](#virtualize-keeps-the-viewport-stable-when-content-above-it-changes)
- [Blazor WebAssembly service defaults template](#blazor-webassembly-service-defaults-template)
- [MCP Server template ships with the .NET SDK](#mcp-server-template-ships-with-the-net-sdk)
- [TLS handshake observability in Kestrel](#tls-handshake-observability-in-kestrel)
- [Response compression always emits `Vary: Accept-Encoding`](#response-compression-always-emits-vary-accept-encoding)
- [OpenAPI and minimal API improvements](#openapi-and-minimal-api-improvements)
- [Smaller Blazor WebAssembly publish output](#smaller-blazor-webassembly-publish-output)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

ASP.NET Core updates in .NET 11:

- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-11)

## Support for the HTTP QUERY method

ASP.NET Core now recognizes [HTTP QUERY](https://datatracker.ietf.org/doc/draft-ietf-httpbis-safe-method-w-body/) as a first-class HTTP method in routing, minimal APIs, and OpenAPI document generation ([dotnet/aspnetcore #65714](https://github.com/dotnet/aspnetcore/pull/65714)). QUERY is a proposed safe, idempotent method that lets clients send a request body when describing a search — useful when a query is too large or too structured to fit in a URL.

```csharp
var app = WebApplication.Create();

app.MapMethods("/search", ["QUERY"], (SearchRequest request) =>
    SearchService.Run(request));

app.Run();
```

The method shows up in generated OpenAPI documents alongside `GET`, `POST`, and friends, so client generators and API explorers pick it up automatically.

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

```csharp
public class RebalanceService(CircuitRegistry circuits)
{
    public async Task DrainAsync(CancellationToken ct)
    {
        foreach (var circuit in circuits.GetActiveCircuits())
        {
            await circuit.RequestCircuitPauseAsync();
        }
    }
}
```

The method returns `true` when the client was successfully asked to begin pausing. Clients can defer the request via the optional `onPauseRequested` callback in `CircuitStartOptions`.

<!-- TODO: verify exact shape of CircuitRegistry / how a hosting app obtains a Circuit instance; PR shows the new API on Circuit but not the discovery path. -->

## Virtualize keeps the viewport stable when content above it changes

Preview 3 taught Blazor's `Virtualize<TItem>` to handle items with different heights. Preview 4 builds on that with viewport stability: visible items stay in place when items above the viewport change height, and when items are prepended to the collection ([dotnet/aspnetcore #65951](https://github.com/dotnet/aspnetcore/pull/65951)).

The component uses native CSS scroll anchoring where the browser supports it and falls back to manual scroll compensation otherwise (notably for `<table>` layouts and Safari). Apps using `Virtualize` get this automatically — no API changes required.

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

## TLS handshake observability in Kestrel

Two related changes make it easier to diagnose and customize TLS connections in Kestrel.

`ITlsHandshakeFeature` now exposes an `Exception` property containing the exception thrown during a failed TLS handshake, so middleware and logging can record why a connection failed instead of seeing a bare `IOException` further up the stack ([dotnet/aspnetcore #65807](https://github.com/dotnet/aspnetcore/pull/65807)). The feature continues to work after the handshake fails — Kestrel snapshots the relevant fields off the underlying `SslStream` before it is disposed.

The `TlsClientHelloBytesCallback` option on `HttpsConnectionAdapterOptions` was reworked as a connection middleware ([dotnet/aspnetcore #65808](https://github.com/dotnet/aspnetcore/pull/65808)). The previous callback shape is now obsolete; configure ClientHello inspection via the connection-builder pipeline instead.

## Response compression always emits `Vary: Accept-Encoding`

The response-compression middleware now adds `Vary: Accept-Encoding` to every response when compression is enabled, even when the response itself isn't compressed ([dotnet/aspnetcore #55092](https://github.com/dotnet/aspnetcore/pull/55092)). This prevents shared caches and CDNs from serving a compressed payload to a client that didn't ask for one (or vice versa).

Thank you [@pedrobsaila](https://github.com/pedrobsaila) for this contribution!

## OpenAPI and minimal API improvements

Two changes round out the minimal API + OpenAPI experience this preview:

- **File result types appear in OpenAPI documents.** `FileStreamResult`, `FileContentHttpResult`, and `FileStreamHttpResult` are now described as binary string schemas in generated OpenAPI documents, so clients see accurate response shapes for endpoints that stream files ([dotnet/aspnetcore #64562](https://github.com/dotnet/aspnetcore/pull/64562)). Annotate the endpoint with `.Produces<FileContentHttpResult>(contentType: "application/pdf")` (or the equivalent `*StreamHttpResult`/`FileStreamResult` type) so OpenAPI sees the result type and emits the binary schema. Thank you [@marcominerva](https://github.com/marcominerva) for this contribution!
- **Endpoint filters can observe parameter-binding failures.** When a minimal API endpoint has any filters or filter factories configured, the filter pipeline now runs even if parameter binding fails. Filters can read `HttpContext.Response.StatusCode == 400` and substitute their own response body. Endpoints without filters continue to short-circuit with a 400 as before ([dotnet/aspnetcore #64539](https://github.com/dotnet/aspnetcore/pull/64539)). In Development, set `RouteHandlerOptions.ThrowOnBadRequest = false` so the framework returns a 400 the filter can observe instead of throwing `BadHttpRequestException` to the developer exception page. Thank you [@marcominerva](https://github.com/marcominerva) for this contribution!

## Smaller Blazor WebAssembly publish output

Two trimming changes shrink published Blazor WebAssembly apps that don't use OpenTelemetry or hot reload:

- The `ComponentsMetrics` and `ComponentsActivitySource` types are now gated behind a `[FeatureSwitchDefinition]`, so the trimmer can drop the metrics and tracing call paths from `Renderer` and friends when `System.Diagnostics.Metrics.Meter.IsSupported` is `false` (the default for trimmed apps) ([dotnet/aspnetcore #65901](https://github.com/dotnet/aspnetcore/pull/65901)).
- `HotReloadManager` now exposes a feature-switched `IsSupported` property tied to `System.Reflection.Metadata.MetadataUpdater.IsSupported`, so the trimmer can eliminate hot-reload caches and metadata-update handler registrations across the renderer when published ([dotnet/aspnetcore #65903](https://github.com/dotnet/aspnetcore/pull/65903)).

Apps that use OpenTelemetry or hot reload aren't affected — the feature switches default on in those configurations.

## Breaking changes

- **`%2F` is preserved in HTTP/1.1 absolute-form request targets.** Previously, a request like `GET http://host/a%2Fb` was decoded to a path of `/a/b`, while `GET /a%2Fb` (origin-form) preserved the encoded slash. Both forms now resolve to `/a%2Fb`. Apps that depended on the inconsistent absolute-form behavior should update their routing or middleware to expect the encoded segment ([dotnet/aspnetcore #65930](https://github.com/dotnet/aspnetcore/pull/65930)).
- **`HttpsConnectionAdapterOptions.TlsClientHelloBytesCallback` is obsolete.** Use the new connection middleware shape introduced in [dotnet/aspnetcore #65808](https://github.com/dotnet/aspnetcore/pull/65808). The property continues to work in 11.0 but produces an obsoletion warning.

<!-- Filtered features (significant engineering work, but too niche or off-product for ASP.NET Core release notes):
  - IConnectionEndPointFeature implemented in Kestrel/HttpSys/IIS (#62162): plumbing for diagnostics features that don't have a user-facing surface this preview.
  - StaticAssetDescriptor.Order from manifest (#65975): SDK-side enabler for SPA fallback ordering; the user-visible story will land with the companion SDK change.
  - SignalR extra backpressure timeout (#66318): internal hardening, no public API or scenario story for end users.
  - Razor warning waves infrastructure (dotnet/razor #13016): plumbing only, no new warnings yet — not independently useful.
  - Razor IR/refactor PRs (#13002, #13003, #13004, #13005, #13007, #13008, #13053): compiler internals with no user-visible change.
  - Razor editor/IDE fixes (#13017, #13023, #13035, #13043, #13044, #13057, #13063, #13065): tooling/IDE work — product-boundary rule excludes these from ASP.NET Core product notes.
  - "Detach methods when disconnection confirmed" (#66275) and resource-collection gzip footer (#66242): rolled into Bug fixes.
  - Blazor Web Worker template renames and clean-up (#66070, #66261): rolled into Bug fixes / templates section.
  - Runtime-async enablement for SharedFx-only libraries (#66449): cross-stack runtime-async work; covered in the runtime release notes.
  - Numerous infra / dependency / loc / agentic-workflow / source-build PRs: pre-filtered (~69 entries) before scoring.
-->

## Bug fixes

- **Blazor**
  - Fixed an `InvalidOperationException` when navigating to `/Error` in newly scaffolded Blazor Server apps. The template now declares `RequestId` as `public` so `[PersistentState]` can read it ([dotnet/aspnetcore #66245](https://github.com/dotnet/aspnetcore/pull/66245)).
  - Fixed a truncated gzip payload for `resource-collection.js.gz` that caused some clients to reject the response. The endpoint now writes the gzip footer before serving the bytes ([dotnet/aspnetcore #66242](https://github.com/dotnet/aspnetcore/pull/66242)).
  - Fixed an "Interop methods are already registered for renderer 1" error when a Blazor Server reconnect fell back to resume after the original circuit had expired ([dotnet/aspnetcore #66275](https://github.com/dotnet/aspnetcore/pull/66275)).
- **Routing**
  - Fixed `NegotiationMatcherPolicy` invalidating higher-priority endpoints when a lower-priority endpoint shared a DFA path node and carried `ContentEncodingMetadata`. Content-encoding negotiation now disambiguates only between representations of the same resource ([dotnet/aspnetcore #65973](https://github.com/dotnet/aspnetcore/pull/65973)).
- **MVC**
  - Fixed `JsonSerializerSettings.DateFormatString` overwriting `DateFormatHandling` when copying serializer settings ([dotnet/aspnetcore #61251](https://github.com/dotnet/aspnetcore/pull/61251)).
- **Templates**
  - Renamed the standalone `.NET Web Worker` template to `Blazor Web Worker`, added `InvokeVoidAsync` on `WebWorkerClient`, and added cancellation/timeout support to worker creation and invocation ([dotnet/aspnetcore #66070](https://github.com/dotnet/aspnetcore/pull/66070)).
  - Removed the obsolete `net11.0` framework-choice descriptions from the `BlazorWebWorker` template ([dotnet/aspnetcore #66261](https://github.com/dotnet/aspnetcore/pull/66261)).
  - Added `Microsoft.Data.SqlClient.Extensions.Azure` to the MVC, Blazor, and Razor Pages Individual Auth templates so Azure App Service deployments using `Authentication=Active Directory Default` work without a separate package install ([dotnet/aspnetcore #66179](https://github.com/dotnet/aspnetcore/pull/66179)).
- **Middleware**
  - Clarified `UseStatusCodePages` documentation to call out that the default options handler prefers Problem Details when `IProblemDetailsService` is registered, and falls back to plain text otherwise ([dotnet/aspnetcore #66172](https://github.com/dotnet/aspnetcore/pull/66172)).

## Community contributors

Thank you contributors! ❤️

- [@Emik03](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3AEmik03+milestone%3A11.0-preview4)
- [@kilifu](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Akilifu+milestone%3A11.0-preview4)
- [@marcominerva](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Amarcominerva+milestone%3A11.0-preview4)
- [@MatthewSteeples](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3AMatthewSteeples+milestone%3A11.0-preview4)
- [@pedrobsaila](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Apedrobsaila+milestone%3A11.0-preview4)
