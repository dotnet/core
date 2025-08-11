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
 * Serializes XML nodes into a JSON string.
 */
var JSONWriter = /** @class */ (function (_super) {
    __extends(JSONWriter, _super);
    /**
     * Initializes a new instance of `JSONWriter`.
     *
     * @param builderOptions - XML builder options
     * @param writerOptions - serialization options
     */
    function JSONWriter(builderOptions, writerOptions) {
        var _this = _super.call(this, builderOptions) || this;
        // provide default options
        _this._writerOptions = util_1.applyDefaults(writerOptions, {
            wellFormed: false,
            prettyPrint: false,
            indent: '  ',
            newline: '\n',
            offset: 0,
            group: false,
            verbose: false
        });
        return _this;
    }
    /**
     * Produces an XML serialization of the given node.
     *
     * @param node - node to serialize
     * @param writerOptions - serialization options
     */
    JSONWriter.prototype.serialize = function (node) {
        // convert to object
        var objectWriterOptions = util_1.applyDefaults(this._writerOptions, {
            format: "object",
            wellFormed: false
        });
        var objectWriter = new ObjectWriter_1.ObjectWriter(this._builderOptions, objectWriterOptions);
        var val = objectWriter.serialize(node);
        // recursively convert object into JSON string
        return this._beginLine(this._writerOptions, 0) + this._convertObject(val, this._writerOptions);
    };
    /**
     * Produces an XML serialization of the given object.
     *
     * @param obj - object to serialize
     * @param options - serialization options
     * @param level - depth of the XML tree
     */
    JSONWriter.prototype._convertObject = function (obj, options, level) {
        var e_1, _a;
        var _this = this;
        if (level === void 0) { level = 0; }
        var markup = '';
        var isLeaf = this._isLeafNode(obj);
        if (util_1.isArray(obj)) {
            markup += '[';
            var len = obj.length;
            var i = 0;
            try {
                for (var obj_1 = __values(obj), obj_1_1 = obj_1.next(); !obj_1_1.done; obj_1_1 = obj_1.next()) {
                    var val = obj_1_1.value;
                    markup += this._endLine(options, level + 1) +
                        this._beginLine(options, level + 1) +
                        this._convertObject(val, options, level + 1);
                    if (i < len - 1) {
                        markup += ',';
                    }
                    i++;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (obj_1_1 && !obj_1_1.done && (_a = obj_1.return)) _a.call(obj_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            markup += this._endLine(options, level) + this._beginLine(options, level);
            markup += ']';
        }
        else if (util_1.isObject(obj)) {
            markup += '{';
            var len_1 = util_1.objectLength(obj);
            var i_1 = 0;
            util_1.forEachObject(obj, function (key, val) {
                if (isLeaf && options.prettyPrint) {
                    markup += ' ';
                }
                else {
                    markup += _this._endLine(options, level + 1) + _this._beginLine(options, level + 1);
                }
                markup += _this._key(key);
                if (options.prettyPrint) {
                    markup += ' ';
                }
                markup += _this._convertObject(val, options, level + 1);
                if (i_1 < len_1 - 1) {
                    markup += ',';
                }
                i_1++;
            }, this);
            if (isLeaf && options.prettyPrint) {
                markup += ' ';
            }
            else {
                markup += this._endLine(options, level) + this._beginLine(options, level);
            }
            markup += '}';
        }
        else {
            markup += this._val(obj);
        }
        return markup;
    };
    /**
     * Produces characters to be prepended to a line of string in pretty-print
     * mode.
     *
     * @param options - serialization options
     * @param level - current depth of the XML tree
     */
    JSONWriter.prototype._beginLine = function (options, level) {
        if (!options.prettyPrint) {
            return '';
        }
        else {
            var indentLevel = options.offset + level + 1;
            if (indentLevel > 0) {
                return new Array(indentLevel).join(options.indent);
            }
        }
        return '';
    };
    /**
     * Produces characters to be appended to a line of string in pretty-print
     * mode.
     *
     * @param options - serialization options
     * @param level - current depth of the XML tree
     */
    JSONWriter.prototype._endLine = function (options, level) {
        if (!options.prettyPrint) {
            return '';
        }
        else {
            return options.newline;
        }
    };
    /**
     * Produces a JSON key string delimited with double quotes.
     */
    JSONWriter.prototype._key = function (key) {
        return "\"" + key + "\":";
    };
    /**
     * Produces a JSON value string delimited with double quotes.
     */
    JSONWriter.prototype._val = function (val) {
        return JSON.stringify(val);
    };
    /**
     * Determines if an object is a leaf node.
     *
     * @param obj
     */
    JSONWriter.prototype._isLeafNode = function (obj) {
        return this._descendantCount(obj) <= 1;
    };
    /**
     * Counts the number of descendants of the given object.
     *
     * @param obj
     * @param count
     */
    JSONWriter.prototype._descendantCount = function (obj, count) {
        var _this = this;
        if (count === void 0) { count = 0; }
        if (util_1.isArray(obj)) {
            util_1.forEachArray(obj, function (val) { return count += _this._descendantCount(val, count); }, this);
        }
        else if (util_1.isObject(obj)) {
            util_1.forEachObject(obj, function (key, val) { return count += _this._descendantCount(val, count); }, this);
        }
        else {
            count++;
        }
        return count;
    };
    return JSONWriter;
}(BaseWriter_1.BaseWriter));
exports.JSONWriter = JSONWriter;
//# sourceMappingURL=JSONWriter.js.map