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
var FixedSizeSet_1 = require("./FixedSizeSet");
exports.FixedSizeSet = FixedSizeSet_1.FixedSizeSet;
var ObjectCache_1 = require("./ObjectCache");
exports.ObjectCache = ObjectCache_1.ObjectCache;
var CompareCache_1 = require("./CompareCache");
exports.CompareCache = CompareCache_1.CompareCache;
var Lazy_1 = require("./Lazy");
exports.Lazy = Lazy_1.Lazy;
var StringWalker_1 = require("./StringWalker");
exports.StringWalker = StringWalker_1.StringWalker;
/**
 * Applies the mixin to a given class.
 *
 * @param baseClass - class to receive the mixin
 * @param mixinClass - mixin class
 * @param overrides - an array with names of function overrides. Base class
 * functions whose names are in this array will be kept by prepending an
 * underscore to their names.
 */
function applyMixin(baseClass, mixinClass) {
    var overrides = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        overrides[_i - 2] = arguments[_i];
    }
    Object.getOwnPropertyNames(mixinClass.prototype).forEach(function (name) {
        if (name !== "constructor") {
            if (overrides.indexOf(name) !== -1) {
                var orgPropDesc = Object.getOwnPropertyDescriptor(baseClass.prototype, name);
                /* istanbul ignore else */
                if (orgPropDesc) {
                    Object.defineProperty(baseClass.prototype, "_" + name, orgPropDesc);
                }
            }
            var propDesc = Object.getOwnPropertyDescriptor(mixinClass.prototype, name);
            /* istanbul ignore else */
            if (propDesc) {
                Object.defineProperty(baseClass.prototype, name, propDesc);
            }
        }
    });
}
exports.applyMixin = applyMixin;
/**
 * Applies default values to the given object.
 *
 * @param obj - an object
 * @param defaults - an object with default values
 * @param overwrite - if set to `true` defaults object always overwrites object
 * values, whether they are `undefined` or not.
 */
function applyDefaults(obj, defaults, overwrite) {
    if (overwrite === void 0) { overwrite = false; }
    var result = clone(obj || {});
    forEachObject(defaults, function (key, val) {
        if (isPlainObject(val)) {
            result[key] = applyDefaults(result[key], val, overwrite);
        }
        else if (overwrite || result[key] === undefined) {
            result[key] = val;
        }
    });
    return result;
}
exports.applyDefaults = applyDefaults;
/**
 * Iterates over items of an array or set.
 *
 * @param arr - array or set to iterate
 * @param callback - a callback function which receives each array item as its
 * single argument
 * @param thisArg - the value of this inside callback
 */
function forEachArray(arr, callback, thisArg) {
    arr.forEach(callback, thisArg);
}
exports.forEachArray = forEachArray;
/**
 * Iterates over key/value pairs of a map or object.
 *
 * @param obj - map or object to iterate
 * @param callback - a callback function which receives object key as its first
 * argument and object value as its second argument
 * @param thisArg - the value of this inside callback
 */
function forEachObject(obj, callback, thisArg) {
    if (isMap(obj)) {
        obj.forEach(function (value, key) { return callback.call(thisArg, key, value); });
    }
    else {
        for (var key in obj) {
            /* istanbul ignore else */
            if (obj.hasOwnProperty(key)) {
                callback.call(thisArg, key, obj[key]);
            }
        }
    }
}
exports.forEachObject = forEachObject;
/**
 * Returns the number of entries in an array or set.
 *
 * @param arr - array or set
 */
function arrayLength(obj) {
    if (isSet(obj)) {
        return obj.size;
    }
    else {
        return obj.length;
    }
}
exports.arrayLength = arrayLength;
/**
 * Returns the number of entries in a map or object.
 *
 * @param obj - map or object
 */
function objectLength(obj) {
    if (isMap(obj)) {
        return obj.size;
    }
    else {
        return Object.keys(obj).length;
    }
}
exports.objectLength = objectLength;
/**
 * Gets the value of a key from a map or object.
 *
 * @param obj - map or object
 * @param key - the key to retrieve
 */
function getObjectValue(obj, key) {
    if (isMap(obj)) {
        return obj.get(key);
    }
    else {
        return obj[key];
    }
}
exports.getObjectValue = getObjectValue;
/**
 * Removes a property from a map or object.
 *
 * @param obj - map or object
 * @param key - the key to remove
 */
function removeObjectValue(obj, key) {
    if (isMap(obj)) {
        obj.delete(key);
    }
    else {
        delete obj[key];
    }
}
exports.removeObjectValue = removeObjectValue;
/**
 * Deep clones the given object.
 *
 * @param obj - an object
 */
function clone(obj) {
    var e_1, _a;
    if (isFunction(obj)) {
        return obj;
    }
    else if (isArray(obj)) {
        var result = [];
        try {
            for (var obj_1 = __values(obj), obj_1_1 = obj_1.next(); !obj_1_1.done; obj_1_1 = obj_1.next()) {
                var item = obj_1_1.value;
                result.push(clone(item));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (obj_1_1 && !obj_1_1.done && (_a = obj_1.return)) _a.call(obj_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    }
    else if (isObject(obj)) {
        var result = {};
        for (var key in obj) {
            /* istanbul ignore next */
            if (obj.hasOwnProperty(key)) {
                var val = obj[key];
                result[key] = clone(val);
            }
        }
        return result;
    }
    else {
        return obj;
    }
}
exports.clone = clone;
/**
 * Type guard for boolean types
 *
 * @param x - a variable to type check
 */
function isBoolean(x) {
    return typeof x === "boolean";
}
exports.isBoolean = isBoolean;
/**
 * Type guard for numeric types
 *
 * @param x - a variable to type check
 */
function isNumber(x) {
    return typeof x === "number";
}
exports.isNumber = isNumber;
/**
 * Type guard for strings
 *
 * @param x - a variable to type check
 */
function isString(x) {
    return typeof x === "string";
}
exports.isString = isString;
/**
 * Type guard for function objects
 *
 * @param x - a variable to type check
 */
function isFunction(x) {
    return !!x && Object.prototype.toString.call(x) === '[object Function]';
}
exports.isFunction = isFunction;
/**
 * Type guard for JS objects
 *
 * _Note:_ Functions are objects too
 *
 * @param x - a variable to type check
 */
function isObject(x) {
    var type = typeof x;
    return !!x && (type === 'function' || type === 'object');
}
exports.isObject = isObject;
/**
 * Type guard for arrays
 *
 * @param x - a variable to type check
 */
function isArray(x) {
    return Array.isArray(x);
}
exports.isArray = isArray;
/**
 * Type guard for sets.
 *
 * @param x - a variable to check
 */
function isSet(x) {
    return x instanceof Set;
}
exports.isSet = isSet;
/**
 * Type guard for maps.
 *
 * @param x - a variable to check
 */
function isMap(x) {
    return x instanceof Map;
}
exports.isMap = isMap;
/**
 * Determines if `x` is an empty Array or an Object with no own properties.
 *
 * @param x - a variable to check
 */
function isEmpty(x) {
    if (isArray(x)) {
        return !x.length;
    }
    else if (isSet(x)) {
        return !x.size;
    }
    else if (isMap(x)) {
        return !x.size;
    }
    else if (isObject(x)) {
        for (var key in x) {
            if (x.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
    return false;
}
exports.isEmpty = isEmpty;
/**
 * Determines if `x` is a plain Object.
 *
 * @param x - a variable to check
 */
function isPlainObject(x) {
    if (isObject(x)) {
        var proto = Object.getPrototypeOf(x);
        var ctor = proto.constructor;
        return proto && ctor &&
            (typeof ctor === 'function') && (ctor instanceof ctor) &&
            (Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object));
    }
    return false;
}
exports.isPlainObject = isPlainObject;
/**
 * Determines if `x` is an iterable Object.
 *
 * @param x - a variable to check
 */
function isIterable(x) {
    return x && (typeof x[Symbol.iterator] === 'function');
}
exports.isIterable = isIterable;
/**
 * Gets the primitive value of an object.
 */
function getValue(obj) {
    if (isFunction(obj.valueOf)) {
        return obj.valueOf();
    }
    else {
        return obj;
    }
}
exports.getValue = getValue;
/**
 * UTF-8 encodes the given string.
 *
 * @param input - a string
 */
function utf8Encode(input) {
    var bytes = new Uint8Array(input.length * 4);
    var byteIndex = 0;
    for (var i = 0; i < input.length; i++) {
        var char = input.charCodeAt(i);
        if (char < 128) {
            bytes[byteIndex++] = char;
            continue;
        }
        else if (char < 2048) {
            bytes[byteIndex++] = char >> 6 | 192;
        }
        else {
            if (char > 0xd7ff && char < 0xdc00) {
                if (++i >= input.length) {
                    throw new Error("Incomplete surrogate pair.");
                }
                var c2 = input.charCodeAt(i);
                if (c2 < 0xdc00 || c2 > 0xdfff) {
                    throw new Error("Invalid surrogate character.");
                }
                char = 0x10000 + ((char & 0x03ff) << 10) + (c2 & 0x03ff);
                bytes[byteIndex++] = char >> 18 | 240;
                bytes[byteIndex++] = char >> 12 & 63 | 128;
            }
            else {
                bytes[byteIndex++] = char >> 12 | 224;
            }
            bytes[byteIndex++] = char >> 6 & 63 | 128;
        }
        bytes[byteIndex++] = char & 63 | 128;
    }
    return bytes.subarray(0, byteIndex);
}
exports.utf8Encode = utf8Encode;
/**
 * UTF-8 decodes the given byte sequence into a string.
 *
 * @param bytes - a byte sequence
 */
function utf8Decode(bytes) {
    var result = "";
    var i = 0;
    while (i < bytes.length) {
        var c = bytes[i++];
        if (c > 127) {
            if (c > 191 && c < 224) {
                if (i >= bytes.length) {
                    throw new Error("Incomplete 2-byte sequence.");
                }
                c = (c & 31) << 6 | bytes[i++] & 63;
            }
            else if (c > 223 && c < 240) {
                if (i + 1 >= bytes.length) {
                    throw new Error("Incomplete 3-byte sequence.");
                }
                c = (c & 15) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
            }
            else if (c > 239 && c < 248) {
                if (i + 2 >= bytes.length) {
                    throw new Error("Incomplete 4-byte sequence.");
                }
                c = (c & 7) << 18 | (bytes[i++] & 63) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
            }
            else {
                throw new Error("Unknown multi-byte start.");
            }
        }
        if (c <= 0xffff) {
            result += String.fromCharCode(c);
        }
        else if (c <= 0x10ffff) {
            c -= 0x10000;
            result += String.fromCharCode(c >> 10 | 0xd800);
            result += String.fromCharCode(c & 0x3FF | 0xdc00);
        }
        else {
            throw new Error("Code point exceeds UTF-16 limit.");
        }
    }
    return result;
}
exports.utf8Decode = utf8Decode;
//# sourceMappingURL=index.js.map