# Entity Framework Core 10 Preview 4 - Release Notes

Here's a summary of what's new in Entity Framework Core in this preview release:

- [Improved experience when evolving the model on Azure Cosmos DB for NoSQL](#improved-experience-when-evolving-the-model-on-azure-cosmos-db-for-nosql)
- [Small improvements](#small-improvements)

Entity Framework Core 10 updates:

- [What's new in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/whatsnew) documentation
- [Breaking change in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/breaking-changes)

## Improved experience when evolving the model on Azure Cosmos DB for NoSQL

In previous versions of EF Core, evolving the model when using Azure Cosmos DB was quite painful. Specifically, when adding a new required property to the entity, EF would no longer be able to materialize that entity. The reason was that EF expected a value for the new property (since it was required), but the document created before the change didn't contain those values. The workaround was to mark the property as optional first, manually add default values for the property, and only then change it to required.

In EF 10 Preview 4 we improved this experience - EF will now materialize a default value for a required property, if no data is present for it in the document, rather than throw.

## Small improvements

- Redact inlined constants from log when sensitive logging is off ([#35724](https://github.com/dotnet/efcore/pull/35724)).
- Improve LoadExtension to work correctly with dotnet run and lib* named libs ([#35617](https://github.com/dotnet/efcore/pull/35617), contributed by [@krwq](https://github.com/krwq)).

## Everything else in Preview 4

Preview 4 contains:

- [4 enhancements](https://github.com/dotnet/efcore/issues?q=is%3Aissue%20is%3Aclosed%20label%3Apreview-3%20(milestone%3A9.0.5%20OR%20milestone%3A10.0.0)%20label%3Atype-enhancement)
- [2 regression bug fixes](https://github.com/dotnet/efcore/issues?q=is%3Aissue%20is%3Aclosed%20label%3Apreview-3%20(milestone%3A9.0.5%20OR%20milestone%3A10.0.0)%20label%3Atype-bug%20label%3Aregression)
- [2 non-regression bug fixes](https://github.com/dotnet/efcore/issues?q=is%3Aissue%20is%3Aclosed%20label%3Apreview-3%20(milestone%3A10.0.0)%20label%3Atype-bug%20-label%3Aregression)
