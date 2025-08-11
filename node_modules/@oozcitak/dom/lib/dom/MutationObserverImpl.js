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
var DOMImpl_1 = require("./DOMImpl");
var util_1 = require("../util");
var infra_1 = require("@oozcitak/infra");
/**
 * Represents an object that can be used to observe mutations to the tree of
 * nodes.
 */
var MutationObserverImpl = /** @class */ (function () {
    /**
     * Initializes a new instance of `MutationObserver`.
     *
     * @param callback - the callback function
     */
    function MutationObserverImpl(callback) {
        this._nodeList = [];
        this._recordQueue = [];
        /**
         * 1. Let mo be a new MutationObserver object whose callback is callback.
         * 2. Append mo to mo’s relevant agent’s mutation observers.
         * 3. Return mo.
         */
        this._callback = callback;
        var window = DOMImpl_1.dom.window;
        infra_1.set.append(window._mutationObservers, this);
    }
    /** @inheritdoc */
    MutationObserverImpl.prototype.observe = function (target, options) {
        var e_1, _a;
        options = options || {
            childList: false,
            subtree: false
        };
        /**
         * 1. If either options’s attributeOldValue or attributeFilter is present
         * and options’s attributes is omitted, then set options’s attributes
         * to true.
         * 2. If options’s characterDataOldValue is present and options’s
         * characterData is omitted, then set options’s characterData to true.
         * 3. If none of options’s childList, attributes, and characterData is
         * true, then throw a TypeError.
         * 4. If options’s attributeOldValue is true and options’s attributes is
         * false, then throw a TypeError.
         * 5. If options’s attributeFilter is present and options’s attributes is
         *  false, then throw a TypeError.
         * 6. If options’s characterDataOldValue is true and options’s characterData
         * is false, then throw a TypeError.
         */
        if ((options.attributeOldValue !== undefined || options.attributeFilter !== undefined) &&
            options.attributes === undefined) {
            options.attributes = true;
        }
        if (options.characterDataOldValue !== undefined && options.characterData === undefined) {
            options.characterData = true;
        }
        if (!options.childList && !options.attributes && !options.characterData) {
            throw new TypeError();
        }
        if (options.attributeOldValue && !options.attributes) {
            throw new TypeError();
        }
        if (options.attributeFilter !== undefined && !options.attributes) {
            throw new TypeError();
        }
        if (options.characterDataOldValue && !options.characterData) {
            throw new TypeError();
        }
        /**
         * 7. For each registered of target’s registered observer list, if
         * registered’s observer is the context object:
         */
        var isRegistered = false;
        var coptions = options;
        var _loop_1 = function (registered) {
            var e_2, _a;
            if (registered.observer === this_1) {
                isRegistered = true;
                try {
                    /**
                     * 7.1. For each node of the context object’s node list, remove all
                     * transient registered observers whose source is registered from node’s
                     * registered observer list.
                     */
                    for (var _b = (e_2 = void 0, __values(this_1._nodeList)), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var node = _c.value;
                        infra_1.list.remove(node._registeredObserverList, function (ob) {
                            return util_1.Guard.isTransientRegisteredObserver(ob) && ob.source === registered;
                        });
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                /**
                 * 7.2. Set registered’s options to options.
                 */
                registered.options = coptions;
            }
        };
        var this_1 = this;
        try {
            for (var _b = __values(target._registeredObserverList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var registered = _c.value;
                _loop_1(registered);
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
         * 8. Otherwise:
         * 8.1. Append a new registered observer whose observer is the context
         * object and options is options to target’s registered observer list.
         * 8.2. Append target to the context object’s node list.
         */
        if (!isRegistered) {
            target._registeredObserverList.push({ observer: this, options: options });
            this._nodeList.push(target);
        }
    };
    /** @inheritdoc */
    MutationObserverImpl.prototype.disconnect = function () {
        var e_3, _a;
        var _this = this;
        try {
            /**
             * 1. For each node of the context object’s node list, remove any
             * registered observer from node’s registered observer list for which the
             * context object is the observer.
             */
            for (var _b = __values(this._nodeList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var node = _c.value;
                infra_1.list.remove((node)._registeredObserverList, function (ob) {
                    return ob.observer === _this;
                });
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        /**
         * 2. Empty the context object’s record queue.
         */
        this._recordQueue = [];
    };
    /** @inheritdoc */
    MutationObserverImpl.prototype.takeRecords = function () {
        /**
         * 1. Let records be a clone of the context object’s record queue.
         * 2. Empty the context object’s record queue.
         * 3. Return records.
         */
        var records = this._recordQueue;
        this._recordQueue = [];
        return records;
    };
    return MutationObserverImpl;
}());
exports.MutationObserverImpl = MutationObserverImpl;
//# sourceMappingURL=MutationObserverImpl.js.map