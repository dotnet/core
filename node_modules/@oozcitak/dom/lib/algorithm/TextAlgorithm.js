"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var DOMImpl_1 = require("../dom/DOMImpl");
var util_1 = require("../util");
var DOMException_1 = require("../dom/DOMException");
var CreateAlgorithm_1 = require("./CreateAlgorithm");
var TreeAlgorithm_1 = require("./TreeAlgorithm");
var CharacterDataAlgorithm_1 = require("./CharacterDataAlgorithm");
var MutationAlgorithm_1 = require("./MutationAlgorithm");
/**
 * Returns node with its adjacent text and cdata node siblings.
 *
 * @param node - a node
 * @param self - whether to include node itself
 */
function text_contiguousTextNodes(node, self) {
    var _a;
    if (self === void 0) { self = false; }
    /**
     * The contiguous Text nodes of a node node are node, node’s previous
     * sibling Text node, if any, and its contiguous Text nodes, and node’s next
     * sibling Text node, if any, and its contiguous Text nodes, avoiding any
     * duplicates.
     */
    return _a = {},
        _a[Symbol.iterator] = function () {
            var currentNode = node;
            while (currentNode && util_1.Guard.isTextNode(currentNode._previousSibling)) {
                currentNode = currentNode._previousSibling;
            }
            return {
                next: function () {
                    if (currentNode && (!self && currentNode === node)) {
                        if (util_1.Guard.isTextNode(currentNode._nextSibling)) {
                            currentNode = currentNode._nextSibling;
                        }
                        else {
                            currentNode = null;
                        }
                    }
                    if (currentNode === null) {
                        return { done: true, value: null };
                    }
                    else {
                        var result = { done: false, value: currentNode };
                        if (util_1.Guard.isTextNode(currentNode._nextSibling)) {
                            currentNode = currentNode._nextSibling;
                        }
                        else {
                            currentNode = null;
                        }
                        return result;
                    }
                }
            };
        },
        _a;
}
exports.text_contiguousTextNodes = text_contiguousTextNodes;
/**
 * Returns node with its adjacent text node siblings.
 *
 * @param node - a node
 * @param self - whether to include node itself
 */
function text_contiguousExclusiveTextNodes(node, self) {
    var _a;
    if (self === void 0) { self = false; }
    /**
     * The contiguous exclusive Text nodes of a node node are node, node’s
     * previous sibling exclusive Text node, if any, and its contiguous
     * exclusive Text nodes, and node’s next sibling exclusive Text node,
     * if any, and its contiguous exclusive Text nodes, avoiding any duplicates.
     */
    return _a = {},
        _a[Symbol.iterator] = function () {
            var currentNode = node;
            while (currentNode && util_1.Guard.isExclusiveTextNode(currentNode._previousSibling)) {
                currentNode = currentNode._previousSibling;
            }
            return {
                next: function () {
                    if (currentNode && (!self && currentNode === node)) {
                        if (util_1.Guard.isExclusiveTextNode(currentNode._nextSibling)) {
                            currentNode = currentNode._nextSibling;
                        }
                        else {
                            currentNode = null;
                        }
                    }
                    if (currentNode === null) {
                        return { done: true, value: null };
                    }
                    else {
                        var result = { done: false, value: currentNode };
                        if (util_1.Guard.isExclusiveTextNode(currentNode._nextSibling)) {
                            currentNode = currentNode._nextSibling;
                        }
                        else {
                            currentNode = null;
                        }
                        return result;
                    }
                }
            };
        },
        _a;
}
exports.text_contiguousExclusiveTextNodes = text_contiguousExclusiveTextNodes;
/**
 * Returns the concatenation of the data of all the Text node descendants of
 * node, in tree order.
 *
 * @param node - a node
 */
function text_descendantTextContent(node) {
    /**
     * The descendant text content of a node node is the concatenation of the
     * data of all the Text node descendants of node, in tree order.
     */
    var contents = '';
    var text = TreeAlgorithm_1.tree_getFirstDescendantNode(node, false, false, function (e) { return util_1.Guard.isTextNode(e); });
    while (text !== null) {
        contents += text._data;
        text = TreeAlgorithm_1.tree_getNextDescendantNode(node, text, false, false, function (e) { return util_1.Guard.isTextNode(e); });
    }
    return contents;
}
exports.text_descendantTextContent = text_descendantTextContent;
/**
 * Splits data at the given offset and returns the remainder as a text
 * node.
 *
 * @param node - a text node
 * @param offset - the offset at which to split the nodes.
 */
function text_split(node, offset) {
    var e_1, _a;
    /**
     * 1. Let length be node’s length.
     * 2. If offset is greater than length, then throw an "IndexSizeError"
     * DOMException.
     */
    var length = node._data.length;
    if (offset > length) {
        throw new DOMException_1.IndexSizeError();
    }
    /**
     * 3. Let count be length minus offset.
     * 4. Let new data be the result of substringing data with node node,
     * offset offset, and count count.
     * 5. Let new node be a new Text node, with the same node document as node.
     * Set new node’s data to new data.
     * 6. Let parent be node’s parent.
     * 7. If parent is not null, then:
     */
    var count = length - offset;
    var newData = CharacterDataAlgorithm_1.characterData_substringData(node, offset, count);
    var newNode = CreateAlgorithm_1.create_text(node._nodeDocument, newData);
    var parent = node._parent;
    if (parent !== null) {
        /**
         * 7.1. Insert new node into parent before node’s next sibling.
         */
        MutationAlgorithm_1.mutation_insert(newNode, parent, node._nextSibling);
        try {
            /**
             * 7.2. For each live range whose start node is node and start offset is
             * greater than offset, set its start node to new node and decrease its
             * start offset by offset.
             * 7.3. For each live range whose end node is node and end offset is greater
             * than offset, set its end node to new node and decrease its end offset
             * by offset.
             * 7.4. For each live range whose start node is parent and start offset is
             * equal to the index of node plus 1, increase its start offset by 1.
             * 7.5. For each live range whose end node is parent and end offset is equal
             * to the index of node plus 1, increase its end offset by 1.
             */
            for (var _b = __values(DOMImpl_1.dom.rangeList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var range = _c.value;
                if (range._start[0] === node && range._start[1] > offset) {
                    range._start[0] = newNode;
                    range._start[1] -= offset;
                }
                if (range._end[0] === node && range._end[1] > offset) {
                    range._end[0] = newNode;
                    range._end[1] -= offset;
                }
                var index = TreeAlgorithm_1.tree_index(node);
                if (range._start[0] === parent && range._start[1] === index + 1) {
                    range._start[1]++;
                }
                if (range._end[0] === parent && range._end[1] === index + 1) {
                    range._end[1]++;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    /**
     * 8. Replace data with node node, offset offset, count count, and data
     * the empty string.
     * 9. Return new node.
     */
    CharacterDataAlgorithm_1.characterData_replaceData(node, offset, count, '');
    return newNode;
}
exports.text_split = text_split;
//# sourceMappingURL=TextAlgorithm.js.map