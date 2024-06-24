# .NET Libraries in .NET 9 Preview 4 - Release Notes

Here's a summary of what's new in .NET Libraries in this preview release:

- [New `Tensor<T>` type](#new-tensort-type)
- [Tokenizer library enhancements](#tokenizer-library-enhancements)
- [PDB support for System.Reflection.Emit.PersistedAssemblyBuilder](#pdb-support-added-for-systemreflectionemitpersistedassemblybuilder)

Libraries updates in .NET 9 Preview 4:

- [What's new in .NET 9](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) documentation

.NET 9 Preview 4:

- [Discussion](https://aka.ms/dotnet/9/preview4)
- [Release notes](./README.md)
- [Runtime release notes](./runtime.md)

## New `Tensor<T>` type

Tensors are the cornerstone data structure of artificial intelligence (AI). They can often be thought of as multidimensional arrays.

Tensors are used to:

- Represent and encode data such as text sequences (tokens), images, video, and audio.
- Efficiently manipulate higher-dimensional data.
- Efficiently apply computations on higher-dimensional data.
- Inside neural networks, they’re used to store weight information and intermediate computations.

In .NET 9, we plan to introduce a new `Tensor<T>` exchange type that:

- Provides efficient interop with AI libraries like ML.NET, TorchSharp, and ONNX Runtime using zero copies where possible.
- Builds on top of `TensorPrimitives` for efficient math operations.
- Enables easy and efficient data manipulation by providing indexing and slicing operations.

Below is a brief overview of some of the APIs included with the new `Tensor<T>` type:

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

Some things to note:

- `Tensor<T>` is not a replacement for existing AI and Machine Learning libraries. Instead, it’s intended to provide enough of a common set of APIs that reduce code duplication, reduce dependencies, and where possible achieve better performance by using the latest runtime features.
- At the moment, the easiest way to try `Tensor<T>` is using .NET 8. If your application targets .NET 9, we recommend waiting until .NET 9 Preview 5. If you're eager to try it out in your .NET 9 applications, you can install the latest .NET nightly builds.

To get started:

1. Configure the following NuGet nightly feed:

    ```text
    https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet9/nuget/v3/index.json
    ```

1. Install the latest prerelease version of `System.Numerics.Tensors`.
1. In your *.csproj*, enable preview language versions.

    ```xml
    <LangVersion>preview</LangVersion>
    ```

We can't wait to see what you build!

Try it out and [give us feedback](https://github.com/dotnet/runtime/issues)!

## Tokenizer library enhancements

Tokenizer overloads have been added that accept `Span<char>`, providing greater control over normalization or pre-tokenization.

The following example demonstrates how to utilize the tokenizer with `Span<char>`. It also demonstrates how to disable normalization or pre-tokenization on the encoding calls.

```C#
// @"https://huggingface.co/hf-internal-testing/llama-tokenizer/resolve/main/tokenizer.model";
using Stream remoteStream = File.OpenRead(tokenizerModelPath));
Tokenizer llamaTokenizer = Tokenizer.CreateLlama(remoteStream);

ReadOnlySpan<char> textSpan = "Hello World".AsSpan();
IReadOnlyList<int> ids = llamaTokenizer.EncodeToIds(textSpan, considerNormalization: false); // bypass the normalization

Tokenizer tiktokenTokenizer = Tokenizer.CreateTiktokenForModel("gpt-4");
ids = tiktokenTokenizer.EncodeToIds(textSpan, considerPreTokenization: false); // bypass the PreTokenization
```

We've also introduced the CodeGen tokenizer, compatible with models such as [codegen-350M-mono](https://huggingface.co/Salesforce/codegen-350M-mono/tree/main) and [phi-2](https://huggingface.co/microsoft/phi-2/tree/main).

The following example demonstrates how to create and utilize this tokenizer.

```C#
// https://huggingface.co/microsoft/phi-2/resolve/main/vocab.json?download=true
// https://huggingface.co/microsoft/phi-2/resolve/main/merges.txt?download=true
using Stream vocabStream = File.OpenRead(phi2VocabPath);
using Stream mergesStream = File.OpenRead(phi2MergePath);

Tokenizer ph2Tokenizer = Tokenizer.CreateCodeGen(vocabStream, mergesStream);
IReadOnlyList<int> ids = ph2Tokenizer.EncodeToIds("Hello, World");
```

The [tokenizer library](https://github.com/dotnet/machinelearning/tree/main/src/Microsoft.ML.Tokenizers) is available on GitHub and can be accessed by referencing the [NuGet package](https://www.nuget.org/packages/Microsoft.ML.Tokenizers/0.22.0-preview.24271.1#readme-body-tab).

## PDB support added for System.Reflection.Emit.PersistedAssemblyBuilder

PDB support has been added to the new [`PersistedAssemblyBuilder`](../preview1/runtime.md) class. You can now emit symbol info and use it for debugging an assembl generated with Reflection.Emit. The API shape that was chosen was inspired by the .NET Framework implementation of the same functionality.

The new APIs added for emitting symbols and producing PDBs:

```csharp
public abstract partial class ModuleBuilder : System.Reflection.Module
{
    public ISymbolDocumentWriter DefineDocument (string url, Guid language, Guid languageVendor, Guid documentType) => DefineDocument(url, language);
    public ISymbolDocumentWriter DefineDocument(string url, Guid language = default);
}

 public abstract partial class ILGenerator
 {
    public void MarkSequencePoint(ISymbolDocumentWriter document, int startLine, int startColumn, int endLine, int endColumn) { }
 }

public abstract partial class LocalBuilder : LocalVariableInfo
{
    public void SetLocalSymInfo(string name);
}

public sealed class PersistedAssemblyBuilder : AssemblyBuilder
{
    public MetadataBuilder GenerateMetadata(out BlobBuilder ilStream, out BlobBuilder mappedFieldData, out MetadataBuilder pdbBuilder) { }
}
```

The symbols metadata will be populated into the `pdbBuilder` out parameter when `GenerateMetadata(out BlobBuilder ilStream, out BlobBuilder mappedFieldData, out MetadataBuilder pdbBuilder)` method called. The steps for creating an assembly with portable PDB:

1. Create `PortablePdbBuilder` instance using the `pdbBuilder` produced with `GenerateMetadata(...)` method.
2. Serialize the `PortablePdbBuilder` into a Blob, write the Blob into a PDB file stream (only in case generating standalone PDB).
3. Create `DebugDirectoryBuilder` instance and add a `CodeViewEntry` (standalone PDB) or `EmbeddedPortablePdbEntry`.
4. Set the optional `debugDirectoryBuilder` argument when creating `PEBuilder` instance.
5. Serialize the `PEBuilder` into a Blob, then write the Blob into an assembly file stream.

### Sample usage

```cs
static void GenerateAssembly()
{
    PersistedAssemblyBuilder ab = new PersistedAssemblyBuilder(new AssemblyName("MyAssembly"), typeof(object).Assembly);
    ModuleBuilder mb = ab.DefineDynamicModule("MyModule");
    TypeBuilder tb = mb.DefineType("MyType", TypeAttributes.Public | TypeAttributes.Class);
    MethodBuilder mb1 = tb.DefineMethod("SumMethod", MethodAttributes.Public | MethodAttributes.Static, typeof(int), [typeof(int), typeof(int)]);
    ISymbolDocumentWriter srcDoc = mb.DefineDocument("MySourceFile.cs", SymLanguageType.CSharp);
    ILGenerator il = mb1.GetILGenerator();
    LocalBuilder local = il.DeclareLocal(typeof(int));
    local.SetLocalSymInfo("myLocal");
    il.MarkSequencePoint(srcDoc, 7, 0, 7, 11);
    ...
    il.Emit(OpCodes.Ret);

    MethodBuilder entryPoint = tb.DefineMethod("Main", MethodAttributes.HideBySig | MethodAttributes.Public | MethodAttributes.Static);
    ILGenerator il2 = entryPoint.GetILGenerator();
    il2.MarkSequencePoint(srcDoc, 12, 0, 12, 38);
    ...
    tb.CreateType();

    MetadataBuilder metadataBuilder = ab.GenerateMetadata(out BlobBuilder ilStream, out _, out MetadataBuilder pdbBuilder);
    MethodDefinitionHandle entryPointHandle = MetadataTokens.MethodDefinitionHandle(entryPoint.MetadataToken);
    DebugDirectoryBuilder debugDirectoryBuilder = GeneratePDB(pdbBuilder, metadataBuilder.GetRowCounts(), entryPointHandle);

    ManagedPEBuilder peBuilder = new ManagedPEBuilder(
                    header: new PEHeaderBuilder(imageCharacteristics: Characteristics.ExecutableImage, subsystem: Subsystem.WindowsCui),
                    metadataRootBuilder: new MetadataRootBuilder(metadataBuilder),
                    ilStream: ilStream,
                    debugDirectoryBuilder: debugDirectoryBuilder,
                    entryPoint: entryPointHandle);

    BlobBuilder peBlob = new BlobBuilder();
    peBuilder.Serialize(peBlob);

    using var fileStream = new FileStream("MyAssembly.exe", FileMode.Create, FileAccess.Write);
    peBlob.WriteContentTo(fileStream);
}

static DebugDirectoryBuilder GeneratePDB(MetadataBuilder pdbBuilder, ImmutableArray<int> rowCounts, MethodDefinitionHandle entryPointHandle)
{
    BlobBuilder portablePdbBlob = new BlobBuilder();
    PortablePdbBuilder portablePdbBuilder = new PortablePdbBuilder(pdbBuilder, rowCounts, entryPointHandle);
    BlobContentId pdbContentId = portablePdbBuilder.Serialize(portablePdbBlob);
    // In case saving PDB to a file
    using FileStream fileStream = new FileStream("MyAssemblyEmbeddedSource.pdb", FileMode.Create, FileAccess.Write);
    portablePdbBlob.WriteContentTo(fileStream);

    DebugDirectoryBuilder debugDirectoryBuilder = new DebugDirectoryBuilder();
    debugDirectoryBuilder.AddCodeViewEntry("MyAssemblyEmbeddedSource.pdb", pdbContentId, portablePdbBuilder.FormatVersion);
    // In case embedded in PE:
    // debugDirectoryBuilder.AddEmbeddedPortablePdbEntry(portablePdbBlob, portablePdbBuilder.FormatVersion);
    return debugDirectoryBuilder;
}
```

`CustomDebugInformation` can be added by calling the `AddCustomDebugInformation` method from the `pdbBuilder` instance to add source embedding, source indexing, and other advanced PDB information.

```cs
private static void EmbedSource(MetadataBuilder pdbBuilder)
{
    byte[] sourceBytes = File.ReadAllBytes("MySourceFile2.cs");
    BlobBuilder sourceBlob = new BlobBuilder();
    sourceBlob.WriteBytes(sourceBytes);
    pdbBuilder.AddCustomDebugInformation(MetadataTokens.DocumentHandle(1),
        pdbBuilder.GetOrAddGuid(new Guid("0E8A571B-6926-466E-B4AD-8AB04611F5FE")), pdbBuilder.GetOrAddBlob(sourceBlob));
}
```
