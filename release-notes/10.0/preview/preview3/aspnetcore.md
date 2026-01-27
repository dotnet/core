# ASP.NET Core in .NET 10 Preview 3 - Release Notes

Here's a summary of what's new in ASP.NET Core in this preview release:

- [Declarative model for persisting state from components and services](#declarative-model-for-persisting-state-from-components-and-services)
- [Reference fingerprinted static web assets in standalone Blazor WebAssembly apps](#reference-fingerprinted-static-web-assets-in-standalone-blazor-webassembly-apps)
- [`HttpClient` response streaming enabled by default on WebAssembly](#httpclient-response-streaming-enabled-by-default-on-webassembly)
- [`DisableMatchAllIgnoresLeftUriPart` app context switch renamed to `EnableMatchAllForQueryStringAndFragment`](#disablematchallignoreslefturipart-app-context-switch-renamed-to-enablematchallforquerystringandfragment)
- [Set the environment at build-time for standalone Blazor WebAssembly apps](#set-the-environment-at-build-time-for-standalone-blazor-webassembly-apps)
- [Validation support in minimal APIs](#validation-support-in-minimal-apis)
- [OpenAPI support enabled by default in the ASP.NET Core Web API (native AOT) template](#openapi-support-enabled-by-default-in-the-aspnet-core-web-api-native-aot-template)
- [Support for Server-Sent Events (SSE)](#support-for-server-sent-events-sse)
- [OpenAPI operation transformers](#openapi-operation-transformers)

ASP.NET Core updates in .NET 10:

- [What's new in ASP.NET Core in .NET 10](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-10.0) documentation.
- [Breaking changes](https://docs.microsoft.com/dotnet/core/compatibility/10.0#aspnet-core)
- [Roadmap](https://github.com/dotnet/aspnetcore/issues/59443)

## Declarative model for persisting state from components and services

You can now declaratively specify state to persist from components and services using the `SupplyParameterFromPersistentComponentState` attribute. Properties with this attribute will automatically be persisted using the `PersistentComponentState` service during prerendering and then loaded when the component renders interactively or the service is instantiated.

Previously, persisting state from a component during prerendering using the `PersistentComponentState` service involved a significant amount of code:

```razor
@page "/movies"
@inject IMovieService MovieService
@inject PersistentComponentState ApplicationState
@implements IDisposable

<PageTitle>Movies</PageTitle>

<h3>Movies</h3>

@if (MoviesList == null)
{
    <p><em>Loading...</em></p>
}
else
{
    <QuickGrid Items="MoviesList.AsQueryable()">
        <PropertyColumn Property="@(m => m.Title)" Title="Title" Sortable="true"  />
        <PropertyColumn Property="@(m => m.ReleaseDate)" Title="Release Date" Sortable="true" />
        <PropertyColumn Property="@(m => m.Genre)" Title="Genre" Sortable="true" />
        <PropertyColumn Property="@(m => m.Price)" Title="Price" Sortable="true" />
    </QuickGrid>
}

@code {
    public List<Movie>? MoviesList { get; set; }
    private PersistingComponentStateSubscription? persistingSubscription;

    protected override async Task OnInitializedAsync()
    {
        if (!ApplicationState.TryTakeFromJson<List<Movie>>("movies", out var movies))
        {
            MoviesList = await MovieService.GetMoviesAsync();
        }
        else
        {
            MoviesList = movies;
        }

        persistingSubscription = ApplicationState.RegisterOnPersisting(() =>
        {
            ApplicationState.PersistAsJson("movies", MoviesList);
            return Task.CompletedTask;
        });
    }

    public void Dispose() => persistingSubscription?.Dispose();
}
```

This code can now be simplified using the new declarative model:

```razor
@page "/movies"
@inject IMovieService MovieService

<PageTitle>Movies</PageTitle>

<h3>Movies</h3>

@if (MoviesList == null)
{
    <p><em>Loading...</em></p>
}
else
{
    <QuickGrid Items="MoviesList.AsQueryable()">
        <PropertyColumn Property="@(m => m.Title)" Title="Title" Sortable="true"  />
        <PropertyColumn Property="@(m => m.ReleaseDate)" Title="Release Date" Sortable="true" />
        <PropertyColumn Property="@(m => m.Genre)" Title="Genre" Sortable="true" />
        <PropertyColumn Property="@(m => m.Price)" Title="Price" Sortable="true" />
    </QuickGrid>
}

@code {
    [SupplyParameterFromPersistentComponentState]
    public List<Movie>? MoviesList { get; set; }

    protected override async Task OnInitializedAsync()
    {
        MoviesList ??= await MovieService.GetMoviesAsync();
    }
}
```

## Reference fingerprinted static web assets in standalone Blazor WebAssembly apps

Standalone Blazor WebAssembly apps can now reference framework static web assets using either a generated import map or a fingerprinted URL. The import map and fingerprinted URLs are generated during the build process when the `<WriteImportMapToHtml>true</WriteImportMapToHtml>` property is specified in the project file.

blazorwasm.csproj:

```diff
<Project Sdk="Microsoft.NET.Sdk.BlazorWebAssembly">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
+   <WriteImportMapToHtml>true</WriteImportMapToHtml>
  </PropertyGroup>
</Project>
```

To specify where the import map should be generated, add an empty `<script type="importmap"></script>` element to your _index.html_ file. To generate fingerprinted URLs for referenced static web assets, use the `#[.{fingerprint}]` placeholder.

index.html:

```diff
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BlazorWasmFingerprintingE2E</title>
    <base href="/" />
    ....
+    <script type="importmap"></script>
</head>

<body>
    <div id="app">
        <svg class="loading-progress">
            <circle r="40%" cx="50%" cy="50%" />
            <circle r="40%" cx="50%" cy="50%" />
        </svg>
        <div class="loading-progress-text"></div>
    </div>

    <div id="blazor-error-ui">
        An unhandled error has occurred.
        <a href="." class="reload">Reload</a>
        <span class="dismiss">🗙</span>
    </div>
-   <script src="_framework/blazor.webassembly.js"></script>
+   <script src="_framework/blazor.webassembly#[.{fingerprint}].js"></script>
</body>

</html>
```

## `HttpClient` response streaming enabled by default on WebAssembly

Response streaming is now enabled by default for `HttpClient` in Blazor WebAssembly. This change improves performance and reduces memory usage when handling large responses. However, it also means the response stream no longer supports synchronous operations because it is no longer a `MemoryStream`. If your code requires using synchronous operations, you can opt-out of response streaming for an individual request using the `SetBrowserResponseStreamingEnabled` extension method on the response message:

```csharp
requestMessage.SetBrowserResponseStreamingEnabled(false);
```

## `DisableMatchAllIgnoresLeftUriPart` app context switch renamed to `EnableMatchAllForQueryStringAndFragment`

The `Microsoft.AspNetCore.Components.Routing.NavLink.DisableMatchAllIgnoresLeftUriPart` app context switch was renamed to `Microsoft.AspNetCore.Components.Routing.NavLink.EnableMatchAllForQueryStringAndFragment`.

## Set the environment at build-time for standalone Blazor WebAssembly apps

You can now specify the environment for a standalone Blazor WebAssembly app at build-time using the `<WasmApplicationEnvironmentName>` property in the client app's project file (`.csproj`). In .NET 10, the `Blazor-Environment` header is no longer generated or used for setting the client environment.

The following example sets the app's environment to `Staging`:

```xml
<WasmApplicationEnvironmentName>Staging</WasmApplicationEnvironmentName>
```

The default environments applied to the app are:

- `Development` for build.
- `Production` for publish.

## Validation support in minimal APIs

Support for validation in minimal APIs is now available. This feature allows you to request validation of data sent to your API endpoints. When validation is enabled, the ASP.NET Core runtime performs any validations defined on query, header, and route parameters, as well as on the request body. Validations can be defined using attributes in the `System.ComponentModel.DataAnnotations` namespace.

Developers can customize the behavior of the validation system by:

- creating custom [ValidationAttribute](https://learn.microsoft.com/dotnet/api/system.componentmodel.dataannotations.validationattribute) implementations
- implementing the [IValidatableObject](https://learn.microsoft.com/dotnet/api/system.componentmodel.dataannotations.ivalidatableobject) interface for complex validation logic

When validation fails, the runtime returns a 400 Bad Request response with details of the validation errors.

To enable built-in validation support for minimal APIs, call the `AddValidation` extension method to register the required services into the service container for your application.

```csharp
builder.Services.AddValidation();
```

You also need to set the `InterceptorsNamespaces` property in your project file as follows:

```xml
  <PropertyGroup>
    <!-- Enable the generation of interceptors for the validation attributes -->    <InterceptorsNamespaces>$(InterceptorsNamespaces);Microsoft.AspNetCore.Http.Validation.Generated</InterceptorsNamespaces>
  </PropertyGroup>
```

The implementation automatically discovers types that are defined in minimal API handlers or as base types of types defined in minimal API handlers. Validation is performed on these types by an endpoint filter added to each endpoint.

Validation can be disabled for specific endpoints by using the `DisableValidation` extension method.

```csharp
app.MapPost("/products",
    ([EvenNumber(ErrorMessage = "Product ID must be even")] int productId, [Required] string name)
        => TypedResults.Ok(productId))
    .DisableValidation();
```

## OpenAPI support enabled by default in the ASP.NET Core Web API (native AOT) template

The ASP.NET Core Web API (native AOT) project template now has OpenAPI document generation support enabled by default using the Microsoft.AspNetCore.OpenApi package. This support can be disabled if desired, using the `--no-openapi` flag when creating a new project from the command-line interface.

Thank you [@sander1095](https://github.com/sander1095) for this contribution!

## Support for Server-Sent Events (SSE)

ASP.NET Core now supports returning a `ServerSentEvents` result using the `TypedResults.ServerSentEvents` API. This feature is supported in both minimal APIs and controller-based apps.

Server-Sent Events (SSE) is a server push technology that allows a server to send a stream of event messages to a client over a single HTTP connection. In .NET the event messages are represented as [`SseItem<T>`](https://learn.microsoft.com/dotnet/api/system.net.serversentevents.sseitem-1) objects, which may contain an event type, an ID, and a data payload of type `T`.

The TypedResults class includes a new static `ServerSentEvents` method for returning a `ServerSentEvents` result. The first parameter to this method is an `IAsyncEnumerable<SseItem<T>>` that represents the stream of event messages to be sent to the client.

The following example illustrates how to use the  `TypedResults.ServerSentEvents` API to return a stream of heart rate events as JSON objects to the client:

```csharp
app.MapGet("/json-item", (CancellationToken cancellationToken) =>
{
    async IAsyncEnumerable<HeartRateEvent> GetHeartRate(
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            var heartRate = Random.Shared.Next(60, 100);
            yield return HeartRateEvent.Create(heartRate);
            await Task.Delay(2000, cancellationToken);
        }
    }

    return TypedResults.ServerSentEvents(GetHeartRate(cancellationToken), eventType: "heartRate");
});
```

## OpenAPI operation transformers

The new `AddOpenApiOperationTransformer` API makes it easier to customize OpenAPI documentation for your ASP.NET Core endpoints. This API allows you to register custom operation transformers, which modify OpenAPI operation definitions programmatically.
This feature reduces the need for manual intervention or external tools, streamlining the API documentation process.

### Key Features

- **Targeted Transformations**: Use custom or predefined logic to modify individual OpenAPI operations.
- **Support for Multiple Transformers**: Chain multiple transformers to apply different transformations sequentially.

#### Example: Custom transformer

Here’s how you can use the `AddOpenApiOperationTransformer` extension method with a custom transformer:

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello World!")
    .AddOpenApiOperationTransformer((operation, context, cancellationToken) =>
    {
        operation.Description = "This endpoint returns a greeting message.";
        return Task.CompletedTask;
    });

app.Run();
```

#### Example: Predefined and chained transformers

You can also create predefined transformers that you can use on multiple endpoints. These are defined as extension methods on `RouteHandlerBuilder`, and return a `RouteHandlerBuilder` so they can be chained with other methods like `WithName`, `WithTags`, and other operation transformers.
Some example use cases are a transformer to add a description for a specific response code, or a transformer to add a response header.

```csharp
public static class ExtensionMethods
{
    public static RouteHandlerBuilder WithResponseDescription(this RouteHandlerBuilder builder, int statusCode, string description)
    {
        builder.AddOpenApiOperationTransformer((operation, context, cancellationToken) =>
        {
            var response = operation.Responses?.TryGetValue(statusCode.ToString(), out var r) == true ? r : null;
            // The following line uses the new "null conditional assignment" feature of C# 14
            response?.Description = description;
            return Task.CompletedTask;
        });
        return builder;
    }

    public static RouteHandlerBuilder WithLocationHeader(this RouteHandlerBuilder builder)
    {
        builder.AddOpenApiOperationTransformer((operation, context, cancellationToken) =>
        {
            var createdResponse = operation?.Responses?.TryGetValue("201", out var r) == true ? r : null;
            // The following line uses the new "null conditional assignment" feature of C# 14
            createdResponse?.Headers["Location"] = new OpenApiHeader
            {
                Description = "Location of the created resource.",
                Required = true,
                Schema = new OpenApiSchema
                {
                    Type = JsonSchemaType.String,
                    Format = "uri"
                }
            };
            return Task.CompletedTask;
        });
        return builder;
    }
}
```

Here's how you can use the above transformers in your application:

```csharp
app.MapPost("/todos", (Todo todo) =>
        TypedResults.Created($"/todos/{todo.Id}", todo))
    .WithName("CreateTodo")
    .WithResponseDescription(201, "The todo was created successfully.")
    .WithLocationHeader();
```

and the resulting OpenAPI document will look like this:

<!-- In the docs, highlight the response description and response header -->
```json
  "paths": {
    "/todos": {
      "post": {
        "operationId": "CreateTodo",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Todo"
              }
            }
          },
          "required": true
        },
        "responses": {
          "201": {
            "description": "The todo was created successfully.",
            "headers": {
              "Location": {
                "description": "Location of the created resource.",
                "required": true,
                "schema": {
                  "type": "string",
                  "format": "uri"
                }
              }
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Todo"
                }
              }
            }
          }
        }
      }
    }
```

## Community contributors

Thank you contributors! ❤️

- [@NSTom](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3ANSTom)
- [@Varorbc](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3AVarorbc)
- [@Youssef1313](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3AYoussef1313)
- [@alexbeeston](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Aalexbeeston)
- [@benhopkinstech](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Abenhopkinstech)
- [@jnjudge1](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Ajnjudge1)
- [@lextm](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Alextm)
- [@mapedersen](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Amapedersen)
- [@nidaca](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Anidaca)
- [@sander1095](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Asander1095)
- [@shethaadit](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Ashethaadit)
- [@smnsht](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Asmnsht)
- [@xt0rted](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview3+author%3Axt0rted)
