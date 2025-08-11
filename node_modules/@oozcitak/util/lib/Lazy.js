"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents an object with lazy initialization.
 */
var Lazy = /** @class */ (function () {
    /**
     * Initializes a new instance of `Lazy`.
     *
     * @param initFunc - initializer function
     */
    function Lazy(initFunc) {
        this._initialized = false;
        this._value = undefined;
        this._initFunc = initFunc;
    }
    Object.defineProperty(Lazy.prototype, "value", {
        /**
         * Gets the value of the object.
         */
        get: function () {
            if (!this._initialized) {
                this._value = this._initFunc();
                this._initialized = true;
            }
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return Lazy;
}());
exports.Lazy = Lazy;
//# sourceMappingURL=Lazy.js.map