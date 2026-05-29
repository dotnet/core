# ASP.NET Core in .NET 11 Preview 5 - Release Notes

.NET 11 Preview 5 includes new ASP.NET Core features and improvements:

- [Blazor SSR supports client-side validation](#blazor-ssr-supports-client-side-validation)
- [Blazor supports async form validation](#blazor-supports-async-form-validation)
- [Blazor and Minimal APIs support localized validation errors](#blazor-and-minimal-apis-support-error-localization)
- [QuickGrid works without interactivity](#quickgrid-works-without-interactivity)
- [Blazor WebAssembly preserves server culture](#blazor-webassembly-preserves-server-culture)
- [SupplyParameterFromSession for Blazor](#supplyparameterfromsession-for-blazor)
- [Blazor WebAssembly templates use Gateway](#blazor-webassembly-templates-use-gateway)
- [Kestrel applies trailer header timeouts](#kestrel-applies-trailer-header-timeouts)
- [OpenAPI schemas better match ASP.NET Core behavior](#openapi-schemas-better-match-aspnet-core-behavior)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

ASP.NET Core updates in .NET 11:

- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-11)

<!-- Verified against Microsoft.AspNetCore.App.Ref@11.0.0-preview.5.26276.113, Microsoft.AspNetCore.Components.WebAssembly.Server@11.0.0-preview.5.26276.113, and Microsoft.AspNetCore.Components.QuickGrid@11.0.0-preview.5.26276.113. -->

## Blazor SSR supports client-side validation

Blazor SSR forms now get instant, in-browser validation feedback without a server round-trip, matching the experience provided by interactive Blazor apps and MVC apps with unobtrusive validation ([dotnet/aspnetcore #66441](https://github.com/dotnet/aspnetcore/pull/66441), [dotnet/aspnetcore #66420](https://github.com/dotnet/aspnetcore/pull/66420)). The .NET model remains the single source of truth for validation rules. The server renders metadata for the validation rules which are then enforced by the Blazor JS code on the client-side.

The feature is enabled by default for all SSR forms that include the `DataAnnotationsValidator` component. Both enhanced and non-enhanced forms are supported.

```csharp
<EditForm Model="Model" Enhance FormName="registration" OnValidSubmit="HandleValidSubmit">
    <DataAnnotationsValidator />

    <div>
        <label for="Email">Email</label>
        <InputText @bind-Value="Model.Email" id="Email" />
        <ValidationMessage For="@(() => Model.Email)" />
    </div>

    <div>
        <label for="Password">Password</label>
        <InputText @bind-Value="Model.Password" id="Password" type="password" />
        <ValidationMessage For="@(() => Model.Password)" />
    </div>

    <div>
        <label for="ConfirmPassword">Confirm Password</label>
        <InputText @bind-Value="Model.ConfirmPassword" id="ConfirmPassword" type="password" />
        <ValidationMessage For="@(() => Model.ConfirmPassword)" />
    </div>

    <div>
        <button type="submit" id="submit-btn">Register</button>
    </div>
</EditForm>
```

```csharp
public class RegistrationModel
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 8)]
    public string Password { get; set; }

    [Required]
    [Compare("Password")]
    [Display(Name = "Confirm Password")]
    public string ConfirmPassword { get; set; }
}
```

## Blazor supports async form validation

Blazor forms get support for async validation rules such as database lookups or remote API calls ([dotnet/aspnetcore #66526](https://github.com/dotnet/aspnetcore/pull/66526)). In any rendering mode, `EditForm` submit validation now properly awaits async validators end-to-end. In interactive modes, validator components can register per-field async tasks via `EditContext.AddValidationTask`. The framework tracks them, cancels superseded tasks, and exposes progress status via `IsValidationPending(field)` and `IsValidationFaulted(field)`.

While Preview 5 ships the building blocks for Blazor forms, the full built-in async validation experience will be enabled when the new asynchronous `DataAnnotations` APIs are released in a later Preview. These APIs will be fully supported by the existing `DataAnnotationsValidator` component.

```razor
<EditForm EditContext="editContext" OnSubmit="HandleSubmit">
    <InputText @bind-Value="model.Username" />
    @if (editContext.IsValidationPending(() => model.Username))
    {
        <span>Checking availability...</span>
    }
    <ValidationMessage For="() => model.Username" />
    <button type="submit">Register</button>
</EditForm>

@code {
    [Inject] public UserService Users { get; set; } = default!;

    private readonly RegistrationModel model = new();
    private EditContext editContext = default!;
    private ValidationMessageStore messages = default!;

    protected override void OnInitialized()
    {
        editContext = new EditContext(model);
        messages = new ValidationMessageStore(editContext);
        editContext.OnFieldChanged += (_, e) =>
        {
            if (e.FieldIdentifier.FieldName == nameof(model.Username))
            {
                var cts = new CancellationTokenSource();
                editContext.AddValidationTask(e.FieldIdentifier,
                    CheckAsync(e.FieldIdentifier, model.Username, cts.Token), cts);
            }
        };
    }

    private async Task CheckAsync(FieldIdentifier field, string value, CancellationToken ct)
    {
        messages.Clear(field);
        if (await Users.IsUsernameTakenAsync(value, ct))
        {
            messages.Add(field, "Username is taken.");
        }
        editContext.NotifyValidationStateChanged();
    }

    private async Task HandleSubmit() => await editContext.ValidateAsync();
}
```

## Blazor and Minimal APIs support error localization

Validation of Blazor forms and Minimal API endpoints gets first-class support for localization of error messages and property names ([dotnet/aspnetcore #66646](https://github.com/dotnet/aspnetcore/pull/66646)). By default, localization uses language-specific RESX files deployed as part of the assembly.

```csharp
builder.Services.AddValidation()
    .AddValidationLocalization<ValidationMessages>();
    // Resolves to ValidationMessages.en.resx, ValidationMessages.es.resx, ...
```

```csharp
[ValidatableType]
public class ContactModel
{
    // Values of ErrorMessage are used as localization keys.
    [Required(ErrorMessage = "RequiredError")]
    [EmailAddress(ErrorMessage = "EmailError")]
    [Display(Name = "ContactEmail")]
    public string? Email { get; set; }
}
```

Applications can also register custom `IStringLocalizerFactory` implementations to read the localized strings from other sources such as databases or JSON files. User registered type takes precedence over the default RESX localization.

```csharp
builder.Services.AddValidation()
    .AddValidationLocalization();
builder.Services.AddSingleton<IStringLocalizerFactory, DbStringLocalizerFactory>();
```

Applications can also configure a programmatic strategy for localization, removing the need to specify localization keys on every validation attribute.

```csharp
builder.Services.AddValidation()
    .AddValidationLocalization<ValidationMessages>(options =>
    {
        options.ErrorMessageKeyProvider = ctx =>
            ctx.Attribute.ErrorMessage ?? $"{ctx.Attribute.GetType().Name}_Error";
    });
```

```csharp
[ValidatableType]
public class ContactModel
{
    // Looks-up localized string for 'RequiredAttribute_Error' automatically.
    [Required]
    public string? Username { get; set; }
}
```

## QuickGrid works without interactivity

`QuickGrid` sorting and pagination now work in statically rendered Blazor SSR pages ([dotnet/aspnetcore #65451](https://github.com/dotnet/aspnetcore/pull/65451)). When the grid is not interactive, sortable headers and paginator controls render as enhanced forms that update URL query-string state instead of relying on `@onclick` handlers. Users can sort, page, refresh, and share links without an interactive circuit or WebAssembly runtime.

```razor
@page "/orders"
@using Microsoft.AspNetCore.Components.QuickGrid

<QuickGrid Items="orders.AsQueryable()" Pagination="pagination">
    <PropertyColumn Property="@(order => order.Id)" Sortable="true" />
    <PropertyColumn Property="@(order => order.Customer)" Sortable="true" />
    <PropertyColumn Property="@(order => order.Total)" Sortable="true" />
</QuickGrid>

<Paginator State="pagination" />

@code {
    private readonly PaginationState pagination = new() { ItemsPerPage = 20 };
    private readonly List<Order> orders = OrderRepository.GetOrders();
}
```

## Blazor WebAssembly preserves server culture

Blazor WebAssembly apps prerendered on the server now persist the server's `CurrentCulture` and `CurrentUICulture` into component state and apply them on the client before satellite assemblies load ([dotnet/aspnetcore #63144](https://github.com/dotnet/aspnetcore/pull/63144)). The behavior is enabled by default for interactive WebAssembly components, so a prerendered page and its hydrated client render with the same culture. Apps that need the client to choose culture independently can opt out with `WebAssemblyComponentsOptions.UseCultureFromServer`.

```csharp
builder.Services.AddRazorComponents()
    .AddInteractiveWebAssemblyComponents(options =>
    {
        options.UseCultureFromServer = false;
    });
```

## SupplyParameterFromSession for Blazor

`[SupplyParameterFromSession]` reads and writes HTTP session values directly on Blazor SSR component properties, following the same declarative pattern as `[SupplyParameterFromQuery]` and `[SupplyParameterFromForm]` ([dotnet/aspnetcore #65184](https://github.com/dotnet/aspnetcore/pull/65184)). This keeps session-backed state such as shopping cart IDs or multi-step form progress close to the component that uses it. Values are serialized with `System.Text.Json` and written back before the response is sent.

```csharp
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();
builder.Services.AddRazorComponents();

var app = builder.Build();

app.UseSession();
```

```razor
@page "/checkout"

<p>Current step: @CurrentStep</p>

<EditForm Model="Input" FormName="checkout" OnSubmit="NextStep">
    <button type="submit">Next</button>
</EditForm>

@code {
    [SupplyParameterFromSession(Name = "checkout-step")]
    public int CurrentStep { get; set; }

    private object Input { get; } = new();

    private void NextStep() => CurrentStep++;
}
```

## Blazor WebAssembly templates use Gateway

The standalone Blazor WebAssembly template now uses `Microsoft.AspNetCore.Components.Gateway` instead of the Blazor WebAssembly DevServer package during development ([dotnet/aspnetcore #66729](https://github.com/dotnet/aspnetcore/pull/66729)). The template also uses the SDK's `StaticWebAssetSpaFallbackEnabled` support instead of custom fallback targets. New projects get the Gateway-based development server when they create a Blazor WebAssembly app; existing apps do not need to change.

```bash
dotnet new blazorwasm -o MyBlazorApp
```

## Kestrel applies trailer header timeouts

Kestrel now applies `RequestHeadersTimeout` to fragmented HTTP/2 and HTTP/3 trailer headers that do not finish sending the header block ([dotnet/aspnetcore #66249](https://github.com/dotnet/aspnetcore/pull/66249)). The same timeout that protects initial request headers now also prevents connections from staying open indefinitely while Kestrel waits for trailer `HEADERS` frames to complete.

```csharp
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.RequestHeadersTimeout = TimeSpan.FromSeconds(10);
});
```

## OpenAPI schemas better match ASP.NET Core behavior

OpenAPI generation now handles two schema cases more accurately. Non-body enum parameters keep the original C# enum member names even when HTTP JSON options configure a `JsonStringEnumConverter` naming policy, because query, route, header, and form binding use `Enum.TryParse` rather than JSON serialization ([dotnet/aspnetcore #66228](https://github.com/dotnet/aspnetcore/pull/66228)). Array schema reference IDs now use valid component names such as `stringArray` and `TodoArray` instead of names with array syntax ([dotnet/aspnetcore #66583](https://github.com/dotnet/aspnetcore/pull/66583)).

```csharp
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(
        new JsonStringEnumConverter(JsonNamingPolicy.KebabCaseLower));
});

app.MapGet("/orders", (OrderStatus status) => Results.Ok(status));
```

With this configuration, a body schema can still describe `OrderStatus.PendingReview` as `pending-review`, while the query parameter schema describes the accepted value as `PendingReview`.

Minimal API endpoints can support multiple `Produces<T>()` extension methods for the same status code—for example, to specify that a 200 response may arrive as `application/json` or `text/plain` with different schemas ([dotnet/aspnetcore #65650](https://github.com/dotnet/aspnetcore/pull/65650)). The same support applies to MVC controllers via multiple `[ProducesResponseType]` attributes. In prior releases the framework collapsed each status code to a single response type and silently dropped the rest, making it impossible to describe endpoints that serve multiple content types. ApiExplorer now preserves every declared response type with deterministic ordering, and the generated OpenAPI document emits separate content entries per media type—or an `anyOf` schema when multiple types share the same content type—so generated clients can accurately model every shape an endpoint returns.

Thank you [@marcominerva](https://github.com/marcominerva) for the array schema reference contribution!

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - RenderFragment serialization: enables component-state plumbing for Blazor internals, but the shipped PR in this range did not expose a broad, standalone app-facing workflow.
  - MCP Server template transfer: Preview 4 already documented that the template ships with the SDK, and Preview 5 did not add a meaningful user-facing state change.
  - Runtime-async shared framework compilation: Preview 4 already documented the ASP.NET Core shared-framework runtime-async change.
  - Virtualize AnchorMode and server-initiated circuit pause: Preview 4 already documented these features; Preview 5 contains matching milestone/codeflow entries without new user-facing behavior.
-->

## Bug fixes

- **Blazor**
  - Fixed a crash when an interactive component was rendered from a layout during enhanced navigation ([dotnet/aspnetcore #66007](https://github.com/dotnet/aspnetcore/pull/66007)).
  - Added missing `StringSyntaxAttribute.DateTimeFormat` annotations to `BindConverter` `DateTimeOffset` format overloads, improving editor support for format strings ([dotnet/aspnetcore #66532](https://github.com/dotnet/aspnetcore/pull/66532)).
- **Data Protection and antiforgery**
  - Fixed cold-start thread-pool starvation in `KeyRingProvider` when many callers request data protection keys before a key ring is cached ([dotnet/aspnetcore #66683](https://github.com/dotnet/aspnetcore/pull/66683)).
  - Hardened antiforgery token validation, data protection payload parsing, and span-based protect/unprotect fallback behavior ([dotnet/aspnetcore #66508](https://github.com/dotnet/aspnetcore/pull/66508)).
- **Hosting and observability**
  - Stopped setting the `Activity` status description when a request throws, aligning ASP.NET Core hosting telemetry with OpenTelemetry ASP.NET Core instrumentation behavior ([dotnet/aspnetcore #65825](https://github.com/dotnet/aspnetcore/pull/65825)).
- **Kestrel**
  - Treat HTTP/2 and HTTP/3 messages containing connection-specific header fields as malformed, as required by RFC 9113 and RFC 9114 ([dotnet/aspnetcore #66669](https://github.com/dotnet/aspnetcore/pull/66669)).
  - Close the connection after processing a request that contains both `Content-Length` and `Transfer-Encoding`, as required by RFC 9112 ([dotnet/aspnetcore #66671](https://github.com/dotnet/aspnetcore/pull/66671)).
- **Minimal APIs and Problem Details**
  - Fixed optional non-nullable struct query parameters with `= default` throwing when `RequestDelegateFactory` created the endpoint delegate ([dotnet/aspnetcore #66091](https://github.com/dotnet/aspnetcore/pull/66091)).
  - Preserved `application/problem+json` and `application/problem+xml` as preferred content types when `ProducesAttribute` also specifies a content type ([dotnet/aspnetcore #66461](https://github.com/dotnet/aspnetcore/pull/66461)).
  - Fixed endpoint metadata and fallback validation responses so `ProblemDetails` and `HttpValidationProblemDetails` report the expected content type and 400 status ([dotnet/aspnetcore #66499](https://github.com/dotnet/aspnetcore/pull/66499), [dotnet/aspnetcore #66602](https://github.com/dotnet/aspnetcore/pull/66602)).
- **Security and routing**
  - Escaped LDAP filter values according to RFC 4515 before using them in filter strings ([dotnet/aspnetcore #66436](https://github.com/dotnet/aspnetcore/pull/66436)).
  - Hardened wildcard host matching in `HostMatcherPolicy` ([dotnet/aspnetcore #66582](https://github.com/dotnet/aspnetcore/pull/66582)).

## Community contributors

Thank you contributors! ❤️

- [@EduardF1](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3AEduardF1+milestone%3A11.0-preview5)
- [@marcominerva](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Amarcominerva+milestone%3A11.0-preview5)
- [@martincostello](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Amartincostello+milestone%3A11.0-preview5)
- [@saijayanth41](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3Asaijayanth41+milestone%3A11.0-preview5)
- [@Swapnali911](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+author%3ASwapnali911+milestone%3A11.0-preview5)
