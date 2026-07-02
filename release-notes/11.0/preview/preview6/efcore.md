# Entity Framework Core in .NET 11 Preview 6 - Release Notes

<!-- Verified against Microsoft.EntityFrameworkCore@11.0.0-preview.6.26328.106 API diff -->

.NET 11 Preview 6 includes new EF Core features and improvements:

- [LINQ query translation improvements](#linq-query-translation-improvements)
- [Keys and indexes traverse complex-type properties](#keys-and-indexes-traverse-complex-type-properties)
- [Unconstrained foreign key relationships](#unconstrained-foreign-key-relationships)
- [Azure Cosmos DB provider improvements](#azure-cosmos-db-provider-improvements)
- [Migrations improvements](#migrations-improvements)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

All EF Core updates in .NET 11:

- [What's new in EF Core](https://learn.microsoft.com/ef/core/what-is-new/ef-core-11.0/whatsnew)

## LINQ query translation improvements

### FULL OUTER JOIN support in LINQ

EF Core translates the new `Queryable.FullJoin` LINQ operator to SQL `FULL OUTER JOIN`
([dotnet/efcore #38340](https://github.com/dotnet/efcore/pull/38340)). This mirrors
the existing `LeftJoin`/`RightJoin` support added in .NET 10. Rows unmatched on either
side appear in the result with null values for the missing side.

```csharp
var result = await context.Customers
    .FullJoin(
        context.Orders,
        c => c.Id,
        o => o.CustomerId,
        (c, o) => new { Customer = c, Order = o })
    .ToListAsync();
```

```sql
SELECT [c].[Id], [c].[Name], [o].[Id], [o].[CustomerId], [o].[Total]
FROM [Customers] AS [c]
FULL OUTER JOIN [Orders] AS [o] ON [c].[Id] = [o].[CustomerId]
```

### Translate to NULLIF

EF Core now generates SQL `NULLIF` for conditional expressions that return `null`
when a value equals a constant
([dotnet/efcore #35327](https://github.com/dotnet/efcore/pull/35327)). The
optimization applies at SQL expression construction time across all relational
providers.

```sql
-- Before: CASE WHEN [x].[Status] = 0 THEN NULL ELSE [x].[Status] END
-- After:  NULLIF([x].[Status], 0)
```

Thank you [@WhatzGames](https://github.com/WhatzGames) for the original
PostgreSQL implementation that this work is based on!

### Null propagation removes redundant IS NOT NULL checks

When a `CASE` expression simply replicates SQL's native null propagation,
EF Core now simplifies it away
([dotnet/efcore #34127](https://github.com/dotnet/efcore/pull/34127)). This
produces shorter SQL and can improve query-plan efficiency.

```sql
-- Before: CASE WHEN [o].[Date] IS NOT NULL THEN [o].[Date] ELSE NULL END
-- After:  [o].[Date]
```

Thank you [@ranma42](https://github.com/ranma42) for this contribution!

### Translate `List<T>.Exists` to SQL

`List<T>.Exists(predicate)` is now rewritten to `Queryable.Any(predicate)` and
translated to an `EXISTS` subquery
([dotnet/efcore #38226](https://github.com/dotnet/efcore/pull/38226)). Previously
this caused client evaluation.

```csharp
var blogs = await context.Blogs
    .Where(b => b.Posts.Exists(p => p.Rating > 3))
    .ToListAsync();
```

Thank you [@m-x-shokhzod](https://github.com/m-x-shokhzod) for this contribution!

### Translate TimeOnly members on SQLite

`TimeOnly.Hour`, `TimeOnly.Minute`, and `TimeOnly.Second` are now translated
to `strftime` on SQLite
([dotnet/efcore #38341](https://github.com/dotnet/efcore/pull/38341)). Previously
these threw a "could not be translated" exception.

```sql
WHERE CAST(strftime('%H', "b"."TimeOnly") AS INTEGER) = 15
```

Thank you [@Aykuttonpc](https://github.com/Aykuttonpc) for this contribution!

### Translate string.Join/Concat with ordering on SQLite

`string.Join` and `string.Concat` over ordered groupings now translate to
SQLite's `group_concat` with an `ORDER BY` clause
([dotnet/efcore #38344](https://github.com/dotnet/efcore/pull/38344)). Previously
these fell back to client evaluation.

```sql
COALESCE(group_concat("b"."String", '|' ORDER BY "b"."Id" DESC), '')
```

Thank you [@Aykuttonpc](https://github.com/Aykuttonpc) for this contribution!

## Keys and indexes traverse complex-type properties

`HasKey`, `HasAlternateKey`, and `HasIndex` now accept lambdas and dotted
property paths that traverse non-collection complex properties
([dotnet/efcore #38192](https://github.com/dotnet/efcore/pull/38192)). This
enables scenarios like defining an index on a property that lives inside a
complex type.

```csharp
modelBuilder.Entity<Customer>()
    .HasIndex(c => c.Address.ZipCode);

modelBuilder.Entity<Order>()
    .HasAlternateKey(o => o.ShippingAddress.Street);
```

Properties used in a key or index are automatically marked as required, along
with the complex properties on the path. Validation errors are raised for
collection complex properties or optional complex properties in keys.

### SQL Server JSON indexes

Indexes can now be defined on properties inside JSON-mapped columns on SQL
Server ([dotnet/efcore #38302](https://github.com/dotnet/efcore/pull/38302)).
This enables query performance tuning for JSON document properties without
leaving the EF Core model builder.

## Unconstrained foreign key relationships

A new `IsConstrained(bool)` API on foreign keys marks relationships that are
not backed by a database constraint
([dotnet/efcore #38361](https://github.com/dotnet/efcore/pull/38361)). When
`IsConstrained` is `false`, queries use `LEFT JOIN` instead of assuming the
principal exists, and relational migrations skip the `AddForeignKey` statement.
The Cosmos provider now defaults all non-owned foreign keys to unconstrained,
since Cosmos does not enforce foreign key constraints between documents.

```csharp
modelBuilder.Entity<Order>()
    .HasOne(o => o.Customer)
    .WithMany(c => c.Orders)
    .IsConstrained(false);
```

## Azure Cosmos DB provider improvements

### JSON, composite, include, and exclude indexes

The Cosmos provider now supports configuring JSON indexes, composite indexes,
include/exclude paths, and full-text indexes through the model builder
([dotnet/efcore #38360](https://github.com/dotnet/efcore/pull/38360)).

### Improved cast and convert support

The Cosmos provider now properly handles `Convert` operations in LINQ
expressions, enabling math functions and string concatenation with non-string
types that previously caused client evaluation
([dotnet/efcore #35000](https://github.com/dotnet/efcore/pull/35000)).

Thank you [@ChrisJollyAU](https://github.com/ChrisJollyAU) for this
contribution!

## Migrations improvements

### Index changes use DROP_EXISTING on SQL Server

When an index facet changes (fill factor, uniqueness, filter, sort order),
SQL Server migrations now emit a single `CREATE INDEX ... WITH (DROP_EXISTING = ON)`
instead of a `DROP INDEX` + `CREATE INDEX` pair
([dotnet/efcore #38271](https://github.com/dotnet/efcore/pull/38271)). This
keeps the old index available to queries while the replacement is built.

```sql
-- Before (two statements, un-indexed gap):
DROP INDEX [IX_People_X] ON [People];
CREATE UNIQUE INDEX [IX_People_X] ON [People] ([X]);

-- After (atomic, no gap):
CREATE UNIQUE INDEX [IX_People_X] ON [People] ([X]) WITH (DROP_EXISTING = ON);
```

Thank you [@m-x-shokhzod](https://github.com/m-x-shokhzod) for this contribution!

### Skip ALTER COLUMN for computed columns when only CLR type changes

Migrations no longer emit `ALTER COLUMN` for computed columns when only the
CLR type changes and the SQL expression is unchanged
([dotnet/efcore #38252](https://github.com/dotnet/efcore/pull/38252)). Previously
this caused a SQL Server error ("Cannot alter column because it is COMPUTED").

Thank you [@m-x-shokhzod](https://github.com/m-x-shokhzod) for this contribution!

### Wildcard `*` support in `dotnet ef` commands

The `--context *` parameter now works with `UpdateDatabase`, `GetMigrations`,
`ScriptMigration`, and `DropDatabase`, iterating over all discovered contexts
([dotnet/efcore #38269](https://github.com/dotnet/efcore/pull/38269),
[dotnet/efcore #38327](https://github.com/dotnet/efcore/pull/38327)).

Thank you [@BrunoSync](https://github.com/BrunoSync) for this contribution!

### Temporal period columns can be configured as not hidden

SQL Server temporal period columns can now be configured to omit the `HIDDEN`
flag, making them visible in `SELECT *` results
([dotnet/efcore #38225](https://github.com/dotnet/efcore/pull/38225)).

Thank you [@m-x-shokhzod](https://github.com/m-x-shokhzod) for this contribution!

## Microsoft.Data.Sqlite now depends on SQLite3MC.PCLRaw.bundle

`Microsoft.Data.Sqlite` now depends on `SQLite3MC.PCLRaw.bundle`, the
[SQLite3 Multiple Ciphers bundle](https://github.com/utelle/SQLite3MultipleCiphers),
instead of `e_sqlite3`
([dotnet/efcore #38402](https://github.com/dotnet/efcore/pull/38402)). This gives
applications built-in SQLite encryption via an actively maintained SQLite build.

<!-- Cut candidates:
- #38411: IManyToManyLoaderFactory injectable (internal plumbing, NativeAOT)
- #38430: runtime constants in precompiled queries (narrow scenario)
- #38440: generic type mapping for NativeAOT value comparers (internal plumbing)
- #38408: Move IOperationReporter/ISnapshotModelProcessor to EFCore.Relational (provider-author only)
- #37492: UInt128 in SqliteValueBinder (narrow type)
- #38395: Scope down owned JSON deprecation (diagnostic change)
-->

## Bug fixes

- **Query translation**
  - Fixed funcletization of evaluatable lambda parameters
    ([dotnet/efcore #38291](https://github.com/dotnet/efcore/pull/38291)).
  - Fixed `NullReferenceException` for `SelectMany` with inline array values
    ([dotnet/efcore #38286](https://github.com/dotnet/efcore/pull/38286)).
  - Fixed `InvalidOperationException` when filtering on a JSON column of an
    entity mapped to a view
    ([dotnet/efcore #38321](https://github.com/dotnet/efcore/pull/38321)).
  - Fixed `GroupBy.Select` with empty projection member
    ([dotnet/efcore #38140](https://github.com/dotnet/efcore/pull/38140)).
  - Fixed `GroupBy().Select(entity)` followed by a second projection
    ([dotnet/efcore #38436](https://github.com/dotnet/efcore/pull/38436)).
  - Fixed unnecessary joins in consecutive `Select` projections with conditionals
    ([dotnet/efcore #37601](https://github.com/dotnet/efcore/pull/37601)).
  - Fixed nullable outer-key null check in compound APPLY→JOIN predicates
    ([dotnet/efcore #38449](https://github.com/dotnet/efcore/pull/38449)).
  - `Wrap SIGN()` in `CAST(... AS int)` for SQL Server
    ([dotnet/efcore #38260](https://github.com/dotnet/efcore/pull/38260)).
- **Azure Cosmos DB**
  - Translate top-level `Any()` to `LIMIT 1` instead of `EXISTS`
    ([dotnet/efcore #38297](https://github.com/dotnet/efcore/pull/38297)).
  - Fixed `ToList` on structural collection treated as scalar
    ([dotnet/efcore #38122](https://github.com/dotnet/efcore/pull/38122)).
  - Don't transform query to `ReadItem` when `WithPartitionKey` conflicts with
    predicate partition key
    ([dotnet/efcore #38439](https://github.com/dotnet/efcore/pull/38439)).
- **JSON columns**
  - Fixed duplicate JSON column in TPT child tables for complex types declared
    on a base entity type
    ([dotnet/efcore #37958](https://github.com/dotnet/efcore/pull/37958)).
  - Fixed `NullReferenceException` materializing JSON owned collections with
    nested primitive collections under lazy-loading proxies
    ([dotnet/efcore #38473](https://github.com/dotnet/efcore/pull/38473)).
  - Use string type mapping when sending null values for JSON column updates on
    SQL Server
    ([dotnet/efcore #38426](https://github.com/dotnet/efcore/pull/38426)).
- **Migrations**
  - Fixed `NullReferenceException` for mistyped default values on non-string
    columns
    ([dotnet/efcore #38399](https://github.com/dotnet/efcore/pull/38399)).
  - Fixed redundant `(string)null` schema argument in `ToTable` snapshot
    generation
    ([dotnet/efcore #38424](https://github.com/dotnet/efcore/pull/38424)).
  - Fixed migration generation for non-nullable `SqlVector` columns
    ([dotnet/efcore #38451](https://github.com/dotnet/efcore/pull/38451)).
  - Made model snapshots with mismatched FK/PK property types usable
    ([dotnet/efcore #38450](https://github.com/dotnet/efcore/pull/38450)).
- **Change tracking and model building**
  - Detached entries are now held weakly in the change tracker, preventing
    memory leaks in long-lived `DbContext` instances
    ([dotnet/efcore #38387](https://github.com/dotnet/efcore/pull/38387)).
  - Fixed inverting identifying FK using wrong type and short-circuit principal
    type on attach
    ([dotnet/efcore #38423](https://github.com/dotnet/efcore/pull/38423)).
  - Mark entities as unchanged when matched by entities loaded from database
    ([dotnet/efcore #38452](https://github.com/dotnet/efcore/pull/38452)).
  - Honor explicit store type when discovering `Dictionary<string, object>`
    ([dotnet/efcore #38433](https://github.com/dotnet/efcore/pull/38433)).
- **Compiled model**
  - Fixed `CreateRelationalModel()` failure when an owned entity shares its
    owner's table
    ([dotnet/efcore #38428](https://github.com/dotnet/efcore/pull/38428)).
  - Fixed several small issues in the compiled model
    ([dotnet/efcore #38441](https://github.com/dotnet/efcore/pull/38441)).
- **SQL Server**
  - Fixed `ExecuteUpdate` returning -1 on open connections by setting
    `NOCOUNT OFF`
    ([dotnet/efcore #37827](https://github.com/dotnet/efcore/pull/37827)).
  - Render TVP type name correctly in `ToQueryString`
    ([dotnet/efcore #38251](https://github.com/dotnet/efcore/pull/38251)).
  - Send XML parameters as `SqlXml`
    ([dotnet/efcore #38462](https://github.com/dotnet/efcore/pull/38462)).
- **SQLite**
  - Catch `InvalidOperationException` for unpackaged WinUI3 apps in
    `SqliteConnection`
    ([dotnet/efcore #38304](https://github.com/dotnet/efcore/pull/38304)).
- **NativeAOT**
  - Fixed NativeAOT publish: rebuild RID-specific assembly with generated
    sources
    ([dotnet/efcore #38322](https://github.com/dotnet/efcore/pull/38322)).
- **Analyzer**
  - EF1003 now detects `string.Format` and `string.Concat` in raw SQL APIs
    ([dotnet/efcore #38208](https://github.com/dotnet/efcore/pull/38208)).
    Thank you [@m-x-shokhzod](https://github.com/m-x-shokhzod) for this
    contribution!

## Community contributors

Thank you to the community contributors who made EF Core better in this preview! ❤️

- [@Aykuttonpc](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3AAykuttonpc):
  Translated `TimeOnly` members and `string.Join`/`Concat` with ordering on SQLite
  ([dotnet/efcore #38341](https://github.com/dotnet/efcore/pull/38341),
  [dotnet/efcore #38344](https://github.com/dotnet/efcore/pull/38344)).
- [@BrunoSync](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3ABrunoSync):
  Added wildcard `*` support for `--context` in `dotnet ef` commands
  ([dotnet/efcore #38269](https://github.com/dotnet/efcore/pull/38269),
  [dotnet/efcore #38327](https://github.com/dotnet/efcore/pull/38327)).
- [@ChrisJollyAU](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3AChrisJollyAU):
  Improved cast and convert support for the Cosmos provider
  ([dotnet/efcore #35000](https://github.com/dotnet/efcore/pull/35000)).
- [@JoasE](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3AJoasE):
  Allowed runtime constants in precompiled queries
  ([dotnet/efcore #38430](https://github.com/dotnet/efcore/pull/38430)).
- [@m-x-shokhzod](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3Am-x-shokhzod):
  Translated `List<T>.Exists`, improved EF1003, added `DROP_EXISTING` for index
  changes, skipped ALTER for computed columns, configured temporal columns as
  not hidden
  ([dotnet/efcore #38226](https://github.com/dotnet/efcore/pull/38226),
  [dotnet/efcore #38208](https://github.com/dotnet/efcore/pull/38208),
  [dotnet/efcore #38271](https://github.com/dotnet/efcore/pull/38271),
  [dotnet/efcore #38252](https://github.com/dotnet/efcore/pull/38252),
  [dotnet/efcore #38225](https://github.com/dotnet/efcore/pull/38225)).
- [@MaikyOzr](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3AMaikyOzr):
  Added `UInt128` support in `SqliteValueBinder`
  ([dotnet/efcore #37492](https://github.com/dotnet/efcore/pull/37492)).
- [@ranma42](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3Aranma42):
  Optimized away redundant `IS NOT NULL` checks via null propagation
  ([dotnet/efcore #34127](https://github.com/dotnet/efcore/pull/34127)).
