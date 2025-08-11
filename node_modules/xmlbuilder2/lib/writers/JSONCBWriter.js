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
var BaseCBWriter_1 = require("./BaseCBWriter");
/**
 * Serializes XML nodes.
 */
var JSONCBWriter = /** @class */ (function (_super) {
    __extends(JSONCBWriter, _super);
    /**
     * Initializes a new instance of `JSONCBWriter`.
     *
     * @param builderOptions - XML builder options
     */
    function JSONCBWriter(builderOptions) {
        var _this = _super.call(this, builderOptions) || this;
        _this._hasChildren = [];
        _this._additionalLevel = 0;
        return _this;
    }
    /** @inheritdoc */
    JSONCBWriter.prototype.frontMatter = function () {
        return "";
    };
    /** @inheritdoc */
    JSONCBWriter.prototype.declaration = function (version, encoding, standalone) {
        return "";
    };
    /** @inheritdoc */
    JSONCBWriter.prototype.docType = function (name, publicId, systemId) {
        return "";
    };
    /** @inheritdoc */
    JSONCBWriter.prototype.comment = function (data) {
        // { "!": "hello" }
        return this._comma() + this._beginLine() + "{" + this._sep() +
            this._key(this._builderOptions.convert.comment) + this._sep() +
            this._val(data) + this._sep() + "}";
    };
    /** @inheritdoc */
    JSONCBWriter.prototype.text = function (data) {
        // { "#": "hello" }
        return this._comma() + this._beginLine() + "{" + this._sep() +
            this._key(this._builderOptions.convert.text) + this._sep() +
            this._val(data) + this._sep() + "}";
    };
    /** @inheritdoc */
    JSONCBWriter.prototype.instruction = function (target, data) {
        // { "?": "target hello" }
        return this._comma() + this._beginLine() + "{" + this._sep() +
            this._key(this._builderOptions.convert.ins) + this._sep() +
            this._val(data ? target + " " + data : target) + this._sep() + "}";
    };
    /** @inheritdoc */
    JSONCBWriter.prototype.cdata = function (data) {
        // { "$": "hello" }
        return this._comma() + this._beginLine() + "{" + this._sep() +
            this._key(this._builderOptions.convert.cdata) + this._sep() +
            this._val(data) + this._sep() + "}";
    };
    /** @inheritdoc */
    JSONCBWriter.prototype.attribute = function (name, value) {
        // { "@name": "val" }
        return this._comma() + this._beginLine(1) + "{" + this._sep() +
            this._key(this._builderOptions.convert.att + name) + this._sep() +
            this._val(value) + this._sep() + "}";
    };
    /** @inheritdoc */
    JSONCBWriter.prototype.openTagBegin = function (name) {
        // { "node": { "#": [
        var str = this._comma() + this._beginLine() + "{" + this._sep() + this._key(name) + this._sep() + "{";
        this._additionalLevel++;
        this.hasData = true;
        str += this._beginLine() + this._key(this._builderOptions.convert.text) + this._sep() + "[";
        this._hasChildren.push(false);
        return str;
    };
    /** @inheritdoc */
    JSONCBWriter.prototype.openTagEnd = function (name, selfClosing, voidElement) {
        if (selfClosing) {
            var str = this._sep() + "]";
            this._additionalLevel--;
            str += this._beginLine() + "}" + this._sep() + "}";
            return str;
        }
        else {
            return "";
        }
    };
    /** @inheritdoc */
    JSONCBWriter.prototype.closeTag = function (name) {
        // ] } }
        var str = this._beginLine() + "]";
        this._additionalLevel--;
        str += this._beginLine() + "}" + this._sep() + "}";
        return str;
    };
    /** @inheritdoc */
    JSONCBWriter.prototype.beginElement = function (name) { };
    /** @inheritdoc */
    JSONCBWriter.prototype.endElement = function (name) { this._hasChildren.pop(); };
    /**
     * Produces characters to be prepended to a line of string in pretty-print
     * mode.
     */
    JSONCBWriter.prototype._beginLine = function (additionalOffset) {
        if (additionalOffset === void 0) { additionalOffset = 0; }
        if (this._writerOptions.prettyPrint) {
            return (this.hasData ? this._writerOptions.newline : "") +
                this._indent(this._writerOptions.offset + this.level + additionalOffset);
        }
        else {
            return "";
        }
    };
    /**
     * Produces an indentation string.
     *
     * @param level - depth of the tree
     */
    JSONCBWriter.prototype._indent = function (level) {
        if (level + this._additionalLevel <= 0) {
            return "";
        }
        else {
            return this._writerOptions.indent.repeat(level + this._additionalLevel);
        }
    };
    /**
     * Produces a comma before a child node if it has previous siblings.
     */
    JSONCBWriter.prototype._comma = function () {
        var str = (this._hasChildren[this._hasChildren.length - 1] ? "," : "");
        if (this._hasChildren.length > 0) {
            this._hasChildren[this._hasChildren.length - 1] = true;
        }
        return str;
    };
    /**
     * Produces a separator string.
     */
    JSONCBWriter.prototype._sep = function () {
        return (this._writerOptions.prettyPrint ? " " : "");
    };
    /**
     * Produces a JSON key string delimited with double quotes.
     */
    JSONCBWriter.prototype._key = function (key) {
        return "\"" + key + "\":";
    };
    /**
     * Produces a JSON value string delimited with double quotes.
     */
    JSONCBWriter.prototype._val = function (val) {
        return JSON.stringify(val);
    };
    return JSONCBWriter;
}(BaseCBWriter_1.BaseCBWriter));
exports.JSONCBWriter = JSONCBWriter;
//# sourceMappingURL=JSONCBWriter.js.map