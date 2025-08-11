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
var TextImpl_1 = require("./TextImpl");
var interfaces_1 = require("./interfaces");
var WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents a CDATA node.
 */
var CDATASectionImpl = /** @class */ (function (_super) {
    __extends(CDATASectionImpl, _super);
    /**
     * Initializes a new instance of `CDATASection`.
     *
     * @param data - node contents
     */
    function CDATASectionImpl(data) {
        return _super.call(this, data) || this;
    }
    /**
     * Creates a new `CDATASection`.
     *
     * @param document - owner document
     * @param data - node contents
     */
    CDATASectionImpl._create = function (document, data) {
        if (data === void 0) { data = ''; }
        var node = new CDATASectionImpl(data);
        node._nodeDocument = document;
        return node;
    };
    return CDATASectionImpl;
}(TextImpl_1.TextImpl));
exports.CDATASectionImpl = CDATASectionImpl;
/**
 * Initialize prototype properties
 */
WebIDLAlgorithm_1.idl_defineConst(CDATASectionImpl.prototype, "_nodeType", interfaces_1.NodeType.CData);
//# sourceMappingURL=CDATASectionImpl.js.map