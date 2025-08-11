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
var util_1 = require("@oozcitak/util");
var CreateAlgorithm_1 = require("./CreateAlgorithm");
/**
 * Converts the given nodes or strings into a node (if `nodes` has
 * only one element) or a document fragment.
 *
 * @param nodes - the array of nodes or strings,
 * @param document - owner document
 */
function parentNode_convertNodesIntoANode(nodes, document) {
    var e_1, _a;
    /**
     * 1. Let node be null.
     * 2. Replace each string in nodes with a new Text node whose data is the
     * string and node document is document.
     */
    var node = null;
    for (var i = 0; i < nodes.length; i++) {
        var item = nodes[i];
        if (util_1.isString(item)) {
            var text = CreateAlgorithm_1.create_text(document, item);
            nodes[i] = text;
        }
    }
    /**
     * 3. If nodes contains one node, set node to that node.
     * 4. Otherwise, set node to a new DocumentFragment whose node document is
     * document, and then append each node in nodes, if any, to it.
     */
    if (nodes.length === 1) {
        node = nodes[0];
    }
    else {
        node = CreateAlgorithm_1.create_documentFragment(document);
        var ns = node;
        try {
            for (var nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                var item = nodes_1_1.value;
                ns.appendChild(item);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    /**
     * 5. Return node.
     */
    return node;
}
exports.parentNode_convertNodesIntoANode = parentNode_convertNodesIntoANode;
//# sourceMappingURL=ParentNodeAlgorithm.js.map