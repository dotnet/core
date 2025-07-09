
# Entity Framework Core 10 Preview 6 - Release Notes

Here's a summary of what's new in Entity Framework Core in this preview release:

- [Named query filters](#named-query-filters)
- [Small improvements and bug fixes](#small-improvements-and-bug-fixes)

Entity Framework Core 10 updates:

- [What's new in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/whatsnew) documentation
- [Breaking change in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/breaking-changes)

## Named query filters

EF's [global query filters](xref:core/querying/filters) feature has long enabled users to configuring filters to entity types which apply to all queries by default. This has simplified implementing common patterns and scenarios such as soft deletion, multitenancy and others. However, up to now EF has only supported a single query filter per entity type, making it difficult to have multiple filters and selectively disabling only some of them in specific queries.

EF 10 introduces *named query filters*, which allow attaching names to query filter and managing each one separately:

```c#
modelBuilder.Entity<Blog>()
    .HasQueryFilter("SoftDeletionFlter", b => !b.IsDeleted)
    .HasQueryFilter("TenantFilter", b => b.TenantId == tenantId);
```

This notably allows disabling only certain filters in a specific LINQ query:

```c#
var allBlogs = await context.Blogs.IgnoreQueryFilters(["SoftDeletionFlter"]).ToListAsync();
```

For more information on named query filters, see the [documentation](https://learn.microsoft.com/ef/core/querying/filters).

This feature was contributed by [@bittola](https://github.com/bittola).

## Small improvements and bug fixes

- Implemented `DateOnly.DayNumber` translations ([#36189](https://github.com/dotnet/efcore/pull/36189)).
- IQueryExpressionInterceptor leaks across contexts, leading to incorrectly-used cached queries ([#36127](https://github.com/dotnet/efcore/issues/36127)).
- Support entity splitting with owned JSON entities (on main table) ([#36145](https://github.com/dotnet/efcore/issues/36145)).

## Everything else in Preview 6

The full list of issues completed for Preview 6 can be found [here](https://github.com/dotnet/efcore/issues?q=is%3Aissue%20state%3Aclosed%20milestone%3A10.0.0%20label%3Apreview-6).
