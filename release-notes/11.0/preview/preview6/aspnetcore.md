<!-- Verified against the .NET 11 Preview 6 SDK (11.0.100-preview.6.26359.118) by building and running samples at https://github.com/danroth27/aspnetcore11samples, and cross-checked against the dotnet/dotnet release/11.0.1xx-preview6 source. -->
# ASP.NET Core in .NET 11 Preview 6 - Release Notes

.NET 11 Preview 6 includes new ASP.NET Core features and improvements:

- [Async validation for minimal APIs](#async-validation-for-minimal-apis)
- [Automatic cross-origin (CSRF) protection](#automatic-cross-origin-csrf-protection)
- [Blazor Virtualize can scroll to an item](#blazor-virtualize-can-scroll-to-an-item)
- [OpenAPI 3.2 by default](#openapi-32-by-default)
- [Unions in ASP.NET Core](#unions-in-aspnet-core)
- [Short-circuit endpoints with an attribute](#short-circuit-endpoints-with-an-attribute)
- [SignalR authentication refresh](#signalr-authentication-refresh)
- [Cancel hub invocations from the client](#cancel-hub-invocations-from-the-client)
- [dotnet user-jwts supports file-based apps](#dotnet-user-jwts-supports-file-based-apps)
- [Preview API changes](#preview-api-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

ASP.NET Core updates in .NET 11:

- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-11)

## Async validation for minimal APIs

Minimal API validation now supports asynchronous validators end-to-end ([dotnet/aspnetcore #66487](https://github.com/dotnet/aspnetcore/pull/66487), [dotnet/aspnetcore #67183](https://github.com/dotnet/aspnetcore/pull/67183)). Preview 5 shipped the building blocks for asynchronous form validation in Blazor. Preview 6 adds the new asynchronous `DataAnnotations` APIs in the base libraries — `AsyncValidationAttribute`, `IAsyncValidatableObject`, and `Validator.ValidateObjectAsync` — and `Microsoft.Extensions.Validation` now runs them when an endpoint validates a request. The new base-library APIs are covered in the [.NET libraries release notes](./libraries.md#asynchronous-validation-with-dataannotations).

This lets a validation rule do real work, such as a database lookup or a remote API call, without blocking a thread. A model implements `IAsyncValidatableObject` and returns validation results as an `IAsyncEnumerable<ValidationResult>`. Because `IAsyncValidatableObject` extends `IValidatableObject`, also implement the synchronous `Validate` method. When a type validates asynchronously only, throw from `Validate` so it isn't silently validated through the synchronous APIs:

```csharp
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

public class ReservationRequest : IAsyncValidatableObject
{
    [Required]
    public string Email { get; set; } = "";

    public DateOnly Date { get; set; }

    // IValidatableObject (synchronous) — this type validates asynchronously only.
    public IEnumerable<ValidationResult> Validate(ValidationContext context) =>
        throw new NotSupportedException("Validate this type with ValidateAsync.");

    public async IAsyncEnumerable<ValidationResult> ValidateAsync(
        ValidationContext context,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var rooms = context.GetRequiredService<IRoomService>();
        if (!await rooms.HasAvailabilityAsync(Date, cancellationToken))
        {
            yield return new ValidationResult(
                "No rooms are available on that date.", [nameof(Date)]);
        }
    }
}
```

Register validation and the framework validates the request before the endpoint runs:

```csharp
builder.Services.AddValidation();

app.MapPost("/reservations", (ReservationRequest request) =>
    Results.Ok(request));
```

Validators run concurrently where possible: asynchronous attributes on the same member start together, collection items validate in parallel, and the framework preserves the existing ordering between member, type, and `IValidatableObject` validation. For attribute-based rules, derive from `AsyncValidationAttribute` and override its `IsValidAsync` method. Thank you [@Youssef1313](https://github.com/Youssef1313) for the implementation work on this feature.

## Automatic cross-origin (CSRF) protection

Apps built with `WebApplicationBuilder` now automatically reject unsafe cross-origin requests based on the browser's `Sec-Fetch-Site` and `Origin` headers ([dotnet/aspnetcore #66585](https://github.com/dotnet/aspnetcore/pull/66585)). This lightweight cross-site request forgery (CSRF) protection is on with no configuration and applies across Minimal APIs, MVC, Razor Pages, and Blazor. Same-origin and user-initiated requests are allowed; a cross-origin request that tries to consume a form is rejected.

The check runs as auto-injected middleware after routing and authentication, and records its verdict on `IAntiforgeryValidationFeature` instead of short-circuiting the request ([dotnet/aspnetcore #67082](https://github.com/dotnet/aspnetcore/pull/67082)). Framework form consumers (MVC, minimal API `[FromForm]`, and Blazor SSR) enforce the verdict when they read the form, so token antiforgery and cross-origin CSRF share a single, lazily enforced result. Apps that call `UseAntiforgery()` see no change. To customize or replace the policy, register an `ICsrfProtection` implementation:

```csharp
public sealed class MyCsrfProtection : ICsrfProtection
{
    public ValueTask<CsrfProtectionResult> ValidateAsync(HttpContext context) =>
        ValueTask.FromResult(CsrfProtectionResult.Allowed());
}

builder.Services.AddSingleton<ICsrfProtection, MyCsrfProtection>();
```

## Blazor Virtualize can scroll to an item

The `Virtualize<TItem>` component can now open at a specific item and scroll to any item on demand ([dotnet/aspnetcore #66753](https://github.com/dotnet/aspnetcore/pull/66753)). Two new public APIs make this possible:

- `InitialIndex` positions the list at a given item on the first interactive render, so the list opens at that item without a flash of the first item.
- `ScrollToIndexAsync(int itemIndex, CancellationToken cancellationToken = default)` scrolls to an item at any time after the first render and returns a `Task` that completes when the target is aligned to the top of the viewport.

```razor
<Virtualize TItem="Product" Items="products" InitialIndex="500" @ref="list">
    <div class="product">@context.Name</div>
</Virtualize>

<button @onclick="GoToTop">Back to top</button>

@code {
    private Virtualize<Product> list = default!;
    private List<Product> products = ProductCatalog.All;

    private async Task GoToTop() => await list.ScrollToIndexAsync(0);
}
```

Out-of-range indexes are clamped to the valid range. If a second `ScrollToIndexAsync` call starts while one is still in flight, the last call wins. Calling `ScrollToIndexAsync` before the first interactive render throws `InvalidOperationException`; use `InitialIndex` to set the starting position instead.

## OpenAPI 3.2 by default

Generated OpenAPI documents now target OpenAPI 3.2 by default ([dotnet/aspnetcore #67097](https://github.com/dotnet/aspnetcore/pull/67097), [dotnet/aspnetcore #67007](https://github.com/dotnet/aspnetcore/pull/67007)). OpenAPI 3.2 is the newest version of the specification. Documents continue to generate as before; set the document version explicitly if you need to target an earlier version for tooling that hasn't adopted 3.2 yet.

## Unions in ASP.NET Core

C# union types are a preview language feature in .NET 11 (see the [C# release notes](./csharp.md)), and `System.Text.Json` serializes them natively (see the [.NET libraries release notes](./libraries.md#systemtextjson-serializes-c-union-types)). Because ASP.NET Core uses `System.Text.Json` for JSON, union types work as JSON request bodies and return types throughout the stack with no ASP.NET-specific configuration:

- **Minimal APIs** — union body parameters and return types, including `Task<Union>`, `IAsyncEnumerable<Union>`, and `Results<T1, T2>`, in both the runtime (`RequestDelegateFactory`) and source-generated request delegates ([dotnet/aspnetcore #66951](https://github.com/dotnet/aspnetcore/pull/66951)).
- **MVC and Razor Pages** — union types as `[FromBody]` parameters and action or page-handler return types ([dotnet/aspnetcore #67005](https://github.com/dotnet/aspnetcore/pull/67005)).
- **SignalR** — union types as hub method parameters, return values, and stream items when using the JSON hub protocol ([dotnet/aspnetcore #67125](https://github.com/dotnet/aspnetcore/pull/67125)).
- **Blazor** — union types as component parameters, JS interop arguments and results, and persisted component state. Server and WebAssembly prerendering now correctly round-trip a union whose active case is `null` ([dotnet/aspnetcore #67296](https://github.com/dotnet/aspnetcore/pull/67296)).

```csharp
// Requires <LangVersion>preview</LangVersion>
public record class Dog(string Name);
public record class Cat(int Lives);
public union Pet(Dog, Cat);

// The active case is serialized on the way out and described with anyOf in OpenAPI.
app.MapGet("/pets/{id}", Pet (int id) => id == 0 ? new Dog("Rex") : new Cat(9));
```

For **OpenAPI**, an endpoint that returns a union is described with an `anyOf` schema listing each case type ([dotnet/aspnetcore #67001](https://github.com/dotnet/aspnetcore/pull/67001)). Unlike polymorphic types, union cases don't carry a `$type` discriminator, so a case such as `Dog` reuses the standalone `#/components/schemas/Dog` component instead of a duplicated, prefixed one. ApiExplorer detects a union through `JsonTypeInfoKind.Union`, so the schema also flows through to Swashbuckle and NSwag.

A few limits apply in this preview. Only JSON request bodies and responses are supported — binding a union from the query string, route values, headers, or form fields is not yet available ([dotnet/aspnetcore #66648](https://github.com/dotnet/aspnetcore/issues/66648)). When multiple cases serialize to the same JSON shape, disambiguate them with a `[JsonUnion]` classifier (a `System.Text.Json` feature). SignalR unions require the JSON hub protocol; the MessagePack and Newtonsoft.Json protocols don't support unions.

## Short-circuit endpoints with an attribute

The new `[ShortCircuit]` attribute marks an endpoint to run immediately after routing, skipping the rest of the middleware pipeline ([dotnet/aspnetcore #67249](https://github.com/dotnet/aspnetcore/pull/67249)). This is the attribute form of the existing `ShortCircuit()` endpoint convention, so it can be applied directly to MVC controllers and actions. Short-circuiting is useful for endpoints that don't need authentication, CORS, or other middleware — for example a health check or a `robots.txt` response — and it avoids the cost of running that middleware. The endpoint still runs and produces its response; pass an optional status code, such as `[ShortCircuit(404)]`, to set the response status code. Thank you [@Porozhniakov](https://github.com/Porozhniakov) for contributing this feature!

```csharp
[ApiController]
[Route("robots.txt")]
[ShortCircuit]
public class RobotsController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Content("User-agent: *\nDisallow:", "text/plain");
}
```

The same attribute works on minimal API endpoints, and the existing `ShortCircuit()` convention continues to work unchanged:

```csharp
app.MapGet("/health", [ShortCircuit] () => "Healthy");
```

## SignalR authentication refresh

SignalR connections can now refresh authentication without dropping the connection when the access token expires ([dotnet/aspnetcore #67400](https://github.com/dotnet/aspnetcore/pull/67400)). The server exposes a `/refresh` endpoint alongside `/negotiate` and reports the token lifetime in the negotiate response. The .NET client re-authenticates before the token expires, so a hub connection that previously closed when its bearer token aged out can stay open. In this preview the feature is implemented for the .NET client; the JavaScript/TypeScript client and Azure SignalR Service support are in progress.

Enable the feature per hub on the server:

```csharp
app.MapHub<ChatHub>("/chat", options =>
{
    options.EnableAuthenticationRefresh = true;

    // Optional: decide whether a given connection may refresh.
    options.OnAuthenticationRefresh = context => ValueTask.FromResult(true);
});
```

A hub can react to a refreshed identity by overriding `OnAuthenticationRefreshedAsync`:

```csharp
public class ChatHub : Hub
{
    public override Task OnAuthenticationRefreshedAsync()
    {
        // The connection's User has been updated with the refreshed token.
        return Task.CompletedTask;
    }
}
```

Automatic refresh is on by default in the .NET client and is configurable with `WithAuthenticationRefresh`:

```csharp
var connection = new HubConnectionBuilder()
    .WithUrl("https://example.com/chat")
    .WithAuthenticationRefresh(options =>
    {
        // EnableAutoRefresh is true by default.
        options.RefreshBeforeExpiration = TimeSpan.FromMinutes(1);
        options.OnAuthenticationRefreshed = context => Task.CompletedTask;
        options.OnAuthenticationRefreshFailed = context => Task.CompletedTask;
    })
    .Build();
```

## Cancel hub invocations from the client

The SignalR client can now cancel a regular, non-streaming hub method invocation ([dotnet/aspnetcore #64098](https://github.com/dotnet/aspnetcore/pull/64098)). Previously only streaming invocations could be cancelled from the client. Now, when you pass a `CancellationToken` to `InvokeAsync` and cancel it, the client sends a cancellation message and the hub method's `CancellationToken` parameter is triggered on the server.

```csharp
// Client — cancelling the token cancels the server-side invocation.
using var cts = new CancellationTokenSource();
var work = connection.InvokeAsync("LongRunningWork", cts.Token);
// ...
cts.Cancel();
```

```csharp
// Hub — accept a CancellationToken to observe client cancellation.
public class WorkHub : Hub
{
    public async Task LongRunningWork(CancellationToken cancellationToken)
    {
        await Task.Delay(TimeSpan.FromMinutes(5), cancellationToken);
    }
}
```

## dotnet user-jwts supports file-based apps

`dotnet user-jwts` can now issue development JWTs for file-based apps with the new `--file` option ([dotnet/aspnetcore #66919](https://github.com/dotnet/aspnetcore/pull/66919)). This makes it easy to test authenticated endpoints in a single-file app (`app.cs`) without a project file.

```bash
dotnet user-jwts create --file app.cs
```

## Preview API changes

These preview and experimental APIs changed in Preview 6. If you adopted them in an earlier build, update your code. None of them has shipped in a stable release, so these are not breaking changes.

- **`EnvironmentView` component** — the Blazor `EnvironmentBoundary` component (added in [Preview 1](../preview1/aspnetcore.md#environmentboundary-component)) was renamed to `EnvironmentView` ([dotnet/aspnetcore #67369](https://github.com/dotnet/aspnetcore/pull/67369)). Its `Include` and `Exclude` parameters are unchanged.
- **`NavigationManager.GetUriWithFragment`** — `GetUriWithHash` was renamed to `GetUriWithFragment` ([dotnet/aspnetcore #67368](https://github.com/dotnet/aspnetcore/pull/67368)).
- **Blazor browser options** — the server-side browser configuration API was reshaped ([dotnet/aspnetcore #67337](https://github.com/dotnet/aspnetcore/pull/67337)): `WithBrowserConfiguration` is now `WithBrowserOptions`, `BrowserConfiguration` is now `BrowserOptions`, `ServerBrowserOptions` is now `InteractiveServerBrowserOptions`, `SsrBrowserOptions.DisableDomPreservation` is now `PreserveDom` (with the opposite meaning), and `CircuitInactivityTimeoutMs` is now `CircuitInactivityTimeout` (a `TimeSpan`).
- **Minimal API validation resolvers** — `Microsoft.Extensions.Validation.IValidatableInfo` was split into `IValidatableTypeInfo`, `IValidatableParameterInfo`, and `IValidatablePropertyInfo`, and `ValidateContext.ValidationErrors` is now a read-only dictionary that you add to with the new `ValidateContext.AddValidationError` method ([dotnet/aspnetcore #67183](https://github.com/dotnet/aspnetcore/pull/67183)). Apps that use the built-in `[ValidatableType]` and `AddValidation()` are unaffected; only code that implements `IValidatableInfoResolver` directly needs to update.

## Bug fixes

- **OpenAPI**
  - Honored `DescriptionAttribute` on nullable value types during schema generation ([dotnet/aspnetcore #65245](https://github.com/dotnet/aspnetcore/pull/65245)).
  - Fixed duplicate XML documentation IDs for generic properties and references ([dotnet/aspnetcore #64404](https://github.com/dotnet/aspnetcore/pull/64404)).
  - Propagated `JsonSerializerOptions` correctly during OpenAPI generation ([dotnet/aspnetcore #66847](https://github.com/dotnet/aspnetcore/pull/66847)).
- **Caching**
  - Added the key sub-delimiter between multi-value `Vary` header values in response and output caching ([dotnet/aspnetcore #66936](https://github.com/dotnet/aspnetcore/pull/66936)).
- **Metrics**
  - Fixed the default value of `System.Diagnostics.Metrics.Meter.IsSupported` ([dotnet/aspnetcore #66846](https://github.com/dotnet/aspnetcore/pull/66846)).
  - Added `QUERY` to the known HTTP methods used by hosting metrics ([dotnet/aspnetcore #63276](https://github.com/dotnet/aspnetcore/pull/63276)).
- **Blazor**
  - `WebViewRenderer` no longer throws `NotSupportedException` when a Blazor Hybrid app renders a component annotated with `@rendermode`; render modes are treated as no-ops because a WebView is always interactive ([dotnet/aspnetcore #65876](https://github.com/dotnet/aspnetcore/pull/65876)).

## Community contributors

Thank you contributors! ❤️

- [@Alex-Sob](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3AAlex-Sob+milestone%3A11.0-preview6)
- [@Bellambharath](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3ABellambharath+milestone%3A11.0-preview6)
- [@classyk12](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Aclassyk12+milestone%3A11.0-preview6)
- [@desjoerd](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Adesjoerd+milestone%3A11.0-preview6)
- [@doominator42](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Adoominator42+milestone%3A11.0-preview6)
- [@GrantTotinov](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3AGrantTotinov+milestone%3A11.0-preview6)
- [@jesuszarate](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Ajesuszarate+milestone%3A11.0-preview6)
- [@medhatiwari](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Amedhatiwari+milestone%3A11.0-preview6)
- [@Porozhniakov](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3APorozhniakov+milestone%3A11.0-preview6)
- [@rdeveen](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Ardeveen+milestone%3A11.0-preview6)
- [@sheiksyedm](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Asheiksyedm+milestone%3A11.0-preview6)
- [@TheAlexLichter](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3ATheAlexLichter+milestone%3A11.0-preview6)
