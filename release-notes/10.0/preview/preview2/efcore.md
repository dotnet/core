# Entity Framework Core 10 Preview 2 - Release Notes

.NET 10 Preview 2 includes new Entity Framework Core features & enhancements:

- [Support for the .NET 10 RightJoin operator](#support-for-the-net-10-rightjoin-operator)
- [Small improvements](#small-improvements)

Entity Framework Core 10 updates:

- [What's new in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/whatsnew) documentation
- [Breaking change in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/breaking-changes)

## Support for the .NET 10 RightJoin operator

In Preview 1 we added [support for LeftJoin operator](../preview1/efcore.md#support-for-the-net-10-leftjoin-operator). In Preview 2 we are adding support for the analogous `RightJoin` operator, which keeps all the data from the second collection and only the matching data from the first collection. EF 10 translates this to `RIGHT JOIN` operation in the database.

## Small improvements

- Associate the DatabaseRoot with the scoped options instance and not the singleton options ([#34477](https://github.com/dotnet/efcore/pull/34477), contributed by [@koenigst](https://github.com/koenigst)).

## Everything else in Preview 2

Preview 2 contains:

- [3 enhancements](https://github.com/dotnet/efcore/issues?q=is%3Aissue%20is%3Aclosed%20label%3Apreview-2%20(milestone%3A9.0.3%20OR%20milestone%3A9.0.3%20OR%20milestone%3A10.0.0)%20label%3Atype-enhancement)
- [3 regression bug fixes](https://github.com/dotnet/efcore/issues?q=is%3Aissue%20is%3Aclosed%20label%3Apreview-2%20(milestone%3A9.0.3%20OR%20milestone%3A9.0.3%20OR%20milestone%3A9.0.x%20OR%20milestone%3A10.0.0)%20label%3Atype-bug%20label%3Aregression%20)
- [4 non-regression bug fixes](https://github.com/dotnet/efcore/issues?q=is%3Aissue%20is%3Aclosed%20label%3Apreview-2%20(milestone%3A9.0.3%20OR%20milestone%3A9.0.3%20OR%20milestone%3A10.0.0)%20label%3Atype-bug%20-label%3Aregression%20)
