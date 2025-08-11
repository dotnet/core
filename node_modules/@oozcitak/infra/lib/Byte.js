"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Determines if the given number is an ASCII byte.
 *
 * @param byte - a byte
 */
function isASCIIByte(byte) {
    /**
     * An ASCII byte is a byte in the range 0x00 (NUL) to 0x7F (DEL), inclusive.
     */
    return byte >= 0x00 && byte <= 0x7F;
}
exports.isASCIIByte = isASCIIByte;
//# sourceMappingURL=Byte.js.map