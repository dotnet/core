# .NET Libraries in .NET 9 Preview 1 Release Notes

.NET 9 Preview 1 includes several new library features. We focused on the following areas:

- System.Collections
- System.Linq
- System.Reflection
- System.Security.Cryptography
- System.Text.Json

Libraries updates in .NET 9 Preview 1:

* [Discussion](https://github.com/dotnet/runtime/discussions/98372)
* [What's new in .NET 9](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) documentation.

.NET 9 Preview 1:
* [Discussion](https://aka.ms/dotnet/9/preview1)
* [Release notes](README.md) 

## System.Collections: `PriorityQueue.Remove`

[`PriorityQueue` collection](https://learn.microsoft.com/dotnet/api/system.collections.generic.priorityqueue-2) provides a simple and fast array heap implementation. One issue however with array heaps in general is that they [don't support priority updates](https://github.com/dotnet/runtime/issues/44871), making them prohibitive for use in algorithms such as variations of [Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Using_a_priority_queue). 

While it wouldn't be possible to implement efficient $\mathcal O(\log n)$ priority updates in the existing collection, the new `Remove` method makes it possible to _emulate_ priority updates (albeit at $\mathcal O(n)$ time):

```C#
public static void UpdatePriority<TElement, TPriority>(this PriorityQueue<TElement, TPriority> queue, TElement element, TPriority priority)
{
    queue.Remove(element, out _); // Scan the heap for entries matching the current element
    queue.Enqueue(element, priority); // Now re-insert it with the new priority.
}
```

This improvement unblocks users looking to implement graph algorithms in contexts where asymptotic performance isn't a blocker (e.g. education or prototyping). For example, here's a [toy implementation of Dijkstra's algorithm](https://github.com/dotnet/runtime/blob/16cb41496d595e2568574cfe11c763d5e05136c9/src/libraries/System.Collections/tests/Generic/PriorityQueue/PriorityQueue.Tests.Dijkstra.cs#L46-L76) using the new API.

## System.ComponentModel: TypeDescriptor is now thread-safe
Long-standing threading issues in TypeDescriptor have been addressed, so any existing work-arounds can be removed. Workarounds included pre-populating internal caches such as by calling `TypeDescriptor.GetProvider(type)` for every type that has a `TypeProviderAttribute`, and by wrapping the access to the affected APIs with a `lock` statement.

For more background, see the issues [TypeDescriptor.GetProperties(object instance) is not thread-safe](https://github.com/dotnet/runtime/issues/92394) and [Concurrency issue in TypeDescriptor.GetConverter(type)](https://github.com/dotnet/runtime/issues/30024).

The threading issues also exist in .NET Framework. If you are affected by this issue in .NET Framework, please add feedback to this blog or the issues above so we can determine the priority of porting the fix to .NET Framework.

## System.Linq: `CountBy`, `AggregateBy` and `Index` methods

We've added new Linq methods that make it possible to aggregate state by key, without needing to allocate intermediate groupings via `GroupBy`. You can use `CountBy` to quickly calculate the frequency for each key:

```C#
string sourceText = """
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sed non risus. Suspendisse lectus tortor, dignissim sit amet, 
    adipiscing nec, ultricies sed, dolor. Cras elementum ultrices amet diam.
    """;

// Find the most frequent word in a piece of text
KeyValuePair<string, int> mostFrequentWord = sourceText
    .Split(new char[] { ' ', '.', ',', '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries)
    .Select(word => word.ToLowerInvariant())
    .CountBy(word => word)
    .MaxBy(pair => pair.Value);

Console.WriteLine(mostFrequentWord.Key); // amet
```

More general-purpose workflows can be implemented using the new `AggregateBy` method, here's how we can aggregate scores by a given key:

```C#
(string id, int score)[] data =
[
    ("0", 42),
    ("1", 5),
    ("2", 4),
    ("1", 10),
    ("0", 25),
];

data.AggregateBy(seed: 0, (totalScore, curr) => totalScore + curr.score, keySelector: entry => entry.id);
//(0, 67)
//(1, 15)
//(2, 4)
```

The new `Index` method makes it possible to quickly extract the implicit index of an enumerable. The code:

```C#
IEnumerable<string> lines = File.ReadAllLines("file.txt");
foreach ((int index, string line) in lines.Select((line, index) => (index, line)))
{
    Console.WriteLine($"Line number: {index + 1}, Line: {line}");
}
```

Now becomes

```C#
foreach ((int index, string line) in lines.Index())
{
    Console.WriteLine($"Line number: {index + 1}, Line: {line}");
}
```

## System.Reflection.Emit: Support equivalent of AssemblyBuilder.Save

[Saving an assembly](https://github.com/dotnet/runtime/issues/15704) with Reflection.Emit has been requested since the first release of .NET Core and it's been the most upvoted issue in the Reflection area. Many customers report it as a blocker for porting their project from .NET Framework.  Without saving the assembly, it was very difficult to debug in-memory assemblies. Saving the assembly to a file allows the assembly to be verified with tools such as ILVerify, or decompiled and manually examined with tools such as ILSpy. Furthermore, the assembly can be shared or loaded directly which can be used to decrease application startup time.

For creating a new persisted `AssemblyBuilder` instance you should use the new `AssemblyBuilder.DefinePersistedAssembly` API:

```cs
AssemblyBuilder ab = AssemblyBuilder.DefinePersistedAssembly(new AssemblyName("MyAssembly"), typeof(object).Assembly);
```

The `Assembly` passed to the method is used for resolving base runtime types. Notice that an `AssemblyBuilderAccess` value is not passed; the new persisted `AssemblyBuilder` implementation is only for saving. In order to run the assembly user first need to save it into a memory stream or a file, then load it back.


The following example demonstrates how to create and save assemblies: 


```cs
public void CreateAndSaveAssembly(string assemblyPath)
{
    AssemblyBuilder ab = AssemblyBuilder.DefinePersistedAssembly(new AssemblyName("MyAssembly"), typeof(object).Assembly);
    TypeBuilder tb = ab.DefineDynamicModule("MyModule").DefineType("MyType", TypeAttributes.Public | TypeAttributes.Class);

    MethodBuilder mb = tb.DefineMethod("SumMethod", MethodAttributes.Public | MethodAttributes.Static,
        typeof(int), [typeof(int), typeof(int)]);
    ILGenerator il = mb.GetILGenerator();
    il.Emit(OpCodes.Ldarg_0);
    il.Emit(OpCodes.Ldarg_1);
    il.Emit(OpCodes.Add);
    il.Emit(OpCodes.Ret);

    tb.CreateType();
    ab.Save(assemblyPath); // or could save to a Stream
}
```

The following example demonstrates how to run the saved assembly:


```cs
public void UseAssembly(string assemblyPath)
{
    Assembly assembly = Assembly.LoadFrom(assemblyPath);
    Type type = assembly.GetType("MyType");
    MethodInfo method = type.GetMethod("SumMethod");
    Console.WriteLine(method.Invoke(null, [5, 10]));
}
```

Future Plans: A few missing API implementations and bunch of bug fixes [will be added in preview 2](https://github.com/dotnet/runtime/pull/97350). Further [Entry point support](https://github.com/dotnet/runtime/issues/97015) will be added soon.

## System.Security.Cryptography: `CryptographicOperations.HashData`

.NET includes several static [one-shot implementations](https://learn.microsoft.com/dotnet/standard/security/cryptography-model#one-shots) of hash functions, and related functions. These APIs include [`SHA256.HashData`](https://learn.microsoft.com/dotnet/api/system.security.cryptography.sha256.hashdata) and [`HMACSHA256.HashData`](https://learn.microsoft.com/dotnet/api/system.security.cryptography.hmacsha256.hashdata). One-shots are preferable to use because they can provide the best possible performance and reduce or eliminate allocations.

If a developer wants to provide an API that supports hashing where the caller defines which hash algorithm to use, it's typically done by accepting a `HashAlgorithmName` argument. However, using that pattern with one-shot APIs would require switching over every possible `HashAlgorithmName` and then using the appropriate method. To solve that problem, .NET 9 introduces the `CryptographicOperations.HashData` API. This API lets you produce a hash or HMAC over an input as a one-shot where the algorithm used is determined by a `HashAlgorithmName`.

The `CryptographicOperations.HashData` API can be used to produce a hash or HMAC over an input as a one-shot where the algorithm used is determined by a `HashAlgorithmName`.

```C#
using System.Security.Cryptography;

static void HashAndProcessData(HashAlgorithmName hashAlgorithmName, byte[] data) {
    byte[] hash = CryptographicOperations.HashData(hashAlgorithmName, data);
    ProcessHash(hash);
}
```

## System.Security.Cryptography: KMAC algorithm

.NET 9 provides the KMAC algorithm as specified by [NIST SP-800-185](https://csrc.nist.gov/pubs/sp/800/185/final). KECCAK Message Authentication Code (KMAC) is a pseudorandom function and keyed hash function based on KECCAK.

The following new classes use the KMAC algorithm. Use instances to accumulate data to produce a MAC, or use the static `HashData` method for a [one-shot](https://learn.microsoft.com/dotnet/standard/security/cryptography-model#one-shots) over a single input.

- `Kmac128`
- `Kmac256`
- `KmacXof128`
- `KmacXof256`

KMAC is available on Linux with OpenSSL 3.0 or later, and on Windows 11 Build 26016 or later. You can use the static `IsSupported` property to determine if the platform supports the desired algorithm.

```C#
using System.Security.Cryptography;

if (Kmac128.IsSupported) {
    byte[] key = GetKmacKey();
    byte[] input = GetInputToMac();
    byte[] mac = Kmac128.HashData(key, input, outputLength: 32);
}
else {
    // Handle scenario where KMAC is not available.
}
```

## System.Text.Json: Customizing indent character and indent size

It is now possible to customize the indentation character and size of written JSON:

```C#
var options = new JsonSerializerOptions
{
    WriteIndented = true,
    IndentCharacter = '\t',
    IndentSize = 2,
};

JsonSerializer.Serialize(new { Value = 1 }, options);
//{
//                "Value": 1
//}
```

## System.Text.Json: `JsonSerializerOptions.Web`

`JsonSerializerOptions` now exposes a static property configured to use `JsonSerializerDefaults.Web`:

```C#
JsonSerializer.Serialize(new { SomeValue = 42 }, JsonSerializerOptions.Web); // {"someValue":42} defaults to camelCase naming policy
```
