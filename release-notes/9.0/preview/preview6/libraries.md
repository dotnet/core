# Libraries updates in .NET 9 Preview 6

Here's a summary of what's new in .NET Libraries in this preview release:

- [Improvements to System.Numerics](#improvements-to-systemnumerics)
- [Support Primary Constructors in Logging Source Generator](#support-primary-constructors-in-logging-source-generator)
- [System.Text.Json enhancements](#systemtextjson) including a new [JsonSchemaExporter](#jsonschemaexporter), [nullable annotations recognition](#respecting-nullable-annotations), [requiring non-optional constructor parameters](#requiring-non-optional-constructor-parameters), [ordering `JsonObject` properties](#ordering-jsonobject-properties), and new [contract metadata APIs](#additional-contract-metadata-apis)
- [`[GeneratedRegex]` can now be used on properties](#generatedregex-on-properties)
- New [`EnumerateSplits`](#regexenumeratesplits) method for `Regex` to split more collection types
- Introduction of generic `OrderedDictionary` with [`OrderedDictionary<TKey, TValue>`](#ordereddictionarytkey-tvalue) 
- New [`ReadOnlySet<T>`](#readonlysett) when needing to create a read-only wrapper around `ISet<T>`
- [`allows ref struct` used in many places throughout the libraries](#allows-ref-struct-used-in-many-places-throughout-the-libraries)
- [Collection lookups with spans](#collection-lookups-with-spans)
- [More span-based APIs](#more-span-based-apis) including `StartsWith` and `EndsWith` extension methods
- [Base64Url](#base64url) for optimized encoding and decoding
- [SocketsHttpHandler by default in HttpClientFactory](#socketshttphandler-by-default-in-httpclientfactory)
- [TLS resume with client certificates on Linux](#tls-resume-with-client-certificates-on-linux)
- New [`System.Net.ServerSentEvents`](#systemnetserversentevents) library providing a parser for easily ingesting server-sent events
- [Introducing the Metrics Gauge Instrument](#introducing-the-metrics-gauge-instrument) in `System.Diagnostics.Metrics` to record non-additive values when changes occur

Libraries updates in .NET 9 Preview 6:

- [What's new in .NET 9](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview)

.NET 9 Preview 6:

- [Discussion](https://aka.ms/dotnet/9/preview6)
- [Release notes](./README.md)
- [Runtime release notes](./runtime.md)
- [SDK release notes](./sdk.md)

## Improvements to System.Numerics

### BigInteger Upper Limit

`System.Numerics.BigInteger` supports representing integer values of essentially arbitrary length. However, in practice this tends to not be quite so arbitrary due to limits of the underlying computer such as available memory or how long it would take to compute a given expression. Additionally, there exist some APIs where some inputs would already cause failure if the value produced was "too large".

As such, there is now an enforced maximum length of `BigInteger` which is that it can contain no more than `(2^31) - 1` (approx. 2.14 billion) bits. Such a number represents an almost 256MB allocation and would contain approx. 646.5 million digits. This new limit ensures that all APIs exposed are well behaved and consistent while still allowing numbers that are far beyond most usage scenarios.

Programs that are outside these limits are incredibly rare and would already benefit from using a custom algorithm or type that is specialized for that specific domain.

### BigMul APIs

There are now dedicated `BigMul` APIs on `int`, `long`, `uint`, and `ulong` that return the next larger [integer type](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/integral-numeric-types).

The new APIs have the following shape.

```csharp
namespace System;

public partial struct Int32
{
    public static long BigMul(int left, int right);
}

public partial struct Int64
{
    public static Int128 BigMul(long left, long right);
}

public partial struct UInt32
{
    public static ulong BigMul(uint left, uint right);
}

public partial struct Int64
{
    public static UInt128 BigMul(ulong left, ulong right);
}
```

### Vector Conversion APIs

There are now dedicated extension APIs for converting between `Vector2`, `Vector3`, `Vector4`, `Quaternion`, and `Plane`.

The new APIs have the following shape.

```csharp
namespace System.Numerics;

public static partial class Vector
{
    public static Plane AsPlane(this Vector4 value);
    public static Quaternion AsQuaternion(this Vector4 value);
    public static Vector2 AsVector2(this Vector4 value);
    public static Vector3 AsVector3(this Vector4 value);
    public static Vector4 AsVector4(this Plane value);
    public static Vector4 AsVector4(this Quaternion value);
    public static Vector4 AsVector4(this Vector2 value);
    public static Vector4 AsVector4(this Vector3 value);
    public static Vector4 AsVector4Unsafe(this Vector2 value);
    public static Vector4 AsVector4Unsafe(this Vector3 value);
}
```

For same sized conversions such as between `Vector4`, `Quaternion`, and `Plane` these are zero-cost. The same can be said for narrowing conversions such as from `Vector4` to `Vector2` or `Vector3`. For widening conversions, such as from `Vector2` or `Vector3` to `Vector4`, there is the normal API which initializes new elements to `0` and an `Unsafe` suffixed API that leaves these new elements undefined and therefore can be zero-cost.

### Vector Create APIs

There are now new `Create` APIs exposed for `Vector<T>`, `Vector2`, `Vector3`, and `Vector4` that parity the equivalent APIs exposed for the hardware vector types exposed in the `System.Runtime.Intrinsics` namespace.

The new APIs have the following shape.

```csharp
namespace System.Numerics;

public static partial class Vector
{
    public static Vector<T> Create<T>(T value);
    public static Vector<T> Create<T>(ReadOnlySpan<T> values);
}

public partial struct Vector2
{
    public static Vector2 Create(float value);
    public static Vector2 Create(float x, float y);
    public static Vector2 Create(ReadOnlySpan<float> values);
}

public partial struct Vector3
{
        public static Vector3 Create(float value) { throw null; }
        public static Vector3 Create(Vector2 vector, float z) { throw null; }
        public static Vector3 Create(float x, float y, float z) { throw null; }
        public static Vector3 Create(ReadOnlySpan<float> values) { throw null; }
}

public partial struct Vector4
{
    public static Vector4 Create(float value) { throw null; }
    public static Vector4 Create(Vector2 vector, float z, float w) { throw null; }
    public static Vector4 Create(Vector3 vector, float w) { throw null; }
    public static Vector4 Create(float x, float y, float z, float w) { throw null; }
    public static Vector4 Create(ReadOnlySpan<float> values) { throw null; }
}
```

These APIs are primarily for convenience and overall consistency across our SIMD accelerated types.

### Additional Acceleration

Additional performance improvements have been made to many types in the System.Numerics namespace including to `BigInteger`, `Vector2`, `Vector3`, `Vector4`, `Quaternion`, and `Plane`.

In some cases, this has resulted in a 2-5x speedup to core APIs including `Matrix4x4` multiplication, creation of `Plane` from a series of vertices, `Quaternion` concatenation, computing the cross product of a `Vector3`, and more.

Notably there is now also constant folding support for the `SinCos` API, which computes both `Sin(x)` and `Cos(x)` in a single call, allowing it to be overall more efficient.

## Support Primary Constructors in Logging Source Generator

[C# 12 introduced Primary Constructors](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-12#primary-constructors), which allow you to define a constructor directly on the class declaration. The Logging Source Generator now supports logging using classes with a Primary Constructor.

```csharp
public partial class ClassWithPrimaryConstructor(ILogger logger)
{
    [LoggerMessage(0, LogLevel.Debug, "Test.")]
    public partial void Test();
}
```

Special thanks to [Jacob Bundgaard](https://github.com/kimsey0) for this contribution.

See [dotnet/runtime #91121](https://github.com/dotnet/runtime/issues/91121) for a deep dive.

## System.Text.Json

The following new capabilities have been added and improved for System.Text.Json.

### JsonSchemaExporter

JSON is frequently used to represent types in method signatures as part of remote procedure calling schemes. It's used, for example, as part of OpenAPI specifications, or as part of tool calling with AI services like those from OpenAI. Developers can serialize and deserialize .NET types as JSON using System.Text.Json, but they also need to be able to get a JSON schema describing the shape of the .NET type (describing the shape of what would be serialized and what can be deserialized). System.Text.Json now provides the `JsonSchemaExporter` type, which supports generating a JSON schema that represents a .NET type.

The following code generates a JSON schema from a type.

```csharp
using System.Text.Json.Schema;

Console.WriteLine(JsonSchemaExporter.GetJsonSchemaAsNode(JsonSerializerOptions.Default, typeof(Book)));

public class Book
{
    public string Title { get; set; }
    public string? Author { get; set; }
    public int PublishYear { get; set; }
}
```

The generated schema:

```json
{
  "type": [
    "object",
    "null"
  ],
  "properties": {
    "Title": {
      "type": "string"
    },
    "Author": {
      "type": [
        "string",
        "null"
      ]
    },
    "PublishYear": {
      "type": "integer"
    }
  }}
```

### Respecting nullable annotations

System.Text.Json now recognizes nullability annotations of properties and can be configured to enforce those during serialization and deserialization using the `RespectNullableAnnotations` flag.

Setting the new flag:

```csharp
JsonSerializerOptions options = new() { RespectNullableAnnotations = true };

JsonSerializer.Serialize(new MyPoco { Value = null! }, options); // Throws exception
JsonSerializer.Deserialize<MyPoco>("""{ "Value" : null }""", options); // Throws exception

record MyPoco(string Value);
```

The setting can be enabled globally using the `System.Text.Json.JsonSerializerOptions.RespectNullableAnnotations` feature switch, which can be set via your project configuration:

```xml
<ItemGroup>
  <RuntimeHostConfigurationOption Include="System.Text.Json.JsonSerializerOptions.RespectNullableAnnotations" Value="true" />
</ItemGroup>
```

Nullability can be configured on the individual property level using the `JsonPropertyInfo.IsGetNullable` and `JsonPropertyInfo.IsSetNullable` properties.

### Requiring non-optional constructor parameters

Historically, System.Text.Json has treated non-optional constructor parameters as optional when using constructor-based deserialization. This behavior can now be changed using the new `RespectRequiredConstructorParameters` flag.

Setting the new flag:

```csharp
JsonSerializerOptions options = new() { RespectRequiredConstructorParameters = true };

JsonSerializer.Deserialize<MyPoco>("""{}""", options); // Throws exception

record MyPoco(string Value);
```

The setting can be enabled globally using the `System.Text.Json.JsonSerializerOptions.RespectRequiredConstructorParameters` feature switch, which can be set via your project configuration:

```xml
<ItemGroup>
  <RuntimeHostConfigurationOption Include="System.Text.Json.JsonSerializerOptions.RespectRequiredConstructorParameters" Value="true" />
</ItemGroup>
```

As with earlier versions of STJ, required-ness can be configured on the individual property level using the `JsonPropertyInfo.IsRequired` property.

### Ordering `JsonObject` properties

The `JsonObject` type now exposes ordered-dictionary-like APIs that enables explicit property order manipulation

```csharp
JsonObject jObj = new()
{
    ["key1"] = true,
    ["key3"] = 3
}

Console.WriteLine(jObj is IList<KeyValuePair<string, JsonNode?>>); // True

int key3Pos = jObj.IndexOf("key3") is int i and >= 0 ? i : 0;
jObj.InsertAt(key3Pos, "key2", "two");
```

### Additional contract metadata APIs

The JSON contract API now exposes additional metadata including constructor metadata information and improved attribute provider support for the case of the source generator.

The new APIs have the following shape.

```csharp
namespace System.Text.Json.Serialization.Metadata;

public partial class JsonTypeInfo
{
    // Typically the ConstructorInfo of the active deserialization constructor.
    public ICustomAttributeProvider? ConstructorAttributeProvider { get; }
}

public partial class JsonPropertyInfo
{
    public Type DeclaringType { get; }
    // Typically the FieldInfo or PropertyInfo of the property.
    public ICustomAttributeProvider? AttributeProvider { get; set; }
    // The constructor parameter that has been associated with the current property.
    public JsonParameterInfo? AssociatedParameter { get; }
}

public sealed class JsonParameterInfo
{
    public Type DeclaringType { get; }
    public int Position { get; }
    public Type ParameterType { get; }
    public bool HasDefaultValue { get; }
    public object? DefaultValue { get; }
    public bool IsNullable { get; }
    // Typically the ParameterInfo of the parameter.
    public ICustomAttributeProvider? AttributeProvider { get; }
}
```

## `[GeneratedRegex]` on properties

[.NET 7 introduced the `Regex` source generator](https://devblogs.microsoft.com/dotnet/regular-expression-improvements-in-dotnet-7/) and corresponding `[GeneratedRegex(...)]` attribute.

The following partial method will be source generated with all the code necessary to implement this `Regex`.

```csharp
[GeneratedRegex("\b\w{5}\b")]
private static partial Regex FiveCharWord();
```

C# 13 now supports partial properties in addition to partial methods, so in .NET 9 you can now also use `[GeneratedRegex(...)]` on a property.

The following partial method is the property equivalent of the previous example.

```csharp
[GeneratedRegex("\b\w{5}\b")]
private static partial Regex FiveCharWord { get; }
```

## `Regex.EnumerateSplits`

The `Regex` class provides a `Split` method, similar in concept to the `String.Split` method. With `String.Split`, you supply one or more `char` or `string` separators, and the implementation splits the input text on those separators.

The following example demonstrates `String.Split`.

```csharp
foreach (string s in "Hello, world! How are you?".Split('w'))
{
    Console.WriteLine($"Split: \"{s}\"");
}
```

Produces the following output:

```terminal
Split: "Hello, "
Split: "orld! Ho"
Split: " are you?"
```

`Regex` provides a similar `Split` method, but instead of specifying the separator as a `char` or `string`, it's specified as a regular expression pattern.

The following example demonstrates `Regex.Split`.

```csharp
foreach (string s in Regex.Split("Hello, world! How are you?", "[aeiou]"))
{
    Console.WriteLine($"Split: \"{s}\"");
}
```

Produces the following output, split by all English vowels:

```terminal
Split: "H"
Split: "ll"
Split: ", w"
Split: "rld! H"
Split: "w "
Split: "r"
Split: " y"
Split: ""
Split: "?"
```

However, `Regex.Split` only accepts a `string` as input and doesn't support input being provided as a `ReadOnlySpan<char>`, and it outputs the full set of splits as a `string[]`, which requires allocating both the `string[]` to hold the results and a `string` for each split. In .NET 9, the new `EnumerateSplits` method enables performing the same operation, but with a span-based input and without incurring any allocation for the results. It accepts a `ReadOnlySpan<char>` and returns an enumerable of `Range`s representing the results.

The following example demonstrates `Regex.EnumerateSplits`, taking a `ReadOnlySpan<char>` as input.

```csharp
ReadOnlySpan<char> input = "Hello, world! How are you?";
foreach (Range r in Regex.EnumerateSplits(input, "[aeiou]"))
{
    Console.WriteLine($"Split: \"{input[r]}\"");
}
```

## `OrderedDictionary<TKey, TValue>`

A variety of scenarios lead to wanting to store key/value pairs in a way where order can be maintained (a list of key/value pairs) but where fast lookup by key is also supported (a dictionary of key/value pairs). Since the early days of .NET, the `OrderedDictionary` type has supported this scenario, but only in a non-generic manner, with keys and values typed as `object`. .NET 9 introduces the long-requested `OrderedDictionary<TKey, TValue>` collection, which provides an efficient, generic type to support these scenarios.

The following code uses the new class.

```csharp
OrderedDictionary<string, int> d = new()
{
    ["a"] = 1,
    ["b"] = 2,
    ["c"] = 3,
};

d.Add("d", 4);
d.RemoveAt(0);
d.RemoveAt(2);
d.InsertAt(0, "e", 5);

foreach (KeyValuePair<string, int> entry in d)
{
    Console.WriteLine(entry);
}
```

Produces the following output:

```terminal
[e, 5]
[b, 2]
[c, 3]
```

## `ReadOnlySet<T>`

It's often desirable to hand-out read-only views of collections. `ReadOnlyCollection<T>` allows you to create a read-only wrapper around an arbitrary mutable `IList<T>`, and `ReadOnlyDictionary<TKey, TValue>` allows you to create a read-only wrapper around an arbitrary mutable `IDictionary<TKey, TValue>`. However, past versions of .NET had no built-in support for doing the same with `ISet<T>`. .NET 9 introduces `ReadOnlySet<T>` to address this.

The new class enables the following usage pattern.

```csharp
private readonly HashSet<int> _set = new();
private readonly ReadOnlySet<int>? _setWrapper;

public ReadOnlySet<int> Set => _setWrapper ??= new(_set);
```

## `allows ref struct` used in many places throughout the libraries

C# 13 introduces the ability to constrain a generic parameter with `allows ref struct`, which tells the compiler and runtime that a `ref struct` may be used for that generic parameter. Many APIs that are compatible with this have now been annotated. For example, the `string.Create` method has an overload that lets you create a string by writing directly into its memory, represented as a span. This method has a `TState` argument that's passed from the caller into the delegate that does the actual writing.

That `TState` type parameter on `String.Create` is now annotated with `allows ref struct`:

```csharp
public static string Create<TState>(int length, TState state, SpanAction<char, TState> action)
    where TState : allows ref struct;
```

This enables you to pass a span (or any other `ref struct`) as input to this method.

The following example shows a new `String.ToLowerInvariant` overload using this capability.

```csharp
public static string ToLowerInvariant(ReadOnlySpan<char> input) =>
    string.Create(input.Length, input, static (stringBuffer, input) => input.ToLowerInvariant(stringBuffer));
```

## Collection lookups with spans

In high-performance code, spans are often used to avoid allocating strings unnecessarily, and lookup tables with types like `Dictionary<TKey, TValue>` and `HashSet<T>` are frequently used as caches. However, it's been very challenging to use these types together, as there was no safe, built-in mechanism for doing lookups on these types with spans. Now with the new `allows ref struct` feature in C# 13 and new features on these collection types in .NET 9, it's possible to perform these kinds of lookups.

The following example demonstrates using `Dictionary<TKey, TValue>.GetAlternateLookup`.

```csharp
private readonly Dictionary<string, int> _wordCounts = new(StringComparer.OrdinalIgnoreCase);

[GeneratedRegex("\b\w+\b")]
private static partial Regex WordMatcher { get; }

private static Dictionary<string, int> CountWords(ReadOnlySpan<char> input)
{
    Dictionary<string, int> wordCounts = new(StringComparer.OrdinalIgnoreCase);
    var spanLookup = wordCounts.GetAlternateLookup<string, int, ReadOnlySpan<char>>();

    foreach (Range wordRange in WordMatcher.EnumerateSplits(input))
    {
        ReadOnlySpan<char> word = input[wordRange];
        spanLookup[word] = spanLookup.TryGetValue(word, out int count) ? count + 1 : 1;
    }

    return wordCounts;
}
```

> [!NOTE]
> In Preview 6, `EqualityComparer<string>.Default` doesn't implement the necessary interface to allow these alternate lookup methods to function, which is why the previous code sample explicitly specifies a `StringComparer` that does implement the necessary interface. That will be addressed in Preview 7.

## More span-based APIs

`System.Span<T>` and `System.ReadOnlySpan<T>` continue to revolutionize how code is written in .NET, and every release more and more methods are added that operate on spans. The `File` class now has new helpers for easily and directly writing `ReadOnlySpan<char>`/`ReadOnlySpan<byte>` and `ReadOnlyMemory<char>`/`ReadOnlyMemory<byte>` to files.

The following code efficiently writes a `ReadOnlySpan<char>` to a file.

```csharp
ReadOnlySpan<char> text = ...;
File.WriteAllText(filePath, text);
```

New `StartsWith` and `EndsWith` extension methods have also been added for spans, making it easy to test whether a `ReadOnlySpan<T>` starts or ends with a specific `T` value.

The following code uses these new convenience APIs.

```csharp
ReadOnlySpan<char> text = "some arbitrary text";
return text.StartsWith('"') && text.EndsWith('"'); // false
```

## Base64Url

Base64 is an encoding scheme that translates arbitrary bytes into text composed of a specific set of 64 characters. It's a very common approach for transferring data and has long been supported via a variety of methods, such as with `Convert.ToBase64String` or `Base64.DecodeFromUtf8`. However, some of the characters it uses makes it less than ideal for use in some circumstances you might otherwise want to use it, such as in query strings. In particular, the 64 characters that comprise the Base64 table include '+' and '/', both of which have their own meaning in urls. This led to the creation of the Base64Url scheme, which is very similar to Base64, but which uses a slightly different set of characters that makes it appropriate for use in these desirable contexts. .NET 9 now includes the new `Base64Url` class, which provides a plethora of helpful and optimized methods for encoding and decoding with Base64Url to and from a variety of data types.

The following example demonstrates using the new class.

```csharp
ReadOnlySpan<byte> bytes = ...;
string encoded = Base64Url.EncodeToString(bytes);
```

## SocketsHttpHandler by default in HttpClientFactory

`HttpClientFactory` creates `HttpClient` objects backed by `HttpClientHandler`, by default. `HttpClientHandler` is itself backed by `SocketsHttpHandler`, however, `SocketsHttpHandler` is much more configurable, including around connection lifetime management. `HttpClientFactory` now uses `SocketsHttpHandler` by default and will configure it to set limits on its connection lifetimes to match that of the rotation lifetime specified in the factory. This change is in the 9.0 [`Microsoft.Extensions.Http`](https://www.nuget.org/packages/Microsoft.Extensions.Http/) package

## TLS resume with client certificates on Linux

TLS resume is a feature of the TLS protocol which allows resuming previously established sessions to a server. Doing so avoids a few roundtrips and saves computational resources during TLS handshake.

TLS resume has already been supported on Linux for `SslStream` connections without client certificates. This release adds support for TLS resume of mutually authenticated TLS connections, which are common in server-to-server scenarios. The feature is enabled automatically.

## `System.Net.ServerSentEvents`

[Server-sent events (SSE)](https://en.wikipedia.org/wiki/Server-sent_events) are a simple and popular protocol for streaming data from a server to a client. It's used, for example, by OpenAI as part of streaming generated text from its AI services. To simplify the consumption of SSE, the new `System.Net.ServerSentEvents` library provides a parser for easily ingesting server-sent events.

The following code demonstrates using the new class.

```csharp
Stream responseStream = ...;
await foreach (SseItem<string> e in SseParser.Create(responseStream).EnumerateAsync())
{
    Console.WriteLine(e.Data);
}
```

## Introducing the Metrics Gauge Instrument

System.Diagnostics.Metrics now provides the Gauge instrument according to the [OpenTelemetry specification](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/api.md#gauge). The Gauge instrument is designed to record non-additive values when changes occur. For example, it can measure the background noise level, where summing the values from multiple rooms would be nonsensical. The Gauge instrument is a generic type that can record any value type, such as `int`, `double`, or `decimal`.

The following example demonstrates using the the Gauge instrument.

```csharp
    Meter meter = new Meter("MeasurementLibrary.Sound");
    Gauge<int> gauge= meter.CreateGauge<int>(name: "NoiseLevel", unit: "dB", description: "Background Noise Level"); // dB is Decibel, the sound intensity level unit
    gauge.Record(10, new TagList { "Room1", "dB"});
```

The new APIs have the following shape.

```C#
namespace System.Diagnostics.Metrics;

public class Meter : IDisposable
{
	public Gauge<T> CreateGauge<T>(string name) where T : struct {}
	public Gauge<T> CreateGauge<T>(string name, string? unit = null, string? description = null, IEnumerable<KeyValuePair<string, object?>>? tags = null) where T : struct {}
}

public sealed class Gauge<T> : Instrument<T> where T : struct
{
	public void Record(T value) {}
	public void Record(T value, KeyValuePair<string, object?> tag) { }
	public void Record(T value, KeyValuePair<string, object?> tag1, KeyValuePair<string, object?> tag2) { }
	public void Record(T value, KeyValuePair<string, object?> tag1, KeyValuePair<string, object?> tag2, KeyValuePair<string, object?> tag3) { }
	public void Record(T value, params ReadOnlySpan<KeyValuePair<string, object?>> tags) { }
	public void Record(T value, params KeyValuePair<string, object?>[] tags) { }
	public void Record(T value, in TagList tagList) { }
}
```

See [dotnet/runtime #92625](https://github.com/dotnet/runtime/issues/92625) for a deep dive.
