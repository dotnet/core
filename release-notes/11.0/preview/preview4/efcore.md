# Entity Framework Core in .NET 11 Preview 4 - Release Notes

.NET 11 Preview 4 includes new EF Core features and tooling improvements:

- [Approximate vector search for SQL Server 2025](#approximate-vector-search-for-sql-server-2025)
- [JSON mapping is fully integrated into the relational model](#json-mapping-is-fully-integrated-into-the-relational-model)
- [Temporal period properties can map to CLR properties](#temporal-period-properties-can-map-to-clr-properties)
- [More SQL Server `DateTimeOffset` translations](#more-sql-server-datetimeoffset-translations)
- [`dotnet ef` reads defaults from `dotnet-ef.json`](#dotnet-ef-reads-defaults-from-dotnet-efjson)
- [Clearer warning when a migration snapshot is from an older EF Core version](#clearer-warning-when-a-migration-snapshot-is-from-an-older-ef-core-version)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

EF Core updates in .NET 11:

- [What's new in EF Core](https://learn.microsoft.com/ef/core/what-is-new/ef-core-11.0/whatsnew)

## Approximate vector search for SQL Server 2025

EF Core now translates approximate nearest-neighbor (ANN) vector queries against
SQL Server 2025 ([dotnet/efcore #38075](https://github.com/dotnet/efcore/pull/38075)).
Calling `VectorSearch()` returns rows ordered by vector distance, and adding
`WithApproximate()` instructs SQL Server to use a vector index — translating to
the `WITH APPROXIMATE` clause introduced in SQL Server 2025. Without
`WithApproximate()`, EF Core emits an exact (brute-force) search, which is
useful for verifying recall on small data sets.

```csharp
var query = await context.Blogs
    .VectorSearch(b => b.Embedding, queryVector)
    .WithApproximate()
    .Take(10)
    .ToListAsync();
```

This builds on the SQL Server 2025 vector index configuration that landed in
earlier .NET 11 previews; together they give EF Core a full ANN search story
against SQL Server's native vector type.

## JSON mapping is fully integrated into the relational model

JSON columns are now first-class citizens in the relational model
([dotnet/efcore #38038](https://github.com/dotnet/efcore/pull/38038)). The path
that EF Core uses to update a slice of a JSON document is now represented as a
structured `JsonPath`/`JsonPathSegment` instead of a JSON-path string built up
during command generation. This unblocks better diagnostics, more reliable
partial-update SQL, and fixes long-standing issues where the generated path did
not round-trip correctly through migrations and compiled models
(closes `dotnet/efcore#36646`, `dotnet/efcore#32185`).

For most applications this is internal plumbing — your `OwnsOne` / `OwnsMany`
JSON mappings keep working unchanged. Provider authors and anyone reading
generated migration snapshots will see the new structured path representation.

## Temporal period properties can map to CLR properties

SQL Server temporal tables have always required `PeriodStart` and `PeriodEnd`
to be shadow properties. Preview 4 lifts that restriction so you can expose the
period columns as regular CLR properties on your entity and read them like any
other column ([dotnet/efcore #38110](https://github.com/dotnet/efcore/pull/38110),
closes `dotnet/efcore#26463`). The temporal builders also gain strongly-typed
`HasPeriodStart` / `HasPeriodEnd` overloads that accept a lambda.

```csharp
public class Order
{
    public int Id { get; set; }
    public string Status { get; set; } = "";
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
}

modelBuilder.Entity<Order>().ToTable(tb => tb.IsTemporal(ttb =>
{
    ttb.HasPeriodStart(o => o.PeriodStart);
    ttb.HasPeriodEnd(o => o.PeriodEnd);
}));
```

EF Core continues to manage the values — the properties are still configured
with `ValueGenerated.OnAddOrUpdate` and `BeforeSaveBehavior.Ignore`, so writes
still flow through SQL Server's `SYSTEM_TIME` machinery.

## More SQL Server `DateTimeOffset` translations

Several common `DateTimeOffset` operations now translate to SQL on SQL Server
([dotnet/efcore #38076](https://github.com/dotnet/efcore/pull/38076), closes
`dotnet/efcore#26781`, `dotnet/efcore#34756`, `dotnet/efcore#38074`). Queries
that previously failed with a "could not be translated" exception — or silently
fell back to client evaluation in older versions — now run on the database.

```csharp
var recent = await context.Events
    .Where(e => e.OccurredAt.Date == today)
    .Where(e => e.OccurredAt.Year == 2026)
    .OrderBy(e => e.OccurredAt.TimeOfDay)
    .ToListAsync();
```

## `dotnet ef` reads defaults from `dotnet-ef.json`

`dotnet ef` can now load default values for common options from a
`.config/dotnet-ef.json` file ([dotnet/efcore #37966](https://github.com/dotnet/efcore/pull/37966),
closes `dotnet/efcore#35231`). Discovery walks up from the working directory,
similar to how `.editorconfig` or `global.json` are resolved, so the same
defaults apply whether you run `dotnet ef migrations add` from the solution
root or from a sub-folder. Command-line arguments still take precedence.

```jsonc
// .config/dotnet-ef.json
{
  "project": "src/App.Infrastructure",
  "startupProject": "src/App.Api",
  "context": "AppDbContext"
}
```

```bash
# No more --project / --startup-project / --context on every invocation
dotnet ef migrations add InitialCreate
```

Supported keys include `project`, `startupProject`, `framework`,
`configuration`, `context`, `runtime`, `verbose`, `noColor`, and
`prefixOutput`. Thank you [@IMZihad21](https://github.com/IMZihad21) for this
contribution!

## Clearer warning when a migration snapshot is from an older EF Core version

When `Migrate()` detects pending model changes, EF Core can now distinguish
between "you really did change your model" and "your snapshot was generated by
an older major version of EF Core" ([dotnet/efcore #38065](https://github.com/dotnet/efcore/pull/38065)).
In the second case it raises a new `RelationalEventId.OldMigrationVersionWarning`
instead of `PendingModelChangesWarning`, pointing you at the likely root cause —
regenerating the snapshot rather than adding a redundant migration. The warning
only fires when the snapshot's major version is older than the running EF Core
major version and the detected changes are deterministic.

## Breaking changes

- **SQL Server full-text and vector index builder API renames.** Following
  API review, several recently introduced builder methods were renamed and a
  set of `IndexBuilder` extension methods was removed
  ([dotnet/efcore #38027](https://github.com/dotnet/efcore/pull/38027)). On
  `SqlServerFullTextIndexBuilder`: `HasKeyIndex` → `UseKeyIndex`,
  `OnCatalog` → `UseCatalog`, `WithChangeTracking` → `HasChangeTracking`,
  `HasLanguage` → `UseLanguage`. On `SqlServerVectorIndexBuilder`:
  `UseMetric` → `HasMetric`, `UseType` → `HasType`. The
  `HasFullTextKeyIndex` / `HasFullTextCatalog` / `HasFullTextChangeTracking` /
  `HasFullTextLanguage` extension methods on `IndexBuilder` were removed; use
  the dedicated full-text index builder instead. `FullTextSearchResult` moved
  to the `Microsoft.EntityFrameworkCore.Query` namespace, and the
  `ContainsTable` / `FreeTextTable` overloads were collapsed by making
  `columnSelector` optional and reordering parameters.
- **SQLite migrations no longer use `PRAGMA defer_foreign_keys`.** A previous
  change to use `PRAGMA defer_foreign_keys` instead of `PRAGMA foreign_keys`
  during migrations has been reverted because it broke applications that rely
  on foreign-key enforcement during a migration script
  ([dotnet/efcore #38120](https://github.com/dotnet/efcore/pull/38120),
  reverts `dotnet/efcore#35873`, fixes `dotnet/efcore#37598`).

## Bug fixes

- **Inheritance (TPC)**
  - Fixed Table-Per-Concrete queries returning incorrect entity types when
    derived types are generic (e.g. `Entity<int>` and `Entity<string>` shared a
    discriminator) ([dotnet/efcore #38022](https://github.com/dotnet/efcore/pull/38022)).
  - Fixed `SaveChanges` insert ordering for TPC hierarchies whose principal is
    an abstract base type, which previously caused FK constraint violations
    ([dotnet/efcore #38070](https://github.com/dotnet/efcore/pull/38070), fixes
    `dotnet/efcore#35978`). Thank you
    [@andrewraper-Sage](https://github.com/andrewraper-Sage) for this
    contribution!
- **`ExecuteUpdate`**
  - Fixed `SetProperty` with a discard lambda assigning a constant to a
    nullable value-type property (e.g. `_ => 1` on an `int?`), which threw
    `InvalidOperationException: No coercion operator is defined`
    ([dotnet/efcore #38007](https://github.com/dotnet/efcore/pull/38007)).
- **JSON columns**
  - Value converters that translate `null` are now invoked for `null` values
    on JSON-mapped properties
    ([dotnet/efcore #37984](https://github.com/dotnet/efcore/pull/37984)). Thank
    you [@JoasE](https://github.com/JoasE) for this contribution!
  - `JsonReaderData` now reuses the underlying buffer of a `MemoryStream`
    instead of copying it, removing duplicate buffering on JSON reads
    ([dotnet/efcore #38051](https://github.com/dotnet/efcore/pull/38051)). Thank
    you [@JoasE](https://github.com/JoasE) for this contribution!
- **Change tracking and complex properties**
  - Fixed `DbContext.Update()` falsely marking
    `AfterSaveBehavior.Throw` properties (such as discriminators on nullable
    complex types) as modified during `DetectChanges`
    ([dotnet/efcore #38115](https://github.com/dotnet/efcore/pull/38115), fixes
    `dotnet/efcore#38105`).
- **SQL Server temporal tables**
  - Migrations no longer fail with "history table has IDENTITY column
    specification" when an identity column is added while versioning is
    temporarily disabled ([dotnet/efcore #38019](https://github.com/dotnet/efcore/pull/38019),
    fixes `dotnet/efcore#36025`).
  - Full-text catalog operations are no longer emitted when creating the
    `__EFMigrationsHistory` table, which previously caused premature
    `CREATE FULLTEXT CATALOG` statements
    ([dotnet/efcore #38050](https://github.com/dotnet/efcore/pull/38050)).
- **Servicing fixes flowed forward from EF Core 10**

  Bug fixes shipped in EF Core 10.x servicing also flow into the .NET 11
  Preview 4 builds. Notable items include:
  - Comparing a split entity (`SplitToTable`) to `null` in a LINQ query no
    longer throws `Sequence contains more than one element`
    ([dotnet/efcore #37987](https://github.com/dotnet/efcore/pull/37987), fixes
    `dotnet/efcore#35293`).
  - `IEnumerable<TEnum>` parameters with mismatched-but-compatible enum types
    no longer throw `InvalidCastException`
    ([dotnet/efcore #38021](https://github.com/dotnet/efcore/pull/38021), fixes
    `dotnet/efcore#38008`).
  - Primitive collection parameters containing `null` values no longer throw
    `InvalidCastException` during execution
    ([dotnet/efcore #38066](https://github.com/dotnet/efcore/pull/38066), fixes
    `dotnet/efcore#37537`).
  - Complex properties are no longer treated as nullable after upgrading from
    EF Core 9 to 10, eliminating spurious `PendingModelChangesWarning` and
    empty `AlterColumn` migrations
    ([dotnet/efcore #38045](https://github.com/dotnet/efcore/pull/38045), fixes
    `dotnet/efcore#38043`).
  - Discriminator changes on nullable complex properties are now persisted
    when transitioning from `null` to non-`null`
    ([dotnet/efcore #38134](https://github.com/dotnet/efcore/pull/38134), fixes
    `dotnet/efcore#38119`).
  - Query filters that capture primary-constructor parameters no longer
    produce invalid SQL parameter names containing angle brackets
    ([dotnet/efcore #38136](https://github.com/dotnet/efcore/pull/38136), fixes
    `dotnet/efcore#38132`).
  - Optional complex properties whose values are all defaults now correctly
    persist as `null` ([dotnet/efcore #37952](https://github.com/dotnet/efcore/pull/37952),
    port of `dotnet/efcore#37944`). Thank you
    [@Pmyl](https://github.com/Pmyl) for this contribution!

## Community contributors

Thank you to the community contributors who made EF Core better in this preview:

- [@andrewraper-Sage](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3Aandrewraper-Sage):
  Fixed insert ordering for TPC hierarchies with an abstract base type
  ([dotnet/efcore #38070](https://github.com/dotnet/efcore/pull/38070)).
- [@IMZihad21](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3AIMZihad21):
  Added `dotnet-ef.json` config defaults for `dotnet ef`
  ([dotnet/efcore #37966](https://github.com/dotnet/efcore/pull/37966)).
- [@JoasE](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3AJoasE):
  Ran value converters that translate `null` for JSON columns
  ([dotnet/efcore #37984](https://github.com/dotnet/efcore/pull/37984)) and
  optimized `JsonReaderData` for `MemoryStream` sources
  ([dotnet/efcore #38051](https://github.com/dotnet/efcore/pull/38051)). Also
  modernized the Cosmos JSON serialization pipeline
  ([dotnet/efcore #38024](https://github.com/dotnet/efcore/pull/38024)).
- [@Pmyl](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3APmyl):
  Fixed persisting null optional complex properties with default values
  (servicing port, [dotnet/efcore #37952](https://github.com/dotnet/efcore/pull/37952)).
