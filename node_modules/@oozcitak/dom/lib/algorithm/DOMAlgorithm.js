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
var TreeAlgorithm_1 = require("./TreeAlgorithm");
var util_1 = require("../util");
var ShadowTreeAlgorithm_1 = require("./ShadowTreeAlgorithm");
var supportedTokens = new Map();
/**
 * Runs removing steps for node.
 *
 * @param removedNode - removed node
 * @param oldParent - old parent node
 */
function dom_runRemovingSteps(removedNode, oldParent) {
    // No steps defined
}
exports.dom_runRemovingSteps = dom_runRemovingSteps;
/**
 * Runs cloning steps for node.
 *
 * @param copy - node clone
 * @param node - node
 * @param document - document to own the cloned node
 * @param cloneChildrenFlag - whether child nodes are cloned
 */
function dom_runCloningSteps(copy, node, document, cloneChildrenFlag) {
    // No steps defined
}
exports.dom_runCloningSteps = dom_runCloningSteps;
/**
 * Runs adopting steps for node.
 *
 * @param node - node
 * @param oldDocument - old document
 */
function dom_runAdoptingSteps(node, oldDocument) {
    // No steps defined
}
exports.dom_runAdoptingSteps = dom_runAdoptingSteps;
/**
 * Runs attribute change steps for an element node.
 *
 * @param element - element node owning the attribute
 * @param localName - attribute's local name
 * @param oldValue - attribute's old value
 * @param value - attribute's new value
 * @param namespace - attribute's namespace
 */
function dom_runAttributeChangeSteps(element, localName, oldValue, value, namespace) {
    var e_1, _a;
    // run default steps
    if (DOMImpl_1.dom.features.slots) {
        updateASlotablesName.call(element, element, localName, oldValue, value, namespace);
        updateASlotsName.call(element, element, localName, oldValue, value, namespace);
    }
    updateAnElementID.call(element, element, localName, value, namespace);
    try {
        // run custom steps
        for (var _b = __values(element._attributeChangeSteps), _c = _b.next(); !_c.done; _c = _b.next()) {
            var step = _c.value;
            step.call(element, element, localName, oldValue, value, namespace);
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
exports.dom_runAttributeChangeSteps = dom_runAttributeChangeSteps;
/**
 * Runs insertion steps for a node.
 *
 * @param insertedNode - inserted node
 */
function dom_runInsertionSteps(insertedNode) {
    // No steps defined
}
exports.dom_runInsertionSteps = dom_runInsertionSteps;
/**
 * Runs pre-removing steps for a node iterator and node.
 *
 * @param nodeIterator - a node iterator
 * @param toBeRemoved - node to be removed
 */
function dom_runNodeIteratorPreRemovingSteps(nodeIterator, toBeRemoved) {
    removeNodeIterator.call(nodeIterator, nodeIterator, toBeRemoved);
}
exports.dom_runNodeIteratorPreRemovingSteps = dom_runNodeIteratorPreRemovingSteps;
/**
 * Determines if there are any supported tokens defined for the given
 * attribute name.
 *
 * @param attributeName - an attribute name
 */
function dom_hasSupportedTokens(attributeName) {
    return supportedTokens.has(attributeName);
}
exports.dom_hasSupportedTokens = dom_hasSupportedTokens;
/**
 * Returns the set of supported tokens defined for the given attribute name.
 *
 * @param attributeName - an attribute name
 */
function dom_getSupportedTokens(attributeName) {
    return supportedTokens.get(attributeName) || new Set();
}
exports.dom_getSupportedTokens = dom_getSupportedTokens;
/**
 * Runs event construction steps.
 *
 * @param event - an event
 */
function dom_runEventConstructingSteps(event) {
    // No steps defined
}
exports.dom_runEventConstructingSteps = dom_runEventConstructingSteps;
/**
 * Runs child text content change steps for a parent node.
 *
 * @param parent - parent node with text node child nodes
 */
function dom_runChildTextContentChangeSteps(parent) {
    // No steps defined
}
exports.dom_runChildTextContentChangeSteps = dom_runChildTextContentChangeSteps;
/**
 * Defines pre-removing steps for a node iterator.
 */
function removeNodeIterator(nodeIterator, toBeRemovedNode) {
    /**
     * 1. If toBeRemovedNode is not an inclusive ancestor of nodeIterator’s
     * reference, or toBeRemovedNode is nodeIterator’s root, then return.
     */
    if (toBeRemovedNode === nodeIterator._root ||
        !TreeAlgorithm_1.tree_isAncestorOf(nodeIterator._reference, toBeRemovedNode, true)) {
        return;
    }
    /**
     * 2. If nodeIterator’s pointer before reference is true, then:
     */
    if (nodeIterator._pointerBeforeReference) {
        /**
         * 2.1. Let next be toBeRemovedNode’s first following node that is an
         * inclusive descendant of nodeIterator’s root and is not an inclusive
         * descendant of toBeRemovedNode, and null if there is no such node.
         */
        while (true) {
            var nextNode = TreeAlgorithm_1.tree_getFollowingNode(nodeIterator._root, toBeRemovedNode);
            if (nextNode !== null &&
                TreeAlgorithm_1.tree_isDescendantOf(nodeIterator._root, nextNode, true) &&
                !TreeAlgorithm_1.tree_isDescendantOf(toBeRemovedNode, nextNode, true)) {
                /**
                 * 2.2. If next is non-null, then set nodeIterator’s reference to next
                 * and return.
                 */
                nodeIterator._reference = nextNode;
                return;
            }
            else if (nextNode === null) {
                /**
                 * 2.3. Otherwise, set nodeIterator’s pointer before reference to false.
                 */
                nodeIterator._pointerBeforeReference = false;
                return;
            }
        }
    }
    /**
     * 3. Set nodeIterator’s reference to toBeRemovedNode’s parent, if
     * toBeRemovedNode’s previous sibling is null, and to the inclusive
     * descendant of toBeRemovedNode’s previous sibling that appears last in
     * tree order otherwise.
     */
    if (toBeRemovedNode._previousSibling === null) {
        if (toBeRemovedNode._parent !== null) {
            nodeIterator._reference = toBeRemovedNode._parent;
        }
    }
    else {
        var referenceNode = toBeRemovedNode._previousSibling;
        var childNode = TreeAlgorithm_1.tree_getFirstDescendantNode(toBeRemovedNode._previousSibling, true, false);
        while (childNode !== null) {
            if (childNode !== null) {
                referenceNode = childNode;
            }
            // loop through to get the last descendant node
            childNode = TreeAlgorithm_1.tree_getNextDescendantNode(toBeRemovedNode._previousSibling, childNode, true, false);
        }
        nodeIterator._reference = referenceNode;
    }
}
/**
 * Defines attribute change steps to update a slot’s name.
 */
function updateASlotsName(element, localName, oldValue, value, namespace) {
    /**
     * 1. If element is a slot, localName is name, and namespace is null, then:
     * 1.1. If value is oldValue, then return.
     * 1.2. If value is null and oldValue is the empty string, then return.
     * 1.3. If value is the empty string and oldValue is null, then return.
     * 1.4. If value is null or the empty string, then set element’s name to the
     * empty string.
     * 1.5. Otherwise, set element’s name to value.
     * 1.6. Run assign slotables for a tree with element’s root.
     */
    if (util_1.Guard.isSlot(element) && localName === "name" && namespace === null) {
        if (value === oldValue)
            return;
        if (value === null && oldValue === '')
            return;
        if (value === '' && oldValue === null)
            return;
        if ((value === null || value === '')) {
            element._name = '';
        }
        else {
            element._name = value;
        }
        ShadowTreeAlgorithm_1.shadowTree_assignSlotablesForATree(TreeAlgorithm_1.tree_rootNode(element));
    }
}
/**
 * Defines attribute change steps to update a slotable’s name.
 */
function updateASlotablesName(element, localName, oldValue, value, namespace) {
    /**
     * 1. If localName is slot and namespace is null, then:
     * 1.1. If value is oldValue, then return.
     * 1.2. If value is null and oldValue is the empty string, then return.
     * 1.3. If value is the empty string and oldValue is null, then return.
     * 1.4. If value is null or the empty string, then set element’s name to
     * the empty string.
     * 1.5. Otherwise, set element’s name to value.
     * 1.6. If element is assigned, then run assign slotables for element’s
     * assigned slot.
     * 1.7. Run assign a slot for element.
     */
    if (util_1.Guard.isSlotable(element) && localName === "slot" && namespace === null) {
        if (value === oldValue)
            return;
        if (value === null && oldValue === '')
            return;
        if (value === '' && oldValue === null)
            return;
        if ((value === null || value === '')) {
            element._name = '';
        }
        else {
            element._name = value;
        }
        if (ShadowTreeAlgorithm_1.shadowTree_isAssigned(element)) {
            ShadowTreeAlgorithm_1.shadowTree_assignSlotables(element._assignedSlot);
        }
        ShadowTreeAlgorithm_1.shadowTree_assignASlot(element);
    }
}
/**
 * Defines attribute change steps to update an element's ID.
 */
function updateAnElementID(element, localName, value, namespace) {
    /**
     * 1. If localName is id, namespace is null, and value is null or the empty
     * string, then unset element’s ID.
     * 2. Otherwise, if localName is id, namespace is null, then set element’s
     * ID to value.
     */
    if (localName === "id" && namespace === null) {
        if (!value)
            element._uniqueIdentifier = undefined;
        else
            element._uniqueIdentifier = value;
    }
}
//# sourceMappingURL=DOMAlgorithm.js.map