# Entity Framework Core 10 Preview 1 - Release Notes

.NET 10 Preview 1 includes new Entity Framework Core features & enhancements:

- [Support for the .NET 10 LeftJoin operator](#support-for-the-.net-10-leftjoin-operator)
- [ExecuteUpdateAsync now accepts a regular, non-expression lambda](#executeupdateasync-now-accepts-a-regular-non-expression-lambda)
- [Several small improvements](#small-improvements)

Entity Framework Core 10 updates:

- [What's new in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/whatsnew) documentation
- [Breaking change in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/breaking-changes)

## Support for the .NET 10 LeftJoin operator

`LEFT JOIN` is a common and useful operation when working with EF Core. In previous versions, implementing `LEFT JOIN` in LINQ was quite complicated, requiring `SelectMany`, `GroupJoin` and `DefaultIfEmpty` operations in a particular configuration:

```C#
var query = students
    .GroupJoin(
        departments,
        student => student.DepartmentID,
        department => department.ID,
        (student, departmentList) => new { student, subgroup = departmentList })
    .SelectMany(
        joinedSet => joinedSet.subgroup.DefaultIfEmpty(),
        (student, department) => new
        {
            student.student.FirstName,
            student.student.LastName,
            Department = department?.Name ?? "[NONE]"
        });
```

.NET 10 adds first-class LINQ support for `LeftJoin` method to make those queries much simpler to write. EF Core recognizes the new method, so it can be used in EF LINQ queries instead of the old construct:

```C#
var query = students
    .LeftJoin(
        departments,
        student => student.DepartmentID,
        department => department.ID,
        (student, departmentList) => new 
        { 
            student.student.FirstName,
            student.student.LastName,
            Department = department?.Name ?? "[NONE]"
        });
```

See [#12793](https://github.com/dotnet/efcore/issues/12793) for more details.

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

## Small improvements

- Translation for DateOnly.ToDateTime(timeOnly) ([#35194](https://github.com/dotnet/efcore/pull/35194), contributed by [@mseada94](https://github.com/mseada94)).
- Optimization for multiple consecutive `LIMIT`s ([#35384](https://github.com/dotnet/efcore/pull/35384), contributed by [@ranma42](https://github.com/ranma42)).
- Optimization for use of `Count` operation on `ICollection<T>` ([#35381](https://github.com/dotnet/efcore/pull/35381), contributed by [@ChrisJollyAU](https://github.com/ChrisJollyAU)).
- Optimization for `MIN`/`MAX` over `DISTINCT` ([#34699](https://github.com/dotnet/efcore/pull/34699), contributed by [@ranma42](https://github.com/ranma42)).
- Make SQL Server scaffolding compatible with Azure Data Explorer ([#34832](https://github.com/dotnet/efcore/pull/34832), contributed by [@barnuri](https://github.com/barnuri)).
- Translation for date/time functions using `DatePart.Microsecond` and `DatePart.Nanosecond` arguments ([#34861](https://github.com/dotnet/efcore/pull/34861)).
- Simplifying parameter names (e.g. from `@__city_0` to `city`) ([#35200](https://github.com/dotnet/efcore/pull/35200)).

## Everything else in Preview 1

Preview 1 contains:

- [18 enhancements](https://github.com/dotnet/efcore/issues?q=is%3Aissue%20is%3Aclosed%20label%3Apreview-1%20(milestone%3A9.0.1%20OR%20milestone%3A9.0.2%20OR%20milestone%3A9.0.3%20OR%20milestone%3A10.0.0)%20label%3Atype-enhancement)
- [14 regression bug fixes](https://github.com/dotnet/efcore/issues?q=is%3Aissue%20is%3Aclosed%20label%3Apreview-1%20label%3Atype-bug%20(milestone%3A9.0.1%20OR%20milestone%3A9.0.2%20OR%20milestone%3A9.0.3%20OR%20milestone%3A10.0.0)%20label%3Aregression)
- [28 non-regression bug fixes](https://github.com/dotnet/efcore/issues?q=is%3Aissue%20is%3Aclosed%20label%3Apreview-1%20label%3Atype-bug%20(milestone%3A9.0.1%20OR%20milestone%3A9.0.2%20OR%20milestone%3A9.0.3%20OR%20milestone%3A10.0.0)%20-label%3Aregression%20)
