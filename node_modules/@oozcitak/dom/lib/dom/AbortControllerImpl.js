"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var algorithm_1 = require("../algorithm");
/**
 * Represents a controller that allows to abort DOM requests.
 */
var AbortControllerImpl = /** @class */ (function () {
    /**
     * Initializes a new instance of `AbortController`.
     */
    function AbortControllerImpl() {
        /**
         * 1. Let signal be a new AbortSignal object.
         * 2. Let controller be a new AbortController object whose signal is signal.
         * 3. Return controller.
         */
        this._signal = algorithm_1.create_abortSignal();
    }
    Object.defineProperty(AbortControllerImpl.prototype, "signal", {
        /** @inheritdoc */
        get: function () { return this._signal; },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    AbortControllerImpl.prototype.abort = function () {
        algorithm_1.abort_signalAbort(this._signal);
    };
    return AbortControllerImpl;
}());
exports.AbortControllerImpl = AbortControllerImpl;
//# sourceMappingURL=AbortControllerImpl.js.map