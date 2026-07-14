<!-- Verified against Microsoft.NETCore.App.Ref@11.0.0-preview.6.26328.106 -->
# .NET Libraries in .NET 11 Preview 6 - Release Notes

.NET 11 Preview 6 includes new .NET libraries features and improvements:

- [Stream adapters for memory and text](#stream-adapters-for-memory-and-text)
- [Asynchronous validation with DataAnnotations](#asynchronous-validation-with-dataannotations)
- [System.Text.Json serializes C# union types](#systemtextjson-serializes-c-union-types)
- [Configure Activity tracing with rules](#configure-activity-tracing-with-rules)
- [Cross-lane operations for vectors](#cross-lane-operations-for-vectors)
- [Start processes suspended and look them up by id](#start-processes-suspended-and-look-them-up-by-id)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

.NET Libraries updates in .NET 11:

- [What's new in .NET libraries for .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/libraries)

## Stream adapters for memory and text

Four new `Stream` types wrap common in-memory data so you can hand it to any API that expects a `Stream`, without copying into a `MemoryStream` first ([dotnet/runtime #129811](https://github.com/dotnet/runtime/pull/129811)):

- `ReadOnlyMemoryStream` exposes a `ReadOnlyMemory<byte>` as a read-only stream.
- `WritableMemoryStream` exposes a writable `Memory<byte>` as a fixed-size stream.
- `ReadOnlySequenceStream` exposes a `ReadOnlySequence<byte>` (for example, buffers from `System.IO.Pipelines`) as a stream without flattening it.
- `StringStream` reads a `string` or `ReadOnlyMemory<char>` as a stream using a specified encoding.

```csharp
using System.IO;
using System.Text;

// Pass a string to an API that takes a Stream, no intermediate byte[] needed.
using Stream config = new StringStream(yamlText, Encoding.UTF8);
var settings = ParseConfiguration(config);

// Expose an existing buffer as a read-only stream, for example as an HTTP request body.
ReadOnlyMemory<byte> payload = GetPayload();
using Stream body = new ReadOnlyMemoryStream(payload);
await httpClient.PostAsync(uri, new StreamContent(body));
```

`ReadOnlySequenceStream` is especially useful with `System.IO.Pipelines`, because it streams directly over the segments of a `ReadOnlySequence<byte>` instead of allocating a contiguous copy.

## Asynchronous validation with DataAnnotations

`System.ComponentModel.DataAnnotations` now supports asynchronous validation ([dotnet/runtime #128656](https://github.com/dotnet/runtime/pull/128656)). A validation rule that needs to do I/O — a database lookup, a remote API call — can now run without blocking a thread. There are three new ways to express an async rule:

- Derive from `AsyncValidationAttribute` and override its `IsValidAsync` method.
- Implement `IAsyncValidatableObject` on the model.
- Call the new `Validator.ValidateObjectAsync`, `TryValidateObjectAsync`, `ValidatePropertyAsync`, and `ValidateValueAsync` methods.

```csharp
using System;
using System.ComponentModel.DataAnnotations;

public sealed class ValidVatNumberAttribute : AsyncValidationAttribute
{
    // Synchronous IsValid. This attribute validates asynchronously only.
    protected override ValidationResult? IsValid(object? value, ValidationContext context) =>
        throw new InvalidOperationException("Validate this attribute with IsValidAsync.");
    protected override async Task<ValidationResult?> IsValidAsync(
        object? value, ValidationContext context, CancellationToken cancellationToken)
    {
        var registry = context.GetRequiredService<IVatRegistry>();
        return await registry.IsRegisteredAsync((string?)value, cancellationToken)
            ? ValidationResult.Success
            : new ValidationResult("That VAT number isn't registered with the tax authority.");
    }
}

public class Invoice
{
    // Synchronous rules check the format; the asynchronous rule checks the registry.
    [Required]
    [StringLength(14, MinimumLength = 8)]
    [RegularExpression(@"^[A-Z]{2}[A-Z0-9]+$")]
    [ValidVatNumber] // asynchronous
    public string VatNumber { get; set; } = "";
}

// Always validate on the server during submission.
// Never trust client-side validation as it's purely for an improved user experience.
var context = new ValidationContext(model, serviceProvider, items: null);
await Validator.ValidateObjectAsync(model, context, validateAllProperties: true);
```

`Microsoft.Extensions.Options` gains matching support: options can be validated asynchronously, including at startup through the new `IAsyncStartupValidator` ([dotnet/runtime #128788](https://github.com/dotnet/runtime/pull/128788), [dotnet/runtime #129218](https://github.com/dotnet/runtime/pull/129218)). This lets an app fail fast when an option that requires a network check is misconfigured.

## System.Text.Json serializes C# union types

`System.Text.Json` can now serialize and deserialize the new C# union types ([dotnet/runtime #128162](https://github.com/dotnet/runtime/pull/128162)). The serializer recognizes a union through the new `JsonTypeInfoKind.Union` contract kind, reads and writes the active case, and supports both the reflection-based serializer and the source generator. The new `JsonUnionAttribute`, `JsonUnionCaseInfo`, and type-classifier APIs (`JsonTypeClassifier` and `JsonSerializerOptions.TypeClassifiers`) let you customize how cases are discovered and named.

Union types are a C# language preview feature covered in the [C# release notes](./csharp.md). When you serialize one, `System.Text.Json` writes the value of whichever case is active, so a union of `int` and `string` round-trips cleanly:

```jsonc
// A union value holding its string case
"hello"
// The same union holding its int case
42
```

ASP.NET Core uses this metadata to describe union return types in OpenAPI documents — see the [ASP.NET Core release notes](./aspnetcore.md).

## Configure Activity tracing with rules

A new tracing configuration API in `Microsoft.Extensions.Diagnostics` lets you turn `Activity` tracing on and off with rules instead of wiring up `ActivityListener` instances by hand ([dotnet/runtime #129380](https://github.com/dotnet/runtime/pull/129380)). Call `AddTracing` and describe which activity sources, operations, and listeners to enable or disable. Rules can also be driven from configuration, so tracing can be tuned without a redeploy.

```csharp
builder.Services.AddTracing(tracing =>
{
    tracing.EnableTracing(sourceName: "MyCompany.Orders");
    tracing.DisableTracing(sourceName: "MyCompany.Orders", operationName: "HealthCheck");
});
```

The same release adds `ActivitySourceFactory` and unseals `ActivitySource`, which together support factory-driven creation and refreshable listeners.

## Cross-lane operations for vectors

`Vector128<T>`, `Vector256<T>`, `Vector512<T>`, `Vector64<T>`, and `Vector<T>` gain a set of lane construction and composition methods that previously required hand-written shuffles ([dotnet/runtime #127690](https://github.com/dotnet/runtime/pull/127690)). Thank you [@hez2010](https://github.com/hez2010) for this contribution! The new methods fall into a few families:

- **Patterned construction** — `CreateGeometricSequence`, `CreateAlternatingSequence`, and `CreateHarmonicSequence` build a vector from a starting value and a rule.
- **Interleave and de-interleave** — `Zip`, `ZipLower`/`ZipUpper`, `Unzip`, `UnzipEven`/`UnzipOdd`.
- **Rearrange** — the `Concat` family (`ConcatLowerLower`, `ConcatLowerUpper`, `ConcatUpperLower`, `ConcatUpperUpper`) and `Reverse`.

```csharp
using System.Runtime.Intrinsics;

// {1, 2, 4, 8} — each lane is the previous lane times two
Vector128<int> powers = Vector128.CreateGeometricSequence(1, 2);

// Interleave two vectors lane-by-lane
(Vector128<int> lower, Vector128<int> upper) =
    Vector128.Zip(Vector128.Create(1), Vector128.Create(2));
```

## Start processes suspended and look them up by id

`System.Diagnostics.Process` adds finer control over starting and finding processes ([dotnet/runtime #126705](https://github.com/dotnet/runtime/pull/126705), [dotnet/runtime #129512](https://github.com/dotnet/runtime/pull/129512)):

- `ProcessStartInfo.StartSuspended` starts a process in a suspended state on Windows. Pair it with `SafeProcessHandle.Resume` to let it run once you've finished any setup, such as attaching a debugger or configuring job objects.
- `Process.TryGetProcessById` returns `false` instead of throwing when no process with the given id exists.
- `SafeProcessHandle.Open` and `TryOpen` open a handle to an existing process by id.

```csharp
var startInfo = new ProcessStartInfo("worker.exe") { StartSuspended = true };
using var process = Process.Start(startInfo)!;

// ... attach diagnostics while the process is suspended ...

process.SafeHandle.Resume();
```

## Breaking changes

- **`Process.Run` and `Process.RunAsync` add a `silent` parameter** — the `fileName` overloads of these methods (new in earlier .NET 11 previews) gained a `bool silent = false` parameter before the existing optional parameters ([dotnet/runtime #129509](https://github.com/dotnet/runtime/pull/129509)). Calls that pass the timeout or `CancellationToken` positionally need to be updated to account for the new parameter; calls that use named or default arguments are unaffected.

## Bug fixes

- **System.IO.Compression**
  - Validated uncompressed sizes up front in ZIP archive update mode and added checks for malformed ZIP64 size fields ([dotnet/runtime #128319](https://github.com/dotnet/runtime/pull/128319), [dotnet/runtime #129121](https://github.com/dotnet/runtime/pull/129121)).
- **System.Diagnostics**
  - Fixed `W3CPropagator` compliance with W3C Trace Context Level 2 and hardened baggage parsing after a malformed entry ([dotnet/runtime #129414](https://github.com/dotnet/runtime/pull/129414), [dotnet/runtime #129287](https://github.com/dotnet/runtime/pull/129287)). Thank you [@Kielek](https://github.com/Kielek)!
- **System.Security.Cryptography**
  - Fixed `X509Chain` time validity to no longer depend on the process time zone ([dotnet/runtime #129394](https://github.com/dotnet/runtime/pull/129394)). Thank you [@koen-lee](https://github.com/koen-lee)!
- **System.IO**
  - `FileSystemWatcher` on Linux and macOS now raises the `Error` event when the watcher can't start ([dotnet/runtime #128360](https://github.com/dotnet/runtime/pull/128360)). Thank you [@tmds](https://github.com/tmds)!

## Community contributors

Thank you contributors! ❤️

- [@DoctorKrolic](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3ADoctorKrolic)
- [@hez2010](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Ahez2010)
- [@huoyaoyuan](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Ahuoyaoyuan)
- [@Kielek](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3AKielek)
- [@koen-lee](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Akoen-lee)
- [@prozolic](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Aprozolic)
- [@tmds](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3Atmds)
- [@unsafePtr](https://github.com/dotnet/runtime/pulls?q=is%3Apr+is%3Amerged+author%3AunsafePtr)
