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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns the count of bytes in a sequence.
 *
 * @param list - a byte sequence
 */
function length(list) {
    /**
     * A byte sequence’s length is the number of bytes it contains.
     */
    return list.length;
}
exports.length = length;
/**
 * Converts each byte to lowercase.
 *
 * @param list - a byte sequence
 */
function byteLowercase(list) {
    /**
     * To byte-lowercase a byte sequence, increase each byte it contains, in the
     * range 0x41 (A) to 0x5A (Z), inclusive, by 0x20.
     */
    for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c >= 0x41 && c <= 0x5A) {
            list[i] = c + 0x20;
        }
    }
}
exports.byteLowercase = byteLowercase;
/**
 * Converts each byte to uppercase.
 *
 * @param list - a byte sequence
 */
function byteUppercase(list) {
    /**
     * To byte-uppercase a byte sequence, subtract each byte it contains, in the
     * range 0x61 (a) to 0x7A (z), inclusive, by 0x20.
     */
    for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c >= 0x61 && c <= 0x7A) {
            list[i] = c - 0x20;
        }
    }
}
exports.byteUppercase = byteUppercase;
/**
 * Compares two byte sequences.
 *
 * @param listA - a byte sequence
 * @param listB - a byte sequence
 */
function byteCaseInsensitiveMatch(listA, listB) {
    /**
     * A byte sequence A is a byte-case-insensitive match for a byte sequence B,
     * if the byte-lowercase of A is the byte-lowercase of B.
     */
    if (listA.length !== listB.length)
        return false;
    for (var i = 0; i < listA.length; i++) {
        var a = listA[i];
        var b = listB[i];
        if (a >= 0x41 && a <= 0x5A)
            a += 0x20;
        if (b >= 0x41 && b <= 0x5A)
            b += 0x20;
        if (a !== b)
            return false;
    }
    return true;
}
exports.byteCaseInsensitiveMatch = byteCaseInsensitiveMatch;
/**
 * Determines if `listA` starts with `listB`.
 *
 * @param listA - a byte sequence
 * @param listB - a byte sequence
 */
function startsWith(listA, listB) {
    /**
     * 1. Let i be 0.
     * 2. While true:
     * 2.1. Let aByte be the ith byte of a if i is less than a’s length; otherwise null.
     * 2.3. Let bByte be the ith byte of b if i is less than b’s length; otherwise null.
     * 2.4. If bByte is null, then return true.
     * 2.5. Return false if aByte is not bByte.
     * 2.6. Set i to i + 1.
     */
    var i = 0;
    while (true) {
        if (i >= listA.length)
            return false;
        if (i >= listB.length)
            return true;
        if (listA[i] !== listB[i])
            return false;
        i++;
    }
}
exports.startsWith = startsWith;
/**
 * Determines if `listA` is less than `listB`.
 *
 * @param listA - a byte sequence
 * @param listB - a byte sequence
 */
function byteLessThan(listA, listB) {
    /**
     * 1. If b starts with a, then return false.
     * 2. If a starts with b, then return true.
     * 3. Let n be the smallest index such that the nth byte of a is different
     * from the nth byte of b. (There has to be such an index, since neither byte
     * sequence starts with the other.)
     * 4. If the nth byte of a is less than the nth byte of b, then return true.
     * 5. Return false.
     */
    var i = 0;
    while (true) {
        if (i >= listA.length)
            return false;
        if (i >= listB.length)
            return true;
        var a = listA[i];
        var b = listB[i];
        if (a < b)
            return true;
        else if (a > b)
            return false;
        i++;
    }
}
exports.byteLessThan = byteLessThan;
/**
 * Decodes a byte sequence into a string.
 *
 * @param list - a byte sequence
 */
function isomorphicDecode(list) {
    /**
     * To isomorphic decode a byte sequence input, return a string whose length is
     * equal to input’s length and whose code points have the same values as
     * input’s bytes, in the same order.
     */
    return String.fromCodePoint.apply(String, __spread(list));
}
exports.isomorphicDecode = isomorphicDecode;
//# sourceMappingURL=ByteSequence.js.map