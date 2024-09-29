# Entity Framework Core 9 Preview 3 - Release Notes

Here's a summary of what's new in Entity Framework Core in this preview release:

- Auto-compiled models
- Sugar for `HierarchyId` path generation

Entity Framework Core 9:

- [What's new in Entity Framework Core](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew) documentation.
- [Discussion](https://github.com/dotnet/efcore/issues/33030)

.NET 9 Preview 3:

- [Discussion](https://aka.ms/dotnet/9/preview3)
- [Release notes](./README.md)
 
 
## Auto-compiled models
 Auto-compiled models allow the [EF Core compiled model](https://learn.microsoft.com/ef/core/performance/advanced-performance-topics#compiled-models) to be automatically regenerated when the model project is built. This means you no longer need to remember to re-run the `dotnet ef dbcontext optimize` command after your EF model changes. See [Auto-compiled models](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#auto-compiled-models) in the _What's New_ docs for more information.
 
## Sugar for `HierarchyId` path generation
 First class support for the SQL Server `HierarchyId` type was [added in EF8](https://learn.microsoft.com/ef/core/providers/sql-server/hierarchyid). In EF9, a sugar method has been added to make it easier to create new child nodes in the tree structure. See [Sugar for HierarchyId path generation](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#hierarchyid-path-generation) in the _What's New_ docs for more information.
 
## Everything else in Preview 3
Preview 3 contains:

* [6 enhancements](https://github.com/dotnet/efcore/issues?q=is%3Aissue+milestone%3A9.0.0-preview3+is%3Aclosed+label%3Atype-enhancement+)
* [5 bug fixes](https://github.com/dotnet/efcore/issues?q=is%3Aissue+milestone%3A9.0.0-preview3+is%3Aclosed+label%3Atype-bug)

EF Core 9 preview 3 (and Microsoft.Data.Sqlite) contains work from the EF Team at Microsoft (@roji @AndriySvyryd @maumar @ajcvickers @cincuranet @SamMonoRT @luisquintanilla) as well as contributions from the EF Core community. The community PRs in EF9 Preview 3 are:

* @lauxjpn: [Cleanup duplicate tests (same test ID)](https://github.com/dotnet/efcore/pull/33185)
* @clement911: [Fixed typo in getting-and-building-the-code.md](https://github.com/dotnet/efcore/pull/33166)
* @Rezakazemi890: [32943-Sugar for HierarchyId path generation](https://github.com/dotnet/efcore/pull/33062)
* @lauxjpn: [Change Where_math(f)_log_new_base queries, so they fail if LOG() parameters are swapped](https://github.com/dotnet/efcore/pull/33342)
* @SteSinger: [33196 command timeout allow zero](https://github.com/dotnet/efcore/pull/33198)