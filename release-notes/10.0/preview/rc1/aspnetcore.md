# ASP.NET Core in .NET 10 Preview 7 - Release Notes

Here's a summary of what's new in ASP.NET Core in this preview release:

- [Configure suppressing exception handler diagnostics](#configure-suppressing-exception-handler-diagnostics)
- [Avoid cookie login redirects for known API endpoints](#avoid-cookie-login-redirects-for-known-api-endpoints)
- [Passkey authentication improvements](#passkey-authentication-improvements)
- [Support for the .localhost top-level domain](#support-for-the-localhost-top-level-domain)
- [Use PipeReader support in System.Text.Json](#use-pipereader-support-in-systemtextjson)
- [Enhanced validation for classes and records](#enhanced-validation-for-classes-and-records)
- [Blazor resource preloader component renamed](#blazor-resource-preloader-component-renamed)
- [Updated API names for Blazor state persistence](#updated-api-names-for-blazor-state-persistence)
- [InvokeNew renamed to InvokeConstructor](#invokenew-renamed-to-invokeconstructor)
- [Support NotFound in custom Blazor routers](#support-notfound-in-custom-blazor-routers)
- [Updated Blazor metric names](#updated-blazor-metric-names)
- [Validate configured services for Blazor WebAssembly apps on build](#validate-configured-services-for-blazor-webassembly-apps-on-build)
- [OpenAPI.NET dependency upgraded to stable release](#openapinet-dependency-upgraded-to-stable-release)
- [Fix ProducesResponseType Description for Minimal APIs](#fix-producesresponsetype-description-for-minimal-apis)
- [Correct metadata type for formdata enum parameters](#correct-metadata-type-for-formdata-enum-parameters)
- [Unify handling of documentation IDs in OpenAPI XML comment generator](#unify-handling-of-documentation-ids-in-openapi-xml-comment-generator)

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

For more information about this breaking change, see [this announcement](https://github.com/aspnet/Announcements/issues/524).

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

For more information about this breaking change, see [this announcement](https://github.com/aspnet/Announcements/issues/525).

## Passkey authentication improvements

APIs for passkey authentication in ASP.NET Core Identity have been updated and simplified. The Blazor Identity UI in the Blazor Web App project template has been updated accordingly.

Passkey options are now configured globally via `IdentityPasskeyOptions`. Here's an example of how passkey options can be configured:

```csharp
builder.Services.Configure<IdentityPasskeyOptions>(options =>
{
    // Explicitly set the Relying Party ID (domain)
    options.ServerDomain = "example.com";
    
    // Configure authenticator timeout
    options.AuthenticatorTimeout = TimeSpan.FromMinutes(3);
    
    // Configure challenge size
    options.ChallengeSize = 64;
});
```

The `SignInManager` passkey APIs have also been simplified. Passkey creation and request options can now be created as shown below:

```csharp
// Makes passkey options for use with the JS `navigator.credentials.create()` API:
var optionsJson = await signInManager.MakePasskeyCreationOptionsAsync(new()
{
    Id = userId,
    Name = userName,
    DisplayName = displayName,
});

// Makes passkey options for use with the JS `navigator.credentials.get()` API:
var optionsJson = await signInManager.MakePasskeyRequestOptionsAsync(user);
```

Below is an example of how a new passkey can be validated and added to a user:

```csharp
// 'credentialJson' is the JSON-serialized result from `navigator.credentials.create()`.
var attestationResult = await SignInManager.PerformPasskeyAttestationAsync();
if (attestationResult.Succeeded)
{
    var addPasskeyResult = await UserManager.AddOrUpdatePasskeyAsync(user, attestationResult.Passkey);
    // ...
}
else { /* ... */ }
```

To sign in with a passkey, use `SignInManager.PasskeySignInAsync()`:

```csharp
// 'credentialJson' is the JSON-serialized result from `navigator.credentials.get()`.
var result = await signInManager.PasskeySignInAsync(credentialJson);
```

### Getting started with passkeys

**For new applications:** The Blazor Web App project template now includes passkey functionality out of the box. Create a new Blazor app with passkey support using:

```sh
dotnet new blazor -au Individual
```

## Support for the .localhost top-level domain

The `.localhost` top-level domain (TLD) is defined in [RFC2606](https://www.rfc-editor.org/rfc/rfc2606) and [RFC6761](https://www.rfc-editor.org/rfc/rfc6761) as being reserved for testing purposes and available for users to use locally as they would any other domain name. This means using a name like `myapp.localhost` locally that resolves to the IP loopback address is allowed and expected according to these RFCs. Additionally, modern evergreen browsers already automatically resolve any `*.localhost` name to the IP loopback address (`127.0.0.1`/`::1`), effectively making them an alias for any service already being hosted at `localhost` on the local machine.

ASP.NET Core has been updated in .NET 10 preview 7 to better support the `.localhost` TLD, such that it can now be easily used when creating and running ASP.NET Core applications in your local development environment. Having different apps running locally be resolvable via different names allows for better separation of some domain-name-associated website assets, e.g. cookies, and makes it easier to identify which app you're browsing via the name displayed in the browser address bar.

ASP.NET Core's built-in HTTP server, Kestrel, will now correctly treat any `*.localhost` name set via [supported endpoint configuration mechanisms](https://learn.microsoft.com/aspnet/core/fundamentals/servers/kestrel/endpoints#configure-endpoints) as the local loopback address and thus bind to it rather than all external address (i.e. bind to `127.0.0.1`/`::1` rather than `0.0.0.0`/`::`). This includes the `"applicationUrl"` property in [launch profiles configured in a *launchSettings.json* file](https://learn.microsoft.com/aspnet/core/fundamentals/environments#development-and-launchsettingsjson), and the `ASPNETCORE_URLS` environment variable. When configured to listen on a `.localhost` address, Kestrel will log an information message for both the `.localhost` **and** `localhost` addresses, to make it clear that both names can be used.

*Note that while web browsers will automatically resolve `*.localhost` names to the local loopback address, other applications may treat `*.localhost` names as a regular domain names and attempt to resolve them via their corresponding DNS stack. If your DNS configuration does not resolve `*.localhost` names to an address then they will fail to connect. You can continue to use the regular `localhost` name to address your applications when not in a web browser.*

The [ASP.NET Core HTTPS development certificate](https://learn.microsoft.com/aspnet/core/security/enforcing-ssl#trust-the-aspnet-core-https-development-certificate) (including the `dotnet dev-certs https` command) have been updated to ensure the certificate is valid for use with the `*.dev.localhost` domain name. After installing .NET 10 SDK preview 7, trust the new developer certificate by running `dotnet dev-certs https --trust` at the command line to ensure your system is configured to trust the new certificate.

*Note that the certificate lists the `*.dev.localhost` name as a Subject Alternative Name (SAN) rather than `*.localhost` as it's invalid to have wildcard certificates for top-level domain names*

The project templates for *ASP.NET Core Empty* (`web`) and *Blazor Web App* (`blazor`) have been updated with a new option that when specified configures the created project to use the `.dev.localhost` domain name suffix, combining it with the project name to allow the app to be browsed to at an address like `https://myapp.dev.localhost:5036`:

```bash
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

## Use PipeReader support in System.Text.Json

MVC, Minimal APIs, and the `HttpRequestJsonExtensions.ReadFromJsonAsync` methods have all been updated to use the new PipeReader support in System.Text.Json without requiring any code changes from applications.

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

Thank you [@marcominerva](https://github.com/marcominerva) for this contribution!

## Blazor improvements

### Blazor resource preloader component renamed

The Blazor component for rendering preloading links has been renamed from `LinkPreload` to `ResourcePreloader`.

### Updated API names for Blazor state persistence

The new Blazor state persistence APIs have been updated:

- Renamed JavaScript APIs: `Blazor.pause()` → `Blazor.pauseCircuit()` and `Blazor.resume()` → `Blazor.resumeCircuit()`
- Renamed C# attribute: `SupplyParameterFromPersistentComponentStateAttribute` → `PersistentStateAttribute`

### InvokeNew renamed to InvokeConstructor

The new `InvokeNew` and `InvokeNewAsync` JavaScript interop methods have been renamed to `InvokeConstructor` and `InvokeConstructorAsync` to better reflect their purpose.

### Support NotFound in custom Blazor routers

Custom Blazor routers can now support `NavigationManager.NotFound()` by subscribing to the `NavigationManager.OnNotFound` event:

```csharp
private void OnNotFoundEvent(object sender, NotFoundEventArgs e)
{
     // Only execute the logic if HTTP response has started,
    // because setting args' Path blocks re-execution
    if (_httpContext?.Response.HasStarted == false)
    {
        return;
    }

    var type = typeof(CustomNotFoundPage);
    var routeAttributes = type.GetCustomAttributes(typeof(RouteAttribute), inherit: true);
    if (routeAttributes.Length == 0)
    {
        throw new InvalidOperationException($"The type {type.FullName} " +
            $"does not have a {typeof(RouteAttribute).FullName} applied to it.");
    }

    var routeAttribute = (RouteAttribute)routeAttributes[0];
    if (routeAttribute.Template != null)
    {
        e.Path = routeAttribute.Template;
    }
}
```

### Updated Blazor metric names

The Blazor diagnostic metrics have been updated to follow OpenTelemetry naming conventions:

| Old | New |
|----------|----------|
| `aspnetcore.components.render_diff` | Split into `aspnetcore.components.render_diff.duration` and `aspnetcore.components.render_diff.size` |
| `aspnetcore.components.navigation` | `aspnetcore.components.navigate` |
| `aspnetcore.components.event_handler` | `aspnetcore.components.handle_event.duration` |
| `aspnetcore.components.update_parameters` | `aspnetcore.components.update_parameters.duration` |

### Validate configured services for Blazor WebAssembly apps on build

Previously, circular DI dependencies in Blazor WebAssembly apps would cause the browser to hang with no error message. Now developers get validation errors at build time instead of runtime hangs when running in development.

To change the default service configuration validation behavior, use the new `UseDefaultServiceProvider` extension methods:

```csharp
builder.UseDefaultServiceProvider(options => 
{
    options.ValidateOnBuild = false;
});
```

## OpenAPI.NET dependency upgraded to stable release

The ASP.NET Core OpenAPI document generation support has been upgraded to use the 2.0.0 stable release of the OpenAPI.NET library. No further breaking changes are expected in the OpenAPI document generation for this release.

## Fix ProducesResponseType Description for Minimal APIs

The Description property for the `ProducesResponseType` attribute is now correctly set in Minimal APIs even when the attribute type and the inferred return type are not an exact match.

Thank you [@sander1095](https://github.com/sander1095) for this contribution!

## Correct metadata type for formdata enum parameters

The metadata type for formdata enum parameters in MVC controller actions has been updated to use the actual enum type instead of string.

Thank you [@ascott18](https://github.com/ascott18) for this contribution!

## Unify handling of documentation IDs in OpenAPI XML comment generator

XML documentation comments from referenced assemblies are now correctly merged if their documentation IDs included return type suffixes. As a result, all valid XML comments are now reliably included in generated OpenAPI documentation, improving doc accuracy and completeness for APIs using referenced assemblies.

## Contributors

Thank you contributors! ❤️

- [@martincostello](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview7+author%3Amartincostello)
- [@benhopkinstech](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview7+author%3Abenhopkinstech)
- [@timdeschryver](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview7+author%3Atimdeschryver)
- [@sander1095](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview7+author%3Asander1095)
- [@marcominerva](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview7+author%3Amarcominerva)
- [@jashook](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview7+author%3Ajashook)
- [@shethaadit](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview7+author%3Ashethaadit)
- [@ladeak](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview7+author%3Aladeak)
- [@ascott18](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview7+author%3Aascott18)
