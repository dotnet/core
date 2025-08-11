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
Object.defineProperty(exports, "__esModule", { value: true });
var DOMException_1 = require("./DOMException");
var util_1 = require("../util");
var algorithm_1 = require("../algorithm");
/**
 * Represents a target to which an event can be dispatched.
 */
var EventTargetImpl = /** @class */ (function () {
    /**
     * Initializes a new instance of `EventTarget`.
     */
    function EventTargetImpl() {
    }
    Object.defineProperty(EventTargetImpl.prototype, "_eventListenerList", {
        get: function () {
            return this.__eventListenerList || (this.__eventListenerList = []);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventTargetImpl.prototype, "_eventHandlerMap", {
        get: function () {
            return this.__eventHandlerMap || (this.__eventHandlerMap = {});
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    EventTargetImpl.prototype.addEventListener = function (type, callback, options) {
        if (options === void 0) { options = { passive: false, once: false, capture: false }; }
        /**
         * 1. Let capture, passive, and once be the result of flattening more options.
         */
        var _a = __read(algorithm_1.eventTarget_flattenMore(options), 3), capture = _a[0], passive = _a[1], once = _a[2];
        // convert callback function to EventListener, return if null
        var listenerCallback;
        if (!callback) {
            return;
        }
        else if (util_1.Guard.isEventListener(callback)) {
            listenerCallback = callback;
        }
        else {
            listenerCallback = { handleEvent: callback };
        }
        /**
         * 2. Add an event listener with the context object and an event listener
         * whose type is type, callback is callback, capture is capture, passive is
         * passive, and once is once.
         */
        algorithm_1.eventTarget_addEventListener(this, {
            type: type,
            callback: listenerCallback,
            capture: capture,
            passive: passive,
            once: once,
            removed: false
        });
    };
    /** @inheritdoc */
    EventTargetImpl.prototype.removeEventListener = function (type, callback, options) {
        /**
         * TODO: Implement realms
         * 1. If the context object’s relevant global object is a
         * ServiceWorkerGlobalScope object and its associated service worker’s
         * script resource’s has ever been evaluated flag is set, then throw
         * a TypeError. [SERVICE-WORKERS]
         */
        if (options === void 0) { options = { capture: false }; }
        /**
         * 2. Let capture be the result of flattening options.
         */
        var capture = algorithm_1.eventTarget_flatten(options);
        if (!callback)
            return;
        /**
         * 3. If the context object’s event listener list contains an event listener
         * whose type is type, callback is callback, and capture is capture, then
         * remove an event listener with the context object and that event listener.
         */
        for (var i = 0; i < this._eventListenerList.length; i++) {
            var entry = this._eventListenerList[i];
            if (entry.type !== type || entry.capture !== capture)
                continue;
            if (util_1.Guard.isEventListener(callback) && entry.callback === callback) {
                algorithm_1.eventTarget_removeEventListener(this, entry, i);
                break;
            }
            else if (callback && entry.callback.handleEvent === callback) {
                algorithm_1.eventTarget_removeEventListener(this, entry, i);
                break;
            }
        }
    };
    /** @inheritdoc */
    EventTargetImpl.prototype.dispatchEvent = function (event) {
        /**
         * 1. If event’s dispatch flag is set, or if its initialized flag is not
         * set, then throw an "InvalidStateError" DOMException.
         * 2. Initialize event’s isTrusted attribute to false.
         * 3. Return the result of dispatching event to the context object.
         */
        if (event._dispatchFlag || !event._initializedFlag) {
            throw new DOMException_1.InvalidStateError();
        }
        event._isTrusted = false;
        return algorithm_1.event_dispatch(event, this);
    };
    /** @inheritdoc */
    EventTargetImpl.prototype._getTheParent = function (event) {
        return null;
    };
    return EventTargetImpl;
}());
exports.EventTargetImpl = EventTargetImpl;
//# sourceMappingURL=EventTargetImpl.js.map