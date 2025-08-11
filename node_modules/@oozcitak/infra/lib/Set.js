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
 * Adds the given item to the end of the set.
 *
 * @param set - a set
 * @param item - an item
 */
function append(set, item) {
    set.add(item);
}
exports.append = append;
/**
 * Extends a set by appending all items from another set.
 *
 * @param setA - a list to extend
 * @param setB - a list containing items to append to `setA`
 */
function extend(setA, setB) {
    setB.forEach(setA.add, setA);
}
exports.extend = extend;
/**
 * Inserts the given item to the start of the set.
 *
 * @param set - a set
 * @param item - an item
 */
function prepend(set, item) {
    var cloned = new Set(set);
    set.clear();
    set.add(item);
    cloned.forEach(set.add, set);
}
exports.prepend = prepend;
/**
 * Replaces the given item or all items matching condition with a new item.
 *
 * @param set - a set
 * @param conditionOrItem - an item to replace or a condition matching items
 * to replace
 * @param item - an item
 */
function replace(set, conditionOrItem, newItem) {
    var e_1, _a;
    var newSet = new Set();
    try {
        for (var set_1 = __values(set), set_1_1 = set_1.next(); !set_1_1.done; set_1_1 = set_1.next()) {
            var oldItem = set_1_1.value;
            if (util_1.isFunction(conditionOrItem)) {
                if (!!conditionOrItem.call(null, oldItem)) {
                    newSet.add(newItem);
                }
                else {
                    newSet.add(oldItem);
                }
            }
            else if (oldItem === conditionOrItem) {
                newSet.add(newItem);
            }
            else {
                newSet.add(oldItem);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (set_1_1 && !set_1_1.done && (_a = set_1.return)) _a.call(set_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    set.clear();
    newSet.forEach(set.add, set);
}
exports.replace = replace;
/**
 * Inserts the given item before the given index.
 *
 * @param set - a set
 * @param item - an item
 */
function insert(set, item, index) {
    var e_2, _a;
    var newSet = new Set();
    var i = 0;
    try {
        for (var set_2 = __values(set), set_2_1 = set_2.next(); !set_2_1.done; set_2_1 = set_2.next()) {
            var oldItem = set_2_1.value;
            if (i === index)
                newSet.add(item);
            newSet.add(oldItem);
            i++;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (set_2_1 && !set_2_1.done && (_a = set_2.return)) _a.call(set_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    set.clear();
    newSet.forEach(set.add, set);
}
exports.insert = insert;
/**
 * Removes the given item or all items matching condition.
 *
 * @param set - a set
 * @param conditionOrItem - an item to remove or a condition matching items
 * to remove
 */
function remove(set, conditionOrItem) {
    var e_3, _a, e_4, _b;
    if (!util_1.isFunction(conditionOrItem)) {
        set.delete(conditionOrItem);
    }
    else {
        var toRemove = [];
        try {
            for (var set_3 = __values(set), set_3_1 = set_3.next(); !set_3_1.done; set_3_1 = set_3.next()) {
                var item = set_3_1.value;
                if (!!conditionOrItem.call(null, item)) {
                    toRemove.push(item);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (set_3_1 && !set_3_1.done && (_a = set_3.return)) _a.call(set_3);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            for (var toRemove_1 = __values(toRemove), toRemove_1_1 = toRemove_1.next(); !toRemove_1_1.done; toRemove_1_1 = toRemove_1.next()) {
                var oldItem = toRemove_1_1.value;
                set.delete(oldItem);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (toRemove_1_1 && !toRemove_1_1.done && (_b = toRemove_1.return)) _b.call(toRemove_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
    }
}
exports.remove = remove;
/**
 * Removes all items from the set.
 */
function empty(set) {
    set.clear();
}
exports.empty = empty;
/**
 * Determines if the set contains the given item or any items matching
 * condition.
 *
 * @param set - a set
 * @param conditionOrItem - an item to a condition to match
 */
function contains(set, conditionOrItem) {
    var e_5, _a;
    if (!util_1.isFunction(conditionOrItem)) {
        return set.has(conditionOrItem);
    }
    else {
        try {
            for (var set_4 = __values(set), set_4_1 = set_4.next(); !set_4_1.done; set_4_1 = set_4.next()) {
                var oldItem = set_4_1.value;
                if (!!conditionOrItem.call(null, oldItem)) {
                    return true;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (set_4_1 && !set_4_1.done && (_a = set_4.return)) _a.call(set_4);
            }
            finally { if (e_5) throw e_5.error; }
        }
    }
    return false;
}
exports.contains = contains;
/**
 * Returns the count of items in the set matching the given condition.
 *
 * @param set - a set
 * @param condition - an optional condition to match
 */
function size(set, condition) {
    var e_6, _a;
    if (condition === undefined) {
        return set.size;
    }
    else {
        var count = 0;
        try {
            for (var set_5 = __values(set), set_5_1 = set_5.next(); !set_5_1.done; set_5_1 = set_5.next()) {
                var item = set_5_1.value;
                if (!!condition.call(null, item)) {
                    count++;
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (set_5_1 && !set_5_1.done && (_a = set_5.return)) _a.call(set_5);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return count;
    }
}
exports.size = size;
/**
 * Determines if the set is empty.
 *
 * @param set - a set
 */
function isEmpty(set) {
    return set.size === 0;
}
exports.isEmpty = isEmpty;
/**
 * Returns an iterator for the items of the set.
 *
 * @param set - a set
 * @param condition - an optional condition to match
 */
function forEach(set, condition) {
    var set_6, set_6_1, item, e_7_1;
    var e_7, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(condition === undefined)) return [3 /*break*/, 2];
                return [5 /*yield**/, __values(set)];
            case 1:
                _b.sent();
                return [3 /*break*/, 9];
            case 2:
                _b.trys.push([2, 7, 8, 9]);
                set_6 = __values(set), set_6_1 = set_6.next();
                _b.label = 3;
            case 3:
                if (!!set_6_1.done) return [3 /*break*/, 6];
                item = set_6_1.value;
                if (!!!condition.call(null, item)) return [3 /*break*/, 5];
                return [4 /*yield*/, item];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                set_6_1 = set_6.next();
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 9];
            case 7:
                e_7_1 = _b.sent();
                e_7 = { error: e_7_1 };
                return [3 /*break*/, 9];
            case 8:
                try {
                    if (set_6_1 && !set_6_1.done && (_a = set_6.return)) _a.call(set_6);
                }
                finally { if (e_7) throw e_7.error; }
                return [7 /*endfinally*/];
            case 9: return [2 /*return*/];
        }
    });
}
exports.forEach = forEach;
/**
 * Creates and returns a shallow clone of set.
 *
 * @param set - a set
 */
function clone(set) {
    return new Set(set);
}
exports.clone = clone;
/**
 * Returns a new set containing items from the set sorted in ascending
 * order.
 *
 * @param set - a set
 * @param lessThanAlgo - a function that returns `true` if its first argument
 * is less than its second argument, and `false` otherwise.
 */
function sortInAscendingOrder(set, lessThanAlgo) {
    var list = new (Array.bind.apply(Array, __spread([void 0], set)))();
    list.sort(function (itemA, itemB) {
        return lessThanAlgo.call(null, itemA, itemB) ? -1 : 1;
    });
    return new Set(list);
}
exports.sortInAscendingOrder = sortInAscendingOrder;
/**
 * Returns a new set containing items from the set sorted in descending
 * order.
 *
 * @param set - a set
 * @param lessThanAlgo - a function that returns `true` if its first argument
 * is less than its second argument, and `false` otherwise.
 */
function sortInDescendingOrder(set, lessThanAlgo) {
    var list = new (Array.bind.apply(Array, __spread([void 0], set)))();
    list.sort(function (itemA, itemB) {
        return lessThanAlgo.call(null, itemA, itemB) ? 1 : -1;
    });
    return new Set(list);
}
exports.sortInDescendingOrder = sortInDescendingOrder;
/**
 * Determines if a set is a subset of another set.
 *
 * @param subset - a set
 * @param superset - a superset possibly containing all items from `subset`.
 */
function isSubsetOf(subset, superset) {
    var e_8, _a;
    try {
        for (var subset_1 = __values(subset), subset_1_1 = subset_1.next(); !subset_1_1.done; subset_1_1 = subset_1.next()) {
            var item = subset_1_1.value;
            if (!superset.has(item))
                return false;
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (subset_1_1 && !subset_1_1.done && (_a = subset_1.return)) _a.call(subset_1);
        }
        finally { if (e_8) throw e_8.error; }
    }
    return true;
}
exports.isSubsetOf = isSubsetOf;
/**
 * Determines if a set is a superset of another set.
 *
 * @param superset - a set
 * @param subset - a subset possibly contained within `superset`.
 */
function isSupersetOf(superset, subset) {
    return isSubsetOf(subset, superset);
}
exports.isSupersetOf = isSupersetOf;
/**
 * Returns a new set with items that are contained in both sets.
 *
 * @param setA - a set
 * @param setB - a set
 */
function intersection(setA, setB) {
    var e_9, _a;
    var newSet = new Set();
    try {
        for (var setA_1 = __values(setA), setA_1_1 = setA_1.next(); !setA_1_1.done; setA_1_1 = setA_1.next()) {
            var item = setA_1_1.value;
            if (setB.has(item))
                newSet.add(item);
        }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (setA_1_1 && !setA_1_1.done && (_a = setA_1.return)) _a.call(setA_1);
        }
        finally { if (e_9) throw e_9.error; }
    }
    return newSet;
}
exports.intersection = intersection;
/**
 * Returns a new set with items from both sets.
 *
 * @param setA - a set
 * @param setB - a set
 */
function union(setA, setB) {
    var newSet = new Set(setA);
    setB.forEach(newSet.add, newSet);
    return newSet;
}
exports.union = union;
/**
 * Returns a set of integers from `n` to `m` inclusive.
 *
 * @param n - starting number
 * @param m - ending number
 */
function range(n, m) {
    var newSet = new Set();
    for (var i = n; i <= m; i++) {
        newSet.add(i);
    }
    return newSet;
}
exports.range = range;
//# sourceMappingURL=Set.js.map