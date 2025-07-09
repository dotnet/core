# ASP.NET Core in .NET 10 Preview 6 - Release Notes

Here's a summary of what's new in ASP.NET Core in this preview release:

- [Automatic eviction from memory pool](#automatic-eviction-from-memory-pool)
- [Blazor WebAssembly preloading](#blazor-webassembly-preloading)
- [Blazor build producing javascript bundler friendly output](#blazor-build-producing-javascript-bundler-friendly-output)
- [Improved form validation for Blazor](#improved-form-validation-for-blazor)
- [`NavigationManager.NotFound()` works after streaming has started](#navigationmanagernotfound-works-after-streaming-has-started)
- [Blazor diagnostics improvements](#blazor-diagnostics-improvements)
- [Blazor Server state persistence](#blazor-server-state-persistence)
- [Disabling `NavigationException` usage is now opt-in](#disabling-navigationexception-usage-is-now-opt-in)
- [Add passkey support to ASP.NET Core Identity](#add-passkey-support-to-aspnet-core-identity)
- [Minimal API validation integration with `IProblemDetailsService`](#minimal-api-validation-integration-with-iproblemdetailsservice)
- [Validation APIs moved to extensions package](#validation-apis-moved-to-extensions-package)

ASP.NET Core updates in .NET 10:

- [What's new in ASP.NET Core in .NET 10](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-10.0) documentation.
- [Breaking changes](https://docs.microsoft.com/dotnet/core/compatibility/10.0#aspnet-core)
- [Roadmap](https://github.com/dotnet/aspnetcore/issues/59443)

## Automatic eviction from memory pool

Memory pools used by Kestrel, IIS, and HTTP.sys now release unused memory when applications are idle, improving resource efficiency.

**Why it matters:**
Previously, pooled memory stayed reserved even when unused. Now memory is automatically returned to the system during idle periods, reducing overall memory usage.

**How to use:**
No action needed. This works automatically.

There are also metrics available for the memory pool under the name `Microsoft.AspNetCore.MemoryPool`. See the [ASP.NET Core metrics documentation](https://learn.microsoft.com/aspnet/core/log-mon/metrics/metrics) for more information.

You can create custom memory pools using the new `IMemoryPoolFactory` service interface:

```csharp
public class MyBackgroundService : BackgroundService
{
    private readonly MemoryPool<byte> _memoryPool;

    public MyBackgroundService(IMemoryPoolFactory<byte> factory)
    {
        _memoryPool = factory.Create();
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await Task.Delay(20, stoppingToken);
                // do work that needs memory
                var rented = _memoryPool.Rent(100);
                rented.Dispose();
            }
            catch (OperationCanceledException)
            {
                return;
            }
        }
    }
}
```

To replace the default memory pool with a custom implementation:

```csharp
services.AddSingleton<IMemoryPoolFactory<byte>, CustomMemoryPoolFactory>();

public class CustomMemoryPoolFactory : IMemoryPoolFactory<byte>
{
    public MemoryPool<byte> Create()
    {
        return MemoryPool<byte>.Shared; // or custom implementation
    }
}
```

## Blazor WebAssembly preloading

Blazor now provides a `<LinkPreload />` component that generates `link` tags for preloading framework assets instead of using link headers. This gives better control over preloading behavior and correctly identifies the application's base URL.

To enable preloading, add the `<LinkPreload />` component to your application's head:

```diff
<head>
  <base href="/" />
+  <LinkPreload />
  ...
</head>
```

Remove the component to disable preloading, which is useful when using the `loadBootResource` callback to modify URLs.

## Blazor build producing javascript bundler friendly output

Make Blazor WebAssembly compatible with JavaScript bundlers like webpack or rollup by setting the `WasmBundlerFriendlyBootConfig` property to `true`.

```xml
<PropertyGroup>
    <WasmBundlerFriendlyBootConfig>true</WasmBundlerFriendlyBootConfig>
</PropertyGroup>
```

This adjusts the boot configuration to use import statements for framework assets that JavaScript bundlers can then use to correctly identify related files. The build output won't be directly runnable in the browser; post processing by JavaScript tools is expected.

## Improved form validation for Blazor

Blazor now supports validating nested objects and collection items in forms.

To use this feature:

1. Call `AddValidation()` in your application setup
2. Create model types in .cs files (not .razor files)
3. Add the `[ValidatableType]` attribute to your root model type

Without these steps, validation works the same as before (top-level only).

**Note:** The `[ValidatableType]` attribute is experimental and causes a build error. Suppress the diagnostic to use this feature.

Example:

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorComponents();
builder.Services.AddValidation(); // Enable new validation behavior
```

```csharp
// Data/OrderModel.cs

#pragma warning disable ASP0029 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
[ValidatableType]
#pragma warning restore ASP0029 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.

public class OrderModel
{
    public CustomerModel CustomerDetails { get; set; } = new CustomerModel();
    public List<OrderItemModel> OrderItems { get; set; } = new List<OrderItemModel>();
}

public class CustomerModel
{
    [Required(ErrorMessage = "Name is required.")]
    public string? FullName { get; set; }

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    public string? Email { get; set; }

    public AddressModel ShippingAddress { get; set; } = new AddressModel();
}
```

```razor
@* Pages/Order.razor *@

<EditForm Model="@order">
    <DataAnnotationsValidator />

    <h4>Customer Details</h4>
    <div class="mb-3">
        <label for="customerFullName">Full Name</label>
        <InputText id="customerFullName" @bind-Value="order.CustomerDetails.FullName" />
        <ValidationMessage For="@(() => order.CustomerDetails.FullName)" />
    </div>
    <!-- Additional form fields -->
</EditForm>

@code {
    private OrderModel order = new OrderModel();
}
```

Model types must be in .cs files because validation uses source generators, and one source generator's output can't be input for another.

## `NavigationManager.NotFound()` works after streaming has started

`NavigationManager.NotFound()` now works even after response streaming begins, enabling better error handling when content has already started streaming but a not found condition occurs later.

## Blazor diagnostics improvements

Blazor Server traces are now top-level activities instead of being nested under HTTP or SignalR activities. This simplifies viewing traces in diagnostic tools like the .NET Aspire dashboard or Application Insights.

The `CircuitStart` trace moved to a separate `Microsoft.AspNetCore.Components.Server.Circuits` source.

To configure the new trace source:

```diff
builder.Services.ConfigureOpenTelemetryTracerProvider(tracerProvider =>
{
    tracerProvider.AddSource("Microsoft.AspNetCore.Components");
+   tracerProvider.AddSource("Microsoft.AspNetCore.Components.Server.Circuits");
});
```

## Blazor Server state persistence

Blazor Server apps now persist declared circuit state before evicting circuits from memory. When clients reconnect after extended periods, apps can restore circuit state, letting users resume their work uninterrupted.

**Why it matters:**
Previously, circuit eviction meant losing all client state. Users had to restart, losing progress and creating poor experiences. State persistence maintains continuity even when circuits are temporarily removed from memory.

**How it works:**
Circuit state persists in memory or using `HybridCache` if configured. Only declared state is persisted.

You can implement custom policies using the new `Blazor.pause()` and `Blazor.resume()` JavaScript APIs. These control when circuits pause and resume based on your needs. For example, pause when idle, during server restarts, or when browser tabs aren't visible. Paused circuits persist to the client, freeing server resources.

Example - pause the app when hidden and resume when visible to save server resources:

```javascript
// Pause when tab becomes hidden, resume when visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        Blazor.pause();
    } else {
        Blazor.resume();
    }
});
```

## Disabling `NavigationException` usage is now opt-in

To improve backwards compatibility, disabling `NavigationException` for Blazor page navigations is now opt-in. The configuration switch was renamed with an updated default value:

```diff
- "Microsoft.AspNetCore.Components.Endpoints.NavigationManager.EnableThrowNavigationException", default value: false
+ "Microsoft.AspNetCore.Components.Endpoints.NavigationManager.DisableThrowNavigationException", default value: true
```

The Blazor Web App template disables `NavigationException` usage for more consistent navigation behavior across render modes.

## Add passkey support to ASP.NET Core Identity

ASP.NET Core Identity now supports passkey authentication based on WebAuthn and FIDO2 standards. Passkeys provide a modern, phishing-resistant authentication method using public key cryptography and device-based authentication, allowing users to sign in without passwords using biometrics or security keys.

The Blazor Web App template includes built-in passkey management and login functionality.

Developers can use new APIs to add passkey authentication to existing applications.

## Minimal API validation integration with `IProblemDetailsService`

Minimal API validation error responses can now be customized using an `IProblemDetailsService` implementation in the services collection (DI container). This enables more consistent and user-specific error responses.

Community contribution from [@marcominerva](https://github.com/marcominerva). Thank you!

## Validation APIs moved to extensions package

The validation APIs moved to the `Microsoft.Extensions.Validation` namespace and NuGet package, making them usable outside ASP.NET Core scenarios. The public APIs and behavior remain the same, just under a new package and namespace. Existing projects should work without code changes as old references redirect to the new implementation. The APIs are marked as experimental and subject to future changes.

## Contributors

Thank you contributors! ❤️

- [BrendanRidenour](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview6+author%3ABrendanRidenour)
- [jzabroski](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview6+author%3Ajzabroski)
- [marcominerva](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview6+author%3Amarcominerva)
- [martincostello](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview6+author%3Amartincostello)
- [saitama951](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview6+author%3Asaitama951)
- [timdeschryver](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview6+author%3Atimdeschryver)
- [tmds](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview6+author%3Atmds)
- [v-wuzhai](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview6+author%3Av-wuzhai)
