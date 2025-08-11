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
var EventTargetImpl_1 = require("./EventTargetImpl");
var algorithm_1 = require("../algorithm");
/**
 * Represents a signal object that communicates with a DOM request and abort
 * it through an AbortController.
 */
var AbortSignalImpl = /** @class */ (function (_super) {
    __extends(AbortSignalImpl, _super);
    /**
     * Initializes a new instance of `AbortSignal`.
     */
    function AbortSignalImpl() {
        var _this = _super.call(this) || this;
        _this._abortedFlag = false;
        _this._abortAlgorithms = new Set();
        return _this;
    }
    Object.defineProperty(AbortSignalImpl.prototype, "aborted", {
        /** @inheritdoc */
        get: function () { return this._abortedFlag; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbortSignalImpl.prototype, "onabort", {
        /** @inheritdoc */
        get: function () {
            return algorithm_1.event_getterEventHandlerIDLAttribute(this, "onabort");
        },
        set: function (val) {
            algorithm_1.event_setterEventHandlerIDLAttribute(this, "onabort", val);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a new `AbortSignal`.
     */
    AbortSignalImpl._create = function () {
        return new AbortSignalImpl();
    };
    return AbortSignalImpl;
}(EventTargetImpl_1.EventTargetImpl));
exports.AbortSignalImpl = AbortSignalImpl;
//# sourceMappingURL=AbortSignalImpl.js.map