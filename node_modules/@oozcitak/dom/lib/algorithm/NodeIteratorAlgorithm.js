"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DOMImpl_1 = require("../dom/DOMImpl");
var interfaces_1 = require("../dom/interfaces");
var TraversalAlgorithm_1 = require("./TraversalAlgorithm");
var TreeAlgorithm_1 = require("./TreeAlgorithm");
/**
 * Returns the next or previous node in the subtree, or `null` if
 * there are none.
 *
 * @param iterator - the `NodeIterator` instance
 * @param forward- `true` to return the next node, or `false` to
 * return the previous node.
 */
function nodeIterator_traverse(iterator, forward) {
    /**
     * 1. Let node be iterator’s reference.
     * 2. Let beforeNode be iterator’s pointer before reference.
     */
    var node = iterator._reference;
    var beforeNode = iterator._pointerBeforeReference;
    /**
     * 3. While true:
     */
    while (true) {
        /**
         * 3.1. Branch on direction:
         */
        if (forward) {
            /**
             * - next
             */
            if (!beforeNode) {
                /**
                 * If beforeNode is false, then set node to the first node following
                 * node in iterator’s iterator collection. If there is no such node,
                 * then return null.
                 */
                var nextNode = TreeAlgorithm_1.tree_getFollowingNode(iterator._root, node);
                if (nextNode) {
                    node = nextNode;
                }
                else {
                    return null;
                }
            }
            else {
                /**
                 * If beforeNode is true, then set it to false.
                 */
                beforeNode = false;
            }
        }
        else {
            /**
             * - previous
             */
            if (beforeNode) {
                /**
                 * If beforeNode is true, then set node to the first node preceding
                 * node in iterator’s iterator collection. If there is no such node,
                 * then return null.
                 */
                var prevNode = TreeAlgorithm_1.tree_getPrecedingNode(iterator.root, node);
                if (prevNode) {
                    node = prevNode;
                }
                else {
                    return null;
                }
            }
            else {
                /**
                 * If beforeNode is false, then set it to true.
                 */
                beforeNode = true;
            }
        }
        /**
         * 3.2. Let result be the result of filtering node within iterator.
         * 3.3. If result is FILTER_ACCEPT, then break.
         */
        var result = TraversalAlgorithm_1.traversal_filter(iterator, node);
        if (result === interfaces_1.FilterResult.Accept) {
            break;
        }
    }
    /**
     * 4. Set iterator’s reference to node.
     * 5. Set iterator’s pointer before reference to beforeNode.
     * 6. Return node.
     */
    iterator._reference = node;
    iterator._pointerBeforeReference = beforeNode;
    return node;
}
exports.nodeIterator_traverse = nodeIterator_traverse;
/**
 * Gets the global iterator list.
 */
function nodeIterator_iteratorList() {
    return DOMImpl_1.dom.window._iteratorList;
}
exports.nodeIterator_iteratorList = nodeIterator_iteratorList;
//# sourceMappingURL=NodeIteratorAlgorithm.js.map