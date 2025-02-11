# Entity Framework Core 10 Preview 1 - Release Notes

.NET 10 Preview 1 includes new Entity Framework Core features & enhancements:

- [ExecuteUpdateAsync now accepts a regular, non-expression lambda](#executeupdateasync-now-accepts-a-regular-non-expression-lambda)
- [Several query improvements](#query-improvements)

Entity Framework Core 10 updates:

- [What's new in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/whatsnew) documentation
- [Breaking change in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/breaking-changes)


## ExecuteUpdateAsync now accepts a regular, non-expression lambda

Creating expresion trees can be verbose, and now you can use regular, non-expression lambdas when calling `ExecuteUpdateAsync`:

```c#
await context.Blogs.ExecuteUpdateAsync(s =>
{
    s.SetProperty(b => b.Views, 8);
    if (nameChanged)
    {
        s.SetProperty(b => b.Name, "foo");
    }
});
```

Thanks to [@aradalvand](https://github.com/aradalvand) for proposing and pushing for this change (in [#32018](https://github.com/dotnet/efcore/issues/32018)).

## Query improvements

- Translation for DateOnly.ToDateTime(timeOnly) ([#35194](https://github.com/dotnet/efcore/pull/35194), contributed by [@mseada94](https://github.com/mseada94)).
- Optimization for multiple consecutive `LIMIT`s ([#35384](https://github.com/dotnet/efcore/pull/35384)), contributed by [@ranma42](https://github.com/ranma42)).
- Optimization for use of `Count` operation on `ICollection<T>` ([#35381](https://github.com/dotnet/efcore/pull/35381)), contributed by [@ChrisJollyAU](https://github.com/ChrisJollyAU)).
