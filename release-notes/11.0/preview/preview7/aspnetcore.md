# ASP.NET Core in .NET 11 Preview 7 - Release Notes

.NET 11 Preview 7 includes new ASP.NET Core features and improvements:

- [Auto pause Blazor circuits on inactivity](#auto-pause-blazor-circuits-on-inactivity)
- [Cache Blazor SSR output with `CacheView`](#cache-blazor-ssr-output-with-cacheview)
- [New Blazor analyzers](#new-blazor-analyzers)
- [Blazor `Virtualize` no longer requires an `ItemComparer`](#blazor-virtualize-no-longer-requires-an-itemcomparer)
- [`QuickGrid` supports `InitialItemIndex` and `ScrollToItemAsync`](#quickgrid-supports-initialitemindex-and-scrolltoitemasync)
- [`wasm-tools` uses Emscripten 6](#wasm-tools-uses-emscripten-6)
- [Razor accepts literal attributes for union-typed component parameters](#razor-accepts-literal-attributes-for-union-typed-component-parameters)
- [Blazor SSR client-side form validation improvements](#blazor-ssr-client-side-form-validation-improvements)
- [Validation localization is built in](#validation-localization-is-built-in)
- [Validation attributes are no longer experimental](#validation-attributes-are-no-longer-experimental)
- [SignalR .NET client supports auth refresh after redirects](#signalr-net-client-supports-auth-refresh-after-redirects)
- [Consistent authorization metadata across the stack](#consistent-authorization-metadata-across-the-stack)
- [OpenAPI Server-Sent Events in OpenAPI 3.2](#openapi-server-sent-events-in-openapi-32)
- [TLS channel-binding token access from `ITlsConnectionFeature`](#tls-channel-binding-token-access-from-itlsconnectionfeature)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

ASP.NET Core updates in .NET 11:

- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-11)

## Auto pause Blazor circuits on inactivity

Interactive Server circuits can now pause themselves automatically when the browser tab is hidden, releasing server resources until the user comes back ([dotnet/aspnetcore #67098](https://github.com/dotnet/aspnetcore/pull/67098)). Preview 6 added [`Circuit.RequestCircuitPauseAsync`](https://github.com/dotnet/aspnetcore/issues/64886) so the server could pause a circuit on demand. Preview 7 adds an opt-in package that detects when to request a pause after a configurable inactivity delay while a page is hidden.

To enable support for auto pausing circuits, add the `Microsoft.AspNetCore.Components.Server.AutoPause` package and configure it for the app via `AddAutoPause` on `BrowserOptions`:

```xml
<PackageReference Include="Microsoft.AspNetCore.Components.Server.AutoPause" />
```

```csharp
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode()
    .WithBrowserOptions(options =>
    {
        options.AddAutoPause(pause =>
        {
            pause.Enabled = true; // default
            pause.HiddenDelay = TimeSpan.FromSeconds(30); // default is 2 minutes
        });
    });
```

Auto-pause is deferred by default in some situations when a pause could cause data loss or interrupt work in progress. These situations include a text input or `contenteditable` element whose value differs from its default (including inside shadow DOM and same-origin iframes), an `<audio>` or `<video>` element that is playing unmuted, an open [Picture-in-Picture](https://developer.mozilla.org/docs/Web/API/Picture-in-Picture_API) window, a held [Web Lock](https://developer.mozilla.org/docs/Web/API/Web_Locks_API), and any in-flight circuit activity such as a running `IJSRuntime` call, a `DotNetStreamReference`/`JSStreamReference` transfer, or a queued render.

Apps can add their own deferral with a client-side circuit handler that implements `onCircuitPausing`. Blazor awaits every registered handler before it pauses, for both auto-pause and server-initiated pauses. Register it from a [JS initializer](https://learn.microsoft.com/aspnet/core/blazor/fundamentals/startup#javascript-initializers):

```javascript
// wwwroot/{ASSEMBLY NAME}.lib.module.js
export function beforeWebStart(options) {
  options.circuit ??= {};
  options.circuit.circuitHandlers ??= [];

  options.circuit.circuitHandlers.push({
    onCircuitPausing: async (signal) => {
      // Persist any in-progress state. `signal` aborts if the pause is cancelled,
      // for example because the tab became visible again.
      await savePendingWork(signal);
    },
  });
}
```

As part of this change, `Circuit.RequestCircuitPauseAsync` returns `Task<bool>` and takes an optional cancellation token, so pause-deferral work can be aborted when the connection is being torn down ([dotnet/aspnetcore #67045](https://github.com/dotnet/aspnetcore/pull/67045)).

## Cache Blazor SSR output with `CacheView`

`CacheView` is a new Blazor component that caches the rendered output of a server-side rendered subtree. On a cache hit the child components inside a `CacheView` are not instantiated or rendered again; the previously captured HTML is replayed directly, which cuts CPU and allocation for expensive server-rendered fragments ([dotnet/aspnetcore #65772](https://github.com/dotnet/aspnetcore/pull/65772), [dotnet/aspnetcore #67776](https://github.com/dotnet/aspnetcore/pull/67776)).

```razor
@using Microsoft.AspNetCore.Components

<CacheView ExpiresAfter="TimeSpan.FromMinutes(10)"
           VaryByRoute="productId"
           VaryByQuery="page,pageSize"
           VaryByCulture="true">
    <ExpensiveProductSummary ProductId="productId" />
</CacheView>
```

`CacheView` supports absolute (`ExpiresAfter`, `ExpiresOn`) and sliding (`ExpiresSliding`) expiration, and vary-by dimensions for query string, route, header, cookie, authenticated user (`VaryByUser`), current culture (`VaryByCulture`), and an arbitrary `VaryBy` string. `CacheKey` disambiguates multiple boundaries under the same parent. Caching is skipped for non-GET requests, when `Enabled="false"`, and inside streaming SSR.

By default `CacheView` uses an in-memory store bounded by `RazorComponentsServiceOptions.CacheViewSizeLimit` (default 100 MB). If the app registers `HybridCache`, `CacheView` picks it up from DI automatically, which gives a two-tier local/distributed cache with no other code change:

```csharp
builder.Services.AddHybridCache();

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();
```

Set `RazorComponentsServiceOptions.CacheViewHybridCache` to use a specific `HybridCache` instance instead of the one in DI.

Some components must not be baked into cached HTML because their output depends on per-request state (auth, forms, streaming). Author them with the new `[CacheBehavior]` and `[CacheCondition]` attributes. `[CacheBehavior(CacheBehavior.Rerender)]` treats the component as a "hole" that re-renders on every request even on a cache hit, while `[CacheBehavior(CacheBehavior.Throw)]` fails the request if the component is placed inside a `CacheView`. Pair `Throw` with `[CacheCondition(CacheVaryBy.…)]` to say which vary-by dimension makes caching safe again. Built-in components are annotated accordingly:

| Component | Annotation | Effect |
|---|---|---|
| `AntiforgeryToken`, `HeadOutlet` | `Rerender` | Always re-rendered per request |
| `AuthorizeView` | `Throw` + `CacheCondition(CacheVaryBy.User)` | Requires `VaryByUser="true"` |
| `QuickGrid<TGridItem>` | `Throw` + `CacheCondition(CacheVaryBy.Query)` | Requires `VaryByQuery` |
| `Virtualize<TItem>` | `Throw` | Cannot be cached at all |

Violations fail with a message that names the component and the fix:

```text
System.InvalidOperationException: Component 'QuickGrid`1[...]' cannot be used inside a CacheView
because its output depends on per-request state ([CacheBehavior(CacheBehavior.Throw)],
[CacheCondition(CacheVaryBy.Query)]) that cannot be safely cached and replayed. To fix this,
configure the CacheView to vary by Query, or move the component outside the CacheView.
```

## New Blazor analyzers

Preview 7 adds five new Blazor analyzers to help improve code quality. All are on by default and ship as `Warning`:

| ID | What it detects | Contribution |
|---|---|---|
| `BL0012` | Unnecessary `StateHasChanged()` calls in methods where the framework already schedules a render, such as `OnInitializedAsync`, an `EventCallback` handler, or a component parameter setter. Includes a code fix that removes the call. | [@MayaKirova](https://github.com/MayaKirova), [dotnet/aspnetcore #67176](https://github.com/dotnet/aspnetcore/pull/67176) |
| `BL0013` | Calls to `GetAuthenticationStateAsync()` without subscribing to `AuthenticationStateChanged`, which can leave a component using stale authentication state. | [@kdinev](https://github.com/kdinev), [dotnet/aspnetcore #67383](https://github.com/dotnet/aspnetcore/pull/67383) |
| `BL0014` | A `for`-loop counter captured by a closure or `RenderFragment`, which can bind every callback or rendered fragment to the final iteration value. | [@skrustev](https://github.com/skrustev), [dotnet/aspnetcore #67228](https://github.com/dotnet/aspnetcore/pull/67228) |
| `BL0015` | A non-public `[JSInvokable]` method, which compiles but can't be invoked from JavaScript. Includes a code fix that makes the method public. | [@damyanpetev](https://github.com/damyanpetev), [dotnet/aspnetcore #67137](https://github.com/dotnet/aspnetcore/pull/67137) |
| `BL0016` | An `IJSRuntime.InvokeAsync` or `InvokeVoidAsync` call outside a `try`/`catch`, where a disconnected circuit or JavaScript exception can tear down the component. | [@MayaKirova](https://github.com/MayaKirova), [dotnet/aspnetcore #67900](https://github.com/dotnet/aspnetcore/pull/67900) |

Because all five default to `Warning`, upgrading an existing app from Preview 6 will surface new warnings in code that previously built clean. Two cases are worth calling out:

- `BL0012` fires on the common pattern of calling `StateHasChanged()` at the top of an `async` event handler before an `await`. The call really is redundant because `ComponentBase` re-renders as soon as the handler yields, so the code fix is safe. If the handler relies on the UI updating before a long synchronous block, keep the `await Task.Yield()`; that, not `StateHasChanged()`, is what lets the render reach the browser.
- `BL0016` also fires on reusable wrapper and library code that deliberately lets `JSException` / `JSDisconnectedException` propagate to its caller. Wrapping those calls in a `try`/`catch` that swallows the exception would be wrong; suppress the diagnostic with a justification instead.

## Blazor `Virtualize` no longer requires an `ItemComparer`

`Virtualize<TItem>` now detects prepends and appends with `EqualityComparer<TItem>.Default` instead of requiring an explicit `ItemComparer`. This works for value-type items and reference-type items whose provider returns stable references ([dotnet/aspnetcore #67905](https://github.com/dotnet/aspnetcore/pull/67905)).

## `QuickGrid` supports `InitialItemIndex` and `ScrollToItemAsync`

`QuickGrid<TGridItem>` now forwards the two virtualization APIs to its inner `Virtualize` component so a grid can open at a specific row and be scrolled programmatically ([dotnet/aspnetcore #67914](https://github.com/dotnet/aspnetcore/pull/67914)):

```razor
<QuickGrid TGridItem="Product" Items="products"
           Virtualize="true"
           InitialItemIndex="500"
           @ref="grid">
    <PropertyColumn Property="@(p => p.Name)" />
    <PropertyColumn Property="@(p => p.Price)" />
</QuickGrid>

<button @onclick="() => grid.ScrollToItemAsync(0)">Back to top</button>

@code {
    private QuickGrid<Product> grid = default!;
    private List<Product> products = ProductCatalog.All;
}
```

Both APIs only take effect when `Virtualize="true"`. `ScrollToItemAsync` throws `InvalidOperationException` if virtualization is disabled or the grid hasn't rendered yet; the last call wins if a scroll is already in flight.

`QuickGrid` also exposes experimental `AnchorMode` and `ItemComparer` parameters (marked `[Experimental("ASP0030")]`) so grids backed by an `ItemsProvider` can pin to the end or detect prepend/append across data loads, matching the equivalents on `Virtualize` ([dotnet/aspnetcore #67783](https://github.com/dotnet/aspnetcore/pull/67783)).

## `wasm-tools` uses Emscripten 6

The .NET 11 `wasm-tools` workload now uses Emscripten 6.0.3, upgraded from Emscripten 5.0.6 in Preview 6 ([dotnet/emsdk #1789](https://github.com/dotnet/emsdk/pull/1789), [dotnet/emsdk #1788](https://github.com/dotnet/emsdk/pull/1788)). Blazor developers don't typically interact with Emscripten directly, but it provides the compiler toolchain used for WebAssembly AOT compilation and native dependencies.

Emscripten 6 updates the underlying native toolchain and libraries, including musl libc, llvm/clang, and libunwind. These updates bring in multiple years of optimizations across a wide range of areas from these upstream projects.

Existing Blazor app source doesn't need to change to benefit from the upgraded toolchain. See the [Emscripten 6 changelog](https://github.com/emscripten-core/emscripten/blob/6.0.3/ChangeLog.md) for the complete list of changes.

## Razor accepts literal attributes for union-typed component parameters

C# unions let a component author replace the usual "a `string` for the common case, a `RenderFragment` for everything else" parameter pair with a single type:

```csharp
public union ToastMessage(string, RenderFragment);

[Parameter, EditorRequired] public ToastMessage Message { get; set; }
```

In Preview 6 the Razor compiler couldn't convert a literal attribute value to the union's `string` case, so callers had to write the value as an explicit expression. Preview 7 removes that restriction, and the parameter is now set like any other string parameter ([dotnet/roslyn #84247](https://github.com/dotnet/roslyn/pull/84247)):

```razor
@* Preview 6 *@
<Toast Message="@("Saved 3 items.")" />

@* Preview 7 *@
<Toast Message="Saved 3 items." />
```

## Blazor SSR client-side form validation improvements

Preview 5 added client-side validation for Blazor static SSR forms without requiring an interactive render mode. Preview 7 improves the behavior to align more closely with interactive Blazor validation ([dotnet/aspnetcore #67324](https://github.com/dotnet/aspnetcore/pull/67324), [dotnet/aspnetcore #67855](https://github.com/dotnet/aspnetcore/pull/67855)):

- The client-side engine applies the same CSS classes as interactive Blazor validation: `valid` and `invalid` on inputs, with `modified` once the user edits a field, `validation-message` on message elements, and `validation-summary-errors` or `validation-summary-valid` on the summary.
- Client-side rules are emitted only for fields that server-side validation also validates. Server-side validation is authoritative, so a field that the server ignores, such as a nested property in an app that hasn't called `AddValidation`, no longer gets a client-side rule that suggests otherwise.

## Validation localization is built in

`Microsoft.Extensions.Validation` now localizes validation messages and display names without a separate package. The preview-only `Microsoft.Extensions.Validation.Localization` package and its `AddValidationLocalization<TResource>()` / `IValidationLocalizer` API are removed; localization now activates automatically as soon as an `IStringLocalizerFactory` is registered, and the lookup is emitted by the validation source generator into your assembly ([dotnet/aspnetcore #67987](https://github.com/dotnet/aspnetcore/pull/67987)).

```csharp
builder.Services.AddLocalization();
builder.Services.AddValidation();
```

```csharp
[ValidatableType]
public class CustomerModel
{
    [Display(Name = "CustomerName")]          // resource key for the display name
    [Required(ErrorMessage = "NameRequired")] // resource key for the message
    public string? Name { get; set; }
}
```

Keys resolve against the model's own resources, and a miss falls back to the attribute's built-in message. Two hooks on `ValidationOptions` cover the rest:

```csharp
builder.Services.AddValidation(options =>
{
    // Resolve every model's keys from one shared resource file.
    options.LocalizerProvider = (_, factory) => factory.Create(typeof(ValidationMessages));

    // Supply a key by convention when an attribute has no ErrorMessage, for example
    // [Range] => "RangeAttribute_Error".
    options.MessageKeyProvider = ctx => $"{ctx.ValidatorType.Name}_Error";
});
```

An explicit `ErrorMessage` always wins and is used as the key, so `MessageKeyProvider` only fills the gaps. Attributes that already localize themselves (`ErrorMessageResourceType`, `[Display(ResourceType = …)]`) bypass the pipeline entirely. A custom attribute that needs to substitute its own values into the message template can implement `IValidationMessageFormatter`:

```csharp
public sealed class DivisibleByAttribute : ValidationAttribute, IValidationMessageFormatter
{
    public int Divisor { get; init; }

    public string FormatMessage(CultureInfo culture, string template, string displayName)
        => string.Format(culture, template, displayName, Divisor); // {0} = name, {1} = divisor
}
```

The same localization rules apply to validation for minimal APIs and Blazor, so a message localizes identically wherever the model is used.

## Validation attributes are no longer experimental

`ValidatableTypeAttribute` and `SkipValidationAttribute` are no longer marked experimental ([dotnet/aspnetcore #67634](https://github.com/dotnet/aspnetcore/pull/67634)). If you suppressed `ASP0029` to use either attribute, you can remove the suppression.

## SignalR .NET client supports auth refresh after redirects

Preview 7 updates the SignalR .NET client so [authentication refresh](../preview6/aspnetcore.md#signalr-authentication-refresh) works when negotiate redirects to another server ([dotnet/aspnetcore #67612](https://github.com/dotnet/aspnetcore/pull/67612), contributed by [@MoChilia](https://github.com/MoChilia)). This client change enables support for redirecting servers such as Azure SignalR Service, but Azure SignalR Service has not enabled the feature yet.

The client now preserves the app-token provider across the redirect, adopts a refreshed transport token from the response, and retains `tokenLifetimeSeconds` so automatic refresh remains scheduled after the original token expires.

## Consistent authorization metadata across the stack

Authorization metadata can be expressed as `IAuthorizeData`, an `AuthorizationPolicy`, or an `IAuthorizationRequirementData` attribute. Preview 7 makes MVC filters, SignalR hub methods, and Blazor's `AuthorizeView` and `AuthorizeRouteView` apply all three forms consistently ([dotnet/aspnetcore #67765](https://github.com/dotnet/aspnetcore/pull/67765)).

A new `AuthorizationPolicy.CombineAsync` overload is the shared implementation:

```csharp
public class AuthorizationPolicy
{
    public static Task<AuthorizationPolicy?> CombineAsync(
        IAuthorizationPolicyProvider policyProvider,
        IEnumerable<object> metadata);
}
```

MVC, SignalR, and Blazor now use this overload internally. A custom attribute that implements both `IAuthorizeData` and `IAuthorizationRequirementData` contributes to the decision once. The legacy MVC path with `EnableEndpointRouting = false` is unchanged.

## OpenAPI Server-Sent Events in OpenAPI 3.2

Endpoints that return `SseItem<T>` are now described in the generated OpenAPI document with the OpenAPI 3.2 `itemSchema` shape for `text/event-stream` responses ([dotnet/aspnetcore #67461](https://github.com/dotnet/aspnetcore/pull/67461)). The `itemSchema` describes a stream's per-event payload shape instead of falling back to a plain `string` schema.

```csharp
app.MapGet("/todos/stream", (CancellationToken ct) =>
    TypedResults.ServerSentEvents(GetTodosAsync(ct)))
   .WithName("StreamTodos");

static async IAsyncEnumerable<SseItem<Todo>> GetTodosAsync(
    [EnumeratorCancellation] CancellationToken ct = default)
{
    foreach (var todo in Todos.All)
    {
        yield return new SseItem<Todo>(todo) { EventId = todo.Id.ToString() };
        await Task.Delay(1000, ct);
    }
}
```

Return the stream through `TypedResults.ServerSentEvents`. A handler that returns `IAsyncEnumerable<SseItem<T>>` directly is serialized as JSON instead of SSE. Use the dedicated `SseItem<T>` overload without `eventType`. To use one event name for the whole stream, pass a plain `IAsyncEnumerable<T>` with `eventType`.

The generated 3.2 document describes the event payload with `itemSchema` referencing `#/components/schemas/Todo`, plus the standard SSE `event` / `id` string fields:

```yaml
responses:
  '200':
    description: OK
    content:
      text/event-stream:
        itemSchema:
          type: object
          required: [data]
          properties:
            data:
              $ref: '#/components/schemas/Todo'
            event: { type: string }
            id: { type: string }
```

If the event payload is a discriminated union (a preview C# 14 feature), OpenAPI also emits the union's case names as an `enum` on the `event` field.

## TLS channel-binding token access from `ITlsConnectionFeature`

Applications that authenticate with Kerberos, NTLM, or another SSPI-based scheme over TLS can now read the connection's channel binding token to defend against relay attacks ([dotnet/aspnetcore #67436](https://github.com/dotnet/aspnetcore/pull/67436)):

```csharp
using System.Security.Authentication.ExtendedProtection;

app.Use(async (context, next) =>
{
    var tls = context.Features.Get<ITlsConnectionFeature>();
    if (tls is not null && tls.TryGetChannelBindingBytes(
            ChannelBindingKind.Endpoint,
            out ReadOnlyMemory<byte> cbt))
    {
        // Compare cbt against the token the client presented during authentication.
    }

    await next(context);
});
```

Kestrel returns the binding from `SslStream.TransportContext.GetChannelBinding`. IIS and HTTP.sys return it from the request; on HTTP.sys the new `HttpSysOptions.Authentication.HardeningLevel` (defaults to `Medium`) controls whether the OS is asked to enforce channel binding, and setting it to `Strict` now fails startup if the OS cannot apply that hardening rather than silently degrading ([dotnet/aspnetcore #67720](https://github.com/dotnet/aspnetcore/pull/67720)).

## Breaking changes

- **Preview 6 `Virtualize<TItem>` APIs renamed.** `InitialIndex` is now `InitialItemIndex`, `ScrollToIndexAsync` is now `ScrollToItemAsync`, and `VirtualizeAnchorMode.Beginning` is now `VirtualizeAnchorMode.Start`. The behavior is unchanged. `AnchorMode` values are now `None`, `Start`, and `End` ([dotnet/aspnetcore #67312](https://github.com/dotnet/aspnetcore/pull/67312), [dotnet/aspnetcore #67313](https://github.com/dotnet/aspnetcore/pull/67313)).
- **Blazor SSR client-validation APIs changed.** `DataAnnotationsValidator.EnableClientValidation` was replaced by `DisableClientValidation`, which defaults to `false` so client validation is enabled. `IClientValidationAdapter` was renamed to `IClientValidationRuleProvider`, and the client-validation types moved from `Microsoft.AspNetCore.Components.Forms.ClientValidation` to `Microsoft.AspNetCore.Components.Forms`. `ClientValidationRule.Parameters` is now a non-nullable empty dictionary when unset ([dotnet/aspnetcore #67324](https://github.com/dotnet/aspnetcore/pull/67324), [dotnet/aspnetcore #67855](https://github.com/dotnet/aspnetcore/pull/67855)).
- **Removed long-obsolete MVC APIs.** `CompatibilityVersion`, `IMvcBuilder.SetCompatibilityVersion` / `IMvcCoreBuilder.SetCompatibilityVersion`, `MvcCompatibilityOptions`, `ConfigureCompatibilityOptions<TOptions>`, the `ImageTagHelper` constructor that took `IWebHostEnvironment` and `TagHelperMemoryCacheProvider`, `ImageTagHelper.HostingEnvironment`, `ImageTagHelper.Cache`, and the `ModelMetadataIdentity.ForProperty(Type, string, Type)` overload have been removed after multiple releases of obsolete-with-warning. Use the `PropertyInfo`-based `ModelMetadataIdentity.ForProperty` overload; delete `SetCompatibilityVersion` calls ([dotnet/aspnetcore #67077](https://github.com/dotnet/aspnetcore/pull/67077)).
- **`EditContext.Validate` is `[Obsolete]`.** The synchronous method is marked obsolete in favor of `EditContext.ValidateAsync`, completing the async form-validation API shape approved in review. The Blazor Web App template calls `ValidateAsync` now. Update your own call sites, or suppress the obsolete warning where sync-only validation is still intended ([dotnet/aspnetcore #67662](https://github.com/dotnet/aspnetcore/pull/67662)).
- **Default CSRF middleware only validates opted-in endpoints.** Preview 6's [automatic CSRF protection](../preview6/aspnetcore.md#automatic-cross-origin-csrf-protection) validated every unsafe request by default. In Preview 7 the middleware validates only endpoints whose metadata contains `IAntiforgeryMetadata { RequiresValidation: true }`, the same rule the classic `AntiforgeryMiddleware` uses. Plain `MapPost` and plain MVC `[HttpPost]` endpoints without antiforgery metadata now pass through, matching .NET 10 behavior, so no endpoint that worked on .NET 10 starts failing on .NET 11. Blazor SSR forms, Razor Pages/MVC form binding, and minimal API handlers that bind form data (`[FromForm]`, `IFormFile`, `IFormCollection`) stay protected, because all of them attach `RequireAntiforgeryTokenAttribute` automatically. To opt an endpoint back in, bind its form data or apply `[ValidateAntiForgeryToken]`; `DisableAntiforgery()` still opts out ([dotnet/aspnetcore #67460](https://github.com/dotnet/aspnetcore/pull/67460), [dotnet/aspnetcore #67839](https://github.com/dotnet/aspnetcore/pull/67839)). `QUERY` is also now treated as a safe HTTP method for CSRF and antiforgery.
- **`ValidateContext.ValidationErrors` element type changed.** The dictionary value type changed from `IEnumerable<string>` to `IReadOnlyList<ValidationError>`, where `ValidationError` is a new class carrying `Name`, `Path`, `ErrorMessage`, and `Container` ([dotnet/aspnetcore #67659](https://github.com/dotnet/aspnetcore/pull/67659)). The full property is now `IReadOnlyDictionary<string, IReadOnlyList<ValidationError>>?`. `AddValidationError` takes a `ValidationError` in place of the removed `ValidationErrorContext` struct, and the `OnValidationError` event and the `required ValidationContext` property were removed from `ValidateContext` ([dotnet/aspnetcore #67549](https://github.com/dotnet/aspnetcore/pull/67549)). `ValidateContext` gains a `ServiceProvider` property so validators can resolve services without going through DataAnnotations' `ValidationContext`.
- **`Microsoft.Extensions.Validation`: abstract `Validatable*Info` moved to source-generation.** `ValidatableTypeInfo`, `ValidatableParameterInfo`, and `ValidatablePropertyInfo` are no longer part of the public API. The validation source generator now emits them as `file` classes in your assembly, and `IValidatableInfoResolver` returns the interface types (`IValidatableTypeInfo`, etc.). Apps that use `[ValidatableType]` and `builder.Services.AddValidation()` are unaffected. Code that constructed these types directly must move to implementing the interfaces or rely on the generator ([dotnet/aspnetcore #67956](https://github.com/dotnet/aspnetcore/pull/67956)). Related: `System.ComponentModel.DataAnnotations.ValidationContext` was removed from the `Microsoft.Extensions.Validation` public API surface ([dotnet/aspnetcore #67549](https://github.com/dotnet/aspnetcore/pull/67549)).
- **`WebApplicationFactory.ConfigureHostApplicationBuilder` renamed to `ConfigureWebApplicationBuilder`.** The protected virtual method on `WebApplicationFactory<TEntryPoint>` was renamed to avoid confusion with `Host.CreateApplicationBuilder`. Rename any override in your test fixtures ([dotnet/aspnetcore #67917](https://github.com/dotnet/aspnetcore/pull/67917)).
- **`UseWebAssemblyDebugging` obsolete, DevServer package deprecated.** `WebAssemblyNetDebugProxyAppBuilderExtensions.UseWebAssemblyDebugging` is now `[Obsolete("ASPDEPR011")]`, and the `Microsoft.AspNetCore.Components.WebAssembly.DevServer` NuGet package is marked deprecated in favor of the new Blazor Gateway host, which ships as the `Microsoft.AspNetCore.Components.Gateway` package and a `Microsoft.AspNetCore.Components.Gateway.Cli` .NET tool ([dotnet/aspnetcore #67990](https://github.com/dotnet/aspnetcore/pull/67990)). The Gateway serves a standalone WebAssembly app with HTTPS redirection, HSTS, health-check endpoints, and telemetry configurable through a `Gateway` configuration section. The Blazor Web App templates no longer call `UseWebAssemblyDebugging`; Visual Studio and VS Code attach the WebAssembly debugger automatically. Remove `app.UseWebAssemblyDebugging()` from your `Program.cs` if you added it manually ([dotnet/aspnetcore #67861](https://github.com/dotnet/aspnetcore/pull/67861), [dotnet/aspnetcore #67862](https://github.com/dotnet/aspnetcore/pull/67862)).
- **`Microsoft.AspNetCore.Grpc.Swagger` package removed.** The package, which integrated gRPC JSON transcoding with Swashbuckle, is deleted ([dotnet/aspnetcore #67919](https://github.com/dotnet/aspnetcore/pull/67919)).
- **`WebAssemblyComponentsOptions` culture toggle is no longer public.** The public `WebAssemblyComponentsOptions.UseCultureFromServer` property and the `AddInteractiveWebAssemblyComponents(builder, Action<WebAssemblyComponentsOptions>?)` overload were removed. Culture persistence is now opt-in through the `Components:UseCultureFromServer` configuration value; the default fall-back is based on whether `AddLocalization()` is registered ([dotnet/aspnetcore #67367](https://github.com/dotnet/aspnetcore/pull/67367)).
- **Null / missing session is handled uniformly.** The Blazor Endpoints session and TempData features used to throw in some code paths, silently return empty in others, and return `null` in a third. Now, if a session is expected but not configured under an active `HttpContext` (static SSR), the framework throws `InvalidOperationException`. When there is no `HttpContext` at all (interactive Server circuit / WebAssembly), the value gracefully yields `null` / empty and logs one warning. Untrusted or corrupt stored data is still swallowed. Static SSR pages that use `[SupplyParameterFromTempData]` or a session-storage TempData provider without registering session middleware will now fail fast instead of silently returning `null` ([dotnet/aspnetcore #67641](https://github.com/dotnet/aspnetcore/pull/67641)).

## Bug fixes

- **Antiforgery / CSRF**
  - [Fix CsrfProtectionMiddleware perf degradations](https://github.com/dotnet/aspnetcore/pull/67488)
  - [Rerun PostRoutingPipeline on Rerouting](https://github.com/dotnet/aspnetcore/pull/67618)
  - [Improve antiforgery error message for unauthenticated requests with authenticated tokens](https://github.com/dotnet/aspnetcore/pull/67942)
  - [Fix passkey login broken by SSR client-side validation](https://github.com/dotnet/aspnetcore/pull/67258)
  - [Fix Blazor passkey registration under CsrfProtection](https://github.com/dotnet/aspnetcore/pull/67589)
- **Blazor**
  - [Blazor: Fix WebView blazor.modules.json publish crash via conditional fallback](https://github.com/dotnet/aspnetcore/pull/67375)
  - [Fix Virtualize AnchorMode=End re-engaging bottom after user scrolls up](https://github.com/dotnet/aspnetcore/pull/67555)
  - [Fix Virtualize scroll jump from native/JS anchoring double-compensation](https://github.com/dotnet/aspnetcore/pull/67934)
  - [Fix placeholder flash when appending to an End-anchored virtualized list](https://github.com/dotnet/aspnetcore/pull/67679)
  - [Fix QuickGrid None-mode async-provider prepend viewport drift](https://github.com/dotnet/aspnetcore/pull/67931)
  - [Fix QuickGrid Start-mode async-provider prepend viewport drift](https://github.com/dotnet/aspnetcore/pull/67935)
  - [Fixed AmbiguousMatchException in DataAnnotationsValidator for Hidden Members](https://github.com/dotnet/aspnetcore/pull/67075)
  - [Wasm: Html Encode incoming parameters to debug page](https://github.com/dotnet/aspnetcore/pull/67875)
  - [Blazor: Execute `discoverBrowserConfiguration` on every enhanced navigation](https://github.com/dotnet/aspnetcore/pull/67387)
- **OpenAPI**
  - [Fix array handling for JSON pointers when resolving OpenAPI schemas](https://github.com/dotnet/aspnetcore/pull/67573)
  - [Fix tags ordering in OpenAPI generation](https://github.com/dotnet/aspnetcore/pull/65728)
  - [Fix OpenApiSchemaService to handle implementation different from Dictionary<,> for schema.Properties](https://github.com/dotnet/aspnetcore/pull/67384)
  - [Fix InvalidCastException when retrieving attributes for PropertyAsParameterInfo](https://github.com/dotnet/aspnetcore/pull/67284)
  - [Fix nullability handling in OpenApi](https://github.com/dotnet/aspnetcore/pull/67661)
  - [Add IEndpointMetadataProvider to UnauthorizedHttpResult](https://github.com/dotnet/aspnetcore/pull/65611)
  - [Add OpenApiGenerationEnvironment property support for API description server document generation](https://github.com/dotnet/aspnetcore/pull/68040)
  - [Respect IModelNameProvider when matching OpenAPI parameters](https://github.com/dotnet/aspnetcore/pull/67971)
- **Data protection**
  - [Fix eager load of currentKeyRing on resolving IDataProtector](https://github.com/dotnet/aspnetcore/pull/67465)
  - [Always run self test on encryptors](https://github.com/dotnet/aspnetcore/pull/66413)
- **RDG / Minimal API source generator**
  - [Fix RDG generating invalid code for types from other source generators](https://github.com/dotnet/aspnetcore/pull/65453)
  - [Fix MapFallback handling in RDG](https://github.com/dotnet/aspnetcore/pull/67562)
  - [Fix RDG check for endpoint uniqueness](https://github.com/dotnet/aspnetcore/pull/67591)
  - [Fix service parameter detection logic for minimal API validation filter](https://github.com/dotnet/aspnetcore/pull/67578)
  - [ValidationsGenerator: Allow validating internal types](https://github.com/dotnet/aspnetcore/pull/67399)
  - [Remove ExperimentalAttribute from validation attributes](https://github.com/dotnet/aspnetcore/pull/67634)
  - [Add synchronous Validate method in Microsoft.Extensions.Validation](https://github.com/dotnet/aspnetcore/pull/67427)
- **Identity**
  - [Improve CreateTwoFactorRecoveryCode in .NET 8+](https://github.com/dotnet/aspnetcore/pull/67670)
  - [Allow `null` on `UserOptions.AllowedUserNameCharacters`](https://github.com/dotnet/aspnetcore/pull/67731)
  - [Clear cached session key in cookie auth handler sign-out](https://github.com/dotnet/aspnetcore/pull/67049)
- **Client errors**
  - [Fix ClientErrorMapping 500 title to match RFC 9110](https://github.com/dotnet/aspnetcore/pull/65590)
  - [Avoid ArgumentException when Problem/ValidationProblem extensions conflict with defaults](https://github.com/dotnet/aspnetcore/pull/67690)
- **Server and middleware hardening**
  - [Reject connection-specific headers sent via HPACK/QPACK indexed names](https://github.com/dotnet/aspnetcore/pull/67584)
  - [Reject Content-Length with a leading plus or minus sign](https://github.com/dotnet/aspnetcore/pull/67635)
  - [Harden chunked request handling in the ASP.NET Core Module](https://github.com/dotnet/aspnetcore/pull/67512)
  - [Cap the Zstandard request decompression window at 8 MB](https://github.com/dotnet/aspnetcore/pull/67688)
  - [Close rejected HTTP/1.1 CONNECT requests](https://github.com/dotnet/aspnetcore/pull/67929)
  - [Enforce MultipartHeadersLengthLimit across buffered reads](https://github.com/dotnet/aspnetcore/pull/67840)
  - [Collapse scheme-relative leading slashes in Rewrite middleware targets](https://github.com/dotnet/aspnetcore/pull/66961)
  - [Normalize backslashes in Rewrite middleware targets](https://github.com/dotnet/aspnetcore/pull/67928)
  - [Treat backslashes as segment boundaries in PathString.StartsWithSegments](https://github.com/dotnet/aspnetcore/pull/67093)
- **Miscellaneous**
  - [Harden wildcard matching with empty segments inside](https://github.com/dotnet/aspnetcore/pull/67757)
  - [Use SearchValues/ContainsAny/span helpers in more places](https://github.com/dotnet/aspnetcore/pull/67018)
  - [Use more performant span APIs](https://github.com/dotnet/aspnetcore/pull/67150)
  - [Zero sensitive buffers on clear](https://github.com/dotnet/aspnetcore/pull/66577)
  - [Remove redundant app.UseAntiforgery() from Blazor Web templates](https://github.com/dotnet/aspnetcore/pull/67119)
  - [Improve QuickGrid diagnostics for mismatched GridSort types](https://github.com/dotnet/aspnetcore/pull/67413)
  - [Fix QuickGrid accessibility issue](https://github.com/dotnet/aspnetcore/pull/67674)

## Community contributors

Thank you contributors! ❤️

- [@BharatRamsf3693](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3ABharatRamsf3693+milestone%3A11.0-preview7)
- [@cincuranet](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Acincuranet+milestone%3A11.0-preview7)
- [@damyanpetev](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Adamyanpetev+milestone%3A11.0-preview7)
- [@EduardF1](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3AEduardF1+milestone%3A11.0-preview7)
- [@kdinev](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Akdinev+milestone%3A11.0-preview7)
- [@KitKeen](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3AKitKeen+milestone%3A11.0-preview7)
- [@kobihikri](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Akobihikri+milestone%3A11.0-preview7)
- [@mahdiaghtaee](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Amahdiaghtaee+milestone%3A11.0-preview7)
- [@marcominerva](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Amarcominerva+milestone%3A11.0-preview7)
- [@martincostello](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Amartincostello+milestone%3A11.0-preview7)
- [@MayaKirova](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3AMayaKirova+milestone%3A11.0-preview7)
- [@medhatiwari](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Amedhatiwari+milestone%3A11.0-preview7)
- [@oroztocil](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Aoroztocil+milestone%3A11.0-preview7)
- [@PreethikaSelvam](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3APreethikaSelvam+milestone%3A11.0-preview7)
- [@RichardD2](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3ARichardD2+milestone%3A11.0-preview7)
- [@skrustev](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Askrustev+milestone%3A11.0-preview7)
- [@SparshGarg999](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3ASparshGarg999+milestone%3A11.0-preview7)
- [@UditDewan](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3AUditDewan+milestone%3A11.0-preview7)
- [@unsafePtr](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3AunsafePtr+milestone%3A11.0-preview7)
- [@Vladik29w](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3AVladik29w+milestone%3A11.0-preview7)

<!-- Verified against Microsoft.AspNetCore.App.Ref sources at dotnet/dotnet@e2c1e00b3d (release/11.0.1xx-preview7), specifically the PublicAPI.Unshipped.txt files for CacheView, Virtualize, SignalR auth refresh, and the BL0012–BL0016 diagnostic descriptors. Milestone slug 11.0-preview7 confirmed via `gh pr view 67098 --json milestone`. -->
