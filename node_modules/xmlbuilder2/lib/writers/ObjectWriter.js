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
var util_1 = require("@oozcitak/util");
var interfaces_1 = require("@oozcitak/dom/lib/dom/interfaces");
var BaseWriter_1 = require("./BaseWriter");
/**
 * Serializes XML nodes into objects and arrays.
 */
var ObjectWriter = /** @class */ (function (_super) {
    __extends(ObjectWriter, _super);
    /**
     * Initializes a new instance of `ObjectWriter`.
     *
     * @param builderOptions - XML builder options
     * @param writerOptions - serialization options
     */
    function ObjectWriter(builderOptions, writerOptions) {
        var _this = _super.call(this, builderOptions) || this;
        _this._writerOptions = util_1.applyDefaults(writerOptions, {
            format: "object",
            wellFormed: false,
            group: false,
            verbose: false
        });
        return _this;
    }
    /**
     * Produces an XML serialization of the given node.
     *
     * @param node - node to serialize
     */
    ObjectWriter.prototype.serialize = function (node) {
        this._currentList = [];
        this._currentIndex = 0;
        this._listRegister = [this._currentList];
        /**
         * First pass, serialize nodes
         * This creates a list of nodes grouped under node types while preserving
         * insertion order. For example:
         * [
         *   root: [
         *     node: [
         *       { "@" : { "att1": "val1", "att2": "val2" }
         *       { "#": "node text" }
         *       { childNode: [] }
         *       { "#": "more text" }
         *     ],
         *     node: [
         *       { "@" : { "att": "val" }
         *       { "#": [ "text line1", "text line2" ] }
         *     ]
         *   ]
         * ]
         */
        this.serializeNode(node, this._writerOptions.wellFormed);
        /**
         * Second pass, process node lists. Above example becomes:
         * {
         *   root: {
         *     node: [
         *       {
         *         "@att1": "val1",
         *         "@att2": "val2",
         *         "#1": "node text",
         *         childNode: {},
         *         "#2": "more text"
         *       },
         *       {
         *         "@att": "val",
         *         "#": [ "text line1", "text line2" ]
         *       }
         *     ]
         *   }
         * }
         */
        return this._process(this._currentList, this._writerOptions);
    };
    ObjectWriter.prototype._process = function (items, options) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (items.length === 0)
            return {};
        // determine if there are non-unique element names
        var namesSeen = {};
        var hasNonUniqueNames = false;
        var textCount = 0;
        var commentCount = 0;
        var instructionCount = 0;
        var cdataCount = 0;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var key = Object.keys(item)[0];
            switch (key) {
                case "@":
                    continue;
                case "#":
                    textCount++;
                    break;
                case "!":
                    commentCount++;
                    break;
                case "?":
                    instructionCount++;
                    break;
                case "$":
                    cdataCount++;
                    break;
                default:
                    if (namesSeen[key]) {
                        hasNonUniqueNames = true;
                    }
                    else {
                        namesSeen[key] = true;
                    }
                    break;
            }
        }
        var defAttrKey = this._getAttrKey();
        var defTextKey = this._getNodeKey(interfaces_1.NodeType.Text);
        var defCommentKey = this._getNodeKey(interfaces_1.NodeType.Comment);
        var defInstructionKey = this._getNodeKey(interfaces_1.NodeType.ProcessingInstruction);
        var defCdataKey = this._getNodeKey(interfaces_1.NodeType.CData);
        if (textCount === 1 && items.length === 1 && util_1.isString(items[0]["#"])) {
            // special case of an element node with a single text node
            return items[0]["#"];
        }
        else if (hasNonUniqueNames) {
            var obj = {};
            // process attributes first
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var key = Object.keys(item)[0];
                if (key === "@") {
                    var attrs = item["@"];
                    var attrKeys = Object.keys(attrs);
                    if (attrKeys.length === 1) {
                        obj[defAttrKey + attrKeys[0]] = attrs[attrKeys[0]];
                    }
                    else {
                        obj[defAttrKey] = item["@"];
                    }
                }
            }
            // list contains element nodes with non-unique names
            // return an array with mixed content notation
            var result = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var key = Object.keys(item)[0];
                switch (key) {
                    case "@":
                        // attributes were processed above
                        break;
                    case "#":
                        result.push((_a = {}, _a[defTextKey] = item["#"], _a));
                        break;
                    case "!":
                        result.push((_b = {}, _b[defCommentKey] = item["!"], _b));
                        break;
                    case "?":
                        result.push((_c = {}, _c[defInstructionKey] = item["?"], _c));
                        break;
                    case "$":
                        result.push((_d = {}, _d[defCdataKey] = item["$"], _d));
                        break;
                    default:
                        // element node
                        var ele = item;
                        if (ele[key].length !== 0 && util_1.isArray(ele[key][0])) {
                            // group of element nodes
                            var eleGroup = [];
                            var listOfLists = ele[key];
                            for (var i_1 = 0; i_1 < listOfLists.length; i_1++) {
                                eleGroup.push(this._process(listOfLists[i_1], options));
                            }
                            result.push((_e = {}, _e[key] = eleGroup, _e));
                        }
                        else {
                            // single element node
                            if (options.verbose) {
                                result.push((_f = {}, _f[key] = [this._process(ele[key], options)], _f));
                            }
                            else {
                                result.push((_g = {}, _g[key] = this._process(ele[key], options), _g));
                            }
                        }
                        break;
                }
            }
            obj[defTextKey] = result;
            return obj;
        }
        else {
            // all element nodes have unique names
            // return an object while prefixing data node keys
            var textId = 1;
            var commentId = 1;
            var instructionId = 1;
            var cdataId = 1;
            var obj = {};
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var key = Object.keys(item)[0];
                switch (key) {
                    case "@":
                        var attrs = item["@"];
                        var attrKeys = Object.keys(attrs);
                        if (!options.group || attrKeys.length === 1) {
                            for (var attrName in attrs) {
                                obj[defAttrKey + attrName] = attrs[attrName];
                            }
                        }
                        else {
                            obj[defAttrKey] = attrs;
                        }
                        break;
                    case "#":
                        textId = this._processSpecItem(item["#"], obj, options.group, defTextKey, textCount, textId);
                        break;
                    case "!":
                        commentId = this._processSpecItem(item["!"], obj, options.group, defCommentKey, commentCount, commentId);
                        break;
                    case "?":
                        instructionId = this._processSpecItem(item["?"], obj, options.group, defInstructionKey, instructionCount, instructionId);
                        break;
                    case "$":
                        cdataId = this._processSpecItem(item["$"], obj, options.group, defCdataKey, cdataCount, cdataId);
                        break;
                    default:
                        // element node
                        var ele = item;
                        if (ele[key].length !== 0 && util_1.isArray(ele[key][0])) {
                            // group of element nodes
                            var eleGroup = [];
                            var listOfLists = ele[key];
                            for (var i_2 = 0; i_2 < listOfLists.length; i_2++) {
                                eleGroup.push(this._process(listOfLists[i_2], options));
                            }
                            obj[key] = eleGroup;
                        }
                        else {
                            // single element node
                            if (options.verbose) {
                                obj[key] = [this._process(ele[key], options)];
                            }
                            else {
                                obj[key] = this._process(ele[key], options);
                            }
                        }
                        break;
                }
            }
            return obj;
        }
    };
    ObjectWriter.prototype._processSpecItem = function (item, obj, group, defKey, count, id) {
        var e_1, _a;
        if (!group && util_1.isArray(item) && count + item.length > 2) {
            try {
                for (var item_1 = __values(item), item_1_1 = item_1.next(); !item_1_1.done; item_1_1 = item_1.next()) {
                    var subItem = item_1_1.value;
                    var key = defKey + (id++).toString();
                    obj[key] = subItem;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (item_1_1 && !item_1_1.done && (_a = item_1.return)) _a.call(item_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else {
            var key = count > 1 ? defKey + (id++).toString() : defKey;
            obj[key] = item;
        }
        return id;
    };
    /** @inheritdoc */
    ObjectWriter.prototype.beginElement = function (name) {
        var _a, _b;
        var childItems = [];
        if (this._currentList.length === 0) {
            this._currentList.push((_a = {}, _a[name] = childItems, _a));
        }
        else {
            var lastItem = this._currentList[this._currentList.length - 1];
            if (this._isElementNode(lastItem, name)) {
                if (lastItem[name].length !== 0 && util_1.isArray(lastItem[name][0])) {
                    var listOfLists = lastItem[name];
                    listOfLists.push(childItems);
                }
                else {
                    lastItem[name] = [lastItem[name], childItems];
                }
            }
            else {
                this._currentList.push((_b = {}, _b[name] = childItems, _b));
            }
        }
        this._currentIndex++;
        if (this._listRegister.length > this._currentIndex) {
            this._listRegister[this._currentIndex] = childItems;
        }
        else {
            this._listRegister.push(childItems);
        }
        this._currentList = childItems;
    };
    /** @inheritdoc */
    ObjectWriter.prototype.endElement = function () {
        this._currentList = this._listRegister[--this._currentIndex];
    };
    /** @inheritdoc */
    ObjectWriter.prototype.attribute = function (name, value) {
        var _a, _b;
        if (this._currentList.length === 0) {
            this._currentList.push({ "@": (_a = {}, _a[name] = value, _a) });
        }
        else {
            var lastItem = this._currentList[this._currentList.length - 1];
            /* istanbul ignore else */
            if (this._isAttrNode(lastItem)) {
                lastItem["@"][name] = value;
            }
            else {
                this._currentList.push({ "@": (_b = {}, _b[name] = value, _b) });
            }
        }
    };
    /** @inheritdoc */
    ObjectWriter.prototype.comment = function (data) {
        if (this._currentList.length === 0) {
            this._currentList.push({ "!": data });
        }
        else {
            var lastItem = this._currentList[this._currentList.length - 1];
            if (this._isCommentNode(lastItem)) {
                if (util_1.isArray(lastItem["!"])) {
                    lastItem["!"].push(data);
                }
                else {
                    lastItem["!"] = [lastItem["!"], data];
                }
            }
            else {
                this._currentList.push({ "!": data });
            }
        }
    };
    /** @inheritdoc */
    ObjectWriter.prototype.text = function (data) {
        if (this._currentList.length === 0) {
            this._currentList.push({ "#": data });
        }
        else {
            var lastItem = this._currentList[this._currentList.length - 1];
            if (this._isTextNode(lastItem)) {
                if (util_1.isArray(lastItem["#"])) {
                    lastItem["#"].push(data);
                }
                else {
                    lastItem["#"] = [lastItem["#"], data];
                }
            }
            else {
                this._currentList.push({ "#": data });
            }
        }
    };
    /** @inheritdoc */
    ObjectWriter.prototype.instruction = function (target, data) {
        var value = (data === "" ? target : target + " " + data);
        if (this._currentList.length === 0) {
            this._currentList.push({ "?": value });
        }
        else {
            var lastItem = this._currentList[this._currentList.length - 1];
            if (this._isInstructionNode(lastItem)) {
                if (util_1.isArray(lastItem["?"])) {
                    lastItem["?"].push(value);
                }
                else {
                    lastItem["?"] = [lastItem["?"], value];
                }
            }
            else {
                this._currentList.push({ "?": value });
            }
        }
    };
    /** @inheritdoc */
    ObjectWriter.prototype.cdata = function (data) {
        if (this._currentList.length === 0) {
            this._currentList.push({ "$": data });
        }
        else {
            var lastItem = this._currentList[this._currentList.length - 1];
            if (this._isCDATANode(lastItem)) {
                if (util_1.isArray(lastItem["$"])) {
                    lastItem["$"].push(data);
                }
                else {
                    lastItem["$"] = [lastItem["$"], data];
                }
            }
            else {
                this._currentList.push({ "$": data });
            }
        }
    };
    ObjectWriter.prototype._isAttrNode = function (x) {
        return "@" in x;
    };
    ObjectWriter.prototype._isTextNode = function (x) {
        return "#" in x;
    };
    ObjectWriter.prototype._isCommentNode = function (x) {
        return "!" in x;
    };
    ObjectWriter.prototype._isInstructionNode = function (x) {
        return "?" in x;
    };
    ObjectWriter.prototype._isCDATANode = function (x) {
        return "$" in x;
    };
    ObjectWriter.prototype._isElementNode = function (x, name) {
        return name in x;
    };
    /**
     * Returns an object key for an attribute or namespace declaration.
     */
    ObjectWriter.prototype._getAttrKey = function () {
        return this._builderOptions.convert.att;
    };
    /**
     * Returns an object key for the given node type.
     *
     * @param nodeType - node type to get a key for
     */
    ObjectWriter.prototype._getNodeKey = function (nodeType) {
        switch (nodeType) {
            case interfaces_1.NodeType.Comment:
                return this._builderOptions.convert.comment;
            case interfaces_1.NodeType.Text:
                return this._builderOptions.convert.text;
            case interfaces_1.NodeType.ProcessingInstruction:
                return this._builderOptions.convert.ins;
            case interfaces_1.NodeType.CData:
                return this._builderOptions.convert.cdata;
            /* istanbul ignore next */
            default:
                throw new Error("Invalid node type.");
        }
    };
    return ObjectWriter;
}(BaseWriter_1.BaseWriter));
exports.ObjectWriter = ObjectWriter;
//# sourceMappingURL=ObjectWriter.js.map