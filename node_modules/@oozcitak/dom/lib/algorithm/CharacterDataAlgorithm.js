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
var TreeAlgorithm_1 = require("./TreeAlgorithm");
var MutationObserverAlgorithm_1 = require("./MutationObserverAlgorithm");
var DOMAlgorithm_1 = require("./DOMAlgorithm");
/**
 * Replaces character data.
 *
 * @param node - a character data node
 * @param offset - start offset
 * @param count - count of characters to replace
 * @param data - new data
 */
function characterData_replaceData(node, offset, count, data) {
    var e_1, _a;
    /**
     * 1. Let length be node’s length.
     * 2. If offset is greater than length, then throw an "IndexSizeError"
     * DOMException.
     * 3. If offset plus count is greater than length, then set count to length
     * minus offset.
     */
    var length = TreeAlgorithm_1.tree_nodeLength(node);
    if (offset > length) {
        throw new DOMException_1.IndexSizeError("Offset exceeds character data length. Offset: " + offset + ", Length: " + length + ", Node is " + node.nodeName + ".");
    }
    if (offset + count > length) {
        count = length - offset;
    }
    /**
     * 4. Queue a mutation record of "characterData" for node with null, null,
     * node’s data, « », « », null, and null.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        MutationObserverAlgorithm_1.observer_queueMutationRecord("characterData", node, null, null, node._data, [], [], null, null);
    }
    /**
     * 5. Insert data into node’s data after offset code units.
     * 6. Let delete offset be offset + data’s length.
     * 7. Starting from delete offset code units, remove count code units from
     * node’s data.
     */
    var newData = node._data.substring(0, offset) + data +
        node._data.substring(offset + count);
    node._data = newData;
    try {
        /**
         * 8. For each live range whose start node is node and start offset is
         * greater than offset but less than or equal to offset plus count, set its
         * start offset to offset.
         * 9. For each live range whose end node is node and end offset is greater
         * than offset but less than or equal to offset plus count, set its end
         * offset to offset.
         * 10. For each live range whose start node is node and start offset is
         * greater than offset plus count, increase its start offset by data’s
         * length and decrease it by count.
         * 11. For each live range whose end node is node and end offset is greater
         * than offset plus count, increase its end offset by data’s length and
         * decrease it by count.
         */
        for (var _b = __values(DOMImpl_1.dom.rangeList), _c = _b.next(); !_c.done; _c = _b.next()) {
            var range = _c.value;
            if (range._start[0] === node && range._start[1] > offset && range._start[1] <= offset + count) {
                range._start[1] = offset;
            }
            if (range._end[0] === node && range._end[1] > offset && range._end[1] <= offset + count) {
                range._end[1] = offset;
            }
            if (range._start[0] === node && range._start[1] > offset + count) {
                range._start[1] += data.length - count;
            }
            if (range._end[0] === node && range._end[1] > offset + count) {
                range._end[1] += data.length - count;
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
    /**
     * 12. If node is a Text node and its parent is not null, run the child
     * text content change steps for node’s parent.
     */
    if (DOMImpl_1.dom.features.steps) {
        if (util_1.Guard.isTextNode(node) && node._parent !== null) {
            DOMAlgorithm_1.dom_runChildTextContentChangeSteps(node._parent);
        }
    }
}
exports.characterData_replaceData = characterData_replaceData;
/**
 * Returns `count` number of characters from `node`'s data starting at
 * the given `offset`.
 *
 * @param node - a character data node
 * @param offset - start offset
 * @param count - count of characters to return
 */
function characterData_substringData(node, offset, count) {
    /**
     * 1. Let length be node’s length.
     * 2. If offset is greater than length, then throw an "IndexSizeError"
     * DOMException.
     * 3. If offset plus count is greater than length, return a string whose
     * value is the code units from the offsetth code unit to the end of node’s
     * data, and then return.
     * 4. Return a string whose value is the code units from the offsetth code
     * unit to the offset+countth code unit in node’s data.
     */
    var length = TreeAlgorithm_1.tree_nodeLength(node);
    if (offset > length) {
        throw new DOMException_1.IndexSizeError("Offset exceeds character data length. Offset: " + offset + ", Length: " + length + ", Node is " + node.nodeName + ".");
    }
    if (offset + count > length) {
        return node._data.substr(offset);
    }
    else {
        return node._data.substr(offset, count);
    }
}
exports.characterData_substringData = characterData_substringData;
//# sourceMappingURL=CharacterDataAlgorithm.js.map