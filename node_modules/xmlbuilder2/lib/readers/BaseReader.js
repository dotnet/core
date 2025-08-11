"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("../builder/dom");
/**
 * Parses XML nodes.
 */
var BaseReader = /** @class */ (function () {
    /**
     * Initializes a new instance of `BaseReader`.
     *
     * @param builderOptions - XML builder options
     */
    function BaseReader(builderOptions) {
        this._builderOptions = builderOptions;
        if (builderOptions.parser) {
            Object.assign(this, builderOptions.parser);
        }
    }
    BaseReader.prototype._docType = function (parent, name, publicId, systemId) {
        return parent.dtd({ name: name, pubID: publicId, sysID: systemId });
    };
    BaseReader.prototype._comment = function (parent, data) {
        return parent.com(data);
    };
    BaseReader.prototype._text = function (parent, data) {
        return parent.txt(data);
    };
    BaseReader.prototype._instruction = function (parent, target, data) {
        return parent.ins(target, data);
    };
    BaseReader.prototype._cdata = function (parent, data) {
        return parent.dat(data);
    };
    BaseReader.prototype._element = function (parent, namespace, name) {
        return (namespace === undefined ? parent.ele(name) : parent.ele(namespace, name));
    };
    BaseReader.prototype._attribute = function (parent, namespace, name, value) {
        return (namespace === undefined ? parent.att(name, value) : parent.att(namespace, name, value));
    };
    BaseReader.prototype._sanitize = function (str) {
        return dom_1.sanitizeInput(str, this._builderOptions.invalidCharReplacement);
    };
    /**
     * Decodes serialized text.
     *
     * @param text - text value to serialize
     */
    BaseReader.prototype._decodeText = function (text) {
        if (text == null)
            return text;
        return text.replace(/&(quot|amp|apos|lt|gt);/g, function (_match, tag) {
            return BaseReader._entityTable[tag];
        }).replace(/&#(?:x([a-fA-F0-9]+)|([0-9]+));/g, function (_match, hexStr, numStr) {
            return String.fromCodePoint(parseInt(hexStr || numStr, hexStr ? 16 : 10));
        });
    };
    /**
     * Decodes serialized attribute value.
     *
     * @param text - attribute value to serialize
     */
    BaseReader.prototype._decodeAttributeValue = function (text) {
        return this._decodeText(text);
    };
    /**
     * Main parser function which parses the given object and returns an XMLBuilder.
     *
     * @param node - node to recieve parsed content
     * @param obj - object to parse
     */
    BaseReader.prototype.parse = function (node, obj) {
        return this._parse(node, obj);
    };
    /**
     * Creates a DocType node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param name - node name
     * @param publicId - public identifier
     * @param systemId - system identifier
     */
    BaseReader.prototype.docType = function (parent, name, publicId, systemId) {
        return this._docType(parent, name, publicId, systemId);
    };
    /**
     * Creates a comment node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param data - node data
     */
    BaseReader.prototype.comment = function (parent, data) {
        return this._comment(parent, data);
    };
    /**
     * Creates a text node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param data - node data
     */
    BaseReader.prototype.text = function (parent, data) {
        return this._text(parent, data);
    };
    /**
     * Creates a processing instruction node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param target - instruction target
     * @param data - node data
     */
    BaseReader.prototype.instruction = function (parent, target, data) {
        return this._instruction(parent, target, data);
    };
    /**
     * Creates a CData section node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param data - node data
     */
    BaseReader.prototype.cdata = function (parent, data) {
        return this._cdata(parent, data);
    };
    /**
     * Creates an element node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param namespace - node namespace
     * @param name - node name
     */
    BaseReader.prototype.element = function (parent, namespace, name) {
        return this._element(parent, namespace, name);
    };
    /**
     * Creates an attribute or namespace declaration.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param namespace - node namespace
     * @param name - node name
     * @param value - node value
     */
    BaseReader.prototype.attribute = function (parent, namespace, name, value) {
        return this._attribute(parent, namespace, name, value);
    };
    /**
     * Sanitizes input strings.
     *
     * @param str - input string
     */
    BaseReader.prototype.sanitize = function (str) {
        return this._sanitize(str);
    };
    BaseReader._entityTable = {
        "lt": "<",
        "gt": ">",
        "amp": "&",
        "quot": '"',
        "apos": "'",
    };
    return BaseReader;
}());
exports.BaseReader = BaseReader;
//# sourceMappingURL=BaseReader.js.map