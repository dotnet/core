
# Entity Framework Core 10 Preview 7 - Release Notes

Entity Framework Core 10 updates:

- [What's new in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/whatsnew) documentation
- [Breaking change in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/breaking-changes)

## Improved translation for parameterized collection

A notoriously difficult problem with relational databases is queries that involve *parameterized collections*:

```c#
int[] ids = [1, 2, 3];
var blogs = await context.Blogs.Where(b => ids.Contains(b.Id)).ToListAsync();
```

EF 10.0 introduces a new default translation mode for parameterized collections, where each value in the collection is translated into its own scalar parameter:

```sql
SELECT [b].[Id], [b].[Name]
FROM [Blogs] AS [b]
WHERE [b].[Id] IN (@ids1, @ids2, @ids3)
```

For more information, [see the EF release notes](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/whatsnew#parameterized-collection-translation).

## Small improvements and bug fixes

- Fix Microsoft.Data.Sqlite behavior around `DateTime`, `DateTimeOffset` and UTC, [see breaking change notes](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/breaking-changes#DateTimeOffset-read) ([#36195](https://github.com/dotnet/efcore/issues/36195)).
- Fix translation of `DefaultIfEmpty` in various scenarios ([#19095](https://github.com/dotnet/efcore/issues/19095), [#33343](https://github.com/dotnet/efcore/issues/33343), [#36208](https://github.com/dotnet/efcore/issues/36208)).

## Everything else in Preview 7

The full list of issues completed for Preview 7 can be found [here](https://github.com/dotnet/efcore/issues?q=is%3Aissue%20state%3Aclosed%20milestone%3A10.0.0%20label%3Apreview-7).
