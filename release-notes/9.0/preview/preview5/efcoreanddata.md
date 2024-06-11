# Entity Framework Core 9 Preview 5 - Release Notes

Here's a summary of what's new in Entity Framework Core in this preview release:

- [Enhanced database provider for Azure Cosmos DB for NoSQL](#enhanced-database-provider-for-azure-cosmos-db-for-nosql)
- [Query translation improvements](#query-translation-improvements)

Entity Framework Core 9:

- [What's new in Entity Framework Core](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew) documentation.
- [Discussion](https://github.com/dotnet/efcore/issues/33030)

.NET 9 Preview 5:

- [Discussion](https://aka.ms/dotnet/9/preview5)
- [Release notes](./README.md)
 
## Enhanced database provider for Azure Cosmos DB for NoSQL
We are working on significant updates in EF9 to the EF Core database provider for Azure Cosmos DB for NoSQL. For preview 5, these include:
 
* Support for hierarchical partition keys
* Use of any numeric, bool, string, or value-converted type as a partition key
 
See [Azure Cosmos DB for NoSQL](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#cosmos) in the _What's New_ docs for more information.
 
## Query translation improvements
EF9 preview 5 contains three small enhancements to query translation:
 
* Optimization of queries using `Count != 0` or `Count > 0`
* Null semantics for comparison operators
* Translations for `TimeOnly.FromDateTime` and `TimeOnly.FromTimeSpan`
 
See [LINQ and SQL translation](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#linq-and-sql-translation) in the _What's New_ docs for more information.
 
## Everything else in preview 5
Preview 5 contains:
 
* [6 enhancements](https://github.com/dotnet/efcore/issues?q=is%3Aissue+milestone%3A9.0.0-preview5+is%3Aclosed+label%3Atype-enhancement+)
* [6 bug fixes](https://github.com/dotnet/efcore/issues?q=is%3Aissue+milestone%3A9.0.0-preview5+is%3Aclosed+label%3Atype-bug)
 
EF Core 9 preview 5 and Microsoft.Data.Sqlite contain work from the EF Team at Microsoft (@roji @AndriySvyryd @maumar @ajcvickers @cincuranet @SamMonoRT @luisquintanilla).
