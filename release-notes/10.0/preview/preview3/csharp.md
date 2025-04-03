# C# 14 updates in .NET 10 Preview 3 - Release Notes

Here's a summary of what's new in C# in this preview release:

- [Extensions](#extensions)
- [Null-conditional assignment](#null-conditional-assignment)
- 

C# 14 updates:

- [What's new in C# 14](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-14) documentation
- [Breaking changes in C# 14](https://learn.microsoft.com/dotnet/csharp/whats-new/breaking-changes/compiler%20breaking%20changes%20-%20dotnet%2010)

## Extensions

Extensions extend the extension methods you know and love to include support for static methods, instance properties and static properties in Preview 3. Look for even more members to have extension support in the near future!

Extensions for other member types has been development for a long time because there are a couple of fundamental problems: how do declare extensions and how to disambiguate when more than one matching signature is available. We also wanted to support the new syntax for instance members and ensure that users of an instance extension method didn't need to worry about whether it was declared with the old or new syntax.

Today you may have an extension method that follows the pattern:

```csharp
public static class Extensions
{    
    public static IEnumerable<int> WhereGreaterThan(this IEnumerable<int> source, int threshold) 
            => source.Where(x => x > threshold);
}
```

The _receiver_ is the parameter prefaced by the `this` keyword - `source` in this case. Property declaration do not have a similar location to declare the receiver. Thus, C# 14 introduces `extension` blocks. These are blocks with a scope that exposes the receive to its contained members. If we switch the `WhereGreaterThan` extension method to the new syntax and add an IsEmpty property the extension block would be:

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
        where T: INumber<T>
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

Our goals included extension blocks coexisting with the many extension methods you may have today. There's no need to change to the new syntax unless you want to - they execute in exactly the same manner. Extension blocks can be added to the static classes containing that contain your existing extension methods.

You'll see more extensions in upcoming previews, but we'd love to hear your feedback at []().

## Null-conditional assignment

Null-conditional assignment assign a value to a property or field only if the containing instance exists. Imagine you have a code similar to:

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

The IDE will help you by recommending this change.
