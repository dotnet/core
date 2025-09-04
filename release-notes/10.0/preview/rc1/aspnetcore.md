# ASP.NET Core updates in .NET 10 Release Candidate 1

Here's a summary of what's new in ASP.NET Core in this release:

* [New ASP.NET Core Identity metrics](#new-aspnet-core-identity-metrics)
* [Validation improvements for Blazor and Minimal APIs](#validation-improvements-for-blazor-and-minimal-apis)
* [OpenAPI schema generation improvements](#openapi-schema-generation-improvements)

ASP.NET Core updates in .NET 10 Release Candidate 1:

* [Release notes](aspnetcore.md)
* [What's new in ASP.NET Core in .NET 10](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-10.0) documentation.
* [Breaking changes](https://docs.microsoft.com/dotnet/core/compatibility/10.0#aspnet-core)
* [Roadmap](https://aka.ms/aspnet/roadmap)

.NET 10 Release Candidate 1:

* [Discussion](https://aka.ms/dotnet/10/rc1)
* [Release notes](README.md)

## New ASP.NET Core Identity metrics

[ASP.NET Core Identity](https://learn.microsoft.com/aspnet/core/security/authentication/identity) observability has been improved in .NET 10 with metrics. Metrics are counters, histograms and gauges that provide time-series measurements of system or application behavior.

You can use the new ASP.NET Core Identity metrics to observe user management, such as new user creations, password changes and role assignments. You can also use the metrics to observe login/session handling, such as login attempts, sign ins and sign outs, and users using two factor authentication.

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

## Validation improvements for Blazor and Minimal APIs

Several features and fixes have been added to the new validation API that is coming in .NET 10 for Minimal APIs and Blazor. The RC1 updates are focused on providing feature parity and behavioral compatibility with the existing `System.ComponentModel.DataAnnotations.Validator`.

### Type-level validation attributes

The new validations now support attributes placed on classes and records themselves.

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

A new `[SkipValidation]` attribute can be used to omit selected properties, parameters, or types from validation. When applied to a property or a method parameter, the validator skips that value during validation. When applied to a type, the validator skips all properties and parameters of that type.

This can be useful, in particular, when using the same model types in cases which require and do not require validation.

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

Additionally, properties annotated with the `[JsonIgnore]` attribute are now also omitted from validation to improve consistency between serialization and validation in the context of JSON models. Note that the `[SkipValidation]` attribute should be preferred in general cases.

### Backwards-compatible behavior

Type validation logic has been updated to match the behavior of `System.ComponentModel.DataAnnotations.Validator` with regards to order of validations and short-circuiting. This means that the following rules are applied when validating an instance of type `T`:

1. Member properties of `T` are validated, including recursively validating nested objects.
2. Type-level attributes of `T` are validated.
3. The `IValidatableObject.Validate` method is executed, if `T` implements it.

In case one of these steps produces a validation error, the following steps are skipped.

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

* [@bkoelman](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Abkoelman)
* [@campersau](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Acampersau)
* [@desjoerd](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Adesjoerd)
* [@Elanis](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3AElanis)
* [@ExtraClock](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3AExtraClock)
* [@h5aaimtron](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Ah5aaimtron)
* [@kimsey0](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Akimsey0)
* [@ladeak](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Aladeak)
* [@martincostello](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Amartincostello)
* [@medhatiwari](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Amedhatiwari)
* [@navferty](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Anavferty)
* [@oroztocil](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3Aoroztocil)
* [@ReaganYuan](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3AReaganYuan)
* [@rkargMsft](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3ArkargMsft)
* [@Sejsel](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3ASejsel)
* [@StickFun](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3AStickFun)
* [@StuartMosquera](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3AStuartMosquera)
* [@WeihanLi](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-rc1+author%3AWeihanLi)
