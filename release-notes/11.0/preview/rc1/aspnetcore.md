# ASP.NET Core in .NET 11 RC 1 - Release Notes

.NET 11 RC 1 includes new ASP.NET Core features and improvements:

- [SignalR authentication refresh APIs are finalized](#signalr-authentication-refresh-apis-are-finalized)
- [SignalR TypeScript client supports authentication refresh](#signalr-typescript-client-supports-authentication-refresh)
- [Blazor Server circuits update after authentication refresh](#blazor-server-circuits-update-after-authentication-refresh)
- [OpenAPI reflects obsolete APIs](#openapi-reflects-obsolete-apis)
- [Validation localization uses message conventions](#validation-localization-uses-message-conventions)
- [Blazor browser options are finalized](#blazor-browser-options-are-finalized)
- [Select an environment for build-time OpenAPI](#select-an-environment-for-build-time-openapi)
- [Experimental DirectTls transport](#experimental-directtls-transport)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

ASP.NET Core updates in .NET 11:

- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-11)

## SignalR authentication refresh APIs are finalized

[.NET 11 Preview 6 introduced authentication refresh](../preview6/aspnetcore.md#signalr-authentication-refresh) so a SignalR client can replace an expiring access token without dropping its connection. RC 1 finalizes the server and .NET client API shapes ([dotnet/aspnetcore #68702](https://github.com/dotnet/aspnetcore/pull/68702)).

When upgrading from Preview 7:

- In the .NET client, move the `OnAuthenticationRefreshed` and `OnAuthenticationRefreshFailed` callbacks from `AuthenticationRefreshOptions` to the `HubConnection.AuthenticationRefreshed` and `HubConnection.AuthenticationRefreshFailed` events.
- Update references to `Microsoft.AspNetCore.Http.Connections.AuthenticationRefreshContext` to use `Microsoft.AspNetCore.Connections.Features.AuthenticationRefreshContext`.
- Replace `IConnectionUserRefreshFeature` with `IConnectionAuthenticationRefreshFeature` if your transport integration uses the lower-level connection feature.

The server opts in for each hub and can inspect or reject a refreshed identity:

```csharp
app.MapHub<ClockHub>("/clock", options =>
{
    options.EnableAuthenticationRefresh = true;
    options.CloseOnAuthenticationExpiration = true;
    options.OnAuthenticationRefresh = context =>
    {
        var previousSubject = context.PreviousUser.FindFirstValue("sub");
        var newSubject = context.NewUser.FindFirstValue("sub");

        return Task.FromResult(
            previousSubject is not null &&
            string.Equals(previousSubject, newSubject, StringComparison.Ordinal));
    };
});
```

The .NET client can refresh automatically before expiration or immediately after the app obtains new claims. Refresh notifications are events on `HubConnection`:

```csharp
await using var connection = new HubConnectionBuilder()
    .WithUrl(serverUrl, options =>
        options.AccessTokenProvider = GetAccessTokenAsync)
    .WithAuthenticationRefresh(options =>
    {
        options.EnableAutoRefresh = true;
        options.RefreshBeforeExpiration = TimeSpan.FromMinutes(2);
    })
    .Build();

connection.AuthenticationRefreshed += context =>
{
    Console.WriteLine($"New token lifetime: {context.NewTokenLifetime}");
    return Task.CompletedTask;
};

connection.AuthenticationRefreshFailed += context =>
{
    Console.WriteLine(context.Exception.Message);
    return Task.CompletedTask;
};

await connection.StartAsync();

// Refresh immediately after acquiring a token with updated claims.
await connection.RefreshAuthenticationAsync();
```

## SignalR TypeScript client supports authentication refresh

The SignalR TypeScript client now supports refreshing an access token without reconnecting ([dotnet/aspnetcore #67964](https://github.com/dotnet/aspnetcore/pull/67964), [dotnet/aspnetcore #68702](https://github.com/dotnet/aspnetcore/pull/68702)). It can schedule a refresh from the token lifetime reported by the server or refresh immediately after the application obtains updated claims.

Configure automatic refresh with `withAuthenticationRefresh`, register success and failure handlers on the built connection, and call `refreshAuthentication` to request a manual refresh:

```typescript
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/clock", { accessTokenFactory: getAccessToken })
    .withAuthenticationRefresh({
        enableAutoRefresh: true,
        refreshBeforeExpirationInMilliseconds: 120_000,
    })
    .build();

connection.onAuthenticationRefreshed(context => {
    console.log(`New token lifetime: ${context.newTokenLifetimeInSeconds}`);
});

connection.onAuthenticationRefreshFailed(context => {
    console.error(context.error);
});

await connection.start();

// Refresh immediately after acquiring a token with updated claims.
await connection.refreshAuthentication();
```

## Blazor Server circuits update after authentication refresh

Interactive Server components can now receive the refreshed `ClaimsPrincipal` without reconnecting the circuit ([dotnet/aspnetcore #68221](https://github.com/dotnet/aspnetcore/pull/68221)). The Blazor component hub and client enable authentication refresh automatically, so no additional configuration is required ([dotnet/aspnetcore #68593](https://github.com/dotnet/aspnetcore/pull/68593)).

After the connection refreshes its authentication, Blazor updates the authentication state and raises `AuthenticationStateChanged`. Components that consume `AuthenticationStateProvider`, including `AuthorizeView`, re-render using the refreshed identity and claims. This behavior is useful when a user's roles or permissions change during an active circuit, or when a component needs to reload user-specific content after claims are refreshed. The UI can reflect the new authentication state without forcing the user to reconnect or reload the page.

## OpenAPI reflects obsolete APIs

ASP.NET Core OpenAPI generation now maps `[Obsolete]` to `deprecated: true` automatically for operations, schema types, and schema properties ([dotnet/aspnetcore #66355](https://github.com/dotnet/aspnetcore/pull/66355)). API clients and documentation tools can therefore surface the same deprecation information as .NET callers without a custom OpenAPI transformer.

```csharp
app.MapGet("/catalog/{id}", GetCatalogItem);

#pragma warning disable CS0618 // This endpoint intentionally uses an obsolete handler.
app.MapGet("/catalog/legacy/{id}", GetLegacyCatalogItem);
#pragma warning restore CS0618

[Obsolete("Use /catalog/{id}.")]
static LegacyCatalogItem GetLegacyCatalogItem(int id) =>
    new(id, $"Product {id}", $"SKU-{id:D4}");

[Obsolete("Use CatalogItem.")]
public sealed record LegacyCatalogItem(
    int Id,
    string Name,
    [property: Obsolete("Use StockKeepingUnit.")] string Sku);
```

The legacy operation, its response schema, and the `Sku` property are marked deprecated in the generated document:

```json
{
  "paths": {
    "/catalog/legacy/{id}": {
      "get": {
        "deprecated": true
      }
    }
  },
  "components": {
    "schemas": {
      "LegacyCatalogItem": {
        "deprecated": true,
        "properties": {
          "sku": {
            "deprecated": true
          }
        }
      }
    }
  }
}
```

An `IOpenApiOperationTransformer` or `IOpenApiSchemaTransformer` can override the generated value for a specific API.

Thank you [@fickleEfrit](https://github.com/fickleEfrit) for this contribution!

## Validation localization uses message conventions

[Preview 7 integrated localization directly into `Microsoft.Extensions.Validation`](../preview7/aspnetcore.md#validation-localization-is-built-in). RC 1 replaces the preview-only `MessageKeyProvider` API with built-in resource-name conventions ([dotnet/aspnetcore #68202](https://github.com/dotnet/aspnetcore/pull/68202)).

When upgrading from Preview 7, remove assignments to `ValidationOptions.MessageKeyProvider` and rename the corresponding resource keys to match one of the built-in conventions below. The `ValidationMessageKeyContext` type was also removed because custom key providers are no longer used.

When a validation attribute doesn't specify `ErrorMessage`, localization tries these keys from most to least specific:

1. `{DeclaringType}_{MemberName}_{AttributeType}_Error`
2. `{DeclaringType}_{AttributeType}_Error`
3. `{AttributeType}_Error`

For example, this model can use `RegistrationModel_Username_RequiredAttribute_Error`, `RegistrationModel_RequiredAttribute_Error`, or the shared `RequiredAttribute_Error` resource:

```csharp
builder.Services.AddLocalization();
builder.Services.AddValidation(options =>
{
    options.LocalizerProvider = (_, factory) =>
        factory.Create(typeof(ValidationMessages));
});

[ValidatableType]
public sealed class RegistrationModel
{
    [Required]
    [StringLength(20, MinimumLength = 4)]
    [Display(Name = nameof(ValidationMessages.Username))]
    public string Username { get; set; } = "";
}
```

An explicit `ErrorMessage` remains the first resource key to try. If no resource resolves, validation falls back to the non-localized message. The same conventions apply to Blazor static SSR client validation.

## Blazor browser options are finalized

The [server-to-client configuration API introduced in Preview 6](../preview6/aspnetcore.md#configure-blazor-client-behavior-from-the-server) now uses its final RC 1 names ([dotnet/aspnetcore #67918](https://github.com/dotnet/aspnetcore/pull/67918)).

When upgrading from Preview 7, update the following APIs:

| Preview 7 | RC 1 |
| --- | --- |
| `BrowserOptions.Server` | `BrowserOptions.InteractiveServer` |
| `BrowserOptions.Ssr` | `BrowserOptions.StaticServer` |
| `BrowserOptions.WebAssembly` | `BrowserOptions.InteractiveWebAssembly` |
| `SsrBrowserOptions` | `StaticServerBrowserOptions` |
| `WebAssemblyBrowserOptions` | `InteractiveWebAssemblyBrowserOptions` |
| `httpContext.GetBrowserOptions()` | `BrowserOptions.GetBrowserOptions(httpContext)` |

Configure browser startup behavior in C# with `WithBrowserOptions`:

```csharp
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode()
    .WithBrowserOptions(options =>
    {
        options.LogLevel = LogLevel.Information;
        options.InteractiveServer.ReconnectionMaxRetries = 10;
        options.InteractiveServer.ReconnectionRetryInterval =
            TimeSpan.FromSeconds(1.5);
        options.StaticServer.PreserveDom = true;
        options.InteractiveWebAssembly.EnvironmentVariables["OTEL_ENDPOINT"] =
            "https://localhost:4318";
    });
```

The finalized properties are `InteractiveServer`, `StaticServer`, and `InteractiveWebAssembly`. Server code can read the resolved configuration with `BrowserOptions.GetBrowserOptions(HttpContext)`.

## Select an environment for build-time OpenAPI

Build-time OpenAPI generation can now run the app under a specified hosting environment ([dotnet/aspnetcore #63856](https://github.com/dotnet/aspnetcore/pull/63856)). Set `OpenApiGenerateEnvironment` when environment-specific services, endpoints, or transformers affect the generated document:

```xml
<PropertyGroup>
  <OpenApiGenerateDocuments>true</OpenApiGenerateDocuments>
  <OpenApiGenerateEnvironment>Development</OpenApiGenerateEnvironment>
</PropertyGroup>
```

The value is passed to the application host in the same role as `ASPNETCORE_ENVIRONMENT` or `DOTNET_ENVIRONMENT`.

Thank you [@ldsenow](https://github.com/ldsenow) for this contribution!

## Experimental DirectTls transport

> [!WARNING]
> DirectTls is experimental in .NET 11 and produces diagnostic `ASPNETCORE_DIRECTTLS_001`.

**DirectTls** is an opt-in Kestrel transport for Linux that terminates TLS directly on the connection's socket by using the runtime's low-level TLS APIs ([dotnet/aspnetcore #67912](https://github.com/dotnet/aspnetcore/pull/67912)). It binds OpenSSL to the socket file descriptor instead of using `SslStream`, avoiding an intermediate managed copy on the TLS data path. The transport is being explored for connection-dense and handshake-heavy workloads where those copies and allocations can be significant.

DirectTls ships as the standalone `Microsoft.AspNetCore.Server.Kestrel.Transport.DirectTls` package and requires OpenSSL on the host. After adding a reference to the package, register the transport after the default Kestrel transport and select it for a specific endpoint. The following example assumes that `certificate` is an `X509Certificate2` loaded from the app's secure certificate configuration:

```csharp
using System.Net;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.AspNetCore.Server.Kestrel.Transport.DirectTls;

#pragma warning disable ASPNETCORE_DIRECTTLS_001 // DirectTls is experimental.

builder.WebHost.UseKestrel();
builder.WebHost.UseDirectTls();
builder.WebHost.ConfigureKestrel(options =>
{
    var endpoint = new DirectTlsEndpoint(IPAddress.Any, 5001);
    endpoint.Options.ServerCertificate = certificate;
    options.Listen(endpoint);
});
```

Only endpoints configured with `DirectTlsEndpoint` use DirectTls. Other endpoints continue to use the default sockets transport and the standard Kestrel TLS implementation.

## Breaking changes

### Preview-only insecure chunked parsing switch removed

The `Microsoft.AspNetCore.Server.Kestrel.InsecureChunkedParsing` AppContext switch has been removed ([dotnet/aspnetcore #68553](https://github.com/dotnet/aspnetcore/pull/68553)). The switch was introduced during .NET 11 previews but wasn't intended to be part of .NET 11. Remove any call that enables the switch; there is no replacement, and Kestrel always uses secure chunked-request parsing.

### Bootstrap 4 Identity UI is obsolete

Projects that set `IdentityUIFrameworkVersion` to `Bootstrap4` now receive an MSBuild warning ([dotnet/aspnetcore #68575](https://github.com/dotnet/aspnetcore/pull/68575)). Change the value to `Bootstrap5`, or remove the property to use the default. Bootstrap 5 remains the supported Identity UI framework selection.

<!-- Filtered features (significant engineering work, but not verified as available stable functionality):
  - Concise asset-path compiler transformation: asset metadata work appears in changes.json, but the user-facing compiler transformation wasn't present in the validated RC 1 build.
-->

## Bug fixes

- **Blazor**
  - [Fixed persisted component state for re-executed endpoints (dotnet/aspnetcore #68032)](https://github.com/dotnet/aspnetcore/pull/68032)
  - [Fixed persisted component state being dropped during enhanced navigation (dotnet/aspnetcore #68088)](https://github.com/dotnet/aspnetcore/pull/68088)
  - [Fixed `InputNumber` validation for floating-point values in scientific notation (dotnet/aspnetcore #67988)](https://github.com/dotnet/aspnetcore/pull/67988)
  - [Fixed `Virtualize` scroll jumps caused by competing native and JavaScript anchoring (dotnet/aspnetcore #67934)](https://github.com/dotnet/aspnetcore/pull/67934)
  - [Fixed `QuickGrid` viewport drift when prepending asynchronously loaded items in end-anchor mode (dotnet/aspnetcore #67938)](https://github.com/dotnet/aspnetcore/pull/67938)
- **Data Protection**
  - [Fixed thread-pool starvation when `KeyRingProvider` performs a forced refresh (dotnet/aspnetcore #67986)](https://github.com/dotnet/aspnetcore/pull/67986)
- **Hosting**
  - [Fixed an IIS application shutdown hang when preload is enabled (dotnet/aspnetcore #65733)](https://github.com/dotnet/aspnetcore/pull/65733)
- **OpenAPI**
  - [Fixed nullability for nullable get-only and constructor-bound properties (dotnet/aspnetcore #68116)](https://github.com/dotnet/aspnetcore/pull/68116)
- **SignalR**
  - [Hardened parsing of the `negotiateVersion` query value (dotnet/aspnetcore #67908)](https://github.com/dotnet/aspnetcore/pull/67908)
  - [Hardened stateful reconnect handling (dotnet/aspnetcore #67409)](https://github.com/dotnet/aspnetcore/pull/67409)

## Community contributors

Thank you contributors! ❤️

- [@AbdelrahmanHassan131](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3AAbdelrahmanHassan131+milestone%3A11.0-rc1)
- [@akshay-zz](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Aakshay-zz+milestone%3A11.0-rc1)
- [@aw0lid](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Aaw0lid+milestone%3A11.0-rc1)
- [@fickleEfrit](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3AfickleEfrit+milestone%3A11.0-rc1)
- [@GrantTotinov](https://github.com/dotnet/aspnetcore/pull/67539)
- [@hishamco](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Ahishamco+milestone%3A11.0-rc1)
- [@khellang](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Akhellang+milestone%3A11.0-rc1)
- [@ldsenow](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Aldsenow+milestone%3A11.0-rc1)
- [@PreethikaSelvam](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3APreethikaSelvam+milestone%3A11.0-rc1)
- [@surya3655](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Asurya3655+milestone%3A11.0-rc1)
- [@vendasankarsf3945](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Avendasankarsf3945+milestone%3A11.0-rc1)
- [@Yuvan111](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3AYuvan111+milestone%3A11.0-rc1)
