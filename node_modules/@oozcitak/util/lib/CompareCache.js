"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents a cache for storing order between equal objects.
 *
 * This cache is used when an algorithm compares two objects and finds them to
 * be equal but still needs to establish an order between those two objects.
 * When two such objects `a` and `b` are passed to the `check` method, a random
 * number is generated with `Math.random()`. If the random number is less than
 * `0.5` it is assumed that `a < b` otherwise `a > b`. The random number along
 * with `a` and `b` is stored in the cache, so that subsequent checks result
 * in the same consistent result.
 *
 * The cache has a size limit which is defined on initialization.
 */
var CompareCache = /** @class */ (function () {
    /**
     * Initializes a new instance of `CompareCache`.
     *
     * @param limit - maximum number of items to keep in the cache. When the limit
     * is exceeded the first item is removed from the cache.
     */
    function CompareCache(limit) {
        if (limit === void 0) { limit = 1000; }
        this._items = new Map();
        this._limit = limit;
    }
    /**
     * Compares and caches the given objects. Returns `true` if `objA < objB` and
     * `false` otherwise.
     *
     * @param objA - an item to compare
     * @param objB - an item to compare
     */
    CompareCache.prototype.check = function (objA, objB) {
        if (this._items.get(objA) === objB)
            return true;
        else if (this._items.get(objB) === objA)
            return false;
        var result = (Math.random() < 0.5);
        if (result) {
            this._items.set(objA, objB);
        }
        else {
            this._items.set(objB, objA);
        }
        if (this._items.size > this._limit) {
            var it_1 = this._items.keys().next();
            /* istanbul ignore else */
            if (!it_1.done) {
                this._items.delete(it_1.value);
            }
        }
        return result;
    };
    return CompareCache;
}());
exports.CompareCache = CompareCache;
//# sourceMappingURL=CompareCache.js.map