"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines a WebIDL `Const` property on the given object.
 *
 * @param o - object on which to add the property
 * @param name - property name
 * @param value - property value
 */
function idl_defineConst(o, name, value) {
    Object.defineProperty(o, name, { writable: false, enumerable: true, configurable: false, value: value });
}
exports.idl_defineConst = idl_defineConst;
//# sourceMappingURL=WebIDLAlgorithm.js.map