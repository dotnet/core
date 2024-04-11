# .NET Libraries in .NET 9 Preview 3 - Release Notes

.NET 9 Preview 3 includes several new libraries features. We focused on the following areas:

- Enhancements to the Tokenizers Library
- TimeSpan.From overloads
- Added `PersistableAssemblyBuilder` type in System.Reflection.Emit

Libraries updates in .NET 9 Preview 3:

- [What's new in .NET 9](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) documentation

.NET 9 Preview 3:

- [Discussion](https://aka.ms/dotnet/9/preview3)
- [Release notes](./README.md)
- [SDK release notes](./sdk.md)
- [Runtime release notes](./runtime.md)

## Enhancements to the Tokenizers Library

Tokenization is a fundamental component in the preprocessing of natural language text for AI models. Tokenizers are responsible for breaking down a string of text into smaller, more manageable parts, often referred to as tokens.

When using services like Azure OpenAI, you can use tokenizers to get a better understanding of cost and manage context. When working with self-hosted / local models, tokens are the inputs provided to those models.

A couple of years ago, we introduced [Microsoft.ML.Tokenizers](https://devblogs.microsoft.com/dotnet/announcing-ml-net-2-0/#tokenizer-support), an open-source, cross-platform tokenization library. At the time, the library was scoped to the [Byte-Pair Encoding (BPE)](https://en.wikipedia.org/wiki/Byte_pair_encoding) tokenization strategy to satisfy the language set of scenarios in ML.NET.

Over the past few months, we've been making enhancements to the library in the following ways:

- Refined APIs and existing functionality
- Added Tiktoken support
- Added LlamaTokenizer support
- Worked closely with the DeepDev TokenizerLib and SharpToken communities to cover scenarios covered by those libraries. If you're using DeepDev or SharpToken, we recommend migrating to `Microsoft.ML.Tokenizers`. For more details, see the [migration guide](https://github.com/dotnet/machinelearning/blob/main/docs/code/microsoft-ml-tokenizers-migration-guide.md).

The following samples demonstrate the utilization of these tokenizers for text tokenization.

### Using Tiktoken tokenizer

```C#
using Microsoft.ML.Tokenizers;

Tokenizer tokenizer = Tokenizer.CreateTiktokenForModel("gpt-4");
string text = "Hello, World!";

// Encode to Ids
IReadOnlyList<int> encodedIds = tokenizer.EncodeToIds(text);
Console.WriteLine($"encodedIds = {{{string.Join(", ", encodedIds)}}}"); // encodedIds = {9906, 11, 4435, 0}

// Decode Ids to text
string decodedText = tokenizer.Decode(encodedIds);
Console.WriteLine($"decodedText = {decodedText}"); // decodedText = Hello, World!

// Get token count
int idsCount = tokenizer.CountTokens(text); 
Console.WriteLine($"idsCount = {idsCount}"); // idsCount = 4

// Full encoding
EncodingResult result = tokenizer.Encode(text);
Console.WriteLine($"result.Tokens = {{'{string.Join("', '", result.Tokens)}'}}"); // result.Tokens = {'Hello', ',', ' World', '!'}
Console.WriteLine($"result.Offsets = {{{string.Join(", ", result.Offsets)}}}");   // result.Offsets = {(0, 5), (5, 1), (6, 6), (12, 1)}
Console.WriteLine($"result.Ids = {{{string.Join(", ", result.Ids)}}}");           // result.Ids = {9906, 11, 4435, 0}

// Encode up to number of tokens limit
int index1 = tokenizer.IndexOfTokenCount(text, maxTokenCount: 1, out string processedText1, out int tokenCount1); // Encode up to one token
Console.WriteLine($"processedText1 = {processedText1}"); // processedText1 = Hello, World!
Console.WriteLine($"tokenCount1 = {tokenCount1}");       // tokenCount1 = 1
Console.WriteLine($"index1 = {index1}");                 // index1 = 5

int index2 = tokenizer.LastIndexOfTokenCount(text, maxTokenCount: 1, out string processedText2, out int tokenCount2); // Encode from end up to one token
Console.WriteLine($"processedText2 = {processedText2}"); // processedText2 = Hello, World!
Console.WriteLine($"tokenCount2 = {tokenCount2}");       // tokenCount2 = 1
Console.WriteLine($"index2 = {index2}");                 // index2 = 12
```

### Using Llama tokenizer

```C#
using Microsoft.ML.Tokenizers;
using System.Net.Http;

// Create the Tokenizer
HttpClient httpClient = new HttpClient();
string modelUrl = @"https://huggingface.co/hf-internal-testing/llama-tokenizer/resolve/main/tokenizer.model";
using Stream remoteStream = await httpClient.GetStreamAsync(modelUrl);
Tokenizer tokenizer = Tokenizer.CreateLlama(remoteStream);

string text = "Hello, World!";

// Encode to Ids
IReadOnlyList<int> encodedIds = tokenizer.EncodeToIds(text);
Console.WriteLine($"encodedIds = {{{string.Join(", ", encodedIds)}}}"); // encodedIds = {1, 15043, 29892, 2787, 29991}

// Decode Ids to text
string? decodedText = tokenizer.Decode(encodedIds);
Console.WriteLine($"decodedText = {decodedText}"); // decodedText = Hello, World!

// Get token count
int idsCount = tokenizer.CountTokens(text); 
Console.WriteLine($"idsCount = {idsCount}"); idsCount = 5

// Full encoding
EncodingResult result = tokenizer.Encode(text);
Console.WriteLine($"result.Tokens = {{'{string.Join("', '", result.Tokens)}'}}"); // result.Tokens = {'<s>', '▁Hello', ',', '▁World', '!'}
Console.WriteLine($"result.Offsets = {{{string.Join(", ", result.Offsets)}}}");   // result.Offsets = {(0, 0), (0, 6), (6, 1), (7, 6), (13, 1)}
Console.WriteLine($"result.Ids = {{{string.Join(", ", result.Ids)}}}");           // result.Ids = {1, 15043, 29892, 2787, 29991}

// Encode up to number of tokens limit
int index1 = tokenizer.IndexOfTokenCount(text, maxTokenCount: 2, out string processedText1, out int tokenCount1); // Encode up to two token
Console.WriteLine($"processedText1 = {processedText1}"); // processedText1 =  ▁Hello,▁World!
Console.WriteLine($"tokenCount1 = {tokenCount1}");       // tokenCount1 = 2
Console.WriteLine($"index1 = {index1}");                 // index1 = 6

int index2 = tokenizer.LastIndexOfTokenCount(text, maxTokenCount: 1, out string processedText2, out int tokenCount2); // Encode from end up to one token
Console.WriteLine($"processedText2 = {processedText2}"); // processedText2 =  ▁Hello,▁World!
Console.WriteLine($"tokenCount2 = {tokenCount2}");       // tokenCount2 = 1
Console.WriteLine($"index2 = {index2}");                 // index2 = 13

```

## Adding TimeSpan.From overloads

The `TimeSpan` class offers several `From` methods enabling users to create a TimeSpan using a `double`. However, since `double` is a binary-based floating-point format, [inherent imprecision may lead to errors](https://github.com/dotnet/runtime/issues/93890). For instance, `TimeSpan.FromSeconds(101.832)` may not precisely represent `101 seconds, 832 milliseconds`, but rather approximately `101 seconds, 831.9999999999936335370875895023345947265625 milliseconds`. This discrepancy has often caused user confusion and API surface bugs over time, requiring users to address and rationalize them. Moreover, it's not the most efficient way to represent such data and can pose challenges for users expecting specific behavior. To address this, new overloads have been introduced allowing users to pass integers, ensuring they achieve the desired and intended behavior.

Many thanks to [Tommy Sørbråten](https://github.com/tommysor) for contributing the implementation of the added overloads.

### Sample

```C#
TimeSpan timeSpan1 = TimeSpan.FromSeconds(value: 101.832);
Console.WriteLine($"timeSpan1 = {timeSpan1}"); // timeSpan1 = 00:01:41.8319999

TimeSpan timeSpan2 = TimeSpan.FromSeconds(seconds: 101, milliseconds: 832);
Console.WriteLine($"timeSpan2 = {timeSpan2}"); // timeSpan2 = 00:01:41.8320000
```

### Added Overloads

```C#
public partial struct TimeSpan
{
    public static TimeSpan FromDays(int days);
    public static TimeSpan FromDays(int days, int hours = 0, long minutes = 0, long seconds = 0, long milliseconds = 0, long  microseconds = 0);
    public static TimeSpan FromHours(int hours);
    public static TimeSpan FromHours(int hours, long minutes = 0, long seconds = 0, long milliseconds = 0, long microseconds = 0);
    public static TimeSpan FromMinutes(long minutes);
    public static TimeSpan FromMinutes(long minutes, long seconds = 0, long milliseconds = 0, long microseconds = 0);
    public static TimeSpan FromSeconds(long seconds);
    public static TimeSpan FromSeconds(long seconds, long milliseconds = 0, long microseconds = 0);
    public static TimeSpan FromMilliseconds(long milliseconds, long microseconds = 0);
    public static TimeSpan FromMicroseconds(long microseconds);
}
```

## Added `PersistableAssemblyBuilder` type in System.Reflection.Emit

We added a [persisted AssemblyBuilder](../preview1/libraries.md#systemreflectionemit-support-equivalent-of-assemblybuildersave) implementation and related APIs in .NET 9 preview 1. Further, we needed to add more APIs for setting `EntryPoint` and other properties of the final binary. There was no efficient way to add an API that allows setting all available options for an assembly. We decided to let the users handle their assembly building process by themselves using the parameters of [PEHeaderBuilder](https://learn.microsoft.com/dotnet/api/system.reflection.portableexecutable.peheaderbuilder.-ctor) and [ManagedPEBuilder](https://learn.microsoft.com/dotnet/api/system.reflection.portableexecutable.managedpebuilder.-ctor) constructors. These constructor options covers all options that existed in .NET framework, (but not exactly same way), plus provide many other options that are available in .NET Core.

In order to achieve this, we [provide all metadata](https://github.com/dotnet/runtime/issues/97015) information produced with Reflection.Emit APIs with a new `MetadataBuilder GenerateMetadata(out BlobBuilder ilStream, out BlobBuilder mappedFieldData)` method so that user could embed them into the corresponding section of `PEBuidler`. But because the [MetadataBuilder](https://learn.microsoft.com/dotnet/api/system.reflection.metadata.ecma335.metadatabuilder) and [BlobBuilder](https://learn.microsoft.com/dotnet/api/system.reflection.metadata.blobbuilder) types are not accessible from within CoreLib we made the `PersistedAssemblyBuilder` type public and moved the new APIs from the base `AssemblyBuilder` type into this new type.

### API updates

```diff
public abstract partial class AssemblyBuilder
{
    // These APIs moved from AssemblyBuilder into PersistedAssemblyBuilder type
-   public static AssemblyBuilder DefinePersistedAssembly(AssemblyName name, Assembly coreAssembly, IEnumerable<CustomAttributeBuilder>? assemblyAttributes = null);

-   public void Save(Stream stream);
-   public void Save(string assemblyFileName);
-   protected abstract void SaveCore(Stream stream);
}

+public sealed class PersistedAssemblyBuilder : AssemblyBuilder
{
+   public PersistedAssemblyBuilder(AssemblyName name, Assembly coreAssembly, IEnumerable<CustomAttributeBuilder>? assemblyAttributes = null);

+   public void Save(Stream stream);
+   public void Save(string assemblyFileName);
    // New method that can be used for generating custom assembly with entry point and other options 
+   public MetadataBuilder GenerateMetadata(out BlobBuilder ilStream, out BlobBuilder mappedFieldData);
}
```

### Sample usage

Because of the above changes to create a persisted AssemblyBuilder instance use `PersistedAssemblyBuilder(AssemblyName name, Assembly coreAssembly, IEnumerable<CustomAttributeBuilder>? assemblyAttributes = null)` constuctor instead of `AssemblyBuilder.DefinePersistedAssembly(AssemblyName name, Assembly coreAssembly, IEnumerable<CustomAttributeBuilder>? assemblyAttributes = null)`. Then after emitting all members you can call the `Save` method to save the assembly with default settings.

```csharp
PersistedAssemblyBuilder ab = new PersistedAssemblyBuilder(new AssemblyName("MyAssembly"), typeof(object).Assembly);
TypeBuilder tb = ab.DefineDynamicModule("MyModule").DefineType("MyType", TypeAttributes.Public | TypeAttributes.Class);
// ...
MethodBuilder entryPoint = tb.DefineMethod("Main", MethodAttributes.Public | MethodAttributes.Static);
ILGenerator il2 = entryPoint.GetILGenerator();
// ...
tb.CreateType();

ab.Save("MyAssembly.dll")
```

In case you want to set entry point and/or other options you can call  `public MetadataBuilder GenerateMetadata(out BlobBuilder ilStream, out BlobBuilder mappedFieldData)` method and use the produced metadata for saving assembly as needed. Below example shows how to set entry point for an assembly and save it as executable:

```csharp
PersistedAssemblyBuilder ab = new PersistedAssemblyBuilder(new AssemblyName("MyAssembly"), typeof(object).Assembly);
TypeBuilder tb = ab.DefineDynamicModule("MyModule").DefineType("MyType", TypeAttributes.Public | TypeAttributes.Class);
// ...
MethodBuilder entryPoint = tb.DefineMethod("Main", MethodAttributes.Public | MethodAttributes.Static);
ILGenerator il2 = entryPoint.GetILGenerator();
// ...
tb.CreateType();

MetadataBuilder metadataBuilder = ab.GenerateMetadata(out BlobBuilder ilStream, out BlobBuilder fieldData);
PEHeaderBuilder peHeaderBuilder = new PEHeaderBuilder(
                imageCharacteristics: Characteristics.ExecutableImage);

ManagedPEBuilder peBuilder = new ManagedPEBuilder(
                header: peHeaderBuilder,
                metadataRootBuilder: new MetadataRootBuilder(metadataBuilder),
                ilStream: ilStream,
                mappedFieldData: fieldData,
                entryPoint: MetadataTokens.MethodDefinitionHandle(entryPoint.MetadataToken));

BlobBuilder peBlob = new BlobBuilder();
peBuilder.Serialize(peBlob);
using var fileStream = new FileStream("MyAssembly.exe", FileMode.Create, FileAccess.Write);
peBlob.WriteContentTo(fileStream);
```

## Changes to [ActivatorUtilities.CreateInstance()](https://learn.microsoft.com/dotnet/api/microsoft.extensions.dependencyinjection.activatorutilities.createinstance) when using [[ActivatorUtilitiesConstructor]](https://learn.microsoft.com/dotnet/api/microsoft.extensions.dependencyinjection.activatorutilitiesconstructorattribute)
The constructor resolution for `ActivatorUtilities.CreateInstance()` with the attribute `[ActivatorUtilitiesConstructor]` [has changed to always use the attribute](https://github.com/dotnet/runtime/pull/99175). Previously, a constructor without the attribute but with more parameters was selected but only if it was declared after the constructor with the attribute.

The change was made to allow full, unambiguous control over which constructor is used.

Mostly due to these changes, [performance has also increased](https://github.com/dotnet/runtime/pull/99383); the more constructors there are, the greater the performance impact. For a simple case of 3 constructors, `CreateInstance()` is now twice is fast. If performance is a concern here, and only one constructor should ever be called, this may be a reason to add `[ActivatorUtilitiesConstructor]` to your classes.
