# ASP.NET Core in .NET 11 RC 2 - Release Notes

RC 2 improves validation of C# union cases and fixes Blazor and server behavior. The most important upgrade work for earlier .NET 11 previews is described below.

## Breaking changes from .NET 10

- **Additional Razor runtime compilation overloads now warn.** The remaining `AddRazorRuntimeCompilation` overloads are marked obsolete, completing an obsoletion begun in .NET 10. Code that uses those overloads now reports a compiler diagnostic when rebuilt; the runtime behavior is unchanged ([dotnet/aspnetcore #68841](https://github.com/dotnet/aspnetcore/pull/68841)).

## Changes since the previous preview

- **Validation message formatting:** `IValidationMessageFormatter`, introduced during .NET 11 previews, has been removed. Custom validation attributes should override the BCL `ValidationAttribute.FormatMessage(string format, string name)` method instead; RC 2 validation uses that method ([dotnet/aspnetcore #69116](https://github.com/dotnet/aspnetcore/pull/69116), [dotnet/runtime #132853](https://github.com/dotnet/runtime/pull/132853)).
- **`BasePath` namespace:** The Blazor `BasePath` component introduced in Preview 1 moved from `Microsoft.AspNetCore.Components.Endpoints` to `Microsoft.AspNetCore.Components`. Update explicit imports and fully qualified references when upgrading from RC 1 ([dotnet/aspnetcore #69143](https://github.com/dotnet/aspnetcore/pull/69143)).
- **Experimental device-bound sessions:** The server-side `Microsoft.AspNetCore.Authentication.DeviceBoundSessions` implementation described in the RC 1 notes has been removed from this build. Apps testing that experimental package cannot carry their RC 1 configuration forward; use an existing supported authentication scheme instead ([dotnet/aspnetcore #69479](https://github.com/dotnet/aspnetcore/pull/69479)).

## Bug fixes

- **Validation:** The validation generator discovers C# union case types, and Blazor client-side validation handles custom attributes ([dotnet/aspnetcore #68846](https://github.com/dotnet/aspnetcore/pull/68846), [dotnet/aspnetcore #69026](https://github.com/dotnet/aspnetcore/pull/69026)).
- **Blazor:** `Virtualize` with end anchoring now fills the viewport after its initial provider load ([dotnet/aspnetcore #69388](https://github.com/dotnet/aspnetcore/pull/69388)).
- **Kestrel:** HTTP/2 rejects newline characters in trailers and dynamic HPACK table entries ([dotnet/aspnetcore #69247](https://github.com/dotnet/aspnetcore/pull/69247)).
