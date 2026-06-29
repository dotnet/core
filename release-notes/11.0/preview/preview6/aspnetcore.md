<!-- Verified against Microsoft.AspNetCore.App.Ref@11.0.0-preview.6.26328.106 and Microsoft.NETCore.App.Ref@11.0.0-preview.6.26328.106 -->
# ASP.NET Core in .NET 11 Preview 6 - Release Notes

.NET 11 Preview 6 includes new ASP.NET Core features and improvements:

- [Minimal API validation runs async validators](#minimal-api-validation-runs-async-validators)
- [Blazor Virtualize can scroll to an item](#blazor-virtualize-can-scroll-to-an-item)
- [OpenAPI documents default to 3.2 and describe union types](#openapi-documents-default-to-32-and-describe-union-types)
- [Short-circuit endpoints with an attribute](#short-circuit-endpoints-with-an-attribute)
- [SignalR refreshes authentication on long-lived connections](#signalr-refreshes-authentication-on-long-lived-connections)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

ASP.NET Core updates in .NET 11:

- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-11)

## Minimal API validation runs async validators

Minimal API validation now supports asynchronous validators end-to-end ([dotnet/aspnetcore #66487](https://github.com/dotnet/aspnetcore/pull/66487), [dotnet/aspnetcore #67183](https://github.com/dotnet/aspnetcore/pull/67183)). Preview 5 shipped the building blocks for asynchronous form validation in Blazor. Preview 6 adds the new asynchronous `DataAnnotations` APIs in the base libraries — `AsyncValidationAttribute`, `IAsyncValidatableObject`, and `Validator.ValidateObjectAsync` — and `Microsoft.Extensions.Validation` now runs them when an endpoint validates a request.

This lets a validation rule do real work, such as a database lookup or a remote API call, without blocking a thread. A model implements `IAsyncValidatableObject` and returns validation results as an `IAsyncEnumerable<ValidationResult>`. Because `IAsyncValidatableObject` extends `IValidatableObject`, also implement the synchronous `Validate` method (return no results when all the validation is asynchronous):

```csharp
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

public class ReservationRequest : IAsyncValidatableObject
{
    [Required]
    public string Email { get; set; } = "";

    public DateOnly Date { get; set; }

    // IValidatableObject (synchronous) — no synchronous rules here.
    public IEnumerable<ValidationResult> Validate(ValidationContext context) => [];

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

## OpenAPI documents default to 3.2 and describe union types

Generated OpenAPI documents now target OpenAPI 3.2 by default ([dotnet/aspnetcore #67097](https://github.com/dotnet/aspnetcore/pull/67097), [dotnet/aspnetcore #67007](https://github.com/dotnet/aspnetcore/pull/67007)). Endpoints that return C# union types are now described with an `anyOf` schema listing each case type ([dotnet/aspnetcore #67001](https://github.com/dotnet/aspnetcore/pull/67001)). Unlike polymorphic types, union cases don't carry a `$type` discriminator, so a case schema such as `Kitten` reuses the standalone `#/components/schemas/Kitten` component instead of producing a duplicated, prefixed component. ApiExplorer detects a union through `JsonTypeInfoKind.Union` on the parent type, so the same metadata flows through to MVC controllers, minimal APIs, and external consumers such as Swashbuckle and NSwag.

This builds on the Preview 5 support for declaring multiple response types per status code, so an endpoint that returns one of several shapes is now described accurately in the document.

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

## SignalR refreshes authentication on long-lived connections

SignalR connections can now refresh authentication without dropping the connection when the access token expires ([dotnet/aspnetcore #67400](https://github.com/dotnet/aspnetcore/pull/67400)). The server exposes a `/refresh` endpoint alongside `/negotiate` and reports the token lifetime in the negotiate response. The .NET client automatically re-authenticates before the token expires, so a hub connection that previously closed when its bearer token aged out can stay open.

Enable the feature when mapping the hub:

```csharp
app.MapHub<ChatHub>("/chat", options =>
{
    options.EnableAuthenticationRefresh = true;
});
```

A hub can react to a refreshed identity by overriding `OnAuthenticationRefreshedAsync`, and the server can customize the refresh decision with `HttpConnectionDispatcherOptions.OnAuthenticationRefresh`:

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

## Breaking changes

- **Custom minimal API validation resolvers** — `Microsoft.Extensions.Validation.IValidatableInfo` was split into `IValidatableTypeInfo`, `IValidatableParameterInfo`, and `IValidatablePropertyInfo`, and `ValidateContext.ValidationErrors` is now a read-only dictionary that you add to with the new `ValidateContext.AddValidationError` method ([dotnet/aspnetcore #67183](https://github.com/dotnet/aspnetcore/pull/67183)). Apps that use the built-in `[ValidatableType]` and `AddValidation()` are unaffected; only code that implements `IValidatableInfoResolver` directly needs to update.
- **Antiforgery and cross-origin CSRF share one verdict** — `CsrfProtectionMiddleware` no longer short-circuits a cross-origin request. It records its verdict on `IAntiforgeryValidationFeature`, and the request is rejected only when a component actually reads the form ([dotnet/aspnetcore #67082](https://github.com/dotnet/aspnetcore/pull/67082)). Apps that call `UseAntiforgery()` see no change. This unifies token antiforgery and cross-origin CSRF behind a single, lazily enforced verdict.

## Bug fixes

- **OpenAPI**
  - Honored `DescriptionAttribute` on nullable value types during schema generation ([dotnet/aspnetcore #65245](https://github.com/dotnet/aspnetcore/pull/65245)).
  - Fixed duplicate XML documentation IDs for generic properties and references ([dotnet/aspnetcore #64404](https://github.com/dotnet/aspnetcore/pull/64404)).
  - Propagated `JsonSerializerOptions` correctly during OpenAPI generation ([dotnet/aspnetcore #66847](https://github.com/dotnet/aspnetcore/pull/66847)).
- **Caching**
  - Added the key sub-delimiter between multi-value `Vary` header values in response and output caching ([dotnet/aspnetcore #66936](https://github.com/dotnet/aspnetcore/pull/66936)).
- **Metrics**
  - Fixed the default value of `System.Diagnostics.Metrics.Meter.IsSupported` ([dotnet/aspnetcore #66846](https://github.com/dotnet/aspnetcore/pull/66846)).

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
