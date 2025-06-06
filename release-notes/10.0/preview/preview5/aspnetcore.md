# ASP.NET Core in .NET 10 Preview 5 - Release Notes

Here's a summary of what's new in ASP.NET Core in this preview release:

- [Configure custom security descriptors for HTTP.sys request queues](#configure-custom-security-descriptors-for-httpsys-request-queues)
- [Validation resolver APIs marked as experimental](#validation-resolver-apis-marked-as-experimental)
- [Support for generating OpenAPI 3.1](#support-for-generating-openapi-31)
- [OpenAPI metadata from XML doc comments](#openapi-metadata-from-xml-doc-comments)
- [Add a Not Found page using the Blazor Router](#add-a-not-found-page-using-the-blazor-router)
- [Blazor metrics and tracing](#blazor-metrics-and-tracing)

ASP.NET Core updates in .NET 10:

- [What's new in ASP.NET Core in .NET 10](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-10.0) documentation.
- [Breaking changes](https://docs.microsoft.com/dotnet/core/compatibility/10.0#aspnet-core)
- [Roadmap](https://github.com/dotnet/aspnetcore/issues/59443)

## Configure custom security descriptors for HTTP.sys request queues

You can now specify a custom security descriptor for HTTP.sys request queues using the new `RequestQueueSecurityDescriptor` property on `HttpSysOptions`. This feature enables more granular control over access rights for the request queue, allowing you to tailor security to your application's needs.

By customizing the security descriptor, you can allow or deny specific users or groups access to the request queue. This is particularly useful in scenarios where you want to restrict or delegate HTTP.sys request handling at the operating system level.

To use this feature, set the `RequestQueueSecurityDescriptor` property to a `GenericSecurityDescriptor` instance when configuring your HTTP.sys server. For example, to allow all users but deny guest accounts:

```csharp
using System.Security.AccessControl;
using System.Security.Principal;
using Microsoft.AspNetCore.Server.HttpSys;

// Create a new security descriptor
var securityDescriptor = new CommonSecurityDescriptor(isContainer: false, isDS: false, sddlForm: string.Empty);

// Create a discretionary access control list (DACL)
var dacl = new DiscretionaryAcl(isContainer: false, isDS: false, capacity: 2);
dacl.AddAccess(
    AccessControlType.Allow,
    new SecurityIdentifier(WellKnownSidType.BuiltinUsersSid, null),
    -1,
    InheritanceFlags.None,
    PropagationFlags.None
);
dacl.AddAccess(
    AccessControlType.Deny,
    new SecurityIdentifier(WellKnownSidType.BuiltinGuestsSid, null),
    -1,
    InheritanceFlags.None,
    PropagationFlags.None
);

// Assign the DACL to the security descriptor
securityDescriptor.DiscretionaryAcl = dacl;

// Configure HTTP.sys options
var builder = WebApplication.CreateBuilder();
builder.WebHost.UseHttpSys(options =>
{
    options.RequestQueueSecurityDescriptor = securityDescriptor;
});
```

### Additional notes

- The `RequestQueueSecurityDescriptor` applies only when creating a new request queue.
- This property does not affect existing request queues.
- See the official documentation for more information about Windows security descriptors and their usage.

## Validation resolver APIs marked as experimental

To allow for future adjustments to the new validation APIs, the underlying validation resolver APIs used to support minimal API validation have been marked as experimental. However, the top-level `AddValidation` APIs and the built-in validation filter for Minimal APIs remain non-experimental.

## Support for generating OpenAPI 3.1

The OpenAPI.NET library used in ASP.NET Core OpenAPI document generation has been upgraded to [v2.0.0-preview18](https://github.com/microsoft/OpenAPI.NET/releases/tag/v2.0.0-preview.18).

## OpenAPI metadata from XML doc comments

Support for generating OpenAPI metadata from XML doc comments has been extended to extract metadata for operation responses from `<returns>` and `<response>` XML tags on handler methods.

## Add a Not Found page using the Blazor Router

Blazor now provides an improved way to display a "Not Found" page when navigating to a non-existent page. You can specify a page to render when `NavigationManager.NotFound()` is called by passing a page type to the `Router` component using the `NotFoundPage` parameter. This approach is recommended over the previous `NotFound` fragment, as it supports routing, works across code re-execution middleware, and is compatible even with non-Blazor scenarios. If both `NotFound` fragment and `NotFoundPage` are defined, the page specified by `NotFoundPage` takes priority.

```html
<Router AppAssembly="@typeof(Program).Assembly" NotFoundPage="typeof(Pages.NotFound)">
    <Found Context="routeData">
        <RouteView RouteData="@routeData" />
        <FocusOnNavigate RouteData="@routeData" Selector="h1" />
    </Found>
    <NotFound>This content will be ignored because we have NotFoundPage defined.</NotFound>
</Router>
```

The Blazor project template now includes a `NotFound.razor` page by default. This page will automatically render whenever `NavigationManager.NotFound()` is called in your application, making it easier to handle missing routes with a consistent user experience.

## Blazor metrics and tracing

.NET 10 Preview 5 introduces comprehensive metrics and tracing capabilities for Blazor applications, providing detailed observability into component lifecycle, navigation, event handling, and circuit management.

### Blazor metrics

The new metrics feature includes several meters that track different aspects of Blazor application performance:

**Microsoft.AspNetCore.Components meter:**

- **`aspnetcore.components.navigation`** - Tracks the total number of route changes in your Blazor application
- **`aspnetcore.components.event_handler`** - Measures the duration of processing browser events, including your business logic

**Microsoft.AspNetCore.Components.Lifecycle meter:**

- **`aspnetcore.components.update_parameters`** - Measures the duration of processing component parameters, including your business logic
- **`aspnetcore.components.render_diff`** - Tracks the duration of rendering batches

**Microsoft.AspNetCore.Components.Server.Circuits meter:**

For Blazor Server applications, additional circuit-specific metrics are available:

- **`aspnetcore.components.circuit.active`** - Shows the number of active circuits currently in memory
- **`aspnetcore.components.circuit.connected`** - Tracks the number of circuits connected to clients
- **`aspnetcore.components.circuit.duration`** - Measures circuit lifetime duration and provides total count

### Blazor tracing

The new activity tracing capabilities use the `Microsoft.AspNetCore.Components` activity source and provide three main types of activities:

**Circuit lifecycle tracing:**

- **`Microsoft.AspNetCore.Components.CircuitStart`** - Traces circuit initialization with format `Circuit {circuitId}`
  - Tags: `aspnetcore.components.circuit.id`
  - Links: HTTP activity

**Navigation tracing:**

- **`Microsoft.AspNetCore.Components.RouteChange`** - Tracks route changes with format `Route {route} -> {componentType}`
  - Tags: `aspnetcore.components.circuit.id`, `aspnetcore.components.type`, `aspnetcore.components.route`
  - Links: HTTP trace, circuit trace

**Event handling tracing:**

- **`Microsoft.AspNetCore.Components.HandleEvent`** - Traces event handling with format `Event {attributeName} -> {componentType}.{methodName}`
  - Tags: `aspnetcore.components.circuit.id`, `aspnetcore.components.type`, `aspnetcore.components.method`, `aspnetcore.components.attribute.name`, `error.type`
  - Links: HTTP trace, circuit trace, router trace

To enable Blazor metrics and tracing in your application, configure OpenTelemetry with the following meters and activity sources:

```csharp
builder.Services.ConfigureOpenTelemetryMeterProvider(meterProvider =>
{
    meterProvider.AddMeter("Microsoft.AspNetCore.Components");
    meterProvider.AddMeter("Microsoft.AspNetCore.Components.Lifecycle");
    meterProvider.AddMeter("Microsoft.AspNetCore.Components.Server.Circuits");
});

builder.Services.ConfigureOpenTelemetryTracerProvider(tracerProvider =>
{
    tracerProvider.AddSource("Microsoft.AspNetCore.Components");
});
```

These new observability features help you monitor and diagnose Blazor application performance, track user interactions, and understand component behavior in production environments.

## Contributors

Thank you contributors! ❤️

- [@am11](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview5+author%3Aam11)
- [@Dona278](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview5+author%3ADona278)
- [@feiyun0112](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview5+author%3Afeiyun0112)
- [@MohabASHRAF-byte](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview5+author%3AMohabASHRAF-byte)
- [@profet23](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview5+author%3Aprofet23)
