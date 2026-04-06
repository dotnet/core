# EF Core in .NET 11 Preview 3 - Release Notes

.NET 11 Preview 3 includes new EF Core features and tooling improvements:

- [`ChangeTracker.GetEntriesForState()` avoids extra change detection](#changetrackergetentriesforstate-avoids-extra-change-detection)
- [DbContext configuration can remove providers and add pooled factories](#dbcontext-configuration-can-remove-providers-and-add-pooled-factories)
- [Migrations get more control and clearer feedback](#migrations-get-more-control-and-clearer-feedback)
- [SQL generation is leaner and SQL Server adds JSON APIs](#sql-generation-is-leaner-and-sql-server-adds-json-apis)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

EF Core updates in .NET 11:

- [What's new in EF Core](https://learn.microsoft.com/ef/core/what-is-new/ef-core-11.0/whatsnew)

<!-- Verified against Microsoft.EntityFrameworkCore@11.0.0-preview.3.26179.102 and Microsoft.EntityFrameworkCore.Relational@11.0.0-preview.3.26179.102 -->

## `ChangeTracker.GetEntriesForState()` avoids extra change detection

A new `GetEntriesForState()` API on `ChangeTracker` returns tracked entities in
selected states without forcing a `DetectChanges()` pass first
([dotnet/efcore #37847](https://github.com/dotnet/efcore/pull/37847)). This
avoids an extra `DetectChanges()` pass in long-lived contexts or high-volume
change-tracking code where you already know which states you care about.

```csharp
var modified = context.ChangeTracker.GetEntriesForState(
    added: false,
    modified: true,
    deleted: false,
    unchanged: false);
```

## DbContext configuration can remove providers and add pooled factories

Preview 3 adds `RemoveDbContext()` / `RemoveExtension()` helpers for removing a
previous provider configuration before registering a different one
([dotnet/efcore #37891](https://github.com/dotnet/efcore/pull/37891)). This is
especially useful in tests, where a production SQL Server configuration is
replaced with an in-memory or SQLite provider.

`AddPooledDbContextFactory<TContext>()` also now has a parameterless overload,
so configuration that already lives in `ConfigureDbContext<TContext>()` no
longer needs the extra setup boilerplate
([dotnet/efcore #37144](https://github.com/dotnet/efcore/pull/37144)).

```csharp
services.RemoveDbContext<MyContext>();
services.AddPooledDbContextFactory<MyContext>();
```

## Migrations get more control and clearer feedback

EF Core now lets you exclude a foreign-key constraint from migrations with
`ExcludeForeignKeyFromMigrations(true)`
([dotnet/efcore #37815](https://github.com/dotnet/efcore/pull/37815)). The model
snapshot also records the latest migration ID so EF can detect diverged
migration trees earlier in team workflows
([dotnet/efcore #37689](https://github.com/dotnet/efcore/pull/37689)).

```csharp
modelBuilder.Entity<Order>()
    .HasOne(o => o.Customer)
    .WithMany(c => c.Orders)
    .ExcludeForeignKeyFromMigrations(true);
```

## SQL generation is leaner and SQL Server adds JSON APIs

Query generation for to-one joins is now leaner, with cleaner SQL and fewer
unnecessary joins in common cases
([dotnet/efcore #37819](https://github.com/dotnet/efcore/pull/37819)). SQL
Server 2025 users also get `EF.Functions.JsonContains()`, and the earlier
preview API has been renamed to `JsonPathExists()` for clarity
([dotnet/efcore #37714](https://github.com/dotnet/efcore/pull/37714),
[dotnet/efcore #37732](https://github.com/dotnet/efcore/pull/37732)).

<!-- Filtered features (significant engineering work, but too weakly exposed or too niche for release notes):
  - Partial property loading / vector-property avoidance: promising work, but the public API story is still not obvious enough to teach confidently here.
  - Several compiled-model and provider-infrastructure changes: useful guardrails, but better carried as shorter notes than full sections.
-->

## Breaking changes

- `RelationalEventId.MigrationsNotFound` now throws by default instead of only
  logging an informational message
  ([dotnet/efcore #37839](https://github.com/dotnet/efcore/pull/37839)).
- `Microsoft.EntityFrameworkCore.Tools` and
  `Microsoft.EntityFrameworkCore.Tasks` no longer depend directly on
  `Microsoft.EntityFrameworkCore.Design`
  ([dotnet/efcore #37837](https://github.com/dotnet/efcore/pull/37837)).
- Preview 3 updates `Microsoft.Data.SqlClient` to 7.0.0. Review the SqlClient
  release notes if you depend on provider-specific SQL Server behavior
  ([dotnet/efcore #37949](https://github.com/dotnet/efcore/pull/37949)).

## Bug fixes

- Improved error reporting when spatial or `HierarchyId` types are used without
  the expected provider configuration
  ([dotnet/efcore #37733](https://github.com/dotnet/efcore/pull/37733)).
- Added a clearer exception when a property's backing field cannot be found
  ([dotnet/efcore #36720](https://github.com/dotnet/efcore/pull/36720)).
- Fixed `ExecuteUpdate` over scalar projections and nullable-value-type
  `SetProperty` lambdas
  ([dotnet/efcore #37791](https://github.com/dotnet/efcore/pull/37791),
  [dotnet/efcore #37975](https://github.com/dotnet/efcore/pull/37975)).
- Fixed several JSON and complex-property edge cases in query translation and
  migrations
  ([dotnet/efcore #37823](https://github.com/dotnet/efcore/pull/37823),
  [dotnet/efcore #37855](https://github.com/dotnet/efcore/pull/37855),
  [dotnet/efcore #37965](https://github.com/dotnet/efcore/pull/37965)).

## Community contributors

Thank you to the community contributors who made EF Core better in this preview:

- [@aw0lid (Ahmed Waleed)](https://github.com/aw0lid): Fixed a memory leak in
  `LazyLoaderFactory` where strong references to `ILazyLoader` instances
  prevented garbage collection during large-scale data streaming
  ([dotnet/efcore #37977](https://github.com/dotnet/efcore/pull/37977))
- [@bkarakaya01 (Burak Karakaya)](https://github.com/bkarakaya01): Added
  parameterless `AddPooledDbContextFactory` overloads for cleaner DI
  registration with `ConfigureDbContext`
  ([dotnet/efcore #37144](https://github.com/dotnet/efcore/pull/37144))
- [@JoasE](https://github.com/JoasE): Implemented Cosmos DB complex-properties
  query support and follow-up fixes
  ([dotnet/efcore #37577](https://github.com/dotnet/efcore/pull/37577),
  [dotnet/efcore #37919](https://github.com/dotnet/efcore/pull/37919),
  [dotnet/efcore #37941](https://github.com/dotnet/efcore/pull/37941),
  [dotnet/efcore #37971](https://github.com/dotnet/efcore/pull/37971))
- [@kawasaniac (Arkadii)](https://github.com/kawasaniac): Added descriptive
  exceptions when a property's backing field cannot be found during compiled
  model code generation
  ([dotnet/efcore #36720](https://github.com/dotnet/efcore/pull/36720))
- [@MarkMpn (Mark Carrington)](https://github.com/MarkMpn): Enabled foreign key
  support in Dataverse reverse engineering
  ([dotnet/efcore #34689](https://github.com/dotnet/efcore/pull/34689))
- [@Pmyl (Giulio Caprino)](https://github.com/Pmyl): Fixed persisting null
  optional complex properties with default values
  ([dotnet/efcore #37944](https://github.com/dotnet/efcore/pull/37944))
- [@SimonCropp (Simon Cropp)](https://github.com/SimonCropp): Updated
  `Microsoft.Data.SqlClient` to 7.0.0
  ([dotnet/efcore #37949](https://github.com/dotnet/efcore/pull/37949))
- [@yykkibbb](https://github.com/yykkibbb): Improved error reporting for spatial
  and `HierarchyId` types without provider configured and ensured `HasPrecision`
  is always scaffolded for `decimal` columns in SQL Server
  ([dotnet/efcore #37733](https://github.com/dotnet/efcore/pull/37733),
  [dotnet/efcore #37730](https://github.com/dotnet/efcore/pull/37730))
