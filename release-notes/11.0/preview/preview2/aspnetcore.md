# ASP.NET Core in .NET 11 Preview 2 - Release Notes

Here's a summary of what's new in ASP.NET Core in this preview release:

- [Native OpenTelemetry tracing for ASP.NET Core](#native-opentelemetry-tracing-for-aspnet-core)
- [TempData support for Blazor](#tempdata-support-for-blazor)
- [OpenAPI 3.2.0 support](#openapi-320-support)
- [.NET Web Worker project template](#net-web-worker-project-template)
- [Infer passkey display name from authenticator](#infer-passkey-display-name-from-authenticator)

ASP.NET Core updates in .NET 11:

- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-11) documentation.
- [Roadmap](https://github.com/dotnet/aspnetcore/issues/64787)

## Native OpenTelemetry tracing for ASP.NET Core

ASP.NET Core now natively adds OpenTelemetry semantic convention attributes to the HTTP server activity, aligning with the [OpenTelemetry HTTP server span specification](https://opentelemetry.io/docs/specs/semconv/http/http-spans/#http-server-span). All required attributes are now included by default, matching the metadata previously only available through the `OpenTelemetry.Instrumentation.AspNetCore` library.

This change means that `Microsoft.AspNetCore.Hosting.SuppressActivityOpenTelemetryData` now defaults to `false`, enabling telemetry on the activity by default in .NET 11. The HTTP request duration metric has also been updated to include the `error.type` attribute for 500+ response status codes.

To collect the built-in tracing data, subscribe to the `Microsoft.AspNetCore` activity source in your OpenTelemetry configuration:

```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddSource("Microsoft.AspNetCore")
        .AddConsoleExporter());
```

No additional instrumentation library (such as `OpenTelemetry.Instrumentation.AspNetCore`) is needed. The framework now directly populates semantic convention attributes like `http.request.method`, `url.path`, `http.response.status_code`, and `server.address` on the request activity.

## TempData support for Blazor

Blazor Server-Side Rendering (SSR) now supports TempData, a mechanism for storing data that persists between HTTP requests. TempData is ideal for scenarios like flash messages after form submissions, passing data during redirects (POST-Redirect-GET pattern), and one-time notifications.

TempData is automatically registered when calling `AddRazorComponents()` and is provided as a cascading value. The default cookie-based provider uses ASP.NET Core Data Protection for encryption.

```razor
@page "/my-form"
@inject NavigationManager NavigationManager

<p>@_message</p>

<form @onsubmit="HandleSubmit">
    <button type="submit">Submit</button>
</form>

@code {
    [CascadingParameter]
    public ITempData? TempData { get; set; }

    private string? _message;

    protected override void OnInitialized()
    {
        // Get removes the value after reading (one-time use)
        _message = TempData?.Get("Message") as string ?? "No message";
    }

    private void HandleSubmit()
    {
        TempData!["Message"] = "Form submitted successfully!";
        NavigationManager.NavigateTo("/my-form", forceLoad: true);
    }
}
```

The `ITempData` interface provides `Get`, `Peek`, `Keep`, and `Keep(string)` methods for controlling value lifecycle. A `SessionStorageTempDataProvider` is available as an alternative to the default `CookieTempDataProvider`.

## OpenAPI 3.2.0 support

`Microsoft.AspNetCore.OpenApi` now supports OpenAPI 3.2.0 through an updated dependency on `Microsoft.OpenApi` 3.3.1. This update includes breaking changes from the underlying library — see the [Microsoft.OpenApi upgrade guide](https://github.com/microsoft/OpenAPI.NET/blob/main/docs/upgrade-guide-3.md) for details.

To generate an OpenAPI 3.2.0 document, specify the version when calling `AddOpenApi()`:

```csharp
builder.Services.AddOpenApi(options =>
{
    options.OpenApiVersion = Microsoft.OpenApi.OpenApiSpecVersion.OpenApi3_2;
});
```

Subsequent updates will take advantage of new capabilities in the 3.2.0 specification, such as item schema support for streaming events.

Thank you [@baywet](https://github.com/baywet) for this contribution!

## .NET Web Worker project template

A new `dotnet new webworker` project template provides infrastructure for running .NET code in a Web Worker, keeping Blazor WebAssembly UI responsive during heavy computations.

```bash
# Create a .NET Web Worker project
dotnet new webworker -n MyWebWorker
```

The template generates a `WebWorkerClient` class with a factory pattern for creating worker instances. Worker methods use `[JSExport]` and can be invoked from components:

```csharp
// Create a worker and invoke a method
await using var worker = await WebWorkerClient.CreateAsync(JSRuntime);
var result = await worker.InvokeAsync<string>("MyApp.MyWorker.Greet", ["World"]);
```

This enables offloading expensive computations to a separate thread without blocking UI rendering.

## Infer passkey display name from authenticator

The Blazor Web App project template now automatically infers friendly display names for passkeys based on their AAGUID (Authenticator Attestation GUID). Built-in mappings are included for the most commonly used passkey authenticators, including Google Password Manager, iCloud Keychain, Windows Hello, 1Password, and Bitwarden.

For known authenticators, the name is automatically assigned without prompting the user. For unknown authenticators, the user is redirected to a rename page. Developers can extend the mappings by adding entries to the `PasskeyAuthenticators.cs` dictionary in their project.

## Community contributors

Thank you contributors! ❤️

- [@baywet](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview2+author%3Abaywet)
- [@BekAllaev](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview2+author%3ABekAllaev)
- [@WeihanLi](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview2+author%3AWeihanLi)
