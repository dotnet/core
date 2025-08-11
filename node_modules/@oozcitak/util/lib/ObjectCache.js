"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
/**
 * Represents a cache of objects with a size limit.
 */
var ObjectCache = /** @class */ (function () {
    /**
     * Initializes a new instance of `ObjectCache`.
     *
     * @param limit - maximum number of items to keep in the cache. When the limit
     * is exceeded the first item is removed from the cache.
     */
    function ObjectCache(limit) {
        if (limit === void 0) { limit = 1000; }
        this._items = new Map();
        this._limit = limit;
    }
    /**
     * Gets an item from the cache.
     *
     * @param key - object key
     */
    ObjectCache.prototype.get = function (key) {
        return this._items.get(key);
    };
    /**
     * Adds a new item to the cache.
     *
     * @param key - object key
     * @param value - object value
     */
    ObjectCache.prototype.set = function (key, value) {
        this._items.set(key, value);
        if (this._items.size > this._limit) {
            var it_1 = this._items.keys().next();
            /* istanbul ignore else */
            if (!it_1.done) {
                this._items.delete(it_1.value);
            }
        }
    };
    /**
     * Removes an item from the cache.
     *
     * @param item - an item
     */
    ObjectCache.prototype.delete = function (key) {
        return this._items.delete(key);
    };
    /**
     * Determines if an item is in the cache.
     *
     * @param item - an item
     */
    ObjectCache.prototype.has = function (key) {
        return this._items.has(key);
    };
    /**
     * Removes all items from the cache.
     */
    ObjectCache.prototype.clear = function () {
        this._items.clear();
    };
    Object.defineProperty(ObjectCache.prototype, "size", {
        /**
         * Gets the number of items in the cache.
         */
        get: function () { return this._items.size; },
        enumerable: true,
        configurable: true
    });
    /**
     * Applies the given callback function to all elements of the cache.
     */
    ObjectCache.prototype.forEach = function (callback, thisArg) {
        this._items.forEach(function (v, k) { return callback.call(thisArg, k, v); });
    };
    /**
     * Iterates through the items in the set.
     */
    ObjectCache.prototype.keys = function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [5 /*yield**/, __values(this._items.keys())];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
    /**
     * Iterates through the items in the set.
     */
    ObjectCache.prototype.values = function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [5 /*yield**/, __values(this._items.values())];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
    /**
     * Iterates through the items in the set.
     */
    ObjectCache.prototype.entries = function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [5 /*yield**/, __values(this._items.entries())];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
    /**
     * Iterates through the items in the set.
     */
    ObjectCache.prototype[Symbol.iterator] = function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [5 /*yield**/, __values(this._items)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
    Object.defineProperty(ObjectCache.prototype, Symbol.toStringTag, {
        /**
         * Returns the string tag of the cache.
         */
        get: function () {
            return "ObjectCache";
        },
        enumerable: true,
        configurable: true
    });
    return ObjectCache;
}());
exports.ObjectCache = ObjectCache;
//# sourceMappingURL=ObjectCache.js.map