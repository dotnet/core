/**
 * Parses the given byte sequence representing a JSON string into an object.
 *
 * @param bytes - a byte sequence
 */
export declare function parseJSONFromBytes(bytes: Uint8Array): any;
/**
 * Serialize the given JavaScript value into a byte sequence.
 *
 * @param value - a JavaScript value
 */
export declare function serializeJSONToBytes(value: any): Uint8Array;
/**
 * Parses the given JSON string into a Realm-independent JavaScript value.
 *
 * @param jsonText - a JSON string
 */
export declare function parseJSONIntoInfraValues(jsonText: string): any;
/**
 * Parses the value into a Realm-independent JavaScript value.
 *
 * @param jsValue - a JavaScript value
 */
export declare function convertAJSONDerivedJavaScriptValueToAnInfraValue(jsValue: any): any;
