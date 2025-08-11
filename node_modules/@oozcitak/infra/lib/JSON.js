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
var util_1 = require("@oozcitak/util");
/**
 * Parses the given byte sequence representing a JSON string into an object.
 *
 * @param bytes - a byte sequence
 */
function parseJSONFromBytes(bytes) {
    /**
     * 1. Let jsonText be the result of running UTF-8 decode on bytes. [ENCODING]
     * 2. Return ? Call(%JSONParse%, undefined, « jsonText »).
     */
    var jsonText = util_1.utf8Decode(bytes);
    return JSON.parse.call(undefined, jsonText);
}
exports.parseJSONFromBytes = parseJSONFromBytes;
/**
 * Serialize the given JavaScript value into a byte sequence.
 *
 * @param value - a JavaScript value
 */
function serializeJSONToBytes(value) {
    /**
     * 1. Let jsonString be ? Call(%JSONStringify%, undefined, « value »).
     * 2. Return the result of running UTF-8 encode on jsonString. [ENCODING]
     */
    var jsonString = JSON.stringify.call(undefined, value);
    return util_1.utf8Encode(jsonString);
}
exports.serializeJSONToBytes = serializeJSONToBytes;
/**
 * Parses the given JSON string into a Realm-independent JavaScript value.
 *
 * @param jsonText - a JSON string
 */
function parseJSONIntoInfraValues(jsonText) {
    /**
     * 1. Let jsValue be ? Call(%JSONParse%, undefined, « jsonText »).
     * 2. Return the result of converting a JSON-derived JavaScript value to an
     * Infra value, given jsValue.
     */
    var jsValue = JSON.parse.call(undefined, jsonText);
    return convertAJSONDerivedJavaScriptValueToAnInfraValue(jsValue);
}
exports.parseJSONIntoInfraValues = parseJSONIntoInfraValues;
/**
 * Parses the value into a Realm-independent JavaScript value.
 *
 * @param jsValue - a JavaScript value
 */
function convertAJSONDerivedJavaScriptValueToAnInfraValue(jsValue) {
    var e_1, _a;
    /**
     * 1. If Type(jsValue) is Null, String, or Number, then return jsValue.
     */
    if (jsValue === null || util_1.isString(jsValue) || util_1.isNumber(jsValue))
        return jsValue;
    /**
     * 2. If IsArray(jsValue) is true, then:
     * 2.1. Let result be an empty list.
     * 2.2. Let length be ! ToLength(! Get(jsValue, "length")).
     * 2.3. For each index of the range 0 to length − 1, inclusive:
     * 2.3.1. Let indexName be ! ToString(index).
     * 2.3.2. Let jsValueAtIndex be ! Get(jsValue, indexName).
     * 2.3.3. Let infraValueAtIndex be the result of converting a JSON-derived
     * JavaScript value to an Infra value, given jsValueAtIndex.
     * 2.3.4. Append infraValueAtIndex to result.
     * 2.8. Return result.
     */
    if (util_1.isArray(jsValue)) {
        var result = new Array();
        try {
            for (var jsValue_1 = __values(jsValue), jsValue_1_1 = jsValue_1.next(); !jsValue_1_1.done; jsValue_1_1 = jsValue_1.next()) {
                var jsValueAtIndex = jsValue_1_1.value;
                result.push(convertAJSONDerivedJavaScriptValueToAnInfraValue(jsValueAtIndex));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (jsValue_1_1 && !jsValue_1_1.done && (_a = jsValue_1.return)) _a.call(jsValue_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    }
    else if (util_1.isObject(jsValue)) {
        /**
         * 3. Let result be an empty ordered map.
         * 4. For each key of ! jsValue.[[OwnPropertyKeys]]():
         * 4.1. Let jsValueAtKey be ! Get(jsValue, key).
         * 4.2. Let infraValueAtKey be the result of converting a JSON-derived
         * JavaScript value to an Infra value, given jsValueAtKey.
         * 4.3. Set result[key] to infraValueAtKey.
         * 5. Return result.
         */
        var result = new Map();
        for (var key in jsValue) {
            /* istanbul ignore else */
            if (jsValue.hasOwnProperty(key)) {
                var jsValueAtKey = jsValue[key];
                result.set(key, convertAJSONDerivedJavaScriptValueToAnInfraValue(jsValueAtKey));
            }
        }
        return result;
    }
    /* istanbul ignore next */
    return jsValue;
}
exports.convertAJSONDerivedJavaScriptValueToAnInfraValue = convertAJSONDerivedJavaScriptValueToAnInfraValue;
//# sourceMappingURL=JSON.js.map