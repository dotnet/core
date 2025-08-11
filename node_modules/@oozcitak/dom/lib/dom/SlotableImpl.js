"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var algorithm_1 = require("../algorithm");
/**
 * Represents a mixin that allows nodes to become the contents of
 * a <slot> element. This mixin is implemented by {@link Element} and
 * {@link Text}.
 */
var SlotableImpl = /** @class */ (function () {
    function SlotableImpl() {
    }
    Object.defineProperty(SlotableImpl.prototype, "_name", {
        get: function () { return this.__name || ''; },
        set: function (val) { this.__name = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SlotableImpl.prototype, "_assignedSlot", {
        get: function () { return this.__assignedSlot || null; },
        set: function (val) { this.__assignedSlot = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SlotableImpl.prototype, "assignedSlot", {
        /** @inheritdoc */
        get: function () {
            return algorithm_1.shadowTree_findASlot(this, true);
        },
        enumerable: true,
        configurable: true
    });
    return SlotableImpl;
}());
exports.SlotableImpl = SlotableImpl;
//# sourceMappingURL=SlotableImpl.js.map