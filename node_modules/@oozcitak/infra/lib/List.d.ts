/**
 * Adds the given item to the end of the list.
 *
 * @param list - a list
 * @param item - an item
 */
export declare function append<T>(list: Array<T>, item: T): void;
/**
 * Extends a list by appending all items from another list.
 *
 * @param listA - a list to extend
 * @param listB - a list containing items to append to `listA`
 */
export declare function extend<T>(listA: Array<T>, listB: Array<T>): void;
/**
 * Inserts the given item to the start of the list.
 *
 * @param list - a list
 * @param item - an item
 */
export declare function prepend<T>(list: Array<T>, item: T): void;
/**
 * Replaces the given item or all items matching condition with a new item.
 *
 * @param list - a list
 * @param conditionOrItem - an item to replace or a condition matching items
 * to replace
 * @param item - an item
 */
export declare function replace<T>(list: Array<T>, conditionOrItem: T | ((item: T) => boolean), newItem: T): void;
/**
 * Inserts the given item before the given index.
 *
 * @param list - a list
 * @param item - an item
 */
export declare function insert<T>(list: Array<T>, item: T, index: number): void;
/**
 * Removes the given item or all items matching condition.
 *
 * @param list - a list
 * @param conditionOrItem - an item to remove or a condition matching items
 * to remove
 */
export declare function remove<T>(list: Array<T>, conditionOrItem: T | ((item: T) => boolean)): void;
/**
 * Removes all items from the list.
 */
export declare function empty<T>(list: Array<T>): void;
/**
 * Determines if the list contains the given item or any items matching
 * condition.
 *
 * @param list - a list
 * @param conditionOrItem - an item to a condition to match
 */
export declare function contains<T>(list: Array<T>, conditionOrItem: T | ((item: T) => boolean)): boolean;
/**
 * Returns the count of items in the list matching the given condition.
 *
 * @param list - a list
 * @param condition - an optional condition to match
 */
export declare function size<T>(list: Array<T>, condition?: ((item: T) => boolean)): number;
/**
 * Determines if the list is empty.
 *
 * @param list - a list
 */
export declare function isEmpty<T>(list: Array<T>): boolean;
/**
 * Returns an iterator for the items of the list.
 *
 * @param list - a list
 * @param condition - an optional condition to match
 */
export declare function forEach<T>(list: Array<T>, condition?: ((item: T) => any)): IterableIterator<T>;
/**
 * Creates and returns a shallow clone of list.
 *
 * @param list - a list
 */
export declare function clone<T>(list: Array<T>): Array<T>;
/**
 * Returns a new list containing items from the list sorted in ascending
 * order.
 *
 * @param list - a list
 * @param lessThanAlgo - a function that returns `true` if its first argument
 * is less than its second argument, and `false` otherwise.
 */
export declare function sortInAscendingOrder<T>(list: Array<T>, lessThanAlgo: ((itemA: T, itemB: T) => boolean)): Array<T>;
/**
 * Returns a new list containing items from the list sorted in descending
 * order.
 *
 * @param list - a list
 * @param lessThanAlgo - a function that returns `true` if its first argument
 * is less than its second argument, and `false` otherwise.
 */
export declare function sortInDescendingOrder<T>(list: Array<T>, lessThanAlgo: ((itemA: T, itemB: T) => boolean)): Array<T>;
