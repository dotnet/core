/**
 * Adds the given item to the end of the set.
 *
 * @param set - a set
 * @param item - an item
 */
export declare function append<T>(set: Set<T>, item: T): void;
/**
 * Extends a set by appending all items from another set.
 *
 * @param setA - a list to extend
 * @param setB - a list containing items to append to `setA`
 */
export declare function extend<T>(setA: Set<T>, setB: Set<T>): void;
/**
 * Inserts the given item to the start of the set.
 *
 * @param set - a set
 * @param item - an item
 */
export declare function prepend<T>(set: Set<T>, item: T): void;
/**
 * Replaces the given item or all items matching condition with a new item.
 *
 * @param set - a set
 * @param conditionOrItem - an item to replace or a condition matching items
 * to replace
 * @param item - an item
 */
export declare function replace<T>(set: Set<T>, conditionOrItem: T | ((item: T) => boolean), newItem: T): void;
/**
 * Inserts the given item before the given index.
 *
 * @param set - a set
 * @param item - an item
 */
export declare function insert<T>(set: Set<T>, item: T, index: number): void;
/**
 * Removes the given item or all items matching condition.
 *
 * @param set - a set
 * @param conditionOrItem - an item to remove or a condition matching items
 * to remove
 */
export declare function remove<T>(set: Set<T>, conditionOrItem: T | ((item: T) => boolean)): void;
/**
 * Removes all items from the set.
 */
export declare function empty<T>(set: Set<T>): void;
/**
 * Determines if the set contains the given item or any items matching
 * condition.
 *
 * @param set - a set
 * @param conditionOrItem - an item to a condition to match
 */
export declare function contains<T>(set: Set<T>, conditionOrItem: T | ((item: T) => boolean)): boolean;
/**
 * Returns the count of items in the set matching the given condition.
 *
 * @param set - a set
 * @param condition - an optional condition to match
 */
export declare function size<T>(set: Set<T>, condition?: ((item: T) => boolean)): number;
/**
 * Determines if the set is empty.
 *
 * @param set - a set
 */
export declare function isEmpty<T>(set: Set<T>): boolean;
/**
 * Returns an iterator for the items of the set.
 *
 * @param set - a set
 * @param condition - an optional condition to match
 */
export declare function forEach<T>(set: Set<T>, condition?: ((item: T) => boolean)): IterableIterator<T>;
/**
 * Creates and returns a shallow clone of set.
 *
 * @param set - a set
 */
export declare function clone<T>(set: Set<T>): Set<T>;
/**
 * Returns a new set containing items from the set sorted in ascending
 * order.
 *
 * @param set - a set
 * @param lessThanAlgo - a function that returns `true` if its first argument
 * is less than its second argument, and `false` otherwise.
 */
export declare function sortInAscendingOrder<T>(set: Set<T>, lessThanAlgo: ((itemA: T, itemB: T) => boolean)): Set<T>;
/**
 * Returns a new set containing items from the set sorted in descending
 * order.
 *
 * @param set - a set
 * @param lessThanAlgo - a function that returns `true` if its first argument
 * is less than its second argument, and `false` otherwise.
 */
export declare function sortInDescendingOrder<T>(set: Set<T>, lessThanAlgo: ((itemA: T, itemB: T) => boolean)): Set<T>;
/**
 * Determines if a set is a subset of another set.
 *
 * @param subset - a set
 * @param superset - a superset possibly containing all items from `subset`.
 */
export declare function isSubsetOf<T>(subset: Set<T>, superset: Set<T>): boolean;
/**
 * Determines if a set is a superset of another set.
 *
 * @param superset - a set
 * @param subset - a subset possibly contained within `superset`.
 */
export declare function isSupersetOf<T>(superset: Set<T>, subset: Set<T>): boolean;
/**
 * Returns a new set with items that are contained in both sets.
 *
 * @param setA - a set
 * @param setB - a set
 */
export declare function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T>;
/**
 * Returns a new set with items from both sets.
 *
 * @param setA - a set
 * @param setB - a set
 */
export declare function union<T>(setA: Set<T>, setB: Set<T>): Set<T>;
/**
 * Returns a set of integers from `n` to `m` inclusive.
 *
 * @param n - starting number
 * @param m - ending number
 */
export declare function range(n: number, m: number): Set<number>;
