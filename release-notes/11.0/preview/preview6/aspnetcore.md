<!-- Verified against the .NET 11 Preview 6 SDK (11.0.100-preview.6.26359.118) by building and running samples at https://github.com/danroth27/aspnetcore11samples, and cross-checked against the dotnet/dotnet release/11.0.1xx-preview6 source. -->
# ASP.NET Core in .NET 11 Preview 6 - Release Notes

.NET 11 Preview 6 includes new ASP.NET Core features and improvements:

- [Async validation for minimal APIs](#async-validation-for-minimal-apis)
- [Automatic cross-origin (CSRF) protection](#automatic-cross-origin-csrf-protection)
- [Blazor Virtualize can scroll to an item](#blazor-virtualize-can-scroll-to-an-item)
- [Configure Blazor client behavior from the server](#configure-blazor-client-behavior-from-the-server)
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

Minimal API validation now supports asynchronous validators end-to-end ([dotnet/aspnetcore #66487](https://github.com/dotnet/aspnetcore/pull/66487), [dotnet/aspnetcore #67183](https://github.com/dotnet/aspnetcore/pull/67183)). Preview 5 shipped the building blocks for asynchronous form validation in Blazor. Preview 6 adds new asynchronous `DataAnnotations` APIs in the base libraries (`AsyncValidationAttribute` and `IAsyncValidatableObject`), and `Microsoft.Extensions.Validation` now runs them when an endpoint validates a request. The full set of new base-library APIs, including `Validator.ValidateObjectAsync`, is covered in the [.NET libraries release notes](./libraries.md#asynchronous-validation-with-dataannotations).

The simplest way to add an asynchronous rule is a custom validation attribute. Derive from `AsyncValidationAttribute` and implement `IsValidAsync` to query a database or call a remote API without blocking a thread. The synchronous `IsValid` is abstract too; throw from it when the attribute validates asynchronously only:

```csharp
using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.DependencyInjection;

public sealed class UniqueEmailAttribute : AsyncValidationAttribute
{
    // Synchronous IsValid. This attribute validates asynchronously only.
    protected override ValidationResult? IsValid(object? value, ValidationContext context) =>
        throw new InvalidOperationException("Validate this attribute with IsValidAsync.");

    protected override async Task<ValidationResult?> IsValidAsync(
        object? value, ValidationContext context, CancellationToken cancellationToken)
    {
        var users = context.GetRequiredService<IUserService>();
        if (value is string email && await users.EmailExistsAsync(email, cancellationToken))
        {
            return new ValidationResult("That email is already registered.");
        }

        return ValidationResult.Success;
    }
}
```

Apply `[UniqueEmail]` to a property like any built-in validation attribute.

For validation that spans several properties or the whole object, implement `IAsyncValidatableObject` and return results as an `IAsyncEnumerable<ValidationResult>`. Because `IAsyncValidatableObject` extends `IValidatableObject`, also implement the synchronous `Validate` method. When a type validates asynchronously only, throw from `Validate` so its validation isn't silently skipped by the synchronous APIs:

```csharp
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

public class ReservationRequest : IAsyncValidatableObject
{
    [Required]
    public string Email { get; set; } = "";

    public DateOnly Date { get; set; }

    // Synchronous IValidatableObject. This type validates asynchronously only.
    public IEnumerable<ValidationResult> Validate(ValidationContext context) =>
        throw new InvalidOperationException("Validate this type with ValidateAsync.");

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

Validators run concurrently where possible: asynchronous attributes on the same member start together, collection items validate in parallel, and the framework preserves the existing ordering between member, type, and `IValidatableObject` validation.

## Automatic cross-origin (CSRF) protection

Apps built with `WebApplication.CreateBuilder` now automatically reject unsafe cross-origin requests based on the browser's `Sec-Fetch-Site` and `Origin` headers ([dotnet/aspnetcore #66585](https://github.com/dotnet/aspnetcore/pull/66585), [dotnet/aspnetcore #67082](https://github.com/dotnet/aspnetcore/pull/67082)). This lightweight cross-site request forgery (CSRF) protection is on with no configuration and applies across Minimal APIs, MVC, Razor Pages, and Blazor. Same-origin requests, user-initiated navigations, and non-browser clients are allowed, while a cross-origin browser request that tries to consume a form is rejected. It can be used in place of or alongside the existing token-based antiforgery system. Because it runs automatically, the Blazor Web App project templates no longer call `app.UseAntiforgery()`.

To opt an endpoint out, use `.DisableAntiforgery()` (Minimal APIs) or `[IgnoreAntiforgeryToken]` (MVC); to turn the feature off app-wide, set the `DisableCsrfProtection` configuration key. For full control over the trust decision, register a custom `ICsrfProtection` implementation.

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

Out-of-range indexes are clamped to the valid range. If a second `ScrollToIndexAsync` call starts while one is still in flight, the last call wins. If the user scrolls during a `ScrollToIndexAsync` call, the user's scroll wins. Calling `ScrollToIndexAsync` before the first interactive render throws `InvalidOperationException`; use `InitialIndex` to set the starting position instead.

## Configure Blazor client behavior from the server

Blazor apps can now configure client-side startup behavior from the server in C# when mapping Razor components, instead of hand-writing `Blazor.start` JavaScript ([dotnet/aspnetcore #67337](https://github.com/dotnet/aspnetcore/pull/67337), [dotnet/aspnetcore #66393](https://github.com/dotnet/aspnetcore/issues/66393)). `WithBrowserOptions` sets options that the server serializes into the rendered page and the Blazor script applies in the browser, across the Server, WebAssembly, and Auto render modes. The options cover the client log level, interactive Server reconnection, whether enhanced navigation preserves the DOM, and a WebAssembly runtime's environment name, culture, and environment variables:

```csharp
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode()
    .WithBrowserOptions(options =>
    {
        options.LogLevel = LogLevel.Warning;
        options.Server.ReconnectionMaxRetries = 10;
        options.Server.ReconnectionRetryInterval = TimeSpan.FromSeconds(1.5);
        options.Ssr.PreserveDom = true;
        options.WebAssembly.EnvironmentName = "Staging";
        options.WebAssembly.EnvironmentVariables["OTEL_EXPORTER_OTLP_ENDPOINT"] = "https://localhost:4318";
    });
```

You can also set the options from a component with `<ConfigureBrowser>`, or read the resolved options from `HttpContext` with `GetBrowserOptions()`.

The API was introduced in Preview 4 and reshaped in Preview 6 to follow options conventions. If you adopted the earlier shape, `WithBrowserConfiguration` is now `WithBrowserOptions`, `BrowserConfiguration` is now `BrowserOptions`, `ServerBrowserOptions` is now `InteractiveServerBrowserOptions`, `SsrBrowserOptions.DisableDomPreservation` is now `PreserveDom` (with the opposite meaning), and `CircuitInactivityTimeoutMs` is now `CircuitInactivityTimeout` (a `TimeSpan`).

## OpenAPI 3.2 by default

Generated OpenAPI documents now target OpenAPI 3.2 by default ([dotnet/aspnetcore #67097](https://github.com/dotnet/aspnetcore/pull/67097), [dotnet/aspnetcore #67007](https://github.com/dotnet/aspnetcore/pull/67007)). OpenAPI 3.2 is the newest version of the specification. Only the default version changes; your generation code and configuration are unchanged. Set the OpenAPI version explicitly to target an earlier one for tooling that hasn't adopted 3.2 yet.

## Unions in ASP.NET Core

[C# union types](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/union) are a preview language feature in .NET 11, and [`System.Text.Json` serializes them natively](./libraries.md#systemtextjson-serializes-c-union-types). Because ASP.NET Core uses `System.Text.Json` for JSON, union types work as JSON request bodies and return types throughout the stack with no ASP.NET-specific configuration:

- **Minimal APIs** — union body parameters and return types, including `Task<Union>`, `IAsyncEnumerable<Union>`, and `Results<T1, T2>`, in both the runtime (`RequestDelegateFactory`) and source-generated request delegates ([dotnet/aspnetcore #66951](https://github.com/dotnet/aspnetcore/pull/66951)).
- **MVC and Razor Pages** — union types in JSON request bodies and responses ([dotnet/aspnetcore #67005](https://github.com/dotnet/aspnetcore/pull/67005)).
- **SignalR** — union types as hub method parameters, return values, and stream items when using the JSON hub protocol ([dotnet/aspnetcore #67125](https://github.com/dotnet/aspnetcore/pull/67125)).
- **Blazor** — union types as component parameters, JS interop arguments and results, and persisted component state ([dotnet/aspnetcore #67296](https://github.com/dotnet/aspnetcore/pull/67296)).

```csharp
// Requires <LangVersion>preview</LangVersion>
public record class Dog(string Name);
public record class Cat(int Lives);
public union Pet(Dog, Cat);

// The active case is serialized on the way out and described with anyOf in OpenAPI.
app.MapGet("/pets/{id}", Pet (int id) => id == 0 ? new Dog("Rex") : new Cat(9));
```

For **OpenAPI**, an endpoint that returns a union is described with an `anyOf` schema listing each case type ([dotnet/aspnetcore #67001](https://github.com/dotnet/aspnetcore/pull/67001)). Unlike polymorphic types, union cases don't carry a `$type` discriminator, so a case such as `Dog` reuses the standalone `#/components/schemas/Dog` component instead of a duplicated, prefixed one. Third-party generators such as Swashbuckle and NSwag do not yet recognize unions and will produce their default schema shape.

A few limits apply in this preview. Only JSON request bodies and responses are supported. Binding a union from the query string, route values, headers, or form fields is not yet available ([dotnet/aspnetcore #66648](https://github.com/dotnet/aspnetcore/issues/66648)). When multiple cases serialize to the same JSON shape, disambiguate them with a `[JsonUnion]` classifier (a `System.Text.Json` feature). SignalR unions require the JSON hub protocol; the MessagePack and Newtonsoft.Json protocols don't support unions.

## Short-circuit endpoints with an attribute

The new `[ShortCircuit]` attribute marks an endpoint to run immediately after routing, skipping the rest of the middleware pipeline ([dotnet/aspnetcore #67249](https://github.com/dotnet/aspnetcore/pull/67249)). This is the attribute form of the existing `ShortCircuit()` endpoint convention, so it can be applied directly to MVC controllers and actions. Short-circuiting is useful for endpoints that don't need authentication, CORS, or other middleware, such as a health check or a `robots.txt` response. It avoids the cost of running that middleware. The endpoint still runs and produces its response; pass an optional status code, such as `[ShortCircuit(404)]`, to set the response status. Thank you [@Porozhniakov](https://github.com/Porozhniakov) for contributing this feature!

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

The SignalR client can now cancel a regular, non-streaming hub method invocation ([dotnet/aspnetcore #64098](https://github.com/dotnet/aspnetcore/pull/64098)). Previously only streaming invocations could be canceled from the client. Now, when you pass a `CancellationToken` to `InvokeAsync` and cancel it, the client sends a cancellation message and the hub method's `CancellationToken` parameter is triggered on the server.

```csharp
// Client — canceling the token cancels the server-side invocation.
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

`dotnet user-jwts` creates signed development JWTs so you can call an app's authenticated endpoints without setting up a real identity provider. `create` generates a token, stores its signing key in the app's user secrets, and prints the token to use as a bearer token. It now works with file-based apps (a single `app.cs` with no project file) through the new `--file` option ([dotnet/aspnetcore #66919](https://github.com/dotnet/aspnetcore/pull/66919)).

```bash
dotnet user-jwts create --file app.cs
```

## Preview API changes

These preview and experimental APIs changed in Preview 6. If you adopted them in an earlier build, update your code. None of them has shipped in a stable release, so these are not breaking changes.

- **`EnvironmentView` component** — the Blazor `EnvironmentBoundary` component (added in [Preview 1](../preview1/aspnetcore.md#environmentboundary-component)) was renamed to `EnvironmentView` ([dotnet/aspnetcore #67369](https://github.com/dotnet/aspnetcore/pull/67369)). Its `Include` and `Exclude` parameters are unchanged.
- **`NavigationManager.GetUriWithFragment`** — `GetUriWithHash` was renamed to `GetUriWithFragment` ([dotnet/aspnetcore #67368](https://github.com/dotnet/aspnetcore/pull/67368)).
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
  - Added `QUERY` to the known HTTP methods used by hosting metrics ([dotnet/aspnetcore #63276](https://github.com/dotnet/aspnetcore/pull/63276)). Thank you [@doominator42](https://github.com/doominator42)!
- **Blazor**
  - `WebViewRenderer` no longer throws `NotSupportedException` when a Blazor Hybrid app renders a component annotated with `@rendermode`; render modes are treated as no-ops because a WebView is always interactive ([dotnet/aspnetcore #65876](https://github.com/dotnet/aspnetcore/pull/65876)).
  - The `Virtualize` component no longer violates a strict `style-src 'self'` Content Security Policy. The one style it computes at runtime, the spacer height, is now written to a `data-blazor-virtualize-reserved-height` attribute and applied on the client through the CSS Object Model, instead of an inline `style` attribute ([dotnet/aspnetcore #66680](https://github.com/dotnet/aspnetcore/pull/66680)).
  - For pages that use session-backed features (a `[SupplyParameterFromSession]` parameter or the session-storage TempData provider), the `.AspNetCore.Session` cookie is now issued before streaming SSR begins, so the value persists even if nothing is ultimately written ([dotnet/aspnetcore #66832](https://github.com/dotnet/aspnetcore/pull/66832)).

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
