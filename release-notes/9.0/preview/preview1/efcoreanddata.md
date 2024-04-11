# Entity Framework Core 9 Preview 1 Release Notes

The team has been working primarily on EF Core internals, so there are no new big features in EF Core 9 (EF9) Preview 1. However, this means we really need people like you to run your code on these new internals and report back what you find. We want to fix bugs in the new internals as soon as possible in order to have a strong GA release later in the year.

That being said, there are also several smaller enhancements included in preview 1. One of these might be just the thing you have been waiting for, so read on!

Entity Framework Core 9 Preview 1:
* [Discussion](https://github.com/dotnet/efcore/issues/33030)
* [What's new in EF Core 9](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew) documentation.
* [Documentation & Samples](https://github.com/dotnet/EntityFramework.Docs)

.NET 9 Preview 1:
* [Discussion](https://aka.ms/dotnet/9/preview1)
* [Release notes](README.md) 

## Improved queries

- Prune columns passed to OPENJSON's WITH clause
  - EF9 removes unnecessary columns when calling `OPENJSON WITH`.
  - See [_Prune columns from JSON_](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#prune-columns-passed-to-openjsons-with-clause) in the What's New docs for full details including runnable samples.
- Translations involving GREATEST/LEAST
  - Several new translations have been introduced that use the `GREATEST` and `LEAST` SQL functions.
  - This includes translations of `Math.Min` and `Math.Max` in non-aggregate queries, as well as directly exposing the `GREATEST` and `LEAST` SQL functions in relational providers.
  - See [_GREATEST/LEAST translations_](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#prune-columns-passed-to-openjsons-with-clause) in the What's New docs for full details including runnable samples.
- Force or prevent query parameterization
  - Except in some special cases, EF Core parameterizes variables used in a LINQ query, but includes constants in the generated SQL. EF9 allows constants to be translated to parameters and variables to be translated to constants on a case to case basis.
  - See [_Force or prevent query parameterization_](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#force-or-prevent-query-parameterization) in the What's New docs for full details including runnable samples.

## ExecuteUpdate

- Allow passing complex type instances to ExecuteUpdate
  - EF9 supports directly passing complex type instances to `ExecuteUpdate` as sugar for updating all member values.
  - See [_ExecuteUpdate for complex types_](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#allow-passing-complex-type-instances-to-executeupdate) in the What's New docs for full details including runnable samples.

## Temporal tables

- Small migrations for temporal tables
  - The migration created when changing an existing table into a temporal table has been reduced in size for EF9.
  - See [_Improved temporal table migrations_](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#improved-temporal-table-migrations) in the What's New docs for full details including runnable samples.

## Model building

- Make existing model building conventions more extensible
  - In EF9, we have made it easier to extend some of the existing conventions, such as those for property and key discovery.
  - See [_Extensible model building conventions_](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#make-existing-model-building-conventions-more-extensible) in the What's New docs for full details including runnable samples.
- ApplyConfigurationsFromAssembly calls non-public constructors
  - In EF9, we have both improved the error messages generated when this fails, and also enabled instantiation by non-public constructor.
  - See [_ApplyConfigurationsFromAssembly calls non-public constructors_](https://learn.microsoft.com/ef/core/what-is-new/ef-core-9.0/whatsnew#update-applyconfigurationsfromassembly-to-call-non-public-constructors) in the What's New docs for full details including runnable samples.

## Everything else in Preview 1

 Preview 1 contains:
 
- [30 enhancements](https://github.com/dotnet/efcore/issues?q=is%3Aissue+milestone%3A9.0.0-preview1+is%3Aclosed+label%3Atype-enhancement+)
- [51 bug fixes in EF9 Preview 1](https://github.com/dotnet/efcore/issues?q=is%3Aissue+milestone%3A9.0.0-preview1+is%3Aclosed+label%3Atype-bug)
   - [8 bug fixes also shipped in 8.0.1](https://github.com/dotnet/efcore/issues?q=is%3Aissue+milestone%3A8.0.1+is%3Aclosed)
   - [25 bug fixes also shipped in 8.0.2](https://github.com/dotnet/efcore/issues?q=is%3Aissue+milestone%3A8.0.2+is%3Aclosed+)
- [5 cleanup issues](https://github.com/dotnet/efcore/issues?q=is%3Aissue+milestone%3A9.0.0-preview1+is%3Aclosed+-label%3Atype-enhancement+-label%3Atype-bug)