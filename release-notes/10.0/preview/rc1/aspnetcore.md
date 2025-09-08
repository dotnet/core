# ASP.NET Core in .NET 10 RC 1 - Release Notes

Here's a summary of what's new in ASP.NET Core in this release:

* [Persistent component state support for enhanced navigation](#persistent-component-state-support-for-enhanced-navigation)
* [New ASP.NET Core Identity metrics](#new-aspnet-core-identity-metrics)
* [Validation improvements for Minimal APIs and Blazor](#validation-improvements-for-minimal-apis-and-blazor)
* [OpenAPI schema generation improvements](#openapi-schema-generation-improvements)

ASP.NET Core updates in .NET 10 Release Candidate 1:

* [Release notes](aspnetcore.md)
* [What's new in ASP.NET Core in .NET 10](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-10.0) documentation.
* [Breaking changes](https://docs.microsoft.com/dotnet/core/compatibility/10.0#aspnet-core)
* [Roadmap](https://aka.ms/aspnet/roadmap)

.NET 10 Release Candidate 1:

* [Discussion](https://aka.ms/dotnet/10/rc1)
* [Release notes](README.md)

## Persistent component state support for enhanced navigation

Blazor now supports handling persistent component state when doing enhanced navigations. State persisted during an enhanced navigation can be read by interactive components on the page.

By default, persistent component state will only be loaded by interactive components when they are initially loaded on the page. This prevents important state, like data in an edited form, from being overwritten if additional enhanced navigations occur to the same page after the component was already loaded.

If the data is read-only and doesn't change frequently, you can opt-in to allow updates during enhanced navigation by setting `AllowUpdates = true` on the `[PersistentState]` attribute. This is useful for scenarios like displaying cached data that is expensive to fetch but doesn't change often:

```csharp
[PersistentState(AllowUpdates = true)]
public WeatherForecast[]? Forecasts { get; set; }

protected override async Task OnInitializedAsync()
{
    Forecasts ??= await ForecastService.GetForecastAsync();
}
```

To skip restoring state during prerendering, set `RestoreBehavior` to `SkipInitialValue`:

```csharp
// Skip restoration during prerendering
[PersistentState(RestoreBehavior = RestoreBehavior.SkipInitialValue)]
public string NoPrerenderedData { get; set; }
```

To skip restoring state during reconnection, set `RestoreBehavior` to `SkipLastSnapshot`:

```csharp
// Receive updates during enhanced navigation
[PersistentState(RestoreBehavior = RestoreBehavior.SkipLastSnapshot)]
public int CounterNotRestoredOnReconnect { get; set; }
```

You can also call `RegisterOnRestoring` on the `PersistentComponentState` service to register a callback for imperatively controlling how state gets restored. Pass `RestoreOptions` to control when the call back is invoked.

```razor
@implements IDisposable
@inject PersistentComponentState State

@code {
    int currentPage { get; set; } = 1;
    string initialData { get; set; } = "";
    RestoringComponentStateSubscription? currentPageSubscription;
    RestoringComponentStateSubscription? initialDataSubscription;

    protected override void OnInitialized()
    {
        // Register for enhanced navigation updates
        currentPageSubscription = State.RegisterOnRestoring(() =>
        {
            // Only restore navigation-specific state
            currentPage = State.TryTakeFromJson<int>(nameof(currentPage), out var page) ? page : 1;
        }, new RestoreOptions { AllowUpdates = true });

        // Register for prerendering only
        initialDataSubscription = State.RegisterOnRestoring(() =>
        {
            // Only restore during prerendering
            initialData = State.TryTakeFromJson<string>(nameof(initialData), out var data) ? data : "";
        }, new RestoreOptions { RestoreBehavior = RestoreBehavior.SkipLastSnapshot });
    }

    public void Dispose()
    {
        currentPageSubscription?.Dispose();
        initialDataSubscription?.Dispose();
    }
}
```

## New ASP.NET Core Identity metrics

ASP.NET Core Identity now provides built-in metrics (counters, histograms, gauges) for key user and sign-in operations. These metrics let you monitor user management activities like creating users, changing passwords, and assigning roles. You can also track login attempts, sign-ins, sign-outs, and two-factor authentication usage.

The new metrics are in the `Microsoft.AspNetCore.Identity` meter:

* `aspnetcore.identity.user.create.duration`
* `aspnetcore.identity.user.update.duration`
* `aspnetcore.identity.user.delete.duration`
* `aspnetcore.identity.user.check_password_attempts`
* `aspnetcore.identity.user.generated_tokens`
* `aspnetcore.identity.user.verify_token_attempts`
* `aspnetcore.identity.sign_in.authenticate.duration`
* `aspnetcore.identity.sign_in.check_password_attempts`
* `aspnetcore.identity.sign_in.sign_ins`
* `aspnetcore.identity.sign_in.sign_outs`
* `aspnetcore.identity.sign_in.two_factor_clients_remembered`
* `aspnetcore.identity.sign_in.two_factor_clients_forgotten`

For more information about using metrics in ASP.NET Core, see [ASP.NET Core metrics](https://learn.microsoft.com/aspnet/core/log-mon/metrics/metrics).

## Validation improvements for Minimal APIs and Blazor

Several new features and fixes have been added to validation in Minimal APIs and Blazor. These updates improve compatibility and ensure consistent behavior with `System.ComponentModel.DataAnnotations.Validator`.

### Type-level validation attributes

Validation attributes can now be applied directly to classes and records, not just to properties. This lets you enforce validation rules at the type level, making it easier to validate complex objects with custom logic.

```csharp
[SumLimit(42)]
record Point(int X, int Y);

class SumLimitAttribute(int Limit) : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext _)
    {
        if (value is Point point && point.X + point.Y > Limit)
        {
            return new ValidationResult("The sum of X and Y is too high");
        }
        return ValidationResult.Success;
    }
}
```

### Skipping validation

The new `[SkipValidation]` attribute lets you exclude specific properties, parameters, or entire types from validation.

* Apply `[SkipValidation]` to a property or parameter to skip its validation.
* Apply `[SkipValidation]` to a type to skip validation for all its properties and parameters.

This is helpful when you use the same model in scenarios where validation is needed and others where it is not.

```csharp
class Order
{
    public Address PaymentAddress { get; set; }

    [SkipValidation]
    public Address ContactAddress { get; set; }

    // ...
}

class Address
{
    [Required]
    public string Street { get; set; }

    // ...
}
```

Additionally, properties annotated with the `[JsonIgnore]` attribute are now also omitted from validation to improve consistency between serialization and validation in the context of JSON models. Note that the `[SkipValidation]` attribute should be preferred in most cases.

### Backwards-compatible behavior

Type validation logic now matches the behavior of `System.ComponentModel.DataAnnotations.Validator`:

1. Member properties are validated, including recursively validating nested objects.
2. Type-level attributes are validated.
3. The `IValidatableObject.Validate` method is executed.

If one of these steps produces a validation error, the remaining steps are skipped.

## OpenAPI schema generation improvements

Several OpenAPI schema generation improvements have been made in .NET 10 RC1.

### Model nullable types using oneOf in OpenAPI schema

OpenAPI schema generation for nullable types was improved by using the `oneOf` pattern instead of the nullable property for complex types and collections. The implementation:

* Uses `oneOf` with `null` and the actual type schema for nullable complex types in request/response schemas
* Implements proper nullability detection for parameters, properties, and return types using reflection and NullabilityInfoContext
* Prunes null types from componentized schemas to avoid duplication

### Fixes/improvements to schema reference resolution

This release improves the handling of JSON schemas for OpenAPI document generation by properly resolving relative JSON schema references (`$ref`) in the root schema document.

### Include property descriptions as siblings of $ref in OpenAPI schema

Prior to .NET 10, ASP.NET Core discarded descriptions on properties that were defined with `$ref` in the generated OpenAPI document. This was necessary because OpenAPI v3.0 did not allow sibling properties alongside `$ref` in schema definitions. But this restriction has been relaxed in OpenAPI 3.1, allowing descriptions to be included alongside `$ref`. Support was added in RC1 to include property descriptions as siblings of `$ref` in the generated OpenAPI schema.

Thank you [@desjoerd](https://github.com/desjoerd) for this contribution!

### Add metadata from XML comments on `[AsParameters]` types to OpenAPI schema

Support has been added for processing XML comments on properties of `[AsParameters]` parameter classes to extract metadata for use in OpenAPI documentation generation.

### Exclude unknown HTTP methods from OpenAPI

OpenAPI schema generation now excludes unknown HTTP methods from the generated OpenAPI document. In particular, query methods, which are standard HTTP methods but not recognized by OpenAPI, are now gracefully excluded from the generated OpenAPI document.

Thank you [@martincostello](https://github.com/martincostello) for this contribution!

### Improve the description of JSON Patch request bodies

The OpenAPI schema generation for JSON Patch operations now correctly applies the `application/json-patch+json` media type to request bodies that use JSON Patch. This ensures that the generated OpenAPI document accurately reflects the expected media type for JSON Patch operations. In addition, the JSON Patch request body has a detailed schema that describes the structure of the JSON Patch document, including the operations that can be performed.

Thank you [@martincostello](https://github.com/martincostello) for this contribution!

### Use invariant culture for OpenAPI document generation

OpenAPI document generation now uses invariant culture for formatting numbers and dates in the generated OpenAPI document. This ensures that the generated document is consistent and does not vary based on the server's culture settings.

Thank you [@martincostello](https://github.com/martincostello) for this contribution!

## Community contributors

Thank you contributors! ❤️

* [@Elanis](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3AElanis)
* [@ExtraClock](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3AExtraClock)
* [@ReaganYuan](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3AReaganYuan)
* [@Sejsel](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3ASejsel)
* [@StickFun](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3AStickFun)
* [@StuartMosquera](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3AStuartMosquera)
* [@WeihanLi](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3AWeihanLi)
* [@bkoelman](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Abkoelman)
* [@campersau](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Acampersau)
* [@desjoerd](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Adesjoerd)
* [@h5aaimtron](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Ah5aaimtron)
* [@kimsey0](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Akimsey0)
* [@ladeak](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Aladeak)
* [@martincostello](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Amartincostello)
* [@medhatiwari](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Amedhatiwari)
* [@navferty](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Anavferty)
* [@rkargMsft](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3ArkargMsft)
