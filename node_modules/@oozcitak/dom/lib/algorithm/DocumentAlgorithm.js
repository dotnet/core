"use strict";
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
var util_2 = require("@oozcitak/util");
var ElementImpl_1 = require("../dom/ElementImpl");
var CustomElementAlgorithm_1 = require("./CustomElementAlgorithm");
var TreeAlgorithm_1 = require("./TreeAlgorithm");
var NamespaceAlgorithm_1 = require("./NamespaceAlgorithm");
var DOMAlgorithm_1 = require("./DOMAlgorithm");
var ElementAlgorithm_1 = require("./ElementAlgorithm");
var MutationAlgorithm_1 = require("./MutationAlgorithm");
/**
 * Returns an element interface for the given name and namespace.
 *
 * @param name - element name
 * @param namespace - namespace
 */
function document_elementInterface(name, namespace) {
    return ElementImpl_1.ElementImpl;
}
exports.document_elementInterface = document_elementInterface;
/**
 * Creates a new element node.
 * See: https://dom.spec.whatwg.org/#internal-createelementns-steps
 *
 * @param document - owner document
 * @param namespace - element namespace
 * @param qualifiedName - qualified name
 * @param options - element options
 */
function document_internalCreateElementNS(document, namespace, qualifiedName, options) {
    /**
     * 1. Let namespace, prefix, and localName be the result of passing
     * namespace and qualifiedName to validate and extract.
     * 2. Let is be null.
     * 3. If options is a dictionary and options’s is is present, then set
     * is to it.
     * 4. Return the result of creating an element given document, localName,
     * namespace, prefix, is, and with the synchronous custom elements flag set.
     */
    var _a = __read(NamespaceAlgorithm_1.namespace_validateAndExtract(namespace, qualifiedName), 3), ns = _a[0], prefix = _a[1], localName = _a[2];
    var is = null;
    if (options !== undefined) {
        if (util_2.isString(options)) {
            is = options;
        }
        else {
            is = options.is;
        }
    }
    return ElementAlgorithm_1.element_createAnElement(document, localName, ns, prefix, is, true);
}
exports.document_internalCreateElementNS = document_internalCreateElementNS;
/**
 * Removes `node` and its subtree from its document and changes
 * its owner document to `document` so that it can be inserted
 * into `document`.
 *
 * @param node - the node to move
 * @param document - document to receive the node and its subtree
 */
function document_adopt(node, document) {
    var e_1, _a;
    // Optimize for common case of inserting a fresh node
    if (node._nodeDocument === document && node._parent === null) {
        return;
    }
    /**
     * 1. Let oldDocument be node’s node document.
     * 2. If node’s parent is not null, remove node from its parent.
     */
    var oldDocument = node._nodeDocument;
    if (node._parent)
        MutationAlgorithm_1.mutation_remove(node, node._parent);
    /**
     * 3. If document is not oldDocument, then:
     */
    if (document !== oldDocument) {
        /**
         * 3.1. For each inclusiveDescendant in node’s shadow-including inclusive
         * descendants:
         */
        var inclusiveDescendant = TreeAlgorithm_1.tree_getFirstDescendantNode(node, true, true);
        while (inclusiveDescendant !== null) {
            /**
             * 3.1.1. Set inclusiveDescendant’s node document to document.
             * 3.1.2. If inclusiveDescendant is an element, then set the node
             * document of each attribute in inclusiveDescendant’s attribute list
             * to document.
             */
            inclusiveDescendant._nodeDocument = document;
            if (util_1.Guard.isElementNode(inclusiveDescendant)) {
                try {
                    for (var _b = (e_1 = void 0, __values(inclusiveDescendant._attributeList._asArray())), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var attr = _c.value;
                        attr._nodeDocument = document;
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
             * 3.2. For each inclusiveDescendant in node's shadow-including
             * inclusive descendants that is custom, enqueue a custom
             * element callback reaction with inclusiveDescendant,
             * callback name "adoptedCallback", and an argument list
             * containing oldDocument and document.
             */
            if (DOMImpl_1.dom.features.customElements) {
                if (util_1.Guard.isElementNode(inclusiveDescendant) &&
                    inclusiveDescendant._customElementState === "custom") {
                    CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction(inclusiveDescendant, "adoptedCallback", [oldDocument, document]);
                }
            }
            /**
             * 3.3. For each inclusiveDescendant in node’s shadow-including
             * inclusive descendants, in shadow-including tree order, run the
             * adopting steps with inclusiveDescendant and oldDocument.
             */
            if (DOMImpl_1.dom.features.steps) {
                DOMAlgorithm_1.dom_runAdoptingSteps(inclusiveDescendant, oldDocument);
            }
            inclusiveDescendant = TreeAlgorithm_1.tree_getNextDescendantNode(node, inclusiveDescendant, true, true);
        }
    }
}
exports.document_adopt = document_adopt;
//# sourceMappingURL=DocumentAlgorithm.js.map