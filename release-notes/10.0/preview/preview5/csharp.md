# C# 14 updates in .NET 10 Preview 5 - Release Notes

Here's a summary of what's new in C# in this preview release:

- [User defined compound assignment operators](#user-defined-compound-assignment-operators)

C# 14 updates:

- [What's new in C# 14](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-14) documentation
- [Breaking changes in C# 14](https://learn.microsoft.com/dotnet/csharp/whats-new/breaking-changes/compiler%20breaking%20changes%20-%20dotnet%2010)

## User defined compound assignment operators

This feature enables type authors to implement compound assignment operators in a manner that modifies the target in place rather than create copies.

For example, the `+=` operator was defined to perform the addition and then an assignment. In other words, the code:

```csharp
a += b;
```

Was the same as the following code:

```csharp
a = a + b;
```

If the type of `a` was a class, a typical implementation of `operator +` creates a new instance of that type. The compound assignment operator impacts memory usage. The original instance of `a` becomes garbage and a newly allocated instance takes its place. For larger types, this causes unnecessary memory churn. That churn, in turn,  causes increased memory pressure and creates more work for the garbage collector.

As more programs use Tensor types or other large data structures, this cost becomes more significant

Library authors can now create user defined implementations for any of the compound assignment operators:  `+=`, `-=`, `*=`, `/=`, `%=`, `&=`, `|=`, `^=`, `<<=`, `>>=` and `>>>=`.  In addition, the `+=`, `-=`, `*=` and `/=` operators can include both `checked` and unchecked variants.

If you're maintaining a library with existing operators, you can decide if this new feature provides real benefit. Your existing code works the same as before. Consumers of your library can still use any of the compound assignment operators. Unless you define the new compound assignment operators, the compiler continues to generate the same code.

We continue to add features to C# that seamlessly provide new features for important new scenarios without changing familiar idioms.
