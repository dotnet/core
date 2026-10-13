# ASP.NET Core in .NET 11 RC 2 - Release Notes

.NET 11 RC 2 improves validation of C# union cases and fixes Blazor and server behavior. The most important upgrade work for earlier .NET 11 previews is described below.

## `QuickGrid` virtualization APIs are no longer experimental

`QuickGrid`'s `AnchorMode` and `ItemComparer` parameters are no longer marked `[Experimental("ASP0030")]`, so projects can use them without suppressing `ASP0030` ([dotnet/aspnetcore #69354](https://github.com/dotnet/aspnetcore/pull/69354)).

## Breaking changes from .NET 10

- **Additional Razor runtime compilation overloads now warn.** The remaining `AddRazorRuntimeCompilation` overloads are marked obsolete, completing an obsoletion begun in .NET 10. Code that uses those overloads now reports `ASPDEPR003` when rebuilt. Razor runtime compilation behavior is unchanged, but production apps should use the default build-time compilation and development scenarios should use Hot Reload ([dotnet/aspnetcore #68841](https://github.com/dotnet/aspnetcore/pull/68841)).

## Changes since the previous preview

- **Validation message formatting:** `IValidationMessageFormatter`, introduced during .NET 11 previews, has been removed. Custom validation attributes should override the base `ValidationAttribute.FormatMessage(string format, string name)` method instead if they want to include custom arguments in the localized error message. The `Microsoft.Extensions.Validation` pipeline uses the new `FormatMessage` method since RC 2. ([dotnet/aspnetcore #69116](https://github.com/dotnet/aspnetcore/pull/69116), [dotnet/runtime #132853](https://github.com/dotnet/runtime/pull/132853)).
- **`BasePath` namespace:** The Blazor `BasePath` component introduced in Preview 1 moved from `Microsoft.AspNetCore.Components.Endpoints` to `Microsoft.AspNetCore.Components`. Update explicit imports and fully qualified references when upgrading from RC 1 ([dotnet/aspnetcore #69143](https://github.com/dotnet/aspnetcore/pull/69143)).
- **Experimental device-bound sessions:** The server-side `Microsoft.AspNetCore.Authentication.DeviceBoundSessions` implementation described in the RC 1 notes has been removed from this build. Apps testing that experimental package cannot carry their RC 1 configuration forward; use an existing supported authentication scheme instead ([dotnet/aspnetcore #69479](https://github.com/dotnet/aspnetcore/pull/69479)).

## Bug fixes

- **Validation**
  - [Support validation for C# union cases](https://github.com/dotnet/aspnetcore/pull/68846)
  - [Fix Blazor client-side validation support for custom attributes](https://github.com/dotnet/aspnetcore/pull/69026)
- **Blazor**
  - [Fix `Virtualize` end anchoring after the initial provider load](https://github.com/dotnet/aspnetcore/pull/69388)
- **Kestrel**
  - [Reject newline characters in HTTP/2 trailers and dynamic HPACK table entries](https://github.com/dotnet/aspnetcore/pull/69247)
