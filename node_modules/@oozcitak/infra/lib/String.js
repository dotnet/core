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
var CodePoints_1 = require("./CodePoints");
var ByteSequence_1 = require("./ByteSequence");
var Byte_1 = require("./Byte");
var util_1 = require("@oozcitak/util");
/**
 * Determines if the string `a` is a code unit prefix of string `b`.
 *
 * @param a - a string
 * @param b - a string
 */
function isCodeUnitPrefix(a, b) {
    /**
     * 1. Let i be 0.
     * 2. While true:
     * 2.1. Let aCodeUnit be the ith code unit of a if i is less than a’s length;
     * otherwise null.
     * 2.2. Let bCodeUnit be the ith code unit of b if i is less than b’s length;
     * otherwise null.
     * 2.3. If bCodeUnit is null, then return true.
     * 2.4. Return false if aCodeUnit is different from bCodeUnit.
     * 2.5. Set i to i + 1.
     */
    var i = 0;
    while (true) {
        var aCodeUnit = i < a.length ? a.charCodeAt(i) : null;
        var bCodeUnit = i < b.length ? b.charCodeAt(i) : null;
        if (aCodeUnit === null)
            return true;
        if (aCodeUnit !== bCodeUnit)
            return false;
        i++;
    }
}
exports.isCodeUnitPrefix = isCodeUnitPrefix;
/**
 * Determines if the string `a` is a code unit less than string `b`.
 *
 * @param a - a string
 * @param b - a string
 */
function isCodeUnitLessThan(a, b) {
    /**
     * 1. If b is a code unit prefix of a, then return false.
     * 2. If a is a code unit prefix of b, then return true.
     * 3. Let n be the smallest index such that the nth code unit of a is
     * different from the nth code unit of b. (There has to be such an index,
     * since neither string is a prefix of the other.)
     * 4. If the nth code unit of a is less than the nth code unit of b, then
     * return true.
     * 5. Return false.
     */
    if (isCodeUnitPrefix(b, a))
        return false;
    if (isCodeUnitPrefix(a, b))
        return true;
    for (var i = 0; i < Math.min(a.length, b.length); i++) {
        var aCodeUnit = a.charCodeAt(i);
        var bCodeUnit = b.charCodeAt(i);
        if (aCodeUnit === bCodeUnit)
            continue;
        return (aCodeUnit < bCodeUnit);
    }
    /* istanbul ignore next */
    return false;
}
exports.isCodeUnitLessThan = isCodeUnitLessThan;
/**
 * Isomorphic encodes the given string.
 *
 * @param str - a string
 */
function isomorphicEncode(str) {
    var e_1, _a;
    /**
     * 1. Assert: input contains no code points greater than U+00FF.
     * 2. Return a byte sequence whose length is equal to input’s length and whose
     * bytes have the same values as input’s code points, in the same order.
     */
    var codePoints = Array.from(str);
    var bytes = new Uint8Array(codePoints.length);
    var i = 0;
    try {
        for (var str_1 = __values(str), str_1_1 = str_1.next(); !str_1_1.done; str_1_1 = str_1.next()) {
            var codePoint = str_1_1.value;
            var byte = codePoint.codePointAt(0);
            console.assert(byte !== undefined && byte <= 0x00FF, "isomorphicEncode requires string bytes to be less than or equal to 0x00FF.");
            if (byte !== undefined && byte <= 0x00FF) {
                bytes[i++] = byte;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (str_1_1 && !str_1_1.done && (_a = str_1.return)) _a.call(str_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return bytes;
}
exports.isomorphicEncode = isomorphicEncode;
/**
 * Determines if the given string is An ASCII string.
 *
 * @param str - a string
 */
function isASCIIString(str) {
    /**
     * An ASCII string is a string whose code points are all ASCII code points.
     */
    return /^[\u0000-\u007F]*$/.test(str);
}
exports.isASCIIString = isASCIIString;
/**
 * Converts all uppercase ASCII code points to lowercase.
 *
 * @param str - a string
 */
function asciiLowercase(str) {
    var e_2, _a;
    /**
     * To ASCII lowercase a string, replace all ASCII upper alphas in the string
     * with their corresponding code point in ASCII lower alpha.
     */
    var result = "";
    try {
        for (var str_2 = __values(str), str_2_1 = str_2.next(); !str_2_1.done; str_2_1 = str_2.next()) {
            var c = str_2_1.value;
            var code = c.codePointAt(0);
            if (code !== undefined && code >= 0x41 && code <= 0x5A) {
                result += String.fromCodePoint(code + 0x20);
            }
            else {
                result += c;
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (str_2_1 && !str_2_1.done && (_a = str_2.return)) _a.call(str_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return result;
}
exports.asciiLowercase = asciiLowercase;
/**
 * Converts all uppercase ASCII code points to uppercase.
 *
 * @param str - a string
 */
function asciiUppercase(str) {
    var e_3, _a;
    /**
     * To ASCII uppercase a string, replace all ASCII lower alphas in the string
     * with their corresponding code point in ASCII upper alpha.
     */
    var result = "";
    try {
        for (var str_3 = __values(str), str_3_1 = str_3.next(); !str_3_1.done; str_3_1 = str_3.next()) {
            var c = str_3_1.value;
            var code = c.codePointAt(0);
            if (code !== undefined && code >= 0x61 && code <= 0x7A) {
                result += String.fromCodePoint(code - 0x20);
            }
            else {
                result += c;
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (str_3_1 && !str_3_1.done && (_a = str_3.return)) _a.call(str_3);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return result;
}
exports.asciiUppercase = asciiUppercase;
/**
 * Compares two ASCII strings case-insensitively.
 *
 * @param a - a string
 * @param b - a string
 */
function asciiCaseInsensitiveMatch(a, b) {
    /**
     * A string A is an ASCII case-insensitive match for a string B, if the ASCII
     * lowercase of A is the ASCII lowercase of B.
     */
    return asciiLowercase(a) === asciiLowercase(b);
}
exports.asciiCaseInsensitiveMatch = asciiCaseInsensitiveMatch;
/**
 * ASCII encodes a string.
 *
 * @param str - a string
 */
function asciiEncode(str) {
    /**
     * 1. Assert: input is an ASCII string.
     * 2. Return the isomorphic encoding of input.
     */
    console.assert(isASCIIString(str), "asciiEncode requires an ASCII string.");
    return isomorphicEncode(str);
}
exports.asciiEncode = asciiEncode;
/**
 * ASCII decodes a byte sequence.
 *
 * @param bytes - a byte sequence
 */
function asciiDecode(bytes) {
    var e_4, _a;
    try {
        /**
         * 1. Assert: All bytes in input are ASCII bytes.
         * 2. Return the isomorphic decoding of input.
         */
        for (var bytes_1 = __values(bytes), bytes_1_1 = bytes_1.next(); !bytes_1_1.done; bytes_1_1 = bytes_1.next()) {
            var byte = bytes_1_1.value;
            console.assert(Byte_1.isASCIIByte(byte), "asciiDecode requires an ASCII byte sequence.");
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (bytes_1_1 && !bytes_1_1.done && (_a = bytes_1.return)) _a.call(bytes_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return ByteSequence_1.isomorphicDecode(bytes);
}
exports.asciiDecode = asciiDecode;
/**
 * Strips newline characters from a string.
 *
 * @param str - a string
 */
function stripNewlines(str) {
    /**
     * To strip newlines from a string, remove any U+000A LF and U+000D CR code
     * points from the string.
     */
    return str.replace(/[\n\r]/g, "");
}
exports.stripNewlines = stripNewlines;
/**
 * Normalizes newline characters in a string by converting consecutive
 * carriage-return newline characters and also single carriage return characters
 * into a single newline.
 *
 * @param str - a string
 */
function normalizeNewlines(str) {
    /**
     * To normalize newlines in a string, replace every U+000D CR U+000A LF code
     * point pair with a single U+000A LF code point, and then replace every
     * remaining U+000D CR code point with a U+000A LF code point.
     */
    return str.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
exports.normalizeNewlines = normalizeNewlines;
/**
 * Removes leading and trailing whitespace characters from a string.
 *
 * @param str - a string
 */
function stripLeadingAndTrailingASCIIWhitespace(str) {
    /**
     * To strip leading and trailing ASCII whitespace from a string, remove all
     * ASCII whitespace that are at the start or the end of the string.
     */
    return str.replace(/^[\t\n\f\r ]+/, "").replace(/[\t\n\f\r ]+$/, "");
}
exports.stripLeadingAndTrailingASCIIWhitespace = stripLeadingAndTrailingASCIIWhitespace;
/**
 * Removes consecutive newline characters from a string.
 *
 * @param str - a string
 */
function stripAndCollapseASCIIWhitespace(str) {
    /**
     * To strip and collapse ASCII whitespace in a string, replace any sequence of
     * one or more consecutive code points that are ASCII whitespace in the string
     * with a single U+0020 SPACE code point, and then remove any leading and
     * trailing ASCII whitespace from that string.
     */
    return stripLeadingAndTrailingASCIIWhitespace(str.replace(/[\t\n\f\r ]{2,}/g, " "));
}
exports.stripAndCollapseASCIIWhitespace = stripAndCollapseASCIIWhitespace;
/**
 * Collects a sequence of code points matching a given condition from the input
 * string.
 *
 * @param condition - a condition to match
 * @param input - a string
 * @param options - starting position
 */
function collectASequenceOfCodePoints(condition, input, options) {
    /**
     * 1. Let result be the empty string.
     * 2. While position doesn’t point past the end of input and the code point at
     * position within input meets the condition condition:
     * 2.1. Append that code point to the end of result.
     * 2.2. Advance position by 1.
     * 3. Return result.
     */
    if (!util_1.isArray(input))
        return collectASequenceOfCodePoints(condition, Array.from(input), options);
    var result = "";
    while (options.position < input.length && !!condition.call(null, input[options.position])) {
        result += input[options.position];
        options.position++;
    }
    return result;
}
exports.collectASequenceOfCodePoints = collectASequenceOfCodePoints;
/**
 * Skips over ASCII whitespace.
 *
 * @param input - input string
 * @param options - starting position
 */
function skipASCIIWhitespace(input, options) {
    /**
     * To skip ASCII whitespace within a string input given a position variable
     * position, collect a sequence of code points that are ASCII whitespace from
     * input given position. The collected code points are not used, but position
     * is still updated.
     */
    collectASequenceOfCodePoints(function (str) { return CodePoints_1.ASCIIWhiteSpace.test(str); }, input, options);
}
exports.skipASCIIWhitespace = skipASCIIWhitespace;
/**
 * Solits a string at the given delimiter.
 *
 * @param input - input string
 * @param delimiter - a delimiter string
 */
function strictlySplit(input, delimiter) {
    /**
     * 1. Let position be a position variable for input, initially pointing at the
     * start of input.
     * 2. Let tokens be a list of strings, initially empty.
     * 3. Let token be the result of collecting a sequence of code points that are
     * not equal to delimiter from input, given position.
     * 4. Append token to tokens.
     * 5. While position is not past the end of input:
     * 5.1. Assert: the code point at position within input is delimiter.
     * 5.2. Advance position by 1.
     * 5.3. Let token be the result of collecting a sequence of code points that
     * are not equal to delimiter from input, given position.
     * 5.4. Append token to tokens.
     * 6. Return tokens.
     */
    if (!util_1.isArray(input))
        return strictlySplit(Array.from(input), delimiter);
    var options = { position: 0 };
    var tokens = [];
    var token = collectASequenceOfCodePoints(function (str) { return delimiter !== str; }, input, options);
    tokens.push(token);
    while (options.position < input.length) {
        console.assert(input[options.position] === delimiter, "strictlySplit found no delimiter in input string.");
        options.position++;
        token = collectASequenceOfCodePoints(function (str) { return delimiter !== str; }, input, options);
        tokens.push(token);
    }
    return tokens;
}
exports.strictlySplit = strictlySplit;
/**
 * Splits a string on ASCII whitespace.
 *
 * @param input - a string
 */
function splitAStringOnASCIIWhitespace(input) {
    /**
     * 1. Let position be a position variable for input, initially pointing at the
     * start of input.
     * 2. Let tokens be a list of strings, initially empty.
     * 3. Skip ASCII whitespace within input given position.
     * 4. While position is not past the end of input:
     * 4.1. Let token be the result of collecting a sequence of code points that
     * are not ASCII whitespace from input, given position.
     * 4.2. Append token to tokens.
     * 4.3. Skip ASCII whitespace within input given position.
     * 5. Return tokens.
     */
    if (!util_1.isArray(input))
        return splitAStringOnASCIIWhitespace(Array.from(input));
    var options = { position: 0 };
    var tokens = [];
    skipASCIIWhitespace(input, options);
    while (options.position < input.length) {
        var token = collectASequenceOfCodePoints(function (str) { return !CodePoints_1.ASCIIWhiteSpace.test(str); }, input, options);
        tokens.push(token);
        skipASCIIWhitespace(input, options);
    }
    return tokens;
}
exports.splitAStringOnASCIIWhitespace = splitAStringOnASCIIWhitespace;
/**
 * Splits a string on commas.
 *
 * @param input - a string
 */
function splitAStringOnCommas(input) {
    /**
     * 1. Let position be a position variable for input, initially pointing at the
     * start of input.
     * 2. Let tokens be a list of strings, initially empty.
     * 3. While position is not past the end of input:
     * 3.1. Let token be the result of collecting a sequence of code points that
     * are not U+002C (,) from input, given position.
     * 3.2. Strip leading and trailing ASCII whitespace from token.
     * 3.3. Append token to tokens.
     * 3.4. If position is not past the end of input, then:
     * 3.4.1. Assert: the code point at position within input is U+002C (,).
     * 3.4.2. Advance position by 1.
     * 4. Return tokens.
     */
    if (!util_1.isArray(input))
        return splitAStringOnCommas(Array.from(input));
    var options = { position: 0 };
    var tokens = [];
    while (options.position < input.length) {
        var token = collectASequenceOfCodePoints(function (str) { return str !== ','; }, input, options);
        tokens.push(stripLeadingAndTrailingASCIIWhitespace(token));
        if (options.position < input.length) {
            console.assert(input[options.position] === ',', "splitAStringOnCommas found no delimiter in input string.");
            options.position++;
        }
    }
    return tokens;
}
exports.splitAStringOnCommas = splitAStringOnCommas;
/**
 * Concatenates a list of strings with the given separator.
 *
 * @param list - a list of strings
 * @param separator - a separator string
 */
function concatenate(list, separator) {
    if (separator === void 0) { separator = ""; }
    /**
     * 1. If list is empty, then return the empty string.
     * 2. If separator is not given, then set separator to the empty string.
     * 3. Return a string whose contents are list’s items, in order, separated
     * from each other by separator.
     */
    if (list.length === 0)
        return "";
    return list.join(separator);
}
exports.concatenate = concatenate;
//# sourceMappingURL=String.js.map