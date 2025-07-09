# .NET Libraries in .NET 10 Preview 6 - Release Notes

Here's a summary of what's new in .NET Libraries in this preview release:

- [Option to disallow duplicate JSON properties](#option-to-disallow-duplicate-json-properties)
- [Strict JSON serialization options](#strict-json-serialization-options)
- [Post-Quantum Cryptography (PQC)](#post-quantum-cryptography-pqc)

.NET Libraries updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Option to disallow duplicate JSON properties

The JSON specification does not specify how to handle duplicate properties when deserializing a JSON payload. This can lead to unexpected results and security vulnerabilities. For example, see https://bishopfox.com/blog/json-interoperability-vulnerabilities and https://nvd.nist.gov/vuln/detail/CVE-2017-12635. This release introduces the `AllowDuplicateProperties` option to disallow duplicate JSON properties:

```csharp
string json = """{ "Value": 1, "Value": -1 }""";
Console.WriteLine(JsonSerializer.Deserialize<MyRecord>(json).Value); // -1

JsonSerializerOptions options = new() { AllowDuplicateProperties = false };
JsonSerializer.Deserialize<MyRecord>(json, options);                // throws JsonException
JsonSerializer.Deserialize<JsonObject>(json, options);              // throws JsonException
JsonSerializer.Deserialize<Dictionary<string, int>>(json, options); // throws JsonException

JsonDocumentOptions docOptions = new() { AllowDuplicateProperties = false };
JsonDocument.Parse(json, docOptions);   // throws JsonException

record MyRecord(int Value);
```

Duplicate detection works by checking if a value is assigned multiple times during deserialization, so it will work with as expected with other options like case-sensitivity and naming policy.

## Strict JSON serialization options

The JSON serializer accepts many options to customize serialization and deserialization, but the defaults may be too relaxed for some applications. This release adds a new `JsonSerializationOptions.Strict` preset which follows best practices by including the following options:

- Applies the `JsonUnmappedMemberHandling.Disallow` policy
- Disables `AllowDuplicateProperties`
- Preserves case sensitive property binding
- Enables both `RespectNullableAnnotations` and `RespectRequiredConstructorParameters` settings

These options are read-compatible with `JsonSerializationOptions.Default` - an object serialized with `JsonSerializationOptions.Default` can be deserialized with `JsonSerializationOptions.Strict`.

## Post-Quantum Cryptography (PQC)

Windows announced Post-Quantum Cryptography support recently in a [blog post](https://techcommunity.microsoft.com/blog/microsoft-security-blog/post-quantum-cryptography-comes-to-windows-insiders-and-linux/4413803) and in this release we have started adding Windows CNG support to .NET. The following code from the previous release notes now also works on Windows versions with PQC:

```csharp
using System;
using System.IO;
using System.Security.Cryptography;

private static bool ValidateMLDsaSignature(ReadOnlySpan<byte> data, ReadOnlySpan<byte> signature, string publicKeyPath)
{
    string publicKeyPem = File.ReadAllText(publicKeyPath);

    using (MLDsa key = MLDsa.ImportFromPem(publicKeyPem))
    {
        return key.VerifyData(data, signature);
    }
}
```

We are also working on adding downlevel support in Microsoft.Bcl.Cryptography to allow use in .NET Framework. Try out the feature now by installing a Windows Insider build (only available in the Canary Channel at this time).
