# Entity Framework Core 9 Preview 4 - Release Notes

Here's a summary of what's new in Entity Framework Core in this preview release:

- [Enhanced database provider for Azure Cosmos DB for NoSQL](#enhanced-database-provider-for-azure-cosmos-db-for-nosql)
- [GroupBy complex types](#groupby-complex-types)
- [Read-only primitive collections](#read-only-primitive-collections)

Entity Framework Core 9:

- [What's new in Entity Framework Core](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew) documentation.
- [Discussion](https://github.com/dotnet/efcore/issues/33030)

.NET 9 Preview 4:

- [Discussion](https://aka.ms/dotnet/9/preview4)
- [Release notes](./README.md)
 
## Enhanced database provider for Azure Cosmos DB for NoSQL
 The EF Core database provider for Azure Cosmos DB for NoSQL has received the following updates:
 
* Role-based access control (RBAC) is supported by EF9 for both management and use of containers.
* Azure Cosmos DB for NoSQL does not support synchronous (blocking) access from application code. EF Core now blocks synchronous access by default, helping people fall into the pit-of-success of using async I/O.
* Cosmos primitive collection support has been updated to use the metadata and model building APIs from EF8
 
> See [Azure Cosmos DB for NoSQL](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#cosmos) in the _What's New_ docs for more information.
  
  
## GroupBy complex types
Support for grouping (`GroupBy` queries) that group by a complex type instance. The resulting SQL uses groups by all members, reflecting the value object semantics of complex types.

> See [GroupBy complex types](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#groupby-complex-types) in the _What's New_ docs for more information.
 
## Read-only primitive collections
EF8 introduced support for mapping arrays and mutable lists of primitive types. This has been expanded to include read-only collections declared as `IReadOnlyList`, `IReadOnlyCollection`, or `ReadOnlyCollection`.
 
> See [Read-only primitive collections](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#read-only-primitives) in the _What's New_ docs for more information.
 
## Everything else in preview 4

* [10 enhancements](https://github.com/dotnet/efcore/issues?q=is%3Aissue+milestone%3A9.0.0-preview4+is%3Aclosed+label%3Atype-enhancement+)
* [15 bug fixes](https://github.com/dotnet/efcore/issues?q=is%3Aissue+milestone%3A9.0.0-preview4+is%3Aclosed+label%3Atype-bug)

EF Core 9 Preview 4 (and Microsoft.Data.Sqlite) contains work from the EF Team at Microsoft (@roji @AndriySvyryd @maumar @ajcvickers @cincuranet @SamMonoRT @luisquintanilla) as well as contributions from the EF Core community. The community PRs in EF9 Preview 4 are:

* @y0ung3r: [InMemoryTable: Make IsConcurrencyConflict() method more readable](https://github.com/dotnet/efcore/pull/33561)

