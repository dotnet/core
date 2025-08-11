/**
 * Represents a cache for storing order between equal objects.
 *
 * This cache is used when an algorithm compares two objects and finds them to
 * be equal but still needs to establish an order between those two objects.
 * When two such objects `a` and `b` are passed to the `check` method, a random
 * number is generated with `Math.random()`. If the random number is less than
 * `0.5` it is assumed that `a < b` otherwise `a > b`. The random number along
 * with `a` and `b` is stored in the cache, so that subsequent checks result
 * in the same consistent result.
 *
 * The cache has a size limit which is defined on initialization.
 */
export declare class CompareCache<T> {
    private _limit;
    private _items;
    /**
     * Initializes a new instance of `CompareCache`.
     *
     * @param limit - maximum number of items to keep in the cache. When the limit
     * is exceeded the first item is removed from the cache.
     */
    constructor(limit?: number);
    /**
     * Compares and caches the given objects. Returns `true` if `objA < objB` and
     * `false` otherwise.
     *
     * @param objA - an item to compare
     * @param objB - an item to compare
     */
    check(objA: T, objB: T): boolean;
}
