# ASP.NET Core Examples

## Configure suppressing exception handler diagnostics

A new configuration option has been added to the [ASP.NET Core exception handler middleware](https://learn.microsoft.com/aspnet/core/fundamentals/error-handling#exception-handler-page) to control diagnostic output: `ExceptionHandlerOptions.SuppressDiagnosticsCallback`. This callback is passed context about the request and exception, allowing you to add logic that determines whether the middleware should write exception logs and other telemetry.

This setting is useful when you know an exception is transient, or has been handled by the exception handler middleware, and don't want the error logs written to your observability platform.

Additionally, the middleware's default behavior has changed: it no longer writes exception diagnostics for exceptions handled by `IExceptionHandler`. Based on user feedback, logging handled exceptions at the error level was often undesirable when `IExceptionHandler.TryHandleAsync` returned `true`.

---
Source: [.NET 10 Preview 7 — ASP.NET Core](../../../../release-notes/10.0/preview/preview7/aspnetcore.md)
Commentary: Short and focused — three sentences covering the new option, the use case, and a behavior change. No code needed.
Why it works: The reader immediately knows what changed, why, and whether they're affected.

---

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

---
Source: [.NET 10 Preview 7 — ASP.NET Core](../../../../release-notes/10.0/preview/preview7/aspnetcore.md)
Commentary: Medium — behavioral change that's mostly invisible but has an edge case. Gives the workaround and the proper fix.
Why it works: Acknowledges most users won't notice, identifies who *will* be affected, gives an immediate workaround, then the proper fix.

---

## `OpenIdConnectHandler` support for Pushed Authorization Requests (PAR)

We'd like to thank @josephdecock from @DuendeSoftware for adding Pushed Authorization Requests (PAR) to ASP.NET Core's `OpenIdConnectHandler`. Joe described the background and motivation for enabling PAR in [his API proposal](https://github.com/dotnet/aspnetcore/issues/51686) as follows:

> Pushed Authorization Requests (PAR) is a relatively new [OAuth standard](https://datatracker.ietf.org/doc/html/rfc9126) that improves the security of OAuth and OIDC flows by moving authorization parameters from the front channel to the back channel (that is, from redirect URLs in the browser to direct machine to machine http calls on the back end).
>
> This prevents an attacker in the browser from:
>
> - Seeing authorization parameters (which could leak PII) and from
> - Tampering with those parameters (e.g., the attacker could change the scope of access being requested).
>
> The use of PAR is encouraged by the [FAPI working group](https://openid.net/wg/fapi/) within the OpenID Foundation.

PAR is now enabled by default if the identity provider's discovery document advertises support for it. The identity provider's discovery document is usually found at `.well-known/openid-configuration`. This change should provide enhanced security for providers that support PAR. If this causes problems, disable PAR via `OpenIdConnectOptions.PushedAuthorizationBehavior` as follows:

```csharp
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
    })
    .AddCookie()
    .AddOpenIdConnect(oidcOptions =>
    {
        // The default value is PushedAuthorizationBehavior.UseIfAvailable.
        oidcOptions.PushedAuthorizationBehavior = PushedAuthorizationBehavior.Disable;
    });
```

To ensure that authentication only succeeds if PAR is used, use `PushedAuthorizationBehavior.Require`.

This change also introduces a new `OnPushAuthorization` event to `OpenIdConnectEvents` which can be used to customize the pushed authorization request or handle it manually. Refer to the [API proposal](https://github.com/dotnet/aspnetcore/issues/51686) for more details.

---
Source: [.NET 9 Preview 7 — ASP.NET Core](../../../../release-notes/9.0/preview/preview7/aspnetcore.md)
Commentary: Long — community contribution with the contributor's own words explaining significance. Good template for features with security or compliance importance.
Why it works: The block quote lets the contributor explain the significance — more credible than paraphrasing. Then practical: default behavior, how to disable, how to require.

---
