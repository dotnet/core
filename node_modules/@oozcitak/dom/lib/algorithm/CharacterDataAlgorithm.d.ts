import { CharacterData } from "../dom/interfaces";
/**
 * Replaces character data.
 *
 * @param node - a character data node
 * @param offset - start offset
 * @param count - count of characters to replace
 * @param data - new data
 */
export declare function characterData_replaceData(node: CharacterData, offset: number, count: number, data: string): void;
/**
 * Returns `count` number of characters from `node`'s data starting at
 * the given `offset`.
 *
 * @param node - a character data node
 * @param offset - start offset
 * @param count - count of characters to return
 */
export declare function characterData_substringData(node: CharacterData, offset: number, count: number): string;
