# ASP.NET Core in .NET 10 Preview 6 - Release Notes

Here's a summary of what's new in ASP.NET Core in this preview release:

- [Automatic eviction from memory pool](#automatic-eviction-from-memory-pool)
- [Blazor WebAssembly preloading](#blazor-webassembly-preloading)
- [Blazor build producing javascript bundler friendly output](#blazor-build-producing-javascript-bundler-friendly-output)
- [Improved form validation for Blazor](#improved-form-validation-for-blazor)
- [NotFound works with streaming that has started](#notfound-works-with-streaming-that-has-started)
- [Blazor diagnostics improvements](#blazor-diagnostics-improvements)
- [NavigationException switch behavior change](#navigationexception-switch-behavior-change)
- [Add passkey support to ASP.NET Core Identity](#add-passkey-support-to-aspnet-core-identity)
- [Minimal API Validation integration with IProblemDetailsService](#minimal-api-validation-integration-with-iproblemdetailsservice)
- [Unified validation APIs moved to extensions package](#unified-validation-apis-moved-to-extensions-package)

ASP.NET Core updates in .NET 10:

- [What's new in ASP.NET Core in .NET 10](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-10.0) documentation.
- [Breaking changes](https://docs.microsoft.com/dotnet/core/compatibility/10.0#aspnet-core)
- [Roadmap](https://github.com/dotnet/aspnetcore/issues/59443)

## Automatic eviction from memory pool

The memory pools used by Kestrel, IIS, and HTTP.sys now automatically evict memory blocks when the application is idle or under less load, helping applications use resources more efficiently.

**Why it matters:**
Previously, memory allocated by the pool would remain reserved, even when not in use. With this enhancement, when the app is idle for a period of time, memory is now released back to the system, reducing overall memory usage and helping applications stay responsive under varying workloads.

**How to use:**
No action is needed to benefit from this feature. Memory eviction is handled automatically by the framework.

There are also metrics added to the default memory pool used by our server implementations. The new metrics are under the name `Microsoft.AspNetCore.MemoryPool`. See the [ASP.NET Core metrics documentation](https://learn.microsoft.com/aspnet/core/log-mon/metrics/metrics) for general information on what metrics are and how to use them.

You can also use the new `IMemoryPoolFactory` service interface to create or access memory pools for custom scenarios:

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

Use a custom `IMemoryPoolFactory` to replace the memory pool being used:

```csharp
services.AddSingleton<IMemoryPoolFactory<byte>, CustomMemoryPoolFactory>();

public class CustomMemoryPoolFactory : IMemoryPoolFactory<byte>
{
    public MemoryPool<byte> Create()
    {
        // Return a custom MemoryPool implementation or the default.
        return MemoryPool<byte>.Shared;
    }
}
```

## Blazor WebAssembly preloading

Blazor now provides a `<LinkPreload />` component to generate `link` tags instead of using link headers to preload framework assets. This allows the framework to correctly identify the Blazor application base URL and provides better control over the preloading behavior.

To use this feature, place the `<LinkPreload />` component in the head of your application:

```diff
<head>
  <base href="/" />
+  <LinkPreload />
  ...
</head>
```

Removing the component will disable the preloading feature, which is useful in cases where the application uses the `loadBootResource` callback to modify URLs.

## Blazor build producing javascript bundler friendly output

Set the new `WasmBundlerFriendlyBootConfig` MSBuild property to `true` to make the Blazor WebAssembly build output compatible with tools like webpack or rollup.

```xml
<PropertyGroup>
    <WasmBundlerFriendlyBootConfig>true</WasmBundlerFriendlyBootConfig>
</PropertyGroup>
```

Setting this property will adjust the .NET boot configuration to explicitly import framework assets. The output won't be directly runnable in the browser, but the project's published out can be consumed by JavaScript bundlers to combine it with other scripts.

## Improved form validation for Blazor

Blazor now has improved form validation capabilities including support for validating properties of nested objects and collection items.

To create a validated form, use a `DataAnnotationsValidator` component inside an `EditForm` component, just as before. To opt into the new validation feature, do the following:

1. Call the `AddValidation` extension method in your application setup.
2. Declare the form model types in a .cs file (i.e., not a .razor file).
3. Annotate the root form model type with the `[ValidatableType]` attribute.

Without these steps, the validation behavior remains the same as in previous versions where only the top-level type is validated.

Here's an example:

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorComponents();

// This line enables the new validation behavior.
builder.Services.AddValidation();
```

```csharp
// Data/OrderModel.cs

// This attribute is needed on the top-level model type. 
// The other types are discovered automatically.
[ValidatableType]
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

    @* ... *@
</EditForm>

@code {
    private OrderModel order = new OrderModel();
}
```

The requirement to declare model types outside of `.razor` files is due to the fact that both the validation feature and the Razor compiler use source generators. Currently, output of one source generator cannot be used as input for another source generator.

## NotFound works with streaming that has started

Blazor now supports calling `NotFound()` even when streaming has already started. This improvement allows for better error handling in scenarios where content has already begun streaming to the client but a not-found condition is later encountered.

## Blazor diagnostics improvements

All Blazor traces are now top level in the Aspire dashboard and in Application Insights, instead of being nested under HTTP or SignalR parent traces. Additionally, the `CircuitStart` trace has been moved to a separate `Microsoft.AspNetCore.Components.Server.Circuits` source.

To configure OpenTelemetry for the new trace sources:

```diff
builder.Services.ConfigureOpenTelemetryTracerProvider(tracerProvider =>
{
    tracerProvider.AddSource("Microsoft.AspNetCore.Components");
+   tracerProvider.AddSource("Microsoft.AspNetCore.Components.Server.Circuits");
});
```

## NavigationException switch behavior change

The default behavior for `NavigationException` has changed. The configuration switch has been renamed and its default value updated:

```diff
- "Microsoft.AspNetCore.Components.Endpoints.NavigationManager.EnableThrowNavigationException", default value: false
+ "Microsoft.AspNetCore.Components.Endpoints.NavigationManager.DisableThrowNavigationException", default value: true
```

This change improves the default navigation behavior in Blazor applications.

## Add passkey support to ASP.NET Core Identity

Passkeys are a modern, phishing-resistant authentication method that improves security and user experience by leveraging public key cryptography and device-based authentication. ASP.NET Core Identity now supports passkey authentication based on WebAuthn and FIDO2 standards. This feature allows users to sign in without passwords, using secure, device-based authentication methods like biometrics or security keys.

The Blazor Web App template provides out-of-the-box passkey management and login functionality.

Developers can use new APIs to enable and manage passkey authentication in existing apps.

## Minimal API Validation integration with IProblemDetailsService

Error responses from the validation logic for minimal APIs can now be customized by an `IProblemDetailsService` implementation provided in the application services collection (DI container). This enables more consistent and user-specific error responses in an ASP.NET Core application.

Community contribution from [@marcominerva](https://github.com/marcominerva). Thank you!

## Unified validation APIs moved to extensions package

The validation APIs have been moved to the `Microsoft.Extensions.Validation` namespace/NuGet package, making them usable outside of ASP.NET Core HTTP scenarios. The public APIs and their behavior remain the same, just under a new package and namespace. Existing projects should not require code changes; old references will redirect to the new implementation.

## Contributors

Thank you contributors! ❤️

- [@am11](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview6+author%3Aam11)
- [@BrennanConroy](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview6+author%3ABrennanConroy)
- [@guardrex](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview6+author%3Aguardrex)
- [@ilonatommy](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview6+author%3Ailonatommy)
- [@maraf](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview6+author%3Amaraf)
- [@marcominerva](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview6+author%3Amarcominerva)
- [@mikekistler](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview6+author%3Amikekistler)
- [@oroztocil](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview6+author%3Aoroztocil)
- [@pavelsavara](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview6+author%3Apavelsavara)
