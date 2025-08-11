import { DOMTokenList } from "../dom/interfaces";
/**
 * Validates a given token against the supported tokens defined for the given
 * token lists' associated attribute.
 *
 * @param tokenList - a token list
 * @param token - a token
 */
export declare function tokenList_validationSteps(tokenList: DOMTokenList, token: string): boolean;
/**
 * Updates the value of the token lists' associated attribute.
 *
 * @param tokenList - a token list
 */
export declare function tokenList_updateSteps(tokenList: DOMTokenList): void;
/**
 * Gets the value of the token lists' associated attribute.
 *
 * @param tokenList - a token list
 */
export declare function tokenList_serializeSteps(tokenList: DOMTokenList): string;
