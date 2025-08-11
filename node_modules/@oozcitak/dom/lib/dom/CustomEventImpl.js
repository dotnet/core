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
var EventImpl_1 = require("./EventImpl");
var algorithm_1 = require("../algorithm");
/**
 * Represents and event that carries custom data.
 */
var CustomEventImpl = /** @class */ (function (_super) {
    __extends(CustomEventImpl, _super);
    /**
     * Initializes a new instance of `CustomEvent`.
     */
    function CustomEventImpl(type, eventInit) {
        var _this = _super.call(this, type, eventInit) || this;
        _this._detail = null;
        _this._detail = (eventInit && eventInit.detail) || null;
        return _this;
    }
    Object.defineProperty(CustomEventImpl.prototype, "detail", {
        /** @inheritdoc */
        get: function () { return this._detail; },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    CustomEventImpl.prototype.initCustomEvent = function (type, bubbles, cancelable, detail) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        if (detail === void 0) { detail = null; }
        /**
         * 1. If the context object’s dispatch flag is set, then return.
         */
        if (this._dispatchFlag)
            return;
        /**
         * 2. Initialize the context object with type, bubbles, and cancelable.
         */
        algorithm_1.event_initialize(this, type, bubbles, cancelable);
        /**
         * 3. Set the context object’s detail attribute to detail.
         */
        this._detail = detail;
    };
    return CustomEventImpl;
}(EventImpl_1.EventImpl));
exports.CustomEventImpl = CustomEventImpl;
//# sourceMappingURL=CustomEventImpl.js.map