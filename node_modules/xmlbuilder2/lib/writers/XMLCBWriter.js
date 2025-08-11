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
var XMLCBWriter = /** @class */ (function (_super) {
    __extends(XMLCBWriter, _super);
    /**
     * Initializes a new instance of `XMLCBWriter`.
     *
     * @param builderOptions - XML builder options
     */
    function XMLCBWriter(builderOptions) {
        var _this = _super.call(this, builderOptions) || this;
        _this._lineLength = 0;
        return _this;
    }
    /** @inheritdoc */
    XMLCBWriter.prototype.frontMatter = function () {
        return "";
    };
    /** @inheritdoc */
    XMLCBWriter.prototype.declaration = function (version, encoding, standalone) {
        var markup = this._beginLine() + "<?xml";
        markup += " version=\"" + version + "\"";
        if (encoding !== undefined) {
            markup += " encoding=\"" + encoding + "\"";
        }
        if (standalone !== undefined) {
            markup += " standalone=\"" + (standalone ? "yes" : "no") + "\"";
        }
        markup += "?>";
        return markup;
    };
    /** @inheritdoc */
    XMLCBWriter.prototype.docType = function (name, publicId, systemId) {
        var markup = this._beginLine();
        if (publicId && systemId) {
            markup += "<!DOCTYPE " + name + " PUBLIC \"" + publicId + "\" \"" + systemId + "\">";
        }
        else if (publicId) {
            markup += "<!DOCTYPE " + name + " PUBLIC \"" + publicId + "\">";
        }
        else if (systemId) {
            markup += "<!DOCTYPE " + name + " SYSTEM \"" + systemId + "\">";
        }
        else {
            markup += "<!DOCTYPE " + name + ">";
        }
        return markup;
    };
    /** @inheritdoc */
    XMLCBWriter.prototype.comment = function (data) {
        return this._beginLine() + "<!--" + data + "-->";
    };
    /** @inheritdoc */
    XMLCBWriter.prototype.text = function (data) {
        return this._beginLine() + data;
    };
    /** @inheritdoc */
    XMLCBWriter.prototype.instruction = function (target, data) {
        if (data) {
            return this._beginLine() + "<?" + target + " " + data + "?>";
        }
        else {
            return this._beginLine() + "<?" + target + "?>";
        }
    };
    /** @inheritdoc */
    XMLCBWriter.prototype.cdata = function (data) {
        return this._beginLine() + "<![CDATA[" + data + "]]>";
    };
    /** @inheritdoc */
    XMLCBWriter.prototype.openTagBegin = function (name) {
        this._lineLength += 1 + name.length;
        return this._beginLine() + "<" + name;
    };
    /** @inheritdoc */
    XMLCBWriter.prototype.openTagEnd = function (name, selfClosing, voidElement) {
        if (voidElement) {
            return " />";
        }
        else if (selfClosing) {
            if (this._writerOptions.allowEmptyTags) {
                return "></" + name + ">";
            }
            else if (this._writerOptions.spaceBeforeSlash) {
                return " />";
            }
            else {
                return "/>";
            }
        }
        else {
            return ">";
        }
    };
    /** @inheritdoc */
    XMLCBWriter.prototype.closeTag = function (name) {
        return this._beginLine() + "</" + name + ">";
    };
    /** @inheritdoc */
    XMLCBWriter.prototype.attribute = function (name, value) {
        var str = name + "=\"" + value + "\"";
        if (this._writerOptions.prettyPrint && this._writerOptions.width > 0 &&
            this._lineLength + 1 + str.length > this._writerOptions.width) {
            str = this._beginLine() + this._indent(1) + str;
            this._lineLength = str.length;
            return str;
        }
        else {
            this._lineLength += 1 + str.length;
            return " " + str;
        }
    };
    /** @inheritdoc */
    XMLCBWriter.prototype.beginElement = function (name) { };
    /** @inheritdoc */
    XMLCBWriter.prototype.endElement = function (name) { };
    /**
     * Produces characters to be prepended to a line of string in pretty-print
     * mode.
     */
    XMLCBWriter.prototype._beginLine = function () {
        if (this._writerOptions.prettyPrint) {
            var str = (this.hasData ? this._writerOptions.newline : "") +
                this._indent(this._writerOptions.offset + this.level);
            this._lineLength = str.length;
            return str;
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
    XMLCBWriter.prototype._indent = function (level) {
        if (level <= 0) {
            return "";
        }
        else {
            return this._writerOptions.indent.repeat(level);
        }
    };
    return XMLCBWriter;
}(BaseCBWriter_1.BaseCBWriter));
exports.XMLCBWriter = XMLCBWriter;
//# sourceMappingURL=XMLCBWriter.js.map