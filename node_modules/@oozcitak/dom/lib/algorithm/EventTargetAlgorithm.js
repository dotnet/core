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
/**
 * Flattens the given options argument.
 *
 * @param options - options argument
 */
function eventTarget_flatten(options) {
    /**
     * 1. If options is a boolean, then return options.
     * 2. Return options’s capture.
     */
    if (util_1.isBoolean(options)) {
        return options;
    }
    else {
        return options.capture || false;
    }
}
exports.eventTarget_flatten = eventTarget_flatten;
/**
 * Flattens the given options argument.
 *
 * @param options - options argument
 */
function eventTarget_flattenMore(options) {
    /**
     * 1. Let capture be the result of flattening options.
     * 2. Let once and passive be false.
     * 3. If options is a dictionary, then set passive to options’s passive and
     * once to options’s once.
     * 4. Return capture, passive, and once.
     */
    var capture = eventTarget_flatten(options);
    var once = false;
    var passive = false;
    if (!util_1.isBoolean(options)) {
        once = options.once || false;
        passive = options.passive || false;
    }
    return [capture, passive, once];
}
exports.eventTarget_flattenMore = eventTarget_flattenMore;
/**
 * Adds a new event listener.
 *
 * @param eventTarget - event target
 * @param listener - event listener
 */
function eventTarget_addEventListener(eventTarget, listener) {
    /**
     * 1. If eventTarget is a ServiceWorkerGlobalScope object, its service
     * worker’s script resource’s has ever been evaluated flag is set, and
     * listener’s type matches the type attribute value of any of the service
     * worker events, then report a warning to the console that this might not
     * give the expected results. [SERVICE-WORKERS]
     */
    // TODO: service worker
    /**
     * 2. If listener’s callback is null, then return.
     */
    if (listener.callback === null)
        return;
    /**
     * 3. If eventTarget’s event listener list does not contain an event listener
     * whose type is listener’s type, callback is listener’s callback, and capture
     * is listener’s capture, then append listener to eventTarget’s event listener
     * list.
     */
    for (var i = 0; i < eventTarget._eventListenerList.length; i++) {
        var entry = eventTarget._eventListenerList[i];
        if (entry.type === listener.type && entry.callback.handleEvent === listener.callback.handleEvent
            && entry.capture === listener.capture) {
            return;
        }
    }
    eventTarget._eventListenerList.push(listener);
}
exports.eventTarget_addEventListener = eventTarget_addEventListener;
/**
 * Removes an event listener.
 *
 * @param eventTarget - event target
 * @param listener - event listener
 */
function eventTarget_removeEventListener(eventTarget, listener, index) {
    /**
     * 1. If eventTarget is a ServiceWorkerGlobalScope object and its service
     * worker’s set of event types to handle contains type, then report a
     * warning to the console that this might not give the expected results.
     * [SERVICE-WORKERS]
     */
    // TODO: service worker
    /**
     * 2. Set listener’s removed to true and remove listener from eventTarget’s
     * event listener list.
     */
    listener.removed = true;
    eventTarget._eventListenerList.splice(index, 1);
}
exports.eventTarget_removeEventListener = eventTarget_removeEventListener;
/**
 * Removes all event listeners.
 *
 * @param eventTarget - event target
 */
function eventTarget_removeAllEventListeners(eventTarget) {
    /**
     * To remove all event listeners, given an EventTarget object eventTarget,
     * for each listener of eventTarget’s event listener list, remove an event
     * listener with eventTarget and listener.
     */
    var e_1, _a;
    try {
        for (var _b = __values(eventTarget._eventListenerList), _c = _b.next(); !_c.done; _c = _b.next()) {
            var e = _c.value;
            e.removed = true;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    eventTarget._eventListenerList.length = 0;
}
exports.eventTarget_removeAllEventListeners = eventTarget_removeAllEventListeners;
//# sourceMappingURL=EventTargetAlgorithm.js.map