"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DOMException_1 = require("../dom/DOMException");
/**
 * Matches elements with the given selectors.
 *
 * @param selectors - selectors
 * @param node - the node to match against
 */
function selectors_scopeMatchASelectorsString(selectors, node) {
    /**
     * TODO: Selectors
     * 1. Let s be the result of parse a selector selectors. [SELECTORS4]
     * 2. If s is failure, then throw a "SyntaxError" DOMException.
     * 3. Return the result of match a selector against a tree with s and node’s
     * root using scoping root node. [SELECTORS4].
     */
    throw new DOMException_1.NotSupportedError();
}
exports.selectors_scopeMatchASelectorsString = selectors_scopeMatchASelectorsString;
//# sourceMappingURL=SelectorsAlgorithm.js.map