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
var util_1 = require("@oozcitak/util");
var BaseReader_1 = require("./BaseReader");
/**
 * Parses XML nodes from objects and arrays.
 * ES6 maps and sets are also supoorted.
 */
var ObjectReader = /** @class */ (function (_super) {
    __extends(ObjectReader, _super);
    function ObjectReader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Parses the given document representation.
     *
     * @param node - node receive parsed XML nodes
     * @param obj - object to parse
     */
    ObjectReader.prototype._parse = function (node, obj) {
        var _this = this;
        var options = this._builderOptions;
        var lastChild = null;
        if (util_1.isFunction(obj)) {
            // evaluate if function
            lastChild = this.parse(node, obj.apply(this));
        }
        else if (util_1.isArray(obj) || util_1.isSet(obj)) {
            util_1.forEachArray(obj, function (item) { return lastChild = _this.parse(node, item); }, this);
        }
        else if (util_1.isMap(obj) || util_1.isObject(obj)) {
            // expand if object
            util_1.forEachObject(obj, function (key, val) {
                if (util_1.isFunction(val)) {
                    // evaluate if function
                    val = val.apply(_this);
                }
                if (!options.ignoreConverters && key.indexOf(options.convert.att) === 0) {
                    // assign attributes
                    if (key === options.convert.att) {
                        if (util_1.isArray(val) || util_1.isSet(val)) {
                            throw new Error("Invalid attribute: " + val.toString() + ". " + node._debugInfo());
                        }
                        else /* if (isMap(val) || isObject(val)) */ {
                            util_1.forEachObject(val, function (attrKey, attrVal) {
                                lastChild = _this.attribute(node, undefined, _this.sanitize(attrKey), _this._decodeAttributeValue(_this.sanitize(attrVal))) || lastChild;
                            });
                        }
                    }
                    else {
                        lastChild = _this.attribute(node, undefined, _this.sanitize(key.substr(options.convert.att.length)), _this._decodeAttributeValue(_this.sanitize(val))) || lastChild;
                    }
                }
                else if (!options.ignoreConverters && key.indexOf(options.convert.text) === 0) {
                    // text node
                    if (util_1.isMap(val) || util_1.isObject(val)) {
                        // if the key is #text expand child nodes under this node to support mixed content
                        lastChild = _this.parse(node, val);
                    }
                    else {
                        lastChild = _this.text(node, _this._decodeText(_this.sanitize(val))) || lastChild;
                    }
                }
                else if (!options.ignoreConverters && key.indexOf(options.convert.cdata) === 0) {
                    // cdata node
                    if (util_1.isArray(val) || util_1.isSet(val)) {
                        util_1.forEachArray(val, function (item) { return lastChild = _this.cdata(node, _this.sanitize(item)) || lastChild; }, _this);
                    }
                    else {
                        lastChild = _this.cdata(node, _this.sanitize(val)) || lastChild;
                    }
                }
                else if (!options.ignoreConverters && key.indexOf(options.convert.comment) === 0) {
                    // comment node
                    if (util_1.isArray(val) || util_1.isSet(val)) {
                        util_1.forEachArray(val, function (item) { return lastChild = _this.comment(node, _this.sanitize(item)) || lastChild; }, _this);
                    }
                    else {
                        lastChild = _this.comment(node, _this.sanitize(val)) || lastChild;
                    }
                }
                else if (!options.ignoreConverters && key.indexOf(options.convert.ins) === 0) {
                    // processing instruction
                    if (util_1.isString(val)) {
                        var insIndex = val.indexOf(' ');
                        var insTarget = (insIndex === -1 ? val : val.substr(0, insIndex));
                        var insValue = (insIndex === -1 ? '' : val.substr(insIndex + 1));
                        lastChild = _this.instruction(node, _this.sanitize(insTarget), _this.sanitize(insValue)) || lastChild;
                    }
                    else if (util_1.isArray(val) || util_1.isSet(val)) {
                        util_1.forEachArray(val, function (item) {
                            var insIndex = item.indexOf(' ');
                            var insTarget = (insIndex === -1 ? item : item.substr(0, insIndex));
                            var insValue = (insIndex === -1 ? '' : item.substr(insIndex + 1));
                            lastChild = _this.instruction(node, _this.sanitize(insTarget), _this.sanitize(insValue)) || lastChild;
                        }, _this);
                    }
                    else /* if (isMap(target) || isObject(target)) */ {
                        util_1.forEachObject(val, function (insTarget, insValue) { return lastChild = _this.instruction(node, _this.sanitize(insTarget), _this.sanitize(insValue)) || lastChild; }, _this);
                    }
                }
                else if ((util_1.isArray(val) || util_1.isSet(val)) && util_1.isEmpty(val)) {
                    // skip empty arrays
                }
                else if ((util_1.isMap(val) || util_1.isObject(val)) && util_1.isEmpty(val)) {
                    // empty objects produce one node
                    lastChild = _this.element(node, undefined, _this.sanitize(key)) || lastChild;
                }
                else if (!options.keepNullNodes && (val == null)) {
                    // skip null and undefined nodes
                }
                else if (util_1.isArray(val) || util_1.isSet(val)) {
                    // expand list by creating child nodes
                    util_1.forEachArray(val, function (item) {
                        var childNode = {};
                        childNode[key] = item;
                        lastChild = _this.parse(node, childNode);
                    }, _this);
                }
                else if (util_1.isMap(val) || util_1.isObject(val)) {
                    // create a parent node
                    var parent = _this.element(node, undefined, _this.sanitize(key));
                    if (parent) {
                        lastChild = parent;
                        // expand child nodes under parent
                        _this.parse(parent, val);
                    }
                }
                else if (val != null && val !== '') {
                    // leaf element node with a single text node
                    var parent = _this.element(node, undefined, _this.sanitize(key));
                    if (parent) {
                        lastChild = parent;
                        _this.text(parent, _this._decodeText(_this.sanitize(val)));
                    }
                }
                else {
                    // leaf element node
                    lastChild = _this.element(node, undefined, _this.sanitize(key)) || lastChild;
                }
            }, this);
        }
        else if (!options.keepNullNodes && (obj == null)) {
            // skip null and undefined nodes
        }
        else {
            // text node
            lastChild = this.text(node, this._decodeText(this.sanitize(obj))) || lastChild;
        }
        return lastChild || node;
    };
    return ObjectReader;
}(BaseReader_1.BaseReader));
exports.ObjectReader = ObjectReader;
//# sourceMappingURL=ObjectReader.js.map