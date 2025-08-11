"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
/**
 * Creates an XML builder which serializes the document in chunks.
 *
 * @param options - callback builder options
 *
 * @returns callback builder
 */
function createCB(options) {
    return new _1.XMLBuilderCBImpl(options);
}
exports.createCB = createCB;
/**
 * Creates an XML builder which serializes the fragment in chunks.
 *
 * @param options - callback builder options
 *
 * @returns callback builder
 */
function fragmentCB(options) {
    return new _1.XMLBuilderCBImpl(options, true);
}
exports.fragmentCB = fragmentCB;
//# sourceMappingURL=BuilderFunctionsCB.js.map