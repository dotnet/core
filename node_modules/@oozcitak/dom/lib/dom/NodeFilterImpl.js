"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("./interfaces");
var WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents a node filter.
 */
var NodeFilterImpl = /** @class */ (function () {
    /**
     * Initializes a new instance of `NodeFilter`.
     */
    function NodeFilterImpl() {
    }
    /**
     * Callback function.
     */
    NodeFilterImpl.prototype.acceptNode = function (node) {
        return interfaces_1.FilterResult.Accept;
    };
    /**
     * Creates a new `NodeFilter`.
     */
    NodeFilterImpl._create = function () {
        return new NodeFilterImpl();
    };
    NodeFilterImpl.FILTER_ACCEPT = 1;
    NodeFilterImpl.FILTER_REJECT = 2;
    NodeFilterImpl.FILTER_SKIP = 3;
    NodeFilterImpl.SHOW_ALL = 0xffffffff;
    NodeFilterImpl.SHOW_ELEMENT = 0x1;
    NodeFilterImpl.SHOW_ATTRIBUTE = 0x2;
    NodeFilterImpl.SHOW_TEXT = 0x4;
    NodeFilterImpl.SHOW_CDATA_SECTION = 0x8;
    NodeFilterImpl.SHOW_ENTITY_REFERENCE = 0x10;
    NodeFilterImpl.SHOW_ENTITY = 0x20;
    NodeFilterImpl.SHOW_PROCESSING_INSTRUCTION = 0x40;
    NodeFilterImpl.SHOW_COMMENT = 0x80;
    NodeFilterImpl.SHOW_DOCUMENT = 0x100;
    NodeFilterImpl.SHOW_DOCUMENT_TYPE = 0x200;
    NodeFilterImpl.SHOW_DOCUMENT_FRAGMENT = 0x400;
    NodeFilterImpl.SHOW_NOTATION = 0x800;
    return NodeFilterImpl;
}());
exports.NodeFilterImpl = NodeFilterImpl;
/**
 * Define constants on prototype.
 */
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "FILTER_ACCEPT", 1);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "FILTER_REJECT", 2);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "FILTER_SKIP", 3);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_ALL", 0xffffffff);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_ELEMENT", 0x1);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_ATTRIBUTE", 0x2);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_TEXT", 0x4);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_CDATA_SECTION", 0x8);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_ENTITY_REFERENCE", 0x10);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_ENTITY", 0x20);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_PROCESSING_INSTRUCTION", 0x40);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_COMMENT", 0x80);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_DOCUMENT", 0x100);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_DOCUMENT_TYPE", 0x200);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_DOCUMENT_FRAGMENT", 0x400);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_NOTATION", 0x800);
//# sourceMappingURL=NodeFilterImpl.js.map