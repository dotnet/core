# ASP.NET Core in .NET 10 Preview 7 - Release Notes

Here's a summary of what's new in ASP.NET Core in this preview release:

- [Configure suppressing exception handler diagnostics](#configure-suppressing-exception-handler-diagnostics)
- [Avoid cookie login redirects for known API endpoints](#avoid-cookie-login-redirects-for-known-api-endpoints)
- [Passkey authentication improvements](#passkey-authentication-improvements)
- [Support for the .localhost top-level domain](#support-for-the-localhost-top-level-domain)
- [JSON+PipeReader deserialization support](#jsonpipereader-deserialization-support)
- [Enhanced validation for classes and records](#enhanced-validation-for-classes-and-records)
- [Blazor component improvements](#blazor-component-improvements)
- [Identity metrics](#identity-metrics)
- [OpenAPI improvements](#openapi-improvements)

ASP.NET Core updates in .NET 10:

- [What's new in ASP.NET Core in .NET 10](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-10.0) documentation.
- [Breaking changes](https://docs.microsoft.com/dotnet/core/compatibility/10.0#aspnet-core)
- [Roadmap](https://github.com/dotnet/aspnetcore/issues/59443)

## Configure suppressing exception handler diagnostics

A new configuration option has been added to the [ASP.NET Core exception handler middleware](https://learn.microsoft.com/aspnet/core/fundamentals/error-handling#exception-handler-page) to control diagnostic output: `ExceptionHandlerOptions.SuppressDiagnosticsCallback`. This callback is passed context about the request and exception, allowing you to add logic that determines whether the middleware should write exception logs and other telemetry.

This setting is useful when you know an exception is transient, or has been handled by the exception handler middleware, and don't want the error logs written to your observability platform.

Additionally, the middleware's default behavior has changed: it no longer writes exception diagnostics for exceptions handled by `IExceptionHandler`. Based on user feedback, logging handled exceptions at the error level was often undesirable when `IExceptionHandler.TryHandleAsync` returned `true`.

You can revert to the previous behavior by configuring `SuppressDiagnosticsCallback`:

```csharp
app.UseExceptionHandler(new ExceptionHandlerOptions
{
    SuppressDiagnosticsCallback = context => false;
});
```

For more information about this breaking change, see https://github.com/aspnet/Announcements/issues/524.

## Avoid cookie login redirects for known API endpoints

By default, unauthenticated and unauthorized requests made to known API endpoints protected by cookie authentication now result in 401 and 403 responses rather than redirecting to a login or access denied URI. Redirecting unauthenticated requests to a login page doesn't usually make sense for API endpoints which typically rely on 401 and 403 status codes rather than HTML redirects to communicate authentication and authorization failures.

API [endpoints](https://learn.microsoft.com/aspnet/core/fundamentals/routing) are identified using the new `IApiEndpointMetadata` interface, and metadata implementing the new interface has been added automatically to the following:

- `[ApiController]` endpoints
- Minimal API endpoints that read JSON request bodies or write JSON responses
- Endpoints using `TypedResults` return types
- SignalR endpoints

When `IApiEndpointMetadata` is present, the cookie authentication handler now returns appropriate HTTP status codes (401 for unauthenticated requests, 403 for forbidden requests) instead of redirecting.

If you want to prevent this new behavior and always redirect to the login and access denied URIs for unauthenticated or unauthorized requests regardless of the target endpoint, you can override the `RedirectToLogin` and `RedirectToAccessDenied` events as follows:

```csharp
builder.Services.AddAuthentication()
    .AddCookie(options =>
    {
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.Redirect(context.RedirectUri);
            return Task.CompletedTask;
        };

        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.Redirect(context.RedirectUri);
            return Task.CompletedTask;
        };
    });
```

For more information about this breaking change, see https://github.com/aspnet/Announcements/issues/525

## Passkey authentication improvements

APIs for passkey authentication in ASP.NET Core Identity have been updated and simplified, and now resemble what we expect to ship in .NET 10 GA.

### Getting started with passkeys

**For new applications:** The Blazor Web App project template now includes passkey functionality out of the box. Create a new Blazor app with passkey support using:

```sh
dotnet new blazor -au Individual
```

**For existing applications:** Please refer to the [official docs](https://learn.microsoft.com/aspnet/core/security/authentication/identity) for guidance on upgrading existing apps to utilize passkeys.

## Support for the .localhost top-level domain

The `.localhost` top-level domain (TLD) is defined in [RFC2606](https://www.rfc-editor.org/rfc/rfc2606) and [RFC6761](https://www.rfc-editor.org/rfc/rfc6761) as being reserved for testing purposes and available for users to use locally as they would any other domain name. This means using a name like `myapp.localhost` locally that resolves to the IP loopback address is allowed and expected according to these RFCs. Additionally, modern evergreen browsers already automatically resolve any `*.localhost` name to the IP loopback address (`127.0.0.1`/`::1`), effectively making them an alias for any service already being hosted at `localhost` on the local machine.

ASP.NET Core has been updated in .NET 10 preview 7 to better support the `.localhost` TLD, such that it can now be easily used when creating and running ASP.NET Core applications in your local development environment. Having different apps running locally be resolvable via different names allows for better separation of some domain-name-associated website assets, e.g. cookies, and makes it easier to identify which app you're browsing via the name displayed in the browser address bar.

ASP.NET Core's built-in HTTP server, Kestrel, will now correctly treat any `*.localhost` name set via [supported endpoint configuration mechanisms](https://learn.microsoft.com/aspnet/core/fundamentals/servers/kestrel/endpoints#configure-endpoints) as the local loopback address and thus bind to it rather than all external address (i.e. bind to `127.0.0.1`/`::1` rather than `0.0.0.0`/`::`). This includes the `"applicationUrl"` property in [launch profiles configured in a *launchSettings.json* file](https://learn.microsoft.com/aspnet/core/fundamentals/environments#development-and-launchsettingsjson), and the `ASPNETCORE_URLS` environment variable. When configured to listen on a `.localhost` address, Kestrel will log an information message for both the `.localhost` **and** `localhost` addresses, to make it clear that both names can be used.

*Note that while web browsers will automatically resolve `*.localhost` names to the local loopback address, other applications may treat `*.localhost` names as a regular domain names and attempt to resolve them via their corresponding DNS stack. If your DNS configuration does not resolve `*.localhost` names to an address then they will fail to connect. You can continue to use the regular `localhost` name to address your applications when not in a web browser.*

The [ASP.NET Core HTTPS development certificate](https://learn.microsoft.com/aspnet/core/security/enforcing-ssl#trust-the-aspnet-core-https-development-certificate) (including the `dotnet dev-certs https` command) have been updated to ensure the certificate is valid for use with the `*.dev.localhost` domain name. After installing .NET 10 SDK preview 7, trust the new developer certificate by running `dotnet dev-certs https --trust` at the command line to ensure your system is configured to trust the new certificate.

*Note that the certificate lists the `*.dev.localhost` name as a Subject Alternative Name (SAN) rather than `*.localhost` as it's invalid to have wildcard certificates for top-level domain names*

The project templates for *ASP.NET Core Empty* (`web`) and *Blazor Web App* (`blazor`) have been updated with a new option that when specified configures the created project to use the `.dev.localhost` domain name suffix, combining it with the project name to allow the app to be browsed to at an address like `https://myapp.dev.localhost:5036`:

```
$ dotnet new web -n MyApp --localhost-tld
The template "ASP.NET Core Empty" was created successfully.

Processing post-creation actions...
Restoring D:\src\MyApp\MyApp.csproj:
Restore succeeded.

$ cd .\MyApp\
$ dotnet run --launch-profile https
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://myapp.dev.localhost:7099
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7099/
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://myapp.dev.localhost:5036
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5036/
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Development
info: Microsoft.Hosting.Lifetime[0]
      Content root path: D:\src\local\10.0.1xx\MyApp
```

## JSON+PipeReader deserialization support

MVC, Minimal APIs, and the `HttpRequestJsonExtensions.ReadFromJsonAsync` methods have all been updated to use the new Json+PipeReader support without requiring any code changes from applications.

For the majority of applications this should have no impact on behavior. However, if the application is using a custom `JsonConverter`, there is a chance that the converter doesn't handle [Utf8JsonReader.HasValueSequence](https://learn.microsoft.com/dotnet/api/system.text.json.utf8jsonreader.hasvaluesequence) correctly. This can result in missing data and errors like `ArgumentOutOfRangeException` when deserializing.

The quick workaround (especially if you don't own the custom `JsonConverter` being used) is to set the `"Microsoft.AspNetCore.UseStreamBasedJsonParsing"` [AppContext](https://learn.microsoft.com/dotnet/api/system.appcontext) switch to `true`. This should be a temporary workaround and the `JsonConverter`(s) should be updated to support `HasValueSequence`.

To fix `JsonConverter` implementations, there is the quick fix which allocates an array from the `ReadOnlySequence`:

```csharp
public override T? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
{
    var span = reader.HasValueSequence ? reader.ValueSequence.ToArray() : reader.ValueSpan;
    // previous code
}
```

Or the more complicated (but performant) fix which would involve having a separate code path for the `ReadOnlySequence` handling:

```csharp
public override T? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
{
    if (reader.HasValueSequence)
    {
        reader.ValueSequence;
        // ReadOnlySequence optimized path
    }
    else
    {
        reader.ValueSpan;
        // ReadOnlySpan optimized path
    }
}
```

## Enhanced validation for classes and records

Users can now use validation attributes on both classes and records, with consistent code generation and validation behavior. This enhances flexibility when designing models using records in ASP.NET Core applications.

**Community contribution: Thanks to [@marcominerva](https://github.com/marcominerva)**

## Blazor component improvements

### Resource preloader component renamed

The Blazor component for rendering preloading links has been renamed from `LinkPreload` to `ResourcePreloader` based on API review feedback.

### Updated API names for Blazor state persistence

Blazor APIs have been updated to implement API review feedback, including:

- Renamed JavaScript APIs: `Blazor.pause()` → `Blazor.pauseCircuit()` and `Blazor.resume()` → `Blazor.resumeCircuit()`
- Renamed C# attribute: `SupplyParameterFromPersistentComponentStateAttribute` → `PersistentStateAttribute`
- Updated related class names for consistency

### Enhanced NotFound support

Added support for `NotFound` in applications without Blazor's `Router`. Applications that implement their custom router can now use `NavigationManager.NotFound()`. The implementation also simplifies 404 handling with the default `Router` by making the `NotFound` fragment obsolete.

### Diagnostic metrics and traces improvements

Updated Blazor diagnostic metrics and traces to follow OpenTelemetry naming conventions:

- Split `aspnetcore.components.render_diff` into separate duration and size metrics
- Renamed navigation and event handler metrics for consistency with trace names
- Updated trace names to follow OpenTelemetry standards

### WebAssembly host builder improvements

Enhanced the `WebAssemblyHostBuilder` with customizable service provider options. This improvement helps prevent circular dependency issues in Blazor WebAssembly apps by providing validation errors at build time instead of runtime hangs.

```csharp
// Simple configuration
builder.UseDefaultServiceProvider(options => 
{
    options.ValidateOnBuild = true;
});

// Environment-aware configuration  
builder.UseDefaultServiceProvider((env, options) =>
{
    options.ValidateOnBuild = env.IsDevelopment();
});
```

## Identity metrics

ASP.NET Core Identity now includes built-in metrics for better observability and monitoring of authentication and user management operations.

## OpenAPI improvements

### Upgrade Microsoft.OpenApi to 2.0.0

The OpenAPI.NET library used in ASP.NET Core OpenAPI document generation has been upgraded to v2.0.0 (GA). With the update to the GA version of this package, no further breaking changes are expected in the OpenAPI document generation.

### Fix ProducesResponseType Description for Minimal APIs

The Description property for the `ProducesResponseType` attribute is now correctly set in Minimal APIs even when the attribute type and the inferred return type are not an exact match.

**Community contribution: Thanks to [@sander1095](https://github.com/sander1095)**

### Correct metadata type for formdata enum parameters

The metadata type for formdata enum parameters in MVC controller actions has been updated to use the actual enum type instead of string.

**Community contribution: Thanks to [@ascott18](https://github.com/ascott18)**

### Unify handling of documentation IDs in OpenAPI XML comment generator

XML documentation comments from referenced assemblies are now correctly merged if their documentation IDs included return type suffixes. As a result, all valid XML comments are now reliably included in generated OpenAPI documentation, improving doc accuracy and completeness for APIs using referenced assemblies.

## Contributors

Thank you contributors! ❤️

- [ascott18](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview7+author%3Aascott18)
- [ladeak](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview7+author%3Aladeak)
- [marcominerva](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview7+author%3Amarcominerva)
- [oroztocil](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview7+author%3Aoroztocil)
- [sander1095](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview7+author%3Asander1095)
