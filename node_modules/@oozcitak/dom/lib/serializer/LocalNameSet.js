"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents a set of unique attribute namespaceURI and localName pairs.
 * This set will contain tuples of unique attribute namespaceURI and
 * localName pairs, and is populated as each attr is processed. This set is
 * used to [optionally] enforce the well-formed constraint that an element
 * cannot have two attributes with the same namespaceURI and localName.
 * This can occur when two otherwise identical attributes on the same
 * element differ only by their prefix values.
 */
var LocalNameSet = /** @class */ (function () {
    function LocalNameSet() {
        // tuple storage
        this._items = {};
        this._nullItems = {};
    }
    /**
     * Adds or replaces a tuple.
     *
     * @param ns - namespace URI
     * @param localName - attribute local name
     */
    LocalNameSet.prototype.set = function (ns, localName) {
        if (ns === null) {
            this._nullItems[localName] = true;
        }
        else if (this._items[ns]) {
            this._items[ns][localName] = true;
        }
        else {
            this._items[ns] = {};
            this._items[ns][localName] = true;
        }
    };
    /**
     * Determines if the given tuple exists in the set.
     *
     * @param ns - namespace URI
     * @param localName - attribute local name
     */
    LocalNameSet.prototype.has = function (ns, localName) {
        if (ns === null) {
            return this._nullItems[localName] === true;
        }
        else if (this._items[ns]) {
            return this._items[ns][localName] === true;
        }
        else {
            return false;
        }
    };
    return LocalNameSet;
}());
exports.LocalNameSet = LocalNameSet;
//# sourceMappingURL=LocalNameSet.js.map