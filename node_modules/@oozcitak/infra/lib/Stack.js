"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Pushes the given item to the stack.
 *
 * @param list - a list
 * @param item - an item
 */
function push(list, item) {
    list.push(item);
}
exports.push = push;
/**
 * Pops and returns an item from the stack.
 *
 * @param list - a list
 */
function pop(list) {
    return list.pop() || null;
}
exports.pop = pop;
//# sourceMappingURL=Stack.js.map