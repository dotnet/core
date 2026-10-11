# EF Core in .NET 11 RC 2 - Release Notes

## Bug fixes

- **SaveChanges:** Updates that reassign values covered by a unique index run in the correct order, and unconstrained relationships can break command cycles ([dotnet/efcore #38924](https://github.com/dotnet/efcore/pull/38924), [dotnet/efcore #38989](https://github.com/dotnet/efcore/pull/38989)).
- **Queries:** Projections can combine a JSON complex collection and a collection navigation ([dotnet/efcore #38948](https://github.com/dotnet/efcore/pull/38948)).
