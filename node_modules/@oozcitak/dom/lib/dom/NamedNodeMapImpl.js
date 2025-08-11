"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var DOMException_1 = require("./DOMException");
var algorithm_1 = require("../algorithm");
/**
 * Represents a collection of attributes.
 */
var NamedNodeMapImpl = /** @class */ (function (_super) {
    __extends(NamedNodeMapImpl, _super);
    /**
     * Initializes a new instance of `NamedNodeMap`.
     *
     * @param element - parent element
     */
    function NamedNodeMapImpl(element) {
        var _this = _super.call(this) || this;
        _this._element = element;
        // TODO: This workaround is needed to extend Array in ES5
        Object.setPrototypeOf(_this, NamedNodeMapImpl.prototype);
        return _this;
    }
    NamedNodeMapImpl.prototype._asArray = function () { return this; };
    /** @inheritdoc */
    NamedNodeMapImpl.prototype.item = function (index) {
        /**
         * 1. If index is equal to or greater than context object’s attribute list’s
         * size, then return null.
         * 2. Otherwise, return context object’s attribute list[index].
         *
         */
        return this[index] || null;
    };
    /** @inheritdoc */
    NamedNodeMapImpl.prototype.getNamedItem = function (qualifiedName) {
        /**
         * The getNamedItem(qualifiedName) method, when invoked, must return the
         * result of getting an attribute given qualifiedName and element.
         */
        return algorithm_1.element_getAnAttributeByName(qualifiedName, this._element);
    };
    /** @inheritdoc */
    NamedNodeMapImpl.prototype.getNamedItemNS = function (namespace, localName) {
        /**
         * The getNamedItemNS(namespace, localName) method, when invoked, must
         * return the result of getting an attribute given namespace, localName,
         * and element.
         */
        return algorithm_1.element_getAnAttributeByNamespaceAndLocalName(namespace || '', localName, this._element);
    };
    /** @inheritdoc */
    NamedNodeMapImpl.prototype.setNamedItem = function (attr) {
        /**
         * The setNamedItem(attr) and setNamedItemNS(attr) methods, when invoked,
         * must return the result of setting an attribute given attr and element.
         */
        return algorithm_1.element_setAnAttribute(attr, this._element);
    };
    /** @inheritdoc */
    NamedNodeMapImpl.prototype.setNamedItemNS = function (attr) {
        return algorithm_1.element_setAnAttribute(attr, this._element);
    };
    /** @inheritdoc */
    NamedNodeMapImpl.prototype.removeNamedItem = function (qualifiedName) {
        /**
         * 1. Let attr be the result of removing an attribute given qualifiedName
         * and element.
         * 2. If attr is null, then throw a "NotFoundError" DOMException.
         * 3. Return attr.
         */
        var attr = algorithm_1.element_removeAnAttributeByName(qualifiedName, this._element);
        if (attr === null)
            throw new DOMException_1.NotFoundError();
        return attr;
    };
    /** @inheritdoc */
    NamedNodeMapImpl.prototype.removeNamedItemNS = function (namespace, localName) {
        /**
         * 1. Let attr be the result of removing an attribute given namespace,
         * localName, and element.
         * 2. If attr is null, then throw a "NotFoundError" DOMException.
         * 3. Return attr.
         */
        var attr = algorithm_1.element_removeAnAttributeByNamespaceAndLocalName(namespace || '', localName, this._element);
        if (attr === null)
            throw new DOMException_1.NotFoundError();
        return attr;
    };
    /**
     * Creates a new `NamedNodeMap`.
     *
     * @param element - parent element
     */
    NamedNodeMapImpl._create = function (element) {
        return new NamedNodeMapImpl(element);
    };
    return NamedNodeMapImpl;
}(Array));
exports.NamedNodeMapImpl = NamedNodeMapImpl;
//# sourceMappingURL=NamedNodeMapImpl.js.map