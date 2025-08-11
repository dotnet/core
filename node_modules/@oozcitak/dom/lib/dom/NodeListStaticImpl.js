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
var util_1 = require("@oozcitak/util");
/**
 * Represents an ordered list of nodes.
 * This is a static implementation of `NodeList`.
 */
var NodeListStaticImpl = /** @class */ (function () {
    /**
     * Initializes a new instance of `NodeList`.
     *
     * @param root - root node
     */
    function NodeListStaticImpl(root) {
        this._live = false;
        this._items = [];
        this._length = 0;
        this._root = root;
        this._items = [];
        this._filter = function (node) { return true; };
        return new Proxy(this, this);
    }
    Object.defineProperty(NodeListStaticImpl.prototype, "length", {
        /** @inheritdoc */
        get: function () {
            /**
             * The length attribute must return the number of nodes represented by
             * the collection.
             */
            return this._items.length;
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    NodeListStaticImpl.prototype.item = function (index) {
        /**
         * The item(index) method must return the indexth node in the collection.
         * If there is no indexth node in the collection, then the method must
         * return null.
         */
        if (index < 0 || index > this.length - 1)
            return null;
        return this._items[index];
    };
    /** @inheritdoc */
    NodeListStaticImpl.prototype.keys = function () {
        var _a;
        return _a = {},
            _a[Symbol.iterator] = function () {
                var index = 0;
                return {
                    next: function () {
                        if (index === this.length) {
                            return { done: true, value: null };
                        }
                        else {
                            return { done: false, value: index++ };
                        }
                    }.bind(this)
                };
            }.bind(this),
            _a;
    };
    /** @inheritdoc */
    NodeListStaticImpl.prototype.values = function () {
        var _a;
        return _a = {},
            _a[Symbol.iterator] = function () {
                var it = this[Symbol.iterator]();
                return {
                    next: function () {
                        return it.next();
                    }
                };
            }.bind(this),
            _a;
    };
    /** @inheritdoc */
    NodeListStaticImpl.prototype.entries = function () {
        var _a;
        return _a = {},
            _a[Symbol.iterator] = function () {
                var it = this[Symbol.iterator]();
                var index = 0;
                return {
                    next: function () {
                        var itResult = it.next();
                        if (itResult.done) {
                            return { done: true, value: null };
                        }
                        else {
                            return { done: false, value: [index++, itResult.value] };
                        }
                    }
                };
            }.bind(this),
            _a;
    };
    /** @inheritdoc */
    NodeListStaticImpl.prototype[Symbol.iterator] = function () {
        var it = this._items[Symbol.iterator]();
        return {
            next: function () {
                return it.next();
            }
        };
    };
    /** @inheritdoc */
    NodeListStaticImpl.prototype.forEach = function (callback, thisArg) {
        var e_1, _a;
        if (thisArg === undefined) {
            thisArg = DOMImpl_1.dom.window;
        }
        var index = 0;
        try {
            for (var _b = __values(this._items), _c = _b.next(); !_c.done; _c = _b.next()) {
                var node = _c.value;
                callback.call(thisArg, node, index++, this);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    /**
     * Implements a proxy get trap to provide array-like access.
     */
    NodeListStaticImpl.prototype.get = function (target, key, receiver) {
        if (!util_1.isString(key)) {
            return Reflect.get(target, key, receiver);
        }
        var index = Number(key);
        if (isNaN(index)) {
            return Reflect.get(target, key, receiver);
        }
        return target._items[index] || undefined;
    };
    /**
     * Implements a proxy set trap to provide array-like access.
     */
    NodeListStaticImpl.prototype.set = function (target, key, value, receiver) {
        if (!util_1.isString(key)) {
            return Reflect.set(target, key, value, receiver);
        }
        var index = Number(key);
        if (isNaN(index)) {
            return Reflect.set(target, key, value, receiver);
        }
        if (index >= 0 && index < target._items.length) {
            target._items[index] = value;
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Creates a new `NodeList`.
     *
     * @param root - root node
     * @param items - a list of items to initialize the list
     */
    NodeListStaticImpl._create = function (root, items) {
        var list = new NodeListStaticImpl(root);
        list._items = items;
        return list;
    };
    return NodeListStaticImpl;
}());
exports.NodeListStaticImpl = NodeListStaticImpl;
//# sourceMappingURL=NodeListStaticImpl.js.map