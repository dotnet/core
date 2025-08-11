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
var util_1 = require("@oozcitak/util");
var algorithm_1 = require("../algorithm");
/**
 * Represents a window containing a DOM document.
 */
var WindowImpl = /** @class */ (function (_super) {
    __extends(WindowImpl, _super);
    /**
     * Initializes a new instance of `Window`.
     */
    function WindowImpl() {
        var _this = _super.call(this) || this;
        _this._signalSlots = new Set();
        _this._mutationObserverMicrotaskQueued = false;
        _this._mutationObservers = new Set();
        _this._iteratorList = new util_1.FixedSizeSet();
        _this._associatedDocument = algorithm_1.create_document();
        return _this;
    }
    Object.defineProperty(WindowImpl.prototype, "document", {
        /** @inheritdoc */
        get: function () { return this._associatedDocument; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WindowImpl.prototype, "event", {
        /** @inheritdoc */
        get: function () { return this._currentEvent; },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a new window with a blank document.
     */
    WindowImpl._create = function () {
        return new WindowImpl();
    };
    return WindowImpl;
}(EventTargetImpl_1.EventTargetImpl));
exports.WindowImpl = WindowImpl;
//# sourceMappingURL=WindowImpl.js.map