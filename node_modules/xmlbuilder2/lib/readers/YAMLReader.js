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
var js_yaml_1 = require("js-yaml");
/**
 * Parses XML nodes from a YAML string.
 */
var YAMLReader = /** @class */ (function (_super) {
    __extends(YAMLReader, _super);
    function YAMLReader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Parses the given document representation.
     *
     * @param node - node receive parsed XML nodes
     * @param str - YAML string to parse
     */
    YAMLReader.prototype._parse = function (node, str) {
        var result = js_yaml_1.safeLoad(str);
        /* istanbul ignore next */
        if (result === undefined) {
            throw new Error("Unable to parse YAML document.");
        }
        return new ObjectReader_1.ObjectReader(this._builderOptions).parse(node, result);
    };
    return YAMLReader;
}(BaseReader_1.BaseReader));
exports.YAMLReader = YAMLReader;
//# sourceMappingURL=YAMLReader.js.map