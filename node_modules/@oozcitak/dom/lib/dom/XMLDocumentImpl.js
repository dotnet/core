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
var DocumentImpl_1 = require("./DocumentImpl");
/**
 * Represents an XML document.
 */
var XMLDocumentImpl = /** @class */ (function (_super) {
    __extends(XMLDocumentImpl, _super);
    /**
     * Initializes a new instance of `XMLDocument`.
     */
    function XMLDocumentImpl() {
        return _super.call(this) || this;
    }
    return XMLDocumentImpl;
}(DocumentImpl_1.DocumentImpl));
exports.XMLDocumentImpl = XMLDocumentImpl;
//# sourceMappingURL=XMLDocumentImpl.js.map