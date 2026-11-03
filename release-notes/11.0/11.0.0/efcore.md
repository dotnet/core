# EF Core and Data in .NET 11 - Release Notes

The final EF Core updates for .NET 11 focus on quality and stability.

## Bug fixes

### Queries

- [Allow context properties in global query filters using EF.Parameter or EF.Constant](https://github.com/dotnet/efcore/pull/39091)
- [Restore LEFT JOIN translation for affected correlated grouped queries instead of unsupported APPLY on SQLite](https://github.com/dotnet/efcore/pull/39237)

### JSON mapping

- [Create SQLite indexes over configured JSON members instead of entire JSON documents](https://github.com/dotnet/efcore/pull/39089)
- [Fix materialization of raw SQL queries with JSON-mapped complex properties](https://github.com/dotnet/efcore/pull/39295)
- [Fix nested JSON complex collections with detailed errors enabled, removing the need to disable detailed errors as a workaround](https://github.com/dotnet/efcore/pull/39477)

For features introduced throughout the release, see [What's new in EF Core in .NET 11](https://learn.microsoft.com/ef/core/what-is-new/ef-core-11.0/whatsnew).
