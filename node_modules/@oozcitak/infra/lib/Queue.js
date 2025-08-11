"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Appends the given item to the queue.
 *
 * @param list - a list
 * @param item - an item
 */
function enqueue(list, item) {
    list.push(item);
}
exports.enqueue = enqueue;
/**
 * Removes and returns an item from the queue.
 *
 * @param list - a list
 */
function dequeue(list) {
    return list.shift() || null;
}
exports.dequeue = dequeue;
//# sourceMappingURL=Queue.js.map