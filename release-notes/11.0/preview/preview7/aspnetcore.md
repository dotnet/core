# ASP.NET Core in .NET 11 Preview 7 - Release Notes

.NET 11 Preview 7 includes new ASP.NET Core features and improvements:

- [Blazor Server automatic circuit pause](#blazor-server-automatic-circuit-pause)
- [Cache Blazor SSR output with `CacheView`](#cache-blazor-ssr-output-with-cacheview)
- [New Blazor analyzers](#new-blazor-analyzers)
- [Blazor `Virtualize` API renames and improvements](#blazor-virtualize-api-renames-and-improvements)
- [`QuickGrid` supports `InitialItemIndex` and `ScrollToItemAsync`](#quickgrid-supports-initialitemindex-and-scrolltoitemasync)
- [Razor accepts literal attributes for union-typed component parameters](#razor-accepts-literal-attributes-for-union-typed-component-parameters)
- [Blazor SSR client-side form validation reworked](#blazor-ssr-client-side-form-validation-reworked)
- [Validation localization is built in](#validation-localization-is-built-in)
- [SignalR auth refresh works behind Azure SignalR](#signalr-auth-refresh-works-behind-azure-signalr)
- [Consistent authorization metadata across the stack](#consistent-authorization-metadata-across-the-stack)
- [OpenAPI Server-Sent Events in OpenAPI 3.2](#openapi-server-sent-events-in-openapi-32)
- [TLS channel-binding token access from `ITlsConnectionFeature`](#tls-channel-binding-token-access-from-itlsconnectionfeature)
- [Kestrel and IIS hardening](#kestrel-and-iis-hardening)
- [Rewrite middleware collapses scheme-relative slashes](#rewrite-middleware-collapses-scheme-relative-slashes)
- [`PathString.StartsWithSegments` treats `\` as a segment boundary](#pathstringstartswithsegments-treats--as-a-segment-boundary)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

ASP.NET Core updates in .NET 11:

- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-11)

## Blazor Server automatic circuit pause

Interactive Server circuits can now pause themselves automatically when the browser tab is hidden, releasing SignalR and server-side memory until the user comes back ([dotnet/aspnetcore #67098](https://github.com/dotnet/aspnetcore/pull/67098)). Preview 6 added [`Circuit.RequestCircuitPauseAsync`](https://github.com/dotnet/aspnetcore/issues/64886) so the server could pause a circuit on demand; Preview 7 adds a matching client-driven path that fires after a configurable inactivity delay while a page is hidden.

Configure it per app on the render mode via `AddAutoPause` on `BrowserOptions`. The behavior ships in the separate `Microsoft.AspNetCore.Components.Server.AutoPause` package, so add a reference to opt in:

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

Auto-pause defers itself while a pause would lose data or interrupt work in progress. The shipped checks are a text input or `contenteditable` element whose value differs from its default (including inside shadow DOM and same-origin iframes), an `<audio>` or `<video>` element that is playing unmuted, an open [Picture-in-Picture](https://developer.mozilla.org/docs/Web/API/Picture-in-Picture_API) window, a held [Web Lock](https://developer.mozilla.org/docs/Web/API/Web_Locks_API), and any in-flight circuit activity such as a running `IJSRuntime` call, a `DotNetStreamReference`/`JSStreamReference` transfer, or a queued render.

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
    .AddInteractiveServerRenderMode();
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

Preview 7 adds five new analyzers to the Blazor SDK targeting pack. All are on by default and ship as `Warning`:

| ID | Diagnostic | PR |
|---|---|---|
| `BL0012` | `StateHasChanged` is unnecessary in method '…' and can be removed | [dotnet/aspnetcore #67176](https://github.com/dotnet/aspnetcore/pull/67176) |
| `BL0013` | '…' calls `GetAuthenticationStateAsync` on `AuthenticationStateProvider` without subscribing to the `AuthenticationStateChanged` event. This may result in using stale authentication state | [dotnet/aspnetcore #67383](https://github.com/dotnet/aspnetcore/pull/67383) |
| `BL0014` | For loop iterator '…' is used in a closure or `RenderFragment`/`ChildContent`. This can lead to unexpected runtime behavior | [dotnet/aspnetcore #67228](https://github.com/dotnet/aspnetcore/pull/67228) |
| `BL0015` | Method '…' decorated with `[JSInvokable]` should be public | [dotnet/aspnetcore #67137](https://github.com/dotnet/aspnetcore/pull/67137) |
| `BL0016` | JS interop call '…' is not guarded with a try/catch block | [dotnet/aspnetcore #67900](https://github.com/dotnet/aspnetcore/pull/67900) |

`BL0012` flags `StateHasChanged()` calls that the framework already schedules for you — for example inside `OnInitializedAsync`, an `EventCallback` handler, or a component parameter setter — and offers a code fix that removes them. `BL0013` catches the common bug where a component reads `GetAuthenticationStateAsync()` once and then serves a stale user because it never subscribed to `AuthenticationStateChanged`. `BL0014` catches a classic Blazor bug where a `for`-loop counter is captured by a lambda used in `@onclick` or a child component's parameter, so every button ends up bound to the final iteration value. `BL0015` flags `[JSInvokable]` methods that aren't `public` — they compile but JavaScript can't call them — and offers a code fix that makes them public. `BL0016` warns when an `IJSRuntime.InvokeAsync` / `InvokeVoidAsync` call is not inside a `try`/`catch`, so a disconnected circuit or a JS exception doesn't tear down the component.

Four of these were community contributions — see the [community section](#community-contributors) at the end.

Because all five default to `Warning`, upgrading an existing app from Preview 6 will surface new warnings in code that previously built clean. Two cases are worth calling out:

- `BL0012` fires on the common pattern of calling `StateHasChanged()` at the top of an `async` event handler before an `await`. The call really is redundant — `ComponentBase` re-renders as soon as the handler yields — so the code fix is safe. If the handler relies on the UI updating before a long synchronous block, keep the `await Task.Yield()`; that, not `StateHasChanged()`, is what lets the render reach the browser.
- `BL0016` also fires on reusable wrapper and library code that deliberately lets `JSException` / `JSDisconnectedException` propagate to its caller. Wrapping those calls in a `try`/`catch` that swallows the exception would be wrong; suppress the diagnostic with a justification instead.

## Blazor `Virtualize` API renames and improvements

The two new `Virtualize<TItem>` APIs added in Preview 6 were renamed in API review to align with the existing `ItemComparer` and `ScrollToBottom` shape ([dotnet/aspnetcore #67312](https://github.com/dotnet/aspnetcore/pull/67312), [dotnet/aspnetcore #67313](https://github.com/dotnet/aspnetcore/pull/67313)):

| Preview 6 name | Preview 7 name |
|---|---|
| `InitialIndex` (`int`) | `InitialItemIndex` (`int`) |
| `ScrollToIndexAsync(int, CancellationToken)` | `ScrollToItemAsync(int, CancellationToken)` |
| `VirtualizeAnchorMode.Beginning` | `VirtualizeAnchorMode.Start` |

The parameter and method behavior is unchanged; only the names moved. `AnchorMode` keeps its `VirtualizeAnchorMode` type, whose values are now `None`, `Start`, and `End`. `VirtualizeAnchorMode.End` keeps the viewport pinned to the bottom of the list as items are appended (useful for chat), and `Start` — the default — keeps the visible window anchored while items are prepended.

Prepend/append detection also improved: `Virtualize<TItem>` now runs it with the default `EqualityComparer<TItem>.Default` instead of requiring you to assign `ItemComparer` explicitly, which covers value-type items and reference-type items whose provider returns stable references ([dotnet/aspnetcore #67905](https://github.com/dotnet/aspnetcore/pull/67905)).

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

One gap remains: child content between the component's tags still doesn't populate a `RenderFragment` case, so that case has to be supplied as an expression ([dotnet/razor #13200](https://github.com/dotnet/razor/issues/13200)).

## Blazor SSR client-side form validation reworked

Preview 5 added client-side validation for Blazor static SSR forms: adding `<DataAnnotationsValidator />` inside a static `EditForm` now runs `[Required]`, `[Range]`, `[RegularExpression]`, `[StringLength]`, and similar rules in the browser before the form posts. Preview 7 keeps that feature but reworks the implementation and the API shape after review feedback ([dotnet/aspnetcore #67324](https://github.com/dotnet/aspnetcore/pull/67324), [dotnet/aspnetcore #67855](https://github.com/dotnet/aspnetcore/pull/67855)):

- Rules are now delivered through a single inert per-form carrier element instead of MVC-style `data-val-*` attributes on every input.
- `DataAnnotationsValidator.EnableClientValidation` was replaced by `DisableClientValidation` (default `false`, so client validation is on out of the box). A global `RazorComponentsServiceOptions.DisableClientValidation` opt-out turns rule emission off for every form.
- `IClientValidationAdapter` was renamed to `IClientValidationRuleProvider`. `ClientValidationRule.Parameters` is now a non-nullable empty dictionary when unset.
- The `ClientValidation` types moved from `Microsoft.AspNetCore.Components.Forms.ClientValidation` to `Microsoft.AspNetCore.Components.Forms`.

```razor
<EditForm Model="Model" OnValidSubmit="Submit" FormName="reservation">
    <DataAnnotationsValidator />

    <InputText @bind-Value="Model.Email" />
    <ValidationMessage For="() => Model.Email" />

    <button type="submit">Book</button>
</EditForm>
```

## Validation localization is built in

`Microsoft.Extensions.Validation` localizes validation messages and display names without a separate package. The preview-only `Microsoft.Extensions.Validation.Localization` package and its `AddValidationLocalization<TResource>()` / `IValidationLocalizer` API are removed; localization now activates automatically as soon as an `IStringLocalizerFactory` is registered, and the lookup is emitted by the validation source generator into your assembly ([dotnet/aspnetcore #68005](https://github.com/dotnet/aspnetcore/pull/68005)).

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

    // Supply a key by convention when an attribute has no ErrorMessage — for example
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

The same rules apply to minimal API endpoint validation, Blazor interactive form validation, and Blazor SSR client-side validation, so a message localizes identically wherever the model is used.

`Microsoft.Extensions.Validation` also drops its `[Experimental("ASP0029")]` markers in Preview 7 ([dotnet/aspnetcore #67634](https://github.com/dotnet/aspnetcore/pull/67634)). If you suppressed `ASP0029` to use `[ValidatableType]` or `AddValidation()`, you can remove the suppression.

## SignalR auth refresh works behind Azure SignalR

Preview 6 introduced [SignalR authentication refresh](../preview6/aspnetcore.md#signalr-authentication-refresh), which keeps a hub connection open across access-token expiration by exposing a `/refresh` endpoint on the server and a matching flow in the .NET client. Preview 7 extends the .NET client so refresh also works when negotiate redirects to a different server — the shape used by Azure SignalR Service ([dotnet/aspnetcore #67612](https://github.com/dotnet/aspnetcore/pull/67612), community contribution from [@MoChilia](https://github.com/MoChilia)).

Behind Azure SignalR the app token authenticates against the app server, and the transport uses a separate service token issued by the redirect. Before this change the client posted `/refresh` with the wrong token, ignored any refreshed transport token in the response, and lost the `tokenLifetimeSeconds` value across the redirect. The client now captures the app-token provider before transports overwrite it, sends `/refresh` with the app token, adopts a refreshed `accessToken` from the response when one is present, and preserves the negotiate hop's `tokenLifetimeSeconds` so auto-refresh scheduling keeps working past the original expiry.

Self-hosted SignalR is unaffected — the redirect-only fields are optional and omitted there.

## Consistent authorization metadata across the stack

`[Authorize]` policies aren't the only shape of authorization metadata attached to an endpoint. `AuthorizationPolicy` instances used directly as metadata and `IAuthorizationRequirementData` attributes (which carry requirements without a named policy) are equally valid, and endpoint routing's `AuthorizationMiddleware` has honored all three for years. Preview 7 brings MVC filters, SignalR hub method authorization, and Blazor's `AuthorizeView` / `AuthorizeRouteView` into line so the same custom authorization attribute behaves consistently everywhere ([dotnet/aspnetcore #67765](https://github.com/dotnet/aspnetcore/pull/67765)).

A new `AuthorizationPolicy.CombineAsync` overload is the shared implementation:

```csharp
public class AuthorizationPolicy
{
    public static Task<AuthorizationPolicy?> CombineAsync(
        IAuthorizationPolicyProvider policyProvider,
        IEnumerable<object> metadata);
}
```

You typically don't call it yourself: MVC's `AuthorizeFilter`, SignalR's hub method dispatcher, and Blazor's authorize view components all now route through it, so a single attribute that implements both `IAuthorizeData` and `IAuthorizationRequirementData` contributes to each side of the decision exactly once. The legacy non-endpoint-routing MVC path (`EnableEndpointRouting = false`) is deliberately not updated.

## OpenAPI Server-Sent Events in OpenAPI 3.2

Endpoints that return `SseItem<T>` are now described in the generated OpenAPI document with the OpenAPI 3.2 `itemSchema` shape for `text/event-stream` responses ([dotnet/aspnetcore #67461](https://github.com/dotnet/aspnetcore/pull/67461)). Preview 6 made [OpenAPI 3.2 the default](../preview6/aspnetcore.md#openapi-32-by-default); Preview 7 uses that headroom to describe a stream's per-event payload shape instead of falling back to a plain `string` schema.

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

Route the stream through `TypedResults.ServerSentEvents`. Returning an `IAsyncEnumerable<SseItem<T>>` directly from the handler is not an SSE response — minimal APIs serialize it as a JSON array, and the document describes it that way. Note also that `ServerSentEvents` has a dedicated `IAsyncEnumerable<SseItem<T>>` overload that takes no `eventType`; passing `eventType:` alongside `SseItem<T>` items instead binds `ServerSentEvents<T>(IAsyncEnumerable<T>, string?)` with `T` inferred as `SseItem<Todo>`, which serializes the whole envelope into `data`. Use `TypedResults.ServerSentEvents(items, eventType: "todo")` with a plain `IAsyncEnumerable<Todo>` when one event name covers the stream.

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

## Kestrel and IIS hardening

A cluster of security fixes closed protocol-level gaps in Kestrel, HTTP/2, HTTP/3, and the ASP.NET Core Module.

**Connection-specific headers on HTTP/2 and HTTP/3** — the check that rejects `connection`, `transfer-encoding`, `keep-alive`, `proxy-connection`, `upgrade`, and `te` when they arrive over HTTP/2 or HTTP/3 previously ran only on literal-name representations. Kestrel now also rejects them when they arrive as an HPACK / QPACK indexed name (for example `transfer-encoding` sent as HPACK static-table entry 57 with a literal `chunked` value) so a peer can no longer smuggle `Transfer-Encoding: chunked` past the guard on multiplexed connections ([dotnet/aspnetcore #67584](https://github.com/dotnet/aspnetcore/pull/67584)).

**`Content-Length` sign check** — RFC 9110 defines `Content-Length` as `1*DIGIT`, but the underlying UTF-8 parser accepted a leading `+` or `-`. Kestrel now rejects headers such as `Content-Length: +5` before they reach request-body reading ([dotnet/aspnetcore #67635](https://github.com/dotnet/aspnetcore/pull/67635)).

**ANCM `Transfer-Encoding: chunked` hardening** — the ASP.NET Core Module's chunked-body reader now applies stricter framing checks so a malformed chunked request cannot desynchronize an in-process request ([dotnet/aspnetcore #67512](https://github.com/dotnet/aspnetcore/pull/67512)).

**Zstandard request decompression window cap** — the request decompression middleware caps the zstd decoder window at 8 MB (RFC 9659's ceiling) so a small compressed payload cannot force a 128 MB decoder allocation. Well-behaved clients that emit a ≤ 2 MB window are unaffected ([dotnet/aspnetcore #67688](https://github.com/dotnet/aspnetcore/pull/67688)).

**CONNECT close-on-reject** — HTTP/1.1 `CONNECT` requests that Kestrel rejects with a 3xx-or-higher status now close the connection instead of keeping it alive, per [RFC 9931 §8](https://www.rfc-editor.org/rfc/rfc9931#section-8) ([dotnet/aspnetcore #67929](https://github.com/dotnet/aspnetcore/pull/67929)). HTTP/2, HTTP/3, and accepted (2xx) CONNECTs are unaffected.

**Multipart headers limit enforced across buffer boundaries** — the `MultipartHeadersLengthLimit` enforcement now spans buffered reads so a peer can no longer split a huge header across chunks to slip past the limit ([dotnet/aspnetcore #67840](https://github.com/dotnet/aspnetcore/pull/67840)).

## Rewrite middleware collapses scheme-relative slashes

`AddRedirect`, IIS URL Rewrite, and Apache `mod_rewrite` all let a back-reference or a literal rule produce a redirect / rewrite target that starts with `//`, `///`, or `/\`. When the app has no `PathBase`, the resulting `Location` header is scheme-relative and resolves off-origin — an [open redirect](https://cwe.mitre.org/data/definitions/601.html) reachable through user-controlled URL segments. Rewrite middleware now collapses any leading run of `/` and `\` in the target down to a single `/` before it is used ([dotnet/aspnetcore #66961](https://github.com/dotnet/aspnetcore/pull/66961), [dotnet/aspnetcore #67928](https://github.com/dotnet/aspnetcore/pull/67928)):

```csharp
app.UseRewriter(new RewriteOptions()
    .AddRedirect("legacy/(.*)", "/$1", statusCode: 302));

// GET /legacy/attacker.example
// Preview 6: Location: //attacker.example  (scheme-relative — off-origin)
// Preview 7: Location: /attacker.example   (collapsed to a single leading slash)
```

If your rules intentionally emit a scheme-relative or absolute URL, provide the full `https://host/…` form; the collapse only applies to leading slash / backslash runs on relative paths.

## `PathString.StartsWithSegments` treats `\` as a segment boundary

`PathString.StartsWithSegments` used to treat only `/` as a segment boundary. A request like `/foo%5Cbar` (which decodes to `/foo\bar`) therefore failed to match `app.Map("/foo")`, so a segment-guarded middleware branch could be bypassed. All four `StartsWithSegments` overloads now treat `\` as equivalent to `/` for boundary detection, which aligns with the WHATWG URL Standard (which normalizes `\` → `/` for HTTP URLs) and with how `HttpSys` and IIS already expose backslashes in `HttpRequest.Path` ([dotnet/aspnetcore #67093](https://github.com/dotnet/aspnetcore/pull/67093)). The original character is preserved in both `matched` and `remaining`, and the `PathString` constructor was relaxed to accept `\` as a leading character so that `remaining` from a matched `Map` branch can begin with one.

## Breaking changes

- **Removed long-obsolete MVC APIs** — `CompatibilityVersion`, `IMvcBuilder.SetCompatibilityVersion` / `IMvcCoreBuilder.SetCompatibilityVersion`, `MvcCompatibilityOptions`, `ConfigureCompatibilityOptions<TOptions>`, the `ImageTagHelper` constructor that took `IWebHostEnvironment` and `TagHelperMemoryCacheProvider`, `ImageTagHelper.HostingEnvironment`, `ImageTagHelper.Cache`, and the `ModelMetadataIdentity.ForProperty(Type, string, Type)` overload have been removed after multiple releases of obsolete-with-warning. Use the `PropertyInfo`-based `ModelMetadataIdentity.ForProperty` overload; delete `SetCompatibilityVersion` calls (the "current" behavior is the only supported one) ([dotnet/aspnetcore #67077](https://github.com/dotnet/aspnetcore/pull/67077)).
- **`EditContext.Validate` is `[Obsolete]`** — the synchronous method is marked obsolete in favor of `EditContext.ValidateAsync`, completing the async form-validation API shape approved in review. The Blazor Web App template calls `ValidateAsync` now. Update your own call sites, or suppress the obsolete warning where sync-only validation is still intended ([dotnet/aspnetcore #67662](https://github.com/dotnet/aspnetcore/pull/67662)).
- **Default CSRF middleware only validates opted-in endpoints** — Preview 6's [automatic CSRF protection](../preview6/aspnetcore.md#automatic-cross-origin-csrf-protection) validated every unsafe request by default. In Preview 7 the middleware validates only endpoints whose metadata contains `IAntiforgeryMetadata { RequiresValidation: true }` — the same rule the classic `AntiforgeryMiddleware` uses. Plain `MapPost` and plain MVC `[HttpPost]` endpoints without antiforgery metadata now pass through, matching .NET 10 behavior, so no endpoint that worked on .NET 10 starts failing on .NET 11. Blazor SSR forms, Razor Pages/MVC form binding, and minimal API handlers that bind form data (`[FromForm]`, `IFormFile`, `IFormCollection`) stay protected, because all of them attach `RequireAntiforgeryTokenAttribute` automatically. To opt an endpoint back in, bind its form data or apply `[ValidateAntiForgeryToken]`; `DisableAntiforgery()` still opts out ([dotnet/aspnetcore #67460](https://github.com/dotnet/aspnetcore/pull/67460), [dotnet/aspnetcore #67839](https://github.com/dotnet/aspnetcore/pull/67839)). `QUERY` is also now treated as a safe HTTP method for CSRF and antiforgery.
- **`ValidateContext.ValidationErrors` element type changed** — the dictionary value type changed from `IEnumerable<string>` to `IReadOnlyList<ValidationError>`, where `ValidationError` is a new class carrying `Name`, `Path`, `ErrorMessage`, and `Container` ([dotnet/aspnetcore #67659](https://github.com/dotnet/aspnetcore/pull/67659)). The full property is now `IReadOnlyDictionary<string, IReadOnlyList<ValidationError>>?`. `AddValidationError` takes a `ValidationError` in place of the removed `ValidationErrorContext` struct, and the `OnValidationError` event and the `required ValidationContext` property were removed from `ValidateContext` ([dotnet/aspnetcore #67549](https://github.com/dotnet/aspnetcore/pull/67549)). `ValidateContext` gains a `ServiceProvider` property so validators can resolve services without going through DataAnnotations' `ValidationContext`.
- **`Microsoft.Extensions.Validation`: abstract `Validatable*Info` moved to source-generation** — `ValidatableTypeInfo`, `ValidatableParameterInfo`, and `ValidatablePropertyInfo` are no longer part of the public API. The validation source generator now emits them as `file` classes in your assembly, and `IValidatableInfoResolver` returns the interface types (`IValidatableTypeInfo`, etc.). Apps that use `[ValidatableType]` and `builder.Services.AddValidation()` are unaffected. Code that constructed these types directly must move to implementing the interfaces or rely on the generator ([dotnet/aspnetcore #67956](https://github.com/dotnet/aspnetcore/pull/67956)). Related: `System.ComponentModel.DataAnnotations.ValidationContext` was removed from the `Microsoft.Extensions.Validation` public API surface ([dotnet/aspnetcore #67549](https://github.com/dotnet/aspnetcore/pull/67549)).
- **`WebApplicationFactory.ConfigureHostApplicationBuilder` renamed to `ConfigureWebApplicationBuilder`** — the protected virtual method on `WebApplicationFactory<TEntryPoint>` was renamed to avoid confusion with `Host.CreateApplicationBuilder`. Rename any override in your test fixtures ([dotnet/aspnetcore #67917](https://github.com/dotnet/aspnetcore/pull/67917)).
- **`UseWebAssemblyDebugging` obsolete, DevServer package deprecated** — `WebAssemblyNetDebugProxyAppBuilderExtensions.UseWebAssemblyDebugging` is now `[Obsolete("ASPDEPR011")]`, and the `Microsoft.AspNetCore.Components.WebAssembly.DevServer` NuGet package is marked deprecated in favor of the new Blazor Gateway host, which ships as the `Microsoft.AspNetCore.Components.Gateway` package and a `Microsoft.AspNetCore.Components.Gateway.Cli` .NET tool ([dotnet/aspnetcore #67990](https://github.com/dotnet/aspnetcore/pull/67990)). The Gateway serves a standalone WebAssembly app with HTTPS redirection, HSTS, health-check endpoints, and telemetry configurable through a `Gateway` configuration section. The Blazor Web App templates no longer call `UseWebAssemblyDebugging` — Visual Studio, VS Code, and `dotnet run` attach the WebAssembly debugger automatically. Remove `app.UseWebAssemblyDebugging()` from your `Program.cs` if you added it manually ([dotnet/aspnetcore #67861](https://github.com/dotnet/aspnetcore/pull/67861), [dotnet/aspnetcore #67862](https://github.com/dotnet/aspnetcore/pull/67862)).
- **`Microsoft.AspNetCore.Grpc.Swagger` package removed** — the OpenAPI-for-gRPC-transcoding package is deleted. Use ASP.NET Core's built-in OpenAPI document generation on the transcoded HTTP endpoints instead ([dotnet/aspnetcore #67919](https://github.com/dotnet/aspnetcore/pull/67919)).
- **`WebAssemblyComponentsOptions` culture toggle is no longer public** — the public `WebAssemblyComponentsOptions.UseCultureFromServer` property and the `AddInteractiveWebAssemblyComponents(builder, Action<WebAssemblyComponentsOptions>?)` overload were removed. Culture persistence is now opt-in through the `Components:UseCultureFromServer` configuration value; the default fall-back is based on whether `AddLocalization()` is registered ([dotnet/aspnetcore #67367](https://github.com/dotnet/aspnetcore/pull/67367)).
- **Null / missing session is handled uniformly** — the Blazor Endpoints session and TempData features used to throw in some code paths, silently return empty in others, and return `null` in a third. Now: if a session is expected but not configured under an active `HttpContext` (static SSR), the framework throws `InvalidOperationException`; when there is no `HttpContext` at all (interactive Server circuit / WebAssembly), the value gracefully yields `null` / empty and logs one warning. Untrusted or corrupt stored data is still swallowed. Static SSR pages that use `[SupplyParameterFromTempData]` or a session-storage TempData provider without registering session middleware will now fail fast instead of silently returning `null` ([dotnet/aspnetcore #67641](https://github.com/dotnet/aspnetcore/pull/67641)).

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
- **Miscellaneous**
  - [Fix url normalizer backslashes](https://github.com/dotnet/aspnetcore/pull/67928)
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
