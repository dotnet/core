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
var ObjectReader_1 = require("./ObjectReader");
var BaseReader_1 = require("./BaseReader");
/**
 * Parses XML nodes from a JSON string.
 */
var JSONReader = /** @class */ (function (_super) {
    __extends(JSONReader, _super);
    function JSONReader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Parses the given document representation.
     *
     * @param node - node receive parsed XML nodes
     * @param str - JSON string to parse
     */
    JSONReader.prototype._parse = function (node, str) {
        return new ObjectReader_1.ObjectReader(this._builderOptions).parse(node, JSON.parse(str));
    };
    return JSONReader;
}(BaseReader_1.BaseReader));
exports.JSONReader = JSONReader;
//# sourceMappingURL=JSONReader.js.map