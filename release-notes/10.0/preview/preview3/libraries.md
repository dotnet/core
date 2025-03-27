# .NET Libraries in .NET 10 Preview 3 - Release Notes

Here's a summary of what's new in .NET Libraries in this preview release:

- [Feature](#feature)

.NET Libraries updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Feature

Something about the feature.

## Introduce an AOT-Safe Constructor for `ValidationContext`

The `ValidationContext` class is used during options validation to provide validation context. Since extracting the `DisplayName` may involve reflection, all existing constructors of `ValidationContext` are currently marked as unsafe for AOT compilation. As a result, using `ValidationContext` in a native application build can generate warnings indicating that the type is unsafe.

To address this, we are introducing a new [`ValidationContext` constructor](https://github.com/dotnet/runtime/issues/113134#issuecomment-2715310131) that explicitly accepts the `displayName` as a parameter. This new constructor ensures AOT safety, allowing developers to use `ValidationContext` in native builds without encountering errors or warnings.

```csharp
namespace System.ComponentModel.DataAnnotations;

public sealed class ValidationContext
{
    public ValidationContext(object instance, string displayName, IServiceProvider? serviceProvider = null, IDictionary<object, object?>? items = null)
}
```
## Support for Telemetry Schema URLs in `ActivitySource` and `Meter`

[OpenTelemetry](https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification/schemas) defines a specification for supporting Telemetry Schemas. To align with this, the `ActivitySource` and `Meter` classes now support specifying a Telemetry Schema URL during construction. 

This enhancement allows creators of `ActivitySource` and `Meter` instances to define a schema URL for the tracing and metrics data they produce. Consumers of this data can then process it according to the specified schema, ensuring consistency and compatibility.

Additionally, the update introduces `ActivitySourceOptions`, simplifying the creation of `ActivitySource` instances with multiple configuration options.

```csharp
namespace System.Diagnostics
{
    public sealed partial class ActivitySource
    {
        public ActivitySource(ActivitySourceOptions options);
        
        public string? TelemetrySchemaUrl { get; }
    }

    public class ActivitySourceOptions
    {
        public ActivitySourceOptions(string name);

        public string Name { get; set; }
        public string? Version { get; set; }
        public IEnumerable<KeyValuePair<string, object?>>? Tags { get; set; }
        public string? TelemetrySchemaUrl { get; set; }
    }
}

namespace System.Diagnostics.Metrics
{
    public partial class Meter : IDisposable
    {
        public string? TelemetrySchemaUrl { get; }
    }

    public partial class MeterOptions
    {
        public string? TelemetrySchemaUrl { get; set; }
    }
}
```

## Byte-Level Support in BPE Tokenizer

The `BpeTokenizer` has been available in the `Microsoft.ML.Tokenizers` library for some time. This [update](https://github.com/dotnet/machinelearning/pull/7425) introduces support for Byte-Level encoding in the BPE tokenizer.

Byte-Level encoding allows the tokenizer to process vocabulary as UTF-8 bytes, transforming certain characters—for example, spaces are represented as `Ġ`. This enhancement enables the creation of tokenizer objects compatible with models that utilize Byte-Level BPE tokenization, such as the [DeepSeek](https://huggingface.co/deepseek-ai/DeepSeek-R1) model. The [test code](https://github.com/dotnet/machinelearning/blob/1ccbbd4b840e8edc21fcc0fe102e4dfb5ff75eea/test/Microsoft.ML.Tokenizers.Tests/BpeTests.cs#L875) demonstrates how to read a Hugging Face `tokenizer.json` file for DeepSeek and create a corresponding tokenizer object.

Additionally, this update introduces the `BpeOptions` type, making it easier to configure a BPE tokenizer using multiple options. The new factory method `BpeTokenizer.Create(BpeOptions options)` simplifies the instantiation process:

```csharp
BpeOptions bpeOptions = new BpeOptions(vocabs);
BpeTokenizer tokenizer = BpeTokenizer.Create(bpeOptions);
```

