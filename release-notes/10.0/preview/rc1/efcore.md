# Entity Framework Core in .NET 10 RC 1 - Release Notes

Here's a summary of what's new in Entity Framework Core in this release:

- [SQL Server vector search](#sql-server-vector-search)
- [SQL Server JSON type support](#sql-server-json-type-support)
- [Cosmos full-text and hybrid search](#cosmos-full-text-and-hybrid-search)
- [Complex types](#complex-types)
- [Padding for parameterized collections](#padding-for-parameterized-collections)

Entity Framework Core 10 updates:

- [What's new in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/whatsnew) documentation
- [Breaking change in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/breaking-changes)

## SQL Server vector search

EF 10 brings full support for the recently-introduced vector data type and its supporting VECTOR_DISTANCE() function, available on Azure SQL Database and on SQL Server 2025.

To use the vector data type, simply add a .NET property of type `SqlVector<float>` to your entity type:

```c#
public class Blog
{
    // ...

    [Column(TypeName = "vector(1536)")]
    public SqlVector<float> Embedding { get; set; }
}
```

Then, insert embedding data by populating the Embedding property and calling SaveChangesAsync() as usual:

```c#
IEmbeddingGenerator<string, Embedding<float>> embeddingGenerator = /* Set up your preferred embedding generator */;

var embedding = await embeddingGenerator.GenerateVectorAsync("Some text to be vectorized");
context.Blogs.Add(new Blog
{
    Name = "Some blog",
    Embedding = new SqlVector<float>(embedding)
});
await context.SaveChangesAsync();
```

For more information on vector search, [see the documentation](https://learn.microsoft.com/ef/core/providers/sql-server/vector-search).

## SQL Server JSON type support

EF 10 fully supports the new JSON data type, available on Azure SQL Database and on SQL Server 2025:

```c#
public class Blog
{
    public int Id { get; set; }

    public string[] Tags { get; set; }
    public required BlogDetails Details { get; set; }
}

public class BlogDetails
{
    public string? Description { get; set; }
    public int Viewers { get; set; }
}

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Blog>().ComplexProperty(b => b.Details, b => b.ToJson());
}
```

When configured to target SQL Server 2025, EF 10 creates the following table for the above:

```sql
CREATE TABLE [Blogs] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [Tags] json NOT NULL,
    [Details] json NOT NULL,
    CONSTRAINT [PK_Blogs] PRIMARY KEY ([Id])
);
```

For more information, [see the EF what's new page](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/whatsnew#json-type-support).

## Cosmos full-text and hybrid search

EF 10 brings support for the new Cosmos full-text feature:

```c#
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Blog>(b =>
    {
        b.Property(x => x.Contents).EnableFullTextSearch();
        b.HasIndex(x => x.Contents).IsFullTextIndex();
    });
}

var cosmosBlogs = await context.Blogs
    .Where(x => EF.Functions.FullTextContains(x.Contents, "cosmos"))
    .ToListAsync();
```

The new hybrid search capability, which allows combining full-text and vector search, is also supported:

```c#
float[] myVector = /* generate vector data from text, image, etc. */
var hybrid = await context.Blogs.OrderBy(x => EF.Functions.Rrf(
        EF.Functions.FullTextScore(x.Contents, "database"), 
        EF.Functions.VectorDistance(x.Vector, myVector)))
    .Take(10)
    .ToListAsync();
```

For more information, [see the documentation](https://learn.microsoft.com/ef/core/providers/cosmos/full-text-search).

## Complex types

EF 10 introduces substantially improved support for *complex types*, which are designed to map nested types to the database, either via JSON or by mapping their columns to the same table as their container:

```c#
modelBuilder.Entity<Customer>(b =>
{
    // Maps the columns of ShippingAddress to the Customer table
    b.ComplexProperty(c => c.ShippingAddress);
    // Maps BillingAddress to a single JSON column in the Customer table
    b.ComplexProperty(c => c.BillingAddress, c => c.ToJson());
});
```

Once your nested type has been mapped, it can be fully queried via LINQ and updated via the usual EF mechanisms. Note that while EF has supported nested mapping via owned entity types, complex types represent a better alternative that fixes many of the problems encountered with owned entity types.

Note that this the complex type support was considerably improved after RC1, and many bugs have been fixed for RC2; to use the full extent of the feature, it's advised to wait for RC2.

## Padding for parameterized collections

Building on top of the improved translation for parameterized collection introduced in preview 7 ([docs](https://github.com/dotnet/core/blob/main/release-notes/10.0/preview/preview7/efcore.md#improved-translation-for-parameterized-collection)), in RC1 EF also introduces parameter padding, which further optimizes the generated SQL. [See the EF what's new page for more details](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/whatsnew#improved-translation-for-parameterized-collection).

## Everything else in RC1

The full list of issues completed for RC1 can be found [here](https://github.com/dotnet/efcore/issues?q=is%3Aissue%20state%3Aclosed%20label%3Arc-1).
