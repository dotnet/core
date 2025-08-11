/**
 * Represents a set of objects with a size limit.
 */
export declare class FixedSizeSet<T> implements Set<T> {
    private _limit;
    private _items;
    /**
     * Initializes a new instance of `FixedSizeSet`.
     *
     * @param limit - maximum number of items to keep in the set. When the limit
     * is exceeded the first item is removed from the set.
     */
    constructor(limit?: number);
    /**
     * Adds a new item to the set.
     *
     * @param item - an item
     */
    add(item: T): this;
    /**
     * Removes an item from the set.
     *
     * @param item - an item
     */
    delete(item: T): boolean;
    /**
     * Determines if an item is in the set.
     *
     * @param item - an item
     */
    has(item: T): boolean;
    /**
     * Removes all items from the set.
     */
    clear(): void;
    /**
     * Gets the number of items in the set.
     */
    get size(): number;
    /**
     * Applies the given callback function to all elements of the set.
     */
    forEach(callback: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
    /**
     * Iterates through the items in the set.
     */
    keys(): IterableIterator<T>;
    /**
     * Iterates through the items in the set.
     */
    values(): IterableIterator<T>;
    /**
     * Iterates through the items in the set.
     */
    entries(): IterableIterator<[T, T]>;
    /**
     * Iterates through the items in the set.
     */
    [Symbol.iterator](): IterableIterator<T>;
    /**
     * Returns the string tag of the set.
     */
    get [Symbol.toStringTag](): string;
}
