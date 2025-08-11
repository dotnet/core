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
 * Represents a document fragment in the XML tree.
 */
var DocumentFragmentImpl = /** @class */ (function (_super) {
    __extends(DocumentFragmentImpl, _super);
    /**
     * Initializes a new instance of `DocumentFragment`.
     *
     * @param host - shadow root's host element
     */
    function DocumentFragmentImpl(host) {
        if (host === void 0) { host = null; }
        var _this = _super.call(this) || this;
        _this._children = new Set();
        _this._host = host;
        return _this;
    }
    // MIXIN: NonElementParentNode
    /* istanbul ignore next */
    DocumentFragmentImpl.prototype.getElementById = function (elementId) { throw new Error("Mixin: NonElementParentNode not implemented."); };
    Object.defineProperty(DocumentFragmentImpl.prototype, "children", {
        // MIXIN: ParentNode
        /* istanbul ignore next */
        get: function () { throw new Error("Mixin: ParentNode not implemented."); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentFragmentImpl.prototype, "firstElementChild", {
        /* istanbul ignore next */
        get: function () { throw new Error("Mixin: ParentNode not implemented."); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentFragmentImpl.prototype, "lastElementChild", {
        /* istanbul ignore next */
        get: function () { throw new Error("Mixin: ParentNode not implemented."); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentFragmentImpl.prototype, "childElementCount", {
        /* istanbul ignore next */
        get: function () { throw new Error("Mixin: ParentNode not implemented."); },
        enumerable: true,
        configurable: true
    });
    /* istanbul ignore next */
    DocumentFragmentImpl.prototype.prepend = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        throw new Error("Mixin: ParentNode not implemented.");
    };
    /* istanbul ignore next */
    DocumentFragmentImpl.prototype.append = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        throw new Error("Mixin: ParentNode not implemented.");
    };
    /* istanbul ignore next */
    DocumentFragmentImpl.prototype.querySelector = function (selectors) { throw new Error("Mixin: ParentNode not implemented."); };
    /* istanbul ignore next */
    DocumentFragmentImpl.prototype.querySelectorAll = function (selectors) { throw new Error("Mixin: ParentNode not implemented."); };
    /**
     * Creates a new `DocumentFragment`.
     *
     * @param document - owner document
     * @param host - shadow root's host element
     */
    DocumentFragmentImpl._create = function (document, host) {
        if (host === void 0) { host = null; }
        var node = new DocumentFragmentImpl(host);
        node._nodeDocument = document;
        return node;
    };
    return DocumentFragmentImpl;
}(NodeImpl_1.NodeImpl));
exports.DocumentFragmentImpl = DocumentFragmentImpl;
/**
 * Initialize prototype properties
 */
WebIDLAlgorithm_1.idl_defineConst(DocumentFragmentImpl.prototype, "_nodeType", interfaces_1.NodeType.DocumentFragment);
//# sourceMappingURL=DocumentFragmentImpl.js.map