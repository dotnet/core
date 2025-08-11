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
var interfaces_1 = require("./interfaces");
var CharacterDataImpl_1 = require("./CharacterDataImpl");
var algorithm_1 = require("../algorithm");
var WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents a text node.
 */
var TextImpl = /** @class */ (function (_super) {
    __extends(TextImpl, _super);
    /**
     * Initializes a new instance of `Text`.
     *
     * @param data - the text content
     */
    function TextImpl(data) {
        if (data === void 0) { data = ''; }
        var _this = _super.call(this, data) || this;
        _this._name = '';
        _this._assignedSlot = null;
        return _this;
    }
    Object.defineProperty(TextImpl.prototype, "wholeText", {
        /** @inheritdoc */
        get: function () {
            var e_1, _a;
            /**
             * The wholeText attribute’s getter must return the concatenation of the
             * data of the contiguous Text nodes of the context object, in tree order.
             */
            var text = '';
            try {
                for (var _b = __values(algorithm_1.text_contiguousTextNodes(this, true)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var node = _c.value;
                    text = text + node._data;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return text;
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    TextImpl.prototype.splitText = function (offset) {
        /**
         * The splitText(offset) method, when invoked, must split context object
         * with offset offset.
         */
        return algorithm_1.text_split(this, offset);
    };
    Object.defineProperty(TextImpl.prototype, "assignedSlot", {
        // MIXIN: Slotable
        /* istanbul ignore next */
        get: function () { throw new Error("Mixin: Slotable not implemented."); },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a `Text`.
     *
     * @param document - owner document
     * @param data - the text content
     */
    TextImpl._create = function (document, data) {
        if (data === void 0) { data = ''; }
        var node = new TextImpl(data);
        node._nodeDocument = document;
        return node;
    };
    return TextImpl;
}(CharacterDataImpl_1.CharacterDataImpl));
exports.TextImpl = TextImpl;
/**
 * Initialize prototype properties
 */
WebIDLAlgorithm_1.idl_defineConst(TextImpl.prototype, "_nodeType", interfaces_1.NodeType.Text);
//# sourceMappingURL=TextImpl.js.map