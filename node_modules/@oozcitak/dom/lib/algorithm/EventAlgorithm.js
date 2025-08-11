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
var interfaces_1 = require("../dom/interfaces");
var util_1 = require("../util");
var CustomEventImpl_1 = require("../dom/CustomEventImpl");
var EventImpl_1 = require("../dom/EventImpl");
var DOMException_1 = require("../dom/DOMException");
var TreeAlgorithm_1 = require("./TreeAlgorithm");
var ShadowTreeAlgorithm_1 = require("./ShadowTreeAlgorithm");
var DOMAlgorithm_1 = require("./DOMAlgorithm");
/**
 * Sets the canceled flag of an event.
 *
 * @param event - an event
 */
function event_setTheCanceledFlag(event) {
    if (event._cancelable && !event._inPassiveListenerFlag) {
        event._canceledFlag = true;
    }
}
exports.event_setTheCanceledFlag = event_setTheCanceledFlag;
/**
 * Initializes the value of an event.
 *
 * @param event - an event to initialize
 * @param type - the type of event
 * @param bubbles - whether the event propagates in reverse
 * @param cancelable - whether the event can be cancelled
 */
function event_initialize(event, type, bubbles, cancelable) {
    event._initializedFlag = true;
    event._stopPropagationFlag = false;
    event._stopImmediatePropagationFlag = false;
    event._canceledFlag = false;
    event._isTrusted = false;
    event._target = null;
    event._type = type;
    event._bubbles = bubbles;
    event._cancelable = cancelable;
}
exports.event_initialize = event_initialize;
/**
 * Creates a new event.
 *
 * @param eventInterface - event interface
 * @param realm - realm
 */
function event_createAnEvent(eventInterface, realm) {
    if (realm === void 0) { realm = undefined; }
    /**
     * 1. If realm is not given, then set it to null.
     * 2. Let dictionary be the result of converting the JavaScript value
     * undefined to the dictionary type accepted by eventInterface’s
     * constructor. (This dictionary type will either be EventInit or a
     * dictionary that inherits from it.)
     * 3. Let event be the result of running the inner event creation steps with
     * eventInterface, realm, the time of the occurrence that the event is
     * signaling, and dictionary.
     * 4. Initialize event’s isTrusted attribute to true.
     * 5. Return event.
     */
    if (realm === undefined)
        realm = null;
    var dictionary = {};
    var event = event_innerEventCreationSteps(eventInterface, realm, new Date(), dictionary);
    event._isTrusted = true;
    return event;
}
exports.event_createAnEvent = event_createAnEvent;
/**
 * Performs event creation steps.
 *
 * @param eventInterface - event interface
 * @param realm - realm
 * @param time - time of occurrance
 * @param dictionary - event attributes
 *
 */
function event_innerEventCreationSteps(eventInterface, realm, time, dictionary) {
    /**
     * 1. Let event be the result of creating a new object using eventInterface.
     * TODO: Implement realms
     * If realm is non-null, then use that Realm; otherwise, use the default
     * behavior defined in Web IDL.
     */
    var event = new eventInterface("");
    /**
     * 2. Set event’s initialized flag.
     * 3. Initialize event’s timeStamp attribute to a DOMHighResTimeStamp
     * representing the high resolution time from the time origin to time.
     * 4. For each member → value in dictionary, if event has an attribute
     * whose identifier is member, then initialize that attribute to value.
     * 5. Run the event constructing steps with event.
     * 6. Return event.
     */
    event._initializedFlag = true;
    event._timeStamp = time.getTime();
    Object.assign(event, dictionary);
    if (DOMImpl_1.dom.features.steps) {
        DOMAlgorithm_1.dom_runEventConstructingSteps(event);
    }
    return event;
}
exports.event_innerEventCreationSteps = event_innerEventCreationSteps;
/**
 * Dispatches an event to an event target.
 *
 * @param event - the event to dispatch
 * @param target - event target
 * @param legacyTargetOverrideFlag - legacy target override flag
 * @param legacyOutputDidListenersThrowFlag - legacy output flag that returns
 * whether the event listener's callback threw an exception
 */
function event_dispatch(event, target, legacyTargetOverrideFlag, legacyOutputDidListenersThrowFlag) {
    var e_1, _a, e_2, _b;
    if (legacyTargetOverrideFlag === void 0) { legacyTargetOverrideFlag = false; }
    if (legacyOutputDidListenersThrowFlag === void 0) { legacyOutputDidListenersThrowFlag = { value: false }; }
    var clearTargets = false;
    /**
     * 1. Set event's dispatch flag.
     */
    event._dispatchFlag = true;
    /**
     * 2. Let targetOverride be target, if legacy target override flag is not
     * given, and target's associated Document otherwise.
     *
     * _Note:_ legacy target override flag is only used by HTML and only when
     * target is a Window object.
     */
    var targetOverride = target;
    if (legacyTargetOverrideFlag) {
        var doc = target._associatedDocument;
        if (util_1.Guard.isDocumentNode(doc)) {
            targetOverride = doc;
        }
    }
    /**
     * 3. Let activationTarget be null.
     * 4. Let relatedTarget be the result of retargeting event's relatedTarget
     * against target.
     * 5. If target is not relatedTarget or target is event's relatedTarget,
     * then:
    */
    var activationTarget = null;
    var relatedTarget = TreeAlgorithm_1.tree_retarget(event._relatedTarget, target);
    if (target !== relatedTarget || target === event._relatedTarget) {
        /**
         * 5.1. Let touchTargets be a new list.
         * 5.2. For each touchTarget of event's touch target list, append the
         * result of retargeting touchTarget against target to touchTargets.
         * 5.3. Append to an event path with event, target, targetOverride,
         * relatedTarget, touchTargets, and false.
         * 5.4. Let isActivationEvent be true, if event is a MouseEvent object
         * and event's type attribute is "click", and false otherwise.
         * 5.5. If isActivationEvent is true and target has activation behavior,
         * then set activationTarget to target.
         * 5.6. Let slotable be target, if target is a slotable and is assigned,
         * and null otherwise.
         * 5.7. Let slot-in-closed-tree be false.
         * 5.8. Let parent be the result of invoking target's get the parent with
         * event.
         */
        var touchTargets = [];
        try {
            for (var _c = __values(event._touchTargetList), _d = _c.next(); !_d.done; _d = _c.next()) {
                var touchTarget = _d.value;
                touchTargets.push(TreeAlgorithm_1.tree_retarget(touchTarget, target));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        event_appendToAnEventPath(event, target, targetOverride, relatedTarget, touchTargets, false);
        var isActivationEvent = (util_1.Guard.isMouseEvent(event) && event._type === "click");
        if (isActivationEvent && target._activationBehavior !== undefined) {
            activationTarget = target;
        }
        var slotable = (util_1.Guard.isSlotable(target) && ShadowTreeAlgorithm_1.shadowTree_isAssigned(target)) ?
            target : null;
        var slotInClosedTree = false;
        var parent = target._getTheParent(event);
        /**
         * 5.9. While parent is non-null:
         */
        while (parent !== null && util_1.Guard.isNode(parent)) {
            /**
             * 5.9.1 If slotable is non-null:
             * 5.9.1.1. Assert: parent is a slot.
             * 5.9.1.2. Set slotable to null.
             * 5.9.1.3. If parent's root is a shadow root whose mode is "closed",
             * then set slot-in-closed-tree to true.
             */
            if (slotable !== null) {
                if (!util_1.Guard.isSlot(parent)) {
                    throw new Error("Parent node of a slotable should be a slot.");
                }
                slotable = null;
                var root = TreeAlgorithm_1.tree_rootNode(parent, true);
                if (util_1.Guard.isShadowRoot(root) && root._mode === "closed") {
                    slotInClosedTree = true;
                }
            }
            /**
             * 5.9.2 If parent is a slotable and is assigned, then set slotable to
             * parent.
             * 5.9.3. Let relatedTarget be the result of retargeting event's
             * relatedTarget against parent.
             * 5.9.4. Let touchTargets be a new list.
             * 5.9.4. For each touchTarget of event's touch target list, append the
             * result of retargeting touchTarget against parent to touchTargets.
             */
            if (util_1.Guard.isSlotable(parent) && ShadowTreeAlgorithm_1.shadowTree_isAssigned(parent)) {
                slotable = parent;
            }
            relatedTarget = TreeAlgorithm_1.tree_retarget(event._relatedTarget, parent);
            touchTargets = [];
            try {
                for (var _e = (e_2 = void 0, __values(event._touchTargetList)), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var touchTarget = _f.value;
                    touchTargets.push(TreeAlgorithm_1.tree_retarget(touchTarget, parent));
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
             * 5.9.6. If parent is a Window object, or parent is a node and target's
             * root is a shadow-including inclusive ancestor of parent, then:
             */
            if (util_1.Guard.isWindow(parent) || (util_1.Guard.isNode(parent) && util_1.Guard.isNode(target) &&
                TreeAlgorithm_1.tree_isAncestorOf(TreeAlgorithm_1.tree_rootNode(target, true), parent, true, true))) {
                /**
                 * 5.9.6.1. If isActivationEvent is true, event's bubbles attribute
                 * is true, activationTarget is null, and parent has activation
                 * behavior, then set activationTarget to parent.
                 * 5.9.6.2. Append to an event path with event, parent, null,
                 * relatedTarget, touchTargets, and slot-in-closed-tree.
                 */
                if (isActivationEvent && event._bubbles && activationTarget === null &&
                    parent._activationBehavior) {
                    activationTarget = parent;
                }
                event_appendToAnEventPath(event, parent, null, relatedTarget, touchTargets, slotInClosedTree);
            }
            else if (parent === relatedTarget) {
                /**
                 * 5.9.7. Otherwise, if parent is relatedTarget,
                 * then set parent to null.
                 */
                parent = null;
            }
            else {
                /**
                 * 5.9.8. Otherwise, set target to parent and then:
                 * 5.9.8.1. If isActivationEvent is true, activationTarget is null,
                 * and target has activation behavior, then set activationTarget
                 * to target.
                 * 5.9.8.2. Append to an event path with event, parent, target,
                 * relatedTarget, touchTargets, and slot-in-closed-tree.
                 */
                target = parent;
                if (isActivationEvent && activationTarget === null &&
                    target._activationBehavior) {
                    activationTarget = target;
                }
                event_appendToAnEventPath(event, parent, target, relatedTarget, touchTargets, slotInClosedTree);
            }
            /**
             * 5.9.9. If parent is non-null, then set parent to the result of
             * invoking parent's get the parent with event.
             * 5.9.10. Set slot-in-closed-tree to false.
             */
            if (parent !== null) {
                parent = parent._getTheParent(event);
            }
            slotInClosedTree = false;
        }
        /**
         * 5.10. Let clearTargetsStruct be the last struct in event's path whose
         * shadow-adjusted target is non-null.
         */
        var clearTargetsStruct = null;
        var path = event._path;
        for (var i = path.length - 1; i >= 0; i--) {
            var struct = path[i];
            if (struct.shadowAdjustedTarget !== null) {
                clearTargetsStruct = struct;
                break;
            }
        }
        /**
         * 5.11. Let clearTargets be true if clearTargetsStruct's shadow-adjusted
         * target, clearTargetsStruct's relatedTarget, or an EventTarget object
         * in clearTargetsStruct's touch target list is a node and its root is
         * a shadow root, and false otherwise.
         */
        if (clearTargetsStruct !== null) {
            if (util_1.Guard.isNode(clearTargetsStruct.shadowAdjustedTarget) &&
                util_1.Guard.isShadowRoot(TreeAlgorithm_1.tree_rootNode(clearTargetsStruct.shadowAdjustedTarget, true))) {
                clearTargets = true;
            }
            else if (util_1.Guard.isNode(clearTargetsStruct.relatedTarget) &&
                util_1.Guard.isShadowRoot(TreeAlgorithm_1.tree_rootNode(clearTargetsStruct.relatedTarget, true))) {
                clearTargets = true;
            }
            else {
                for (var j = 0; j < clearTargetsStruct.touchTargetList.length; j++) {
                    var struct = clearTargetsStruct.touchTargetList[j];
                    if (util_1.Guard.isNode(struct) &&
                        util_1.Guard.isShadowRoot(TreeAlgorithm_1.tree_rootNode(struct, true))) {
                        clearTargets = true;
                        break;
                    }
                }
            }
        }
        /**
         * 5.12. If activationTarget is non-null and activationTarget has
         * legacy-pre-activation behavior, then run activationTarget's
         * legacy-pre-activation behavior.
         */
        if (activationTarget !== null &&
            activationTarget._legacyPreActivationBehavior !== undefined) {
            activationTarget._legacyPreActivationBehavior(event);
        }
        /**
         * 5.13. For each struct in event's path, in reverse order:
         */
        for (var i = path.length - 1; i >= 0; i--) {
            var struct = path[i];
            /**
             * 5.13.1. If struct's shadow-adjusted target is non-null, then set
             * event's eventPhase attribute to AT_TARGET.
             * 5.13.2. Otherwise, set event's eventPhase attribute to
             * CAPTURING_PHASE.
             * 5.13.3. Invoke with struct, event, "capturing", and
             * legacyOutputDidListenersThrowFlag if given.
             */
            if (struct.shadowAdjustedTarget !== null) {
                event._eventPhase = interfaces_1.EventPhase.AtTarget;
            }
            else {
                event._eventPhase = interfaces_1.EventPhase.Capturing;
            }
            event_invoke(struct, event, "capturing", legacyOutputDidListenersThrowFlag);
        }
        /**
         * 5.14. For each struct in event's path
         */
        for (var i = 0; i < path.length; i++) {
            var struct = path[i];
            /**
             * 5.14.1. If struct's shadow-adjusted target is non-null, then set
             * event's eventPhase attribute to AT_TARGET.
             * 5.14.2. Otherwise:
             * 5.14.2.1. If event's bubbles attribute is false, then continue.
             * 5.14.2.2. Set event's eventPhase attribute to BUBBLING_PHASE.
             * 5.14.3. Invoke with struct, event, "bubbling", and
             * legacyOutputDidListenersThrowFlag if given.
             */
            if (struct.shadowAdjustedTarget !== null) {
                event._eventPhase = interfaces_1.EventPhase.AtTarget;
            }
            else {
                if (!event._bubbles)
                    continue;
                event._eventPhase = interfaces_1.EventPhase.Bubbling;
            }
            event_invoke(struct, event, "bubbling", legacyOutputDidListenersThrowFlag);
        }
    }
    /**
     * 6. Set event's eventPhase attribute to NONE.
     * 7. Set event's currentTarget attribute to null.
     * 8. Set event's path to the empty list.
     * 9. Unset event's dispatch flag, stop propagation flag, and stop
     * immediate propagation flag.
     */
    event._eventPhase = interfaces_1.EventPhase.None;
    event._currentTarget = null;
    event._path = [];
    event._dispatchFlag = false;
    event._stopPropagationFlag = false;
    event._stopImmediatePropagationFlag = false;
    /**
     * 10. If clearTargets, then:
     * 10.1. Set event's target to null.
     * 10.2. Set event's relatedTarget to null.
     * 10.3. Set event's touch target list to the empty list.
     */
    if (clearTargets) {
        event._target = null;
        event._relatedTarget = null;
        event._touchTargetList = [];
    }
    /**
     * 11. If activationTarget is non-null, then:
     * 11.1. If event's canceled flag is unset, then run activationTarget's
     * activation behavior with event.
     * 11.2. Otherwise, if activationTarget has legacy-canceled-activation
     * behavior, then run activationTarget's legacy-canceled-activation
     * behavior.
     */
    if (activationTarget !== null) {
        if (!event._canceledFlag && activationTarget._activationBehavior !== undefined) {
            activationTarget._activationBehavior(event);
        }
        else if (activationTarget._legacyCanceledActivationBehavior !== undefined) {
            activationTarget._legacyCanceledActivationBehavior(event);
        }
    }
    /**
     * 12. Return false if event's canceled flag is set, and true otherwise.
     */
    return !event._canceledFlag;
}
exports.event_dispatch = event_dispatch;
/**
 * Appends a new struct to an event's path.
 *
 * @param event - an event
 * @param invocationTarget - the target of the invocation
 * @param shadowAdjustedTarget - shadow-root adjusted event target
 * @param relatedTarget - related event target
 * @param touchTargets - a list of touch targets
 * @param slotInClosedTree - if the target's parent is a closed shadow root
 */
function event_appendToAnEventPath(event, invocationTarget, shadowAdjustedTarget, relatedTarget, touchTargets, slotInClosedTree) {
    /**
     * 1. Let invocationTargetInShadowTree be false.
     * 2. If invocationTarget is a node and its root is a shadow root, then
     * set invocationTargetInShadowTree to true.
     */
    var invocationTargetInShadowTree = false;
    if (util_1.Guard.isNode(invocationTarget) &&
        util_1.Guard.isShadowRoot(TreeAlgorithm_1.tree_rootNode(invocationTarget))) {
        invocationTargetInShadowTree = true;
    }
    /**
     * 3. Let root-of-closed-tree be false.
     * 4. If invocationTarget is a shadow root whose mode is "closed", then
     * set root-of-closed-tree to true.
     */
    var rootOfClosedTree = false;
    if (util_1.Guard.isShadowRoot(invocationTarget) &&
        invocationTarget._mode === "closed") {
        rootOfClosedTree = true;
    }
    /**
     * 5. Append a new struct to event's path whose invocation target is
     * invocationTarget, invocation-target-in-shadow-tree is
     * invocationTargetInShadowTree, shadow-adjusted target is
     * shadowAdjustedTarget, relatedTarget is relatedTarget,
     * touch target list is touchTargets, root-of-closed-tree is
     * root-of-closed-tree, and slot-in-closed-tree is slot-in-closed-tree.
     */
    event._path.push({
        invocationTarget: invocationTarget,
        invocationTargetInShadowTree: invocationTargetInShadowTree,
        shadowAdjustedTarget: shadowAdjustedTarget,
        relatedTarget: relatedTarget,
        touchTargetList: touchTargets,
        rootOfClosedTree: rootOfClosedTree,
        slotInClosedTree: slotInClosedTree
    });
}
exports.event_appendToAnEventPath = event_appendToAnEventPath;
/**
 * Invokes an event.
 *
 * @param struct - a struct defining event's path
 * @param event - the event to invoke
 * @param phase - event phase
 * @param legacyOutputDidListenersThrowFlag - legacy output flag that returns
 * whether the event listener's callback threw an exception
 */
function event_invoke(struct, event, phase, legacyOutputDidListenersThrowFlag) {
    if (legacyOutputDidListenersThrowFlag === void 0) { legacyOutputDidListenersThrowFlag = { value: false }; }
    /**
     * 1. Set event's target to the shadow-adjusted target of the last struct
     * in event's path, that is either struct or preceding struct, whose
     * shadow-adjusted target is non-null.
     */
    var path = event._path;
    var index = -1;
    for (var i = 0; i < path.length; i++) {
        if (path[i] === struct) {
            index = i;
            break;
        }
    }
    if (index !== -1) {
        var item = path[index];
        if (item.shadowAdjustedTarget !== null) {
            event._target = item.shadowAdjustedTarget;
        }
        else if (index > 0) {
            item = path[index - 1];
            if (item.shadowAdjustedTarget !== null) {
                event._target = item.shadowAdjustedTarget;
            }
        }
    }
    /**
     * 2. Set event's relatedTarget to struct's relatedTarget.
     * 3. Set event's touch target list to struct's touch target list.
     * 4. If event's stop propagation flag is set, then return.
     * 5. Initialize event's currentTarget attribute to struct's invocation
     * target.
     * 6. Let listeners be a clone of event's currentTarget attribute value's
     * event listener list.
     *
     * _Note:_ This avoids event listeners added after this point from being
     * run. Note that removal still has an effect due to the removed field.
     */
    event._relatedTarget = struct.relatedTarget;
    event._touchTargetList = struct.touchTargetList;
    if (event._stopPropagationFlag)
        return;
    event._currentTarget = struct.invocationTarget;
    var currentTarget = event._currentTarget;
    var targetListeners = currentTarget._eventListenerList;
    var listeners = new (Array.bind.apply(Array, __spread([void 0], targetListeners)))();
    /**
     * 7. Let found be the result of running inner invoke with event, listeners,
     * phase, and legacyOutputDidListenersThrowFlag if given.
     */
    var found = event_innerInvoke(event, listeners, phase, struct, legacyOutputDidListenersThrowFlag);
    /**
     * 8. If found is false and event's isTrusted attribute is true, then:
     */
    if (!found && event._isTrusted) {
        /**
         * 8.1. Let originalEventType be event's type attribute value.
         * 8.2. If event's type attribute value is a match for any of the strings
         * in the first column in the following table, set event's type attribute
         * value to the string in the second column on the same row as the matching
         * string, and return otherwise.
         *
         * Event type           | Legacy event type
         * -------------------------------------------------
         * "animationend"       | "webkitAnimationEnd"
         * "animationiteration" | "webkitAnimationIteration"
         * "animationstart"     | "webkitAnimationStart"
         * "transitionend"      | "webkitTransitionEnd"
         */
        var originalEventType = event._type;
        if (originalEventType === "animationend") {
            event._type = "webkitAnimationEnd";
        }
        else if (originalEventType === "animationiteration") {
            event._type = "webkitAnimationIteration";
        }
        else if (originalEventType === "animationstart") {
            event._type = "webkitAnimationStart";
        }
        else if (originalEventType === "transitionend") {
            event._type = "webkitTransitionEnd";
        }
        /**
         * 8.3. Inner invoke with event, listeners, phase, and
         * legacyOutputDidListenersThrowFlag if given.
         * 8.4. Set event's type attribute value to originalEventType.
         */
        event_innerInvoke(event, listeners, phase, struct, legacyOutputDidListenersThrowFlag);
        event._type = originalEventType;
    }
}
exports.event_invoke = event_invoke;
/**
 * Invokes an event.
 *
 * @param event - the event to invoke
 * @param listeners - event listeners
 * @param phase - event phase
 * @param struct - a struct defining event's path
 * @param legacyOutputDidListenersThrowFlag - legacy output flag that returns
 * whether the event listener's callback threw an exception
 */
function event_innerInvoke(event, listeners, phase, struct, legacyOutputDidListenersThrowFlag) {
    if (legacyOutputDidListenersThrowFlag === void 0) { legacyOutputDidListenersThrowFlag = { value: false }; }
    /**
     * 1. Let found be false.
     * 2. For each listener in listeners, whose removed is false:
     */
    var found = false;
    for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        if (!listener.removed) {
            /**
             * 2.1. If event's type attribute value is not listener's type, then
             * continue.
             * 2.2. Set found to true.
             * 2.3. If phase is "capturing" and listener's capture is false, then
             * continue.
             * 2.4. If phase is "bubbling" and listener's capture is true, then
             * continue.
             */
            if (event._type !== listener.type)
                continue;
            found = true;
            if (phase === "capturing" && !listener.capture)
                continue;
            if (phase === "bubbling" && listener.capture)
                continue;
            /**
             * 2.5. If listener's once is true, then remove listener from event's
             * currentTarget attribute value's event listener list.
             */
            if (listener.once && event._currentTarget !== null) {
                var impl = event._currentTarget;
                var index = -1;
                for (var i_1 = 0; i_1 < impl._eventListenerList.length; i_1++) {
                    if (impl._eventListenerList[i_1] === listener) {
                        index = i_1;
                        break;
                    }
                }
                if (index !== -1) {
                    impl._eventListenerList.splice(index, 1);
                }
            }
            /**
             * TODO: Implement realms
             *
             * 2.6. Let global be listener callback's associated Realm's global
             * object.
             */
            var globalObject = undefined;
            /**
             * 2.7. Let currentEvent be undefined.
             * 2.8. If global is a Window object, then:
             * 2.8.1. Set currentEvent to global's current event.
             * 2.8.2. If struct's invocation-target-in-shadow-tree is false, then
             * set global's current event to event.
             */
            var currentEvent = undefined;
            if (util_1.Guard.isWindow(globalObject)) {
                currentEvent = globalObject._currentEvent;
                if (struct.invocationTargetInShadowTree === false) {
                    globalObject._currentEvent = event;
                }
            }
            /**
             * 2.9. If listener's passive is true, then set event's in passive
             * listener flag.
             * 2.10. Call a user object's operation with listener's callback,
             * "handleEvent", « event », and event's currentTarget attribute value.
             */
            if (listener.passive)
                event._inPassiveListenerFlag = true;
            try {
                listener.callback.handleEvent.call(event._currentTarget, event);
            }
            catch (err) {
                /**
                 * If this throws an exception, then:
                 * 2.10.1. Report the exception.
                 * 2.10.2. Set legacyOutputDidListenersThrowFlag if given.
                 *
                 * _Note:_ The legacyOutputDidListenersThrowFlag is only used by
                 * Indexed Database API.
                 * TODO: Report the exception
                 * See: https://html.spec.whatwg.org/multipage/webappapis.html#runtime-script-errors-in-documents
                 */
                legacyOutputDidListenersThrowFlag.value = true;
            }
            /**
             * 2.11. Unset event's in passive listener flag.
             */
            if (listener.passive)
                event._inPassiveListenerFlag = false;
            /**
             * 2.12. If global is a Window object, then set global's current event
             * to currentEvent.
             */
            if (util_1.Guard.isWindow(globalObject)) {
                globalObject._currentEvent = currentEvent;
            }
            /**
             * 2.13. If event's stop immediate propagation flag is set, then return
             * found.
             */
            if (event._stopImmediatePropagationFlag)
                return found;
        }
    }
    /**
     * 3. Return found.
     */
    return found;
}
exports.event_innerInvoke = event_innerInvoke;
/**
 * Fires an event at target.
 * @param e - event name
 * @param target - event target
 * @param eventConstructor - an event constructor, with a description of how
 * IDL attributes are to be initialized
 * @param idlAttributes - a dictionary describing how IDL attributes are
 * to be initialized
 * @param legacyTargetOverrideFlag - legacy target override flag
 */
function event_fireAnEvent(e, target, eventConstructor, idlAttributes, legacyTargetOverrideFlag) {
    /**
     * 1. If eventConstructor is not given, then let eventConstructor be Event.
     */
    if (eventConstructor === undefined) {
        eventConstructor = EventImpl_1.EventImpl;
    }
    /**
     * 2. Let event be the result of creating an event given eventConstructor,
     * in the relevant Realm of target.
     */
    var event = event_createAnEvent(eventConstructor);
    /**
     * 3. Initialize event’s type attribute to e.
     */
    event._type = e;
    /**
     * 4. Initialize any other IDL attributes of event as described in the
     * invocation of this algorithm.
     * _Note:_ This also allows for the isTrusted attribute to be set to false.
     */
    if (idlAttributes) {
        for (var key in idlAttributes) {
            var idlObj = event;
            idlObj[key] = idlAttributes[key];
        }
    }
    /**
     * 5. Return the result of dispatching event at target, with legacy target
     * override flag set if set.
     */
    return event_dispatch(event, target, legacyTargetOverrideFlag);
}
exports.event_fireAnEvent = event_fireAnEvent;
/**
 * Creates an event.
 *
 * @param eventInterface - the name of the event interface
 */
function event_createLegacyEvent(eventInterface) {
    /**
     * 1. Let constructor be null.
     */
    var constructor = null;
    /**
     * TODO: Implement in HTML DOM
     * 2. If interface is an ASCII case-insensitive match for any of the strings
     * in the first column in the following table, then set constructor to the
     * interface in the second column on the same row as the matching string:
     *
     * String | Interface
     * -------|----------
     * "beforeunloadevent" | BeforeUnloadEvent
     * "compositionevent" | CompositionEvent
     * "customevent" | CustomEvent
     * "devicemotionevent" | DeviceMotionEvent
     * "deviceorientationevent" | DeviceOrientationEvent
     * "dragevent" | DragEvent
     * "event" | Event
     * "events" | Event
     * "focusevent" | FocusEvent
     * "hashchangeevent" | HashChangeEvent
     * "htmlevents" | Event
     * "keyboardevent" | KeyboardEvent
     * "messageevent" | MessageEvent
     * "mouseevent" | MouseEvent
     * "mouseevents" |
     * "storageevent" | StorageEvent
     * "svgevents" | Event
     * "textevent" | CompositionEvent
     * "touchevent" | TouchEvent
     * "uievent" | UIEvent
     * "uievents" | UIEvent
     */
    switch (eventInterface.toLowerCase()) {
        case "beforeunloadevent":
            break;
        case "compositionevent":
            break;
        case "customevent":
            constructor = CustomEventImpl_1.CustomEventImpl;
            break;
        case "devicemotionevent":
            break;
        case "deviceorientationevent":
            break;
        case "dragevent":
            break;
        case "event":
        case "events":
            constructor = EventImpl_1.EventImpl;
            break;
        case "focusevent":
            break;
        case "hashchangeevent":
            break;
        case "htmlevents":
            break;
        case "keyboardevent":
            break;
        case "messageevent":
            break;
        case "mouseevent":
            break;
        case "mouseevents":
            break;
        case "storageevent":
            break;
        case "svgevents":
            break;
        case "textevent":
            break;
        case "touchevent":
            break;
        case "uievent":
            break;
        case "uievents":
            break;
    }
    /**
     * 3. If constructor is null, then throw a "NotSupportedError" DOMException.
     */
    if (constructor === null) {
        throw new DOMException_1.NotSupportedError("Event constructor not found for interface " + eventInterface + ".");
    }
    /**
     * 4. If the interface indicated by constructor is not exposed on the
     * relevant global object of the context object, then throw a
     * "NotSupportedError" DOMException.
     * _Note:_ Typically user agents disable support for touch events in some
     * configurations, in which case this clause would be triggered for the
     * interface TouchEvent.
     */
    // TODO: Implement realms
    /**
     * 5. Let event be the result of creating an event given constructor.
     * 6. Initialize event’s type attribute to the empty string.
     * 7. Initialize event’s timeStamp attribute to a DOMHighResTimeStamp
     * representing the high resolution time from the time origin to now.
     * 8. Initialize event’s isTrusted attribute to false.
     * 9. Unset event’s initialized flag.
     */
    var event = new constructor("");
    event._type = "";
    event._timeStamp = new Date().getTime();
    event._isTrusted = false;
    event._initializedFlag = false;
    /**
     * 10. Return event.
     */
    return event;
}
exports.event_createLegacyEvent = event_createLegacyEvent;
/**
 * Getter of an event handler IDL attribute.
 *
 * @param eventTarget - event target
 * @param name - event name
 */
function event_getterEventHandlerIDLAttribute(thisObj, name) {
    /**
     * 1. Let eventTarget be the result of determining the target of an event
     * handler given this object and name.
     * 2. If eventTarget is null, then return null.
     * 3. Return the result of getting the current value of the event handler
     * given eventTarget and name.
     */
    var eventTarget = event_determineTheTargetOfAnEventHandler(thisObj, name);
    if (eventTarget === null)
        return null;
    return event_getTheCurrentValueOfAnEventHandler(eventTarget, name);
}
exports.event_getterEventHandlerIDLAttribute = event_getterEventHandlerIDLAttribute;
/**
 * Setter of an event handler IDL attribute.
 *
 * @param eventTarget - event target
 * @param name - event name
 * @param value - event handler
 */
function event_setterEventHandlerIDLAttribute(thisObj, name, value) {
    /**
     * 1. Let eventTarget be the result of determining the target of an event
     * handler given this object and name.
     * 2. If eventTarget is null, then return.
     * 3. If the given value is null, then deactivate an event handler given
     * eventTarget and name.
     * 4. Otherwise:
     * 4.1. Let handlerMap be eventTarget's event handler map.
     * 4.2. Let eventHandler be handlerMap[name].
     * 4.3. Set eventHandler's value to the given value.
     * 4.4. Activate an event handler given eventTarget and name.
     */
    var eventTarget = event_determineTheTargetOfAnEventHandler(thisObj, name);
    if (eventTarget === null)
        return;
    if (value === null) {
        event_deactivateAnEventHandler(eventTarget, name);
    }
    else {
        var handlerMap = eventTarget._eventHandlerMap;
        var eventHandler = handlerMap["onabort"];
        if (eventHandler !== undefined) {
            eventHandler.value = value;
        }
        event_activateAnEventHandler(eventTarget, name);
    }
}
exports.event_setterEventHandlerIDLAttribute = event_setterEventHandlerIDLAttribute;
/**
 * Determines the target of an event handler.
 *
 * @param eventTarget - event target
 * @param name - event name
 */
function event_determineTheTargetOfAnEventHandler(eventTarget, name) {
    // TODO: Implement in HTML DOM
    return null;
}
exports.event_determineTheTargetOfAnEventHandler = event_determineTheTargetOfAnEventHandler;
/**
 * Gets the current value of an event handler.
 *
 * @param eventTarget - event target
 * @param name - event name
 */
function event_getTheCurrentValueOfAnEventHandler(eventTarget, name) {
    // TODO: Implement in HTML DOM
    return null;
}
exports.event_getTheCurrentValueOfAnEventHandler = event_getTheCurrentValueOfAnEventHandler;
/**
 * Activates an event handler.
 *
 * @param eventTarget - event target
 * @param name - event name
 */
function event_activateAnEventHandler(eventTarget, name) {
    // TODO: Implement in HTML DOM
}
exports.event_activateAnEventHandler = event_activateAnEventHandler;
/**
 * Deactivates an event handler.
 *
 * @param eventTarget - event target
 * @param name - event name
 */
function event_deactivateAnEventHandler(eventTarget, name) {
    // TODO: Implement in HTML DOM
}
exports.event_deactivateAnEventHandler = event_deactivateAnEventHandler;
//# sourceMappingURL=EventAlgorithm.js.map