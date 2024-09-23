# ASP.NET Core updates in .NET 9 Preview 7

Here's a summary of what's new in ASP.NET Core in this preview release:

- [SignalR supports trimming and Native AOT](#signalr-supports-trimming-and-native-aot)
- [Microsoft.AspNetCore.OpenApi supports trimming and Native AOT](#microsoftaspnetcoreopenapi-supports-trimming-and-native-aot)
- [Improvements to transformer registration APIs in Microsoft.AspNetCore.OpenApi](#improvements-to-transformer-registration-apis-in-microsoftaspnetcoreopenapi)
- [Call `ProducesProblem` and `ProducesValidationProblem` on route groups](#call-producesproblem-and-producesvalidationproblem-on-route-groups)
- [Construct `Problem` and `ValidationProblem` result types with `IEnumerable<KeyValuePair<string, object?>>` values](#construct-problem-and-validationproblem-result-types-with-ienumerablekeyvaluepairstring-object-values)
- [`OpenIdConnectHandler` support for Pushed Authorization Requests (PAR)](#openidconnecthandler-support-for-pushed-authorization-requests-par)
- [Data Protection support for deleting keys](#data-protection-support-for-deleting-keys)
- [Customize Kestrel named pipe endpoints](#customize-kestrel-named-pipe-endpoints)
- [Improved Kestrel connection metrics](#improved-kestrel-connection-metrics)
- [Opt-out of HTTP metrics on certain endpoints and requests](#opt-out-of-http-metrics-on-certain-endpoints-and-requests)
- [`ExceptionHandlerMiddleware` option to choose the status code based on the exception](#exceptionhandlermiddleware-option-to-choose-the-status-code-based-on-the-exception)

ASP.NET Core updates in .NET 9 Preview 7:

- [Release notes](aspnetcore.md)
- [What's new in ASP.NET Core in .NET 9](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-9.0) documentation.
- [Breaking changes](https://docs.microsoft.com/dotnet/core/compatibility/9.0#aspnet-core)
- [Roadmap](https://aka.ms/aspnet/roadmap)

.NET 9 Preview 7:

- [Discussion](https://aka.ms/dotnet/9/preview7)
- [Release notes](README.md)

## SignalR supports trimming and Native AOT

Continuing the [Native AOT journey](https://learn.microsoft.com/aspnet/core/fundamentals/native-aot) we started in .NET 8, we've enabled trimming and Native AOT support for both SignalR client and server scenarios. You can now take advantage of the performance benefits of using Native AOT in apps that use SignalR for real-time web communications.

### Getting started

Use the `dotnet new webapiaot` template to create a new project and replace the contents of `Program.cs` with the following SignalR code:


```csharp
using Microsoft.AspNetCore.SignalR;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateSlimBuilder(args);

builder.Services.AddSignalR();
builder.Services.Configure<JsonHubProtocolOptions>(o =>
{
    o.PayloadSerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
});

var app = builder.Build();

app.MapHub<ChatHub>("/chatHub");
app.MapGet("/", () => Results.Content("""
<!DOCTYPE html>
<html>
<head>
    <title>SignalR Chat</title>
</head>
<body>
    <input id="userInput" placeholder="Enter your name" />
    <input id="messageInput" placeholder="Type a message" />
    <button onclick="sendMessage()">Send</button>
    <ul id="messages"></ul>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/8.0.7/signalr.min.js"></script>
    <script>
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("/chatHub")
            .build();

        connection.on("ReceiveMessage", (user, message) => {
            const li = document.createElement("li");
            li.textContent = `${user}: ${message}`;
            document.getElementById("messages").appendChild(li);
        });

        async function sendMessage() {
            const user = document.getElementById("userInput").value;
            const message = document.getElementById("messageInput").value;
            await connection.invoke("SendMessage", user, message);
        }

        connection.start().catch(err => console.error(err));
    </script>
</body>
</html>
""", "text/html"));

app.Run();

[JsonSerializable(typeof(string))]
internal partial class AppJsonSerializerContext : JsonSerializerContext { }

public class ChatHub : Hub
{
    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}
```

Publishing this app produces a native Windows executable of `10 MB` and a Linux executable of `10.9 MB`.

### Limitations

- Only the JSON protocol is currently supported
    - As shown in the preceding code, apps that use JSON serialization and Native AOT must use the `System.Text.Json` Source Generator. This follows the same approach as minimal APIs.
- On the SignalR server, Hub method parameters of type `IAsyncEnumerable<T>` and `ChannelReader<T>` where `T` is a ValueType (i.e. `struct`) aren't supported. Using these types results in a runtime exception at startup in development and in the published app. See https://github.com/dotnet/aspnetcore/issues/56179 for more information.
* [Strongly-typed hubs](https://learn.microsoft.com/aspnet/core/signalr/hubs#strongly-typed-hubs) aren't supported with Native AOT (`PublishAot`). Using strongly-typed hubs with Native AOT will result in warnings during build and publish, and a runtime exception. Using strongly-typed hubs with trimming (`PublishedTrimmed`) is supported.

- Only `Task`, `Task<T>`, `ValueTask`, or `ValueTask<T>` are supported for async return types.

## Microsoft.AspNetCore.OpenApi supports trimming and Native AOT

The new built-in OpenAPI support in ASP.NET Core now also supports trimming and Native AOT.

### Get started

Create a new ASP.NET Core Web API (native AOT) project.

```console
dotnet new webapiaot
```

Add the Microsoft.AspNetCore.OpenAPI package.

```console
dotnet add package Microsoft.AspNetCore.OpenApi --prerelease
```

For this prerelease, you also need to add the latest Microsoft.OpenAPI package to avoid trimming warnings.

```console
dotnet add package Microsoft.OpenApi
```

Update *Program.cs* to enable generating OpenAPI documents.

```diff
+ builder.Services.AddOpenApi();

var app = builder.Build();

+ app.MapOpenApi();
```

Publish the app.

```console
dotnet publish
```

The app should publish cleanly using Native AOT without warnings.

## Improvements to transformer registration APIs in Microsoft.AspNetCore.OpenApi

OpenAPI transformers support modifying the OpenAPI document, operations within the document, or schemas associated with types in the API. In this preview, the APIs for registering transformers on an OpenAPI document provide a variety of options for registering transformers.


Previously, the following APIs where available for registering transformers:

```csharp
OpenApiOptions UseTransformer(Func<OpenApiDocument, OpenApiDocumentTransformerContext, CancellationToken, Task> transformer)
OpenApiOptions UseTransformer(IOpenApiDocumentTransformer transformer)
OpenApiOptions UseTransformer<IOpenApiDocumentTransformer>()
OpenApiOptions UseSchemaTransformer(Func<OpenApiSchema, OpenApiSchemaTransformerContext, CancellationToken, Task>)
OpenApiOptions UseOperationTransformer(Func<OpenApiOperation, OpenApiOperationTransformerContext, CancellationToken, Task>)
```

The new API set is as follows:

```csharp
OpenApiOptions AddDocumentTransformer(Func<OpenApiDocument, OpenApiDocumentTransformerContext, CancellationToken, Task> transformer)
OpenApiOptions AddDocumentTransformer(IOpenApiDocumentTransformer transformer)
OpenApiOptions AddDocumentTransformer<IOpenApiDocumentTransformer>()

OpenApiOptions AddSchemaTransformer(Func<OpenApiSchema, OpenApiSchemaTransformerContext, CancellationToken, Task> transformer)
OpenApiOptions AddSchemaTransformer(IOpenApiSchemaTransformer transformer)
OpenApiOptions AddSchemaTransformer<IOpenApiSchemaTransformer>()

OpenApiOptions AddOperationTransformer(Func<OpenApiOperation, OpenApiOperationTransformerContext, CancellationToken, Task> transformer)
OpenApiOptions AddOperationTransformer(IOpenApiOperationTransformer transformer)
OpenApiOptions AddOperationTransformer<IOpenApiOperationTransformer>()
```

Thanks to [@martincostello](https://github.com/martincostello) for this contribution!

## Call `ProducesProblem` and `ProducesValidationProblem` on route groups

The `ProducesProblem` and `ProducesValidationProblem` extension methods have been updated to support application on route groups. These methods can be used to indicate that all endpoints in a route group can return `ProblemDetails` or `ValidationProblemDetails` responses for the purposes of OpenAPI metadata.

```csharp
var app = WebApplication.Create();

var todos = app.MapGroup("/todos")
    .ProducesProblem();

todos.MapGet("/", () => new Todo(1, "Create sample app", false));
todos.MapPost("/", (Todo todo) => Results.Ok(todo));

app.Run();

record Todo(int Id, string Title, boolean IsCompleted);
```

## Construct `Problem` and `ValidationProblem` result types with `IEnumerable<KeyValuePair<string, object?>>` values

Prior to this preview, constructing `Problem` and `ValidationProblem` result types in minimal APIs required `errors` and `extensions` parameters of type `IDictionary<string, object?>`.  In this release, these construction APIs support overloads that consume `IEnumerable<KeyValuePair<string, object?>>`.

```csharp
using Microsoft.AspNetCore.Http;

var app = WebApplication.Create();

app.MapGet("/", () =>
{
    var extensions = new List<KeyValuePair<string, object>> { new("test", "value") };
    return TypedResults.Problem("This is an error with extensions", extensions: extensions);
});
```

Thank you [@joegoldman2](https://github.com/joegoldman2) for this contribution!

## `OpenIdConnectHandler` support for Pushed Authorization Requests (PAR)

We'd like to thank @josephdecock from @DuendeSoftware for adding Pushed Authorization Requests (PAR) to ASP.NET Core's `OpenIdConnectHandler`. Joe described the background and motivation for enabling PAR in [his API proposal](https://github.com/dotnet/aspnetcore/issues/51686) as follows:

> Pushed Authorization Requests (PAR) is a relatively new [OAuth standard](https://datatracker.ietf.org/doc/html/rfc9126) that improves the security of OAuth and OIDC flows by moving authorization parameters from the front channel to the back channel (that is, from redirect URLs in the browser to direct machine to machine http calls on the back end).
>
> This prevents an attacker in the browser from:
>
> - Seeing authorization parameters (which could leak PII) and from
> - Tampering with those parameters (e.g., the attacker could change the scope of access being requested).
>
> Pushing the authorization parameters also keeps request URLs short. Authorize parameters might get very long when using more complex OAuth and OIDC features such as Rich Authorization Requests, and URLs that are long cause issues in many browsers and networking infrastructure.
>
> The use of PAR is encouraged by the [FAPI working group](https://openid.net/wg/fapi/) within the OpenID Foundation. For example, [the FAPI2.0 Security Profile](https://openid.bitbucket.io/fapi/fapi-2_0-security-profile.html) requires the use of PAR. This security profile is used by many of the groups working on open banking (primarily in Europe), in health care, and in other industries with high security requirements.
>
> PAR is supported by a number of identity providers, including
>
> - Duende IdentityServer
> - Curity
> - Keycloak
> - Authlete

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
        // Other provider-specific configuration goes here.

        // The default value is PushedAuthorizationBehavior.UseIfAvailable.
        oidcOptions.PushedAuthorizationBehavior = PushedAuthorizationBehavior.Disable;
    });
```

To ensure that authentication only succeeds if PAR is used, use `PushedAuthorizationBehavior.Require`.

This change also introduces a new `OnPushAuthorization` event to `OpenIdConnectEvents` which can be used to customize the pushed authorization request or handle it manually. Refer to the [API proposal](https://github.com/dotnet/aspnetcore/issues/51686) for more details.


## Data Protection support for deleting keys

Historically, it has been intentionally impossible to delete data protection keys because doing so makes it impossible to decrypt any data protected with them (i.e. causing data loss).  Fortunately, keys are quite small, so the impact of accumulating many of them is minor.  However, in order to support _very_ long running services, we've added the ability to explicitly delete (typically, very old) keys. Only delete keys when you can accept the risk of data loss in exchange for storage savings.  Our guidance remains that data protection keys shouldn't be deleted.


```csharp
var keyManager = services.GetService<IKeyManager>();
if (keyManager is IDeletableKeyManager deletableKeyManager)
{
    var utcNow = DateTimeOffset.UtcNow;
    var yearGo = utcNow.AddYears(-1);
    if (!deletableKeyManager.DeleteKeys(key => key.ExpirationDate < yearGo))
    {
        throw new InvalidOperationException("Failed to delete keys.");
    }
}
```

## Customize Kestrel named pipe endpoints

Kestrel's named pipe support has been improved with advanced customization options. The new `CreateNamedPipeServerStream` method on the named pipe options allows pipes to be customized per-endpoint.

An example of where this is useful is a Kestrel app that requires two pipe endpoints with different [access security](https://learn.microsoft.com/windows/win32/ipc/named-pipe-security-and-access-rights). The `CreateNamedPipeServerStream` option can be used to create pipes with custom security settings, depending on the pipe name.


```csharp
var builder = WebApplication.CreateBuilder();

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenNamedPipe("pipe1");
    options.ListenNamedPipe("pipe2");
});

builder.WebHost.UseNamedPipes(options =>
{
    options.CreateNamedPipeServerStream = (context) =>
    {
        var pipeSecurity = CreatePipeSecurity(context.NamedPipeEndpoint.PipeName);

        return NamedPipeServerStreamAcl.Create(context.NamedPipeEndPoint.PipeName, PipeDirection.InOut,
            NamedPipeServerStream.MaxAllowedServerInstances, PipeTransmissionMode.Byte,
            context.PipeOptions, inBufferSize: 0, outBufferSize: 0, pipeSecurity);
    };
});
```

## Improved Kestrel connection metrics

We've made a significant improvement to Kestrel's connection metrics by including metadata about why a connection failed. The [`kestrel.connection.duration`](https://learn.microsoft.com/dotnet/core/diagnostics/built-in-metrics-aspnetcore#metric-kestrelconnectionduration) metric now includes the connection close reason in the `error.type` attribute.

Here is a small sample of the `error.type` values:

- `tls_handshake_failed` - The connection requires TLS, and the TLS handshake failed.
- `connection_reset` - The connection was unexpectedly closed by the client while requests were in progress.
- `request_headers_timeout` - Kestrel closed the connection because it didn't receive request headers in time.
- `max_request_body_size_exceeded` - Kestrel closed the connection because uploaded data exceeded max size.

Previously, diagnosing Kestrel connection issues required a server to record detailed, low-level logging. However, logs can be expensive to generate and store, and it can be difficult to find the right information amongst the noise.

Metrics are a much cheaper alternative that can be left on in a production environment with minimal impact. Collected metrics can [drive dashboards and alerts](https://learn.microsoft.com/aspnet/core/log-mon/metrics/metrics#show-metrics-on-a-grafana-dashboard). Once a problem is identified at a high-level with metrics, further investigation using logging and other tooling can begin.

We expect improved connection metrics to be useful in many scenarios:

- Investigating performance issues caused by short connection lifetimes.
- Observing ongoing external attacks on Kestrel that impact performance and stability.
- Recording attempted external attacks on Kestrel that Kestrel's built-in security hardening prevented.

For more information, see [ASP.NET Core metrics](https://learn.microsoft.com/aspnet/core/log-mon/metrics/metrics).

## Opt-out of HTTP metrics on certain endpoints and requests

.NET 9 adds the ability to opt-out of HTTP metrics and not record a value for certain endpoints and requests. It's common for apps to have endpoints that are frequently called by automated systems, such as a health checks endpoint. Recording information about those requests isn't useful.

Endpoint can be excluded from metrics by adding metadata using either of the following approaches:

* Add the `[DisableHttpMetrics]` attribute to your Web API controller, SignalR Hub, or gRPC service
* Call `DisableHttpMetrics()` when mapping endpoints in app startup:

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHealthChecks();

var app = builder.Build();
app.MapHealthChecks("/healthz").DisableHttpMetrics();
app.Run();
```

In more advanced scenarios where a request doesn't map to an endpoint, or you want to opt-out HTTP requests dynamically, use the new `MetricsDisabled` property on `IHttpMetricsTagsFeature`. Set `MetricsDisabled` to true during a HTTP request to opt-out.

```csharp
// Middleware that conditionally opts-out HTTP requests.
app.Use(async (context, next) =>
{
    if (context.Request.Headers.ContainsKey("x-disable-metrics"))
    {
        context.Features.Get<IHttpMetricsTagsFeature>()?.MetricsDisabled = true;
    }

    await next(context);
});
```

## `ExceptionHandlerMiddleware` option to choose the status code based on the exception

A new option when configuring the `ExceptionHandlerMiddleware` allows app developers to choose what status code to return when an exception occurs during application request handling. The new option changes the status code being set in the `ProblemDetails` response from the `ExceptionHandlerMiddleware`.

```csharp
app.UseExceptionHandler(new ExceptionHandlerOptions
{
    StatusCodeSelector = ex => ex is TimeoutException
        ? StatusCodes.Status503ServiceUnavailable
        : StatusCodes.Status500InternalServerError,
});
```

Thanks to [@latonz](https://github.com/latonz) for contributing this new option!

## Community contributors

Thank you contributors! ❤️

- [@SimonCropp](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview7+author%3ASimonCropp)
- [@andrewjsaid](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview7+author%3Aandrewjsaid)
- [@dnperfors](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview7+author%3Adnperfors)
- [@gitslav](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview7+author%3Agitslav)
- [@joegoldman2](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview7+author%3Ajoegoldman2)
- [@josephdecock](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview7+author%3Ajosephdecock)
- [@ladeak](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview7+author%3Aladeak)
- [@latonz](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview7+author%3Alatonz)
- [@martincostello](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview7+author%3Amartincostello)
- [@paulomorgado](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview7+author%3Apaulomorgado)
- [@shoboske](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview7+author%3Ashoboske)
- [@xiaozhao018](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview7+author%3Axiaozhao018)
- [@yepeekai](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A9.0-preview7+author%3Ayepeekai)
