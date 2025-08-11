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
var AbstractRangeImpl_1 = require("./AbstractRangeImpl");
var DOMException_1 = require("./DOMException");
var util_1 = require("../util");
/**
 * Represents a static range.
 */
var StaticRangeImpl = /** @class */ (function (_super) {
    __extends(StaticRangeImpl, _super);
    /**
     * Initializes a new instance of `StaticRange`.
     */
    function StaticRangeImpl(init) {
        var _this = _super.call(this) || this;
        /**
         * 1. If init’s startContainer or endContainer is a DocumentType or Attr
         * node, then throw an "InvalidNodeTypeError" DOMException.
         * 2. Let staticRange be a new StaticRange object.
         * 3. Set staticRange’s start to (init’s startContainer, init’s startOffset)
         * and end to (init’s endContainer, init’s endOffset).
         * 4. Return staticRange.
         */
        if (util_1.Guard.isDocumentTypeNode(init.startContainer) || util_1.Guard.isAttrNode(init.startContainer) ||
            util_1.Guard.isDocumentTypeNode(init.endContainer) || util_1.Guard.isAttrNode(init.endContainer)) {
            throw new DOMException_1.InvalidNodeTypeError();
        }
        _this._start = [init.startContainer, init.startOffset];
        _this._end = [init.endContainer, init.endOffset];
        return _this;
    }
    return StaticRangeImpl;
}(AbstractRangeImpl_1.AbstractRangeImpl));
exports.StaticRangeImpl = StaticRangeImpl;
//# sourceMappingURL=StaticRangeImpl.js.map