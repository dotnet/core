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
var util_1 = require("@oozcitak/util");
var URLAlgorithm_1 = require("./URLAlgorithm");
/**
 * Represents URL query parameters.
 */
var URLSearchParamsImpl = /** @class */ (function () {
    /**
     * Initializes a new `URLSearchParams`.
     *
     * @param init - initial values of query parameters
     */
    function URLSearchParamsImpl(init) {
        var e_1, _a;
        if (init === void 0) { init = ""; }
        this._list = [];
        this._urlObject = null;
        /**
         * 1. Let query be a new URLSearchParams object.
         * 2. If init is a sequence, then for each pair in init:
         * 3. If pair does not contain exactly two items, then throw a TypeError.
         * 4. Append a new name-value pair whose name is pair’s first item, and
         * value is pair’s second item, to query’s list.
         * 5. Otherwise, if init is a record, then for each name → value in init,
         * append a new name-value pair whose name is name and value is value, to
         * query’s list.
         * 6. Otherwise, init is a string, then set query’s list to the result of
         * parsing init.
         * 7. Return query.
         */
        if (util_1.isArray(init)) {
            try {
                for (var init_1 = __values(init), init_1_1 = init_1.next(); !init_1_1.done; init_1_1 = init_1.next()) {
                    var item = init_1_1.value;
                    if (item.length !== 2) {
                        throw new TypeError("Each item of init must be a two-tuple.");
                    }
                    this._list.push([item[0], item[1]]);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (init_1_1 && !init_1_1.done && (_a = init_1.return)) _a.call(init_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else if (util_1.isObject(init)) {
            for (var name in init) {
                /* istanbul ignore else */
                if (init.hasOwnProperty(name)) {
                    this._list.push([name, init[name]]);
                }
            }
        }
        else {
            this._list = URLAlgorithm_1.urlEncodedStringParser(init);
        }
    }
    /**
     * Runs the update steps.
     */
    URLSearchParamsImpl.prototype._updateSteps = function () {
        /**
         * 1. Let query be the serialization of URLSearchParams object’s list.
         * 2. If query is the empty string, then set query to null.
         * 3. Set url object’s url’s query to query.
         */
        var query = URLAlgorithm_1.urlEncodedSerializer(this._list);
        if (query === "")
            query = null;
        if (this._urlObject !== null)
            this._urlObject._url.query = query;
    };
    /** @inheritdoc */
    URLSearchParamsImpl.prototype.append = function (name, value) {
        /**
         * 1. Append a new name-value pair whose name is name and value is value,
         * to list.
         * 2. Run the update steps.
         */
        this._list.push([name, value]);
        this._updateSteps();
    };
    /** @inheritdoc */
    URLSearchParamsImpl.prototype.delete = function (name) {
        /**
         * 1. Remove all name-value pairs whose name is name from list.
         * 2. Run the update steps.
         */
        for (var i = this._list.length - 1; i >= 0; i--) {
            if (this._list[i][0] === name)
                this._list.splice(i, 1);
        }
        this._updateSteps();
    };
    /** @inheritdoc */
    URLSearchParamsImpl.prototype.get = function (name) {
        var e_2, _a;
        try {
            /**
             * The get(name) method, when invoked, must return the value of the
             * first name-value pair whose name is name in list, if there is such
             * a pair, and null otherwise.
             */
            for (var _b = __values(this._list), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item[0] === name)
                    return item[1];
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return null;
    };
    /** @inheritdoc */
    URLSearchParamsImpl.prototype.getAll = function (name) {
        var e_3, _a;
        /**
         * The getAll(name) method, when invoked, must return the values of all
         * name-value pairs whose name is name, in list, in list order, and the
         * empty sequence otherwise.
         */
        var values = [];
        try {
            for (var _b = __values(this._list), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item[0] === name)
                    values.push(item[1]);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return values;
    };
    /** @inheritdoc */
    URLSearchParamsImpl.prototype.has = function (name) {
        var e_4, _a;
        try {
            /**
             * The has(name) method, when invoked, must return true if there is
             * a name-value pair whose name is name in list, and false otherwise.
             */
            for (var _b = __values(this._list), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item[0] === name)
                    return true;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return false;
    };
    /** @inheritdoc */
    URLSearchParamsImpl.prototype.set = function (name, value) {
        var e_5, _a;
        /**
         * 1. If there are any name-value pairs whose name is name, in list,
         * set the value of the first such name-value pair to value and remove
         * the others.
         * 2. Otherwise, append a new name-value pair whose name is name and value
         * is value, to list.
         * 3. Run the update steps.
         */
        var toRemove = [];
        var found = false;
        for (var i = 0; i < this._list.length; i++) {
            if (this._list[i][0] === name) {
                if (!found) {
                    found = true;
                    this._list[i][1] = value;
                }
                else {
                    toRemove.push(i);
                }
            }
        }
        if (!found) {
            this._list.push([name, value]);
        }
        try {
            for (var toRemove_1 = __values(toRemove), toRemove_1_1 = toRemove_1.next(); !toRemove_1_1.done; toRemove_1_1 = toRemove_1.next()) {
                var i = toRemove_1_1.value;
                this._list.splice(i, 1);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (toRemove_1_1 && !toRemove_1_1.done && (_a = toRemove_1.return)) _a.call(toRemove_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
    };
    /** @inheritdoc */
    URLSearchParamsImpl.prototype.sort = function () {
        /**
         * 1. Sort all name-value pairs, if any, by their names. Sorting must be
         * done by comparison of code units. The relative order between name-value
         * pairs with equal names must be preserved.
         * 2. Run the update steps.
         */
        this._list.sort(function (a, b) { return (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0); });
        this._updateSteps();
    };
    /** @inheritdoc */
    URLSearchParamsImpl.prototype[Symbol.iterator] = function () {
        var _a, _b, item, e_6_1;
        var e_6, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, 6, 7]);
                    _a = __values(this._list), _b = _a.next();
                    _d.label = 1;
                case 1:
                    if (!!_b.done) return [3 /*break*/, 4];
                    item = _b.value;
                    return [4 /*yield*/, item];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _b = _a.next();
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    e_6_1 = _d.sent();
                    e_6 = { error: e_6_1 };
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_6) throw e_6.error; }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    };
    /** @inheritdoc */
    URLSearchParamsImpl.prototype.toString = function () {
        return URLAlgorithm_1.urlEncodedSerializer(this._list);
    };
    return URLSearchParamsImpl;
}());
exports.URLSearchParamsImpl = URLSearchParamsImpl;
//# sourceMappingURL=URLSearchParamsImpl.js.map