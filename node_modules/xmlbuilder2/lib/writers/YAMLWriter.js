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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectWriter_1 = require("./ObjectWriter");
var util_1 = require("@oozcitak/util");
var BaseWriter_1 = require("./BaseWriter");
/**
 * Serializes XML nodes into a YAML string.
 */
var YAMLWriter = /** @class */ (function (_super) {
    __extends(YAMLWriter, _super);
    /**
     * Initializes a new instance of `YAMLWriter`.
     *
     * @param builderOptions - XML builder options
     * @param writerOptions - serialization options
     */
    function YAMLWriter(builderOptions, writerOptions) {
        var _this = _super.call(this, builderOptions) || this;
        // provide default options
        _this._writerOptions = util_1.applyDefaults(writerOptions, {
            wellFormed: false,
            indent: '  ',
            newline: '\n',
            offset: 0,
            group: false,
            verbose: false
        });
        if (_this._writerOptions.indent.length < 2) {
            throw new Error("YAML indententation string must be at least two characters long.");
        }
        if (_this._writerOptions.offset < 0) {
            throw new Error("YAML offset should be zero or a positive number.");
        }
        return _this;
    }
    /**
     * Produces an XML serialization of the given node.
     *
     * @param node - node to serialize
     * @param writerOptions - serialization options
     */
    YAMLWriter.prototype.serialize = function (node) {
        // convert to object
        var objectWriterOptions = util_1.applyDefaults(this._writerOptions, {
            format: "object",
            wellFormed: false
        });
        var objectWriter = new ObjectWriter_1.ObjectWriter(this._builderOptions, objectWriterOptions);
        var val = objectWriter.serialize(node);
        var markup = this._beginLine(this._writerOptions, 0) + '---' + this._endLine(this._writerOptions) +
            this._convertObject(val, this._writerOptions, 0);
        // remove trailing newline
        /* istanbul ignore else */
        if (markup.slice(-this._writerOptions.newline.length) === this._writerOptions.newline) {
            markup = markup.slice(0, -this._writerOptions.newline.length);
        }
        return markup;
    };
    /**
     * Produces an XML serialization of the given object.
     *
     * @param obj - object to serialize
     * @param options - serialization options
     * @param level - depth of the XML tree
     * @param indentLeaf - indents leaf nodes
     */
    YAMLWriter.prototype._convertObject = function (obj, options, level, suppressIndent) {
        var e_1, _a;
        var _this = this;
        if (suppressIndent === void 0) { suppressIndent = false; }
        var markup = '';
        if (util_1.isArray(obj)) {
            try {
                for (var obj_1 = __values(obj), obj_1_1 = obj_1.next(); !obj_1_1.done; obj_1_1 = obj_1.next()) {
                    var val = obj_1_1.value;
                    markup += this._beginLine(options, level, true);
                    if (!util_1.isObject(val)) {
                        markup += this._val(val) + this._endLine(options);
                    }
                    else if (util_1.isEmpty(val)) {
                        markup += '""' + this._endLine(options);
                    }
                    else {
                        markup += this._convertObject(val, options, level, true);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (obj_1_1 && !obj_1_1.done && (_a = obj_1.return)) _a.call(obj_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else /* if (isObject(obj)) */ {
            util_1.forEachObject(obj, function (key, val) {
                if (suppressIndent) {
                    markup += _this._key(key);
                    suppressIndent = false;
                }
                else {
                    markup += _this._beginLine(options, level) + _this._key(key);
                }
                if (!util_1.isObject(val)) {
                    markup += ' ' + _this._val(val) + _this._endLine(options);
                }
                else if (util_1.isEmpty(val)) {
                    markup += ' ""' + _this._endLine(options);
                }
                else {
                    markup += _this._endLine(options) +
                        _this._convertObject(val, options, level + 1);
                }
            }, this);
        }
        return markup;
    };
    /**
     * Produces characters to be prepended to a line of string in pretty-print
     * mode.
     *
     * @param options - serialization options
     * @param level - current depth of the XML tree
     * @param isArray - whether this line is an array item
     */
    YAMLWriter.prototype._beginLine = function (options, level, isArray) {
        if (isArray === void 0) { isArray = false; }
        var indentLevel = options.offset + level + 1;
        var chars = new Array(indentLevel).join(options.indent);
        if (isArray) {
            return chars.substr(0, chars.length - 2) + '-' + chars.substr(-1, 1);
        }
        else {
            return chars;
        }
    };
    /**
     * Produces characters to be appended to a line of string in pretty-print
     * mode.
     *
     * @param options - serialization options
     */
    YAMLWriter.prototype._endLine = function (options) {
        return options.newline;
    };
    /**
     * Produces a YAML key string delimited with double quotes.
     */
    YAMLWriter.prototype._key = function (key) {
        return "\"" + key + "\":";
    };
    /**
     * Produces a YAML value string delimited with double quotes.
     */
    YAMLWriter.prototype._val = function (val) {
        return JSON.stringify(val);
    };
    return YAMLWriter;
}(BaseWriter_1.BaseWriter));
exports.YAMLWriter = YAMLWriter;
//# sourceMappingURL=YAMLWriter.js.map