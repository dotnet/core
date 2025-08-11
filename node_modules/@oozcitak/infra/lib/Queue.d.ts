/**
 * Appends the given item to the queue.
 *
 * @param list - a list
 * @param item - an item
 */
export declare function enqueue<T>(list: Array<T>, item: T): void;
/**
 * Removes and returns an item from the queue.
 *
 * @param list - a list
 */
export declare function dequeue<T>(list: Array<T>): T | null;
