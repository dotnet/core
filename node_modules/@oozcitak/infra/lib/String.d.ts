/**
 * Determines if the string `a` is a code unit prefix of string `b`.
 *
 * @param a - a string
 * @param b - a string
 */
export declare function isCodeUnitPrefix(a: string, b: string): boolean;
/**
 * Determines if the string `a` is a code unit less than string `b`.
 *
 * @param a - a string
 * @param b - a string
 */
export declare function isCodeUnitLessThan(a: string, b: string): boolean;
/**
 * Isomorphic encodes the given string.
 *
 * @param str - a string
 */
export declare function isomorphicEncode(str: string): Uint8Array;
/**
 * Determines if the given string is An ASCII string.
 *
 * @param str - a string
 */
export declare function isASCIIString(str: string): boolean;
/**
 * Converts all uppercase ASCII code points to lowercase.
 *
 * @param str - a string
 */
export declare function asciiLowercase(str: string): string;
/**
 * Converts all uppercase ASCII code points to uppercase.
 *
 * @param str - a string
 */
export declare function asciiUppercase(str: string): string;
/**
 * Compares two ASCII strings case-insensitively.
 *
 * @param a - a string
 * @param b - a string
 */
export declare function asciiCaseInsensitiveMatch(a: string, b: string): boolean;
/**
 * ASCII encodes a string.
 *
 * @param str - a string
 */
export declare function asciiEncode(str: string): Uint8Array;
/**
 * ASCII decodes a byte sequence.
 *
 * @param bytes - a byte sequence
 */
export declare function asciiDecode(bytes: Uint8Array): string;
/**
 * Strips newline characters from a string.
 *
 * @param str - a string
 */
export declare function stripNewlines(str: string): string;
/**
 * Normalizes newline characters in a string by converting consecutive
 * carriage-return newline characters and also single carriage return characters
 * into a single newline.
 *
 * @param str - a string
 */
export declare function normalizeNewlines(str: string): string;
/**
 * Removes leading and trailing whitespace characters from a string.
 *
 * @param str - a string
 */
export declare function stripLeadingAndTrailingASCIIWhitespace(str: string): string;
/**
 * Removes consecutive newline characters from a string.
 *
 * @param str - a string
 */
export declare function stripAndCollapseASCIIWhitespace(str: string): string;
/**
 * Collects a sequence of code points matching a given condition from the input
 * string.
 *
 * @param condition - a condition to match
 * @param input - a string
 * @param options - starting position
 */
export declare function collectASequenceOfCodePoints(condition: ((str: string) => boolean), input: string | string[], options: {
    position: number;
}): string;
/**
 * Skips over ASCII whitespace.
 *
 * @param input - input string
 * @param options - starting position
 */
export declare function skipASCIIWhitespace(input: string | string[], options: {
    position: number;
}): void;
/**
 * Solits a string at the given delimiter.
 *
 * @param input - input string
 * @param delimiter - a delimiter string
 */
export declare function strictlySplit(input: string | string[], delimiter: string): string[];
/**
 * Splits a string on ASCII whitespace.
 *
 * @param input - a string
 */
export declare function splitAStringOnASCIIWhitespace(input: string | string[]): string[];
/**
 * Splits a string on commas.
 *
 * @param input - a string
 */
export declare function splitAStringOnCommas(input: string | string[]): string[];
/**
 * Concatenates a list of strings with the given separator.
 *
 * @param list - a list of strings
 * @param separator - a separator string
 */
export declare function concatenate(list: string[], separator?: string): string;
