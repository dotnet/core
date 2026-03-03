# ASP.NET Core in .NET 11 Preview 2 - Release Notes

Here's a summary of what's new in ASP.NET Core in this preview release:

- [Native OpenTelemetry tracing for ASP.NET Core](#native-opentelemetry-tracing-for-aspnet-core)
- [TempData support for Blazor](#tempdata-support-for-blazor)
- [.NET Web Worker project template](#net-web-worker-project-template)
- [Infer passkey display name from authenticator](#infer-passkey-display-name-from-authenticator)
- [Passkey sign-in enforces confirmation and lockout checks](#passkey-sign-in-enforces-confirmation-and-lockout-checks)
- [Faster bad request handling in Kestrel](#faster-bad-request-handling-in-kestrel)
- [Reduced allocations in HTTP logging middleware](#reduced-allocations-in-http-logging-middleware)
- [Label `id` attribute generation in interactive render mode](#label-id-attribute-generation-in-interactive-render-mode)
- [Development certificate compatibility with older SDKs](#development-certificate-compatibility-with-older-sdks)
- [SignalR HTTP/2 with `SkipNegotiation`](#signalr-http2-with-skipnegotiation)
- [SignalR `WebSocketFactory` for browser environments](#signalr-websocketfactory-for-browser-environments)
- [Request smuggling mitigation improvement](#request-smuggling-mitigation-improvement)

ASP.NET Core updates in .NET 11:

- [What's new in ASP.NET Core in .NET 11](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-11) documentation.
- [Roadmap](https://github.com/dotnet/aspnetcore/issues/64787)

## Native OpenTelemetry tracing for ASP.NET Core

ASP.NET Core now natively adds OpenTelemetry semantic convention attributes to the HTTP server activity, aligning with the [OpenTelemetry HTTP server span specification](https://opentelemetry.io/docs/specs/semconv/http/http-spans/#http-server-span). All required attributes are now included by default, matching the metadata previously only available through the `OpenTelemetry.Instrumentation.AspNetCore` library ([dotnet/aspnetcore#64851](https://github.com/dotnet/aspnetcore/pull/64851)).

This change means that `Microsoft.AspNetCore.Hosting.SuppressActivityOpenTelemetryData` now defaults to `false`, enabling telemetry on the activity by default in .NET 11. The HTTP request duration metric has also been updated to include the `error.type` attribute for 500+ response status codes.

By building this instrumentation directly into the framework, applications no longer need to rely on external instrumentation libraries and their associated overhead from Diagnostic Source listeners ([dotnet/aspnetcore#52439](https://github.com/dotnet/aspnetcore/issues/52439)).

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

## Passkey sign-in enforces confirmation and lockout checks

`PasskeySignInAsync()` now calls `PreSignInCheck()` before signing in the user, enforcing `RequireConfirmedEmail`, `RequireConfirmedPhoneNumber`, and lockout checks. Previously, passkey sign-in bypassed these requirements, which was inconsistent with `PasswordSignInAsync()` and other sign-in methods ([dotnet/aspnetcore#65024](https://github.com/dotnet/aspnetcore/pull/65024)).

## Faster bad request handling in Kestrel

Kestrel's HTTP/1.1 request parser now uses a non-throwing code path for handling malformed requests. Instead of relying on `try/catch` with `BadHttpRequestException` for every parse failure, the parser returns a result struct indicating success, incomplete, or error states ([dotnet/aspnetcore#65256](https://github.com/dotnet/aspnetcore/pull/65256)).

In scenarios with many malformed requests — such as port scanning, malicious traffic, or misconfigured clients — this change improves throughput by approximately 20% on an Azure Linux VM, with CPU-bound scenarios showing over 40% improvement as time spent in exception handling drops from approximately 10% to 0.2%. There is no impact on valid request processing.

## Reduced allocations in HTTP logging middleware

The `ResponseBufferingStream` used by `HttpLoggingMiddleware` is now pooled using object pooling instead of being instantiated on every request where response body logging or interceptors are enabled. This reduces allocations on the response logging path ([dotnet/aspnetcore#65147](https://github.com/dotnet/aspnetcore/pull/65147)).

## Label `id` attribute generation in interactive render mode

Building on the [Label component introduced in Preview 1](../preview1/aspnetcore.md), the `id` attribute for input components is now correctly generated in interactive render mode. Previously, `IdAttributeValue` relied solely on `NameAttributeValue`, which is empty in interactive mode. The `id` attribute is now generated independently to support label/input association regardless of render mode ([dotnet/aspnetcore#65263](https://github.com/dotnet/aspnetcore/pull/65263)).

## Development certificate compatibility with older SDKs

The ASP.NET Core development certificate version check has been updated to accept certificates from SDK versions as far back as 10.0.100. Previously, version mismatches between SDK tooling and runtime could cause the runtime to reject valid development certificates, particularly in scenarios with pinned SDKs via `global.json`, preview SDKs, or self-contained NuGet packages ([dotnet/aspnetcore#65151](https://github.com/dotnet/aspnetcore/pull/65151)).

## SignalR HTTP/2 with `SkipNegotiation`

SignalR now correctly creates the `HttpClient` for WebSocket connections when using `SkipNegotiation` mode over HTTP/2. Previously, `SkipNegotiation` would fail when using HTTP/2 transport ([dotnet/aspnetcore#62940](https://github.com/dotnet/aspnetcore/pull/62940)).

Thank you [@WeihanLi](https://github.com/WeihanLi) for this contribution!

## SignalR `WebSocketFactory` for browser environments

The `WebSocketFactory` property on `HttpConnectionOptions` is now correctly set for all environments, including browser platforms. Previously, the factory was only assigned inside a non-browser platform check, which prevented custom `WebSocketFactory` configurations from working in Blazor WebAssembly ([dotnet/aspnetcore#65359](https://github.com/dotnet/aspnetcore/pull/65359)).

Thank you [@BekAllaev](https://github.com/BekAllaev) for this contribution!

## Request smuggling mitigation improvement

The request smuggling mitigation logic that handles conflicting `Transfer-Encoding` and `Content-Length` headers now uses `TryAdd()` when writing the `X-Content-Length` header. This prevents an unhandled exception when a request already includes an explicit `X-Content-Length` header ([dotnet/aspnetcore#65445](https://github.com/dotnet/aspnetcore/pull/65445)).

## Community contributors

Thank you contributors! ❤️

- [@BekAllaev](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview2+author%3ABekAllaev)
- [@WeihanLi](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A11.0-preview2+author%3AWeihanLi)
Feature summary
