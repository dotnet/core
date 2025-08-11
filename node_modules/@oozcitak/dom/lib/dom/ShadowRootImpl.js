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
var DocumentFragmentImpl_1 = require("./DocumentFragmentImpl");
var util_1 = require("@oozcitak/util");
var algorithm_1 = require("../algorithm");
/**
 * Represents a shadow root.
 */
var ShadowRootImpl = /** @class */ (function (_super) {
    __extends(ShadowRootImpl, _super);
    /**
     * Initializes a new instance of `ShadowRoot`.
     *
     * @param host - shadow root's host element
     * @param mode - shadow root's mode
     */
    function ShadowRootImpl(host, mode) {
        var _this = _super.call(this) || this;
        _this._host = host;
        _this._mode = mode;
        return _this;
    }
    Object.defineProperty(ShadowRootImpl.prototype, "mode", {
        /** @inheritdoc */
        get: function () { return this._mode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShadowRootImpl.prototype, "host", {
        /** @inheritdoc */
        get: function () { return this._host; },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the parent event target for the given event.
     *
     * @param event - an event
     */
    ShadowRootImpl.prototype._getTheParent = function (event) {
        /**
         * A shadow root’s get the parent algorithm, given an event, returns null
         * if event’s composed flag is unset and shadow root is the root of
         * event’s path’s first struct’s invocation target, and shadow root’s host
         * otherwise.
         */
        if (!event._composedFlag && !util_1.isEmpty(event._path) &&
            algorithm_1.tree_rootNode(event._path[0].invocationTarget) === this) {
            return null;
        }
        else {
            return this._host;
        }
    };
    // MIXIN: DocumentOrShadowRoot
    // No elements
    /**
     * Creates a new `ShadowRoot`.
     *
     * @param document - owner document
     * @param host - shadow root's host element
     */
    ShadowRootImpl._create = function (document, host) {
        return new ShadowRootImpl(host, "closed");
    };
    return ShadowRootImpl;
}(DocumentFragmentImpl_1.DocumentFragmentImpl));
exports.ShadowRootImpl = ShadowRootImpl;
//# sourceMappingURL=ShadowRootImpl.js.map