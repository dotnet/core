# Entity Framework Core 9 Preview 2 Release Notes

The team has been working primarily on EF Core internals, so there are no new big features in EF Core 9 (EF9) Preview 2. However, this means we really need people like you to run your code on these new internals and report back what you find. We want to fix bugs in the new internals as soon as possible in order to have a strong GA release later in the year.

That being said, there are several smaller enhancements included in preview 2, many contributed by our community. For full details, see [What's new in EF Core 9](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew). To discuss the EF9 release, go to [Try EF Core 9 now!](https://github.com/dotnet/efcore/issues/33030) on GitHub.

## Improved queries

- Inlined uncorrelated subqueries
  - In EF8, an IQueryable referenced in another query may be executed as a separate database roundtrip.
  - See [Inlined uncorrelated subqueries](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#inlinedsubs) for full details.
- New ToHashSetAsync methods
  - The `ToHashSet` methods have existed since .NET Core 2.0. In EF9, the equivalent async methods have been added.
  - See [New `ToHashSetAsync<T>` methods](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#hashsetasync) for full details.

## Improved model building

- Specify caching for sequences
  - EF9 allows setting the caching options for database sequences for any relational database provider that supports this.
  - See [Specify caching for sequences](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#sequence-caching) for full details.
- Specify fill-factor for keys and indexes
  - EF9 supports specification of the SQL Server fill-factor when using EF Core Migrations to create keys and indexes.
  - See [Specify fill-factor for keys and indexes](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#fill-factor) for full details.

## Improved tooling

- Fewer rebuilds when using `dotnet ef` tools
  - EF9 invalidates build caches less often, resulting in faster re-builds. 
  - See [Fewer rebuilds](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#fewer-rebuilds) for full details.

## Everything else in preview 2

Preview 2 contains:

- [8 enhancements](https://github.com/dotnet/efcore/issues?q=is%3Aissue+milestone%3A9.0.0-preview2+is%3Aclosed+label%3Atype-enhancement)
- [10 bug fixes](https://github.com/dotnet/efcore/issues?q=is%3Aissue+milestone%3A9.0.0-preview1+is%3Aclosed+label%3Atype-bug)

EF Core 9 preview 2 (and Microsoft.Data.Sqlite) contains work from the EF Team at Microsoft (@roji @AndriySvyryd @maumar @ajcvickers) as well as contributions from the EF Core community. The community PRs in EF9 Preview 1 are:

- @Poppyto: [stackalloc for BytesToDecimal](https://github.com/dotnet/efcore/pull/31190)
- @francopettinari: [Microsoft.Data.Sqlite.Core issue with multiple Blob colums](https://github.com/dotnet/efcore/pull/32770)
- @wertzui: [Added `ToHashSetAsync<T>` Extension methods on `IQueryable<T>`](https://github.com/dotnet/efcore/pull/32905)
- @Suchiman: [Fix incremental builds](https://github.com/dotnet/efcore/pull/32860)
- @btecu: [Cleanup asserts](https://github.com/dotnet/efcore/pull/32968)
- @EngincanV: [Fix typos on DeleteBehavior.cs](https://github.com/dotnet/efcore/pull/32781)
- @petterh: [Fix typos, doubled words](https://github.com/dotnet/efcore/pull/32372)
- @deano-hunter: [Add fill factor to keys and unique constraints](https://github.com/dotnet/efcore/pull/32900)