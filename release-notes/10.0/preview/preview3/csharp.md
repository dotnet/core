# C# 14 updates in .NET 10 Preview 3 - Release Notes

Here's a summary of what's new in C# in this preview release:

- [Extension members](#extension-members)
- [Null-conditional assignment](#null-conditional-assignment)

C# 14 updates:

- [What's new in C# 14](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-14) documentation
- [Breaking changes in C# 14](https://learn.microsoft.com/dotnet/csharp/whats-new/breaking-changes/compiler%20breaking%20changes%20-%20dotnet%2010)

## Extension members

Extensions just got even more powerful! In Preview 3, they now support static methods, instance properties, and static properties—expanding the capabilities you already know and love. And this is just the beginning—stay tuned for even more extension support in an upcoming release!

Expanding extensions to other member types has been a long-standing challenge, driven by two key questions: how to declare them effectively and how to resolve ambiguity when multiple matching signatures exist. Additionally, we aimed to seamlessly support the new syntax for instance members—ensuring that users of instance extension methods never have to worry about whether they were declared with the old or new syntax. After extensive development, we’re bringing these solutions to life!

Today you may have an extension method that follows the pattern:

```csharp
public static class Extensions
{
    public static IEnumerable<int> WhereGreaterThan(this IEnumerable<int> source, int threshold) 
        => source.Where(x => x > threshold);
}
```

The _receiver_ is the parameter prefaced by the `this` keyword - `source` in this case. Property declarations do not have a similar location to declare the receiver. Thus, C# 14 introduces `extension` blocks. These are blocks with a scope that exposes the receiver to its contained members. If we switch the `WhereGreaterThan` extension method to the new syntax and add an IsEmpty property the extension block would be:

```csharp
public static class Extensions
{
    extension(IEnumerable<int> source) 
    {
        public IEnumerable<int> WhereGreaterThan(int threshold)
            => source.Where(x => x > threshold);

        public bool IsEmpty
            => !source.Any();
    }
}
```

To use these members, you just call them:

```csharp
var list = new List<int> { 1, 2, 3, 4, 5 };
var large = list.WhereGreaterThan(3);
if (large.IsEmpty)
{
    Console.WriteLine("No large numbers");
}
else
{
    Console.WriteLine("Found large numbers");
}
```

Generics are supported and the resolution rules are the same as for extension methods. For example, you could make `WhereGreaterThan` and `IsEmpty` generic:

```csharp
extension<T>(IEnumerable<T> source)
    where T : INumber<T>
{
    public IEnumerable<T> WhereGreaterThan(T threshold)
        => source.Where(x => x > threshold);

    public bool IsEmpty
        => !source.Any();
}
```

The constraint to `INumber<T>` allows the greater than operator to be used.

Static methods and properties don't have a receiver, so the extension block list the type without a parameter name:

```csharp
extension<T>(List<T>)
{
    public static List<T> Create()
        => [];
}
```

Extension blocks can seamlessly coexist with the extension methods you have today. There's no requirement to switch to the new syntax - both execute in exactly the same way. Just add extension blocks to the static classes that contain your existing extension methods.

The choice is entirely yours. If you prefer to leave your existing extension methods untouched, you absolutely can. But if you’d rather update your code for a consistent look and take advantage of the new syntax, that option is available too. And with tools like Visual Studio, converting to your preferred form has never been easier!

You'll see more extensions in upcoming previews, but we'd love to hear your feedback, so join the team and others in the community in the discussion [Extensions](https://github.com/dotnet/csharplang/discussions/8696).

## Null-conditional assignment

Null-conditional assignment assigns a value to a property or field only if the containing instance exists. Imagine you have a code similar to:

```csharp
public class Customer
{
    public string Name { get; set; }
    public int Age { get; set; }
}

public class UpdateCustomer
{
    public static void UpdateAge(Customer? customer, int newAge)
    {
        if (customer is not null)
        {
            customer.Age = newAge;
        }
    }
}
```

You can simplify the `UpdateAge` method:

```csharp
public static void UpdateAge(Customer? customer, int newAge)
{
    customer?.Age = newAge;
}
```

If the customer is not null, `Age` will be updated. If customer is null, nothing will happen.

The IDE will help you by recommending this change via a lightbulb.

We'd love your feedback on this feature so join us and others in the community in the discussion on [Null-conditional assignment](https://github.com/dotnet/csharplang/discussions/8676).
