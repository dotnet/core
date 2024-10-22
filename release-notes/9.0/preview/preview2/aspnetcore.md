# ASP.NET Core in .NET 9 Preview 2 Release Notes

Here's a summary of what's new in ASP.NET Core in this preview release:

- Blazor component constructor injection
- WebSocket compression for Blazor interactive server components
- Easier OIDC and OAuth parameter customization
- Configure HTTP.sys extended authentication flags

ASP.NET Core updates in .NET 9 Preview 2:

- [Discussion](https://github.com/dotnet/aspnetcore/discussions/54503)
- [What's new in ASP.NET Core in .NET 9](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-9.0) documentation.
- [Breaking changes](https://docs.microsoft.com/dotnet/core/compatibility/9.0#aspnet-core)
- [Roadmap](https://aka.ms/aspnet/roadmap)

.NET 9 Preview 2:

- [Discussion](https://aka.ms/dotnet/9/preview2)
- [Release notes](README.md)

## Blazor component constructor injection

Blazor components now support constructor injection of configured services. This is in addition to the existing support for property injection of services via `@inject` or using the `[Inject]` attribute.

For example, the following component uses constructor injection with a C# primary constructor to get access to the `NavigationManager` service:

**ConstructorInjection.razor**

```razor
<button @onclick="NavigateToCounter">Go to Counter</button>
```

**ConstructorInjection.razor.cs**

```csharp
using Microsoft.AspNetCore.Components;

public partial class ConstructorInjection(NavigationManager navigationManager)
{
    private void NavigateToCounter() => navigationManager.NavigateTo("/counter");
}
```

## WebSocket compression for Blazor interactive server components

Blazor interactive server rendering now enables WebSocket compression by default, which significantly reduces the message payload size.

To mitigate the risk of compression-related attacks over secure connections, interactive server rendering also now uses a default [Content Security Policy (CSP)](https://developer.mozilla.org/docs/Web/HTTP/CSP) of `frame-ancestor: 'self'`, which specifies the app may be embedded only on pages from the same origin.

To change the `frame-ancestors` source, use the `ContentSecurityFrameAncestorsPolicy` option:

```csharp
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode(o => o.ContentSecurityFrameAncestorsPolicy="'none'");
```

To disable compression, use the `DisableWebSocketCompression` option:

```csharp
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode(o => o.DisableWebSocketCompression = true);
```

## OIDC and OAuth Parameter Customization

The OAuth and OIDC authentication handlers now have a new `AdditionalAuthorizationParameters` option to make it easy to customize authorization message parameters that are usually included as part of the redirect query string. Previously this would have required a custom `OnRedirectToIdentityProvider` callback or overridden `BuildChallengeUrl` method in a custom hander. For example:

```csharp
builder.Services.AddAuthentication().AddOpenIdConnect(options =>
{
    options.Events.OnRedirectToIdentityProvider = context =>
    {
        context.ProtocolMessage.SetParameter("prompt", "login");
        context.ProtocolMessage.SetParameter("audience", "https://api.example.com");
        return Task.CompletedTask;
    };
});
```

Now becomes:

```csharp
builder.Services.AddAuthentication().AddOpenIdConnect(options =>
{
    options.AdditionalAuthorizationParameters.Add("prompt", "login");
    options.AdditionalAuthorizationParameters.Add("audience", "https://api.example.com");
});
```

Thank you [@joegoldman2](https://github.com/joegoldman2) for this contribution!

## Configure HTTP.sys extended authentication flags

You can now configure the [`HTTP_AUTH_EX_FLAG_ENABLE_KERBEROS_CREDENTIAL_CACHING`](https://learn.microsoft.com/windows/win32/api/http/ns-http-http_server_authentication_info) and [`HTTP_AUTH_EX_FLAG_CAPTURE_CREDENTIAL`](https://learn.microsoft.com/windows/win32/api/http/ns-http-http_server_authentication_info) HTTP.sys flags using the new `EnableKerberosCredentialCaching` and `CaptureCredentials` properties on the HTTP.sys [AuthenticationManager](https://learn.microsoft.com/dotnet/api/microsoft.aspnetcore.server.httpsys.authenticationmanager) to optimize how Windows authentication is handled. For example:

```csharp
webBuilder.UseHttpSys(options =>
{
    options.Authentication.Schemes = AuthenticationSchemes.Negotiate;
    options.Authentication.EnableKerberosCredentialCaching = true;
    options.Authentication.CaptureCredentials = true;
});
```

Thank you [@evgenykotkov](https://github.com/evgenykotkov) for this contribution!

## Community contributors

Thank you contributors! ❤️

- [gurustron](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview2+author%3Agurustron)
- [MythoclastBM](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview2+author%3AMythoclastBM)
- [joegoldman2](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview2+author%3Ajoegoldman2)
- [david-acker](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview2+author%3Adavid-acker)
- [sec](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview2+author%3Asec)
- [balazsmeszegeto](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview2+author%3Abalazsmeszegeto)
- [joegoldman2](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview2+author%3Ajoegoldman2)
- [ericmutta](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview2+author%3Aericmutta)
- [abenedykt](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview2+author%3Aabenedykt)
- [martincostello](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview2+author%3Amartincostello)
- [andrewjsaid](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview2+author%3Aandrewjsaid)
- [satma0745](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview2+author%3Asatma0745)
- [Kahbazi](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview2+author%3AKahbazi)
- [evgenykotkov](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview2+author%3Aevgenykotkov)
- [tmds](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview2+author%3Atmds)
