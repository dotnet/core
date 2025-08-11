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
var EventTargetImpl_1 = require("./EventTargetImpl");
var util_1 = require("../util");
var DOMException_1 = require("./DOMException");
var algorithm_1 = require("../algorithm");
var URLAlgorithm_1 = require("@oozcitak/url/lib/URLAlgorithm");
var WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents a generic XML node.
 */
var NodeImpl = /** @class */ (function (_super) {
    __extends(NodeImpl, _super);
    /**
     * Initializes a new instance of `Node`.
     */
    function NodeImpl() {
        var _this = _super.call(this) || this;
        _this._parent = null;
        _this._firstChild = null;
        _this._lastChild = null;
        _this._previousSibling = null;
        _this._nextSibling = null;
        return _this;
    }
    Object.defineProperty(NodeImpl.prototype, "_childNodes", {
        get: function () {
            return this.__childNodes || (this.__childNodes = algorithm_1.create_nodeList(this));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeImpl.prototype, "_nodeDocument", {
        get: function () { return this._nodeDocumentOverride || DOMImpl_1.dom.window._associatedDocument; },
        set: function (val) { this._nodeDocumentOverride = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeImpl.prototype, "_registeredObserverList", {
        get: function () {
            return this.__registeredObserverList || (this.__registeredObserverList = []);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeImpl.prototype, "nodeType", {
        /** @inheritdoc */
        get: function () { return this._nodeType; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeImpl.prototype, "nodeName", {
        /**
         * Returns a string appropriate for the type of node.
         */
        get: function () {
            if (util_1.Guard.isElementNode(this)) {
                return this._htmlUppercasedQualifiedName;
            }
            else if (util_1.Guard.isAttrNode(this)) {
                return this._qualifiedName;
            }
            else if (util_1.Guard.isExclusiveTextNode(this)) {
                return "#text";
            }
            else if (util_1.Guard.isCDATASectionNode(this)) {
                return "#cdata-section";
            }
            else if (util_1.Guard.isProcessingInstructionNode(this)) {
                return this._target;
            }
            else if (util_1.Guard.isCommentNode(this)) {
                return "#comment";
            }
            else if (util_1.Guard.isDocumentNode(this)) {
                return "#document";
            }
            else if (util_1.Guard.isDocumentTypeNode(this)) {
                return this._name;
            }
            else if (util_1.Guard.isDocumentFragmentNode(this)) {
                return "#document-fragment";
            }
            else {
                return "";
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeImpl.prototype, "baseURI", {
        /**
         * Gets the absolute base URL of the node.
         */
        get: function () {
            /**
             * The baseURI attribute’s getter must return node document’s document
             * base URL, serialized.
             * TODO: Implement in HTML DOM
             * https://html.spec.whatwg.org/multipage/urls-and-fetching.html#document-base-url
             */
            return URLAlgorithm_1.urlSerializer(this._nodeDocument._URL);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeImpl.prototype, "isConnected", {
        /**
         * Returns whether the node is rooted to a document node.
         */
        get: function () {
            /**
             * The isConnected attribute’s getter must return true, if context object
             * is connected, and false otherwise.
             */
            return util_1.Guard.isElementNode(this) && algorithm_1.shadowTree_isConnected(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeImpl.prototype, "ownerDocument", {
        /**
         * Returns the parent document.
         */
        get: function () {
            /**
             * The ownerDocument attribute’s getter must return null, if the context
             * object is a document, and the context object’s node document otherwise.
             * _Note:_ The node document of a document is that document itself. All
             * nodes have a node document at all times.
             */
            if (this._nodeType === interfaces_1.NodeType.Document)
                return null;
            else
                return this._nodeDocument;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the root node.
     *
     * @param options - if options has `composed = true` this function
     * returns the node's shadow-including root, otherwise it returns
     * the node's root node.
     */
    NodeImpl.prototype.getRootNode = function (options) {
        /**
         * The getRootNode(options) method, when invoked, must return context
         * object’s shadow-including root if options’s composed is true,
         * and context object’s root otherwise.
         */
        return algorithm_1.tree_rootNode(this, !!options && options.composed);
    };
    Object.defineProperty(NodeImpl.prototype, "parentNode", {
        /**
         * Returns the parent node.
         */
        get: function () {
            /**
             * The parentNode attribute’s getter must return the context object’s parent.
             * _Note:_ An Attr node has no parent.
             */
            if (this._nodeType === interfaces_1.NodeType.Attribute) {
                return null;
            }
            else {
                return this._parent;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeImpl.prototype, "parentElement", {
        /**
         * Returns the parent element.
         */
        get: function () {
            /**
             * The parentElement attribute’s getter must return the context object’s
             * parent element.
             */
            if (this._parent && util_1.Guard.isElementNode(this._parent)) {
                return this._parent;
            }
            else {
                return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Determines whether a node has any children.
     */
    NodeImpl.prototype.hasChildNodes = function () {
        /**
         * The hasChildNodes() method, when invoked, must return true if the context
         * object has children, and false otherwise.
         */
        return (this._firstChild !== null);
    };
    Object.defineProperty(NodeImpl.prototype, "childNodes", {
        /**
         * Returns a {@link NodeList} of child nodes.
         */
        get: function () {
            /**
             * The childNodes attribute’s getter must return a NodeList rooted at the
             * context object matching only children.
             */
            return this._childNodes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeImpl.prototype, "firstChild", {
        /**
         * Returns the first child node.
         */
        get: function () {
            /**
             * The firstChild attribute’s getter must return the context object’s first
             * child.
             */
            return this._firstChild;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeImpl.prototype, "lastChild", {
        /**
         * Returns the last child node.
         */
        get: function () {
            /**
             * The lastChild attribute’s getter must return the context object’s last
             * child.
             */
            return this._lastChild;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeImpl.prototype, "previousSibling", {
        /**
         * Returns the previous sibling node.
         */
        get: function () {
            /**
             * The previousSibling attribute’s getter must return the context object’s
             * previous sibling.
             * _Note:_ An Attr node has no siblings.
             */
            return this._previousSibling;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeImpl.prototype, "nextSibling", {
        /**
         * Returns the next sibling node.
         */
        get: function () {
            /**
             * The nextSibling attribute’s getter must return the context object’s
             * next sibling.
             */
            return this._nextSibling;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeImpl.prototype, "nodeValue", {
        /**
         * Gets or sets the data associated with a {@link CharacterData} node or the
         * value of an {@link @Attr} node. For other node types returns `null`.
         */
        get: function () {
            if (util_1.Guard.isAttrNode(this)) {
                return this._value;
            }
            else if (util_1.Guard.isCharacterDataNode(this)) {
                return this._data;
            }
            else {
                return null;
            }
        },
        set: function (value) {
            if (value === null) {
                value = '';
            }
            if (util_1.Guard.isAttrNode(this)) {
                algorithm_1.attr_setAnExistingAttributeValue(this, value);
            }
            else if (util_1.Guard.isCharacterDataNode(this)) {
                algorithm_1.characterData_replaceData(this, 0, this._data.length, value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeImpl.prototype, "textContent", {
        /**
         * Returns the concatenation of data of all the {@link Text}
         * node descendants in tree order. When set, replaces the text
         * contents of the node with the given value.
         */
        get: function () {
            if (util_1.Guard.isDocumentFragmentNode(this) || util_1.Guard.isElementNode(this)) {
                return algorithm_1.text_descendantTextContent(this);
            }
            else if (util_1.Guard.isAttrNode(this)) {
                return this._value;
            }
            else if (util_1.Guard.isCharacterDataNode(this)) {
                return this._data;
            }
            else {
                return null;
            }
        },
        set: function (value) {
            if (value === null) {
                value = '';
            }
            if (util_1.Guard.isDocumentFragmentNode(this) || util_1.Guard.isElementNode(this)) {
                algorithm_1.node_stringReplaceAll(value, this);
            }
            else if (util_1.Guard.isAttrNode(this)) {
                algorithm_1.attr_setAnExistingAttributeValue(this, value);
            }
            else if (util_1.Guard.isCharacterDataNode(this)) {
                algorithm_1.characterData_replaceData(this, 0, algorithm_1.tree_nodeLength(this), value);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Puts all {@link Text} nodes in the full depth of the sub-tree
     * underneath this node into a "normal" form where only markup
     * (e.g., tags, comments, processing instructions, CDATA sections,
     * and entity references) separates {@link Text} nodes, i.e., there
     * are no adjacent Text nodes.
     */
    NodeImpl.prototype.normalize = function () {
        var e_1, _a, e_2, _b;
        /**
         * The normalize() method, when invoked, must run these steps for each
         * descendant exclusive Text node node of context object:
         */
        var descendantNodes = [];
        var node = algorithm_1.tree_getFirstDescendantNode(this, false, false, function (e) { return util_1.Guard.isExclusiveTextNode(e); });
        while (node !== null) {
            descendantNodes.push(node);
            node = algorithm_1.tree_getNextDescendantNode(this, node, false, false, function (e) { return util_1.Guard.isExclusiveTextNode(e); });
        }
        for (var i = 0; i < descendantNodes.length; i++) {
            var node_1 = descendantNodes[i];
            if (node_1._parent === null)
                continue;
            /**
             * 1. Let length be node’s length.
             * 2. If length is zero, then remove node and continue with the next
             * exclusive Text node, if any.
             */
            var length = algorithm_1.tree_nodeLength(node_1);
            if (length === 0) {
                algorithm_1.mutation_remove(node_1, node_1._parent);
                continue;
            }
            /**
             * 3. Let data be the concatenation of the data of node’s contiguous
             * exclusive Text nodes (excluding itself), in tree order.
             */
            var textSiblings = [];
            var data = '';
            try {
                for (var _c = (e_1 = void 0, __values(algorithm_1.text_contiguousExclusiveTextNodes(node_1))), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var sibling = _d.value;
                    textSiblings.push(sibling);
                    data += sibling._data;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            /**
             * 4. Replace data with node node, offset length, count 0, and data data.
             */
            algorithm_1.characterData_replaceData(node_1, length, 0, data);
            /**
             * 5. Let currentNode be node’s next sibling.
             * 6. While currentNode is an exclusive Text node:
             */
            if (DOMImpl_1.dom.rangeList.size !== 0) {
                var currentNode = node_1._nextSibling;
                while (currentNode !== null && util_1.Guard.isExclusiveTextNode(currentNode)) {
                    /**
                     * 6.1. For each live range whose start node is currentNode, add length
                     * to its start offset and set its start node to node.
                     * 6.2. For each live range whose end node is currentNode, add length to
                     * its end offset and set its end node to node.
                     * 6.3. For each live range whose start node is currentNode’s parent and
                     * start offset is currentNode’s index, set its start node to node and
                     * its start offset to length.
                     * 6.4. For each live range whose end node is currentNode’s parent and
                     * end offset is currentNode’s index, set its end node to node and its
                     * end offset to length.
                     */
                    var cn = currentNode;
                    var index = algorithm_1.tree_index(cn);
                    try {
                        for (var _e = (e_2 = void 0, __values(DOMImpl_1.dom.rangeList)), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var range = _f.value;
                            if (range._start[0] === cn) {
                                range._start[0] = node_1;
                                range._start[1] += length;
                            }
                            if (range._end[0] === cn) {
                                range._end[0] = node_1;
                                range._end[1] += length;
                            }
                            if (range._start[0] === cn._parent && range._start[1] === index) {
                                range._start[0] = node_1;
                                range._start[1] = length;
                            }
                            if (range._end[0] === cn._parent && range._end[1] === index) {
                                range._end[0] = node_1;
                                range._end[1] = length;
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    /**
                     * 6.5. Add currentNode’s length to length.
                     * 6.6. Set currentNode to its next sibling.
                     */
                    length += algorithm_1.tree_nodeLength(currentNode);
                    currentNode = currentNode._nextSibling;
                }
            }
            /**
             * 7. Remove node’s contiguous exclusive Text nodes (excluding itself),
             * in tree order.
             */
            for (var i_1 = 0; i_1 < textSiblings.length; i_1++) {
                var sibling = textSiblings[i_1];
                if (sibling._parent === null)
                    continue;
                algorithm_1.mutation_remove(sibling, sibling._parent);
            }
        }
    };
    /**
     * Returns a duplicate of this node, i.e., serves as a generic copy
     * constructor for nodes. The duplicate node has no parent
     * ({@link parentNode} returns `null`).
     *
     * @param deep - if `true`, recursively clone the subtree under the
     * specified node. If `false`, clone only the node itself (and its
     * attributes, if it is an {@link Element}).
     */
    NodeImpl.prototype.cloneNode = function (deep) {
        if (deep === void 0) { deep = false; }
        /**
         * 1. If context object is a shadow root, then throw a "NotSupportedError"
         * DOMException.
         * 2. Return a clone of the context object, with the clone children flag set
         * if deep is true.
         */
        if (util_1.Guard.isShadowRoot(this))
            throw new DOMException_1.NotSupportedError();
        return algorithm_1.node_clone(this, null, deep);
    };
    /**
     * Determines if the given node is equal to this one.
     *
     * @param node - the node to compare with
     */
    NodeImpl.prototype.isEqualNode = function (node) {
        if (node === void 0) { node = null; }
        /**
         * The isEqualNode(otherNode) method, when invoked, must return true if
         * otherNode is non-null and context object equals otherNode, and false
         * otherwise.
         */
        return (node !== null && algorithm_1.node_equals(this, node));
    };
    /**
     * Determines if the given node is reference equal to this one.
     *
     * @param node - the node to compare with
     */
    NodeImpl.prototype.isSameNode = function (node) {
        if (node === void 0) { node = null; }
        /**
         * The isSameNode(otherNode) method, when invoked, must return true if
         * otherNode is context object, and false otherwise.
         */
        return (this === node);
    };
    /**
     * Returns a bitmask indicating the position of the given `node`
     * relative to this node.
     */
    NodeImpl.prototype.compareDocumentPosition = function (other) {
        /**
         * 1. If context object is other, then return zero.
         * 2. Let node1 be other and node2 be context object.
         * 3. Let attr1 and attr2 be null.
         * attr1’s element.
         */
        if (other === this)
            return 0;
        var node1 = other;
        var node2 = this;
        var attr1 = null;
        var attr2 = null;
        /**
         * 4. If node1 is an attribute, then set attr1 to node1 and node1 to
         * attr1’s element.
         */
        if (util_1.Guard.isAttrNode(node1)) {
            attr1 = node1;
            node1 = attr1._element;
        }
        /**
         * 5. If node2 is an attribute, then:
         */
        if (util_1.Guard.isAttrNode(node2)) {
            /**
             * 5.1. Set attr2 to node2 and node2 to attr2’s element.
             */
            attr2 = node2;
            node2 = attr2._element;
            /**
             * 5.2. If attr1 and node1 are non-null, and node2 is node1, then:
             */
            if (attr1 && node1 && (node1 === node2)) {
                /**
                 * 5.2. For each attr in node2’s attribute list:
                 */
                for (var i = 0; i < node2._attributeList.length; i++) {
                    var attr = node2._attributeList[i];
                    /**
                     * 5.2.1. If attr equals attr1, then return the result of adding
                     * DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC and
                     * DOCUMENT_POSITION_PRECEDING.
                     * 5.2.2. If attr equals attr2, then return the result of adding
                     * DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC and
                     * DOCUMENT_POSITION_FOLLOWING.
                     */
                    if (algorithm_1.node_equals(attr, attr1)) {
                        return interfaces_1.Position.ImplementationSpecific | interfaces_1.Position.Preceding;
                    }
                    else if (algorithm_1.node_equals(attr, attr2)) {
                        return interfaces_1.Position.ImplementationSpecific | interfaces_1.Position.Following;
                    }
                }
            }
        }
        /**
         * 6. If node1 or node2 is null, or node1’s root is not node2’s root, then
         * return the result of adding DOCUMENT_POSITION_DISCONNECTED,
         * DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC, and either
         * DOCUMENT_POSITION_PRECEDING or DOCUMENT_POSITION_FOLLOWING,
         * with the constraint that this is to be consistent, together.
         */
        if (node1 === null || node2 === null ||
            algorithm_1.tree_rootNode(node1) !== algorithm_1.tree_rootNode(node2)) {
            // nodes are disconnected
            // return a random result but cache the value for consistency
            return interfaces_1.Position.Disconnected | interfaces_1.Position.ImplementationSpecific |
                (DOMImpl_1.dom.compareCache.check(this, other) ? interfaces_1.Position.Preceding : interfaces_1.Position.Following);
        }
        /**
         * 7. If node1 is an ancestor of node2 and attr1 is null, or node1 is node2
         * and attr2 is non-null, then return the result of adding
         * DOCUMENT_POSITION_CONTAINS to DOCUMENT_POSITION_PRECEDING.
         */
        if ((!attr1 && algorithm_1.tree_isAncestorOf(node2, node1)) ||
            (attr2 && (node1 === node2))) {
            return interfaces_1.Position.Contains | interfaces_1.Position.Preceding;
        }
        /**
         * 8. If node1 is a descendant of node2 and attr2 is null, or node1 is node2
         * and attr1 is non-null, then return the result of adding
         * DOCUMENT_POSITION_CONTAINED_BY to DOCUMENT_POSITION_FOLLOWING.
         */
        if ((!attr2 && algorithm_1.tree_isDescendantOf(node2, node1)) ||
            (attr1 && (node1 === node2))) {
            return interfaces_1.Position.ContainedBy | interfaces_1.Position.Following;
        }
        /**
         * 9. If node1 is preceding node2, then return DOCUMENT_POSITION_PRECEDING.
         */
        if (algorithm_1.tree_isPreceding(node2, node1))
            return interfaces_1.Position.Preceding;
        /**
         * 10. Return DOCUMENT_POSITION_FOLLOWING.
         */
        return interfaces_1.Position.Following;
    };
    /**
     * Returns `true` if given node is an inclusive descendant of this
     * node, and `false` otherwise (including when other node is `null`).
     *
     * @param other - the node to check
     */
    NodeImpl.prototype.contains = function (other) {
        /**
         * The contains(other) method, when invoked, must return true if other is an
         * inclusive descendant of context object, and false otherwise (including
         * when other is null).
         */
        if (other === null)
            return false;
        return algorithm_1.tree_isDescendantOf(this, other, true);
    };
    /**
     * Returns the prefix for a given namespace URI, if present, and
     * `null` if not.
     *
     * @param namespace - the namespace to search
     */
    NodeImpl.prototype.lookupPrefix = function (namespace) {
        /**
         * 1. If namespace is null or the empty string, then return null.
         * 2. Switch on the context object:
         */
        if (!namespace)
            return null;
        if (util_1.Guard.isElementNode(this)) {
            /**
             * Return the result of locating a namespace prefix for it using
             * namespace.
             */
            return algorithm_1.node_locateANamespacePrefix(this, namespace);
        }
        else if (util_1.Guard.isDocumentNode(this)) {
            /**
             * Return the result of locating a namespace prefix for its document
             * element, if its document element is non-null, and null otherwise.
             */
            if (this.documentElement === null) {
                return null;
            }
            else {
                return algorithm_1.node_locateANamespacePrefix(this.documentElement, namespace);
            }
        }
        else if (util_1.Guard.isDocumentTypeNode(this) || util_1.Guard.isDocumentFragmentNode(this)) {
            return null;
        }
        else if (util_1.Guard.isAttrNode(this)) {
            /**
             * Return the result of locating a namespace prefix for its element,
             * if its element is non-null, and null otherwise.
             */
            if (this._element === null) {
                return null;
            }
            else {
                return algorithm_1.node_locateANamespacePrefix(this._element, namespace);
            }
        }
        else {
            /**
             * Return the result of locating a namespace prefix for its parent
             * element, if its parent element is non-null, and null otherwise.
             */
            if (this._parent !== null && util_1.Guard.isElementNode(this._parent)) {
                return algorithm_1.node_locateANamespacePrefix(this._parent, namespace);
            }
            else {
                return null;
            }
        }
    };
    /**
     * Returns the namespace URI for a given prefix if present, and `null`
     * if not.
     *
     * @param prefix - the prefix to search
     */
    NodeImpl.prototype.lookupNamespaceURI = function (prefix) {
        /**
         * 1. If prefix is the empty string, then set it to null.
         * 2. Return the result of running locate a namespace for the context object
         * using prefix.
         */
        return algorithm_1.node_locateANamespace(this, prefix || null);
    };
    /**
     * Returns `true` if the namespace is the default namespace on this
     * node or `false` if not.
     *
     * @param namespace - the namespace to check
     */
    NodeImpl.prototype.isDefaultNamespace = function (namespace) {
        /**
         * 1. If namespace is the empty string, then set it to null.
         * 2. Let defaultNamespace be the result of running locate a namespace for
         * context object using null.
         * 3. Return true if defaultNamespace is the same as namespace, and false otherwise.
         */
        if (!namespace)
            namespace = null;
        var defaultNamespace = algorithm_1.node_locateANamespace(this, null);
        return (defaultNamespace === namespace);
    };
    /**
     * Inserts the node `newChild` before the existing child node
     * `refChild`. If `refChild` is `null`, inserts `newChild` at the end
     * of the list of children.
     *
     * If `newChild` is a {@link DocumentFragment} object, all of its
     * children are inserted, in the same order, before `refChild`.
     *
     * If `newChild` is already in the tree, it is first removed.
     *
     * @param newChild - the node to insert
     * @param refChild - the node before which the new node must be
     *   inserted
     *
     * @returns the newly inserted child node
     */
    NodeImpl.prototype.insertBefore = function (newChild, refChild) {
        /**
         * The insertBefore(node, child) method, when invoked, must return the
         * result of pre-inserting node into context object before child.
         */
        return algorithm_1.mutation_preInsert(newChild, this, refChild);
    };
    /**
     * Adds the node `newChild` to the end of the list of children of this
     * node, and returns it. If `newChild` is already in the tree, it is
     * first removed.
     *
     * If `newChild` is a {@link DocumentFragment} object, the entire
     * contents of the document fragment are moved into the child list of
     * this node.
     *
     * @param newChild - the node to add
     *
     * @returns the newly inserted child node
     */
    NodeImpl.prototype.appendChild = function (newChild) {
        /**
         * The appendChild(node) method, when invoked, must return the result of
         * appending node to context object.
         */
        return algorithm_1.mutation_append(newChild, this);
    };
    /**
     * Replaces the child node `oldChild` with `newChild` in the list of
     * children, and returns the `oldChild` node. If `newChild` is already
     * in the tree, it is first removed.
     *
     * @param newChild - the new node to put in the child list
     * @param oldChild - the node being replaced in the list
     *
     * @returns the removed child node
     */
    NodeImpl.prototype.replaceChild = function (newChild, oldChild) {
        /**
         * The replaceChild(node, child) method, when invoked, must return the
         * result of replacing child with node within context object.
         */
        return algorithm_1.mutation_replace(oldChild, newChild, this);
    };
    /**
    * Removes the child node indicated by `oldChild` from the list of
    * children, and returns it.
    *
    * @param oldChild - the node being removed from the list
    *
    * @returns the removed child node
    */
    NodeImpl.prototype.removeChild = function (oldChild) {
        /**
         * The removeChild(child) method, when invoked, must return the result of
         * pre-removing child from context object.
         */
        return algorithm_1.mutation_preRemove(oldChild, this);
    };
    /**
     * Gets the parent event target for the given event.
     *
     * @param event - an event
     */
    NodeImpl.prototype._getTheParent = function (event) {
        /**
         * A node’s get the parent algorithm, given an event, returns the node’s
         * assigned slot, if node is assigned, and node’s parent otherwise.
         */
        if (util_1.Guard.isSlotable(this) && algorithm_1.shadowTree_isAssigned(this)) {
            return this._assignedSlot;
        }
        else {
            return this._parent;
        }
    };
    NodeImpl.ELEMENT_NODE = 1;
    NodeImpl.ATTRIBUTE_NODE = 2;
    NodeImpl.TEXT_NODE = 3;
    NodeImpl.CDATA_SECTION_NODE = 4;
    NodeImpl.ENTITY_REFERENCE_NODE = 5;
    NodeImpl.ENTITY_NODE = 6;
    NodeImpl.PROCESSING_INSTRUCTION_NODE = 7;
    NodeImpl.COMMENT_NODE = 8;
    NodeImpl.DOCUMENT_NODE = 9;
    NodeImpl.DOCUMENT_TYPE_NODE = 10;
    NodeImpl.DOCUMENT_FRAGMENT_NODE = 11;
    NodeImpl.NOTATION_NODE = 12;
    NodeImpl.DOCUMENT_POSITION_DISCONNECTED = 0x01;
    NodeImpl.DOCUMENT_POSITION_PRECEDING = 0x02;
    NodeImpl.DOCUMENT_POSITION_FOLLOWING = 0x04;
    NodeImpl.DOCUMENT_POSITION_CONTAINS = 0x08;
    NodeImpl.DOCUMENT_POSITION_CONTAINED_BY = 0x10;
    NodeImpl.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 0x20;
    return NodeImpl;
}(EventTargetImpl_1.EventTargetImpl));
exports.NodeImpl = NodeImpl;
/**
 * A performance tweak to share an empty set between all node classes. This will
 * be overwritten by element, document and document fragment nodes to supply an
 * actual set of nodes.
 */
NodeImpl.prototype._children = new util_1.EmptySet();
/**
 * Define constants on prototype.
 */
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "ELEMENT_NODE", 1);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "ATTRIBUTE_NODE", 2);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "TEXT_NODE", 3);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "CDATA_SECTION_NODE", 4);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "ENTITY_REFERENCE_NODE", 5);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "ENTITY_NODE", 6);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "PROCESSING_INSTRUCTION_NODE", 7);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "COMMENT_NODE", 8);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "DOCUMENT_NODE", 9);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "DOCUMENT_TYPE_NODE", 10);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "DOCUMENT_FRAGMENT_NODE", 11);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "NOTATION_NODE", 12);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "DOCUMENT_POSITION_DISCONNECTED", 0x01);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "DOCUMENT_POSITION_PRECEDING", 0x02);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "DOCUMENT_POSITION_FOLLOWING", 0x04);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "DOCUMENT_POSITION_CONTAINS", 0x08);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "DOCUMENT_POSITION_CONTAINED_BY", 0x10);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC", 0x20);
//# sourceMappingURL=NodeImpl.js.map