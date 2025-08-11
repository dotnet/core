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
var WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents an object providing methods which are not dependent on
 * any particular document
 */
var DocumentTypeImpl = /** @class */ (function (_super) {
    __extends(DocumentTypeImpl, _super);
    /**
     * Initializes a new instance of `DocumentType`.
     *
     * @param name - name of the node
     * @param publicId - `PUBLIC` identifier
     * @param systemId - `SYSTEM` identifier
     */
    function DocumentTypeImpl(name, publicId, systemId) {
        var _this = _super.call(this) || this;
        _this._name = '';
        _this._publicId = '';
        _this._systemId = '';
        _this._name = name;
        _this._publicId = publicId;
        _this._systemId = systemId;
        return _this;
    }
    Object.defineProperty(DocumentTypeImpl.prototype, "name", {
        /** @inheritdoc */
        get: function () { return this._name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentTypeImpl.prototype, "publicId", {
        /** @inheritdoc */
        get: function () { return this._publicId; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentTypeImpl.prototype, "systemId", {
        /** @inheritdoc */
        get: function () { return this._systemId; },
        enumerable: true,
        configurable: true
    });
    // MIXIN: ChildNode
    /* istanbul ignore next */
    DocumentTypeImpl.prototype.before = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        throw new Error("Mixin: ChildNode not implemented.");
    };
    /* istanbul ignore next */
    DocumentTypeImpl.prototype.after = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        throw new Error("Mixin: ChildNode not implemented.");
    };
    /* istanbul ignore next */
    DocumentTypeImpl.prototype.replaceWith = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        throw new Error("Mixin: ChildNode not implemented.");
    };
    /* istanbul ignore next */
    DocumentTypeImpl.prototype.remove = function () { throw new Error("Mixin: ChildNode not implemented."); };
    /**
     * Creates a new `DocumentType`.
     *
     * @param document - owner document
     * @param name - name of the node
     * @param publicId - `PUBLIC` identifier
     * @param systemId - `SYSTEM` identifier
     */
    DocumentTypeImpl._create = function (document, name, publicId, systemId) {
        if (publicId === void 0) { publicId = ''; }
        if (systemId === void 0) { systemId = ''; }
        var node = new DocumentTypeImpl(name, publicId, systemId);
        node._nodeDocument = document;
        return node;
    };
    return DocumentTypeImpl;
}(NodeImpl_1.NodeImpl));
exports.DocumentTypeImpl = DocumentTypeImpl;
/**
 * Initialize prototype properties
 */
WebIDLAlgorithm_1.idl_defineConst(DocumentTypeImpl.prototype, "_nodeType", interfaces_1.NodeType.DocumentType);
//# sourceMappingURL=DocumentTypeImpl.js.map