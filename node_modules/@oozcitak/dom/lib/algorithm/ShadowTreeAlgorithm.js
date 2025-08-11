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
var util_1 = require("../util");
var util_2 = require("@oozcitak/util");
var TreeAlgorithm_1 = require("./TreeAlgorithm");
var MutationObserverAlgorithm_1 = require("./MutationObserverAlgorithm");
/**
 * Signals a slot change to the given slot.
 *
 * @param slot - a slot
 */
function shadowTree_signalASlotChange(slot) {
    /**
     * 1. Append slot to slot’s relevant agent’s signal slots.
     * 2. Queue a mutation observer microtask.
     */
    var window = DOMImpl_1.dom.window;
    window._signalSlots.add(slot);
    MutationObserverAlgorithm_1.observer_queueAMutationObserverMicrotask();
}
exports.shadowTree_signalASlotChange = shadowTree_signalASlotChange;
/**
 * Determines whether a the shadow tree of the given element node is
 * connected to a document node.
 *
 * @param element - an element node of the shadow tree
 */
function shadowTree_isConnected(element) {
    /**
     * An element is connected if its shadow-including root is a document.
     */
    return util_1.Guard.isDocumentNode(TreeAlgorithm_1.tree_rootNode(element, true));
}
exports.shadowTree_isConnected = shadowTree_isConnected;
/**
 * Determines whether a slotable is assigned.
 *
 * @param slotable - a slotable
 */
function shadowTree_isAssigned(slotable) {
    /**
     * A slotable is assigned if its assigned slot is non-null.
     */
    return (slotable._assignedSlot !== null);
}
exports.shadowTree_isAssigned = shadowTree_isAssigned;
/**
 * Finds a slot for the given slotable.
 *
 * @param slotable - a slotable
 * @param openFlag - `true` to search open shadow tree's only
 */
function shadowTree_findASlot(slotable, openFlag) {
    if (openFlag === void 0) { openFlag = false; }
    /**
     * 1. If slotable’s parent is null, then return null.
     * 2. Let shadow be slotable’s parent’s shadow root.
     * 3. If shadow is null, then return null.
     * 4. If the open flag is set and shadow’s mode is not "open", then
     * return null.
     * 5. Return the first slot in tree order in shadow’s descendants whose name
     * is slotable’s name, if any, and null otherwise.
     */
    var node = util_1.Cast.asNode(slotable);
    var parent = node._parent;
    if (parent === null)
        return null;
    var shadow = parent._shadowRoot || null;
    if (shadow === null)
        return null;
    if (openFlag && shadow._mode !== "open")
        return null;
    var child = TreeAlgorithm_1.tree_getFirstDescendantNode(shadow, false, true, function (e) { return util_1.Guard.isSlot(e); });
    while (child !== null) {
        if (child._name === slotable._name)
            return child;
        child = TreeAlgorithm_1.tree_getNextDescendantNode(shadow, child, false, true, function (e) { return util_1.Guard.isSlot(e); });
    }
    return null;
}
exports.shadowTree_findASlot = shadowTree_findASlot;
/**
 * Finds slotables for the given slot.
 *
 * @param slot - a slot
 */
function shadowTree_findSlotables(slot) {
    var e_1, _a;
    /**
     * 1. Let result be an empty list.
     * 2. If slot’s root is not a shadow root, then return result.
     */
    var result = [];
    var root = TreeAlgorithm_1.tree_rootNode(slot);
    if (!util_1.Guard.isShadowRoot(root))
        return result;
    /**
     * 3. Let host be slot’s root’s host.
     * 4. For each slotable child of host, slotable, in tree order:
     */
    var host = root._host;
    try {
        for (var _b = __values(host._children), _c = _b.next(); !_c.done; _c = _b.next()) {
            var slotable = _c.value;
            if (util_1.Guard.isSlotable(slotable)) {
                /**
                 * 4.1. Let foundSlot be the result of finding a slot given slotable.
                 * 4.2. If foundSlot is slot, then append slotable to result.
                 */
                var foundSlot = shadowTree_findASlot(slotable);
                if (foundSlot === slot) {
                    result.push(slotable);
                }
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
     * 5. Return result.
     */
    return result;
}
exports.shadowTree_findSlotables = shadowTree_findSlotables;
/**
 * Finds slotables for the given slot.
 *
 * @param slot - a slot
 */
function shadowTree_findFlattenedSlotables(slot) {
    var e_2, _a, e_3, _b;
    /**
     * 1. Let result be an empty list.
     * 2. If slot’s root is not a shadow root, then return result.
     */
    var result = [];
    var root = TreeAlgorithm_1.tree_rootNode(slot);
    if (!util_1.Guard.isShadowRoot(root))
        return result;
    /**
     * 3. Let slotables be the result of finding slotables given slot.
     * 4. If slotables is the empty list, then append each slotable child of
     * slot, in tree order, to slotables.
     */
    var slotables = shadowTree_findSlotables(slot);
    if (util_2.isEmpty(slotables)) {
        try {
            for (var _c = __values(slot._children), _d = _c.next(); !_d.done; _d = _c.next()) {
                var slotable = _d.value;
                if (util_1.Guard.isSlotable(slotable)) {
                    slotables.push(slotable);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    try {
        /**
         * 5. For each node in slotables:
         */
        for (var slotables_1 = __values(slotables), slotables_1_1 = slotables_1.next(); !slotables_1_1.done; slotables_1_1 = slotables_1.next()) {
            var node = slotables_1_1.value;
            /**
             * 5.1. If node is a slot whose root is a shadow root, then:
             */
            if (util_1.Guard.isSlot(node) && util_1.Guard.isShadowRoot(TreeAlgorithm_1.tree_rootNode(node))) {
                /**
                 * 5.1.1. Let temporaryResult be the result of finding flattened slotables given node.
                 * 5.1.2. Append each slotable in temporaryResult, in order, to result.
                 */
                var temporaryResult = shadowTree_findFlattenedSlotables(node);
                result.push.apply(result, __spread(temporaryResult));
            }
            else {
                /**
                 * 5.2. Otherwise, append node to result.
                 */
                result.push(node);
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (slotables_1_1 && !slotables_1_1.done && (_b = slotables_1.return)) _b.call(slotables_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    /**
     * 6. Return result.
     */
    return result;
}
exports.shadowTree_findFlattenedSlotables = shadowTree_findFlattenedSlotables;
/**
 * Assigns slotables to the given slot.
 *
 * @param slot - a slot
 */
function shadowTree_assignSlotables(slot) {
    var e_4, _a;
    /**
     * 1. Let slotables be the result of finding slotables for slot.
     * 2. If slotables and slot’s assigned nodes are not identical, then run
     * signal a slot change for slot.
     */
    var slotables = shadowTree_findSlotables(slot);
    if (slotables.length === slot._assignedNodes.length) {
        var nodesIdentical = true;
        for (var i = 0; i < slotables.length; i++) {
            if (slotables[i] !== slot._assignedNodes[i]) {
                nodesIdentical = false;
                break;
            }
        }
        if (!nodesIdentical) {
            shadowTree_signalASlotChange(slot);
        }
    }
    /**
     * 3. Set slot’s assigned nodes to slotables.
     * 4. For each slotable in slotables, set slotable’s assigned slot to slot.
     */
    slot._assignedNodes = slotables;
    try {
        for (var slotables_2 = __values(slotables), slotables_2_1 = slotables_2.next(); !slotables_2_1.done; slotables_2_1 = slotables_2.next()) {
            var slotable = slotables_2_1.value;
            slotable._assignedSlot = slot;
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (slotables_2_1 && !slotables_2_1.done && (_a = slotables_2.return)) _a.call(slotables_2);
        }
        finally { if (e_4) throw e_4.error; }
    }
}
exports.shadowTree_assignSlotables = shadowTree_assignSlotables;
/**
 * Assigns slotables to all nodes of a tree.
 *
 * @param root - root node
 */
function shadowTree_assignSlotablesForATree(root) {
    /**
     * To assign slotables for a tree, given a node root, run assign slotables
     * for each slot slot in root’s inclusive descendants, in tree order.
     */
    var descendant = TreeAlgorithm_1.tree_getFirstDescendantNode(root, true, false, function (e) { return util_1.Guard.isSlot(e); });
    while (descendant !== null) {
        shadowTree_assignSlotables(descendant);
        descendant = TreeAlgorithm_1.tree_getNextDescendantNode(root, descendant, true, false, function (e) { return util_1.Guard.isSlot(e); });
    }
}
exports.shadowTree_assignSlotablesForATree = shadowTree_assignSlotablesForATree;
/**
 * Assigns a slot to a slotables.
 *
 * @param slotable - a slotable
 */
function shadowTree_assignASlot(slotable) {
    /**
     * 1. Let slot be the result of finding a slot with slotable.
     * 2. If slot is non-null, then run assign slotables for slot.
     */
    var slot = shadowTree_findASlot(slotable);
    if (slot !== null) {
        shadowTree_assignSlotables(slot);
    }
}
exports.shadowTree_assignASlot = shadowTree_assignASlot;
//# sourceMappingURL=ShadowTreeAlgorithm.js.map