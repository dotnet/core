# .NET Libraries in .NET 9 Preview 5 - Release Notes

Here's a summary of what's new in .NET Libraries in this preview release:

- [Enhanced AI capabilities with `TensorPrimitives` and `Tensor<T>`](#enhanced-ai-capabilities-with-tensorprimitives-and-tensort)
- [`params` offers better performance with `Span` overloads](#params-offers-better-performance-with-span-overloads)
- [`SearchValues` can search for (multiple) substrings within a string](#searchvalues-can-search-for-multiple-substrings-within-a-string)
- [`foreach` completed tasks with `Task.WhenEach`](#foreach-completed-tasks-with-taskwheneach)
- [Prioritized unbounded channel](#prioritized-unbounded-channel)
- [OpenTelemetry activity linking is more flexible](#opentelemetry-activity-linking-is-more-flexible)
- [TypeDescriptor trimming support](#typedescriptor-trimming-support)
- [Type name parsing](#type-name-parsing)

Libraries updates in .NET 9 Preview 5:

- [What's new in .NET 9](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) documentation

.NET 9 Preview 5:

- [Discussion](https://aka.ms/dotnet/9/preview5)
- [Release notes](./README.md)

## Enhanced AI capabilities with `TensorPrimitives` and `Tensor<T>`

`TensorPrimitives` and the new `Tensor<T>` type expand AI capabilities by enabling efficient encoding, manipulation, and computation of multi-dimensional data.

Updated versions of these types are available in the latest prerelease version of the [System.Numerics.Tensors](https://www.nuget.org/packages/System.Numerics.Tensors/) package.

### `TensorPrimitives`

The `TensorPrimitives` class provides static methods for performing numerical operations on spans of values. The scope of methods exposed by `TensorPrimitives` has been significantly expanded, growing from 40 (with .NET 8) to almost 200 overloads. The surface area encompasses the numerical operations you're used to from types like `Math` and `MathF` as well as the generic math interfaces like `INumber<T>`, except instead of processing an individual value, they process a span of values. Moreover, many operations have been accelerated via SIMD-optimized implementations.

`TensorPrimitives` now exposes generic overloads for any `T` that implements a certain interface. The .NET 8 version only included overloads for manipulating spans of `float` values.

For example, the following .NET 8 code performs [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity) on two vectors of `float` values.

```C#
using System.Numerics.Tensors;

ReadOnlySpan<float> vector1 = [1, 2, 3];
ReadOnlySpan<float> vector2 = [4, 5, 6];
Console.WriteLine(TensorPrimitives.CosineSimilarity(vector1, vector2));

// prints 0.9746318
```

The following overload of `CosineSimilarity` now exists, enabling the same operation to work with spans of `float`, `double`, `Half`, or any other type that implements `IRootFunctions<T>`..

```C#
public static T CosineSimilarity<T>(ReadOnlySpan<T> x, ReadOnlySpan<T> y) where T : IRootFunctions<T>
```

The following example is same as before, but operates on spans of `double`, as demonstrated by the increase in precision compared to the earlier example with `float`.

```C#
using System.Numerics.Tensors;

ReadOnlySpan<double> vector1 = [1, 2, 3];
ReadOnlySpan<double> vector2 = [4, 5, 6];
Console.WriteLine(TensorPrimitives.CosineSimilarity(vector1, vector2));

// prints 0.9746318461970762
```

### `Tensor<T>`

Tensors are the cornerstone data structure of artificial intelligence (AI). They can often be thought of as multidimensional arrays.

Tensors are used to:

- Represent and encode data such as text sequences (tokens), images, video, and audio.
- Efficiently manipulate higher-dimensional data.
- Efficiently apply computations on higher-dimensional data.
- Inside neural networks, they’re used to store weight information and intermediate computations.

The `Tensor<T>` type:

- Provides efficient interop with AI libraries like ML.NET, TorchSharp, and ONNX Runtime using zero copies where possible.
- Builds on top of `TensorPrimitives` for efficient math operations.
- Enables easy and efficient data manipulation by providing indexing and slicing operations.

The following example demonstrates using `Tensor<T>`:

```csharp
using System.Numerics.Tensors;

// Create a tensor (1 x 3)
var t0 = Tensor.Create(new float[] { 1, 2, 3 }, [1,3]); // [[1, 2, 3]]

// Reshape tensor (3 x 1)
var t1 = t0.Reshape(3, 1); // [[1], [2], [3]]

// Slice tensor (2 x 1)
var t2 = t1.Slice(1..,..); // [[2], [3]]

// Broadcast tensor (3 x 1) -> (3 x 3)
// [
//  [ 1, 1, 1],
//  [ 2, 2, 2],
//  [ 3, 3, 3]
// ]
var t3 = Tensor.Broadcast(t1, [3, 3]);

// Math operations
var t4 = Tensor.Add(t0, 1); // [[2, 3, 4]]
var t5 = Tensor.Add(t0, t0); // [[2, 4, 6]]
var t6 = Tensor.Subtract(t0, 1); // [[0, 1, 2]]
var t7 = Tensor.Subtract(t0, t0); // [[0, 0, 0]]
var t8 = Tensor.Multiply(t0, 2); // [[2, 4, 6]]
var t9 = Tensor.Multiply(t0, t0); // [[1, 4, 9]]
var t10 = Tensor.Divide(t0, 2); // [[0.5, 1, 1.5]]
var t11 = Tensor.Divide(t0, t0); // [[1, 1, 1]]
```

## `params` offers better performance with `Span` overloads

Ever since C# 1.0, the C# language has supported marking array parameters as `params`. This enables a simplified calling syntax. For example, the `string.Join` method has long had the following overload:

```C#
public static string Join(string? separator, params string?[] value)
```

This overload can be called with an array:

```C#
string result = string.Join(", ", new string[3] { "a", "b", "c" });
```

It can also be called with the values passed directly:

```C#
string result = string.Join(", ", "a", "b", "c");
```

In this case, the C# compiler emits code identical to the former call, producing an implicit array around those latter three arguments.

The C# language [now allows `params` to be used with any argument](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-13#params-collections) that can be constructed via a collection expression, including spans (`Span<T>` and `ReadOnlySpan<T>`). That is beneficial for a variety of reasons, not the least of which is performance: the C# compiler can store the arguments on the stack, wrap a span around them, and pass that off to the method, avoiding the implicit array allocation that would have otherwise resulted.

.NET 9 now includes over 60 methods with a `params ReadOnlySpan<T>` parameter, some of which are brand new overloads and some of which are existing methods that were already taking a `ReadOnlySpan<T>` and have now had that parameter adorned with `params`. The net effect is you upgrade to .NET 9 and recompile your code, and things just get better. This new behavior is the result of a performance-oriented policy choice by the C# design team, to make the compiler prefer to bind to span-based overloads rather than to the array-based ones.

The `string.Join` method highlighted above now sports the following overload, implementing this new pattern.

```C#
public static string Join(string? separator, params ReadOnlySpan<string?> value)
```

The previously shown call will now be made without allocating an array to pass in the "a", "b", and "c" arguments.

## `SearchValues` can search for (multiple) substrings within a string

.NET 8 introduced the new `SearchValues` type, which provides an optimized solution for searching for specific sets of characters or bytes within spans.

The following example searches for the first hex value in a `ReadOnlySpan<char>`.

```C#
private static readonly SearchValues<char> s_hexDigits = SearchValues.Create("ABCDEFabcdef0123456789");

public static int IndexOfFirstHexDigit(ReadOnlySpan<char> span) =>
    span.IndexOfAny(s_hexDigits);
```

In .NET 9, `SearchValues` has been extended to support searching for substrings within a larger string.

The following example searches for multiple animals within a `string` value, returning an index to the first one found.

```C#
private static readonly SearchValues<string> s_animals =
    SearchValues.Create(["cat", "mouse", "dog", "dolphin"], StringComparison.OrdinalIgnoreCase);
    
public static int IndexOfAnimal(string text) =>
    text.AsSpan().IndexOfAny(s_animals);
```

These new capabilities expand the built-in APIs available with .NET and do so with highly optimized implementation that takes advantage of the SIMD support in the underlying platform. It also then enables higher-level types to be optimized (e.g. `Regex` now utilizes this functionality as part of its implementation).

## `foreach` completed tasks with `Task.WhenEach`

A variety of helpful new APIs have been added for working with `Task`. Of note, the new `Task.WhenEach` method makes it easy to join with tasks that have been scheduled as those tasks complete. Rather than doing things like repeatedly using `Task.WaitAny` on a set of tasks to pick off the next one that completes, `Task.WhenEach` allows for using an `await foreach` in the language to simply iterate through the tasks as they complete.

The following code makes multiple `HttpClient` calls and is able to operate on their results as they complete.

```C#
using HttpClient http = new();

Task<string> dotnet = http.GetStringAsync("http://dot.net");
Task<string> bing = http.GetStringAsync("http://www.bing.com");
Task<string> ms = http.GetStringAsync("http://microsoft.com");

await foreach (Task<string> t in Task.WhenEach(bing, dotnet, ms))
{
    Console.WriteLine(t.Result);
}
```

## Prioritized unbounded channel

The `System.Threading.Channels` library has long provided a `CreateUnbounded<T>` method for creating an "unbounded" channel, one that has no limit on the number of items that may be stored (in contrast to `CreateBounded<T>`, which creates a channel with such a limit). These channels are first-in-first-out (FIFO) in nature, such that elements are read from the channel in the order they were written to it. In .NET 9, the library gains the new `CreateUnboundedPrioritized<T>` method, which orders the elements such that the next element read from the channel is the one deemed to be most important, according to either `Comparer<T>.Default` or a custom `IComparer<T>` supplied to the factory method.

The following example outputs the numbers 1 through 5 in order, even though they were written to the channel in a different order.

```C#
using System.Threading.Channels;

Channel<int> c = Channel.CreateUnboundedPrioritized<int>();

await c.Writer.WriteAsync(1);
await c.Writer.WriteAsync(5);
await c.Writer.WriteAsync(2);
await c.Writer.WriteAsync(4);
await c.Writer.WriteAsync(3);
c.Writer.Complete();

while (await c.Reader.WaitToReadAsync())
{
    while (c.Reader.TryRead(out int item))
    {
        Console.WriteLine(item);
    }
}
```

## OpenTelemetry activity linking is more flexible

[Activity.AddLink](https://github.com/dotnet/runtime/blob/e1f98a13be27efbe0ee3b69aa4673e7e98c5c003/src/libraries/System.Diagnostics.DiagnosticSource/src/System/Diagnostics/Activity.cs#L529) was added to enable linking an `Activity` object to other tracing contexts after `Activity` object creation. This change better aligns .NET with the [OpenTelemetry specifications](https://github.com/open-telemetry/opentelemetry-specification/blob/6360b49d20ae451b28f7ba0be168ed9a799ac9e1/specification/trace/api.md?plain=1#L804).

`Activity` linking was previously only possible as part of [`Activity` creation](https://learn.microsoft.com/dotnet/api/system.diagnostics.activitysource.createactivity?view=net-8.0#system-diagnostics-activitysource-createactivity(system-string-system-diagnostics-activitykind-system-diagnostics-activitycontext-system-collections-generic-ienumerable((system-collections-generic-keyvaluepair((system-string-system-object))))-system-collections-generic-ienumerable((system-diagnostics-activitylink))-system-diagnostics-activityidformat)).

```C#
var activityContext = new ActivityContext(ActivityTraceId.CreateRandom(), ActivitySpanId.CreateRandom(), ActivityTraceFlags.None);
var activityLink = new ActivityLink(activityContext);

var activity = new Activity("LinkTest");
activity.AddLink(activityLink);

// use activity.Links to retrieve all links to the activity object.
```

## TypeDescriptor trimming support
This feature updates the `System.ComponentModel.TypeConverter` assembly to support new opt-in trimmer-compatible APIs. An important consumer of these new APIs will be WinForms, to help with supporting NativeAot applications. However, any application, especially self-contained trimmed applications, can use these new APIs to help support trimming scenarios.

The primary opt-in API is the `public static void RegisterType<T>()` method on the `TypeDescriptor` class. This method has the `[DynamicallyAccessedMembers]` attribute to have the trimmer preserve members for that type. It is expected to be called once per type, and typically would be called early during application warm-up.

The secondary APIs have a "FromRegisteredType" suffix, such as `TypeDescriptor.GetPropertiesFromRegisteredType(Type componentType)` and, unlike their counterpart without the "FromRegisteredType" suffix, do not have a `[RequiresUnreferencedCode]` and \ or `[DynamicallyAccessedMembers]` trimmer attributes. The lack of trimmer attributes here helps consumers by no longer having to suppress trimming warnings (which may be risky), or alternatively, having to propagate a strongly-typed `Type` parameter, required by the trimmer, to other methods which may be cumbersome or not feasible.

For example,

```csharp
public class Program
{
    public static void Main()
    {
        // The Type from typeof() is passed to a different method and the trimmer doesn't know about ExampleClass anymore in this case
        // and thus we will have warnings when trimming.
        Test(typeof(ExampleClass));
        Console.ReadLine();
    }

    private static void Test(Type type)
    {
        // When publishing self-contained + trimmed, we get warning IL2026 and IL2067 on GetProperties():
        // Warning IL2026: Program.Test(Type): Using member 'System.ComponentModel.TypeDescriptor.GetProperties(Type)' which has 'RequiresUnreferencedCodeAttribute' can break functionality when trimming application code.PropertyDescriptor's PropertyType cannot be statically discovered.
        // Warning IL2067: Program.Test(Type): 'componentType' argument does not satisfy 'DynamicallyAccessedMemberTypes.All' in call to 'System.ComponentModel.TypeDescriptor.GetProperties(Type)'.The parameter 'type' of method 'Program.Test(Type)' does not have matching annotations.The source value must declare at least the same requirements as those declared on the target location it is assigned to.
        PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(type);

        // The property count will be 0 here instead of 2 when publishing self-contained + trimmed.
        Console.WriteLine($"Property count: {properties.Count}");
        foreach (PropertyDescriptor prop in properties)
        {
            string propName = prop.Name;
            Console.WriteLine($"Property: {propName}");
        }

        // To avoid the warning and ensure reflection can see the properties, we register the type:
        TypeDescriptor.RegisterType<ExampleClass>();
        // To avoid the warnings and ensure validation we call the new API:
        properties = TypeDescriptor.GetPropertiesFromRegisteredType(type);
    }
}

public class ExampleClass
{
    public string Property1 { get; set; }
    public int Property2 { get; set; }
}
```

Additional information can be found in the [API Proposal](https://github.com/dotnet/runtime/issues/101202).

## Type name parsing

`TypeName` is a parser for ECMA-335 type names that provides much the same functionality as `System.Type` but is decoupled from the runtime environment. It part of [`System.Reflection.Metadata`](https://www.nuget.org/packages/System.Reflection.Metadata/), which has a large collection of APIs that work with the ECMA-335 metadata format.

This new API is similar to [getting an `AssemblyName`](https://learn.microsoft.com/dotnet/api/system.reflection.metadata.metadatareader.getassemblyname) from an assembly using `MetadataReader`.

Components like serializers and compilers need to parse and process type names. For example, the Native AOT compiler has switched to using this API.

The new `TypeName` class provides:

- `Parse` and `TryParse` static methods for parsing input represented as `ReadOnlySpan<char>`. Both methods accept an instance of `TypeNameParseOptions` class (an option bag) that allows to customize the parsing.
- `Name`, `FullName` and `AssemblyQualifiedName` properties that work exactly like their counterparts in the existing `System.Type` class.
- Multiple properties and methods that provide additional information about the name itself:
    - `IsArray`, `IsSZArray` (`SZ` stands for single-dimension, zero-indexed array), `IsVariableBoundArrayType` and `GetArrayRank` for working with arrays.
    - `IsConstructedGenericType`, `GetGenericTypeDefinition` and `GetGenericArguments` for working with generic type names.
    - `IsByRef`, `IsPointer` and for working with pointers and managed references.
    - `GetElementType()` for working with pointers, references and arrays.
    - `IsNested` and `DeclaringType` for working with nested types.
    - `AssemblyName` property that exposes the assembly name information via new `AssemblyNameInfo` class. In contrary to `AssemblyName`, the new type is **immutable** and parsing culture names does not create instances of `CultureInfo`.

Both `TypeName` and `AssemblyNameInfo` types are immutable and don't provide a way to check for equality (don't implement `IEquatable`). Comparing assembly names is simple, but different scenarios need to compare only a subset of exposed information (`Name`, `Version`, `CultureName` and `PublicKeyOrToken`).

The new parsing APIs have been shipped as part of `System.Reflection.Metadata` package, which [supports multiple .NET versions](https://www.nuget.org/packages/System.Reflection.Metadata/#supportedframeworks-body-tab).

### Sample usage

```csharp
using System.Reflection.Metadata;

class RestrictedSerializationBinder
{
    Dictionary<string, Type> Allowlist { get; set; }

    RestrictedSerializationBinder(Type[] allowedTypes)
        => Allowlist = allowedTypes.ToDictionary(type => type.FullName);

    Type GetType(ReadOnlySpan<char> untrustedInput)
    {
        if (!TypeName.TryParse(untrustedInput, out TypeName parsed))
        {
            throw new InvalidOperationException($"Invalid type name: '{untrustedInput.ToString()}'");
        }

        if (Allowlist.TryGetValue(parsed.FullName, out Type type))
        {
            return type;
        }
        else if (parsed.IsSimple // it's not generic, pointer, reference or an array
            && parsed.AssemblyName is not null && parsed.AssemblyName.Name == "MyTrustedAssembly")
        {
            return Type.GetType(parsed.AssemblyQualifiedName, throwOnError: true);
        }

        throw new InvalidOperationException($"Not allowed: '{untrustedInput.ToString()}'");
    }
}

```
