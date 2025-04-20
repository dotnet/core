# Entity Framework Core 10 Preview 4 - Release Notes

Here's a summary of what's new in Entity Framework Core in this preview release:

- [Full-text search support on Azure Cosmos DB for NoSQL](#full-text-search-support-on-azure-cosmos-db-for-nosql)
- [Vector similarity search exits preview](#vector-similarity-search-exits-preview)
- [Small improvements](#small-improvements)

Entity Framework Core 10 updates:

- [What's new in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/whatsnew) documentation
- [Breaking change in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/breaking-changes)

## Full-text search support on Azure Cosmos DB for NoSQL

Azure Cosmos DB now offers support for [full-text search](/azure/cosmos-db/gen-ai/full-text-search). It enables efficient and effective text searches using advanced techniques like stemming, as well as evaluating the relevance of documents to a given search query. It can be used in combination with vector search (i.e. hybrid search) to improve the accuracy of responses in some AI scenarios.
EF Core 10 is adding support for this feature allowing for modeling the database with full-text search enabled properties and using full-text search functions inside queries targeting Azure Cosmos DB.

### Model configuration

A property can be configured inside `OnModelCreating` to use full-text search by enabling it for the property and defining a full-text index:

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

> [!NOTE]
> Configuring the index is not mandatory, but it is recommended as it greatly improves performance of full-text search queries.

Full-text search operations are language specific, using American English (`en-US`) by default. You can customize the language for individual properties as part of `EnableFullTextSearch` call:

```c#
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Blog>(b =>
        {
            b.Property(x => x.Contents).EnableFullTextSearch();
            b.HasIndex(x => x.Contents).IsFullTextIndex();
            b.Property(x => x.ContentsGerman).EnableFullTextSearch("de-DE");
            b.HasIndex(x => x.ContentsGerman).IsFullTextIndex();
        });
    }
```

You can also set a default language for the container - unless overridden in the `EnableFullTextSearch` method, all full-text properties inside the container will use that language.

```c#
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Blog>(b =>
        {
            b.HasDefaultFullTextLanguage("de-DE");
            b.Property(x => x.ContentsEnglish).EnableFullTextSearch("en-US");
            b.HasIndex(x => x.ContentsEnglish).IsFullTextIndex();
            b.Property(x => x.ContentsGerman).EnableFullTextSearch();
            b.HasIndex(x => x.ContentsGerman).IsFullTextIndex();
            b.Property(x => x.TagsGerman).EnableFullTextSearch();
            b.HasIndex(x => x.TagsGerman).IsFullTextIndex();
        });
    }
```

> [!NOTE]
> Configuring the index is not mandatory, but it is recommended as it greatly improves performance of full-text search queries.

### Querying

As part of the full-text search feature, Azure Cosmos DB introduced several built-in functions which allow for efficient querying of content inside the full-text search enabled properties. These functions are: [`FullTextContains`](/azure/cosmos-db/nosql/query/fulltextcontains), [`FullTextContainsAll`](/azure/cosmos-db/nosql/query/fulltextcontainsall), [`FullTextContainsAny`](/azure/cosmos-db/nosql/query/fulltextcontainsany), which look for specific keyword or keywords and [`FullTextScore`](/azure/cosmos-db/nosql/query/fulltextscore), which returns [BM25 score](https://en.wikipedia.org/wiki/Okapi_BM25) based on provided keywords.

> [!NOTE]
> `FullTextScore` can only be used inside `OrderBy` to rank the documents based on the score.

EF Core exposes these functions as part of `EF.Functions` so they can be used in queries:

```c#
var cosmosBlogs = await context.Blogs.Where(x => EF.Functions.FullTextContainsAll(x.Contents, "database", "cosmos")).ToListAsync();

var keywords = new string[] { "AI", "agent", "breakthrough" };
var mostInteresting = await context.Blogs.OrderBy(x => EF.Functions.FullTextScore(x.Contents, keywords)).Take(5).ToListAsync();
```

### Hybrid search

Full-text search can be used with vector search in the same query (i.e. hybrid search), by combining results of `FullTextScore` and `VectorDistance` functions. It can be done using the [`RRF`](/azure/cosmos-db/nosql/query/rrf) (Reciprocal Rank Fusion) function, which EF Core also provides inside `EF.Functions`:

```c#
public class Blog
{
    ...

    public float[] Vector { get; set; }
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

            b.Property(x => x.Vector).IsVectorProperty(DistanceFunction.Cosine, dimensions: 1536);
            b.HasIndex(x => x.Vector).IsVectorIndex(VectorIndexType.Flat);
        });
    }
}

float[] myVector = /* generate vector data from text, image, etc. */
var hybrid = await context.Blogs.OrderBy(x => EF.Functions.Rrf(
        EF.Functions.FullTextScore(x.Contents, "database"), 
        EF.Functions.VectorDistance(x.Vector, myVector)))
    .Take(10)
    .ToListAsync();
```

> [!TIP]
> You can combine more than two scoring functions inside `Rrf` call, as well as using only `FullTextScore`, or only `VectorDistance`.

## Vector similarity search exits preview

In EF9 we added experimental support for [vector similarity search](/ef/core/what-is-new/ef-core-9.0/whatsnew#vector-similarity-search-preview). In EF Core 10, vector similarity search support is no longer experimental. We have also made some improvements to the feature:

- EF Core can now generate containers with vector properties defined on owned reference entities. Containers with vector properties defined on owned collections still have to be created by other means. However, they can be used in queries.
- Model building APIs have been renamed. A vector property can now be configured using the `IsVectorProperty` method, and vector index can be configured using the `IsVectorIndex` method.

## Small improvements

- Translate `COALESCE` as `ISNULL` ([#34171](https://github.com/dotnet/efcore/pull/34171), contributed by [@ranma42](https://github.com/ranma42)).

## Everything else in Preview 4

Preview 4 contains:

- [10 enhancements](https://github.com/dotnet/efcore/issues?q=is%3Aissue%20state%3Aclosed%20label%3Apreview-4%20milestone%3A10.0.0%20label%3Atype-enhancement)
- [2 regression bug fixes](https://github.com/dotnet/efcore/issues?q=is%3Aissue%20state%3Aclosed%20label%3Apreview-4%20milestone%3A10.0.0%20label%3Atype-bug%20label%3Aregression)
- [3 non-regression bug fixes](https://github.com/dotnet/efcore/issues?q=is%3Aissue%20state%3Aclosed%20label%3Apreview-4%20milestone%3A10.0.0%20label%3Atype-bug%20-label%3Aregression%20)
