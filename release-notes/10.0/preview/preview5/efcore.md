# Entity Framework Core 10 Preview 5 - Release Notes

Here's a summary of what's new in Entity Framework Core in this preview release:

- [Custom Default Constraint Names](#customdefaultconstraintnames)

Entity Framework Core 10 updates:

- [What's new in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/whatsnew) documentation
- [Breaking change in Entity Framework Core 10](https://learn.microsoft.com/ef/core/what-is-new/ef-core-10.0/breaking-changes)

## Custom Default Constraint Names

In previous versions of EF Core, when you specified a default value for a property, EF Core would always let the database automatically generate a constraint name. Now, you can explicitly specify the name for default value constraints for SQL Server, giving you more control over your database schema.

You can now specify a constraint name when defining default values in your model configuration:

```C#
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Blog>()
        .Property(b => b.IsActive)
        .HasDefaultValue(true, "DF_Blog_IsActive");

    modelBuilder.Entity<Post>()
        .Property(p => b.CreatedDate)
        .HasDefaultValueSql("GETDATE()", "DF_Post_CreatedDate");
}

```

You can also call `UseNamedDefaultConstraints` to enable automatic naming of all the default constraints. Note that if you have existing migrations then the next migration you add will rename every single default constraint in your model.

```C#
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder
        .UseNamedDefaultConstraints();
}
