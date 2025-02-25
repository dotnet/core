# .NET Runtime in .NET 10 Preview 1 - Release Notes

.NET 10 Preview 1 includes new .NET Runtime features & enhancements:

- [Array Interface Method Devirtualization](#array-interface-method-devirtualization)
- [Stack Allocation of Arrays of Value Types](#stack-allocation-of-arrays-of-value-types)
- [AVX10.2 Support](#avx102-support)

.NET Runtime updates in .NET 10:

- [What's new in .NET 10](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10/overview) documentation

## Array Interface Method Devirtualization

Reducing the abstraction overhead of popular language features is one of the code generation team's [focus areas](https://github.com/dotnet/runtime/issues/108988) for .NET 10. In pursuit of this goal, we have expanded the JIT's ability to devirtualize method calls to cover array interface methods.

Consider the typical approach of looping over an array:

```csharp
static int Sum(int[] array)
{
    int sum = 0;
    for (int i = 0; i < array.Length; i++)
    {
        sum += array[i];
    }
    return sum;
}
```

This code shape is easy for the JIT to optimize, mainly because there aren't any virtual calls to reason about. Instead, the JIT can focus on removing bounds checks on the array access, and applying the loop optimizations we added in .NET 9. Let's tweak the above example to add some virtual calls:

```csharp
static int Sum(int[] array)
{
    int sum = 0;
    IEnumerable<int> temp = array;

    foreach (var num in temp)
    {
        sum += num;
    }
    return sum;
}
```

The type of the underlying collection is clear, and the JIT should be able to transform this snippet into the first one. However, array interfaces are implemented differently from "normal" interfaces, such that the JIT does not know how to devirtualize them. This means the enumerator calls in the for-each loop remain virtual, blocking multiple optimizations: inlining, stack allocation, and others.

The JIT can now devirtualize and inline array interface methods, thanks to work in [dotnet/runtime #108153](https://github.com/dotnet/runtime/pull/108153) and [dotnet/runtime #109209](https://github.com/dotnet/runtime/pull/109209). This is the first of many steps we will be taking to achieve performance parity between the above implementations, as detailed in our [de-abstraction plans](https://github.com/dotnet/runtime/issues/108913) for .NET 10.

## Stack Allocation of Arrays of Value Types

In .NET 9, the JIT gained the ability to allocate objects on the stack, when the object is guaranteed to not outlive its parent method. Not only does stack allocation reduce the number of objects the GC has to track, but it also unlocks other optimizations: For example, after an object has been stack-allocated, the JIT can consider replacing it entirely with its scalar values. Because of this, stack allocation is key to reducing the abstraction penalty of reference types.

Thanks to [dotnet/runtime #104906](https://github.com/dotnet/runtime/pull/104906) (credit: [@hez2010](https://github.com/hez2010)), the JIT will now stack-allocate small, fixed-sized arrays of value types that don't contain GC pointers when it can make the same lifetime guarantees described above. Consider the following example:

```csharp
static void Sum()
{
    int[] numbers = {1, 2, 3};
    int sum = 0;

    for (int i = 0; i < numbers.Length; i++)
    {
        sum += numbers[i];
    }

    Console.WriteLine(sum);
}

```

Because the JIT knows `numbers` is an array of only three integers at compile-time, and it does not outlive a call to `Sum`, it will now allocate it on the stack.

Among other [stack allocation enhancements](https://github.com/dotnet/runtime/issues/104936), we plan to expand this ability to arrays of reference types in the coming previews.

## AVX10.2 Support

[dotnet/runtime #111209](https://github.com/dotnet/runtime/pull/111209) (credit: [@khushal1996](https://github.com/khushal1996)) enables support for the Advanced Vector Extensions (AVX) 10.2 for x64-based processors. The new intrinsics available in the `System.Runtime.Intrinsics.X86.Avx10v2` class can be tested once capable hardware is available. In the next several previews, we plan to further incorporate AVX10.2 support into the JIT's emitter to take full advantage of the instruction set's features.

Because AVX10.2-enabled hardware is not yet available, the JIT's support for AVX10.2 is disabled by default for now. We plan to enable it once we have thoroughly tested it.
