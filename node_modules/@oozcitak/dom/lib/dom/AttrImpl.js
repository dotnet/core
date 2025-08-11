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
var interfaces_1 = require("./interfaces");
var NodeImpl_1 = require("./NodeImpl");
var algorithm_1 = require("../algorithm");
var WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents an attribute of an element node.
 */
var AttrImpl = /** @class */ (function (_super) {
    __extends(AttrImpl, _super);
    /**
     * Initializes a new instance of `Attr`.
     *
     * @param localName - local name
     */
    function AttrImpl(localName) {
        var _this = _super.call(this) || this;
        _this._namespace = null;
        _this._namespacePrefix = null;
        _this._element = null;
        _this._value = '';
        _this._localName = localName;
        return _this;
    }
    Object.defineProperty(AttrImpl.prototype, "ownerElement", {
        /** @inheritdoc */
        get: function () { return this._element; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttrImpl.prototype, "namespaceURI", {
        /** @inheritdoc */
        get: function () { return this._namespace; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttrImpl.prototype, "prefix", {
        /** @inheritdoc */
        get: function () { return this._namespacePrefix; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttrImpl.prototype, "localName", {
        /** @inheritdoc */
        get: function () { return this._localName; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttrImpl.prototype, "name", {
        /** @inheritdoc */
        get: function () { return this._qualifiedName; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttrImpl.prototype, "value", {
        /** @inheritdoc */
        get: function () { return this._value; },
        set: function (value) {
            /**
             * The value attribute’s setter must set an existing attribute value with
             * context object and the given value.
             */
            algorithm_1.attr_setAnExistingAttributeValue(this, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttrImpl.prototype, "_qualifiedName", {
        /**
         * Returns the qualified name.
         */
        get: function () {
            /**
             * An attribute’s qualified name is its local name if its namespace prefix
             * is null, and its namespace prefix, followed by ":", followed by its
             * local name, otherwise.
             */
            return (this._namespacePrefix !== null ?
                this._namespacePrefix + ':' + this._localName :
                this._localName);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates an `Attr`.
     *
     * @param document - owner document
     * @param localName - local name
     */
    AttrImpl._create = function (document, localName) {
        var node = new AttrImpl(localName);
        node._nodeDocument = document;
        return node;
    };
    return AttrImpl;
}(NodeImpl_1.NodeImpl));
exports.AttrImpl = AttrImpl;
/**
 * Initialize prototype properties
 */
WebIDLAlgorithm_1.idl_defineConst(AttrImpl.prototype, "_nodeType", interfaces_1.NodeType.Attribute);
WebIDLAlgorithm_1.idl_defineConst(AttrImpl.prototype, "specified", true);
//# sourceMappingURL=AttrImpl.js.map