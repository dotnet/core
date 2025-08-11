/**
 * Converts a whitespace separated string into an array of tokens.
 *
 * @param value - a string of whitespace separated tokens
 */
export declare function orderedSet_parse(value: string): Set<string>;
/**
 * Converts an array of tokens into a space separated string.
 *
 * @param tokens - an array of token strings
 */
export declare function orderedSet_serialize(tokens: Set<string>): string;
/**
 * Removes duplicate tokens and convert all whitespace characters
 * to space.
 *
 * @param value - a string of whitespace separated tokens
 */
export declare function orderedSet_sanitize(value: string): string;
/**
 * Determines whether a set contains the other.
 *
 * @param set1 - a set
 * @param set1 - a set that is contained in set1
 * @param caseSensitive - whether matches are case-sensitive
 */
export declare function orderedSet_contains(set1: Set<string>, set2: Set<string>, caseSensitive: boolean): boolean;
