"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OrderedSetAlgorithm_1 = require("./OrderedSetAlgorithm");
var DOMAlgorithm_1 = require("./DOMAlgorithm");
var ElementAlgorithm_1 = require("./ElementAlgorithm");
/**
 * Validates a given token against the supported tokens defined for the given
 * token lists' associated attribute.
 *
 * @param tokenList - a token list
 * @param token - a token
 */
function tokenList_validationSteps(tokenList, token) {
    /**
     * 1. If the associated attribute’s local name does not define supported
     * tokens, throw a TypeError.
     * 2. Let lowercase token be a copy of token, in ASCII lowercase.
     * 3. If lowercase token is present in supported tokens, return true.
     * 4. Return false.
     */
    if (!DOMAlgorithm_1.dom_hasSupportedTokens(tokenList._attribute._localName)) {
        throw new TypeError("There are no supported tokens defined for attribute name: '" + tokenList._attribute._localName + "'.");
    }
    return DOMAlgorithm_1.dom_getSupportedTokens(tokenList._attribute._localName).has(token.toLowerCase());
}
exports.tokenList_validationSteps = tokenList_validationSteps;
/**
 * Updates the value of the token lists' associated attribute.
 *
 * @param tokenList - a token list
 */
function tokenList_updateSteps(tokenList) {
    /**
     * 1. If the associated element does not have an associated attribute and
     * token set is empty, then return.
     * 2. Set an attribute value for the associated element using associated
     * attribute’s local name and the result of running the ordered set
     * serializer for token set.
     */
    if (!tokenList._element.hasAttribute(tokenList._attribute._localName) &&
        tokenList._tokenSet.size === 0) {
        return;
    }
    ElementAlgorithm_1.element_setAnAttributeValue(tokenList._element, tokenList._attribute._localName, OrderedSetAlgorithm_1.orderedSet_serialize(tokenList._tokenSet));
}
exports.tokenList_updateSteps = tokenList_updateSteps;
/**
 * Gets the value of the token lists' associated attribute.
 *
 * @param tokenList - a token list
 */
function tokenList_serializeSteps(tokenList) {
    /**
     * A DOMTokenList object’s serialize steps are to return the result of
     * running get an attribute value given the associated element and the
     * associated attribute’s local name.
     */
    return ElementAlgorithm_1.element_getAnAttributeValue(tokenList._element, tokenList._attribute._localName);
}
exports.tokenList_serializeSteps = tokenList_serializeSteps;
//# sourceMappingURL=DOMTokenListAlgorithm.js.map