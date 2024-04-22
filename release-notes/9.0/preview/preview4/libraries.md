# .NET Libraries in .NET 9 Preview 4 - Release Notes

.NET 9 Preview 4 new libraries features:

- New `HybridCache` library

Libraries updates in .NET 9 Preview 4:

- [What's new in .NET 9](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-9/overview) documentation

.NET 9 Preview 4:

- [Discussion](https://aka.ms/dotnet/9/preview4)
- [Release notes](./README.md)
- [SDK release notes](./sdk.md)
- [Runtime release notes](./runtime.md)

## New `HybridCache` library

.NET 9 Preview 4 includes the first release of the new `HybridCache` API; this API bridges some gaps in the existing `IDistributedCache` and `IMemoryCache` APIs, while also adding new capabilities
including "stampede" protection (to prevent parallel fetches of the same work) and configurable serialiation - all with a simple, clean API.
It is designed to be easy to add for new code, or in place of existing caching code.

The best way to illustrate `HybridCache` is by comparison to existing `IDistributedCache` code; consider:

``` c#
public class SomeService(IDistributedCache cache)
{
    public async Task<SomeInformation> GetSomeInformationAsync(string name, int id, CancellationToken token = default)
    {
        var key = $"someinfo:{name}:{id}"; // unique key for this combination

        var bytes = await cache.GetAsync(key, token); // try to get from cache
        SomeInformation info;
        if (bytes is null)
        {
            // cache miss; get the data from the real source
            info = await SomeExpensiveOperationAsync(name, id, token);

            // serialize and cache it
            bytes = SomeSerializer.Serialize(info);
            await cache.SetAsync(key, bytes, token);
        }
        else
        {
            // cache hit; deserialize it
            info = SomeSerializer.Deserialize<SomeInformation>(bytes);
        }
        return info;
    }

    // this is the work we're trying to cache
    private async Task<SomeInformation> SomeExpensiveOperationAsync(string name, int id,
        CancellationToken token = default)
    { /* ... */ }

    // ...
}
```

That's a lot of work to get right each time; additionally, we had to know about things like serialization - and importantly: in the "cache miss" scenario, in a busy system
we could easily end up with multiple concurrent threads *all* getting a cache miss, *all* fetching the underlying data, *all* serializing it, and *all* sending that data
to the cache.

To simplify and improve this with `HybridCache`, we first need to add the new library `Microsoft.Extensions.Caching.Hybrid`:

``` xml
<PackageReference Include="Microsoft.Extensions.Caching.Hybrid" Version="..." />
```

and register the `HybridCache` service (much like we're already registering an `IDistributedCache` implementation):

``` c#
services.AddHybridCache(); // not shown: optional configuration API
```

Now we can offload most of our caching concerns to `HybridCache`:

``` c#
public class SomeService(HybridCache cache)
{
    public async Task<SomeInformation> GetSomeInformationAsync(string name, int id, CancellationToken token = default)
    {
        return await cache.GetOrCreateAsync(
            $"someinfo:{name}:{id}", // unique key for this combination
            async cancel => await SomeExpensiveOperationAsync(name, id, cancel),
            token: token
        );
    }

    // ...
}
```

with `HybridCache` dealing with everthing else, *including* combining concurrent operations. The `cancel` token here represents the combined cancellation
of *all* concurrent callers - not just the cancellation of the caller we can see (`token`). If this is very high throughput scenario, we can further
optimize this by using the `TState` pattern, to avoid some overheads from "captured" variables and per-instance callbacks:

``` c#
public class SomeService(HybridCache cache)
{
    public async Task<SomeInformation> GetSomeInformationAsync(string name, int id, CancellationToken token = default)
    {
        return await cache.GetOrCreateAsync(
            $"someinfo:{name}:{id}", // unique key for this combination
            (name, id), // all of the state we need for the final call, if needed
            static async (state, token) =>
                await SomeExpensiveOperationAsync(state.name, state.id, token),
            token: token
        );
    }

    // ...
}
```

`HybridCache` will use your configured `IDistributedCache` implementation, if any, for the secondary out-of-process caching - for example
Redis ([more information](https://learn.microsoft.com/aspnet/core/performance/caching/distributed)) - but even without
an `IDistributedCache`, the `HybridCache` service will still provide in-process caching and "stampede" protection.

### A note on object reuse

Because a lot of `HybridCache` usage will be adapted from existing `IDistributedCache` code, we need to be mindful that *existing* code will usually
be deserializing every call - which means that concurrent callers will get separate object instances that cannot interact and are inherently
thread-safe. To avoid introducing concurrency bugs into code, `HybridCache` preserves this behaviour by default, but if your scenario is itself
thread-safe (either because the types are fundamentally immutable, or because you're just *not mutating them*), you can hint to `HybridCache`
that it can safely reuse instances by marking the type (`SomeInformation` in this case) as `sealed` and using the `[ImmutableObject(true)]` annotation,
which can significantly reduce per-call deserialization overheads of CPU and object allocations.

### Other `HybridCache` features

As you might expect for parity with `IDistributedCache`, `HybridCache` supports explicit removal by key (`cache.RemoveKeyAsync(...)`). `HybridCache`
also introduces new optional APIs for `IDistributedCache` implementations, to avoid `byte[]` allocations (this feature is implemented
by the preview versions of `Microsoft.Extensions.Caching.StackExchangeRedis` and `Microsoft.Extensions.Caching.SqlServer`).

Serialization is configured as part of registering the service, with support for type-specific and generalized serializers via the
`.WithSerializer(...)` and `.WithSerializerFactory(...)` methods, chained from the `AddHybridCache(...)` call. By default, the library
handles `string` and `byte[]` internally, and uses `System.Text.Json` for everything else, but if you want to use protobuf, xml, or anything
else: that's easy to do.

`HybridCache` includes support for older .NET runtimes, down to .NET Framework 4.7.2 and .NET Standard 2.0.

Outstanding `HybridCache` work includes:

- support for "tagging" (similar to how tagging works for "Output Cache"), allowing invalidation of entire *categories* of data
- backend-assisted cache invalidation, for backends that can provide suitable change notifications
- relocation of the core abstractions to `Microsoft.Extensions.Caching.Abstractions`

---