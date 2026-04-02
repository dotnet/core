# EF Core in .NET 11 Preview 3 - Release Notes

.NET 11 Preview 3 includes new EF Core features and enhancements:

- [Partial property loading](#partial-property-loading)
- [Better SQL for to-one joins](#better-sql-for-to-one-joins)
- [`ChangeTracker.GetEntriesForState()`](#changetrackergetentriesforstate)
- [Migrations improvements](#migrations-improvements)
- [`EF.Functions.JsonContains` for SQL Server 2025](#effunctionsjsoncontains-for-sql-server-2025)
- [Azure Cosmos DB improvements](#azure-cosmos-db-improvements)
- [`RemoveExtension` and `RemoveDbContext` APIs](#removeextension-and-removedbcontext-apis)
- [Parameterless `AddPooledDbContextFactory` overload](#parameterless-addpooleddbcontextfactory-overload)
- [Compiled model provider awareness](#compiled-model-provider-awareness)
- [CLI tooling improvements](#cli-tooling-improvements)
- [Microsoft.Data.SqlClient 7.0.0](#microsoftdatasqlclient-700)
- [Error message improvements](#error-message-improvements)
- [Additional improvements](#additional-improvements)

EF Core updates in .NET 11:

- [What's new in EF Core](https://learn.microsoft.com/ef/core/what-is-new/ef-core-11.0/whatsnew)

<!-- API verification notes:
  Package: Microsoft.EntityFrameworkCore@11.0.0-preview.3.26179.102
  Source:  https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet11/nuget/v3/index.json

  ChangeTracker.GetEntriesForState(bool, bool, bool, bool) — CONFIRMED (generic + non-generic)
  EntityFrameworkServiceCollectionExtensions.AddPooledDbContextFactory<TContext>(IServiceCollection, int) — CONFIRMED
  EntityFrameworkServiceCollectionExtensions.RemoveDbContext<TContext>(IServiceCollection, bool) — CONFIRMED
  DbContextOptions.WithoutExtension<TExtension>() — CONFIRMED
  SqlServerDbFunctionsExtensions.JsonContains(DbFunctions, object, object, string?, int?) — CONFIRMED
  RelationalForeignKeyBuilderExtensions.ExcludeForeignKeyFromMigrations — CONFIRMED (8 overloads)
-->

## Features

### Partial property loading

EF Core can now exclude specific properties from queries, enabling partial loading of entities. This is particularly useful for large properties such as binary blobs or vector embeddings where loading the entire entity is unnecessary.

The new `AutoLoaded` model-building API marks properties that should not be included in queries by default. When a property is not auto-loaded, EF Core provides sentinel values for excluded properties and skips them during change tracking.

```csharp
modelBuilder.Entity<Product>()
    .Property(p => p.Embedding)
    .AutoLoaded(false);

// Only loads Id, Name — Embedding is excluded
var products = await context.Products.ToListAsync();
```

To explicitly include an excluded property when needed, use a projection:

```csharp
var productsWithEmbedding = await context.Products
    .Select(p => new { p.Id, p.Name, p.Embedding })
    .ToListAsync();
```

See [dotnet/efcore#37857](https://github.com/dotnet/efcore/pull/37857) and [dotnet/efcore#37829](https://github.com/dotnet/efcore/pull/37829).

### Better SQL for to-one joins

EF Core now generates cleaner SQL for to-one navigation joins. Entity keys from joined tables are no longer added to query identifiers when unnecessary, and the query optimizer prunes to-one `JOIN` clauses that don't contribute to the result.

This reduces the SQL column count and can eliminate entire `JOIN` operations when the joined entity's columns are not referenced in the final projection.

See [dotnet/efcore#37819](https://github.com/dotnet/efcore/pull/37819).

### `ChangeTracker.GetEntriesForState()`

A new `GetEntriesForState` method on `ChangeTracker` returns tracked entities filtered by state without triggering `DetectChanges()`. This is critical for long-lived contexts tracking many entities where calling `Entries()` and filtering afterward forces a full change detection pass.

```csharp
// Before: triggers DetectChanges(), then filters
var modified = context.ChangeTracker.Entries()
    .Where(e => e.State == EntityState.Modified);

// After: no DetectChanges(), directly queries the state manager
var modified = context.ChangeTracker.GetEntriesForState(
    added: false, modified: true, deleted: false, unchanged: false);
```

Both generic `GetEntriesForState<TEntity>()` and non-generic overloads are available.

See [dotnet/efcore#37847](https://github.com/dotnet/efcore/pull/37847).

### Migrations improvements

#### Exclude foreign keys from migrations

Foreign key constraints can now be excluded from migration generation. This is useful for databases where foreign key enforcement is handled at the application level or where constraints cause performance issues.

```csharp
modelBuilder.Entity<Order>()
    .HasOne(o => o.Customer)
    .WithMany(c => c.Orders)
    .ExcludeForeignKeyFromMigrations();
```

See [dotnet/efcore#37815](https://github.com/dotnet/efcore/pull/37815).

#### Diverged migration tree detection

The model snapshot now records the latest migration ID. EF Core detects when multiple developers create migrations from the same starting point and warns about diverged migration trees, helping teams catch merge conflicts earlier.

See [dotnet/efcore#37689](https://github.com/dotnet/efcore/pull/37689).

#### Migration ID as scaffolded type name

Scaffolded migration classes now use the migration ID as their type name. This makes migration files more identifiable and reduces naming conflicts.

See [dotnet/efcore#37841](https://github.com/dotnet/efcore/pull/37841).

#### `MigrationsNotFound` throws by default

`RelationalEventId.MigrationsNotFound` now throws an exception by default instead of logging an informational message. This catches common misconfiguration where `EnsureCreated` or `Migrate` is called on a context without any migrations defined. Suppress the exception with `ConfigureWarnings` if needed.

See [dotnet/efcore#37839](https://github.com/dotnet/efcore/pull/37839).

#### Preserve batch terminators in migration scripts

`Script-Migration` now preserves `GO` batch separators within transaction blocks. Statements such as `CREATE VIEW` that must be the first statement in a batch now work correctly when wrapped in custom `migrationBuilder.Sql()` calls containing `GO` separators.

See [dotnet/efcore#37810](https://github.com/dotnet/efcore/pull/37810).

### `EF.Functions.JsonContains` for SQL Server 2025

A new `EF.Functions.JsonContains()` method translates to the SQL Server `JSON_CONTAINS` function available in SQL Server 2025. This complements the existing `JsonPathExists` function (renamed from `JsonExists` in this preview; see [dotnet/efcore#37732](https://github.com/dotnet/efcore/pull/37732)).

See [dotnet/efcore#37714](https://github.com/dotnet/efcore/pull/37714).

### Azure Cosmos DB improvements

#### Complex properties in queries

The Cosmos DB provider now supports complex properties in the query pipeline. Complex types are projected, filtered, and materialized correctly, matching the relational provider behavior.

See [dotnet/efcore#37577](https://github.com/dotnet/efcore/pull/37577).

#### Complex property name mapping

Complex properties in Cosmos DB now support explicit property name mapping via the model-building API, consistent with how owned types work.

See [dotnet/efcore#37919](https://github.com/dotnet/efcore/pull/37919).

#### Session token tracking for failure responses

The Cosmos DB provider now tracks session tokens returned from precondition failures, conflicts, and document-not-found responses. Subsequent reloads read the latest document version after a failed write.

See [dotnet/efcore#37941](https://github.com/dotnet/efcore/pull/37941).

#### Empty collection initialization in projections

Cosmos DB projections now correctly initialize empty collections. Previously, collections with no items were not initialized during projection binding when tracking was disabled.

See [dotnet/efcore#37971](https://github.com/dotnet/efcore/pull/37971).

### `RemoveExtension` and `RemoveDbContext` APIs

New APIs enable removing a previously registered database provider from `DbContextOptions`. This simplifies test scenarios where a production provider (e.g. SQL Server) needs to be swapped for an in-memory provider.

```csharp
// Remove the previously registered SQL Server provider
services.RemoveDbContext<MyContext>();

// Register the test provider
services.AddDbContext<MyContext>(options => options.UseInMemoryDatabase("TestDb"));
```

`IDbContextOptionsBuilderInfrastructure` also gains a `RemoveExtension<TExtension>()` method for removing specific option extensions, and `DbContextOptions` adds `WithoutExtension<TExtension>()` for immutable options manipulation.

See [dotnet/efcore#37891](https://github.com/dotnet/efcore/pull/37891).

### Parameterless `AddPooledDbContextFactory` overload

`AddPooledDbContextFactory<TContext>()` now has a parameterless overload (and a poolSize-only overload). When using `ConfigureDbContext<TContext>()` to centralize configuration, you no longer need to pass a redundant no-op action.

```csharp
// Before
services.AddPooledDbContextFactory<MyContext>(_ => { });

// After
services.AddPooledDbContextFactory<MyContext>();
```

See [dotnet/efcore#37144](https://github.com/dotnet/efcore/pull/37144).

### Compiled model provider awareness

Compiled models now record the database provider they were built for. At startup, EF Core compares the compiled model's provider against the configured provider and logs a warning if they don't match, skipping discovery of incompatible compiled models. This prevents subtle runtime errors when switching providers without regenerating compiled models.

See [dotnet/efcore#37840](https://github.com/dotnet/efcore/pull/37840).

### CLI tooling improvements

#### Diagnostic output routed to stderr

`dotnet ef` now writes diagnostic messages ("Build started…", "Build succeeded.") to stderr. Command output goes to stdout only, making piping and redirection work correctly (e.g. `dotnet ef migrations script > migrate.sql`). The help display for invalid commands now returns a non-zero exit code.

See [dotnet/efcore#37744](https://github.com/dotnet/efcore/pull/37744).

#### Platform-specific app warning

`dotnet ef` now warns when the startup project targets a platform-specific TFM (e.g. `net8.0-windows10.0.19041.0`). EF tooling does not support platform-specific apps and previously failed with unhelpful errors.

See [dotnet/efcore#37868](https://github.com/dotnet/efcore/pull/37868).

#### EFCore.Design dependency removed from Tools and Tasks

`Microsoft.EntityFrameworkCore.Tools` and `Microsoft.EntityFrameworkCore.Tasks` no longer depend on `Microsoft.EntityFrameworkCore.Design` directly. The `net472` TFM has also been dropped from the tools package.

See [dotnet/efcore#37837](https://github.com/dotnet/efcore/pull/37837).

### Microsoft.Data.SqlClient 7.0.0

EF Core now uses `Microsoft.Data.SqlClient` 7.0.0. Review the [SqlClient 7.0 release notes](https://github.com/dotnet/SqlClient/blob/main/release-notes/7.0/7.0.0.md) for details on new features and breaking changes in the underlying data provider.

See [dotnet/efcore#37949](https://github.com/dotnet/efcore/pull/37949).

### Error message improvements

- Spatial and `HierarchyId` types now produce a clear error message when used without the required provider package configured ([dotnet/efcore#37733](https://github.com/dotnet/efcore/pull/37733)).
- Compiled model code generation now throws a descriptive `InvalidOperationException` when a property's backing field cannot be found or an unsafe accessor cannot be generated ([dotnet/efcore#36720](https://github.com/dotnet/efcore/pull/36720)).
- `IsExcludedFromMigrations` now throws when called on a runtime model, which does not support this operation ([dotnet/efcore#37869](https://github.com/dotnet/efcore/pull/37869)).

### Additional improvements

- Reverse engineering now always scaffolds `HasPrecision` for `decimal` columns in SQL Server, even when the precision matches the default ([dotnet/efcore#37730](https://github.com/dotnet/efcore/pull/37730)).
- All `UseOldBehavior*` AppContext quirk switches from previous servicing releases have been removed. The corrected behavior is now unconditional ([dotnet/efcore#37770](https://github.com/dotnet/efcore/pull/37770)).
- Dataverse reverse engineering now supports foreign keys ([dotnet/efcore#34689](https://github.com/dotnet/efcore/pull/34689)).

<!-- Filtered features:
  - SharedTableConvention.KeysUniqueAcrossSchemas (provider extensibility point, dotnet/efcore#37861)
  - GetContainerColumnType() always returns expected type (internal API, dotnet/efcore#37864)
-->

## Bug fixes

### Complex types

- Fix `ArgumentOutOfRangeException` when deleting from a complex collection with nested arrays ([dotnet/efcore#37702](https://github.com/dotnet/efcore/pull/37702))
- Fix `InvalidCastException` in `ArrayPropertyValues.ToObject()` with nested nullable complex properties ([dotnet/efcore#37762](https://github.com/dotnet/efcore/pull/37762))
- Fix struct complex type boxing during collection materialization ([dotnet/efcore#37934](https://github.com/dotnet/efcore/pull/37934))
- Fix projection of required complex type via left join ([dotnet/efcore#37928](https://github.com/dotnet/efcore/pull/37928))
- Fix persisting null optional complex property with default values ([dotnet/efcore#37944](https://github.com/dotnet/efcore/pull/37944))

### TPH inheritance

- Fix `HasDiscriminator` with default name "Discriminator" failing for non-string types ([dotnet/efcore#37785](https://github.com/dotnet/efcore/pull/37785))
- Fix `RowVersion` concurrency issue when replacing entities with TPH inheritance and owned types ([dotnet/efcore#37788](https://github.com/dotnet/efcore/pull/37788))
- Fix owned entities with default values not saved in TPH with shared columns ([dotnet/efcore#37751](https://github.com/dotnet/efcore/pull/37751))
- Fix `NullReferenceException` when accessing null complex properties in TPH with shared columns ([dotnet/efcore#37695](https://github.com/dotnet/efcore/pull/37695))
- Fix complex property JSON column not marked nullable in TPH hierarchy ([dotnet/efcore#37781](https://github.com/dotnet/efcore/pull/37781))

### JSON columns

- Fix `NullReferenceException` in `FindJsonPartialUpdateInfo` when replacing TPH derived entity with owned JSON ([dotnet/efcore#37823](https://github.com/dotnet/efcore/pull/37823))
- Fix `NullReferenceException` in `AddJsonNavigationBindings` when combining `DbFunction` with `OwnsOne`/`OwnsMany` `ToJson` ([dotnet/efcore#37855](https://github.com/dotnet/efcore/pull/37855))
- Fix `ComplexCollection` `ToJson` migration default value using `"{}"` instead of `"[]"` ([dotnet/efcore#37965](https://github.com/dotnet/efcore/pull/37965))

### Query

- Fix projection of entities with complex collections through subqueries ([dotnet/efcore#37747](https://github.com/dotnet/efcore/pull/37747))
- Fix `ExecuteUpdate` over scalar projections ([dotnet/efcore#37791](https://github.com/dotnet/efcore/pull/37791))
- Fix `SetProperty` discard lambda failing for nullable value type properties in `ExecuteUpdate` ([dotnet/efcore#37975](https://github.com/dotnet/efcore/pull/37975))
- Fix `NullReferenceException` in `SqlServerStringMethodTranslator.TranslateIndexOf` for casted parameters ([dotnet/efcore#37956](https://github.com/dotnet/efcore/pull/37956))

### Change tracking

- Restore ordinals when changing entity state from `Deleted`/`Added` ([dotnet/efcore#37729](https://github.com/dotnet/efcore/pull/37729))
- Fix FK dependency ordering when replacing row-sharing owned entity ([dotnet/efcore#37799](https://github.com/dotnet/efcore/pull/37799))
- Fix in-memory corruption of nested owned entities after `SaveChanges` when navigation is replaced ([dotnet/efcore#37787](https://github.com/dotnet/efcore/pull/37787))
- Fix memory leak in `LazyLoaderFactory` caused by strong-reference tracking of `ILazyLoader` instances ([dotnet/efcore#37977](https://github.com/dotnet/efcore/pull/37977))

### Scaffolding

- Emit all properties on the join type when scaffolding many-to-many relationships with composite foreign keys of 3+ properties ([dotnet/efcore#37783](https://github.com/dotnet/efcore/pull/37783))

### Model building

- Fix named query filters not overriding convention-set filters ([dotnet/efcore#37710](https://github.com/dotnet/efcore/pull/37710))

## Community contributors

Thank you to the community contributors who made EF Core better in this preview:

- [@aw0lid (Ahmed Waleed)](https://github.com/aw0lid): Fixed a memory leak in `LazyLoaderFactory` where strong references to `ILazyLoader` instances prevented garbage collection during large-scale data streaming ([dotnet/efcore#37977](https://github.com/dotnet/efcore/pull/37977))
- [@bkarakaya01 (Burak Karakaya)](https://github.com/bkarakaya01): Added parameterless `AddPooledDbContextFactory` overloads for cleaner DI registration with `ConfigureDbContext` ([dotnet/efcore#37144](https://github.com/dotnet/efcore/pull/37144))
- [@JoasE](https://github.com/JoasE): Implemented Cosmos DB complex properties query support ([dotnet/efcore#37577](https://github.com/dotnet/efcore/pull/37577)), complex property name mapping ([dotnet/efcore#37919](https://github.com/dotnet/efcore/pull/37919)), session token tracking for failure responses ([dotnet/efcore#37941](https://github.com/dotnet/efcore/pull/37941)), and empty collection initialization in projections ([dotnet/efcore#37971](https://github.com/dotnet/efcore/pull/37971))
- [@kawasaniac (Arkadii)](https://github.com/kawasaniac): Added descriptive exceptions when a property's backing field cannot be found during compiled model code generation ([dotnet/efcore#36720](https://github.com/dotnet/efcore/pull/36720))
- [@MarkMpn (Mark Carrington)](https://github.com/MarkMpn): Enabled foreign key support in Dataverse reverse engineering ([dotnet/efcore#34689](https://github.com/dotnet/efcore/pull/34689))
- [@Pmyl (Giulio Caprino)](https://github.com/Pmyl): Fixed persisting null optional complex properties with default values ([dotnet/efcore#37944](https://github.com/dotnet/efcore/pull/37944))
- [@SimonCropp (Simon Cropp)](https://github.com/SimonCropp): Updated `Microsoft.Data.SqlClient` to 7.0.0 ([dotnet/efcore#37949](https://github.com/dotnet/efcore/pull/37949))
- [@yykkibbb](https://github.com/yykkibbb): Improved error reporting for spatial and `HierarchyId` types without provider configured ([dotnet/efcore#37733](https://github.com/dotnet/efcore/pull/37733)) and ensured `HasPrecision` is always scaffolded for `decimal` columns in SQL Server ([dotnet/efcore#37730](https://github.com/dotnet/efcore/pull/37730))
