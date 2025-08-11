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
var YAMLCBWriter = /** @class */ (function (_super) {
    __extends(YAMLCBWriter, _super);
    /**
     * Initializes a new instance of `BaseCBWriter`.
     *
     * @param builderOptions - XML builder options
     */
    function YAMLCBWriter(builderOptions) {
        var _this = _super.call(this, builderOptions) || this;
        _this._rootWritten = false;
        _this._additionalLevel = 0;
        if (builderOptions.indent.length < 2) {
            throw new Error("YAML indententation string must be at least two characters long.");
        }
        if (builderOptions.offset < 0) {
            throw new Error("YAML offset should be zero or a positive number.");
        }
        return _this;
    }
    /** @inheritdoc */
    YAMLCBWriter.prototype.frontMatter = function () {
        return this._beginLine() + "---";
    };
    /** @inheritdoc */
    YAMLCBWriter.prototype.declaration = function (version, encoding, standalone) {
        return "";
    };
    /** @inheritdoc */
    YAMLCBWriter.prototype.docType = function (name, publicId, systemId) {
        return "";
    };
    /** @inheritdoc */
    YAMLCBWriter.prototype.comment = function (data) {
        // "!": "hello"
        return this._beginLine() +
            this._key(this._builderOptions.convert.comment) + " " +
            this._val(data);
    };
    /** @inheritdoc */
    YAMLCBWriter.prototype.text = function (data) {
        // "#": "hello"
        return this._beginLine() +
            this._key(this._builderOptions.convert.text) + " " +
            this._val(data);
    };
    /** @inheritdoc */
    YAMLCBWriter.prototype.instruction = function (target, data) {
        // "?": "target hello"
        return this._beginLine() +
            this._key(this._builderOptions.convert.ins) + " " +
            this._val(data ? target + " " + data : target);
    };
    /** @inheritdoc */
    YAMLCBWriter.prototype.cdata = function (data) {
        // "$": "hello"
        return this._beginLine() +
            this._key(this._builderOptions.convert.cdata) + " " +
            this._val(data);
    };
    /** @inheritdoc */
    YAMLCBWriter.prototype.attribute = function (name, value) {
        // "@name": "val"
        this._additionalLevel++;
        var str = this._beginLine() +
            this._key(this._builderOptions.convert.att + name) + " " +
            this._val(value);
        this._additionalLevel--;
        return str;
    };
    /** @inheritdoc */
    YAMLCBWriter.prototype.openTagBegin = function (name) {
        // "node":
        //   "#":
        //   -
        var str = this._beginLine() + this._key(name);
        if (!this._rootWritten) {
            this._rootWritten = true;
        }
        this.hasData = true;
        this._additionalLevel++;
        str += this._beginLine(true) + this._key(this._builderOptions.convert.text);
        return str;
    };
    /** @inheritdoc */
    YAMLCBWriter.prototype.openTagEnd = function (name, selfClosing, voidElement) {
        if (selfClosing) {
            return " " + this._val("");
        }
        return "";
    };
    /** @inheritdoc */
    YAMLCBWriter.prototype.closeTag = function (name) {
        this._additionalLevel--;
        return "";
    };
    /** @inheritdoc */
    YAMLCBWriter.prototype.beginElement = function (name) { };
    /** @inheritdoc */
    YAMLCBWriter.prototype.endElement = function (name) { };
    /**
     * Produces characters to be prepended to a line of string in pretty-print
     * mode.
     */
    YAMLCBWriter.prototype._beginLine = function (suppressArray) {
        if (suppressArray === void 0) { suppressArray = false; }
        return (this.hasData ? this._writerOptions.newline : "") +
            this._indent(this._writerOptions.offset + this.level, suppressArray);
    };
    /**
     * Produces an indentation string.
     *
     * @param level - depth of the tree
     * @param suppressArray - whether the suppress array marker
     */
    YAMLCBWriter.prototype._indent = function (level, suppressArray) {
        if (level + this._additionalLevel <= 0) {
            return "";
        }
        else {
            var chars = this._writerOptions.indent.repeat(level + this._additionalLevel);
            if (!suppressArray && this._rootWritten) {
                return chars.substr(0, chars.length - 2) + '-' + chars.substr(-1, 1);
            }
            return chars;
        }
    };
    /**
     * Produces a YAML key string delimited with double quotes.
     */
    YAMLCBWriter.prototype._key = function (key) {
        return "\"" + key + "\":";
    };
    /**
     * Produces a YAML value string delimited with double quotes.
     */
    YAMLCBWriter.prototype._val = function (val) {
        return JSON.stringify(val);
    };
    return YAMLCBWriter;
}(BaseCBWriter_1.BaseCBWriter));
exports.YAMLCBWriter = YAMLCBWriter;
//# sourceMappingURL=YAMLCBWriter.js.map