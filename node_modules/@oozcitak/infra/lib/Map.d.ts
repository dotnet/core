/**
 * Gets the value corresponding to the given key.
 *
 * @param map - a map
 * @param key - a key
 */
export declare function get<K, V>(map: Map<K, V>, key: K): V | undefined;
/**
 * Sets the value corresponding to the given key.
 *
 * @param map - a map
 * @param key - a key
 * @param val - a value
 */
export declare function set<K, V>(map: Map<K, V>, key: K, val: V): void;
/**
 * Removes the item with the given key or all items matching condition.
 *
 * @param map - a map
 * @param conditionOrItem - the key of an item to remove or a condition matching
 * items to remove
 */
export declare function remove<K, V>(map: Map<K, V>, conditionOrItem: K | ((item: [K, V]) => boolean)): void;
/**
 * Determines if the map contains a value with the given key.
 *
 * @param map - a map
 * @param conditionOrItem - the key of an item to match or a condition matching
 * items
 */
export declare function contains<K, V>(map: Map<K, V>, conditionOrItem: K | ((item: [K, V]) => boolean)): boolean;
/**
 * Gets the keys of the map.
 *
 * @param map - a map
 */
export declare function keys<K, V>(map: Map<K, V>): Set<K>;
/**
 * Gets the values of the map.
 *
 * @param map - a map
 */
export declare function values<K, V>(map: Map<K, V>): V[];
/**
 * Gets the size of the map.
 *
 * @param map - a map
 * @param condition - an optional condition to match
 */
export declare function size<K, V>(map: Map<K, V>, condition?: ((item: [K, V]) => boolean)): number;
/**
 * Determines if the map is empty.
 *
 * @param map - a map
 */
export declare function isEmpty<K, V>(map: Map<K, V>): boolean;
/**
 * Returns an iterator for the items of the map.
 *
 * @param map - a map
 * @param condition - an optional condition to match
 */
export declare function forEach<K, V>(map: Map<K, V>, condition?: ((item: [K, V]) => boolean)): IterableIterator<[K, V]>;
/**
 * Creates and returns a shallow clone of map.
 *
 * @param map - a map
 */
export declare function clone<K, V>(map: Map<K, V>): Map<K, V>;
/**
 * Returns a new map containing items from the map sorted in ascending
 * order.
 *
 * @param map - a map
 * @param lessThanAlgo - a function that returns `true` if its first argument
 * is less than its second argument, and `false` otherwise.
 */
export declare function sortInAscendingOrder<K, V>(map: Map<K, V>, lessThanAlgo: ((itemA: [K, V], itemB: [K, V]) => boolean)): Map<K, V>;
/**
 * Returns a new map containing items from the map sorted in descending
 * order.
 *
 * @param map - a map
 * @param lessThanAlgo - a function that returns `true` if its first argument
 * is less than its second argument, and `false` otherwise.
 */
export declare function sortInDescendingOrder<K, V>(map: Map<K, V>, lessThanAlgo: ((itemA: [K, V], itemB: [K, V]) => boolean)): Map<K, V>;
