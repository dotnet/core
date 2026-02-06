# ASP.NET Core in .NET 11 Preview 1 - Release Notes

Here's a summary of what's new in ASP.NET Core in this preview release:

- [EnvironmentBoundary component](#environmentboundary-component)
- [Label component for forms](#label-component-for-forms)
- [DisplayName component](#displayname-component)
- [QuickGrid `OnRowClick` event](#quickgrid-onrowclick-event)
- [RenderFragment contravariance](#renderfragment-contravariance)
- [Relative navigation with `RelativeToCurrentUri`](#relative-navigation-with-relativetocurrenturi)
- [`GetUriWithHash()` extension method](#geturiwithhash-extension-method)
- [BasePath component](#basepath-component)
- [MathML namespace support](#mathml-namespace-support)
- [InputFile cancel event](#inputfile-cancel-event)
- [BL0010 analyzer for JSInterop](#bl0010-analyzer-for-jsinterop)
- [`IComponentPropertyActivator` for custom property injection](#icomponentpropertyactivator-for-custom-property-injection)
- [SignalR `ConfigureConnection` method](#signalr-configureconnection-method)
- [Improved Blazor reconnection experience](#improved-blazor-reconnection-experience)
- [`IHostedService` support in Blazor WebAssembly](#ihostedservice-support-in-blazor-webassembly)
- [Environment variables in Blazor WebAssembly configuration](#environment-variables-in-blazor-webassembly-configuration)
- [Opt-in metrics and tracing for Blazor WebAssembly](#opt-in-metrics-and-tracing-for-blazor-webassembly)
- [Docker support in Blazor WebAssembly template](#docker-support-in-blazor-webassembly-template)
- [FileContentResult support in OpenAPI](#filecontentresult-support-in-openapi)
- [`IOutputCachePolicyProvider` for custom output caching](#ioutputcachepolicyprovider-for-custom-output-caching)
- [`TimeProvider` in ASP.NET Core Identity](#timeprovider-in-aspnet-core-identity)
- [Auto-trust development certificates in WSL](#auto-trust-development-certificates-in-wsl)

ASP.NET Core updates in .NET 11 Preview 1:

- [Release notes](aspnetcore.md)
- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-11.0) documentation.
- [Breaking changes](https://learn.microsoft.com/dotnet/core/compatibility/11.0#aspnet-core)
- [Roadmap](https://github.com/dotnet/aspnetcore/issues/59443)

.NET 11 Preview 1:

- [Discussion](https://aka.ms/dotnet/11/preview1)
- [Release notes](README.md)

## EnvironmentBoundary component

Blazor now includes a built-in `EnvironmentBoundary` component for conditional rendering based on the hosting environment. This component is similar to the MVC environment tag helper and provides a consistent way to render content based on the current environment across both server and WebAssembly hosting models.

The `EnvironmentBoundary` component accepts `Include` and `Exclude` parameters for specifying environment names. The component performs case-insensitive matching and follows the same semantics as the MVC `EnvironmentTagHelper`.

```razor
@using Microsoft.AspNetCore.Components.Web

<EnvironmentBoundary Include="Development">
    <div class="alert alert-warning">
        Debug mode enabled
    </div>
</EnvironmentBoundary>

<EnvironmentBoundary Include="Development,Staging">
    <p>Pre-production environment</p>
</EnvironmentBoundary>

<EnvironmentBoundary Exclude="Production">
    <p>@DateTime.Now</p>
</EnvironmentBoundary>
```

The component works consistently in both Blazor Server and Blazor WebAssembly scenarios by injecting `IHostEnvironment`, eliminating the need for manual environment checks and conditional logic.

## Label component for forms

A new `Label` component has been added to Blazor forms that renders accessible labels with support for both nested and non-nested patterns. The component automatically extracts display names from `[Display]` or `[DisplayName]` attributes, falling back to the property name if no attributes are present.

The `Label` component supports two common label-input association patterns:

**Nested pattern** (implicit association):

```razor
<Label For="() => model.Name">
    <InputText @bind-Value="model.Name" />
</Label>
```

Renders:

```html
<label>
    Name
    <input value="..." />
</label>
```

**Non-nested pattern** (for/id association):

```razor
<Label For="() => model.Name" />
<InputText @bind-Value="model.Name" />
```

Renders:

```html
<label for="Name">Name</label>
<input id="Name" value="..." />
```

The component works seamlessly with existing form validation and all built-in input components, which now automatically generate `id` attributes.

## DisplayName component

The new `DisplayName` component provides a way to display property names from metadata attributes in Blazor applications, bringing feature parity with MVC's `@Html.DisplayNameFor()` helper. This component reads display names from `[Display]` and `[DisplayName]` attributes with proper localization support.

```razor
@using Microsoft.AspNetCore.Components.Forms

<EditForm Model="product">
    <div class="form-group">
        <label>
            <DisplayName For="() => product.Name" />
            <InputText @bind-Value="product.Name" />
        </label>
    </div>
</EditForm>
```

The component is particularly useful for table headers:

```razor
<table>
    <thead>
        <tr>
            <th><DisplayName For="() => product.Name" /></th>
            <th><DisplayName For="() => product.Price" /></th>
            <th><DisplayName For="() => product.ReleaseDate" /></th>
        </tr>
    </thead>
</table>
```

The `DisplayName` component checks for `DisplayAttribute.Name` first, then falls back to `DisplayNameAttribute.DisplayName`, and finally uses the property name itself if no attributes are present. This eliminates hardcoded label text and makes localization easier.

## QuickGrid `OnRowClick` event

The `QuickGrid` component now supports row click events through the new `OnRowClick` parameter. When set, the grid automatically applies appropriate styling (cursor pointer) and invokes the callback with the clicked item.

```razor
<QuickGrid Items="@people" OnRowClick="@HandleRowClick">
    <PropertyColumn Property="@(p => p.Name)" />
    <PropertyColumn Property="@(p => p.Email)" />
</QuickGrid>

@code {
    void HandleRowClick(Person person)
    {
        NavigationManager.NavigateTo($"/person/{person.Id}");
    }
}
```

The feature includes built-in CSS styling that applies a pointer cursor to clickable rows through the `row-clickable` CSS class, providing clear visual feedback to users.

## RenderFragment contravariance

The `TValue` type parameter in `RenderFragment<TValue>` is now marked as contravariant with the `in` modifier. This enables passing render fragments that accept base types where derived types are expected, eliminating the need for complex reflection-based adapters in generic component composition.

```csharp
// Before: Invariant delegate blocked this
public delegate RenderFragment RenderFragment<TValue>(TValue value);

// After: Contravariance enabled
public delegate RenderFragment RenderFragment<in TValue>(TValue value);
```

This change enables more flexible component composition:

```csharp
// Non-generic fragment handling base type
RenderFragment<IList> baseTemplate = (IList items) => builder => 
{
    foreach (var item in items)
    {
        // Render item
    }
};

// Can now be assigned where specific type is expected
RenderFragment<List<Product>> specificTemplate = baseTemplate; // ✅ Works with contravariance

// DynamicComponent scenario now works directly
var parameters = new Dictionary<string, object>
{
    ["ItemsTemplate"] = baseTemplate, // ✅ No adapter needed
};
```

Note that C# variance only works with reference types due to CLR limitations. Value types (structs, enums, primitives) do not support variance.

## Relative navigation with `RelativeToCurrentUri`

Blazor's `NavigationManager.NavigateTo()` and `NavLink` component now support relative URI navigation through the new `RelativeToCurrentUri` parameter. This enables navigation to URIs relative to the current page path rather than the application's base URI.

**NavigationManager:**

```csharp
// Navigate to a sibling page
NavigationManager.NavigateTo("details.html", new NavigationOptions 
{ 
    RelativeToCurrentUri = true 
});
```

**NavLink:**

```razor
<NavLink href="details.html" RelativeToCurrentUri="true">
    View Details
</NavLink>
```

When you're at `/docs/getting-started/installation.html` and navigate to `configuration.html` with `RelativeToCurrentUri = true`, you'll navigate to `/docs/getting-started/configuration.html` instead of `/configuration.html`. This is particularly useful for nested folder structures like documentation sites or file explorers.

## `GetUriWithHash()` extension method

A new `GetUriWithHash()` extension method has been added to `NavigationManager` for easily constructing URIs with hash fragments. This helper method provides an efficient, zero-allocation way to append hash fragments to the current URI.

```csharp
@inject NavigationManager Navigation

<a href="@Navigation.GetUriWithHash("section-1")">
    Jump to Section 1
</a>

@code {
    void NavigateToSection(string sectionId)
    {
        var uri = Navigation.GetUriWithHash(sectionId);
        Navigation.NavigateTo(uri);
    }
}
```

The method uses `string.Create` for optimal performance and works correctly with non-root base URIs (e.g., when using `<base href="/app/">`).

## BasePath component

Blazor Web applications can now use the `BasePath` component instead of manually specifying `<base href="">` in the HTML. This component automatically renders the correct base path based on the current request, making it easier to host apps under subpaths.

```razor
@using Microsoft.AspNetCore.Components.Endpoints

<!DOCTYPE html>
<html>
<head>
    <BasePath />
    <link rel="stylesheet" href="css/app.css" />
</head>
<body>
    @RenderBody()
</body>
</html>
```

The component resolves the href from `NavigationManager.BaseUri` at runtime and falls back to `/` if the base URI cannot be parsed. This provides a first-class, framework-supported solution for apps hosted at paths like `/dashboard` or `/app`, eliminating the need for manual `<base>` element management or JavaScript workarounds.

Note: Standalone Blazor WebAssembly apps should continue using the static `<base href="/" />` element.

## MathML namespace support

Blazor now properly supports MathML elements in interactive rendering. MathML elements like `<math>`, `<mrow>`, `<mi>`, and `<mn>` are now created with the correct namespace (`http://www.w3.org/1998/Math/MathML`) using `document.createElementNS()`, similar to how SVG elements are handled.

```razor
<math>
    <mrow>
        <mi>x</mi>
        <mo>=</mo>
        <mfrac>
            <mrow>
                <mo>−</mo>
                <mi>b</mi>
                <mo>±</mo>
                <msqrt>
                    <mrow>
                        <msup><mi>b</mi><mn>2</mn></msup>
                        <mo>−</mo>
                        <mn>4</mn>
                        <mi>a</mi>
                        <mi>c</mi>
                    </mrow>
                </msqrt>
            </mrow>
            <mrow>
                <mn>2</mn>
                <mi>a</mi>
            </mrow>
        </mfrac>
    </mrow>
</math>
```

This fix ensures that MathML content renders correctly in browsers when added dynamically through Blazor's renderer, resolving issues where MathML elements were previously being created as regular HTML elements without the proper namespace.

## InputFile cancel event

The `InputFile` component now supports detecting when file selection is canceled through the new `OnCancel` event callback. This event fires when a user opens the file picker but dismisses it without selecting any files.

```razor
<InputFile OnChange="@HandleFileSelected" OnCancel="@HandleCanceled" />

@if (isCanceled)
{
    <p>File selection was canceled.</p>
}

@code {
    bool isCanceled;

    void HandleFileSelected(InputFileChangeEventArgs e)
    {
        isCanceled = false;
        // Handle selected files
    }

    void HandleCanceled()
    {
        isCanceled = true;
    }
}
```

This enables better UX by allowing developers to provide feedback or clear loading states when users cancel file selection.

## BL0010 analyzer for JSInterop

A new Blazor analyzer (BL0010) has been added that recommends using `InvokeVoidAsync` instead of `InvokeAsync<object>` when calling JavaScript functions that don't return values. This analyzer helps developers write more efficient JSInterop code.

**Problematic code:**

```csharp
// ⚠️ BL0010: Use InvokeVoidAsync for JavaScript functions that don't return a value
await JSRuntime.InvokeAsync<object>("console.log", "Hello");
```

**Recommended code:**

```csharp
// ✅ Correct: Use InvokeVoidAsync
await JSRuntime.InvokeVoidAsync("console.log", "Hello");
```

The analyzer helps catch performance issues where `InvokeAsync` is unnecessarily used with `object` or ignored return values, guiding developers toward the more appropriate `InvokeVoidAsync` method.

## `IComponentPropertyActivator` for custom property injection

Blazor now provides a new `IComponentPropertyActivator` interface for customizing property injection in components. This public abstraction enables advanced scenarios like custom DI containers, Blazor Hybrid scenarios, or specialized property resolution logic.

```csharp
public interface IComponentPropertyActivator
{
    Action<IServiceProvider, object> GetActivator(
        [DynamicallyAccessedMembers(Component)] Type componentType);
}
```

**Usage:**

```csharp
public class CustomPropertyActivator : IComponentPropertyActivator
{
    public Action<IServiceProvider, object> GetActivator(Type componentType)
    {
        return (serviceProvider, component) =>
        {
            // Custom property injection logic
            // Access component properties and inject dependencies
        };
    }
}

// Registration
services.AddSingleton<IComponentPropertyActivator, CustomPropertyActivator>();
```

The interface follows the same pattern as MVC's property activators and integrates with Hot Reload for cache invalidation. The default implementation supports keyed services via `[Inject(Key = "...")]` and includes proper trimming annotations for AOT compatibility.

## SignalR `ConfigureConnection` method

SignalR clients can now configure connection settings using the new `ConfigureConnection` method before the connection starts. This provides a way to customize connection behavior after the builder has been configured but before connection establishment.

```csharp
builder.Services.AddBlazorHub(options =>
{
    options.ConfigureConnection = connection =>
    {
        connection.ServerTimeout = TimeSpan.FromSeconds(60);
        connection.KeepAliveInterval = TimeSpan.FromSeconds(15);
        connection.HandshakeTimeout = TimeSpan.FromSeconds(30);
    };
});
```

This method complements the existing configuration options and enables more advanced connection setup scenarios where you need to configure the connection object directly.

## Improved Blazor reconnection experience

The Blazor reconnection experience has been enhanced to provide better feedback and more reliable reconnection behavior. The improvements include better handling of transient network issues and clearer visual feedback during reconnection attempts.

The enhanced reconnection logic provides:

- More intelligent retry strategies
- Better handling of edge cases during reconnection
- Improved visual feedback through the reconnection UI
- Reduced false-positive disconnection notifications

These improvements make Blazor applications more resilient to temporary network interruptions and provide a smoother user experience during connectivity issues.

## `IHostedService` support in Blazor WebAssembly

Blazor WebAssembly now supports `IHostedService` for running background services in the browser. This brings feature parity with Blazor Server and enables scenarios like periodic data refresh, real-time updates, or background processing.

```csharp
public class DataRefreshService : IHostedService
{
    private Timer? _timer;
    
    public Task StartAsync(CancellationToken cancellationToken)
    {
        _timer = new Timer(RefreshData, null, TimeSpan.Zero, TimeSpan.FromMinutes(5));
        return Task.CompletedTask;
    }

    private void RefreshData(object? state)
    {
        // Refresh data periodically
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _timer?.Dispose();
        return Task.CompletedTask;
    }
}

// Registration
builder.Services.AddHostedService<DataRefreshService>();
```

Hosted services are started when the application starts and stopped when it shuts down, providing a clean lifecycle for background operations in WebAssembly applications.

## Environment variables in Blazor WebAssembly configuration

Blazor WebAssembly applications can now access environment variables through `IConfiguration`. This enables runtime configuration without rebuilding the application, making it easier to deploy the same build to different environments.

```csharp
var builder = WebAssemblyHostBuilder.CreateDefault(args);

// Environment variables are automatically included in configuration
var apiEndpoint = builder.Configuration["API_ENDPOINT"];
var featureFlag = builder.Configuration["ENABLE_FEATURE_X"];
```

Environment variables are loaded into the configuration system alongside other configuration sources like `appsettings.json`, providing a unified way to access configuration values regardless of their source.

## Opt-in metrics and tracing for Blazor WebAssembly

Blazor WebAssembly now supports opt-in metrics and distributed tracing through OpenTelemetry. This enables monitoring and observability for WebAssembly applications, providing insights into client-side performance and behavior.

```csharp
builder.Services.AddOpenTelemetry()
    .WithMetrics(metrics =>
    {
        metrics.AddBlazorWebAssemblyInstrumentation();
    })
    .WithTracing(tracing =>
    {
        tracing.AddBlazorWebAssemblyInstrumentation();
    });
```

Applications can export telemetry data to observability platforms for analysis, helping developers understand client-side performance characteristics and diagnose issues in production.

## Docker support in Blazor WebAssembly template

The Blazor WebAssembly project template now includes Docker support out of the box. New projects include a Dockerfile and .dockerignore file configured for optimal container deployment.

The generated Dockerfile:

- Uses multi-stage builds for optimized image size
- Includes proper caching for NuGet packages and build artifacts
- Configures the app to run in a production-ready container

```bash
# Build and run with Docker
docker build -t myblazorapp .
docker run -p 8080:8080 myblazorapp
```

This makes it easier to containerize Blazor WebAssembly applications and deploy them to container orchestration platforms like Kubernetes or Azure Container Apps.

## FileContentResult support in OpenAPI

OpenAPI document generation now properly supports `FileContentResult` and `FileStreamResult` return types. The generated OpenAPI documents correctly represent file download endpoints with appropriate content types and response schemas.

```csharp
[HttpGet("download")]
[ProducesResponseType<FileContentResult>(StatusCodes.Status200OK, "application/pdf")]
public IActionResult DownloadPdf()
{
    var fileBytes = GeneratePdf();
    return File(fileBytes, "application/pdf", "document.pdf");
}
```

The generated OpenAPI document will include the correct media type and response schema, making it easier for API consumers to understand file download endpoints.

## `IOutputCachePolicyProvider` for custom output caching

ASP.NET Core now provides `IOutputCachePolicyProvider` for implementing custom output caching policy selection logic. This interface enables advanced scenarios where caching policies need to be determined dynamically based on request context or other runtime factors.

```csharp
public interface IOutputCachePolicyProvider
{
    ValueTask<IOutputCachePolicy?> GetPolicyAsync(
        HttpContext context,
        string? policyName);
}
```

**Usage:**

```csharp
public class CustomOutputCachePolicyProvider : IOutputCachePolicyProvider
{
    public ValueTask<IOutputCachePolicy?> GetPolicyAsync(
        HttpContext context,
        string? policyName)
    {
        // Custom logic to select caching policy
        if (context.User.IsInRole("Premium"))
        {
            return new ValueTask<IOutputCachePolicy?>(premiumPolicy);
        }
        return new ValueTask<IOutputCachePolicy?>(standardPolicy);
    }
}

// Registration
services.AddSingleton<IOutputCachePolicyProvider, CustomOutputCachePolicyProvider>();
```

This interface provides extensibility for output caching and enables integration with custom policy management systems.

## `TimeProvider` in ASP.NET Core Identity

ASP.NET Core Identity now uses `TimeProvider` instead of `DateTime` and `DateTimeOffset` for all time-related operations. This makes Identity components more testable and enables better control over time in tests and specialized scenarios.

```csharp
// In tests
var fakeTimeProvider = new FakeTimeProvider(
    new DateTimeOffset(2024, 1, 1, 0, 0, 0, TimeSpan.Zero));

services.AddSingleton<TimeProvider>(fakeTimeProvider);
services.AddIdentity<IdentityUser, IdentityRole>();

// Identity will now use the fake time provider
```

Using `TimeProvider` makes it easier to write deterministic tests for time-sensitive Identity features like token expiration, lockout durations, and security stamp validation.

## Auto-trust development certificates in WSL

The development certificate setup now automatically trusts certificates in WSL (Windows Subsystem for Linux) environments. When running `dotnet dev-certs https --trust` in WSL, the certificate is automatically installed and trusted in both the WSL environment and Windows, eliminating manual trust configuration.

```bash
# Automatically trusts certificates in both WSL and Windows
dotnet dev-certs https --trust
```

This improvement streamlines the development experience when using WSL, removing a common friction point for developers working in Linux environments on Windows.

## Community contributors

Thank you contributors! ❤️

- [@Anchels](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3AAnchels)
- [@JoshuaCooper](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3AJoshuaCooper)
- [@Kahbazi](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3AKahbazi)
- [@StickFun](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3AStickFun)
- [@abatishchev](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3Aabatishchev)
- [@benhopkinstech](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3Abenhopkinstech)
- [@campersau](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3Acampersau)
- [@claudiogodoy99](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3Aclaudiogodoy99)
- [@daniloneto](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3Adaniloneto)
- [@desjoerd](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3Adesjoerd)
- [@divyeshio](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3Adivyeshio)
- [@feherzsolt](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3Afeherzsolt)
- [@fkucukkara](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3Afkucukkara)
- [@lqlive](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3Alqlive)
- [@manandre](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3Amanandre)
- [@marcominerva](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3Amarcominerva)
- [@medhatiwari](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3Amedhatiwari)
- [@voroninp](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3Avoroninp)
- [@xC0dex](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview1+author%3AxC0dex)
