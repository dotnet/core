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
var CharacterDataImpl_1 = require("./CharacterDataImpl");
var WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents a comment node.
 */
var CommentImpl = /** @class */ (function (_super) {
    __extends(CommentImpl, _super);
    /**
     * Initializes a new instance of `Comment`.
     *
     * @param data - the text content
     */
    function CommentImpl(data) {
        if (data === void 0) { data = ''; }
        return _super.call(this, data) || this;
    }
    /**
     * Creates a new `Comment`.
     *
     * @param document - owner document
     * @param data - node contents
     */
    CommentImpl._create = function (document, data) {
        if (data === void 0) { data = ''; }
        var node = new CommentImpl(data);
        node._nodeDocument = document;
        return node;
    };
    return CommentImpl;
}(CharacterDataImpl_1.CharacterDataImpl));
exports.CommentImpl = CommentImpl;
/**
 * Initialize prototype properties
 */
WebIDLAlgorithm_1.idl_defineConst(CommentImpl.prototype, "_nodeType", interfaces_1.NodeType.Comment);
//# sourceMappingURL=CommentImpl.js.map