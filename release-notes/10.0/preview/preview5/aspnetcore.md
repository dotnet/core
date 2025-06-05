# ASP.NET Core in .NET 10 Preview 5 - Release Notes

Here's a summary of what's new in ASP.NET Core in this preview release:

- [Configure Custom Security Descriptors for HTTP.sys Request Queues](#configure-custom-security-descriptors-for-httpsys-request-queues)
- [Validation in Minimal APIs](#validation-in-minimal-apis)
- [Support for generating OpenAPI 3.1](#support-for-generating-openapi-31)
- [OpenAPI metadata from XML doc comments](#openapi-metadata-from-xml-doc-comments)
- [Router has a `NotFoundPage` parameter](#router-has-a-notfoundpage-parameter)

ASP.NET Core updates in .NET 10:

- [What's new in ASP.NET Core in .NET 10](https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-10.0) documentation.
- [Breaking changes](https://docs.microsoft.com/dotnet/core/compatibility/10.0#aspnet-core)
- [Roadmap](https://github.com/dotnet/aspnetcore/issues/59443)

## Configure Custom Security Descriptors for HTTP.sys Request Queues

You can now specify a custom security descriptor for HTTP.sys request queues using the new `RequestQueueSecurityDescriptor` property on `HttpSysOptions`. This feature enables more granular control over access rights for the request queue, helping you tailor security to your application's needs.

### Why this matters

By customizing the security descriptor, you can allow or deny specific users or groups access to the request queue. This is particularly useful in scenarios where you want to restrict or delegate HTTP.sys request handling at the operating system level.

### How to use

Set the `RequestQueueSecurityDescriptor` property to a `GenericSecurityDescriptor` instance when configuring your HTTP.sys server. For example, to allow all users but deny guests:

```csharp
using System.Security.AccessControl;
using System.Security.Principal;
using Microsoft.AspNetCore.Server.HttpSys;

// Create a new security descriptor
var securityDescriptor = new CommonSecurityDescriptor(isContainer: false, isDS: false, sddlForm: string.Empty);

// Create a discretionary access control list (DACL)
var dacl = new DiscretionaryAcl(isContainer: false, isDS: false, capacity: 2);
dacl.AddAccess(
    AccessControlType.Allow,
    new SecurityIdentifier(WellKnownSidType.BuiltinUsersSid, null),
    -1,
    InheritanceFlags.None,
    PropagationFlags.None
);
dacl.AddAccess(
    AccessControlType.Deny,
    new SecurityIdentifier(WellKnownSidType.BuiltinGuestsSid, null),
    -1,
    InheritanceFlags.None,
    PropagationFlags.None
);

// Assign the DACL to the security descriptor
securityDescriptor.DiscretionaryAcl = dacl;

// Configure HTTP.sys options
var builder = WebApplication.CreateBuilder();
builder.WebHost.UseHttpSys(options =>
{
    options.RequestQueueSecurityDescriptor = securityDescriptor;
});
```

### Additional Notes

- The `RequestQueueSecurityDescriptor` applies only when creating a new request queue.
- This property does not affect existing request queues.
- See the official documentation for more information about Windows security descriptors and their usage.

## Validation in Minimal APIs

A number of small improvements and fixes have been made to the validation generator for Minimal APIs that was introduced in preview 4.

To support future work in the space, the underlying validation resolver APIs used to support minimal API validation have been marked as experimental. However, the top-level `AddValidation` APIs and the built-in validation filter are non-experimental.

## Support for generating OpenAPI 3.1

The OpenAPI.NET library used in ASP.NET Core OpenAPI document generation has been upgraded to [v2.0.0-preview18](https://github.com/microsoft/OpenAPI.NET/releases/tag/v2.0.0-preview.18).

## OpenAPI metadata from XML doc comments

Support for generating OpenAPI metadata from XML doc comments has been extended to extract metadata for operation responses from `<returns>` and `<response>` XML tags.

## Router has a `NotFoundPage` parameter

Rendering content after triggering `NavigationManager.NotFound()` method can be now handled by passing a parameter with page type to the `Router`. It is a preferred way over `NotFound` fragment because it supports routing that can be used across different applications code re-execution middleware, including non-blazor ones. If `NotFound` fragment is defined together with `NotFoundPage`, the page has higher priority.

```html
<Router AppAssembly="@typeof(Program).Assembly" NotFoundPage="typeof(Pages.NotFound)">
    <Found Context="routeData">
        <RouteView RouteData="@routeData" />
        <FocusOnNavigate RouteData="@routeData" Selector="h1" />
    </Found>
    <NotFound>This content will be ignored because we have NotFoundPage defined.</NotFound>
</Router>
```

## Contributors

Thank you contributors! ❤️

- [@Dona278](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview5+author%3ADona278)
- [@feiyun0112](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview5+author%3Afeiyun0112)
- [@MohabASHRAF-byte](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview5+author%3AMohabASHRAF-byte)
- [@profet23](https://github.com/dotnet/aspnetcore/pulls?q=is%3Apr+is%3Amerged+milestone%3A10.0-preview5+author%3Apropet23)