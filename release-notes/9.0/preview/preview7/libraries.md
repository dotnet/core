# Libraries updates in .NET 9 Preview 7

New in .NET Libraries with this release:

- [Removal of `BinaryFormatter` is complete](#removal-of-binaryformatter-is-complete)
- [Enumerate over `ReadOnlySpan<char>.Split()` segments](#enumerate-over-readonlyspancharsplit-segments)
- [`Debug.Assert` now reports assert condition, by default.](#debugassert-now-reports-assert-condition-by-default)
- [Compression APIs now use `zlib-ng`](#compression-apis-now-use-zlib-ng)
- [`Guid.CreateVersion7` enables creating GUIDs with a natural sort order](#guidcreateversion7-enables-creating-guids-with-a-natural-sort-order)
- [`Interlocked.CompareExchange` for more types](#interlockedcompareexchange-for-more-types)
- [AES-GCM and ChaChaPoly1305 algorithms enabled for iOS/tvOS/MacCatalyst](#aes-gcm-and-chachapoly1305-algorithms-enabled-for-iostvosmaccatalyst)
- [Changes to X.509 Certificate Loading](#changes-to-x509-certificate-loading)
- [Support for XPS documents from XPS virtual printer](#support-for-xps-documents-from-xps-virtual-printer)
- [Marking `Tensor<T>` as `Experimental`](#marking-tensort-as-experimental)
- [Introducing Runtime Metrics](#introducing-runtime-metrics)
- [Introducing Environment CpuUsage](#introducing-environment-cpuusage)
- [Adding Metrics Measurement Constructor with TagList Parameter](#adding-metrics-measurement-constructor-with-taglist-parameter)
- [`Microsoft.Bcl.Memory` Compatibility Package](# microsoft-bcl-memory-compatibility-package)

Libraries updates in .NET 9 Preview 7:

- [Release notes](libraries.md)
- [What's new in .NET 9](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) documentation

.NET 9 Preview 7:

- [Discussion](https://aka.ms/dotnet/9/preview7)
- [Release notes](README.md)
- [Runtime release notes](runtime.md)
- [SDK release notes](sdk.md)

## Removal of `BinaryFormatter` is complete

As [announced earlier](https://github.com/dotnet/announcements/issues/293), starting with .NET 9, we no longer include an implementation of `BinaryFormatter` in the runtime (.NET Framework remains unchanged). The APIs are still present, but their implementation always throws an exception, regardless of project type. Hence, setting the existing backwards compatibility flag is no longer sufficient to use `BinaryFormatter`.

* We published the [BinaryFormatter migration guide][migration-guide]. We'd appreciate if could give it a read and give us feedback by filling issues in the [dotnet/docs][dotnet/docs] repo.
* If you experience issues related to BinaryFormatter's removal not addressed in this migration guide, please file an issue in the [dotnet/runtime][dotnet/runtime] repo and indicate that the issue is related to the removal of `BinaryFormatter`.

### Why was `BinaryFormatter` removed?

The primary reason is that `BinaryFormatter` is unsafe. Any deserializer, binary or text, that allows its input to carry information about the objects to be created is a security problem waiting to happen. There is a common weakness enumeration (CWE) that describes the issue: [CWE-502 "Deserialization of Untrusted Data"][CWE502]. `BinaryFormatter` is such a deserializer but this isn't specific to .NET; this applies to any deserializer. Another example is using `eval` in JavaScript to load JSON.

We also cover this in the [BinaryFormatter security guide][security-guide].

### What are my options to move forward?

You have two options to address the removal of `BinaryFormatter`'s implementation:

1. **Migrate away from BinaryFormatter**. We strongly recommend you to investigate options to stop using `BinaryFormatter` due to the associated security risks. The [BinaryFormatter migration guide][migration-guide] lists several options.

2. **Keep using BinaryFormatter**. If you need to continue using `BinaryFormatter` in .NET 9, you need to depend on the unsupported [System.Runtime.Serialization.Formatters][compat-pack] NuGet package, which restores the unsafe legacy functionality and replaces the throwing implementation.

[compat-pack]: https://learn.microsoft.com/dotnet/standard/serialization/binaryformatter-migration-guide/compatibility-package
[migration-guide]: https://learn.microsoft.com/dotnet/standard/serialization/binaryformatter-migration-guide/
[security-guide]: https://learn.microsoft.com/dotnet/standard/serialization/binaryformatter-security-guide
[CWE502]: https://cwe.mitre.org/data/definitions/502.html
[dotnet/docs]: https://github.com/dotnet/docs/issues/new?assignees=&labels=&projects=&template=01-general-issue.yml
[dotnet/runtime]: https://github.com/dotnet/runtime/issues/new

## Enumerate over `ReadOnlySpan<char>.Split()` segments

`string.Split` is a very popular and convenient method for quickly partitioning a string with one or more supplied separators. For code focused on performance, however, the allocation profile of `string.Split` can be prohibitive, allocating a `string` for each parsed component and a `string[]` to store them all. It also doesn't work with spans, so if you have a `ReadOnlySpan<char>` and want to use `string.Split` with it, you're forced to allocate yet another string, converting the `ReadOnlySpan<char>` to a `string` to be able to call the method on it.

In .NET 8, a set of `Split` and `SplitAny` methods were introduced for `ReadOnlySpan<char>`. Rather than returning a new `string[]`, these methods instead accept a destination `Span<Range>` into which to write the bounding indices for each component. This makes the operation fully allocation-free, as no new `string` object is required (each result is represented just as a `Range` within the original span) and no `string[]` needs to be allocated (the results can be written into the supplied destination buffer). This is great when the number of ranges is both known and small, yielding an API that's both efficient and almost as convenient as `string.Split`.

New overloads of `Split` and `SplitAny` have been added to allow incrementally parsing a `ReadOnlySpan<T>` with an a priori unknown number of segments. The new methods enable enumerating through each segment, which is similarly represented as a `Range` that can be used to slice into the original span.

```C#
public static bool ListContainsItem(ReadOnlySpan<char> span, string item)
{
    foreach (Range segment in span.Split(','))
    {
        if (span[segment].SequenceEquals(item))
        {
            return true;
        }
    }

    return false;
}
```

## `Debug.Assert` now reports assert condition, by default

`Debug.Assert` is commonly-used to help validate conditions that are expected to always be true, where failure typically indicates a bug in the code.

There are many overloads of `Debug.Assert`, the simplest of which just accepts a condition:

```C#
Debug.Assert(a > 0 && b > 0);
```

The assert fails if the condition is false. Historically, however, such asserts were void of any information about what condition failed. Now in .NET 9, if no message is explicitly provided by the user, the assert will contain the textual representation of the condition.

For example, for the above assert, rather than getting a message like:

```bash
Process terminated. Assertion failed.
   at Program.SomeMethod(Int32 a, Int32 b)
```

The message will now be like:

```bash
Process terminated. Assertion failed.
a > 0 && b > 0
   at Program.SomeMethod(Int32 a, Int32 b)
```

## Compression APIs now use `zlib-ng`

`System.IO.Compression` features like `ZipArchive`, `DeflateStream`, `GZipStream`, and `ZLibStream` are all based primarily on the zlib library. Now in .NET 9, these features instead all use [zlib-ng](https://github.com/zlib-ng/zlib-ng), yielding more consistent and efficient processing across a wider array of operating systems and hardware.

## `Guid.CreateVersion7` enables creating GUIDs with a natural sort order

`Guid.NewGuid()` creates a `Guid` filled mostly with cryptographically-secure random data, following the [UUID Version 4 specification](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_(random)) in RFC 9562. That same RFC also defines other versions, including [Version 7](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_7_(timestamp_and_random)), which "features a time-ordered value field derived from the widely implemented and well-known Unix Epoch timestamp source". In other words, much of the data is still random, but some of it is reserved for data based on a timestamp, enabling these values to have a natural sort order. In .NET 9, a `Guid` can be created according to Version 7 via the new `Guid.CreateVersion7()` and `Guid.CreateVersion7(DateTimeOffset timestamp)` methods. A `Guid`'s version field can also be retrieved with the new `Version` property.

## `Interlocked.CompareExchange` for more types

In previous versions of .NET, `Interlocked.Exchange` and [`Interlocked.CompareExchange`](https://learn.microsoft.com/dotnet/api/system.threading.interlocked.compareexchange) had overloads for working with `int`, `uint`, `long`, `ulong`, `nint`, `nuint`, `float`, `double`, and `object`, as well as a generic overload for working with any reference type `T`. Now in .NET 9, thanks to several contributions from [@MichalPetryka](https://github.com/MichalPetryka), there are now also overloads for atomically working with `byte`, `sbyte`, `short`, and `ushort`. Moreover, the generic constraint on the generic `Interlocked.Exchange<T>` and `Interlocked.CompareExchange<T>` overloads has been removed, so those methods are no longer constrained to only work with reference types. In addition, they can now work with any primitive type, which includes all of the aforementioned types as well as `bool` and `char`, as well as any enum type.

## AES-GCM and ChaChaPoly1305 algorithms enabled for iOS/tvOS/MacCatalyst

`AesGcm.IsSupported` and `ChaChaPoly1305.IsSupported` now return `true` when running on iOS 13+, tvOS 13+ or Mac Catalyst.

As with macOS, AesGcm on these environments only supports 16-byte (128-bit) tag values.

## Changes to X.509 Certificate Loading

Since .NET Framework 2.0 (way back in 2005) the way to load a certificate has been `new X509Certificate2(bytes)`. There have also been other patterns, such as: `new X509Certificate2(bytes, password, flags)`, `new X509Certificate2(path)`, `new X509Certificate2(path, password, flags)`, and `X509Certificate2Collection.Import(bytes, password, flags)` (and its overloads).

Those methods all used content-sniffing to figure out if the input was something it could handle, and then loaded it if it could. For some callers this was the epitome of convenience, for others it was frustration that not every file format worked on every OS. For some it was a protocol deviation, and for a few it was a source of security issues.

.NET 9 introduces a new `X509CertificateLoader` class, which has a "one method, one purpose" design. In its initial version, it only supports two of the five formats that the X509Certificate2 constructor supported, but they are the only two formats that worked on all OSes.

The following snippets highlight the new API as a sort of exhaustive textbook example:

```csharp
private static X509Certificate2 LoadSingleCertificate(
    byte[] data,
    X509ContentType format,
    string pfxPassword,
    X509KeyStorageFlags pfxFlags)
{
    switch (format)
    {
        case X509ContentType.Cert:
            return X509CertificateLoader.LoadCertificate(data);
        case X509ContentType.Pkcs12:
        //case X509ContentType.Pfx: //(same thing)
            return X509CertificateLoader.LoadPkcs12(data, pfxPassword, pfxFlags);
        case X509ContentType.Pkcs7:
            SignedCms cms = new SignedCms();
            cms.Decode(data);
            return cms.SignerInfos[0].Certificate ?? throw new CryptographicException();
        case X509ContentType.SerializedCert:
        case X509ContentType.Authenticode:
            // These two formats are only supported on Windows,
            // and only from the obsolete constructors.
            X509ContentType actualType = X509Certificate2.GetCertContentType(data);

            if (actualType != format)
            {
                throw new CryptographicException();
            }

#pragma warning disable SYSLIB0057
            return new X509Certificate2(data);
#pragma warning restore SYSLIB0057
        default:
            throw new CryptographicException();
    }
}

private static X509Certificate2Collection LoadCertificateCollection(
    byte[] data,
    X509ContentType format,
    string pfxPassword,
    X509KeyStorageFlags pfxFlags)
{
    switch (format)
    {
        case X509ContentType.Pkcs12:
            return X509CertificateLoader.LoadPkcs12Collection(data, pfxPassword, pfxFlags);
        case X509ContentType.Pkcs7:
            SignedCms cms = new SignedCms();
            cms.Decode(data);
            return cms.Certificates;
        case X509ContentType.SerializedStore:
            // Only supported on Windows, and only via the obsolete Import method
            X509ContentType actualType = X509Certificate2.GetCertContentType(data);

            if (actualType != format)
            {
                throw new CryptographicException();
            }

            X509Certificate2Collection coll = new X509Certificate2Collection();
#pragma warning disable SYSLIB0057
            coll.Import(data);
#pragma warning restore SYSLIB0057

            return coll;
        default:
            throw new CryptographicException();
    }
}
```

The X509CertificateLoader class is available for callers on older versions of .NET, and for callers on .NET Framework,
via the Microsoft.Bcl.Cryptography compatibility package.

## OpenSSL providers support

In .NET 8, we introduced OpenSSL specific APIs: [SafeEvpPKeyHandle.OpenPrivateKeyFromEngine](https://learn.microsoft.com/dotnet/api/system.security.cryptography.safeevppkeyhandle.openprivatekeyfromengine) and [SafeEvpPKeyHandle.OpenPublicKeyFromEngine](https://learn.microsoft.com/dotnet/api/system.security.cryptography.safeevppkeyhandle.openpublickeyfromengine). They enable interacting with OpenSSL [`ENGINE` components](https://github.com/openssl/openssl/blob/master/README-ENGINES.md) and utilize hardware security modules (HSM), for example.
.NET 9 introduces `SafeEvpPKeyHandle.OpenKeyFromProvider` which enables using [OpenSSL `providers`](https://docs.openssl.org/master/man7/provider/) and interacting with providers such as `tpm2` or `pkcs11`.

Some distros have [removed `ENGINE` support](https://github.com/dotnet/runtime/issues/104775) since it is now deprecated.

The following snippet shows basic usage:

```csharp
byte[] data = ...;

// Refer to provider documentation you're using, i.e. https://github.com/tpm2-software/tpm2-openssl/tree/master
// specific values are just an illustrative example
using (SafeEvpPKeyHandle priKeyHandle = SafeEvpPKeyHandle.OpenKeyFromProvider("tpm2", "handle:0x81000007"))
using (ECDsa ecdsaPri = new ECDsaOpenSsl(priKeyHandle))
{
    byte[] signature = ecdsaPri.SignData(data, HashAlgorithmName.SHA256);
    // do stuff with signature created by TPM
    // note that some providers i.e. tpm2 do not allow direct operations on public key (verify/encrypt), public key should be exported and re-imported into new ECDsa instance
}
```

Performance improvements may be observed during the TLS handshake as well as improvements to interactions with RSA private keys using `ENGINE` components.

## Windows CNG virtualization-based security

Windows 11 has added new APIs to help secure Windows keys with [virtualization-based security (VBS)](https://techcommunity.microsoft.com/t5/windows-it-pro-blog/advancing-key-protection-in-windows-using-vbs/ba-p/4050988). With this new capability, keys can be protected from admin-level key theft attacks with negligible effect on performance, reliability, or scale.

.NET 9 has added matching `CngKeyCreationOptions` flags.

The following snippet demonstrates how to use one of those flags:

```csharp
using System.Security.Cryptography;

CngKeyCreationParameters cngCreationParams = new()
{
    Provider = CngProvider.MicrosoftSoftwareKeyStorageProvider,
    KeyCreationOptions = CngKeyCreationOptions.RequireVbs | CngKeyCreationOptions.OverwriteExistingKey,
};

using (CngKey key = CngKey.Create(CngAlgorithm.ECDsaP256, "myKey", cngCreationParams))
using (ECDsaCng ecdsa = new ECDsaCng(key))
{
    // do stuff with the key
}
```

In total 3 flags were added:
- `CngKeyCreationOptions.PreferVbs` matching `NCRYPT_PREFER_VBS_FLAG`
- `CngKeyCreationOptions.RequireVbs` matching `NCRYPT_REQUIRE_VBS_FLAG`
- `CngKeyCreationOptions.UsePerBootKey` matching `NCRYPT_USE_PER_BOOT_KEY_FLAG`

## Support for XPS documents from XPS virtual printer

XPS documents coming from a V4 XPS virtual printer could not be opened using the `System.IO.Packaging` library, due to lack of support for handling `.piece` files. Addressing this has been a long-standing request, but now in .NET 9 the gap has been addressed. Thanks to [@edwardneal](https://github.com/edwardneal) for the improvement!

## Marking `Tensor<T>` as `[Experimental]`

We announced the [addition of `Tensor<T>`](../preview4/libraries.md#new-tensort-type) earlier in .NET 9. Adding new built-in types for exchanging tensor data across libraries and allowing accelerated handling for core operations is an important but large undertaking. The work done in .NET 9 currently encompasses 8 types and nearly 600 new public APIs, many of which are generic and can support a `T` that is arbitrary or constrained to one of the [generic math interfaces](https://learn.microsoft.com/dotnet/standard/generics/math).

Due to the size of this work and the recognized importance of it to the long term capability of the .NET ecosystem, it has been decided to mark these new APIs as `[Experimental]` (see https://learn.microsoft.com/dotnet/api/system.diagnostics.codeanalysis.experimentalattribute) for .NET 9 and to plan on supporting them officially in .NET 10 instead. This is being done to allow time for additional feedback from the community and important libraries in the .NET ecosystem that plan on taking advantage of the provided functionality. It also gives us additional time to coordinate with improvements in the C# language to ensure a great end-to-end experience.

### Call to Action

Please try out the new APIs and provide feedback on the overall experience. This includes (but is not limited to) the naming or shape of APIs, any core functionality that appears to be missing or that behaves unexpectedly, and how the general user experience was.

Some additional callouts include:
* Despite being marked `[Experimental]` much of the surface is relatively stable and isn't _expected_ to change. There isn't much you can get wrong for an API like `Add(x, y)` after all. This isn't a guarantee that we won't change such APIs, but the expected churn for these ones is minimal.
* There's known missing functionality such as no operator support given that we want `Tensor<T>` to work over all `T` but `operator +` can only be defined for types that implement the generic math `IAdditionOperators` interface. This requires language support for `extension operators`.
* The `TensorSpan<T>` types can wrap native allocations, but we don't have a non-ref struct type equivalent. Such a type would need to be disposable and needs additional design consideration around how ownership/lifetime tracking works. If this is an important scenario to you, we'd like to hear about it.
* The names/concepts used for some APIs can be very inconsistent across the entire machine learning ecosystem (both inside and outside .NET) and in many cases we opted choose the name that was most consistent with existing .NET concepts or behavior. This decision is typically matching the same semantics given to other major tensor libraries (both in .NET and in other language ecosystems), but if there are any quirks or unexpected behaviors found then we'd like to hear about it.

### `TensorPrimitives` is stable and improved

As a final note, the `TensorPrimitives` class which we shipped in .NET 8 is stable and has been expanded in .NET 9 with additional API surface that is also considered stable. It is not marked as `[Experimental]`. It is the class that contains most of the accelerated algorithms that underpin the `Tensor<T>` type and so they can still be used to accelerate your code where applicable. There are many potential applications for these algorithms including in machine learning/AI, image processing, games, and beyond.

## Introducing Runtime Metrics

.NET has long supported [System.Runtime Counters](https://learn.microsoft.com/dotnet/core/diagnostics/available-counters#systemruntime-counters). With the introduction of the [Metrics](https://learn.microsoft.com/dotnet/core/diagnostics/metrics) feature, it became a natural step to [expose runtime counters as metrics](https://github.com/dotnet/runtime/pull/104680). This enhancement allows users to collect runtime metrics more flexibly and enables support for telemetry platforms like OpenTelemetry.

The detailed semantic conventions for runtime metrics can be found [here](https://github.com/open-telemetry/semantic-conventions/blob/main/model/metrics/dotnet-metrics.yaml). Users or tools can collect runtime metrics by using the `System.Diagnostics.Metrics` event source provider to listen to the meter named `System.Runtime`. Below is an example of how to use the [`dotnet-counters`](https://learn.microsoft.com/dotnet/core/diagnostics/dotnet-counters) tool to listen and display runtime metrics for a specific process ID:

```terminal
 dotnet-counters monitor --process-id 29104 --counters System.Runtime
```

The output of this command will be like the following:

```terminal
Press p to pause, r to resume, q to quit.
    Status: Running

Name                                                                         Current Value
[System.Runtime]
    dotnet.assembly.count ({assembly})                                              16
    dotnet.gc.collections ({collection})
        gc.heap.generation
        gen0                                                                         0
        gen1                                                                         0
        gen2                                                                         0
    dotnet.gc.heap.total_allocated (By)                                      1,655,208
    dotnet.gc.pause.time (s)                                                         0
    dotnet.jit.compilation.time (s)                                                  0.245
    dotnet.jit.compiled_il.size (By)                                            81,019
    dotnet.jit.compiled_methods ({method})                                         754
    dotnet.monitor.lock_contentions ({contention})                                   0
    dotnet.process.cpu.count ({cpu})                                                16
    dotnet.process.cpu.time (s)
        cpu.mode
        system                                                                       0.031
        user                                                                         0.156
    dotnet.process.memory.working_set (By)                                  31,395,840
    dotnet.thread_pool.queue.length ({work_item})                                    0
    dotnet.thread_pool.thread.count ({thread})                                       0
    dotnet.thread_pool.work_item.count ({work_item})                                 0
    dotnet.timer.count ({timer})                                                     0
```

## Introducing Environment CpuUsage

.NET has long supported retrieving CPU usage for the current process via properties like [`Process.TotalProcessorTime`](https://learn.microsoft.com/dotnet/api/system.diagnostics.process.totalprocessortime?view=net-8.0), [`PrivilegedProcessorTime`](https://learn.microsoft.com/dotnet/api/system.diagnostics.process.privilegedprocessortime?view=net-8.0), and [`UserProcessorTime`](https://learn.microsoft.com/dotnet/api/system.diagnostics.process.userprocessortime?view=net-8.0). However, these properties require a dependency on the `System.Diagnostics.Process` library and involve calling `Process.GetCurrentProcess()` to retrieve the current process. Additionally, since these properties are designed to work with any system process, they introduce extra performance overhead.

The new [`Environment.CpuUsage`](https://github.com/dotnet/runtime/pull/105152) property provides a more efficient way to retrieve CPU usage for the current process, eliminating the need to create a `Process` object.

Here is an example of how to use the `Environment.CpuUsage` property:

```csharp
Environment.ProcessCpuUsage usage = Environment.CpuUsage;

Console.WriteLine($"Total CPU usage: {usage.TotalCpuUsage}");
Console.WriteLine($"User CPU usage: {usage.UserCpuUsage}");
Console.WriteLine($"Kernel CPU usage: {usage.KernelCpuUsage}");
```

## Adding Metrics Measurement Constructor with TagList Parameter

The [`Measurement<T>`](https://learn.microsoft.com/dotnet/api/system.diagnostics.metrics.measurement-1?view=net-8.0) class in the [`System.Diagnostics.Metrics`](https://learn.microsoft.com/dotnet/api/system.diagnostics.metrics?view=net-8.0) namespace has been updated to [include a new constructor](https://github.com/dotnet/runtime/pull/105011) that accepts a [`TagList`](https://learn.microsoft.com/dotnet/api/system.diagnostics.taglist?view=net-8.0) parameter.
This new constructor allows users to create a `Measurement` object with a `TagList` that contains associated tags.
Previously, users who employed `TagList` and called the `Measurement` constructor that accepted an `IEnumerable<KeyValuePair<string,object?>>` had to allocate extra boxing objects, which negated the performance benefits of using `TagList`. With this update, users can now pass `TagList` directly to the `Measurement` constructor, avoiding unnecessary overhead and improving performance.

```csharp
var tags = new TagList() { { "Key1", "Value1" } }
var measurement = new Measurement<int>(10, tags);
```

## Microsoft.Bcl.Memory Compatibility Package

The `Microsoft.Bcl.Memory` compatibility package provides compatibility for the `Base64Url`, `Index` and `Range` types in .NET Framework and .NET Standard 2.0. The package is useful for projects that need to target .NET Framework or .NET Standard 2.0 and want to use such types.

.NET 9.0 introduces the new `Base64Url` class in the `System.Buffers.Text` namespace. Additionally, the types [Index](https://learn.microsoft.com/dotnet/api/system.index?view=net-8.0) and [Range](https://learn.microsoft.com/dotnet/api/system.range?view=net-8.0) were introduced in the `System` namespace starting with .NET 5.0.
However, these types are not supported in .NET Framework or .NET Standard 2.0. To use them in those environments, you can leverage the `Microsoft.Bcl.Memory` compatibility package.

The [`Index` and `Range`](https://github.com/dotnet/runtime/pull/104170) types simplify slicing operations on collections, while [`Base64Url`](https://github.com/dotnet/runtime/pull/103617) enables URL-safe encoding for data in .NET Framework and .NET Standard 2.0.

Here’s an example that implicitly uses the `Index` type:

```csharp
string[] words = ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"];

// Use Index to reference the last element
Console.WriteLine(words[^1]);
// Output: "dog"
```

Here is example of `Base64Url` which is encoding in a URL-safe version of Base64, commonly used in web applications, such as JWT tokens.

```csharp
using System.Buffers.Text;
using System.Text;

// Original data
byte[] data = Encoding.UTF8.GetBytes("Hello World!");

Span<byte> encoded = new byte[Base64Url.GetEncodedLength(data.Length)];
Base64Url.EncodeToUtf8(data, encoded, out int _, out int bytesWritten);

string encodedString = Base64Url.EncodeToString(data);
Console.WriteLine($"Encoded: {encodedString}");
// Encoded: SGVsbG8gV29ybGQh
Span<byte> decoded = new byte[data.Length];
Base64Url.DecodeFromUtf8(encoded[..bytesWritten], decoded, out _, out bytesWritten);

string decodedString = Encoding.UTF8.GetString(decoded[..bytesWritten]);
Console.WriteLine($"Decoded: {decodedString}");
// Decoded: Hello World!
```
