/**
 * Determines if the given string is valid for a `"Name"` construct.
 *
 * @param name - name string to test
 */
export declare function xml_isName(name: string): boolean;
/**
 * Determines if the given string is valid for a `"QName"` construct.
 *
 * @param name - name string to test
 */
export declare function xml_isQName(name: string): boolean;
/**
 * Determines if the given string contains legal characters.
 *
 * @param chars - sequence of characters to test
 */
export declare function xml_isLegalChar(chars: string): boolean;
/**
 * Determines if the given string contains legal characters for a public
 * identifier.
 *
 * @param chars - sequence of characters to test
 */
export declare function xml_isPubidChar(chars: string): boolean;
