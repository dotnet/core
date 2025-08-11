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
Object.defineProperty(exports, "__esModule", { value: true });
var DOMImpl_1 = require("../dom/DOMImpl");
var util_1 = require("../util");
var infra_1 = require("@oozcitak/infra");
var CreateAlgorithm_1 = require("./CreateAlgorithm");
var TreeAlgorithm_1 = require("./TreeAlgorithm");
var EventAlgorithm_1 = require("./EventAlgorithm");
/**
 * Queues a mutation observer microtask to the surrounding agent’s mutation
 * observers.
 */
function observer_queueAMutationObserverMicrotask() {
    /**
     * 1. If the surrounding agent’s mutation observer microtask queued is true,
     * then return.
     * 2. Set the surrounding agent’s mutation observer microtask queued to true.
     * 3. Queue a microtask to notify mutation observers.
     */
    var window = DOMImpl_1.dom.window;
    if (window._mutationObserverMicrotaskQueued)
        return;
    window._mutationObserverMicrotaskQueued = true;
    Promise.resolve().then(function () { observer_notifyMutationObservers(); });
}
exports.observer_queueAMutationObserverMicrotask = observer_queueAMutationObserverMicrotask;
/**
 * Notifies the surrounding agent’s mutation observers.
 */
function observer_notifyMutationObservers() {
    var e_1, _a, e_2, _b;
    /**
     * 1. Set the surrounding agent’s mutation observer microtask queued to false.
     * 2. Let notifySet be a clone of the surrounding agent’s mutation observers.
     * 3. Let signalSet be a clone of the surrounding agent’s signal slots.
     * 4. Empty the surrounding agent’s signal slots.
     */
    var window = DOMImpl_1.dom.window;
    window._mutationObserverMicrotaskQueued = false;
    var notifySet = infra_1.set.clone(window._mutationObservers);
    var signalSet = infra_1.set.clone(window._signalSlots);
    infra_1.set.empty(window._signalSlots);
    var _loop_1 = function (mo) {
        /**
         * 5.1. Let records be a clone of mo’s record queue.
         * 5.2. Empty mo’s record queue.
         */
        var records = infra_1.list.clone(mo._recordQueue);
        infra_1.list.empty(mo._recordQueue);
        /**
         * 5.3. For each node of mo’s node list, remove all transient registered
         * observers whose observer is mo from node’s registered observer list.
         */
        for (var i = 0; i < mo._nodeList.length; i++) {
            var node = mo._nodeList[i];
            infra_1.list.remove(node._registeredObserverList, function (observer) {
                return util_1.Guard.isTransientRegisteredObserver(observer) && observer.observer === mo;
            });
        }
        /**
         * 5.4. If records is not empty, then invoke mo’s callback with « records,
         * mo », and mo. If this throws an exception, then report the exception.
         */
        if (!infra_1.list.isEmpty(records)) {
            try {
                mo._callback.call(mo, records, mo);
            }
            catch (err) {
                // TODO: Report the exception
            }
        }
    };
    try {
        /**
         * 5. For each mo of notifySet:
         */
        for (var notifySet_1 = __values(notifySet), notifySet_1_1 = notifySet_1.next(); !notifySet_1_1.done; notifySet_1_1 = notifySet_1.next()) {
            var mo = notifySet_1_1.value;
            _loop_1(mo);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (notifySet_1_1 && !notifySet_1_1.done && (_a = notifySet_1.return)) _a.call(notifySet_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    /**
     * 6. For each slot of signalSet, fire an event named slotchange, with its
     * bubbles attribute set to true, at slot.
     */
    if (DOMImpl_1.dom.features.slots) {
        try {
            for (var signalSet_1 = __values(signalSet), signalSet_1_1 = signalSet_1.next(); !signalSet_1_1.done; signalSet_1_1 = signalSet_1.next()) {
                var slot = signalSet_1_1.value;
                EventAlgorithm_1.event_fireAnEvent("slotchange", slot, undefined, { bubbles: true });
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (signalSet_1_1 && !signalSet_1_1.done && (_b = signalSet_1.return)) _b.call(signalSet_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
}
exports.observer_notifyMutationObservers = observer_notifyMutationObservers;
/**
 * Queues a mutation record of the given type for target.
 *
 * @param type - mutation record type
 * @param target - target node
 * @param name - name before mutation
 * @param namespace - namespace before mutation
 * @param oldValue - attribute value before mutation
 * @param addedNodes - a list od added nodes
 * @param removedNodes - a list of removed nodes
 * @param previousSibling - previous sibling of target before mutation
 * @param nextSibling - next sibling of target before mutation
 */
function observer_queueMutationRecord(type, target, name, namespace, oldValue, addedNodes, removedNodes, previousSibling, nextSibling) {
    var e_3, _a;
    /**
     * 1. Let interestedObservers be an empty map.
     * 2. Let nodes be the inclusive ancestors of target.
     * 3. For each node in nodes, and then for each registered of node’s
     * registered observer list:
     */
    var interestedObservers = new Map();
    var node = TreeAlgorithm_1.tree_getFirstAncestorNode(target, true);
    while (node !== null) {
        for (var i = 0; i < node._registeredObserverList.length; i++) {
            var registered = node._registeredObserverList[i];
            /**
             * 3.1. Let options be registered’s options.
             * 3.2. If none of the following are true
             * - node is not target and options’s subtree is false
             * - type is "attributes" and options’s attributes is not true
             * - type is "attributes", options’s attributeFilter is present, and
             * options’s attributeFilter does not contain name or namespace is
             * non-null
             * - type is "characterData" and options’s characterData is not true
             * - type is "childList" and options’s childList is false
             */
            var options = registered.options;
            if (node !== target && !options.subtree)
                continue;
            if (type === "attributes" && !options.attributes)
                continue;
            if (type === "attributes" && options.attributeFilter &&
                (!options.attributeFilter.indexOf(name || '') || namespace !== null))
                continue;
            if (type === "characterData" && !options.characterData)
                continue;
            if (type === "childList" && !options.childList)
                continue;
            /**
             * then:
             * 3.2.1. Let mo be registered’s observer.
             * 3.2.2. If interestedObservers[mo] does not exist, then set
             * interestedObservers[mo] to null.
             * 3.2.3. If either type is "attributes" and options’s attributeOldValue
             * is true, or type is "characterData" and options’s
             * characterDataOldValue is true, then set interestedObservers[mo]
             * to oldValue.
             */
            var mo = registered.observer;
            if (!interestedObservers.has(mo)) {
                interestedObservers.set(mo, null);
            }
            if ((type === "attributes" && options.attributeOldValue) ||
                (type === "characterData" && options.characterDataOldValue)) {
                interestedObservers.set(mo, oldValue);
            }
        }
        node = TreeAlgorithm_1.tree_getNextAncestorNode(target, node, true);
    }
    try {
        /**
         * 4. For each observer → mappedOldValue of interestedObservers:
         */
        for (var interestedObservers_1 = __values(interestedObservers), interestedObservers_1_1 = interestedObservers_1.next(); !interestedObservers_1_1.done; interestedObservers_1_1 = interestedObservers_1.next()) {
            var _b = __read(interestedObservers_1_1.value, 2), observer = _b[0], mappedOldValue = _b[1];
            /**
             * 4.1. Let record be a new MutationRecord object with its type set to
             * type, target set to target, attributeName set to name,
             * attributeNamespace set to namespace, oldValue set to mappedOldValue,
             * addedNodes set to addedNodes, removedNodes set to removedNodes,
             * previousSibling set to previousSibling, and nextSibling set to
             * nextSibling.
             * 4.2. Enqueue record to observer’s record queue.
             */
            var record = CreateAlgorithm_1.create_mutationRecord(type, target, CreateAlgorithm_1.create_nodeListStatic(target, addedNodes), CreateAlgorithm_1.create_nodeListStatic(target, removedNodes), previousSibling, nextSibling, name, namespace, mappedOldValue);
            var queue = observer._recordQueue;
            queue.push(record);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (interestedObservers_1_1 && !interestedObservers_1_1.done && (_a = interestedObservers_1.return)) _a.call(interestedObservers_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    /**
     * 5. Queue a mutation observer microtask.
     */
    observer_queueAMutationObserverMicrotask();
}
exports.observer_queueMutationRecord = observer_queueMutationRecord;
/**
 * Queues a tree mutation record for target.
 *
 * @param target - target node
 * @param addedNodes - a list od added nodes
 * @param removedNodes - a list of removed nodes
 * @param previousSibling - previous sibling of target before mutation
 * @param nextSibling - next sibling of target before mutation
 */
function observer_queueTreeMutationRecord(target, addedNodes, removedNodes, previousSibling, nextSibling) {
    /**
     * To queue a tree mutation record for target with addedNodes, removedNodes,
     * previousSibling, and nextSibling, queue a mutation record of "childList"
     * for target with null, null, null, addedNodes, removedNodes,
     * previousSibling, and nextSibling.
     */
    observer_queueMutationRecord("childList", target, null, null, null, addedNodes, removedNodes, previousSibling, nextSibling);
}
exports.observer_queueTreeMutationRecord = observer_queueTreeMutationRecord;
/**
 * Queues an attribute mutation record for target.
 *
 * @param target - target node
 * @param name - name before mutation
 * @param namespace - namespace before mutation
 * @param oldValue - attribute value before mutation
 */
function observer_queueAttributeMutationRecord(target, name, namespace, oldValue) {
    /**
     * To queue an attribute mutation record for target with name, namespace,
     * and oldValue, queue a mutation record of "attributes" for target with
     * name, namespace, oldValue, « », « », null, and null.
     */
    observer_queueMutationRecord("attributes", target, name, namespace, oldValue, [], [], null, null);
}
exports.observer_queueAttributeMutationRecord = observer_queueAttributeMutationRecord;
//# sourceMappingURL=MutationObserverAlgorithm.js.map