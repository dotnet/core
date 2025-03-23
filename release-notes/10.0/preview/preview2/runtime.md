# .NET Runtime in .NET 10 Preview 2 - Release Notes

Here's a summary of what's new in the .NET Runtime in this preview release:

- [Array Enumeration De-Abstraction](#array-enumeration-de-abstraction)
- [Inlining of Late Devirtualized Methods](#inlining-of-late-devirtualized-methods)
- [Devirtualization Based on Inlining Observations](#devirtualization-based-on-inlining-observations)
- [Support for Casting and Negation in NativeAOT's Type Preinitializer](#support-for-casting-and-negation-in-nativeaots-type-preinitializer)

.NET Runtime updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Array Enumeration De-Abstraction

Preview 1 brought enhancements to the JIT compiler's devirtualization abilities for array interface methods; this was our first step in reducing the abstraction overhead of array iteration via enumerators. Preview 2 continues this effort with improvements to many other optimizations. Consider the following benchmarks:

```csharp
public class ArrayDeAbstraction
{
    static readonly int[] array = new int[512];

    [Benchmark(Baseline = true)]
    public int foreach_static_readonly_array()
    {
        int sum = 0;
        foreach (int i in array) sum += i;
        return sum;
    }

    [Benchmark]
    public int foreach_static_readonly_array_via_interface()
    {
        IEnumerable<int> o = array;
        int sum = 0;
        foreach (int i in o) sum += i;
        return sum;
    }
}
```

In `foreach_static_readonly_array`, the type of `array` is transparent, so it is easy for the JIT to generate efficient code. In `foreach_static_readonly_array_via_interface`, the type of `array` is hidden behind an `IEnumerable`, introducing an object allocation and virtual calls for advancing and dereferencing the iterator. In .NET 9, this overhead impacts performance profoundly:

| Method                                                       | Mean       | Ratio | Allocated |
|------------------------------------------------------------- |-----------:|------:|----------:|
| foreach_static_readonly_array (.NET 9)                       |   150.8 ns |  1.00 |         - |
| foreach_static_readonly_array_via_interface (.NET 9)         |   851.8 ns |  5.65 |      32 B |

Thanks to improvements to the JIT's inlining, stack allocation, and loop cloning abilities (all of which are detailed in [dotnet/runtime #108913](https://github.com/dotnet/runtime/issues/108913)), the object allocation is gone, and runtime impact has been reduced substantially:

| Method                                                       | Mean       | Ratio | Allocated |
|------------------------------------------------------------- |-----------:|------:|----------:|
| foreach_static_readonly_array (.NET 9)                       |   150.8 ns |  1.00 |         - |
| foreach_static_readonly_array_via_interface (.NET 10)        |   280.0 ns |  1.86 |         - |

We plan to close the gap entirely by ensuring the loop optimizations introduced in .NET 9 can kick in for these enumeration patterns. Now, let's consider a more challenging example:

```csharp
[MethodImpl(MethodImplOptions.NoInlining)]
IEnumerable<int> get_opaque_array() => s_ro_array;

[Benchmark]
public int foreach_opaque_array_via_interface()
{
    IEnumerable<int> o = get_opaque_array();
    int sum = 0;
    foreach (int i in o) sum += i;
    return sum;
}
```

When compiling `foreach_opaque_array_via_interface`, the JIT does not know the underlying collection type. Fortunately, PGO data can tell the JIT what the likely type of the collection is, and via guarded devirtualization, the JIT can create a fast path under a test for this type. The benefits of PGO are significant, but it isn't enough to reach performance parity with the baseline:

| (.NET 9) Method                                              | Mean       | Ratio | Allocated |
|------------------------------------------------------------- |-----------:|------:|----------:|
| foreach_static_readonly_array                                |   153.4 ns |  1.00 |         - |
| foreach_opaque_array_via_interface                           |   843.2 ns |  5.50 |      32 B |
| foreach_opaque_array_via_interface (no PGO)                  | 2,076.4 ns | 13.54 |      32 B |

Notice how `foreach_opaque_array_via_interface` allocates memory on the heap, suggesting the JIT failed to stack-allocate and promote the enumerator to registers. This is because the JIT relies on a technique called escape analysis to enable stack allocation. Escape analysis determines if an object's lifetime can exceed that of its creation context; if the JIT can guarantee an object will not outlive the current method, it can safely allocate it on the stack. In the above example, calling an interface method on the enumerator to control iteration causes it to escape, as the call takes a reference to the enumerator object. On the fast path of the type test, the JIT can try to devirtualize and inline these interface calls to keep the enumerator from escaping. However, escape analysis typically considers the whole method context, so the slow path's reliance on interface calls prevents the JIT from stack-allocating the enumerator at all.

[dotnet/runtime #111473](https://github.com/dotnet/runtime/pull/111473) introduces conditional escape analysis -- a flow-sensitive form of the technique -- to the JIT. Conditional escape analysis can determine if an object will escape only on certain paths through the method, and prompt the JIT to create a fast path where the object never escapes. For array enumeration scenarios, conditional escape analysis reveals the enumerator will escape only when type tests for the collection fail, enabling the JIT to create a copy of the iteration code where the enumerator is stack-allocated and promoted. Once again, this reduces the abstraction cost considerably:

| Method                                                       | Mean       | Ratio | Allocated |
|------------------------------------------------------------- |-----------:|------:|----------:|
| foreach_static_readonly_array (.NET 9)                       |   150.8 ns |  1.00 |         - |
| foreach_opaque_array_via_interface (.NET 9)                  |   874.7 ns |  5.80 |      32 B |
| foreach_opaque_array_via_interface (.NET 10)                 |   277.9 ns |  1.84 |         - |

## Inlining of Late Devirtualized Methods

The JIT compiler can replace virtual method calls with non-virtual equivalents when it can determine the exact type of the `this` object. However, this type information may not be available to the JIT unless a specific method call is inlined. Consider the following example:

```csharp
IC obj = GetObject();
obj.M();

IC GetObject() => new C();

interface IC
{
    void M();
}
class C : IC
{
    public void M() => Console.WriteLine(42);
}
```

If the call to `GetObject` is not inlined, the JIT cannot determine that `obj` is actually of type `C` rather than `IC`, meaning the subsequent call `M()` on `obj` will not be devirtualized. **Late devirtualization** occurs when a call becomes eligible for devirtualization due to previous inlining. Devirtualizing a call can create new inlining opportunities, but previously, such opportunities were abandoned. With [dotnet/runtime #110827](https://github.com/dotnet/runtime/pull/110827) (credit: [@hez2010](https://github.com/hez2010)), the JIT can now inline these late devirtualized calls. Inlining a late devirtualized call can reveal more devirtualization opportunities, yielding even more inlining candidates and increasing optimization potential.

## Devirtualization Based on Inlining Observations

During inlining, a temporary variable may be created to hold the return value of the callee. With [dotnet/runtime #111948](https://github.com/dotnet/runtime/pull/111948) (credit: [@hez2010](https://github.com/hez2010)), the JIT now analyzes and updates the type of this temporary variable accordingly. If all return sites in a callee yield the same exact type, this precise type information is leveraged to devirtualize subsequent calls.

With the above two improvements, along with recent efforts to de-abstract array enumeration, the JIT can now devirtualize, inline, stack-allocate, and then perform struct promotion on arbitrary enumerators. This means the abstraction overhead can be entirely eliminated, even without PGO data. Consider the following example:

```csharp
var r = GetRangeEnumerable(0, 10);
foreach (var i in r)
{
    Console.WriteLine(i);
}

static IEnumerable<int> GetRangeEnumerable(int start, int count) => new RangeEnumerable(start, count);

class RangeEnumerable(int start, int count) : IEnumerable<int>
{
    public class RangeEnumerator(int start, int count) : IEnumerator<int>
    {
        private int _value = start - 1;
        public int Current => _value;
        object IEnumerator.Current => Current;
        public void Dispose() { }
        public bool MoveNext()
        {
            _value++;
            return count-- != 0;
        }
        public void Reset() => _value = start - 1;
    }

    public IEnumerator<int> GetEnumerator() => new RangeEnumerator(start, count);
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
```

The JIT now produces fully optimized code where all virtual calls are devirtualized and inlined. Additionally, thanks to escape analysis and struct promotion, the enumerator is stack-allocated and promoted to registers, resulting in zero heap allocations:

```asm
...
G_M27646_IG02:
       mov      ebx, 10
       mov      r15d, -1
       jmp      SHORT G_M27646_IG04
G_M27646_IG03:
       mov      edi, r15d
       call     [System.Console:WriteLine(int)]
       mov      ebx, r14d
G_M27646_IG04:
       inc      r15d
       lea      edi, [rbx-0x01]
       mov      r14d, edi
       test     ebx, ebx
       jne      SHORT G_M27646_IG03
...
```

Check out the full codegen comparison between .NET 9 and .NET 10 [here](https://godbolt.org/z/9svq156Gj).

## Support for Casting and Negation in NativeAOT's Type Preinitializer

NativeAOT includes a type preinitializer that can execute type initializers -- in other words, static constructors -- without side effects at compile time using an IL interpreter. The results are then embedded directly into the binary, allowing the initializers to be omitted. With [dotnet/runtime #112073](https://github.com/dotnet/runtime/pull/112073) (credit: [@hez2010](https://github.com/hez2010)), support has been extended to cover all variants of the `conv.*` and `neg` opcodes, enabling preinitialization of methods that include casting or negation operations.
