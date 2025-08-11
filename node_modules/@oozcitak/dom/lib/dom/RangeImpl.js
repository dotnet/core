"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var DOMImpl_1 = require("./DOMImpl");
var interfaces_1 = require("./interfaces");
var AbstractRangeImpl_1 = require("./AbstractRangeImpl");
var DOMException_1 = require("./DOMException");
var algorithm_1 = require("../algorithm");
var WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
var util_1 = require("../util");
/**
 * Represents a live range.
 */
var RangeImpl = /** @class */ (function (_super) {
    __extends(RangeImpl, _super);
    /**
     * Initializes a new instance of `Range`.
     */
    function RangeImpl() {
        var _this = _super.call(this) || this;
        /**
         * The Range() constructor, when invoked, must return a new live range with
         * (current global object’s associated Document, 0) as its start and end.
         */
        var doc = DOMImpl_1.dom.window._associatedDocument;
        _this._start = [doc, 0];
        _this._end = [doc, 0];
        DOMImpl_1.dom.rangeList.add(_this);
        return _this;
    }
    Object.defineProperty(RangeImpl.prototype, "commonAncestorContainer", {
        /** @inheritdoc */
        get: function () {
            /**
             * 1. Let container be start node.
             * 2. While container is not an inclusive ancestor of end node, let
             * container be container’s parent.
             * 3. Return container.
             */
            var container = this._start[0];
            while (!algorithm_1.tree_isAncestorOf(this._end[0], container, true)) {
                if (container._parent === null) {
                    throw new Error("Parent node  is null.");
                }
                container = container._parent;
            }
            return container;
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    RangeImpl.prototype.setStart = function (node, offset) {
        /**
         * The setStart(node, offset) method, when invoked, must set the start of
         * context object to boundary point (node, offset).
         */
        algorithm_1.range_setTheStart(this, node, offset);
    };
    /** @inheritdoc */
    RangeImpl.prototype.setEnd = function (node, offset) {
        /**
         * The setEnd(node, offset) method, when invoked, must set the end of
         * context object to boundary point (node, offset).
         */
        algorithm_1.range_setTheEnd(this, node, offset);
    };
    /** @inheritdoc */
    RangeImpl.prototype.setStartBefore = function (node) {
        /**
         * 1. Let parent be node’s parent.
         * 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
         * 3. Set the start of the context object to boundary point
         * (parent, node’s index).
         */
        var parent = node._parent;
        if (parent === null)
            throw new DOMException_1.InvalidNodeTypeError();
        algorithm_1.range_setTheStart(this, parent, algorithm_1.tree_index(node));
    };
    /** @inheritdoc */
    RangeImpl.prototype.setStartAfter = function (node) {
        /**
         * 1. Let parent be node’s parent.
         * 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
         * 3. Set the start of the context object to boundary point
         * (parent, node’s index plus 1).
         */
        var parent = node._parent;
        if (parent === null)
            throw new DOMException_1.InvalidNodeTypeError();
        algorithm_1.range_setTheStart(this, parent, algorithm_1.tree_index(node) + 1);
    };
    /** @inheritdoc */
    RangeImpl.prototype.setEndBefore = function (node) {
        /**
         * 1. Let parent be node’s parent.
         * 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
         * 3. Set the end of the context object to boundary point
         * (parent, node’s index).
         */
        var parent = node._parent;
        if (parent === null)
            throw new DOMException_1.InvalidNodeTypeError();
        algorithm_1.range_setTheEnd(this, parent, algorithm_1.tree_index(node));
    };
    /** @inheritdoc */
    RangeImpl.prototype.setEndAfter = function (node) {
        /**
         * 1. Let parent be node’s parent.
         * 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
         * 3. Set the end of the context object to boundary point
         * (parent, node’s index plus 1).
         */
        var parent = node._parent;
        if (parent === null)
            throw new DOMException_1.InvalidNodeTypeError();
        algorithm_1.range_setTheEnd(this, parent, algorithm_1.tree_index(node) + 1);
    };
    /** @inheritdoc */
    RangeImpl.prototype.collapse = function (toStart) {
        /**
         * The collapse(toStart) method, when invoked, must if toStart is true,
         * set end to start, and set start to end otherwise.
         */
        if (toStart) {
            this._end = this._start;
        }
        else {
            this._start = this._end;
        }
    };
    /** @inheritdoc */
    RangeImpl.prototype.selectNode = function (node) {
        /**
         * The selectNode(node) method, when invoked, must select node within
         * context object.
         */
        algorithm_1.range_select(node, this);
    };
    /** @inheritdoc */
    RangeImpl.prototype.selectNodeContents = function (node) {
        /**
         * 1. If node is a doctype, throw an "InvalidNodeTypeError" DOMException.
         * 2. Let length be the length of node.
         * 3. Set start to the boundary point (node, 0).
         * 4. Set end to the boundary point (node, length).
         */
        if (util_1.Guard.isDocumentTypeNode(node))
            throw new DOMException_1.InvalidNodeTypeError();
        var length = algorithm_1.tree_nodeLength(node);
        this._start = [node, 0];
        this._end = [node, length];
    };
    /** @inheritdoc */
    RangeImpl.prototype.compareBoundaryPoints = function (how, sourceRange) {
        /**
         * 1. If how is not one of
         * - START_TO_START,
         * - START_TO_END,
         * - END_TO_END, and
         * - END_TO_START,
         * then throw a "NotSupportedError" DOMException.
         */
        if (how !== interfaces_1.HowToCompare.StartToStart && how !== interfaces_1.HowToCompare.StartToEnd &&
            how !== interfaces_1.HowToCompare.EndToEnd && how !== interfaces_1.HowToCompare.EndToStart)
            throw new DOMException_1.NotSupportedError();
        /**
         * 2. If context object’s root is not the same as sourceRange’s root,
         * then throw a "WrongDocumentError" DOMException.
         */
        if (algorithm_1.range_root(this) !== algorithm_1.range_root(sourceRange))
            throw new DOMException_1.WrongDocumentError();
        /**
         * 3. If how is:
         * - START_TO_START:
         * Let this point be the context object’s start. Let other point be
         * sourceRange’s start.
         * - START_TO_END:
         * Let this point be the context object’s end. Let other point be
         * sourceRange’s start.
         * - END_TO_END:
         * Let this point be the context object’s end. Let other point be
         * sourceRange’s end.
         * - END_TO_START:
         * Let this point be the context object’s start. Let other point be
         * sourceRange’s end.
         */
        var thisPoint;
        var otherPoint;
        switch (how) {
            case interfaces_1.HowToCompare.StartToStart:
                thisPoint = this._start;
                otherPoint = sourceRange._start;
                break;
            case interfaces_1.HowToCompare.StartToEnd:
                thisPoint = this._end;
                otherPoint = sourceRange._start;
                break;
            case interfaces_1.HowToCompare.EndToEnd:
                thisPoint = this._end;
                otherPoint = sourceRange._end;
                break;
            case interfaces_1.HowToCompare.EndToStart:
                thisPoint = this._start;
                otherPoint = sourceRange._end;
                break;
            /* istanbul ignore next */
            default:
                throw new DOMException_1.NotSupportedError();
        }
        /**
         * 4. If the position of this point relative to other point is
         * - before
         * Return −1.
         * - equal
         * Return 0.
         * - after
         * Return 1.
         */
        var position = algorithm_1.boundaryPoint_position(thisPoint, otherPoint);
        if (position === interfaces_1.BoundaryPosition.Before) {
            return -1;
        }
        else if (position === interfaces_1.BoundaryPosition.After) {
            return 1;
        }
        else {
            return 0;
        }
    };
    /** @inheritdoc */
    RangeImpl.prototype.deleteContents = function () {
        var e_1, _a, e_2, _b;
        /**
         * 1. If the context object is collapsed, then return.
         * 2. Let original start node, original start offset, original end node,
         * and original end offset be the context object’s start node,
         * start offset, end node, and end offset, respectively.
         */
        if (algorithm_1.range_collapsed(this))
            return;
        var originalStartNode = this._startNode;
        var originalStartOffset = this._startOffset;
        var originalEndNode = this._endNode;
        var originalEndOffset = this._endOffset;
        /**
         * 3. If original start node and original end node are the same, and they
         * are a Text, ProcessingInstruction, or Comment node, replace data with
         * node original start node, offset original start offset, count original
         * end offset minus original start offset, and data the empty string,
         * and then return.
         */
        if (originalStartNode === originalEndNode &&
            util_1.Guard.isCharacterDataNode(originalStartNode)) {
            algorithm_1.characterData_replaceData(originalStartNode, originalStartOffset, originalEndOffset - originalStartOffset, '');
            return;
        }
        /**
         * 4. Let nodes to remove be a list of all the nodes that are contained in
         * the context object, in tree order, omitting any node whose parent is also
         * contained in the context object.
         */
        var nodesToRemove = [];
        try {
            for (var _c = __values(algorithm_1.range_getContainedNodes(this)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var node = _d.value;
                var parent = node._parent;
                if (parent !== null && algorithm_1.range_isContained(parent, this)) {
                    continue;
                }
                nodesToRemove.push(node);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var newNode;
        var newOffset;
        if (algorithm_1.tree_isAncestorOf(originalEndNode, originalStartNode, true)) {
            /**
             * 5. If original start node is an inclusive ancestor of original end
             * node, set new node to original start node and new offset to original
             * start offset.
             */
            newNode = originalStartNode;
            newOffset = originalStartOffset;
        }
        else {
            /**
             * 6. Otherwise:
             * 6.1. Let reference node equal original start node.
             * 6.2. While reference node’s parent is not null and is not an inclusive
             * ancestor of original end node, set reference node to its parent.
             * 6.3. Set new node to the parent of reference node, and new offset to
             * one plus the index of reference node.
             */
            var referenceNode = originalStartNode;
            while (referenceNode._parent !== null &&
                !algorithm_1.tree_isAncestorOf(originalEndNode, referenceNode._parent, true)) {
                referenceNode = referenceNode._parent;
            }
            /* istanbul ignore next */
            if (referenceNode._parent === null) {
                throw new Error("Parent node is null.");
            }
            newNode = referenceNode._parent;
            newOffset = algorithm_1.tree_index(referenceNode) + 1;
        }
        /**
         * 7. If original start node is a Text, ProcessingInstruction, or Comment
         * node, replace data with node original start node, offset original start
         * offset, count original start node’s length minus original start offset,
         * data the empty string.
         */
        if (util_1.Guard.isCharacterDataNode(originalStartNode)) {
            algorithm_1.characterData_replaceData(originalStartNode, originalStartOffset, algorithm_1.tree_nodeLength(originalStartNode) - originalStartOffset, '');
        }
        try {
            /**
             * 8. For each node in nodes to remove, in tree order, remove node from its
             * parent.
             */
            for (var nodesToRemove_1 = __values(nodesToRemove), nodesToRemove_1_1 = nodesToRemove_1.next(); !nodesToRemove_1_1.done; nodesToRemove_1_1 = nodesToRemove_1.next()) {
                var node = nodesToRemove_1_1.value;
                /* istanbul ignore else */
                if (node._parent) {
                    algorithm_1.mutation_remove(node, node._parent);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (nodesToRemove_1_1 && !nodesToRemove_1_1.done && (_b = nodesToRemove_1.return)) _b.call(nodesToRemove_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        /**
         * 9. If original end node is a Text, ProcessingInstruction, or Comment
         * node, replace data with node original end node, offset 0, count original
         * end offset and data the empty string.
         */
        if (util_1.Guard.isCharacterDataNode(originalEndNode)) {
            algorithm_1.characterData_replaceData(originalEndNode, 0, originalEndOffset, '');
        }
        /**
         * 10. Set start and end to (new node, new offset).
         */
        this._start = [newNode, newOffset];
        this._end = [newNode, newOffset];
    };
    /** @inheritdoc */
    RangeImpl.prototype.extractContents = function () {
        /**
         * The extractContents() method, when invoked, must return the result of
         * extracting the context object.
         */
        return algorithm_1.range_extract(this);
    };
    /** @inheritdoc */
    RangeImpl.prototype.cloneContents = function () {
        /**
         * The cloneContents() method, when invoked, must return the result of
         * cloning the contents of the context object.
         */
        return algorithm_1.range_cloneTheContents(this);
    };
    /** @inheritdoc */
    RangeImpl.prototype.insertNode = function (node) {
        /**
         * The insertNode(node) method, when invoked, must insert node into the
         * context object.
         */
        return algorithm_1.range_insert(node, this);
    };
    /** @inheritdoc */
    RangeImpl.prototype.surroundContents = function (newParent) {
        var e_3, _a;
        try {
            /**
             * 1. If a non-Text node is partially contained in the context object, then
             * throw an "InvalidStateError" DOMException.
             */
            for (var _b = __values(algorithm_1.range_getPartiallyContainedNodes(this)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var node = _c.value;
                if (!util_1.Guard.isTextNode(node)) {
                    throw new DOMException_1.InvalidStateError();
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        /**
         * 2. If newParent is a Document, DocumentType, or DocumentFragment node,
         * then throw an "InvalidNodeTypeError" DOMException.
         */
        if (util_1.Guard.isDocumentNode(newParent) ||
            util_1.Guard.isDocumentTypeNode(newParent) ||
            util_1.Guard.isDocumentFragmentNode(newParent)) {
            throw new DOMException_1.InvalidNodeTypeError();
        }
        /**
         * 3. Let fragment be the result of extracting the context object.
         */
        var fragment = algorithm_1.range_extract(this);
        /**
         * 4. If newParent has children, then replace all with null within newParent.
         */
        if ((newParent)._children.size !== 0) {
            algorithm_1.mutation_replaceAll(null, newParent);
        }
        /**
         * 5. Insert newParent into the context object.
         * 6. Append fragment to newParent.
         */
        algorithm_1.range_insert(newParent, this);
        algorithm_1.mutation_append(fragment, newParent);
        /**
         * 7. Select newParent within the context object.
         */
        algorithm_1.range_select(newParent, this);
    };
    /** @inheritdoc */
    RangeImpl.prototype.cloneRange = function () {
        /**
         * The cloneRange() method, when invoked, must return a new live range with
         * the same start and end as the context object.
         */
        return algorithm_1.create_range(this._start, this._end);
    };
    /** @inheritdoc */
    RangeImpl.prototype.detach = function () {
        /**
         * The detach() method, when invoked, must do nothing.
         *
         * since JS lacks weak references, we still use detach
         */
        DOMImpl_1.dom.rangeList.delete(this);
    };
    /** @inheritdoc */
    RangeImpl.prototype.isPointInRange = function (node, offset) {
        /**
         * 1. If node’s root is different from the context object’s root, return false.
         */
        if (algorithm_1.tree_rootNode(node) !== algorithm_1.range_root(this)) {
            return false;
        }
        /**
         * 2. If node is a doctype, then throw an "InvalidNodeTypeError" DOMException.
         * 3. If offset is greater than node’s length, then throw an
         * "IndexSizeError" DOMException.
         */
        if (util_1.Guard.isDocumentTypeNode(node))
            throw new DOMException_1.InvalidNodeTypeError();
        if (offset > algorithm_1.tree_nodeLength(node))
            throw new DOMException_1.IndexSizeError();
        /**
         * 4. If (node, offset) is before start or after end, return false.
         */
        var bp = [node, offset];
        if (algorithm_1.boundaryPoint_position(bp, this._start) === interfaces_1.BoundaryPosition.Before ||
            algorithm_1.boundaryPoint_position(bp, this._end) === interfaces_1.BoundaryPosition.After) {
            return false;
        }
        /**
         * 5. Return true.
         */
        return true;
    };
    /** @inheritdoc */
    RangeImpl.prototype.comparePoint = function (node, offset) {
        /**
         * 1. If node’s root is different from the context object’s root, then throw
         * a "WrongDocumentError" DOMException.
         * 2. If node is a doctype, then throw an "InvalidNodeTypeError" DOMException.
         * 3. If offset is greater than node’s length, then throw an
         * "IndexSizeError" DOMException.
         */
        if (algorithm_1.tree_rootNode(node) !== algorithm_1.range_root(this))
            throw new DOMException_1.WrongDocumentError();
        if (util_1.Guard.isDocumentTypeNode(node))
            throw new DOMException_1.InvalidNodeTypeError();
        if (offset > algorithm_1.tree_nodeLength(node))
            throw new DOMException_1.IndexSizeError();
        /**
         * 4. If (node, offset) is before start, return −1.
         * 5. If (node, offset) is after end, return 1.
         * 6. Return 0.
         */
        var bp = [node, offset];
        if (algorithm_1.boundaryPoint_position(bp, this._start) === interfaces_1.BoundaryPosition.Before) {
            return -1;
        }
        else if (algorithm_1.boundaryPoint_position(bp, this._end) === interfaces_1.BoundaryPosition.After) {
            return 1;
        }
        else {
            return 0;
        }
    };
    /** @inheritdoc */
    RangeImpl.prototype.intersectsNode = function (node) {
        /**
         * 1. If node’s root is different from the context object’s root, return false.
         */
        if (algorithm_1.tree_rootNode(node) !== algorithm_1.range_root(this)) {
            return false;
        }
        /**
         * 2. Let parent be node’s parent.
         * 3. If parent is null, return true.
         */
        var parent = node._parent;
        if (parent === null)
            return true;
        /**
         * 4. Let offset be node’s index.
         */
        var offset = algorithm_1.tree_index(node);
        /**
         * 5. If (parent, offset) is before end and (parent, offset plus 1) is
         * after start, return true.
         */
        if (algorithm_1.boundaryPoint_position([parent, offset], this._end) === interfaces_1.BoundaryPosition.Before &&
            algorithm_1.boundaryPoint_position([parent, offset + 1], this._start) === interfaces_1.BoundaryPosition.After) {
            return true;
        }
        /**
         * 6. Return false.
         */
        return false;
    };
    RangeImpl.prototype.toString = function () {
        var e_4, _a;
        /**
         * 1. Let s be the empty string.
         */
        var s = '';
        /**
         * 2. If the context object’s start node is the context object’s end node
         * and it is a Text node, then return the substring of that Text node’s data
         * beginning at the context object’s start offset and ending at the context
         * object’s end offset.
         */
        if (this._startNode === this._endNode && util_1.Guard.isTextNode(this._startNode)) {
            return this._startNode._data.substring(this._startOffset, this._endOffset);
        }
        /**
         * 3. If the context object’s start node is a Text node, then append the
         * substring of that node’s data from the context object’s start offset
         * until the end to s.
         */
        if (util_1.Guard.isTextNode(this._startNode)) {
            s += this._startNode._data.substring(this._startOffset);
        }
        try {
            /**
             * 4. Append the concatenation of the data of all Text nodes that are
             * contained in the context object, in tree order, to s.
             */
            for (var _b = __values(algorithm_1.range_getContainedNodes(this)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                if (util_1.Guard.isTextNode(child)) {
                    s += child._data;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        /**
         * 5. If the context object’s end node is a Text node, then append the
         * substring of that node’s data from its start until the context object’s
         * end offset to s.
         */
        if (util_1.Guard.isTextNode(this._endNode)) {
            s += this._endNode._data.substring(0, this._endOffset);
        }
        /**
         * 6. Return s.
         */
        return s;
    };
    /**
     * Creates a new `Range`.
     *
     * @param start - start point
     * @param end - end point
     */
    RangeImpl._create = function (start, end) {
        var range = new RangeImpl();
        if (start)
            range._start = start;
        if (end)
            range._end = end;
        return range;
    };
    RangeImpl.START_TO_START = 0;
    RangeImpl.START_TO_END = 1;
    RangeImpl.END_TO_END = 2;
    RangeImpl.END_TO_START = 3;
    return RangeImpl;
}(AbstractRangeImpl_1.AbstractRangeImpl));
exports.RangeImpl = RangeImpl;
/**
 * Define constants on prototype.
 */
WebIDLAlgorithm_1.idl_defineConst(RangeImpl.prototype, "START_TO_START", 0);
WebIDLAlgorithm_1.idl_defineConst(RangeImpl.prototype, "START_TO_END", 1);
WebIDLAlgorithm_1.idl_defineConst(RangeImpl.prototype, "END_TO_END", 2);
WebIDLAlgorithm_1.idl_defineConst(RangeImpl.prototype, "END_TO_START", 3);
//# sourceMappingURL=RangeImpl.js.map