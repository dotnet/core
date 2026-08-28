# Entity Framework Core in .NET 11 RC 1 - Release Notes

.NET 11 RC 1 focuses on fixes and stabilization for EF Core 11. For the full
set of EF Core 11 features, see
[What's new in EF Core 11](https://learn.microsoft.com/ef/core/what-is-new/ef-core-11.0/whatsnew).

## Bug fixes

- **Query translation**
  - Fixed `OPENJSON ... AS JSON` queries for native `json` columns on Azure SQL
    at compatibility level 170
    ([dotnet/efcore #38665](https://github.com/dotnet/efcore/pull/38665)).
- **Model building and migrations**
  - Fixed model finalization and migration scaffolding when a foreign key
    references a key declared on a complex type property
    ([dotnet/efcore #38764](https://github.com/dotnet/efcore/pull/38764)).
  - Fixed the default `IsTableExcludedFromMigrations` value for entity
    splitting
    ([dotnet/efcore #38802](https://github.com/dotnet/efcore/pull/38802)).
- **SQLite**
  - Handled unavailable WinRT APIs when initializing `Microsoft.Data.Sqlite`,
    including partially implemented APIs under Wine
    ([dotnet/efcore #38612](https://github.com/dotnet/efcore/pull/38612)).

<!-- Filtered features:
  - No new broadly useful EF Core feature was identified in the authoritative
    RC 1 change set. This note intentionally summarizes customer-facing fixes
    rather than promoting dependency, infrastructure, analyzer-performance, or
    documentation-only changes as features.
-->

## Community contributors

Thank you contributors! ❤️

- [@BrycensRanch](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3ABrycensRanch)
