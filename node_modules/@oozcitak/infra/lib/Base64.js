"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CodePoints_1 = require("./CodePoints");
/**
 * Base-64 encodes the given string.
 *
 * @param input - a string
 */
function forgivingBase64Encode(input) {
    /**
     * To forgiving-base64 encode given a byte sequence data, apply the base64
     * algorithm defined in section 4 of RFC 4648 to data and return the result.
     * [RFC4648]
     */
    return Buffer.from(input).toString('base64');
}
exports.forgivingBase64Encode = forgivingBase64Encode;
/**
 * Decodes a base-64 string.
 *
 * @param input - a string
 */
function forgivingBase64Decode(input) {
    if (input === "")
        return "";
    /**
     * 1. Remove all ASCII whitespace from data.
     */
    input = input.replace(CodePoints_1.ASCIIWhiteSpace, '');
    /**
     * 2. If data’s length divides by 4 leaving no remainder, then:
     * 2.1. If data ends with one or two U+003D (=) code points, then remove them from data.
     */
    if (input.length % 4 === 0) {
        if (input.endsWith("==")) {
            input = input.substr(0, input.length - 2);
        }
        else if (input.endsWith("=")) {
            input = input.substr(0, input.length - 1);
        }
    }
    /**
     * 3. If data’s length divides by 4 leaving a remainder of 1, then return failure.
     */
    if (input.length % 4 === 1)
        return null;
    /**
     * 4. If data contains a code point that is not one of
     * - U+002B (+)
     * - U+002F (/)
     * - ASCII alphanumeric
     * then return failure.
     */
    if (!/[0-9A-Za-z+/]/.test(input))
        return null;
    /**
     * 5. Let output be an empty byte sequence.
     * 6. Let buffer be an empty buffer that can have bits appended to it.
     * 7. Let position be a position variable for data, initially pointing at the
     * start of data.
     * 8. While position does not point past the end of data:
     * 8.1. Find the code point pointed to by position in the second column of
     * Table 1: The Base 64 Alphabet of RFC 4648. Let n be the number given in the
     * first cell of the same row. [RFC4648]
     * 8.2. Append the six bits corresponding to n, most significant bit first,
     * to buffer.
     * 8.3. If buffer has accumulated 24 bits, interpret them as three 8-bit
     * big-endian numbers. Append three bytes with values equal to those numbers
     * to output, in the same order, and then empty buffer.
     * 8.4. Advance position by 1.
     * 9. If buffer is not empty, it contains either 12 or 18 bits. If it contains
     * 12 bits, then discard the last four and interpret the remaining eight as an
     * 8-bit big-endian number. If it contains 18 bits, then discard the last two
     * and interpret the remaining 16 as two 8-bit big-endian numbers. Append the
     * one or two bytes with values equal to those one or two numbers to output,
     * in the same order.
     * 10. Return output.
     */
    return Buffer.from(input, 'base64').toString('utf8');
}
exports.forgivingBase64Decode = forgivingBase64Decode;
//# sourceMappingURL=Base64.js.map