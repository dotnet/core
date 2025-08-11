/**
 * Represents a cache of objects with a size limit.
 */
export declare class ObjectCache<TKey, TValue> {
    private _limit;
    private _items;
    /**
     * Initializes a new instance of `ObjectCache`.
     *
     * @param limit - maximum number of items to keep in the cache. When the limit
     * is exceeded the first item is removed from the cache.
     */
    constructor(limit?: number);
    /**
     * Gets an item from the cache.
     *
     * @param key - object key
     */
    get(key: TKey): TValue | undefined;
    /**
     * Adds a new item to the cache.
     *
     * @param key - object key
     * @param value - object value
     */
    set(key: TKey, value: TValue): void;
    /**
     * Removes an item from the cache.
     *
     * @param item - an item
     */
    delete(key: TKey): boolean;
    /**
     * Determines if an item is in the cache.
     *
     * @param item - an item
     */
    has(key: TKey): boolean;
    /**
     * Removes all items from the cache.
     */
    clear(): void;
    /**
     * Gets the number of items in the cache.
     */
    get size(): number;
    /**
     * Applies the given callback function to all elements of the cache.
     */
    forEach(callback: (key: TKey, value: TValue) => void, thisArg?: any): void;
    /**
     * Iterates through the items in the set.
     */
    keys(): IterableIterator<TKey>;
    /**
     * Iterates through the items in the set.
     */
    values(): IterableIterator<TValue>;
    /**
     * Iterates through the items in the set.
     */
    entries(): IterableIterator<[TKey, TValue]>;
    /**
     * Iterates through the items in the set.
     */
    [Symbol.iterator](): IterableIterator<[TKey, TValue]>;
    /**
     * Returns the string tag of the cache.
     */
    get [Symbol.toStringTag](): string;
}
