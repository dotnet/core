# Entity Framework Core in .NET 11 Preview 5 - Release Notes

.NET 11 Preview 5 includes new EF Core features and improvements:

- [`dotnet ef` supports file-based apps](#dotnet-ef-supports-file-based-apps)
- [EF1004 warns when async EF queries run synchronously](#ef1004-warns-when-async-ef-queries-run-synchronously)
- [SQL Server 2022 compatibility is now the default](#sql-server-2022-compatibility-is-now-the-default)
- [Generated C# uses file-scoped namespaces and UTF-8 without BOM](#generated-c-uses-file-scoped-namespaces-and-utf-8-without-bom)
- [Query translation produces cleaner SQL](#query-translation-produces-cleaner-sql)
- [Breaking changes](#breaking-changes)
- [Bug fixes](#bug-fixes)
- [Community contributors](#community-contributors)

EF Core updates in .NET 11:

- [What's new in EF Core](https://learn.microsoft.com/ef/core/what-is-new/ef-core-11.0/whatsnew)

<!-- Verified against Microsoft.EntityFrameworkCore@11.0.0-preview.5.26276.113 and Microsoft.EntityFrameworkCore.Analyzers@11.0.0-preview.5.26276.113. SQL Server provider behavior was verified against the source shipped in the Preview 5 VMR because the SQL Server package was not listed in build-metadata.json. -->

## `dotnet ef` supports file-based apps

`dotnet ef` can now target C# file-based apps, so migration and scaffolding
commands can work with the single-file app model introduced for .NET 10
([dotnet/efcore #38157](https://github.com/dotnet/efcore/pull/38157),
[dotnet/efcore #38186](https://github.com/dotnet/efcore/pull/38186)). Use
`--file` for the target app and `--startup-file` when the design-time startup
file is different. Existing `--project` and `--startup-project` workflows keep
working for SDK-style projects.

```bash
dotnet ef migrations add InitialCreate --file .\App.cs

dotnet ef dbcontext scaffold "Data Source=app.db" Microsoft.EntityFrameworkCore.Sqlite \
    --file .\Model.cs \
    --startup-file .\App.cs
```

Preview 5 also improves `dotnet ef` diagnostics for file-based apps and project
metadata failures ([dotnet/efcore #38190](https://github.com/dotnet/efcore/pull/38190)).
When metadata build output includes the root MSBuild or SDK error, `dotnet ef`
now surfaces that error instead of replacing it with a generic project-metadata
message.

## EF1004 warns when async EF queries run synchronously

The EF Core analyzer package adds EF1004 for calls to
`System.Linq.AsyncEnumerable.ToAsyncEnumerable()` on `IQueryable<T>`
([dotnet/efcore #38218](https://github.com/dotnet/efcore/pull/38218)). That
extension wraps synchronous enumeration in an `IAsyncEnumerable<T>`. For EF Core
queries, use `AsAsyncEnumerable()` so the database query runs through EF Core's
async query pipeline.

```csharp
// EF1004: this can evaluate the EF query synchronously.
await foreach (var blog in blogsQuery.ToAsyncEnumerable())
{
    Console.WriteLine(blog.Name);
}

// Use EF Core's async query pipeline instead.
await foreach (var blog in blogsQuery.AsAsyncEnumerable())
{
    Console.WriteLine(blog.Name);
}
```

Thank you [@m-x-shokhzod](https://github.com/m-x-shokhzod) for this
contribution!

## SQL Server 2022 compatibility is now the default

The SQL Server provider now uses compatibility level 160, SQL Server 2022, by
default ([dotnet/efcore #38199](https://github.com/dotnet/efcore/pull/38199)).
This lets new EF Core applications use translations that depend on SQL Server
2022 syntax without opting in. Applications that target older SQL Server
compatibility levels can continue to set the level explicitly.

```csharp
optionsBuilder.UseSqlServer(
    connectionString,
    sqlServerOptions => sqlServerOptions.UseCompatibilityLevel(150));
```

## Generated C# uses file-scoped namespaces and UTF-8 without BOM

EF Core's generated C# now uses file-scoped namespace declarations and writes
UTF-8 files without a byte-order mark ([dotnet/efcore #38256](https://github.com/dotnet/efcore/pull/38256)).
The change applies to generated migrations, model snapshots, compiled models,
and reverse-engineered code. It removes one indentation level from generated
files and aligns EF Core output with modern C# project templates.

```csharp
namespace MyApp.Migrations;

public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // ...
    }
}
```

## Query translation produces cleaner SQL

EF Core removes redundant SQL casts that come from value-converted CLR types
with implicit conversions to their provider type
([dotnet/efcore #38156](https://github.com/dotnet/efcore/pull/38156)). For
example, a predicate over a value-converted string property now avoids wrapping
the column in a no-op `CAST`, which keeps the generated SQL simpler.

```csharp
var users = await context.Users
    .Where(u => EF.Functions.Like(u.Name, "Name%"))
    .ToListAsync();
```

```sql
SELECT [u].[Id], [u].[Name]
FROM [Users] AS [u]
WHERE [u].[Name] LIKE N'Name%'
```

SQL Server and SQLite also translate `Any()` over `byte[]` properties
([dotnet/efcore #38168](https://github.com/dotnet/efcore/pull/38168)). SQL
Server translates to `DATALENGTH([b].[Bytes]) > 0`, and SQLite translates to
`length("b"."Bytes") > 0`.

```csharp
var withPayload = await context.Documents
    .Where(d => d.Payload.Any())
    .ToListAsync();
```

## Breaking changes

- **Pre-.NET 11 obsolete APIs were removed.** EF Core 11 removes APIs that were
  marked obsolete before EF Core 11
  ([dotnet/efcore #38145](https://github.com/dotnet/efcore/pull/38145)). Move
  to the replacement APIs before upgrading.
- **Several preview APIs were renamed after API review.** Renames include
  `CosmosDbContextOptionsBuilder.BulkExecutionEnabled` to `BulkExecutionAllowed`,
  `ModelSnapshot.LatestMigrationId` to `LastMigrationId`,
  `ProviderMismatchEventData.CompiledProviderName` to `MismatchedProviderName`,
  and `JsonPath` / `JsonPathSegment` to `StructuredJsonPath` /
  `StructuredJsonPathSegment`
  ([dotnet/efcore #38188](https://github.com/dotnet/efcore/pull/38188)).

<!-- Filtered features (significant engineering work, but too niche for release notes):
  - SQL Server VECTOR_SEARCH() API updates (#38144): aligns vector search with updated SQL Server 2025 syntax, but Preview 4 already documented the user-facing WithApproximate() story and this preview does not add a new application scenario.
  - StructuredJsonPath API rename (#38188): important for provider authors and compiled-model internals, but provider extensibility details are not promoted as user-facing EF Core features.
-->

## Bug fixes

- **Change tracking and seeding**
  - `EnsureCreated`, `EnsureCreatedAsync`, `Migrate`, and `MigrateAsync` no
    longer clear the `ChangeTracker` on execution-strategy retry. Seed delegates
    that already completed are skipped on retry instead
    ([dotnet/efcore #38274](https://github.com/dotnet/efcore/pull/38274)).
- **`dotnet ef`**
  - `dotnet ef migrations bundle --configuration <Name>` now forwards custom
    configuration names instead of only `Debug` or `Release`
    ([dotnet/efcore #38206](https://github.com/dotnet/efcore/pull/38206)). Thank
    you [@m-x-shokhzod](https://github.com/m-x-shokhzod) for this contribution!
- **Model building**
  - File-scoped types can now be used as entity types without throwing
    `IndexOutOfRangeException`
    ([dotnet/efcore #38215](https://github.com/dotnet/efcore/pull/38215)). Thank
    you [@m-x-shokhzod](https://github.com/m-x-shokhzod) for this contribution!
  - Complex-property configuration lambdas can now chain into non-collection
    complex types ([dotnet/efcore #38154](https://github.com/dotnet/efcore/pull/38154)).
  - Conflicting-member errors now name the existing member kind and tell you to
    remove it first ([dotnet/efcore #38222](https://github.com/dotnet/efcore/pull/38222)).
    Thank you [@m-x-shokhzod](https://github.com/m-x-shokhzod) for this
    contribution!
- **Query diagnostics**
  - Using `EF.Constant()` or `EF.Parameter()` inside compiled queries or query
    filters now throws a targeted `InvalidOperationException` instead of an
    `InvalidCastException`
    ([dotnet/efcore #38155](https://github.com/dotnet/efcore/pull/38155)).
- **SQLite scaffolding**
  - Reverse engineering a SQLite database now excludes EF Core's internal
    `__EFMigrationsLock` table, matching the existing behavior for
    `__EFMigrationsHistory`
    ([dotnet/efcore #38169](https://github.com/dotnet/efcore/pull/38169)). Thank
    you [@TomasMoralesBarr](https://github.com/TomasMoralesBarr) for this
    contribution!

## Community contributors

Thank you to the community contributors who made EF Core better in this preview:

- [@jjonescz](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3Ajjonescz):
  Added file-based app support and `--file` / `--startup-file` options for
  `dotnet ef` ([dotnet/efcore #38157](https://github.com/dotnet/efcore/pull/38157),
  [dotnet/efcore #38186](https://github.com/dotnet/efcore/pull/38186)).
- [@m-x-shokhzod](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3Am-x-shokhzod):
  Added EF1004, fixed custom migration-bundle configurations, enabled
  file-scoped entity types, and improved conflicting-member errors
  ([dotnet/efcore #38218](https://github.com/dotnet/efcore/pull/38218),
  [dotnet/efcore #38206](https://github.com/dotnet/efcore/pull/38206),
  [dotnet/efcore #38215](https://github.com/dotnet/efcore/pull/38215),
  [dotnet/efcore #38222](https://github.com/dotnet/efcore/pull/38222)).
- [@TomasMoralesBarr](https://github.com/dotnet/efcore/pulls?q=is%3Apr+is%3Amerged+author%3ATomasMoralesBarr):
  Excluded `__EFMigrationsLock` from SQLite scaffolding
  ([dotnet/efcore #38169](https://github.com/dotnet/efcore/pull/38169)).
