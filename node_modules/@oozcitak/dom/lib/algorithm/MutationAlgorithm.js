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
var DOMImpl_1 = require("../dom/DOMImpl");
var DOMException_1 = require("../dom/DOMException");
var interfaces_1 = require("../dom/interfaces");
var util_1 = require("../util");
var util_2 = require("@oozcitak/util");
var infra_1 = require("@oozcitak/infra");
var CustomElementAlgorithm_1 = require("./CustomElementAlgorithm");
var TreeAlgorithm_1 = require("./TreeAlgorithm");
var NodeIteratorAlgorithm_1 = require("./NodeIteratorAlgorithm");
var ShadowTreeAlgorithm_1 = require("./ShadowTreeAlgorithm");
var MutationObserverAlgorithm_1 = require("./MutationObserverAlgorithm");
var DOMAlgorithm_1 = require("./DOMAlgorithm");
var DocumentAlgorithm_1 = require("./DocumentAlgorithm");
/**
 * Ensures pre-insertion validity of a node into a parent before a
 * child.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param child - child node to insert node before
 */
function mutation_ensurePreInsertionValidity(node, parent, child) {
    var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
    var parentNodeType = parent._nodeType;
    var nodeNodeType = node._nodeType;
    var childNodeType = child ? child._nodeType : null;
    /**
     * 1. If parent is not a Document, DocumentFragment, or Element node,
     * throw a "HierarchyRequestError" DOMException.
     */
    if (parentNodeType !== interfaces_1.NodeType.Document &&
        parentNodeType !== interfaces_1.NodeType.DocumentFragment &&
        parentNodeType !== interfaces_1.NodeType.Element)
        throw new DOMException_1.HierarchyRequestError("Only document, document fragment and element nodes can contain child nodes. Parent node is " + parent.nodeName + ".");
    /**
     * 2. If node is a host-including inclusive ancestor of parent, throw a
     * "HierarchyRequestError" DOMException.
     */
    if (TreeAlgorithm_1.tree_isHostIncludingAncestorOf(parent, node, true))
        throw new DOMException_1.HierarchyRequestError("The node to be inserted cannot be an inclusive ancestor of parent node. Node is " + node.nodeName + ", parent node is " + parent.nodeName + ".");
    /**
     * 3. If child is not null and its parent is not parent, then throw a
     * "NotFoundError" DOMException.
     */
    if (child !== null && child._parent !== parent)
        throw new DOMException_1.NotFoundError("The reference child node cannot be found under parent node. Child node is " + child.nodeName + ", parent node is " + parent.nodeName + ".");
    /**
     * 4. If node is not a DocumentFragment, DocumentType, Element, Text,
     * ProcessingInstruction, or Comment node, throw a "HierarchyRequestError"
     * DOMException.
     */
    if (nodeNodeType !== interfaces_1.NodeType.DocumentFragment &&
        nodeNodeType !== interfaces_1.NodeType.DocumentType &&
        nodeNodeType !== interfaces_1.NodeType.Element &&
        nodeNodeType !== interfaces_1.NodeType.Text &&
        nodeNodeType !== interfaces_1.NodeType.ProcessingInstruction &&
        nodeNodeType !== interfaces_1.NodeType.CData &&
        nodeNodeType !== interfaces_1.NodeType.Comment)
        throw new DOMException_1.HierarchyRequestError("Only document fragment, document type, element, text, processing instruction, cdata section or comment nodes can be inserted. Node is " + node.nodeName + ".");
    /**
     * 5. If either node is a Text node and parent is a document, or node is a
     * doctype and parent is not a document, throw a "HierarchyRequestError"
     * DOMException.
     */
    if (nodeNodeType === interfaces_1.NodeType.Text &&
        parentNodeType === interfaces_1.NodeType.Document)
        throw new DOMException_1.HierarchyRequestError("Cannot insert a text node as a child of a document node. Node is " + node.nodeName + ".");
    if (nodeNodeType === interfaces_1.NodeType.DocumentType &&
        parentNodeType !== interfaces_1.NodeType.Document)
        throw new DOMException_1.HierarchyRequestError("A document type node can only be inserted under a document node. Parent node is " + parent.nodeName + ".");
    /**
     * 6. If parent is a document, and any of the statements below, switched on
     * node, are true, throw a "HierarchyRequestError" DOMException.
     * - DocumentFragment node
     * If node has more than one element child or has a Text node child.
     * Otherwise, if node has one element child and either parent has an element
     * child, child is a doctype, or child is not null and a doctype is
     * following child.
     * - element
     * parent has an element child, child is a doctype, or child is not null and
     * a doctype is following child.
     * - doctype
     * parent has a doctype child, child is non-null and an element is preceding
     * child, or child is null and parent has an element child.
     */
    if (parentNodeType === interfaces_1.NodeType.Document) {
        if (nodeNodeType === interfaces_1.NodeType.DocumentFragment) {
            var eleCount = 0;
            try {
                for (var _e = __values(node._children), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var childNode = _f.value;
                    if (childNode._nodeType === interfaces_1.NodeType.Element)
                        eleCount++;
                    else if (childNode._nodeType === interfaces_1.NodeType.Text)
                        throw new DOMException_1.HierarchyRequestError("Cannot insert text a node as a child of a document node. Node is " + childNode.nodeName + ".");
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (eleCount > 1) {
                throw new DOMException_1.HierarchyRequestError("A document node can only have one document element node. Document fragment to be inserted has " + eleCount + " element nodes.");
            }
            else if (eleCount === 1) {
                try {
                    for (var _g = __values(parent._children), _h = _g.next(); !_h.done; _h = _g.next()) {
                        var ele = _h.value;
                        if (ele._nodeType === interfaces_1.NodeType.Element)
                            throw new DOMException_1.HierarchyRequestError("The document node already has a document element node.");
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                if (child) {
                    if (childNodeType === interfaces_1.NodeType.DocumentType)
                        throw new DOMException_1.HierarchyRequestError("Cannot insert an element node before a document type node.");
                    var doctypeChild = child._nextSibling;
                    while (doctypeChild) {
                        if (doctypeChild._nodeType === interfaces_1.NodeType.DocumentType)
                            throw new DOMException_1.HierarchyRequestError("Cannot insert an element node before a document type node.");
                        doctypeChild = doctypeChild._nextSibling;
                    }
                }
            }
        }
        else if (nodeNodeType === interfaces_1.NodeType.Element) {
            try {
                for (var _j = __values(parent._children), _k = _j.next(); !_k.done; _k = _j.next()) {
                    var ele = _k.value;
                    if (ele._nodeType === interfaces_1.NodeType.Element)
                        throw new DOMException_1.HierarchyRequestError("Document already has a document element node. Node is " + node.nodeName + ".");
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
                }
                finally { if (e_3) throw e_3.error; }
            }
            if (child) {
                if (childNodeType === interfaces_1.NodeType.DocumentType)
                    throw new DOMException_1.HierarchyRequestError("Cannot insert an element node before a document type node. Node is " + node.nodeName + ".");
                var doctypeChild = child._nextSibling;
                while (doctypeChild) {
                    if (doctypeChild._nodeType === interfaces_1.NodeType.DocumentType)
                        throw new DOMException_1.HierarchyRequestError("Cannot insert an element node before a document type node. Node is " + node.nodeName + ".");
                    doctypeChild = doctypeChild._nextSibling;
                }
            }
        }
        else if (nodeNodeType === interfaces_1.NodeType.DocumentType) {
            try {
                for (var _l = __values(parent._children), _m = _l.next(); !_m.done; _m = _l.next()) {
                    var ele = _m.value;
                    if (ele._nodeType === interfaces_1.NodeType.DocumentType)
                        throw new DOMException_1.HierarchyRequestError("Document already has a document type node. Node is " + node.nodeName + ".");
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
                }
                finally { if (e_4) throw e_4.error; }
            }
            if (child) {
                var elementChild = child._previousSibling;
                while (elementChild) {
                    if (elementChild._nodeType === interfaces_1.NodeType.Element)
                        throw new DOMException_1.HierarchyRequestError("Cannot insert a document type node before an element node. Node is " + node.nodeName + ".");
                    elementChild = elementChild._previousSibling;
                }
            }
            else {
                var elementChild = parent._firstChild;
                while (elementChild) {
                    if (elementChild._nodeType === interfaces_1.NodeType.Element)
                        throw new DOMException_1.HierarchyRequestError("Cannot insert a document type node before an element node. Node is " + node.nodeName + ".");
                    elementChild = elementChild._nextSibling;
                }
            }
        }
    }
}
exports.mutation_ensurePreInsertionValidity = mutation_ensurePreInsertionValidity;
/**
 * Ensures pre-insertion validity of a node into a parent before a
 * child, then adopts the node to the tree and inserts it.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param child - child node to insert node before
 */
function mutation_preInsert(node, parent, child) {
    /**
     * 1. Ensure pre-insertion validity of node into parent before child.
     * 2. Let reference child be child.
     * 3. If reference child is node, set it to node’s next sibling.
     * 4. Adopt node into parent’s node document.
     * 5. Insert node into parent before reference child.
     * 6. Return node.
     */
    mutation_ensurePreInsertionValidity(node, parent, child);
    var referenceChild = child;
    if (referenceChild === node)
        referenceChild = node._nextSibling;
    DocumentAlgorithm_1.document_adopt(node, parent._nodeDocument);
    mutation_insert(node, parent, referenceChild);
    return node;
}
exports.mutation_preInsert = mutation_preInsert;
/**
 * Inserts a node into a parent node before the given child node.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param child - child node to insert node before
 * @param suppressObservers - whether to notify observers
 */
function mutation_insert(node, parent, child, suppressObservers) {
    var e_5, _a;
    // Optimized common case
    if (child === null && node._nodeType !== interfaces_1.NodeType.DocumentFragment) {
        mutation_insert_single(node, parent, suppressObservers);
        return;
    }
    /**
     * 1. Let count be the number of children of node if it is a
     * DocumentFragment node, and one otherwise.
     */
    var count = (node._nodeType === interfaces_1.NodeType.DocumentFragment ?
        node._children.size : 1);
    /**
     * 2. If child is non-null, then:
     */
    if (child !== null) {
        /**
         * 2.1. For each live range whose start node is parent and start
         * offset is greater than child's index, increase its start
         * offset by count.
         * 2.2. For each live range whose end node is parent and end
         * offset is greater than child's index, increase its end
         * offset by count.
         */
        if (DOMImpl_1.dom.rangeList.size !== 0) {
            var index_1 = TreeAlgorithm_1.tree_index(child);
            try {
                for (var _b = __values(DOMImpl_1.dom.rangeList), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var range = _c.value;
                    if (range._start[0] === parent && range._start[1] > index_1) {
                        range._start[1] += count;
                    }
                    if (range._end[0] === parent && range._end[1] > index_1) {
                        range._end[1] += count;
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
    }
    /**
     * 3. Let nodes be node’s children, if node is a DocumentFragment node;
     * otherwise « node ».
     */
    var nodes = node._nodeType === interfaces_1.NodeType.DocumentFragment ? new (Array.bind.apply(Array, __spread([void 0], node._children)))() : [node];
    /**
     * 4. If node is a DocumentFragment node, remove its children with the
     * suppress observers flag set.
     */
    if (node._nodeType === interfaces_1.NodeType.DocumentFragment) {
        while (node._firstChild) {
            mutation_remove(node._firstChild, node, true);
        }
    }
    /**
     * 5. If node is a DocumentFragment node, then queue a tree mutation record
     * for node with « », nodes, null, and null.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        if (node._nodeType === interfaces_1.NodeType.DocumentFragment) {
            MutationObserverAlgorithm_1.observer_queueTreeMutationRecord(node, [], nodes, null, null);
        }
    }
    /**
     * 6. Let previousSibling be child’s previous sibling or parent’s last
     * child if child is null.
     */
    var previousSibling = (child ? child._previousSibling : parent._lastChild);
    var index = child === null ? -1 : TreeAlgorithm_1.tree_index(child);
    /**
     * 7. For each node in nodes, in tree order:
     */
    for (var i = 0; i < nodes.length; i++) {
        var node_1 = nodes[i];
        if (util_1.Guard.isElementNode(node_1)) {
            // set document element node
            if (util_1.Guard.isDocumentNode(parent)) {
                parent._documentElement = node_1;
            }
            // mark that the document has namespaces
            if (!node_1._nodeDocument._hasNamespaces && (node_1._namespace !== null ||
                node_1._namespacePrefix !== null)) {
                node_1._nodeDocument._hasNamespaces = true;
            }
        }
        /**
         * 7.1. If child is null, then append node to parent’s children.
         * 7.2. Otherwise, insert node into parent’s children before child’s
         * index.
         */
        node_1._parent = parent;
        if (child === null) {
            infra_1.set.append(parent._children, node_1);
        }
        else {
            infra_1.set.insert(parent._children, node_1, index);
            index++;
        }
        // assign siblings and children for quick lookups
        if (parent._firstChild === null) {
            node_1._previousSibling = null;
            node_1._nextSibling = null;
            parent._firstChild = node_1;
            parent._lastChild = node_1;
        }
        else {
            var prev = (child ? child._previousSibling : parent._lastChild);
            var next = (child ? child : null);
            node_1._previousSibling = prev;
            node_1._nextSibling = next;
            if (prev)
                prev._nextSibling = node_1;
            if (next)
                next._previousSibling = node_1;
            if (!prev)
                parent._firstChild = node_1;
            if (!next)
                parent._lastChild = node_1;
        }
        /**
         * 7.3. If parent is a shadow host and node is a slotable, then
         * assign a slot for node.
         */
        if (DOMImpl_1.dom.features.slots) {
            if (parent._shadowRoot !== null && util_1.Guard.isSlotable(node_1)) {
                ShadowTreeAlgorithm_1.shadowTree_assignASlot(node_1);
            }
        }
        /**
         * 7.4. If node is a Text node, run the child text content change
         * steps for parent.
         */
        if (DOMImpl_1.dom.features.steps) {
            if (util_1.Guard.isTextNode(node_1)) {
                DOMAlgorithm_1.dom_runChildTextContentChangeSteps(parent);
            }
        }
        /**
         * 7.5. If parent's root is a shadow root, and parent is a slot
         * whose assigned nodes is the empty list, then run signal
         * a slot change for parent.
         */
        if (DOMImpl_1.dom.features.slots) {
            if (util_1.Guard.isShadowRoot(TreeAlgorithm_1.tree_rootNode(parent)) &&
                util_1.Guard.isSlot(parent) && util_2.isEmpty(parent._assignedNodes)) {
                ShadowTreeAlgorithm_1.shadowTree_signalASlotChange(parent);
            }
        }
        /**
         * 7.6. Run assign slotables for a tree with node's root.
         */
        if (DOMImpl_1.dom.features.slots) {
            ShadowTreeAlgorithm_1.shadowTree_assignSlotablesForATree(TreeAlgorithm_1.tree_rootNode(node_1));
        }
        /**
         * 7.7. For each shadow-including inclusive descendant
         * inclusiveDescendant of node, in shadow-including tree
         * order:
         */
        var inclusiveDescendant = TreeAlgorithm_1.tree_getFirstDescendantNode(node_1, true, true);
        while (inclusiveDescendant !== null) {
            /**
             * 7.7.1. Run the insertion steps with inclusiveDescendant.
             */
            if (DOMImpl_1.dom.features.steps) {
                DOMAlgorithm_1.dom_runInsertionSteps(inclusiveDescendant);
            }
            if (DOMImpl_1.dom.features.customElements) {
                /**
                 * 7.7.2. If inclusiveDescendant is connected, then:
                 */
                if (util_1.Guard.isElementNode(inclusiveDescendant) &&
                    ShadowTreeAlgorithm_1.shadowTree_isConnected(inclusiveDescendant)) {
                    if (util_1.Guard.isCustomElementNode(inclusiveDescendant)) {
                        /**
                         * 7.7.2.1. If inclusiveDescendant is custom, then enqueue a custom
                         * element callback reaction with inclusiveDescendant, callback name
                         * "connectedCallback", and an empty argument list.
                         */
                        CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction(inclusiveDescendant, "connectedCallback", []);
                    }
                    else {
                        /**
                         * 7.7.2.2. Otherwise, try to upgrade inclusiveDescendant.
                         */
                        CustomElementAlgorithm_1.customElement_tryToUpgrade(inclusiveDescendant);
                    }
                }
            }
            inclusiveDescendant = TreeAlgorithm_1.tree_getNextDescendantNode(node_1, inclusiveDescendant, true, true);
        }
    }
    /**
     * 8. If suppress observers flag is unset, then queue a tree mutation record
     * for parent with nodes, « », previousSibling, and child.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        if (!suppressObservers) {
            MutationObserverAlgorithm_1.observer_queueTreeMutationRecord(parent, nodes, [], previousSibling, child);
        }
    }
}
exports.mutation_insert = mutation_insert;
/**
 * Inserts a node into a parent node. Optimized routine for the common case where
 * node is not a document fragment node and it has no child nodes.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param suppressObservers - whether to notify observers
 */
function mutation_insert_single(node, parent, suppressObservers) {
    /**
     * 1. Let count be the number of children of node if it is a
     * DocumentFragment node, and one otherwise.
     * 2. If child is non-null, then:
     * 2.1. For each live range whose start node is parent and start
     * offset is greater than child's index, increase its start
     * offset by count.
     * 2.2. For each live range whose end node is parent and end
     * offset is greater than child's index, increase its end
     * offset by count.
     * 3. Let nodes be node’s children, if node is a DocumentFragment node;
     * otherwise « node ».
     * 4. If node is a DocumentFragment node, remove its children with the
     * suppress observers flag set.
     * 5. If node is a DocumentFragment node, then queue a tree mutation record
     * for node with « », nodes, null, and null.
     */
    /**
     * 6. Let previousSibling be child’s previous sibling or parent’s last
     * child if child is null.
     */
    var previousSibling = parent._lastChild;
    // set document element node
    if (util_1.Guard.isElementNode(node)) {
        // set document element node
        if (util_1.Guard.isDocumentNode(parent)) {
            parent._documentElement = node;
        }
        // mark that the document has namespaces
        if (!node._nodeDocument._hasNamespaces && (node._namespace !== null ||
            node._namespacePrefix !== null)) {
            node._nodeDocument._hasNamespaces = true;
        }
    }
    /**
     * 7. For each node in nodes, in tree order:
     * 7.1. If child is null, then append node to parent’s children.
     * 7.2. Otherwise, insert node into parent’s children before child’s
     * index.
     */
    node._parent = parent;
    parent._children.add(node);
    // assign siblings and children for quick lookups
    if (parent._firstChild === null) {
        node._previousSibling = null;
        node._nextSibling = null;
        parent._firstChild = node;
        parent._lastChild = node;
    }
    else {
        var prev = parent._lastChild;
        node._previousSibling = prev;
        node._nextSibling = null;
        if (prev)
            prev._nextSibling = node;
        if (!prev)
            parent._firstChild = node;
        parent._lastChild = node;
    }
    /**
     * 7.3. If parent is a shadow host and node is a slotable, then
     * assign a slot for node.
     */
    if (DOMImpl_1.dom.features.slots) {
        if (parent._shadowRoot !== null && util_1.Guard.isSlotable(node)) {
            ShadowTreeAlgorithm_1.shadowTree_assignASlot(node);
        }
    }
    /**
     * 7.4. If node is a Text node, run the child text content change
     * steps for parent.
     */
    if (DOMImpl_1.dom.features.steps) {
        if (util_1.Guard.isTextNode(node)) {
            DOMAlgorithm_1.dom_runChildTextContentChangeSteps(parent);
        }
    }
    /**
     * 7.5. If parent's root is a shadow root, and parent is a slot
     * whose assigned nodes is the empty list, then run signal
     * a slot change for parent.
     */
    if (DOMImpl_1.dom.features.slots) {
        if (util_1.Guard.isShadowRoot(TreeAlgorithm_1.tree_rootNode(parent)) &&
            util_1.Guard.isSlot(parent) && util_2.isEmpty(parent._assignedNodes)) {
            ShadowTreeAlgorithm_1.shadowTree_signalASlotChange(parent);
        }
    }
    /**
     * 7.6. Run assign slotables for a tree with node's root.
     */
    if (DOMImpl_1.dom.features.slots) {
        ShadowTreeAlgorithm_1.shadowTree_assignSlotablesForATree(TreeAlgorithm_1.tree_rootNode(node));
    }
    /**
     * 7.7. For each shadow-including inclusive descendant
     * inclusiveDescendant of node, in shadow-including tree
     * order:
     * 7.7.1. Run the insertion steps with inclusiveDescendant.
     */
    if (DOMImpl_1.dom.features.steps) {
        DOMAlgorithm_1.dom_runInsertionSteps(node);
    }
    if (DOMImpl_1.dom.features.customElements) {
        /**
         * 7.7.2. If inclusiveDescendant is connected, then:
         */
        if (util_1.Guard.isElementNode(node) &&
            ShadowTreeAlgorithm_1.shadowTree_isConnected(node)) {
            if (util_1.Guard.isCustomElementNode(node)) {
                /**
                 * 7.7.2.1. If inclusiveDescendant is custom, then enqueue a custom
                 * element callback reaction with inclusiveDescendant, callback name
                 * "connectedCallback", and an empty argument list.
                 */
                CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction(node, "connectedCallback", []);
            }
            else {
                /**
                 * 7.7.2.2. Otherwise, try to upgrade inclusiveDescendant.
                 */
                CustomElementAlgorithm_1.customElement_tryToUpgrade(node);
            }
        }
    }
    /**
     * 8. If suppress observers flag is unset, then queue a tree mutation record
     * for parent with nodes, « », previousSibling, and child.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        if (!suppressObservers) {
            MutationObserverAlgorithm_1.observer_queueTreeMutationRecord(parent, [node], [], previousSibling, null);
        }
    }
}
/**
 * Appends a node to the children of a parent node.
 *
 * @param node - a node
 * @param parent - the parent to receive node
 */
function mutation_append(node, parent) {
    /**
     * To append a node to a parent, pre-insert node into parent before null.
     */
    return mutation_preInsert(node, parent, null);
}
exports.mutation_append = mutation_append;
/**
 * Replaces a node with another node.
 *
 * @param child - child node to remove
 * @param node - node to insert
 * @param parent - parent node to receive node
 */
function mutation_replace(child, node, parent) {
    var e_6, _a, e_7, _b, e_8, _c, e_9, _d;
    /**
     * 1. If parent is not a Document, DocumentFragment, or Element node,
     * throw a "HierarchyRequestError" DOMException.
     */
    if (parent._nodeType !== interfaces_1.NodeType.Document &&
        parent._nodeType !== interfaces_1.NodeType.DocumentFragment &&
        parent._nodeType !== interfaces_1.NodeType.Element)
        throw new DOMException_1.HierarchyRequestError("Only document, document fragment and element nodes can contain child nodes. Parent node is " + parent.nodeName + ".");
    /**
     * 2. If node is a host-including inclusive ancestor of parent, throw a
     * "HierarchyRequestError" DOMException.
     */
    if (TreeAlgorithm_1.tree_isHostIncludingAncestorOf(parent, node, true))
        throw new DOMException_1.HierarchyRequestError("The node to be inserted cannot be an ancestor of parent node. Node is " + node.nodeName + ", parent node is " + parent.nodeName + ".");
    /**
     * 3. If child’s parent is not parent, then throw a "NotFoundError"
     * DOMException.
     */
    if (child._parent !== parent)
        throw new DOMException_1.NotFoundError("The reference child node cannot be found under parent node. Child node is " + child.nodeName + ", parent node is " + parent.nodeName + ".");
    /**
     * 4. If node is not a DocumentFragment, DocumentType, Element, Text,
     * ProcessingInstruction, or Comment node, throw a "HierarchyRequestError"
     * DOMException.
     */
    if (node._nodeType !== interfaces_1.NodeType.DocumentFragment &&
        node._nodeType !== interfaces_1.NodeType.DocumentType &&
        node._nodeType !== interfaces_1.NodeType.Element &&
        node._nodeType !== interfaces_1.NodeType.Text &&
        node._nodeType !== interfaces_1.NodeType.ProcessingInstruction &&
        node._nodeType !== interfaces_1.NodeType.CData &&
        node._nodeType !== interfaces_1.NodeType.Comment)
        throw new DOMException_1.HierarchyRequestError("Only document fragment, document type, element, text, processing instruction, cdata section or comment nodes can be inserted. Node is " + node.nodeName + ".");
    /**
     * 5. If either node is a Text node and parent is a document, or node is a
     * doctype and parent is not a document, throw a "HierarchyRequestError"
     * DOMException.
     */
    if (node._nodeType === interfaces_1.NodeType.Text &&
        parent._nodeType === interfaces_1.NodeType.Document)
        throw new DOMException_1.HierarchyRequestError("Cannot insert a text node as a child of a document node. Node is " + node.nodeName + ".");
    if (node._nodeType === interfaces_1.NodeType.DocumentType &&
        parent._nodeType !== interfaces_1.NodeType.Document)
        throw new DOMException_1.HierarchyRequestError("A document type node can only be inserted under a document node. Parent node is " + parent.nodeName + ".");
    /**
     * 6. If parent is a document, and any of the statements below, switched on
     * node, are true, throw a "HierarchyRequestError" DOMException.
     * - DocumentFragment node
     * If node has more than one element child or has a Text node child.
     * Otherwise, if node has one element child and either parent has an element
     * child that is not child or a doctype is following child.
     * - element
     * parent has an element child that is not child or a doctype is
     * following child.
     * - doctype
     * parent has a doctype child that is not child, or an element is
     * preceding child.
     */
    if (parent._nodeType === interfaces_1.NodeType.Document) {
        if (node._nodeType === interfaces_1.NodeType.DocumentFragment) {
            var eleCount = 0;
            try {
                for (var _e = __values(node._children), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var childNode = _f.value;
                    if (childNode._nodeType === interfaces_1.NodeType.Element)
                        eleCount++;
                    else if (childNode._nodeType === interfaces_1.NodeType.Text)
                        throw new DOMException_1.HierarchyRequestError("Cannot insert text a node as a child of a document node. Node is " + childNode.nodeName + ".");
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
                }
                finally { if (e_6) throw e_6.error; }
            }
            if (eleCount > 1) {
                throw new DOMException_1.HierarchyRequestError("A document node can only have one document element node. Document fragment to be inserted has " + eleCount + " element nodes.");
            }
            else if (eleCount === 1) {
                try {
                    for (var _g = __values(parent._children), _h = _g.next(); !_h.done; _h = _g.next()) {
                        var ele = _h.value;
                        if (ele._nodeType === interfaces_1.NodeType.Element && ele !== child)
                            throw new DOMException_1.HierarchyRequestError("The document node already has a document element node.");
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
                var doctypeChild = child._nextSibling;
                while (doctypeChild) {
                    if (doctypeChild._nodeType === interfaces_1.NodeType.DocumentType)
                        throw new DOMException_1.HierarchyRequestError("Cannot insert an element node before a document type node.");
                    doctypeChild = doctypeChild._nextSibling;
                }
            }
        }
        else if (node._nodeType === interfaces_1.NodeType.Element) {
            try {
                for (var _j = __values(parent._children), _k = _j.next(); !_k.done; _k = _j.next()) {
                    var ele = _k.value;
                    if (ele._nodeType === interfaces_1.NodeType.Element && ele !== child)
                        throw new DOMException_1.HierarchyRequestError("Document already has a document element node. Node is " + node.nodeName + ".");
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
                }
                finally { if (e_8) throw e_8.error; }
            }
            var doctypeChild = child._nextSibling;
            while (doctypeChild) {
                if (doctypeChild._nodeType === interfaces_1.NodeType.DocumentType)
                    throw new DOMException_1.HierarchyRequestError("Cannot insert an element node before a document type node. Node is " + node.nodeName + ".");
                doctypeChild = doctypeChild._nextSibling;
            }
        }
        else if (node._nodeType === interfaces_1.NodeType.DocumentType) {
            try {
                for (var _l = __values(parent._children), _m = _l.next(); !_m.done; _m = _l.next()) {
                    var ele = _m.value;
                    if (ele._nodeType === interfaces_1.NodeType.DocumentType && ele !== child)
                        throw new DOMException_1.HierarchyRequestError("Document already has a document type node. Node is " + node.nodeName + ".");
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
                }
                finally { if (e_9) throw e_9.error; }
            }
            var elementChild = child._previousSibling;
            while (elementChild) {
                if (elementChild._nodeType === interfaces_1.NodeType.Element)
                    throw new DOMException_1.HierarchyRequestError("Cannot insert a document type node before an element node. Node is " + node.nodeName + ".");
                elementChild = elementChild._previousSibling;
            }
        }
    }
    /**
     * 7. Let reference child be child’s next sibling.
     * 8. If reference child is node, set it to node’s next sibling.
     * 8. Let previousSibling be child’s previous sibling.
     */
    var referenceChild = child._nextSibling;
    if (referenceChild === node)
        referenceChild = node._nextSibling;
    var previousSibling = child._previousSibling;
    /**
     * 10. Adopt node into parent’s node document.
     * 11. Let removedNodes be the empty list.
     */
    DocumentAlgorithm_1.document_adopt(node, parent._nodeDocument);
    var removedNodes = [];
    /**
     * 12. If child’s parent is not null, then:
     */
    if (child._parent !== null) {
        /**
         * 12.1. Set removedNodes to [child].
         * 12.2. Remove child from its parent with the suppress observers flag
         * set.
         */
        removedNodes.push(child);
        mutation_remove(child, child._parent, true);
    }
    /**
     * 13. Let nodes be node’s children if node is a DocumentFragment node;
     * otherwise [node].
     */
    var nodes = [];
    if (node._nodeType === interfaces_1.NodeType.DocumentFragment) {
        nodes = Array.from(node._children);
    }
    else {
        nodes.push(node);
    }
    /**
     * 14. Insert node into parent before reference child with the suppress
     * observers flag set.
     */
    mutation_insert(node, parent, referenceChild, true);
    /**
     * 15. Queue a tree mutation record for parent with nodes, removedNodes,
     * previousSibling, and reference child.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        MutationObserverAlgorithm_1.observer_queueTreeMutationRecord(parent, nodes, removedNodes, previousSibling, referenceChild);
    }
    /**
     * 16. Return child.
     */
    return child;
}
exports.mutation_replace = mutation_replace;
/**
 * Replaces all nodes of a parent with the given node.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 */
function mutation_replaceAll(node, parent) {
    var e_10, _a;
    /**
     * 1. If node is not null, adopt node into parent’s node document.
     */
    if (node !== null) {
        DocumentAlgorithm_1.document_adopt(node, parent._nodeDocument);
    }
    /**
     * 2. Let removedNodes be parent’s children.
     */
    var removedNodes = Array.from(parent._children);
    /**
     * 3. Let addedNodes be the empty list.
     * 4. If node is DocumentFragment node, then set addedNodes to node’s
     * children.
     * 5. Otherwise, if node is non-null, set addedNodes to [node].
     */
    var addedNodes = [];
    if (node && node._nodeType === interfaces_1.NodeType.DocumentFragment) {
        addedNodes = Array.from(node._children);
    }
    else if (node !== null) {
        addedNodes.push(node);
    }
    try {
        /**
         * 6. Remove all parent’s children, in tree order, with the suppress
         * observers flag set.
         */
        for (var removedNodes_1 = __values(removedNodes), removedNodes_1_1 = removedNodes_1.next(); !removedNodes_1_1.done; removedNodes_1_1 = removedNodes_1.next()) {
            var childNode = removedNodes_1_1.value;
            mutation_remove(childNode, parent, true);
        }
    }
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (removedNodes_1_1 && !removedNodes_1_1.done && (_a = removedNodes_1.return)) _a.call(removedNodes_1);
        }
        finally { if (e_10) throw e_10.error; }
    }
    /**
     * 7. If node is not null, then insert node into parent before null with the
     * suppress observers flag set.
     */
    if (node !== null) {
        mutation_insert(node, parent, null, true);
    }
    /**
     * 8. Queue a tree mutation record for parent with addedNodes, removedNodes,
     * null, and null.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        MutationObserverAlgorithm_1.observer_queueTreeMutationRecord(parent, addedNodes, removedNodes, null, null);
    }
}
exports.mutation_replaceAll = mutation_replaceAll;
/**
 * Ensures pre-removal validity of a child node from a parent, then
 * removes it.
 *
 * @param child - child node to remove
 * @param parent - parent node
 */
function mutation_preRemove(child, parent) {
    /**
     * 1. If child’s parent is not parent, then throw a "NotFoundError"
     * DOMException.
     * 2. Remove child from parent.
     * 3. Return child.
     */
    if (child._parent !== parent)
        throw new DOMException_1.NotFoundError("The child node cannot be found under parent node. Child node is " + child.nodeName + ", parent node is " + parent.nodeName + ".");
    mutation_remove(child, parent);
    return child;
}
exports.mutation_preRemove = mutation_preRemove;
/**
 * Removes a child node from its parent.
 *
 * @param node - node to remove
 * @param parent - parent node
 * @param suppressObservers - whether to notify observers
 */
function mutation_remove(node, parent, suppressObservers) {
    var e_11, _a, e_12, _b, e_13, _c, e_14, _d;
    if (DOMImpl_1.dom.rangeList.size !== 0) {
        /**
         * 1. Let index be node’s index.
         */
        var index = TreeAlgorithm_1.tree_index(node);
        try {
            /**
             * 2. For each live range whose start node is an inclusive descendant of
             * node, set its start to (parent, index).
             * 3. For each live range whose end node is an inclusive descendant of
             * node, set its end to (parent, index).
             */
            for (var _e = __values(DOMImpl_1.dom.rangeList), _f = _e.next(); !_f.done; _f = _e.next()) {
                var range = _f.value;
                if (TreeAlgorithm_1.tree_isDescendantOf(node, range._start[0], true)) {
                    range._start = [parent, index];
                }
                if (TreeAlgorithm_1.tree_isDescendantOf(node, range._end[0], true)) {
                    range._end = [parent, index];
                }
                if (range._start[0] === parent && range._start[1] > index) {
                    range._start[1]--;
                }
                if (range._end[0] === parent && range._end[1] > index) {
                    range._end[1]--;
                }
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
            }
            finally { if (e_11) throw e_11.error; }
        }
        try {
            /**
             * 4. For each live range whose start node is parent and start offset is
             * greater than index, decrease its start offset by 1.
             * 5. For each live range whose end node is parent and end offset is greater
             * than index, decrease its end offset by 1.
             */
            for (var _g = __values(DOMImpl_1.dom.rangeList), _h = _g.next(); !_h.done; _h = _g.next()) {
                var range = _h.value;
                if (range._start[0] === parent && range._start[1] > index) {
                    range._start[1] -= 1;
                }
                if (range._end[0] === parent && range._end[1] > index) {
                    range._end[1] -= 1;
                }
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
            }
            finally { if (e_12) throw e_12.error; }
        }
    }
    /**
     * 6. For each NodeIterator object iterator whose root’s node document is
     * node’s node document, run the NodeIterator pre-removing steps given node
     * and iterator.
     */
    if (DOMImpl_1.dom.features.steps) {
        try {
            for (var _j = __values(NodeIteratorAlgorithm_1.nodeIterator_iteratorList()), _k = _j.next(); !_k.done; _k = _j.next()) {
                var iterator = _k.value;
                if (iterator._root._nodeDocument === node._nodeDocument) {
                    DOMAlgorithm_1.dom_runNodeIteratorPreRemovingSteps(iterator, node);
                }
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
            }
            finally { if (e_13) throw e_13.error; }
        }
    }
    /**
     * 7. Let oldPreviousSibling be node’s previous sibling.
     * 8. Let oldNextSibling be node’s next sibling.
     */
    var oldPreviousSibling = node._previousSibling;
    var oldNextSibling = node._nextSibling;
    // set document element node
    if (util_1.Guard.isDocumentNode(parent) && util_1.Guard.isElementNode(node)) {
        parent._documentElement = null;
    }
    /**
     * 9. Remove node from its parent’s children.
     */
    node._parent = null;
    parent._children.delete(node);
    // assign siblings and children for quick lookups
    var prev = node._previousSibling;
    var next = node._nextSibling;
    node._previousSibling = null;
    node._nextSibling = null;
    if (prev)
        prev._nextSibling = next;
    if (next)
        next._previousSibling = prev;
    if (!prev)
        parent._firstChild = next;
    if (!next)
        parent._lastChild = prev;
    /**
     * 10. If node is assigned, then run assign slotables for node’s assigned
     * slot.
     */
    if (DOMImpl_1.dom.features.slots) {
        if (util_1.Guard.isSlotable(node) && node._assignedSlot !== null && ShadowTreeAlgorithm_1.shadowTree_isAssigned(node)) {
            ShadowTreeAlgorithm_1.shadowTree_assignSlotables(node._assignedSlot);
        }
    }
    /**
     * 11. If parent’s root is a shadow root, and parent is a slot whose
     * assigned nodes is the empty list, then run signal a slot change for
     * parent.
     */
    if (DOMImpl_1.dom.features.slots) {
        if (util_1.Guard.isShadowRoot(TreeAlgorithm_1.tree_rootNode(parent)) &&
            util_1.Guard.isSlot(parent) && util_2.isEmpty(parent._assignedNodes)) {
            ShadowTreeAlgorithm_1.shadowTree_signalASlotChange(parent);
        }
    }
    /**
     * 12. If node has an inclusive descendant that is a slot, then:
     * 12.1. Run assign slotables for a tree with parent's root.
     * 12.2. Run assign slotables for a tree with node.
     */
    if (DOMImpl_1.dom.features.slots) {
        var descendant_1 = TreeAlgorithm_1.tree_getFirstDescendantNode(node, true, false, function (e) { return util_1.Guard.isSlot(e); });
        if (descendant_1 !== null) {
            ShadowTreeAlgorithm_1.shadowTree_assignSlotablesForATree(TreeAlgorithm_1.tree_rootNode(parent));
            ShadowTreeAlgorithm_1.shadowTree_assignSlotablesForATree(node);
        }
    }
    /**
     * 13. Run the removing steps with node and parent.
     */
    if (DOMImpl_1.dom.features.steps) {
        DOMAlgorithm_1.dom_runRemovingSteps(node, parent);
    }
    /**
     * 14. If node is custom, then enqueue a custom element callback
     * reaction with node, callback name "disconnectedCallback",
     * and an empty argument list.
     */
    if (DOMImpl_1.dom.features.customElements) {
        if (util_1.Guard.isCustomElementNode(node)) {
            CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction(node, "disconnectedCallback", []);
        }
    }
    /**
     * 15. For each shadow-including descendant descendant of node,
     * in shadow-including tree order, then:
     */
    var descendant = TreeAlgorithm_1.tree_getFirstDescendantNode(node, false, true);
    while (descendant !== null) {
        /**
         * 15.1. Run the removing steps with descendant.
         */
        if (DOMImpl_1.dom.features.steps) {
            DOMAlgorithm_1.dom_runRemovingSteps(descendant, node);
        }
        /**
         * 15.2. If descendant is custom, then enqueue a custom element
         * callback reaction with descendant, callback name
         * "disconnectedCallback", and an empty argument list.
         */
        if (DOMImpl_1.dom.features.customElements) {
            if (util_1.Guard.isCustomElementNode(descendant)) {
                CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction(descendant, "disconnectedCallback", []);
            }
        }
        descendant = TreeAlgorithm_1.tree_getNextDescendantNode(node, descendant, false, true);
    }
    /**
     * 16. For each inclusive ancestor inclusiveAncestor of parent, and
     * then for each registered of inclusiveAncestor's registered
     * observer list, if registered's options's subtree is true,
     * then append a new transient registered observer whose
     * observer is registered's observer, options is registered's
     * options, and source is registered to node's registered
     * observer list.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        var inclusiveAncestor = TreeAlgorithm_1.tree_getFirstAncestorNode(parent, true);
        while (inclusiveAncestor !== null) {
            try {
                for (var _l = (e_14 = void 0, __values(inclusiveAncestor._registeredObserverList)), _m = _l.next(); !_m.done; _m = _l.next()) {
                    var registered = _m.value;
                    if (registered.options.subtree) {
                        node._registeredObserverList.push({
                            observer: registered.observer,
                            options: registered.options,
                            source: registered
                        });
                    }
                }
            }
            catch (e_14_1) { e_14 = { error: e_14_1 }; }
            finally {
                try {
                    if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
                }
                finally { if (e_14) throw e_14.error; }
            }
            inclusiveAncestor = TreeAlgorithm_1.tree_getNextAncestorNode(parent, inclusiveAncestor, true);
        }
    }
    /**
     * 17. If suppress observers flag is unset, then queue a tree mutation
     * record for parent with « », « node », oldPreviousSibling, and
     * oldNextSibling.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        if (!suppressObservers) {
            MutationObserverAlgorithm_1.observer_queueTreeMutationRecord(parent, [], [node], oldPreviousSibling, oldNextSibling);
        }
    }
    /**
     * 18. If node is a Text node, then run the child text content change steps
     * for parent.
     */
    if (DOMImpl_1.dom.features.steps) {
        if (util_1.Guard.isTextNode(node)) {
            DOMAlgorithm_1.dom_runChildTextContentChangeSteps(parent);
        }
    }
}
exports.mutation_remove = mutation_remove;
//# sourceMappingURL=MutationAlgorithm.js.map