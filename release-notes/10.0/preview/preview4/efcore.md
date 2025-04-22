# Entity Framework Core 10 Preview 4 - Release Notes

Here's a summary of what's new in Entity Framework Core in this preview release:

- [Full-text search support on Azure Cosmos DB for NoSQL](#full-text-search-support-on-azure-cosmos-db-for-nosql)
- [Vector similarity search exits preview](#vector-similarity-search-exits-preview)
- [Small improvements](#small-improvements)

Entity Framework Core 10 updates:

- [What's new in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/whatsnew) documentation
- [Breaking change in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/breaking-changes)

## Full-text search support on Azure Cosmos DB for NoSQL

Azure Cosmos DB now offers support for [full-text search](/azure/cosmos-db/gen-ai/full-text-search). It enables efficient and effective text searches, as well as evaluating the relevance of documents to a given search query. It can be used in combination with vector search to improve the accuracy of responses in some AI scenarios.
EF Core 10 is adding support for this feature allowing for modeling the database with full-text search enabled properties and using full-text search functions inside queries targeting Azure Cosmos DB.

Here is a basic EF model configuration enabling full-text search on one of the properties:

```c#
public class Blog
{
    ...

    public string Contents { get; set; }
}

public class BloggingContext
{
    ...

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Blog>(b =>
        {
            b.Property(x => x.Contents).EnableFullTextSearch();
            b.HasIndex(x => x.Contents).IsFullTextIndex();
        });
    }
}
```

Once the model is configured, we can use full-text search operations in queries using methods provided in `EF.Functions`:

```c#
var cosmosBlogs = await context.Blogs.Where(x => EF.Functions.FullTextContains(x.Contents, "cosmos")).ToListAsync();
```

The following full-text operations are currently supported: [`FullTextContains`](/azure/cosmos-db/nosql/query/fulltextcontains), [`FullTextContainsAll`](/azure/cosmos-db/nosql/query/fulltextcontainsall), [`FullTextContainsAny`](/azure/cosmos-db/nosql/query/fulltextcontainsany), [`FullTextScore`](/azure/cosmos-db/nosql/query/fulltextscore).

For more information on Cosmos full-text search, see the [docs](/ef/core/providers/cosmos/full-text-search).

### Hybrid search

EF Core now supports [`RRF`](/azure/cosmos-db/nosql/query/rrf) (Reciprocal Rank Fusion) function, which combines vector similarity search and full-text search (i.e. hybrid search). Here is an example query using hybrid search:

```c#
float[] myVector = /* generate vector data from text, image, etc. */
var hybrid = await context.Blogs.OrderBy(x => EF.Functions.Rrf(
        EF.Functions.FullTextScore(x.Contents, "database"), 
        EF.Functions.VectorDistance(x.Vector, myVector)))
    .Take(10)
    .ToListAsync();
```

For more information on Cosmos hybrid search, see the [docs](/ef/core/providers/cosmos/full-text-search?#hybrid-search).

### Vector similarity search exits preview

In EF9 we added experimental support for vector similarity search. In EF Core 10, vector similarity search support is no longer experimental. We have also made some improvements to the feature:

- EF Core can now generate containers with vector properties defined on owned reference entities. Containers with vector properties defined on owned collections still have to be created by other means. However, they can be used in queries.
- Model building APIs have been renamed. A vector property can now be configured using the `IsVectorProperty` method, and vector index can be configured using the `IsVectorIndex` method.

For more information on Cosmos vector search, see the [docs](/ef/core/providers/cosmos/vector-search).

## Small improvements

- Translate `COALESCE` as `ISNULL` ([#34171](https://github.com/dotnet/efcore/pull/34171), contributed by [@ranma42](https://github.com/ranma42)).
- Support for some string functions taking `char` as arguments ([#34999](https://github.com/dotnet/efcore/pull/34999), contributed by [@ChrisJollyAU](https://github.com/ChrisJollyAU)).
- Support for `MAX`/`MIN`/`ORDER BY` using `decimal` on SQLite ([#35606](https://github.com/dotnet/efcore/pull/35606), contributed by [@ranma42](https://github.com/ranma42)).
- Changed AsyncLocal to ThreadId for better Lazy loader performance ([#35835](https://github.com/dotnet/efcore/pull/35835), contributed by [@henriquewr](https://github.com/henriquewr)).

## Everything else in Preview 4

Preview 4 contains:

- [11 enhancements](https://github.com/dotnet/efcore/issues?q=is%3Aissue%20state%3Aclosed%20label%3Apreview-4%20milestone%3A10.0.0%20label%3Atype-enhancement)
- [2 regression bug fixes](https://github.com/dotnet/efcore/issues?q=is%3Aissue%20state%3Aclosed%20label%3Apreview-4%20milestone%3A10.0.0%20label%3Atype-bug%20label%3Aregression)
- [3 non-regression bug fixes](https://github.com/dotnet/efcore/issues?q=is%3Aissue%20state%3Aclosed%20label%3Apreview-4%20milestone%3A10.0.0%20label%3Atype-bug%20-label%3Aregression%20)