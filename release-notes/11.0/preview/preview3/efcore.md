# Entity Framework Core in .NET 11 Preview 3 - Release Notes

.NET 11 Preview 3 includes new Entity Framework Core features & enhancements:

- [Remove and replace database provider configuration](#remove-and-replace-database-provider-configuration)
- [Cosmos DB complex property queries](#cosmos-db-complex-property-queries)
- [Partial property loading in relational queries](#partial-property-loading-in-relational-queries)

EF Core updates in .NET 11:

- [What's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/overview) documentation

## Remove and replace database provider configuration

New APIs make it straightforward to replace a database provider in testing scenarios — for example, swapping SQL Server for InMemory ([dotnet/efcore#37891](https://github.com/dotnet/efcore/pull/37891)). Since .NET 9, `DbContextOptions<>` uses `IDbContextOptionsConfiguration<>` for composition, which made removing a previously registered provider difficult. Three new APIs address this:

- `IDbContextOptionsBuilderInfrastructure.RemoveExtension<T>()` removes a specific extension from the options builder
- `DbContextOptions.WithoutExtension<T>()` returns new options without the specified extension (immutable counterpart to `WithExtension`)
- `IServiceCollection.RemoveDbContext<TContext>(bool removeConfigurationOnly = false)` removes context-specific services from DI

```csharp
// Fully replace a context registration in integration tests
services.RemoveDbContext<AppDbContext>();
services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("TestDb"));

// Or remove only the configuration while keeping the context registered
services.RemoveDbContext<AppDbContext>(removeConfigurationOnly: true);
services.ConfigureDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("TestDb"));
```

## Cosmos DB complex property queries

EF Core now supports querying complex properties in Cosmos DB ([dotnet/efcore#37577](https://github.com/dotnet/efcore/pull/37577)). This community contribution adds query pipeline support for complex types stored as embedded documents in Cosmos DB, including nullable handling, equality comparison, and collection support.

```csharp
// Query entities with complex properties in Cosmos DB
var results = await context.Orders
    .Where(o => o.ShippingAddress.City == "Seattle")
    .ToListAsync();
```

Thank you [@JoasE](https://github.com/JoasE) for this contribution!

## Partial property loading in relational queries

Relational queries now support partial property loading, allowing you to load only a subset of an entity's properties from the database ([dotnet/efcore#37857](https://github.com/dotnet/efcore/pull/37857)). This reduces data transfer when you only need specific columns from a table.

## Community contributors

Thank you contributors! ❤️

- [@JoasE](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3AJoasE)
