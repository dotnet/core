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
var NodeImpl_1 = require("./NodeImpl");
var algorithm_1 = require("../algorithm");
/**
 * Represents a generic text node.
 */
var CharacterDataImpl = /** @class */ (function (_super) {
    __extends(CharacterDataImpl, _super);
    /**
     * Initializes a new instance of `CharacterData`.
     *
     * @param data - the text content
     */
    function CharacterDataImpl(data) {
        var _this = _super.call(this) || this;
        _this._data = data;
        return _this;
    }
    Object.defineProperty(CharacterDataImpl.prototype, "data", {
        /** @inheritdoc */
        get: function () { return this._data; },
        set: function (value) {
            algorithm_1.characterData_replaceData(this, 0, this._data.length, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CharacterDataImpl.prototype, "length", {
        /** @inheritdoc */
        get: function () { return this._data.length; },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    CharacterDataImpl.prototype.substringData = function (offset, count) {
        /**
         * The substringData(offset, count) method, when invoked, must return the
         * result of running substring data with node context object, offset offset, and count count.
         */
        return algorithm_1.characterData_substringData(this, offset, count);
    };
    /** @inheritdoc */
    CharacterDataImpl.prototype.appendData = function (data) {
        /**
         * The appendData(data) method, when invoked, must replace data with node
         * context object, offset context object’s length, count 0, and data data.
         */
        return algorithm_1.characterData_replaceData(this, this._data.length, 0, data);
    };
    /** @inheritdoc */
    CharacterDataImpl.prototype.insertData = function (offset, data) {
        /**
         * The insertData(offset, data) method, when invoked, must replace data with
         * node context object, offset offset, count 0, and data data.
         */
        algorithm_1.characterData_replaceData(this, offset, 0, data);
    };
    /** @inheritdoc */
    CharacterDataImpl.prototype.deleteData = function (offset, count) {
        /**
         * The deleteData(offset, count) method, when invoked, must replace data
         * with node context object, offset offset, count count, and data the
         * empty string.
         */
        algorithm_1.characterData_replaceData(this, offset, count, '');
    };
    /** @inheritdoc */
    CharacterDataImpl.prototype.replaceData = function (offset, count, data) {
        /**
         * The replaceData(offset, count, data) method, when invoked, must replace
         * data with node context object, offset offset, count count, and data data.
         */
        algorithm_1.characterData_replaceData(this, offset, count, data);
    };
    Object.defineProperty(CharacterDataImpl.prototype, "previousElementSibling", {
        // MIXIN: NonDocumentTypeChildNode
        /* istanbul ignore next */
        get: function () { throw new Error("Mixin: NonDocumentTypeChildNode not implemented."); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CharacterDataImpl.prototype, "nextElementSibling", {
        /* istanbul ignore next */
        get: function () { throw new Error("Mixin: NonDocumentTypeChildNode not implemented."); },
        enumerable: true,
        configurable: true
    });
    // MIXIN: ChildNode
    /* istanbul ignore next */
    CharacterDataImpl.prototype.before = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        throw new Error("Mixin: ChildNode not implemented.");
    };
    /* istanbul ignore next */
    CharacterDataImpl.prototype.after = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        throw new Error("Mixin: ChildNode not implemented.");
    };
    /* istanbul ignore next */
    CharacterDataImpl.prototype.replaceWith = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        throw new Error("Mixin: ChildNode not implemented.");
    };
    /* istanbul ignore next */
    CharacterDataImpl.prototype.remove = function () { throw new Error("Mixin: ChildNode not implemented."); };
    return CharacterDataImpl;
}(NodeImpl_1.NodeImpl));
exports.CharacterDataImpl = CharacterDataImpl;
//# sourceMappingURL=CharacterDataImpl.js.map