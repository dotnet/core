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
 * Represents a processing instruction node.
 */
var ProcessingInstructionImpl = /** @class */ (function (_super) {
    __extends(ProcessingInstructionImpl, _super);
    /**
     * Initializes a new instance of `ProcessingInstruction`.
     */
    function ProcessingInstructionImpl(target, data) {
        var _this = _super.call(this, data) || this;
        _this._target = target;
        return _this;
    }
    Object.defineProperty(ProcessingInstructionImpl.prototype, "target", {
        /**
         * Gets the target of the {@link ProcessingInstruction} node.
         */
        get: function () { return this._target; },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a new `ProcessingInstruction`.
     *
     * @param document - owner document
     * @param target - instruction target
     * @param data - node contents
     */
    ProcessingInstructionImpl._create = function (document, target, data) {
        var node = new ProcessingInstructionImpl(target, data);
        node._nodeDocument = document;
        return node;
    };
    return ProcessingInstructionImpl;
}(CharacterDataImpl_1.CharacterDataImpl));
exports.ProcessingInstructionImpl = ProcessingInstructionImpl;
/**
 * Initialize prototype properties
 */
WebIDLAlgorithm_1.idl_defineConst(ProcessingInstructionImpl.prototype, "_nodeType", interfaces_1.NodeType.ProcessingInstruction);
//# sourceMappingURL=ProcessingInstructionImpl.js.map