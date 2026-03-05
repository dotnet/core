# ASP.NET Core in .NET 11 Preview 2 - Release Notes

Here's a summary of what's new in ASP.NET Core in this preview release:

- [Native OpenTelemetry tracing for ASP.NET Core](#native-opentelemetry-tracing-for-aspnet-core)
- [TempData support for Blazor](#tempdata-support-for-blazor)
- [OpenAPI 3.2.0 support](#openapi-320-support)
- [.NET Web Worker project template](#net-web-worker-project-template)
- [Infer passkey display name from authenticator](#infer-passkey-display-name-from-authenticator)
- [Performance improvements](#performance-improvements)

ASP.NET Core updates in .NET 11:

- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-11) documentation.
- [Roadmap](https://github.com/dotnet/aspnetcore/issues/64787)

## Native OpenTelemetry tracing for ASP.NET Core

ASP.NET Core now natively adds OpenTelemetry semantic convention attributes to the HTTP server activity, aligning with the [OpenTelemetry HTTP server span specification](https://opentelemetry.io/docs/specs/semconv/http/http-spans/#http-server-span). All required attributes are now included by default, matching the metadata previously only available through the `OpenTelemetry.Instrumentation.AspNetCore` library ([dotnet/aspnetcore#64851](https://github.com/dotnet/aspnetcore/pull/64851)).

To collect the built-in tracing data, subscribe to the `Microsoft.AspNetCore` activity source in your OpenTelemetry configuration:

```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddSource("Microsoft.AspNetCore")
        .AddConsoleExporter());
```

No additional instrumentation library (such as `OpenTelemetry.Instrumentation.AspNetCore`) is needed. The framework now directly populates semantic convention attributes like `http.request.method`, `url.path`, `http.response.status_code`, and `server.address` on the request activity.

If you don't want OpenTelemetry attributes added to the activity you can turn it off by setting the `Microsoft.AspNetCore.Hosting.SuppressActivityOpenTelemetryData` AppContext switch to `true`.

## TempData support for Blazor

Blazor Server-Side Rendering (SSR) now supports TempData, a mechanism for storing data that persists between HTTP requests. TempData is ideal for scenarios like flash messages after form submissions, passing data during redirects (POST-Redirect-GET pattern), and one-time notifications ([dotnet/aspnetcore#64749](https://github.com/dotnet/aspnetcore/pull/64749)).

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

The `ITempData` interface provides `Get`, `Peek`, `Keep`, and `Keep(string)` methods for controlling value lifecycle. A `SessionStorageTempDataProvider` is available as an alternative to the default `CookieTempDataProvider` ([dotnet/aspnetcore#49683](https://github.com/dotnet/aspnetcore/issues/49683)).

## OpenAPI 3.2.0 support

`Microsoft.AspNetCore.OpenApi` now supports OpenAPI 3.2.0 through an updated dependency on `Microsoft.OpenApi` 3.3.1 ([dotnet/aspnetcore#65415](https://github.com/dotnet/aspnetcore/pull/65415)). This update includes breaking changes from the underlying library — see the [Microsoft.OpenApi upgrade guide](https://github.com/microsoft/OpenAPI.NET/blob/main/docs/upgrade-guide-3.md) for details.

To generate an OpenAPI 3.2.0 document, specify the version when calling `AddOpenApi()`:

```csharp
builder.Services.AddOpenApi(options =>
{
    options.OpenApiVersion = Microsoft.OpenApi.OpenApiSpecVersion.OpenApi3_2;
});
```

Subsequent updates will take advantage of new capabilities in the 3.2.0 specification, such as item schema support for streaming events ([dotnet/aspnetcore#63754](https://github.com/dotnet/aspnetcore/issues/63754)).

Thank you [@baywet](https://github.com/baywet) for this contribution!

## .NET Web Worker project template

A new `dotnet new webworker` project template provides infrastructure for running .NET code in a Web Worker, keeping Blazor WebAssembly UI responsive during heavy computations ([dotnet/aspnetcore#65037](https://github.com/dotnet/aspnetcore/pull/65037)).

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

This enables offloading expensive computations to a separate thread without blocking UI rendering ([dotnet/runtime#95452](https://github.com/dotnet/runtime/issues/95452)).

## Infer passkey display name from authenticator

The Blazor Web App project template now automatically infers friendly display names for passkeys based on their AAGUID (Authenticator Attestation GUID). Built-in mappings are included for the most commonly used passkey authenticators, including Google Password Manager, iCloud Keychain, Windows Hello, 1Password, and Bitwarden ([dotnet/aspnetcore#65343](https://github.com/dotnet/aspnetcore/pull/65343)).

For known authenticators, the name is automatically assigned without prompting the user. For unknown authenticators, the user is redirected to a rename page. Developers can extend the mappings by adding entries to the `PasskeyAuthenticators.cs` dictionary in their project ([dotnet/aspnetcore#63630](https://github.com/dotnet/aspnetcore/issues/63630)).

## Performance improvements

Kestrel's HTTP/1.1 request parser now uses a non-throwing code path for handling malformed requests ([dotnet/aspnetcore#65256](https://github.com/dotnet/aspnetcore/pull/65256)). Instead of throwing `BadHttpRequestException` on every parse failure, the parser returns a result struct indicating success, incomplete, or error states. In scenarios with many malformed requests — such as port scanning, malicious traffic, or misconfigured clients — this eliminates expensive exception handling overhead and improves throughput by up to 20-40%. There's no impact on valid request processing.

The HTTP logging middleware now pools its `ResponseBufferingStream` instances ([dotnet/aspnetcore#65147](https://github.com/dotnet/aspnetcore/pull/65147)), reducing per-request allocations when response body logging or interceptors are enabled.

## Bug fixes

This release includes bug fixes and quality improvements across several areas:

- **Blazor** — Fixed `Label` component `id` attribute generation in interactive render mode ([dotnet/aspnetcore#65263](https://github.com/dotnet/aspnetcore/pull/65263)); fixed `[EditorRequired]` warning incorrectly shown in SSR mode ([dotnet/aspnetcore#65393](https://github.com/dotnet/aspnetcore/pull/65393))
- **Identity** — `PasskeySignInAsync()` now enforces `PreSignInCheck()` for confirmation and lockout checks, consistent with other sign-in methods ([dotnet/aspnetcore#65024](https://github.com/dotnet/aspnetcore/pull/65024))
- **IIS** — Fixed configuration change monitoring for multi-application deployments ([dotnet/aspnetcore#59998](https://github.com/dotnet/aspnetcore/pull/59998))
- **Kestrel** — Fixed request smuggling mitigation to use `TryAdd()` for `X-Content-Length` header ([dotnet/aspnetcore#65445](https://github.com/dotnet/aspnetcore/pull/65445)); updated development certificate version check to accept certificates from SDK 10.0.100+ ([dotnet/aspnetcore#65151](https://github.com/dotnet/aspnetcore/pull/65151))
- **SignalR** — Fixed `HttpClient` creation for WebSocket `SkipNegotiation` mode over HTTP/2 ([dotnet/aspnetcore#62940](https://github.com/dotnet/aspnetcore/pull/62940), thank you [@WeihanLi](https://github.com/WeihanLi)!); fixed `WebSocketFactory` not being set in browser environments ([dotnet/aspnetcore#65359](https://github.com/dotnet/aspnetcore/pull/65359), thank you [@BekAllaev](https://github.com/BekAllaev)!)

## Community contributors

Thank you contributors! ❤️

- [@baywet](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview2+author%3Abaywet)
- [@BekAllaev](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview2+author%3ABekAllaev)
- [@WeihanLi](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview2+author%3AWeihanLi)
