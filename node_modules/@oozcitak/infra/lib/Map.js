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
var util_1 = require("@oozcitak/util");
/**
 * Gets the value corresponding to the given key.
 *
 * @param map - a map
 * @param key - a key
 */
function get(map, key) {
    return map.get(key);
}
exports.get = get;
/**
 * Sets the value corresponding to the given key.
 *
 * @param map - a map
 * @param key - a key
 * @param val - a value
 */
function set(map, key, val) {
    map.set(key, val);
}
exports.set = set;
/**
 * Removes the item with the given key or all items matching condition.
 *
 * @param map - a map
 * @param conditionOrItem - the key of an item to remove or a condition matching
 * items to remove
 */
function remove(map, conditionOrItem) {
    var e_1, _a, e_2, _b;
    if (!util_1.isFunction(conditionOrItem)) {
        map.delete(conditionOrItem);
    }
    else {
        var toRemove = [];
        try {
            for (var map_1 = __values(map), map_1_1 = map_1.next(); !map_1_1.done; map_1_1 = map_1.next()) {
                var item = map_1_1.value;
                if (!!conditionOrItem.call(null, item)) {
                    toRemove.push(item[0]);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (map_1_1 && !map_1_1.done && (_a = map_1.return)) _a.call(map_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var toRemove_1 = __values(toRemove), toRemove_1_1 = toRemove_1.next(); !toRemove_1_1.done; toRemove_1_1 = toRemove_1.next()) {
                var key = toRemove_1_1.value;
                map.delete(key);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (toRemove_1_1 && !toRemove_1_1.done && (_b = toRemove_1.return)) _b.call(toRemove_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
}
exports.remove = remove;
/**
 * Determines if the map contains a value with the given key.
 *
 * @param map - a map
 * @param conditionOrItem - the key of an item to match or a condition matching
 * items
 */
function contains(map, conditionOrItem) {
    var e_3, _a;
    if (!util_1.isFunction(conditionOrItem)) {
        return map.has(conditionOrItem);
    }
    else {
        try {
            for (var map_2 = __values(map), map_2_1 = map_2.next(); !map_2_1.done; map_2_1 = map_2.next()) {
                var item = map_2_1.value;
                if (!!conditionOrItem.call(null, item)) {
                    return true;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (map_2_1 && !map_2_1.done && (_a = map_2.return)) _a.call(map_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return false;
    }
}
exports.contains = contains;
/**
 * Gets the keys of the map.
 *
 * @param map - a map
 */
function keys(map) {
    return new Set(map.keys());
}
exports.keys = keys;
/**
 * Gets the values of the map.
 *
 * @param map - a map
 */
function values(map) {
    return __spread(map.values());
}
exports.values = values;
/**
 * Gets the size of the map.
 *
 * @param map - a map
 * @param condition - an optional condition to match
 */
function size(map, condition) {
    var e_4, _a;
    if (condition === undefined) {
        return map.size;
    }
    else {
        var count = 0;
        try {
            for (var map_3 = __values(map), map_3_1 = map_3.next(); !map_3_1.done; map_3_1 = map_3.next()) {
                var item = map_3_1.value;
                if (!!condition.call(null, item)) {
                    count++;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (map_3_1 && !map_3_1.done && (_a = map_3.return)) _a.call(map_3);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return count;
    }
}
exports.size = size;
/**
 * Determines if the map is empty.
 *
 * @param map - a map
 */
function isEmpty(map) {
    return map.size === 0;
}
exports.isEmpty = isEmpty;
/**
 * Returns an iterator for the items of the map.
 *
 * @param map - a map
 * @param condition - an optional condition to match
 */
function forEach(map, condition) {
    var map_4, map_4_1, item, e_5_1;
    var e_5, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(condition === undefined)) return [3 /*break*/, 2];
                return [5 /*yield**/, __values(map)];
            case 1:
                _b.sent();
                return [3 /*break*/, 9];
            case 2:
                _b.trys.push([2, 7, 8, 9]);
                map_4 = __values(map), map_4_1 = map_4.next();
                _b.label = 3;
            case 3:
                if (!!map_4_1.done) return [3 /*break*/, 6];
                item = map_4_1.value;
                if (!!!condition.call(null, item)) return [3 /*break*/, 5];
                return [4 /*yield*/, item];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                map_4_1 = map_4.next();
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 9];
            case 7:
                e_5_1 = _b.sent();
                e_5 = { error: e_5_1 };
                return [3 /*break*/, 9];
            case 8:
                try {
                    if (map_4_1 && !map_4_1.done && (_a = map_4.return)) _a.call(map_4);
                }
                finally { if (e_5) throw e_5.error; }
                return [7 /*endfinally*/];
            case 9: return [2 /*return*/];
        }
    });
}
exports.forEach = forEach;
/**
 * Creates and returns a shallow clone of map.
 *
 * @param map - a map
 */
function clone(map) {
    return new Map(map);
}
exports.clone = clone;
/**
 * Returns a new map containing items from the map sorted in ascending
 * order.
 *
 * @param map - a map
 * @param lessThanAlgo - a function that returns `true` if its first argument
 * is less than its second argument, and `false` otherwise.
 */
function sortInAscendingOrder(map, lessThanAlgo) {
    var list = new (Array.bind.apply(Array, __spread([void 0], map)))();
    list.sort(function (itemA, itemB) {
        return lessThanAlgo.call(null, itemA, itemB) ? -1 : 1;
    });
    return new Map(list);
}
exports.sortInAscendingOrder = sortInAscendingOrder;
/**
 * Returns a new map containing items from the map sorted in descending
 * order.
 *
 * @param map - a map
 * @param lessThanAlgo - a function that returns `true` if its first argument
 * is less than its second argument, and `false` otherwise.
 */
function sortInDescendingOrder(map, lessThanAlgo) {
    var list = new (Array.bind.apply(Array, __spread([void 0], map)))();
    list.sort(function (itemA, itemB) {
        return lessThanAlgo.call(null, itemA, itemB) ? 1 : -1;
    });
    return new Map(list);
}
exports.sortInDescendingOrder = sortInDescendingOrder;
//# sourceMappingURL=Map.js.map