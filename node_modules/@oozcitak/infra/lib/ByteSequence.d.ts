/**
 * Returns the count of bytes in a sequence.
 *
 * @param list - a byte sequence
 */
export declare function length(list: Uint8Array): number;
/**
 * Converts each byte to lowercase.
 *
 * @param list - a byte sequence
 */
export declare function byteLowercase(list: Uint8Array): void;
/**
 * Converts each byte to uppercase.
 *
 * @param list - a byte sequence
 */
export declare function byteUppercase(list: Uint8Array): void;
/**
 * Compares two byte sequences.
 *
 * @param listA - a byte sequence
 * @param listB - a byte sequence
 */
export declare function byteCaseInsensitiveMatch(listA: Uint8Array, listB: Uint8Array): boolean;
/**
 * Determines if `listA` starts with `listB`.
 *
 * @param listA - a byte sequence
 * @param listB - a byte sequence
 */
export declare function startsWith(listA: Uint8Array, listB: Uint8Array): boolean;
/**
 * Determines if `listA` is less than `listB`.
 *
 * @param listA - a byte sequence
 * @param listB - a byte sequence
 */
export declare function byteLessThan(listA: Uint8Array, listB: Uint8Array): boolean;
/**
 * Decodes a byte sequence into a string.
 *
 * @param list - a byte sequence
 */
export declare function isomorphicDecode(list: Uint8Array): string;
