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
var infra_1 = require("@oozcitak/infra");
/**
 * Converts a whitespace separated string into an array of tokens.
 *
 * @param value - a string of whitespace separated tokens
 */
function orderedSet_parse(value) {
    /**
     * 1. Let inputTokens be the result of splitting input on ASCII whitespace.
     * 2. Let tokens be a new ordered set.
     * 3. For each token in inputTokens, append token to tokens.
     * 4. Return tokens.
     */
    var inputTokens = infra_1.string.splitAStringOnASCIIWhitespace(value);
    return new Set(inputTokens);
}
exports.orderedSet_parse = orderedSet_parse;
/**
 * Converts an array of tokens into a space separated string.
 *
 * @param tokens - an array of token strings
 */
function orderedSet_serialize(tokens) {
    /**
     * The ordered set serializer takes a set and returns the concatenation of
     * set using U+0020 SPACE.
     */
    return __spread(tokens).join(' ');
}
exports.orderedSet_serialize = orderedSet_serialize;
/**
 * Removes duplicate tokens and convert all whitespace characters
 * to space.
 *
 * @param value - a string of whitespace separated tokens
 */
function orderedSet_sanitize(value) {
    return orderedSet_serialize(orderedSet_parse(value));
}
exports.orderedSet_sanitize = orderedSet_sanitize;
/**
 * Determines whether a set contains the other.
 *
 * @param set1 - a set
 * @param set1 - a set that is contained in set1
 * @param caseSensitive - whether matches are case-sensitive
 */
function orderedSet_contains(set1, set2, caseSensitive) {
    var e_1, _a, e_2, _b;
    try {
        for (var set2_1 = __values(set2), set2_1_1 = set2_1.next(); !set2_1_1.done; set2_1_1 = set2_1.next()) {
            var val2 = set2_1_1.value;
            var found = false;
            try {
                for (var set1_1 = (e_2 = void 0, __values(set1)), set1_1_1 = set1_1.next(); !set1_1_1.done; set1_1_1 = set1_1.next()) {
                    var val1 = set1_1_1.value;
                    if (caseSensitive) {
                        if (val1 === val2) {
                            found = true;
                            break;
                        }
                    }
                    else {
                        if (val1.toUpperCase() === val2.toUpperCase()) {
                            found = true;
                            break;
                        }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (set1_1_1 && !set1_1_1.done && (_b = set1_1.return)) _b.call(set1_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            if (!found)
                return false;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (set2_1_1 && !set2_1_1.done && (_a = set2_1.return)) _a.call(set2_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return true;
}
exports.orderedSet_contains = orderedSet_contains;
//# sourceMappingURL=OrderedSetAlgorithm.js.map