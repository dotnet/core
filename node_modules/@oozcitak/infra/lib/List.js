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
 * Adds the given item to the end of the list.
 *
 * @param list - a list
 * @param item - an item
 */
function append(list, item) {
    list.push(item);
}
exports.append = append;
/**
 * Extends a list by appending all items from another list.
 *
 * @param listA - a list to extend
 * @param listB - a list containing items to append to `listA`
 */
function extend(listA, listB) {
    listA.push.apply(listA, __spread(listB));
}
exports.extend = extend;
/**
 * Inserts the given item to the start of the list.
 *
 * @param list - a list
 * @param item - an item
 */
function prepend(list, item) {
    list.unshift(item);
}
exports.prepend = prepend;
/**
 * Replaces the given item or all items matching condition with a new item.
 *
 * @param list - a list
 * @param conditionOrItem - an item to replace or a condition matching items
 * to replace
 * @param item - an item
 */
function replace(list, conditionOrItem, newItem) {
    var e_1, _a;
    var i = 0;
    try {
        for (var list_1 = __values(list), list_1_1 = list_1.next(); !list_1_1.done; list_1_1 = list_1.next()) {
            var oldItem = list_1_1.value;
            if (util_1.isFunction(conditionOrItem)) {
                if (!!conditionOrItem.call(null, oldItem)) {
                    list[i] = newItem;
                }
            }
            else if (oldItem === conditionOrItem) {
                list[i] = newItem;
                return;
            }
            i++;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (list_1_1 && !list_1_1.done && (_a = list_1.return)) _a.call(list_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
exports.replace = replace;
/**
 * Inserts the given item before the given index.
 *
 * @param list - a list
 * @param item - an item
 */
function insert(list, item, index) {
    list.splice(index, 0, item);
}
exports.insert = insert;
/**
 * Removes the given item or all items matching condition.
 *
 * @param list - a list
 * @param conditionOrItem - an item to remove or a condition matching items
 * to remove
 */
function remove(list, conditionOrItem) {
    var i = list.length;
    while (i--) {
        var oldItem = list[i];
        if (util_1.isFunction(conditionOrItem)) {
            if (!!conditionOrItem.call(null, oldItem)) {
                list.splice(i, 1);
            }
        }
        else if (oldItem === conditionOrItem) {
            list.splice(i, 1);
            return;
        }
    }
}
exports.remove = remove;
/**
 * Removes all items from the list.
 */
function empty(list) {
    list.length = 0;
}
exports.empty = empty;
/**
 * Determines if the list contains the given item or any items matching
 * condition.
 *
 * @param list - a list
 * @param conditionOrItem - an item to a condition to match
 */
function contains(list, conditionOrItem) {
    var e_2, _a;
    try {
        for (var list_2 = __values(list), list_2_1 = list_2.next(); !list_2_1.done; list_2_1 = list_2.next()) {
            var oldItem = list_2_1.value;
            if (util_1.isFunction(conditionOrItem)) {
                if (!!conditionOrItem.call(null, oldItem)) {
                    return true;
                }
            }
            else if (oldItem === conditionOrItem) {
                return true;
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (list_2_1 && !list_2_1.done && (_a = list_2.return)) _a.call(list_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return false;
}
exports.contains = contains;
/**
 * Returns the count of items in the list matching the given condition.
 *
 * @param list - a list
 * @param condition - an optional condition to match
 */
function size(list, condition) {
    var e_3, _a;
    if (condition === undefined) {
        return list.length;
    }
    else {
        var count = 0;
        try {
            for (var list_3 = __values(list), list_3_1 = list_3.next(); !list_3_1.done; list_3_1 = list_3.next()) {
                var item = list_3_1.value;
                if (!!condition.call(null, item)) {
                    count++;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (list_3_1 && !list_3_1.done && (_a = list_3.return)) _a.call(list_3);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return count;
    }
}
exports.size = size;
/**
 * Determines if the list is empty.
 *
 * @param list - a list
 */
function isEmpty(list) {
    return list.length === 0;
}
exports.isEmpty = isEmpty;
/**
 * Returns an iterator for the items of the list.
 *
 * @param list - a list
 * @param condition - an optional condition to match
 */
function forEach(list, condition) {
    var list_4, list_4_1, item, e_4_1;
    var e_4, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(condition === undefined)) return [3 /*break*/, 2];
                return [5 /*yield**/, __values(list)];
            case 1:
                _b.sent();
                return [3 /*break*/, 9];
            case 2:
                _b.trys.push([2, 7, 8, 9]);
                list_4 = __values(list), list_4_1 = list_4.next();
                _b.label = 3;
            case 3:
                if (!!list_4_1.done) return [3 /*break*/, 6];
                item = list_4_1.value;
                if (!!!condition.call(null, item)) return [3 /*break*/, 5];
                return [4 /*yield*/, item];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                list_4_1 = list_4.next();
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 9];
            case 7:
                e_4_1 = _b.sent();
                e_4 = { error: e_4_1 };
                return [3 /*break*/, 9];
            case 8:
                try {
                    if (list_4_1 && !list_4_1.done && (_a = list_4.return)) _a.call(list_4);
                }
                finally { if (e_4) throw e_4.error; }
                return [7 /*endfinally*/];
            case 9: return [2 /*return*/];
        }
    });
}
exports.forEach = forEach;
/**
 * Creates and returns a shallow clone of list.
 *
 * @param list - a list
 */
function clone(list) {
    return new (Array.bind.apply(Array, __spread([void 0], list)))();
}
exports.clone = clone;
/**
 * Returns a new list containing items from the list sorted in ascending
 * order.
 *
 * @param list - a list
 * @param lessThanAlgo - a function that returns `true` if its first argument
 * is less than its second argument, and `false` otherwise.
 */
function sortInAscendingOrder(list, lessThanAlgo) {
    return list.sort(function (itemA, itemB) {
        return lessThanAlgo.call(null, itemA, itemB) ? -1 : 1;
    });
}
exports.sortInAscendingOrder = sortInAscendingOrder;
/**
 * Returns a new list containing items from the list sorted in descending
 * order.
 *
 * @param list - a list
 * @param lessThanAlgo - a function that returns `true` if its first argument
 * is less than its second argument, and `false` otherwise.
 */
function sortInDescendingOrder(list, lessThanAlgo) {
    return list.sort(function (itemA, itemB) {
        return lessThanAlgo.call(null, itemA, itemB) ? 1 : -1;
    });
}
exports.sortInDescendingOrder = sortInDescendingOrder;
//# sourceMappingURL=List.js.map