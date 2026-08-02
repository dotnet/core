# Entity Framework Core in .NET 11 Preview 7 - Release Notes

<!-- Verified against Microsoft.EntityFrameworkCore@11.0.0-preview.7.26381.103 and Microsoft.Data.Sqlite.Core@11.0.0-preview.7.26381.103 -->

.NET 11 Preview 7 includes new EF Core features and improvements:

- [LINQ query translation improvements](#linq-query-translation-improvements)
- [Azure Cosmos DB provider improvements](#azure-cosmos-db-provider-improvements)
- [Migrations improvements](#migrations-improvements)
- [`Half` type support on SQLite](#half-type-support-on-sqlite)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

All EF Core updates in .NET 11:

- [What's new in EF Core](https://learn.microsoft.com/ef/core/what-is-new/ef-core-11.0/whatsnew)

## LINQ query translation improvements

### Translate `int.Parse`, `long.Parse`, and friends on SQL Server

`byte.Parse`, `short.Parse`, `int.Parse`, `long.Parse`, `decimal.Parse`, `double.Parse`,
and `float.Parse` — the simple overloads that take a single `string` — now translate
to a SQL Server `CAST` at the server
([dotnet/efcore #28337](https://github.com/dotnet/efcore/pull/28337)). Previously
these fell back to client evaluation.

```csharp
var rows = await context.BasicTypes
    .Where(o => int.Parse(Convert.ToString(o.Int)) == 12)
    .ToListAsync();
```

```sql
SELECT ...
FROM [BasicTypesEntities] AS [b]
WHERE CAST(CONVERT(nvarchar(max), [b].[Int]) AS int) = 12
```

Thank you [@MaRK0960](https://github.com/MaRK0960) for this contribution!

### Lift `GroupBy` aggregates over reference navigations into a single join

An aggregate whose selector traverses a reference navigation (for example
`g => g.Max(o => o.Customer.Region)`) used to emit a correlated scalar subquery
that re-scanned the source once per group — an EF Core 7 regression tracked as
[dotnet/efcore #27933](https://github.com/dotnet/efcore/issues/27933). Navigation
expansion now lifts the referenced navigation onto the pre-`GroupBy` source, so
the aggregate translates to the pre-EF7 single `LEFT JOIN … GROUP BY` shape
([dotnet/efcore #38668](https://github.com/dotnet/efcore/pull/38668)). Multiple
aggregates sharing a navigation reuse one join; required navigations use
`INNER JOIN` instead of the previous always-`LEFT` GroupJoin.

```csharp
var byEmployee = await context.Orders
    .GroupBy(o => o.EmployeeId)
    .Select(g => new { EmployeeId = g.Key, TopRegion = g.Max(o => o.Customer.Region) })
    .ToListAsync();
```

```sql
-- Before (EF Core 7-10): correlated per-group re-scan
SELECT (
    SELECT MAX([c].[Region])
    FROM [Orders] AS [o0]
    LEFT JOIN [Customers] AS [c] ON [o0].[CustomerId] = [c].[CustomerId]
    WHERE [o].[EmployeeId] = [o0].[EmployeeId]) AS [TopRegion], ...
FROM [Orders] AS [o]
GROUP BY [o].[EmployeeId]

-- After: single LEFT JOIN + GROUP BY
SELECT [o].[EmployeeId], MAX([c].[Region]) AS [TopRegion]
FROM [Orders] AS [o]
LEFT JOIN [Customers] AS [c] ON [o].[CustomerId] = [c].[CustomerId]
GROUP BY [o].[EmployeeId]
```

Thank you [@ducmerida](https://github.com/ducmerida) for this contribution!

### Compose over `GroupBy` + `First` per group

A query that reduces each group to a single entity with `First`/`Single`/`Last`
and then keeps composing — projecting a navigation, filtering, ordering — used
to fail with `"Translation of member 'X' failed"`
([dotnet/efcore #38686](https://github.com/dotnet/efcore/issues/38686),
[dotnet/efcore #28125](https://github.com/dotnet/efcore/issues/28125)). Navigation
expansion now snapshots the group-element selector so navigations survive the
per-group cardinality reduction, and the relational projection binder lowers
single-result subqueries on demand instead of only at the end of translation
([dotnet/efcore #38687](https://github.com/dotnet/efcore/pull/38687)).

```csharp
var latestPerOrder = await context.TimeSheets
    .GroupBy(t => t.OrderId)
    .Select(g => g.OrderBy(x => x.Id).First())
    .OrderBy(t => t.Order.Number)
    .ToListAsync();
```

Thank you [@ducmerida](https://github.com/ducmerida) for this contribution!

### Reuse a single-result subquery across projected members

When a projection reads two or more members of the same correlated
`First`/`Single`/`Last`/`ElementAt` (or their `OrDefault`/predicate forms)
subquery, EF Core now rewrites the projection into a `SelectMany` so the members
come from a single join instead of repeated subqueries
([dotnet/efcore #38502](https://github.com/dotnet/efcore/pull/38502)). This is a
targeted stopgap for [dotnet/efcore #7776](https://github.com/dotnet/efcore/issues/7776)
while the broader pending-selector rework in
[#20291](https://github.com/dotnet/efcore/issues/20291) is in flight.

Thank you [@wassim-k](https://github.com/wassim-k) for this contribution!

### Fold `ValueTuple`/`Tuple` member access through constructor-bound projections

Accessing an item of a `ValueTuple` or `Tuple` projected earlier in a query — for
example a `GroupBy` key of `ValueTuple<int, int>` later joined on `c.Item1` —
used to fail translation because `NewExpression.Members` is only populated by the
compiler for anonymous types. The core `ReplacingExpressionVisitor` now folds
member access on `ValueTuple`/`Tuple` (arities 1-8, including the `Rest`-nested
form) by parameter name
([dotnet/efcore #38560](https://github.com/dotnet/efcore/pull/38560)). The fold
is deliberately restricted to these two BCL types because their
constructor-to-member mapping is a closed contract — extending it to arbitrary
classes/records/structs risked silently folding to the wrong value.

```csharp
var joined = await context.Orders
    .GroupBy(o => new ValueTuple<int, int>(o.CustomerId, o.EmployeeId))
    .Join(
        context.Customers,
        g => g.Key.Item1,
        c => c.Id,
        (g, c) => new { c.Name, Count = g.Count() })
    .ToListAsync();
```

### Materialize left-joined non-entity projections as `null` on no-match

A `LEFT JOIN` — via `GroupJoin` + `DefaultIfEmpty()` or the `LeftJoin` operator —
whose inner side is a subquery projecting an anonymous type, a DTO, or a
`GroupBy` aggregate object threw
`InvalidOperationException: Nullable object must have a value` on a no-match row.
EF Core constructed the object from all-`NULL` columns instead of yielding `null`
([dotnet/efcore #30915](https://github.com/dotnet/efcore/issues/30915)). Entities
already got this right via key-column null checks; Preview 7 adds the equivalent
for non-entity projections by injecting a synthesized marker column into the
inner subquery, then gating the whole-object projection on it
([dotnet/efcore #38479](https://github.com/dotnet/efcore/pull/38479)). Follow-up
work keeps the marker alive across a subsequent join
([dotnet/efcore #38499](https://github.com/dotnet/efcore/pull/38499)), across a
`GroupBy`-element to-one subquery lowering
([dotnet/efcore #38577](https://github.com/dotnet/efcore/pull/38577)), and extends
the same treatment to struct/record-struct and `Nullable<T>` whole-object
projections, which now yield `default(T)`
([dotnet/efcore #38555](https://github.com/dotnet/efcore/pull/38555)).

```csharp
var q = context.Owners
    .GroupJoin(
        context.Pets,
        o => o.Id,
        p => p.OwnerId,
        (o, ps) => new { o.Name, PetInfo = ps.Select(p => new { p.Name, p.Age }).FirstOrDefault() })
    // Previously threw on owners with no pets; now PetInfo == null on no-match.
    .ToListAsync();
```

## Azure Cosmos DB provider improvements

### Modernize the query materializer and serialization pipeline

The Cosmos provider now materializes query results using
`Utf8JsonReader`, binds projections of embedded types directly, and removes the
long-standing client-projection `Distinct` limitation
([dotnet/efcore #38550](https://github.com/dotnet/efcore/pull/38550)). The
`__jObject` backing property is gone. In the same modernization pass, the query
pipeline drops Newtonsoft.Json in favor of `System.Text.Json` via the singleton
`CosmosStructuralTypeSerializer` service
([dotnet/efcore #38662](https://github.com/dotnet/efcore/pull/38662)).

Two behavior changes fall out of this work:

- `AsNoTrackingWithIdentityResolution` now requires that owned-projection queries
  project out primary key values.
- Floating-point values are **truncated** (not rounded) when materialized into
  fixed-point CLR types, matching the wire format
  ([dotnet/efcore #38138](https://github.com/dotnet/efcore/issues/38138)).

Thank you [@JoasE](https://github.com/JoasE) for this contribution!

### Cosmos requests retry through the execution strategy

Two paths that used to skip the configured retry policy now flow through it:

- Query response status checks run inside execution-strategy retries, so
  transient failures observed while iterating query pages are retried instead of
  surfacing to the caller
  ([dotnet/efcore #38591](https://github.com/dotnet/efcore/pull/38591)).
- Transactional batch failures — including partition-key-scoped batches used by
  `SaveChanges` — surface as retryable exceptions on the execution strategy
  instead of a raw batch response
  ([dotnet/efcore #38597](https://github.com/dotnet/efcore/pull/38597)).

## Migrations improvements

### `Add-Migration -NoBuild` and `Update-Database -NoBuild` for PMC

The Package Manager Console cmdlets `Add-Migration` and `Update-Database` now
accept a `-NoBuild` switch that skips the solution build, matching the existing
`dotnet ef migrations add --no-build`
([dotnet/efcore #38658](https://github.com/dotnet/efcore/pull/38658),
[dotnet/efcore #38681](https://github.com/dotnet/efcore/pull/38681)). This is
useful when the project is already built, and as a workaround for NuGet
vulnerability warnings such as `NU1902` that would otherwise stop the command
from applying migrations.

```powershell
Add-Migration InitialCreate -NoBuild
Update-Database -NoBuild
```

### `migrations bundle` works with Central Package Management

`dotnet ef migrations bundle` used to fail with `NU1008` on solutions that use
NuGet Central Package Management, because the generated temporary bundle project
always emitted a versioned `PackageReference` for
`Microsoft.EntityFrameworkCore.Design`. The bundle project template now emits
conditional package references — versioned when CPM is not enabled, non-versioned
when it is — so `PackageVersion` in `Directory.Packages.props` resolves normally
([dotnet/efcore #38584](https://github.com/dotnet/efcore/pull/38584)).

### `dotnet ef` honors `ProjectDepsFileName` and `ProjectRuntimeConfigFileName`

`dotnet ef` used to construct `--depsfile` and `--runtimeconfig` paths from
`AssemblyName`, which broke startup projects that override output metadata (for
example, via `TargetName` combined with `ProjectDepsFileName`). Host launch now
resolves those paths from the startup project's `ProjectDepsFileName` and
`ProjectRuntimeConfigFileName` MSBuild properties, falling back to the old
behavior when the metadata is empty
([dotnet/efcore #38595](https://github.com/dotnet/efcore/pull/38595)).

### Reordered migrations for TPC sequence transitions

When a TPC hierarchy consolidates per-table sequences into a shared hierarchy
sequence (or renames the shared sequence), the migrations differ used to emit
`DropSequence` before rewriting column defaults that still referenced the old
sequence, producing an invalid migration. Sequence drops that have no
replacement now run **after** the alter-column phase, so the old default
expressions continue to bind until they are rewritten
([dotnet/efcore #38583](https://github.com/dotnet/efcore/pull/38583)).

## `Half` type support on SQLite

`Microsoft.Data.Sqlite` and the EF Core SQLite provider now read, bind, and map
`System.Half` — the 16-bit floating point type introduced in .NET 5
([dotnet/efcore #37481](https://github.com/dotnet/efcore/pull/37481)). Values are
read via `GetFloat` and bound via `BindDouble`, matching the existing `float`
implementation. A `JsonValueReaderWriter<Half>` is also registered so `Half`
properties inside JSON-mapped columns round-trip correctly
([dotnet/efcore #38492](https://github.com/dotnet/efcore/pull/38492)).

```csharp
public class Sensor
{
    public int Id { get; set; }
    public Half Temperature { get; set; }
}
```

Thank you [@kimjaejung96](https://github.com/kimjaejung96) for this contribution!

## Breaking changes

### `Microsoft.Data.Sqlite` no longer targets `netstandard2.0`

`Microsoft.Data.Sqlite` and `Microsoft.Data.Sqlite.Core` drop `netstandard2.0`
and target the current minimum supported .NET TFM (`net10.0`)
([dotnet/efcore #37877](https://github.com/dotnet/efcore/pull/37877)). Keeping
`netstandard2.0` implied support for older .NET runtimes such as `net8.0` and
masked the lack of `DateOnly`/`TimeOnly` support on those targets. .NET Framework
is no longer supported by `Microsoft.Data.Sqlite`. Applications targeting
`net10.0` or newer are unaffected.

## Bug fixes

- **Query translation**
  - Don't reject JSON entities reached only through `Include` under
    `AsNoTrackingWithIdentityResolution`
    ([dotnet/efcore #38556](https://github.com/dotnet/efcore/pull/38556)).
  - Improve handling of `null` values in JSON properties mapped to primitive
    collections: shaper detects `null` before invoking the collection converter
    and required properties throw `NullValueInRequiredJsonProperty` with a
    property-named message
    ([dotnet/efcore #38498](https://github.com/dotnet/efcore/pull/38498)).
  - Fix `JsonReaderData` buffer refill to respect valid bytes on partial stream
    reads, preventing stale-byte corruption during JSON tokenization
    ([dotnet/efcore #38666](https://github.com/dotnet/efcore/pull/38666)).
  - Fix invalid shadow property names in precompiled queries and JSON
    discriminator metadata
    ([dotnet/efcore #38458](https://github.com/dotnet/efcore/pull/38458)).
  - Fix complex property projection for entity-splitting mappings
    ([dotnet/efcore #38592](https://github.com/dotnet/efcore/pull/38592)).
  - Handle out-of-order split-include rows during concurrent inserts
    ([dotnet/efcore #38676](https://github.com/dotnet/efcore/pull/38676)).
  - Lift `try..catch` out of an expression and replace it with a temporary
    variable during translation
    ([dotnet/efcore #34912](https://github.com/dotnet/efcore/pull/34912)).
- **Change tracking**
  - Warn (and detach the orphan) when a row's outer owned entity is `null` but
    an inner owned entity has non-`NULL` values, replacing the previous
    misleading identity-conflict exception on `SaveChanges`. Configurable via
    the new `CoreEventId.InconsistentOwnedDataWarning`
    ([dotnet/efcore #38596](https://github.com/dotnet/efcore/pull/38596)).
  - Fix `OriginalValues.ToObject` for added complex collections
    ([dotnet/efcore #38493](https://github.com/dotnet/efcore/pull/38493)).
  - Fix `DetectChanges` throwing when a nullable nested complex property with a
    nested collection is set to `null`
    ([dotnet/efcore #38667](https://github.com/dotnet/efcore/pull/38667)).
  - Propagate case-only principal string key updates to dependent foreign keys
    when the key comparer is case-insensitive
    ([dotnet/efcore #38585](https://github.com/dotnet/efcore/pull/38585)).
  - Decrement the active-contexts count after a pooled `DbContext` is torn down
    ([dotnet/efcore #38554](https://github.com/dotnet/efcore/pull/38554)).
- **Migrations and model**
  - Fix foreign key to entity-split principal referencing the fragment table
    instead of the main table
    ([dotnet/efcore #38586](https://github.com/dotnet/efcore/pull/38586)).
  - Fix foreign key diff matching across identically named tables in different
    schemas
    ([dotnet/efcore #38582](https://github.com/dotnet/efcore/pull/38582)).
  - Avoid false circular-dependency edges for unchanged unique-index values
    during update batching
    ([dotnet/efcore #38581](https://github.com/dotnet/efcore/pull/38581)).
  - Handle seed-data cycle diagnostics without crashing during migration
    scaffolding
    ([dotnet/efcore #38589](https://github.com/dotnet/efcore/pull/38589)).
  - Prevent `FindCollectionMapping` `NullReferenceException` on legacy
    string/vector snapshot mappings
    ([dotnet/efcore #38594](https://github.com/dotnet/efcore/pull/38594)).
  - Fix shared-type entity type name generation in the model snapshot
    ([dotnet/efcore #38611](https://github.com/dotnet/efcore/pull/38611)).
  - Normalize Unicode strings from seed data before comparing
    ([dotnet/efcore #38617](https://github.com/dotnet/efcore/pull/38617)).
- **SQL Server**
  - Fix alter-column type `JSON` → `nvarchar` producing an invalid migration
    ([dotnet/efcore #38464](https://github.com/dotnet/efcore/pull/38464)).
  - Send XML parameters directly instead of round-tripping through `SqlXml`
    ([dotnet/efcore #38506](https://github.com/dotnet/efcore/pull/38506)).
- **SQLite**
  - Ensure `SqliteCommand.Deactivate` does not use a disposed handle on return
    ([dotnet/efcore #38574](https://github.com/dotnet/efcore/pull/38574)).

<!-- Cut candidates:
  - #38484 Make element type a creation-time concern — internal type-mapping plumbing.
  - #38481 Reuse CosmosTypeMapping.Default for primitive JSON reader/writers — internal.
  - #38578 Cosmos: disable full-text/vector indexes on complex collection wildcard paths in tests — test-only.
  - #38530 / #38567 / #38568 empty PR titles — infra/backport bumps.
  - #38633 test helper method override assertions — test infrastructure.
  - #38551 allow all warnings in dev build — build/infra.
  - #38607 SQLitePCLRaw 2.1.12 servicing on release/10.0 — not net11 preview7.
  - #38650, #38509, #38513, #38514, #38520, #38516, #38523, #38678, #38644, #38679, #38670, #38642 — dependency bumps.
  - #38494 Configure Dependabot NuGet updates — infra.
  - #38641 Restrict dependabot to patch-only — infra.
-->

## Community contributors

Thank you to the community contributors who made EF Core better in this preview! ❤️

- [@atiq-bs23](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3Aatiq-bs23):
  Fixed alter-column type `JSON` → `nvarchar`
  ([dotnet/efcore #38464](https://github.com/dotnet/efcore/pull/38464)).
- [@ChrisJollyAU](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3AChrisJollyAU):
  Lift `try..catch` out of an expression and replace with a temporary variable
  ([dotnet/efcore #34912](https://github.com/dotnet/efcore/pull/34912)).
- [@ducmerida](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3Aducmerida):
  Lifted `GroupBy` aggregates over reference navigations into pre-`GroupBy`
  joins, and added support for composing over `GroupBy` + `First` per group
  ([dotnet/efcore #38668](https://github.com/dotnet/efcore/pull/38668),
  [dotnet/efcore #38687](https://github.com/dotnet/efcore/pull/38687)).
- [@JoasE](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3AJoasE):
  Modernized the Cosmos provider's materializer, subdocument projection binding,
  and query-pipeline serialization; also improved test helper assertions and
  developer-build warning configuration
  ([dotnet/efcore #38550](https://github.com/dotnet/efcore/pull/38550),
  [dotnet/efcore #38662](https://github.com/dotnet/efcore/pull/38662),
  [dotnet/efcore #38633](https://github.com/dotnet/efcore/pull/38633),
  [dotnet/efcore #38551](https://github.com/dotnet/efcore/pull/38551)).
- [@kimjaejung96](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3Akimjaejung96):
  Added `Half` type support in Microsoft.Data.Sqlite and the EF Core SQLite
  provider ([dotnet/efcore #37481](https://github.com/dotnet/efcore/pull/37481)).
- [@MaRK0960](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3AMaRK0960):
  Translated `byte.Parse`/`short.Parse`/`int.Parse`/`long.Parse`/`decimal.Parse`/`double.Parse`/`float.Parse`
  to SQL Server `CAST`
  ([dotnet/efcore #28337](https://github.com/dotnet/efcore/pull/28337)).
- [@thromel](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3Athromel):
  Fixed `OriginalValues.ToObject` for added complex collections
  ([dotnet/efcore #38493](https://github.com/dotnet/efcore/pull/38493)).
- [@wassim-k](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3Awassim-k):
  Reused a single-result subquery across its projected members
  ([dotnet/efcore #38502](https://github.com/dotnet/efcore/pull/38502)).
