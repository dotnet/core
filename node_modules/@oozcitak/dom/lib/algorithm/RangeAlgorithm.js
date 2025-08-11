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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("../dom/interfaces");
var DOMException_1 = require("../dom/DOMException");
var util_1 = require("../util");
var CreateAlgorithm_1 = require("./CreateAlgorithm");
var TreeAlgorithm_1 = require("./TreeAlgorithm");
var BoundaryPointAlgorithm_1 = require("./BoundaryPointAlgorithm");
var CharacterDataAlgorithm_1 = require("./CharacterDataAlgorithm");
var NodeAlgorithm_1 = require("./NodeAlgorithm");
var MutationAlgorithm_1 = require("./MutationAlgorithm");
var TextAlgorithm_1 = require("./TextAlgorithm");
/**
 * Determines if the node's start boundary point is at its end boundary
 * point.
 *
 * @param range - a range
 */
function range_collapsed(range) {
    /**
     * A range is collapsed if its start node is its end node and its start offset is its end offset.
     */
    return (range._startNode === range._endNode && range._startOffset === range._endOffset);
}
exports.range_collapsed = range_collapsed;
/**
 * Gets the root node of a range.
 *
 * @param range - a range
 */
function range_root(range) {
    /**
     * The root of a live range is the root of its start node.
     */
    return TreeAlgorithm_1.tree_rootNode(range._startNode);
}
exports.range_root = range_root;
/**
 * Determines if a node is fully contained in a range.
 *
 * @param node - a node
 * @param range - a range
 */
function range_isContained(node, range) {
    /**
     * A node node is contained in a live range range if node’s root is range’s
     * root, and (node, 0) is after range’s start, and (node, node’s length) is
     * before range’s end.
     */
    return (TreeAlgorithm_1.tree_rootNode(node) === range_root(range) &&
        BoundaryPointAlgorithm_1.boundaryPoint_position([node, 0], range._start) === interfaces_1.BoundaryPosition.After &&
        BoundaryPointAlgorithm_1.boundaryPoint_position([node, TreeAlgorithm_1.tree_nodeLength(node)], range._end) === interfaces_1.BoundaryPosition.Before);
}
exports.range_isContained = range_isContained;
/**
 * Determines if a node is partially contained in a range.
 *
 * @param node - a node
 * @param range - a range
 */
function range_isPartiallyContained(node, range) {
    /**
     * A node is partially contained in a live range if it’s an inclusive
     * ancestor of the live range’s start node but not its end node,
     * or vice versa.
     */
    var startCheck = TreeAlgorithm_1.tree_isAncestorOf(range._startNode, node, true);
    var endCheck = TreeAlgorithm_1.tree_isAncestorOf(range._endNode, node, true);
    return (startCheck && !endCheck) || (!startCheck && endCheck);
}
exports.range_isPartiallyContained = range_isPartiallyContained;
/**
 * Sets the start boundary point of a range.
 *
 * @param range - a range
 * @param node - a node
 * @param offset - an offset into node
 */
function range_setTheStart(range, node, offset) {
    /**
     * 1. If node is a doctype, then throw an "InvalidNodeTypeError" DOMException.
     * 2. If offset is greater than node’s length, then throw an "IndexSizeError"
     * DOMException.
     * 3. Let bp be the boundary point (node, offset).
     * 4. If these steps were invoked as "set the start"
     * 4.1. If bp is after the range’s end, or if range’s root is not equal to
     * node’s root, set range’s end to bp.
     * 4.2. Set range’s start to bp.
     */
    if (util_1.Guard.isDocumentTypeNode(node)) {
        throw new DOMException_1.InvalidNodeTypeError();
    }
    if (offset > TreeAlgorithm_1.tree_nodeLength(node)) {
        throw new DOMException_1.IndexSizeError();
    }
    var bp = [node, offset];
    if (range_root(range) !== TreeAlgorithm_1.tree_rootNode(node) ||
        BoundaryPointAlgorithm_1.boundaryPoint_position(bp, range._end) === interfaces_1.BoundaryPosition.After) {
        range._end = bp;
    }
    range._start = bp;
}
exports.range_setTheStart = range_setTheStart;
/**
 * Sets the end boundary point of a range.
 *
 * @param range - a range
 * @param node - a node
 * @param offset - an offset into node
 */
function range_setTheEnd(range, node, offset) {
    /**
     * 1. If node is a doctype, then throw an "InvalidNodeTypeError" DOMException.
     * 2. If offset is greater than node’s length, then throw an "IndexSizeError"
     * DOMException.
     * 3. Let bp be the boundary point (node, offset).
     * 4. If these steps were invoked as "set the end"
     * 4.1. If bp is before the range’s start, or if range’s root is not equal
     * to node’s root, set range’s start to bp.
     * 4.2. Set range’s end to bp.
     */
    if (util_1.Guard.isDocumentTypeNode(node)) {
        throw new DOMException_1.InvalidNodeTypeError();
    }
    if (offset > TreeAlgorithm_1.tree_nodeLength(node)) {
        throw new DOMException_1.IndexSizeError();
    }
    var bp = [node, offset];
    if (range_root(range) !== TreeAlgorithm_1.tree_rootNode(node) ||
        BoundaryPointAlgorithm_1.boundaryPoint_position(bp, range._start) === interfaces_1.BoundaryPosition.Before) {
        range._start = bp;
    }
    range._end = bp;
}
exports.range_setTheEnd = range_setTheEnd;
/**
 * Selects a node.
 *
 * @param range - a range
 * @param node - a node
 */
function range_select(node, range) {
    /**
     * 1. Let parent be node’s parent.
     * 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
     */
    var parent = node._parent;
    if (parent === null)
        throw new DOMException_1.InvalidNodeTypeError();
    /**
     * 3. Let index be node’s index.
     * 4. Set range’s start to boundary point (parent, index).
     * 5. Set range’s end to boundary point (parent, index plus 1).
     */
    var index = TreeAlgorithm_1.tree_index(node);
    range._start = [parent, index];
    range._end = [parent, index + 1];
}
exports.range_select = range_select;
/**
 * EXtracts the contents of range as a document fragment.
 *
 * @param range - a range
 */
function range_extract(range) {
    var e_1, _a, e_2, _b, e_3, _c;
    /**
     * 1. Let fragment be a new DocumentFragment node whose node document is
     * range’s start node’s node document.
     * 2. If range is collapsed, then return fragment.
     */
    var fragment = CreateAlgorithm_1.create_documentFragment(range._startNode._nodeDocument);
    if (range_collapsed(range))
        return fragment;
    /**
     * 3. Let original start node, original start offset, original end node,
     * and original end offset be range’s start node, start offset, end node,
     * and end offset, respectively.
     */
    var originalStartNode = range._startNode;
    var originalStartOffset = range._startOffset;
    var originalEndNode = range._endNode;
    var originalEndOffset = range._endOffset;
    /**
     * 4. If original start node is original end node, and they are a Text,
     * ProcessingInstruction, or Comment node:
     * 4.1. Let clone be a clone of original start node.
     * 4.2. Set the data of clone to the result of substringing data with node
     * original start node, offset original start offset, and count original end
     * offset minus original start offset.
     * 4.3. Append clone to fragment.
     * 4.4. Replace data with node original start node, offset original start
     * offset, count original end offset minus original start offset, and data
     * the empty string.
     * 4.5. Return fragment.
     */
    if (originalStartNode === originalEndNode &&
        util_1.Guard.isCharacterDataNode(originalStartNode)) {
        var clone = NodeAlgorithm_1.node_clone(originalStartNode);
        clone._data = CharacterDataAlgorithm_1.characterData_substringData(originalStartNode, originalStartOffset, originalEndOffset - originalStartOffset);
        MutationAlgorithm_1.mutation_append(clone, fragment);
        CharacterDataAlgorithm_1.characterData_replaceData(originalStartNode, originalStartOffset, originalEndOffset - originalStartOffset, '');
        return fragment;
    }
    /**
     * 5. Let common ancestor be original start node.
     * 6. While common ancestor is not an inclusive ancestor of original end
     * node, set common ancestor to its own parent.
     */
    var commonAncestor = originalStartNode;
    while (!TreeAlgorithm_1.tree_isAncestorOf(originalEndNode, commonAncestor, true)) {
        if (commonAncestor._parent === null) {
            throw new Error("Parent node  is null.");
        }
        commonAncestor = commonAncestor._parent;
    }
    /**
     * 7. Let first partially contained child be null.
     * 8. If original start node is not an inclusive ancestor of original end
     * node, set first partially contained child to the first child of common
     * ancestor that is partially contained in range.
     */
    var firstPartiallyContainedChild = null;
    if (!TreeAlgorithm_1.tree_isAncestorOf(originalEndNode, originalStartNode, true)) {
        try {
            for (var _d = __values(commonAncestor._children), _e = _d.next(); !_e.done; _e = _d.next()) {
                var node = _e.value;
                if (range_isPartiallyContained(node, range)) {
                    firstPartiallyContainedChild = node;
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    /**
     * 9. Let last partially contained child be null.
     * 10. If original end node is not an inclusive ancestor of original start
     * node, set last partially contained child to the last child of common
     * ancestor that is partially contained in range.
     */
    var lastPartiallyContainedChild = null;
    if (!TreeAlgorithm_1.tree_isAncestorOf(originalStartNode, originalEndNode, true)) {
        var children = __spread(commonAncestor._children);
        for (var i = children.length - 1; i > 0; i--) {
            var node = children[i];
            if (range_isPartiallyContained(node, range)) {
                lastPartiallyContainedChild = node;
                break;
            }
        }
    }
    /**
     * 11. Let contained children be a list of all children of common ancestor
     * that are contained in range, in tree order.
     * 12. If any member of contained children is a doctype, then throw a
     * "HierarchyRequestError" DOMException.
     */
    var containedChildren = [];
    try {
        for (var _f = __values(commonAncestor._children), _g = _f.next(); !_g.done; _g = _f.next()) {
            var child = _g.value;
            if (range_isContained(child, range)) {
                if (util_1.Guard.isDocumentTypeNode(child)) {
                    throw new DOMException_1.HierarchyRequestError();
                }
                containedChildren.push(child);
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
        }
        finally { if (e_2) throw e_2.error; }
    }
    var newNode;
    var newOffset;
    if (TreeAlgorithm_1.tree_isAncestorOf(originalEndNode, originalStartNode, true)) {
        /**
         * 13. If original start node is an inclusive ancestor of original end node,
         * set new node to original start node and new offset to original start
         * offset.
         */
        newNode = originalStartNode;
        newOffset = originalStartOffset;
    }
    else {
        /**
         * 14. Otherwise:
         * 14.1. Let reference node equal original start node.
         * 14.2. While reference node’s parent is not null and is not an inclusive
         * ancestor of original end node, set reference node to its parent.
         * 14.3. Set new node to the parent of reference node, and new offset to
         * one plus reference node’s index.
         */
        var referenceNode = originalStartNode;
        while (referenceNode._parent !== null &&
            !TreeAlgorithm_1.tree_isAncestorOf(originalEndNode, referenceNode._parent)) {
            referenceNode = referenceNode._parent;
        }
        /* istanbul ignore next */
        if (referenceNode._parent === null) {
            /**
             * If reference node’s parent is null, it would be the root of range,
             * so would be an inclusive ancestor of original end node, and we could
             * not reach this point.
             */
            throw new Error("Parent node is null.");
        }
        newNode = referenceNode._parent;
        newOffset = 1 + TreeAlgorithm_1.tree_index(referenceNode);
    }
    if (util_1.Guard.isCharacterDataNode(firstPartiallyContainedChild)) {
        /**
         * 15. If first partially contained child is a Text, ProcessingInstruction,
         * or Comment node:
         * 15.1. Let clone be a clone of original start node.
         * 15.2. Set the data of clone to the result of substringing data with
         * node original start node, offset original start offset, and count
         * original start node’s length minus original start offset.
         * 15.3. Append clone to fragment.
         * 15.4. Replace data with node original start node, offset original
         * start offset, count original start node’s length minus original start
         * offset, and data the empty string.
         */
        var clone = NodeAlgorithm_1.node_clone(originalStartNode);
        clone._data = CharacterDataAlgorithm_1.characterData_substringData(originalStartNode, originalStartOffset, TreeAlgorithm_1.tree_nodeLength(originalStartNode) - originalStartOffset);
        MutationAlgorithm_1.mutation_append(clone, fragment);
        CharacterDataAlgorithm_1.characterData_replaceData(originalStartNode, originalStartOffset, TreeAlgorithm_1.tree_nodeLength(originalStartNode) - originalStartOffset, '');
    }
    else if (firstPartiallyContainedChild !== null) {
        /**
         * 16. Otherwise, if first partially contained child is not null:
         * 16.1. Let clone be a clone of first partially contained child.
         * 16.2. Append clone to fragment.
         * 16.3. Let subrange be a new live range whose start is (original start
         * node, original start offset) and whose end is (first partially
         * contained child, first partially contained child’s length).
         * 16.4. Let subfragment be the result of extracting subrange.
         * 16.5. Append subfragment to clone.
         */
        var clone = NodeAlgorithm_1.node_clone(firstPartiallyContainedChild);
        MutationAlgorithm_1.mutation_append(clone, fragment);
        var subrange = CreateAlgorithm_1.create_range([originalStartNode, originalStartOffset], [firstPartiallyContainedChild, TreeAlgorithm_1.tree_nodeLength(firstPartiallyContainedChild)]);
        var subfragment = range_extract(subrange);
        MutationAlgorithm_1.mutation_append(subfragment, clone);
    }
    try {
        /**
         * 17. For each contained child in contained children, append contained
         * child to fragment.
         */
        for (var containedChildren_1 = __values(containedChildren), containedChildren_1_1 = containedChildren_1.next(); !containedChildren_1_1.done; containedChildren_1_1 = containedChildren_1.next()) {
            var child = containedChildren_1_1.value;
            MutationAlgorithm_1.mutation_append(child, fragment);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (containedChildren_1_1 && !containedChildren_1_1.done && (_c = containedChildren_1.return)) _c.call(containedChildren_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    if (util_1.Guard.isCharacterDataNode(lastPartiallyContainedChild)) {
        /**
         * 18. If last partially contained child is a Text, ProcessingInstruction,
         * or Comment node:
         * 18.1. Let clone be a clone of original end node.
         * 18.2. Set the data of clone to the result of substringing data with
         * node original end node, offset 0, and count original end offset.
         * 18.3. Append clone to fragment.
         * 18.4. Replace data with node original end node, offset 0, count
         * original end offset, and data the empty string.
         */
        var clone = NodeAlgorithm_1.node_clone(originalEndNode);
        clone._data = CharacterDataAlgorithm_1.characterData_substringData(originalEndNode, 0, originalEndOffset);
        MutationAlgorithm_1.mutation_append(clone, fragment);
        CharacterDataAlgorithm_1.characterData_replaceData(originalEndNode, 0, originalEndOffset, '');
    }
    else if (lastPartiallyContainedChild !== null) {
        /**
         * 19. Otherwise, if last partially contained child is not null:
         * 19.1. Let clone be a clone of last partially contained child.
         * 19.2. Append clone to fragment.
         * 19.3. Let subrange be a new live range whose start is (last partially
         * contained child, 0) and whose end is (original end node, original
         * end offset).
         * 19.4. Let subfragment be the result of extracting subrange.
         * 19.5. Append subfragment to clone.
         */
        var clone = NodeAlgorithm_1.node_clone(lastPartiallyContainedChild);
        MutationAlgorithm_1.mutation_append(clone, fragment);
        var subrange = CreateAlgorithm_1.create_range([lastPartiallyContainedChild, 0], [originalEndNode, originalEndOffset]);
        var subfragment = range_extract(subrange);
        MutationAlgorithm_1.mutation_append(subfragment, clone);
    }
    /**
     * 20. Set range’s start and end to (new node, new offset).
     */
    range._start = [newNode, newOffset];
    range._end = [newNode, newOffset];
    /**
     * 21. Return fragment.
     */
    return fragment;
}
exports.range_extract = range_extract;
/**
 * Clones the contents of range as a document fragment.
 *
 * @param range - a range
 */
function range_cloneTheContents(range) {
    var e_4, _a, e_5, _b, e_6, _c;
    /**
     * 1. Let fragment be a new DocumentFragment node whose node document
     * is range’s start node’s node document.
     * 2. If range is collapsed, then return fragment.
     */
    var fragment = CreateAlgorithm_1.create_documentFragment(range._startNode._nodeDocument);
    if (range_collapsed(range))
        return fragment;
    /**
     * 3. Let original start node, original start offset, original end node,
     * and original end offset be range’s start node, start offset, end node,
     * and end offset, respectively.
     * 4. If original start node is original end node, and they are a Text,
     * ProcessingInstruction, or Comment node:
     * 4.1. Let clone be a clone of original start node.
     * 4.2. Set the data of clone to the result of substringing data with node
     * original start node, offset original start offset, and count original end
     * offset minus original start offset.
     * 4.3. Append clone to fragment.
     * 4.5. Return fragment.
     */
    var originalStartNode = range._startNode;
    var originalStartOffset = range._startOffset;
    var originalEndNode = range._endNode;
    var originalEndOffset = range._endOffset;
    if (originalStartNode === originalEndNode &&
        util_1.Guard.isCharacterDataNode(originalStartNode)) {
        var clone = NodeAlgorithm_1.node_clone(originalStartNode);
        clone._data = CharacterDataAlgorithm_1.characterData_substringData(originalStartNode, originalStartOffset, originalEndOffset - originalStartOffset);
        MutationAlgorithm_1.mutation_append(clone, fragment);
    }
    /**
     * 5. Let common ancestor be original start node.
     * 6. While common ancestor is not an inclusive ancestor of original end
     * node, set common ancestor to its own parent.
     */
    var commonAncestor = originalStartNode;
    while (!TreeAlgorithm_1.tree_isAncestorOf(originalEndNode, commonAncestor, true)) {
        if (commonAncestor._parent === null) {
            throw new Error("Parent node  is null.");
        }
        commonAncestor = commonAncestor._parent;
    }
    /**
     * 7. Let first partially contained child be null.
     * 8. If original start node is not an inclusive ancestor of original end
     * node, set first partially contained child to the first child of common
     * ancestor that is partially contained in range.
     */
    var firstPartiallyContainedChild = null;
    if (!TreeAlgorithm_1.tree_isAncestorOf(originalEndNode, originalStartNode, true)) {
        try {
            for (var _d = __values(commonAncestor._children), _e = _d.next(); !_e.done; _e = _d.next()) {
                var node = _e.value;
                if (range_isPartiallyContained(node, range)) {
                    firstPartiallyContainedChild = node;
                    break;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_4) throw e_4.error; }
        }
    }
    /**
     * 9. Let last partially contained child be null.
     * 10. If original end node is not an inclusive ancestor of original start
     * node, set last partially contained child to the last child of common
     * ancestor that is partially contained in range.
     */
    var lastPartiallyContainedChild = null;
    if (!TreeAlgorithm_1.tree_isAncestorOf(originalStartNode, originalEndNode, true)) {
        var children = __spread(commonAncestor._children);
        for (var i = children.length - 1; i > 0; i--) {
            var node = children[i];
            if (range_isPartiallyContained(node, range)) {
                lastPartiallyContainedChild = node;
                break;
            }
        }
    }
    /**
     * 11. Let contained children be a list of all children of common ancestor
     * that are contained in range, in tree order.
     * 12. If any member of contained children is a doctype, then throw a
     * "HierarchyRequestError" DOMException.
     */
    var containedChildren = [];
    try {
        for (var _f = __values(commonAncestor._children), _g = _f.next(); !_g.done; _g = _f.next()) {
            var child = _g.value;
            if (range_isContained(child, range)) {
                if (util_1.Guard.isDocumentTypeNode(child)) {
                    throw new DOMException_1.HierarchyRequestError();
                }
                containedChildren.push(child);
            }
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
        }
        finally { if (e_5) throw e_5.error; }
    }
    if (util_1.Guard.isCharacterDataNode(firstPartiallyContainedChild)) {
        /**
         * 13. If first partially contained child is a Text, ProcessingInstruction,
         * or Comment node:
         * 13.1. Let clone be a clone of original start node.
         * 13.2. Set the data of clone to the result of substringing data with
         * node original start node, offset original start offset, and count
         * original start node’s length minus original start offset.
         * 13.3. Append clone to fragment.
         */
        var clone = NodeAlgorithm_1.node_clone(originalStartNode);
        clone._data = CharacterDataAlgorithm_1.characterData_substringData(originalStartNode, originalStartOffset, TreeAlgorithm_1.tree_nodeLength(originalStartNode) - originalStartOffset);
        MutationAlgorithm_1.mutation_append(clone, fragment);
    }
    else if (firstPartiallyContainedChild !== null) {
        /**
         * 14. Otherwise, if first partially contained child is not null:
         * 14.1. Let clone be a clone of first partially contained child.
         * 14.2. Append clone to fragment.
         * 14.3. Let subrange be a new live range whose start is (original start
         * node, original start offset) and whose end is (first partially
         * contained child, first partially contained child’s length).
         * 14.4. Let subfragment be the result of cloning the contents of
         * subrange.
         * 14.5. Append subfragment to clone.
         */
        var clone = NodeAlgorithm_1.node_clone(firstPartiallyContainedChild);
        MutationAlgorithm_1.mutation_append(clone, fragment);
        var subrange = CreateAlgorithm_1.create_range([originalStartNode, originalStartOffset], [firstPartiallyContainedChild, TreeAlgorithm_1.tree_nodeLength(firstPartiallyContainedChild)]);
        var subfragment = range_cloneTheContents(subrange);
        MutationAlgorithm_1.mutation_append(subfragment, clone);
    }
    try {
        /**
         * 15. For each contained child in contained children, append contained
         * child to fragment.
         * 15.1. Let clone be a clone of contained child with the clone children
         * flag set.
         * 15.2. Append clone to fragment.
         */
        for (var containedChildren_2 = __values(containedChildren), containedChildren_2_1 = containedChildren_2.next(); !containedChildren_2_1.done; containedChildren_2_1 = containedChildren_2.next()) {
            var child = containedChildren_2_1.value;
            var clone = NodeAlgorithm_1.node_clone(child);
            MutationAlgorithm_1.mutation_append(clone, fragment);
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (containedChildren_2_1 && !containedChildren_2_1.done && (_c = containedChildren_2.return)) _c.call(containedChildren_2);
        }
        finally { if (e_6) throw e_6.error; }
    }
    if (util_1.Guard.isCharacterDataNode(lastPartiallyContainedChild)) {
        /**
         * 16. If last partially contained child is a Text, ProcessingInstruction,
         * or Comment node:
         * 16.1. Let clone be a clone of original end node.
         * 16.2. Set the data of clone to the result of substringing data with
         * node original end node, offset 0, and count original end offset.
         * 16.3. Append clone to fragment.
         */
        var clone = NodeAlgorithm_1.node_clone(originalEndNode);
        clone._data = CharacterDataAlgorithm_1.characterData_substringData(originalEndNode, 0, originalEndOffset);
        MutationAlgorithm_1.mutation_append(clone, fragment);
    }
    else if (lastPartiallyContainedChild !== null) {
        /**
         * 17. Otherwise, if last partially contained child is not null:
         * 17.1. Let clone be a clone of last partially contained child.
         * 17.2. Append clone to fragment.
         * 17.3. Let subrange be a new live range whose start is (last partially
         * contained child, 0) and whose end is (original end node, original
         * end offset).
         * 17.4. Let subfragment be the result of cloning the contents of subrange.
         * 17.5. Append subfragment to clone.
         */
        var clone = NodeAlgorithm_1.node_clone(lastPartiallyContainedChild);
        fragment.append(clone);
        var subrange = CreateAlgorithm_1.create_range([lastPartiallyContainedChild, 0], [originalEndNode, originalEndOffset]);
        var subfragment = range_extract(subrange);
        MutationAlgorithm_1.mutation_append(subfragment, clone);
    }
    /**
     * 18. Return fragment.
     */
    return fragment;
}
exports.range_cloneTheContents = range_cloneTheContents;
/**
 * Inserts a node into a range at the start boundary point.
 *
 * @param node - node to insert
 * @param range - a range
 */
function range_insert(node, range) {
    var e_7, _a;
    /**
     * 1. If range’s start node is a ProcessingInstruction or Comment node, is a
     * Text node whose parent is null, or is node, then throw a
     * "HierarchyRequestError" DOMException.
     */
    if (util_1.Guard.isProcessingInstructionNode(range._startNode) ||
        util_1.Guard.isCommentNode(range._startNode) ||
        (util_1.Guard.isTextNode(range._startNode) && range._startNode._parent === null) ||
        range._startNode === node) {
        throw new DOMException_1.HierarchyRequestError();
    }
    /**
     * 2. Let referenceNode be null.
     * 3. If range’s start node is a Text node, set referenceNode to that Text
     * node.
     * 4. Otherwise, set referenceNode to the child of start node whose index is
     * start offset, and null if there is no such child.
     */
    var referenceNode = null;
    if (util_1.Guard.isTextNode(range._startNode)) {
        referenceNode = range._startNode;
    }
    else {
        var index = 0;
        try {
            for (var _b = __values(range._startNode._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                if (index === range._startOffset) {
                    referenceNode = child;
                    break;
                }
                index++;
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
    }
    /**
     * 5. Let parent be range’s start node if referenceNode is null, and
     * referenceNode’s parent otherwise.
     */
    var parent;
    if (referenceNode === null) {
        parent = range._startNode;
    }
    else {
        if (referenceNode._parent === null) {
            throw new Error("Parent node is null.");
        }
        parent = referenceNode._parent;
    }
    /**
     * 6. Ensure pre-insertion validity of node into parent before referenceNode.
     */
    MutationAlgorithm_1.mutation_ensurePreInsertionValidity(node, parent, referenceNode);
    /**
     * 7. If range’s start node is a Text node, set referenceNode to the result
     * of splitting it with offset range’s start offset.
     */
    if (util_1.Guard.isTextNode(range._startNode)) {
        referenceNode = TextAlgorithm_1.text_split(range._startNode, range._startOffset);
    }
    /**
     * 8. If node is referenceNode, set referenceNode to its next sibling.
     */
    if (node === referenceNode) {
        referenceNode = node._nextSibling;
    }
    /**
     * 9. If node’s parent is not null, remove node from its parent.
     */
    if (node._parent !== null) {
        MutationAlgorithm_1.mutation_remove(node, node._parent);
    }
    /**
     * 10. Let newOffset be parent’s length if referenceNode is null, and
     * referenceNode’s index otherwise.
     */
    var newOffset = (referenceNode === null ?
        TreeAlgorithm_1.tree_nodeLength(parent) : TreeAlgorithm_1.tree_index(referenceNode));
    /**
     * 11. Increase newOffset by node’s length if node is a DocumentFragment
     * node, and one otherwise.
     */
    if (util_1.Guard.isDocumentFragmentNode(node)) {
        newOffset += TreeAlgorithm_1.tree_nodeLength(node);
    }
    else {
        newOffset++;
    }
    /**
     * 12. Pre-insert node into parent before referenceNode.
     */
    MutationAlgorithm_1.mutation_preInsert(node, parent, referenceNode);
    /**
     * 13. If range is collapsed, then set range’s end to (parent, newOffset).
     */
    if (range_collapsed(range)) {
        range._end = [parent, newOffset];
    }
}
exports.range_insert = range_insert;
/**
 * Traverses through all contained nodes of a range.
 *
 * @param range - a range
 */
function range_getContainedNodes(range) {
    var _a;
    return _a = {},
        _a[Symbol.iterator] = function () {
            var container = range.commonAncestorContainer;
            var currentNode = TreeAlgorithm_1.tree_getFirstDescendantNode(container);
            return {
                next: function () {
                    while (currentNode && !range_isContained(currentNode, range)) {
                        currentNode = TreeAlgorithm_1.tree_getNextDescendantNode(container, currentNode);
                    }
                    if (currentNode === null) {
                        return { done: true, value: null };
                    }
                    else {
                        var result = { done: false, value: currentNode };
                        currentNode = TreeAlgorithm_1.tree_getNextDescendantNode(container, currentNode);
                        return result;
                    }
                }
            };
        },
        _a;
}
exports.range_getContainedNodes = range_getContainedNodes;
/**
 * Traverses through all partially contained nodes of a range.
 *
 * @param range - a range
 */
function range_getPartiallyContainedNodes(range) {
    var _a;
    return _a = {},
        _a[Symbol.iterator] = function () {
            var container = range.commonAncestorContainer;
            var currentNode = TreeAlgorithm_1.tree_getFirstDescendantNode(container);
            return {
                next: function () {
                    while (currentNode && !range_isPartiallyContained(currentNode, range)) {
                        currentNode = TreeAlgorithm_1.tree_getNextDescendantNode(container, currentNode);
                    }
                    if (currentNode === null) {
                        return { done: true, value: null };
                    }
                    else {
                        var result = { done: false, value: currentNode };
                        currentNode = TreeAlgorithm_1.tree_getNextDescendantNode(container, currentNode);
                        return result;
                    }
                }
            };
        },
        _a;
}
exports.range_getPartiallyContainedNodes = range_getPartiallyContainedNodes;
//# sourceMappingURL=RangeAlgorithm.js.map