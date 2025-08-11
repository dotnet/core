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
var util_1 = require("../util");
var interfaces_1 = require("../dom/interfaces");
/**
 * Gets the next descendant of the given node of the tree rooted at `root`
 * in depth-first pre-order.
 *
 * @param root - root node of the tree
 * @param node - a node
 * @param shadow - whether to visit shadow tree nodes
 */
function _getNextDescendantNode(root, node, shadow) {
    if (shadow === void 0) { shadow = false; }
    // traverse shadow tree
    if (shadow && util_1.Guard.isElementNode(node) && util_1.Guard.isShadowRoot(node.shadowRoot)) {
        if (node.shadowRoot._firstChild)
            return node.shadowRoot._firstChild;
    }
    // traverse child nodes
    if (node._firstChild)
        return node._firstChild;
    if (node === root)
        return null;
    // traverse siblings
    if (node._nextSibling)
        return node._nextSibling;
    // traverse parent's next sibling
    var parent = node._parent;
    while (parent && parent !== root) {
        if (parent._nextSibling)
            return parent._nextSibling;
        parent = parent._parent;
    }
    return null;
}
function _emptyIterator() {
    var _a;
    return _a = {},
        _a[Symbol.iterator] = function () {
            return {
                next: function () {
                    return { done: true, value: null };
                }
            };
        },
        _a;
}
/**
 * Returns the first descendant node of the tree rooted at `node` in
 * depth-first pre-order.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param shadow - whether to visit shadow tree nodes
 * @param filter - a function to filter nodes
 */
function tree_getFirstDescendantNode(node, self, shadow, filter) {
    if (self === void 0) { self = false; }
    if (shadow === void 0) { shadow = false; }
    var firstNode = (self ? node : _getNextDescendantNode(node, node, shadow));
    while (firstNode && filter && !filter(firstNode)) {
        firstNode = _getNextDescendantNode(node, firstNode, shadow);
    }
    return firstNode;
}
exports.tree_getFirstDescendantNode = tree_getFirstDescendantNode;
/**
 * Returns the next descendant node of the tree rooted at `node` in
 * depth-first pre-order.
 *
 * @param node - root node of the tree
 * @param currentNode - current descendant node
 * @param self - whether to include `node` in traversal
 * @param shadow - whether to visit shadow tree nodes
 * @param filter - a function to filter nodes
 */
function tree_getNextDescendantNode(node, currentNode, self, shadow, filter) {
    if (self === void 0) { self = false; }
    if (shadow === void 0) { shadow = false; }
    var nextNode = _getNextDescendantNode(node, currentNode, shadow);
    while (nextNode && filter && !filter(nextNode)) {
        nextNode = _getNextDescendantNode(node, nextNode, shadow);
    }
    return nextNode;
}
exports.tree_getNextDescendantNode = tree_getNextDescendantNode;
/**
 * Traverses through all descendant nodes of the tree rooted at
 * `node` in depth-first pre-order.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param shadow - whether to visit shadow tree nodes
 * @param filter - a function to filter nodes
 */
function tree_getDescendantNodes(node, self, shadow, filter) {
    var _a;
    if (self === void 0) { self = false; }
    if (shadow === void 0) { shadow = false; }
    if (!self && node._children.size === 0) {
        return _emptyIterator();
    }
    return _a = {},
        _a[Symbol.iterator] = function () {
            var currentNode = (self ? node : _getNextDescendantNode(node, node, shadow));
            return {
                next: function () {
                    while (currentNode && filter && !filter(currentNode)) {
                        currentNode = _getNextDescendantNode(node, currentNode, shadow);
                    }
                    if (currentNode === null) {
                        return { done: true, value: null };
                    }
                    else {
                        var result = { done: false, value: currentNode };
                        currentNode = _getNextDescendantNode(node, currentNode, shadow);
                        return result;
                    }
                }
            };
        },
        _a;
}
exports.tree_getDescendantNodes = tree_getDescendantNodes;
/**
 * Traverses through all descendant element nodes of the tree rooted at
 * `node` in depth-first preorder.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param shadow - whether to visit shadow tree nodes
 * @param filter - a function to filter nodes
 */
function tree_getDescendantElements(node, self, shadow, filter) {
    var _a;
    if (self === void 0) { self = false; }
    if (shadow === void 0) { shadow = false; }
    if (!self && node._children.size === 0) {
        return _emptyIterator();
    }
    return _a = {},
        _a[Symbol.iterator] = function () {
            var it = tree_getDescendantNodes(node, self, shadow, function (e) { return util_1.Guard.isElementNode(e); })[Symbol.iterator]();
            var currentNode = it.next().value;
            return {
                next: function () {
                    while (currentNode && filter && !filter(currentNode)) {
                        currentNode = it.next().value;
                    }
                    if (currentNode === null) {
                        return { done: true, value: null };
                    }
                    else {
                        var result = { done: false, value: currentNode };
                        currentNode = it.next().value;
                        return result;
                    }
                }
            };
        },
        _a;
}
exports.tree_getDescendantElements = tree_getDescendantElements;
/**
 * Traverses through all sibling nodes of `node`.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param filter - a function to filter nodes
 */
function tree_getSiblingNodes(node, self, filter) {
    var _a;
    if (self === void 0) { self = false; }
    if (!node._parent || node._parent._children.size === 0) {
        return _emptyIterator();
    }
    return _a = {},
        _a[Symbol.iterator] = function () {
            var currentNode = node._parent ? node._parent._firstChild : null;
            return {
                next: function () {
                    while (currentNode && (filter && !filter(currentNode) || (!self && currentNode === node))) {
                        currentNode = currentNode._nextSibling;
                    }
                    if (currentNode === null) {
                        return { done: true, value: null };
                    }
                    else {
                        var result = { done: false, value: currentNode };
                        currentNode = currentNode._nextSibling;
                        return result;
                    }
                }
            };
        },
        _a;
}
exports.tree_getSiblingNodes = tree_getSiblingNodes;
/**
 * Gets the first ancestor of `node` in reverse tree order.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param filter - a function to filter nodes
 */
function tree_getFirstAncestorNode(node, self, filter) {
    if (self === void 0) { self = false; }
    var firstNode = self ? node : node._parent;
    while (firstNode && filter && !filter(firstNode)) {
        firstNode = firstNode._parent;
    }
    return firstNode;
}
exports.tree_getFirstAncestorNode = tree_getFirstAncestorNode;
/**
 * Gets the first ancestor of `node` in reverse tree order.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param filter - a function to filter nodes
 */
function tree_getNextAncestorNode(node, currentNode, self, filter) {
    if (self === void 0) { self = false; }
    var nextNode = currentNode._parent;
    while (nextNode && filter && !filter(nextNode)) {
        nextNode = nextNode._parent;
    }
    return nextNode;
}
exports.tree_getNextAncestorNode = tree_getNextAncestorNode;
/**
 * Traverses through all ancestor nodes `node` in reverse tree order.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param filter - a function to filter nodes
 */
function tree_getAncestorNodes(node, self, filter) {
    var _a;
    if (self === void 0) { self = false; }
    if (!self && !node._parent) {
        return _emptyIterator();
    }
    return _a = {},
        _a[Symbol.iterator] = function () {
            var currentNode = tree_getFirstAncestorNode(node, self, filter);
            return {
                next: function () {
                    if (currentNode === null) {
                        return { done: true, value: null };
                    }
                    else {
                        var result = { done: false, value: currentNode };
                        currentNode = tree_getNextAncestorNode(node, currentNode, self, filter);
                        return result;
                    }
                }
            };
        },
        _a;
}
exports.tree_getAncestorNodes = tree_getAncestorNodes;
/**
 * Returns the common ancestor of the given nodes.
 *
 * @param nodeA - a node
 * @param nodeB - a node
 */
function tree_getCommonAncestor(nodeA, nodeB) {
    if (nodeA === nodeB) {
        return nodeA._parent;
    }
    // lists of parent nodes
    var parentsA = [];
    var parentsB = [];
    var pA = tree_getFirstAncestorNode(nodeA, true);
    while (pA !== null) {
        parentsA.push(pA);
        pA = tree_getNextAncestorNode(nodeA, pA, true);
    }
    var pB = tree_getFirstAncestorNode(nodeB, true);
    while (pB !== null) {
        parentsB.push(pB);
        pB = tree_getNextAncestorNode(nodeB, pB, true);
    }
    // walk through parents backwards until they differ
    var pos1 = parentsA.length;
    var pos2 = parentsB.length;
    var parent = null;
    for (var i = Math.min(pos1, pos2); i > 0; i--) {
        var parent1 = parentsA[--pos1];
        var parent2 = parentsB[--pos2];
        if (parent1 !== parent2) {
            break;
        }
        parent = parent1;
    }
    return parent;
}
exports.tree_getCommonAncestor = tree_getCommonAncestor;
/**
 * Returns the node following `node` in depth-first preorder.
 *
 * @param root - root of the subtree
 * @param node - a node
 */
function tree_getFollowingNode(root, node) {
    if (node._firstChild) {
        return node._firstChild;
    }
    else if (node._nextSibling) {
        return node._nextSibling;
    }
    else {
        while (true) {
            var parent = node._parent;
            if (parent === null || parent === root) {
                return null;
            }
            else if (parent._nextSibling) {
                return parent._nextSibling;
            }
            else {
                node = parent;
            }
        }
    }
}
exports.tree_getFollowingNode = tree_getFollowingNode;
/**
 * Returns the node preceding `node` in depth-first preorder.
 *
 * @param root - root of the subtree
 * @param node - a node
 */
function tree_getPrecedingNode(root, node) {
    if (node === root) {
        return null;
    }
    if (node._previousSibling) {
        node = node._previousSibling;
        if (node._lastChild) {
            return node._lastChild;
        }
        else {
            return node;
        }
    }
    else {
        return node._parent;
    }
}
exports.tree_getPrecedingNode = tree_getPrecedingNode;
/**
 * Determines if the node tree is constrained. A node tree is
 * constrained as follows, expressed as a relationship between the
 * type of node and its allowed children:
 *  - Document (In tree order)
 *    * Zero or more nodes each of which is ProcessingInstruction
 *      or Comment.
 *    * Optionally one DocumentType node.
 *    * Zero or more nodes each of which is ProcessingInstruction
 *      or Comment.
 *    * Optionally one Element node.
 *    * Zero or more nodes each of which is ProcessingInstruction
 *      or Comment.
 *  - DocumentFragment, Element
 *    * Zero or more nodes each of which is Element, Text,
 *      ProcessingInstruction, or Comment.
 *  - DocumentType, Text, ProcessingInstruction, Comment
 *    * None.
 *
 * @param node - the root of the tree
 */
function tree_isConstrained(node) {
    var e_1, _a, e_2, _b, e_3, _c;
    switch (node._nodeType) {
        case interfaces_1.NodeType.Document:
            var hasDocType = false;
            var hasElement = false;
            try {
                for (var _d = __values(node._children), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var childNode = _e.value;
                    switch (childNode._nodeType) {
                        case interfaces_1.NodeType.ProcessingInstruction:
                        case interfaces_1.NodeType.Comment:
                            break;
                        case interfaces_1.NodeType.DocumentType:
                            if (hasDocType || hasElement)
                                return false;
                            hasDocType = true;
                            break;
                        case interfaces_1.NodeType.Element:
                            if (hasElement)
                                return false;
                            hasElement = true;
                            break;
                        default:
                            return false;
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
            break;
        case interfaces_1.NodeType.DocumentFragment:
        case interfaces_1.NodeType.Element:
            try {
                for (var _f = __values(node._children), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var childNode = _g.value;
                    switch (childNode._nodeType) {
                        case interfaces_1.NodeType.Element:
                        case interfaces_1.NodeType.Text:
                        case interfaces_1.NodeType.ProcessingInstruction:
                        case interfaces_1.NodeType.CData:
                        case interfaces_1.NodeType.Comment:
                            break;
                        default:
                            return false;
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
            break;
        case interfaces_1.NodeType.DocumentType:
        case interfaces_1.NodeType.Text:
        case interfaces_1.NodeType.ProcessingInstruction:
        case interfaces_1.NodeType.CData:
        case interfaces_1.NodeType.Comment:
            return (!node.hasChildNodes());
    }
    try {
        for (var _h = __values(node._children), _j = _h.next(); !_j.done; _j = _h.next()) {
            var childNode = _j.value;
            // recursively check child nodes
            if (!tree_isConstrained(childNode))
                return false;
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return true;
}
exports.tree_isConstrained = tree_isConstrained;
/**
 * Returns the length of a node.
 *
 * @param node - a node to check
 */
function tree_nodeLength(node) {
    /**
        * To determine the length of a node node, switch on node:
        * - DocumentType
        * Zero.
        * - Text
        * - ProcessingInstruction
        * - Comment
        * Its data’s length.
        * - Any other node
        * Its number of children.
        */
    if (util_1.Guard.isDocumentTypeNode(node)) {
        return 0;
    }
    else if (util_1.Guard.isCharacterDataNode(node)) {
        return node._data.length;
    }
    else {
        return node._children.size;
    }
}
exports.tree_nodeLength = tree_nodeLength;
/**
 * Determines if a node is empty.
 *
 * @param node - a node to check
 */
function tree_isEmpty(node) {
    /**
        * A node is considered empty if its length is zero.
        */
    return (tree_nodeLength(node) === 0);
}
exports.tree_isEmpty = tree_isEmpty;
/**
 * Returns the root node of a tree. The root of an object is itself,
 * if its parent is `null`, or else it is the root of its parent.
 * The root of a tree is any object participating in that tree
 * whose parent is `null`.
 *
 * @param node - a node of the tree
 * @param shadow - `true` to return shadow-including root, otherwise
 * `false`
 */
function tree_rootNode(node, shadow) {
    if (shadow === void 0) { shadow = false; }
    /**
        * The root of an object is itself, if its parent is null, or else it is the
        * root of its parent. The root of a tree is any object participating in
        * that tree whose parent is null.
        */
    if (shadow) {
        var root = tree_rootNode(node, false);
        if (util_1.Guard.isShadowRoot(root))
            return tree_rootNode(root._host, true);
        else
            return root;
    }
    else {
        if (!node._parent)
            return node;
        else
            return tree_rootNode(node._parent);
    }
}
exports.tree_rootNode = tree_rootNode;
/**
 * Determines whether `other` is a descendant of `node`. An object
 * A is called a descendant of an object B, if either A is a child
 * of B or A is a child of an object C that is a descendant of B.
 *
 * @param node - a node
 * @param other - the node to check
 * @param self - if `true`, traversal includes `node` itself
 * @param shadow - if `true`, traversal includes the
 * node's and its descendant's shadow trees as well.
 */
function tree_isDescendantOf(node, other, self, shadow) {
    if (self === void 0) { self = false; }
    if (shadow === void 0) { shadow = false; }
    /**
        * An object A is called a descendant of an object B, if either A is a
        * child of B or A is a child of an object C that is a descendant of B.
        *
        * An inclusive descendant is an object or one of its descendants.
    */
    var child = tree_getFirstDescendantNode(node, self, shadow);
    while (child !== null) {
        if (child === other) {
            return true;
        }
        child = tree_getNextDescendantNode(node, child, self, shadow);
    }
    return false;
}
exports.tree_isDescendantOf = tree_isDescendantOf;
/**
 * Determines whether `other` is an ancestor of `node`. An object A
 * is called an ancestor of an object B if and only if B is a
 * descendant of A.
 *
 * @param node - a node
 * @param other - the node to check
 * @param self - if `true`, traversal includes `node` itself
 * @param shadow - if `true`, traversal includes the
 * node's and its descendant's shadow trees as well.
 */
function tree_isAncestorOf(node, other, self, shadow) {
    if (self === void 0) { self = false; }
    if (shadow === void 0) { shadow = false; }
    var ancestor = self ? node : shadow && util_1.Guard.isShadowRoot(node) ?
        node._host : node._parent;
    while (ancestor !== null) {
        if (ancestor === other)
            return true;
        ancestor = shadow && util_1.Guard.isShadowRoot(ancestor) ?
            ancestor._host : ancestor._parent;
    }
    return false;
}
exports.tree_isAncestorOf = tree_isAncestorOf;
/**
 * Determines whether `other` is a host-including ancestor of `node`. An
 * object A is a host-including inclusive ancestor of an object B, if either
 * A is an inclusive ancestor of B, or if B’s root has a non-null host and
 * A is a host-including inclusive ancestor of B’s root’s host.
 *
 * @param node - a node
 * @param other - the node to check
 * @param self - if `true`, traversal includes `node` itself
 */
function tree_isHostIncludingAncestorOf(node, other, self) {
    if (self === void 0) { self = false; }
    if (tree_isAncestorOf(node, other, self))
        return true;
    var root = tree_rootNode(node);
    if (util_1.Guard.isDocumentFragmentNode(root) && root._host !== null &&
        tree_isHostIncludingAncestorOf(root._host, other, self))
        return true;
    return false;
}
exports.tree_isHostIncludingAncestorOf = tree_isHostIncludingAncestorOf;
/**
 * Determines whether `other` is a sibling of `node`. An object A is
 * called a sibling of an object B, if and only if B and A share
 * the same non-null parent.
 *
 * @param node - a node
 * @param other - the node to check
 * @param self - if `true`, traversal includes `node` itself
 */
function tree_isSiblingOf(node, other, self) {
    if (self === void 0) { self = false; }
    /**
        * An object A is called a sibling of an object B, if and only if B and A
        * share the same non-null parent.
        *
        * An inclusive sibling is an object or one of its siblings.
        */
    if (node === other) {
        if (self)
            return true;
    }
    else {
        return (node._parent !== null && node._parent === other._parent);
    }
    return false;
}
exports.tree_isSiblingOf = tree_isSiblingOf;
/**
 * Determines whether `other` is preceding `node`. An object A is
 * preceding an object B if A and B are in the same tree and A comes
 * before B in tree order.
 *
 * @param node - a node
 * @param other - the node to check
 */
function tree_isPreceding(node, other) {
    /**
        * An object A is preceding an object B if A and B are in the same tree and
        * A comes before B in tree order.
        */
    var nodePos = tree_treePosition(node);
    var otherPos = tree_treePosition(other);
    if (nodePos === -1 || otherPos === -1)
        return false;
    else if (tree_rootNode(node) !== tree_rootNode(other))
        return false;
    else
        return otherPos < nodePos;
}
exports.tree_isPreceding = tree_isPreceding;
/**
 * Determines whether `other` is following `node`. An object A is
 * following an object B if A and B are in the same tree and A comes
 * after B in tree order.
 *
 * @param node - a node
 * @param other - the node to check
 */
function tree_isFollowing(node, other) {
    /**
        * An object A is following an object B if A and B are in the same tree and
        * A comes after B in tree order.
        */
    var nodePos = tree_treePosition(node);
    var otherPos = tree_treePosition(other);
    if (nodePos === -1 || otherPos === -1)
        return false;
    else if (tree_rootNode(node) !== tree_rootNode(other))
        return false;
    else
        return otherPos > nodePos;
}
exports.tree_isFollowing = tree_isFollowing;
/**
 * Determines whether `other` is the parent node of `node`.
 *
 * @param node - a node
 * @param other - the node to check
 */
function tree_isParentOf(node, other) {
    /**
        * An object that participates in a tree has a parent, which is either
        * null or an object, and has children, which is an ordered set of objects.
        * An object A whose parent is object B is a child of B.
        */
    return (node._parent === other);
}
exports.tree_isParentOf = tree_isParentOf;
/**
 * Determines whether `other` is a child node of `node`.
 *
 * @param node - a node
 * @param other - the node to check
 */
function tree_isChildOf(node, other) {
    /**
        * An object that participates in a tree has a parent, which is either
        * null or an object, and has children, which is an ordered set of objects.
        * An object A whose parent is object B is a child of B.
        */
    return (other._parent === node);
}
exports.tree_isChildOf = tree_isChildOf;
/**
 * Returns the previous sibling node of `node` or null if it has no
 * preceding sibling.
 *
 * @param node
 */
function tree_previousSibling(node) {
    /**
        * The previous sibling of an object is its first preceding sibling or null
        * if it has no preceding sibling.
        */
    return node._previousSibling;
}
exports.tree_previousSibling = tree_previousSibling;
/**
 * Returns the next sibling node of `node` or null if it has no
 * following sibling.
 *
 * @param node
 */
function tree_nextSibling(node) {
    /**
        * The next sibling of an object is its first following sibling or null
        * if it has no following sibling.
        */
    return node._nextSibling;
}
exports.tree_nextSibling = tree_nextSibling;
/**
 * Returns the first child node of `node` or null if it has no
 * children.
 *
 * @param node
 */
function tree_firstChild(node) {
    /**
        * The first child of an object is its first child or null if it has no
        * children.
        */
    return node._firstChild;
}
exports.tree_firstChild = tree_firstChild;
/**
 * Returns the last child node of `node` or null if it has no
 * children.
 *
 * @param node
 */
function tree_lastChild(node) {
    /**
        * The last child of an object is its last child or null if it has no
        * children.
        */
    return node._lastChild;
}
exports.tree_lastChild = tree_lastChild;
/**
 * Returns the zero-based index of `node` when counted preorder in
 * the tree rooted at `root`. Returns `-1` if `node` is not in
 * the tree.
 *
 * @param node - the node to get the index of
 */
function tree_treePosition(node) {
    var root = tree_rootNode(node);
    var pos = 0;
    var childNode = tree_getFirstDescendantNode(root);
    while (childNode !== null) {
        pos++;
        if (childNode === node)
            return pos;
        childNode = tree_getNextDescendantNode(root, childNode);
    }
    return -1;
}
exports.tree_treePosition = tree_treePosition;
/**
 * Determines the index of `node`. The index of an object is its number of
 * preceding siblings, or 0 if it has none.
 *
 * @param node - a node
 * @param other - the node to check
 */
function tree_index(node) {
    /**
        * The index of an object is its number of preceding siblings, or 0 if it
        * has none.
        */
    var n = 0;
    while (node._previousSibling !== null) {
        n++;
        node = node._previousSibling;
    }
    return n;
}
exports.tree_index = tree_index;
/**
 * Retargets an object against another object.
 *
 * @param a - an object to retarget
 * @param b - an object to retarget against
 */
function tree_retarget(a, b) {
    /**
        * To retarget an object A against an object B, repeat these steps until
        * they return an object:
        * 1. If one of the following is true
        * - A is not a node
        * - A's root is not a shadow root
        * - B is a node and A's root is a shadow-including inclusive ancestor
        * of B
        * then return A.
        * 2. Set A to A's root's host.
        */
    while (true) {
        if (!a || !util_1.Guard.isNode(a)) {
            return a;
        }
        var rootOfA = tree_rootNode(a);
        if (!util_1.Guard.isShadowRoot(rootOfA)) {
            return a;
        }
        if (b && util_1.Guard.isNode(b) && tree_isAncestorOf(rootOfA, b, true, true)) {
            return a;
        }
        a = rootOfA.host;
    }
}
exports.tree_retarget = tree_retarget;
//# sourceMappingURL=TreeAlgorithm.js.map