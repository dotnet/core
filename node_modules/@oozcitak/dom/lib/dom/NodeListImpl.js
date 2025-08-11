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
var algorithm_1 = require("../algorithm");
/**
 * Represents an ordered set of nodes.
 */
var NodeListImpl = /** @class */ (function () {
    /**
     * Initializes a new instance of `NodeList`.
     *
     * @param root - root node
     */
    function NodeListImpl(root) {
        this._live = true;
        this._filter = null;
        this._length = 0;
        this._root = root;
        return new Proxy(this, this);
    }
    Object.defineProperty(NodeListImpl.prototype, "length", {
        /** @inheritdoc */
        get: function () {
            /**
             * The length attribute must return the number of nodes represented
             * by the collection.
             */
            return this._root._children.size;
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    NodeListImpl.prototype.item = function (index) {
        /**
         * The item(index) method must return the indexth node in the collection.
         * If there is no indexth node in the collection, then the method must
         * return null.
         */
        if (index < 0 || index > this.length - 1)
            return null;
        if (index < this.length / 2) {
            var i = 0;
            var node = this._root._firstChild;
            while (node !== null && i !== index) {
                node = node._nextSibling;
                i++;
            }
            return node;
        }
        else {
            var i = this.length - 1;
            var node = this._root._lastChild;
            while (node !== null && i !== index) {
                node = node._previousSibling;
                i--;
            }
            return node;
        }
    };
    /** @inheritdoc */
    NodeListImpl.prototype.keys = function () {
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
    NodeListImpl.prototype.values = function () {
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
    NodeListImpl.prototype.entries = function () {
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
    NodeListImpl.prototype[Symbol.iterator] = function () {
        return this._root._children[Symbol.iterator]();
    };
    /** @inheritdoc */
    NodeListImpl.prototype.forEach = function (callback, thisArg) {
        var e_1, _a;
        if (thisArg === undefined) {
            thisArg = DOMImpl_1.dom.window;
        }
        var index = 0;
        try {
            for (var _b = __values(this._root._children), _c = _b.next(); !_c.done; _c = _b.next()) {
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
    NodeListImpl.prototype.get = function (target, key, receiver) {
        if (!util_1.isString(key)) {
            return Reflect.get(target, key, receiver);
        }
        var index = Number(key);
        if (isNaN(index)) {
            return Reflect.get(target, key, receiver);
        }
        return target.item(index) || undefined;
    };
    /**
     * Implements a proxy set trap to provide array-like access.
     */
    NodeListImpl.prototype.set = function (target, key, value, receiver) {
        if (!util_1.isString(key)) {
            return Reflect.set(target, key, value, receiver);
        }
        var index = Number(key);
        if (isNaN(index)) {
            return Reflect.set(target, key, value, receiver);
        }
        var node = target.item(index) || undefined;
        if (!node)
            return false;
        if (node._parent) {
            algorithm_1.mutation_replace(node, value, node._parent);
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
     */
    NodeListImpl._create = function (root) {
        return new NodeListImpl(root);
    };
    return NodeListImpl;
}());
exports.NodeListImpl = NodeListImpl;
//# sourceMappingURL=NodeListImpl.js.map