"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EmptySet = /** @class */ (function () {
    function EmptySet() {
    }
    Object.defineProperty(EmptySet.prototype, "size", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    EmptySet.prototype.add = function (value) {
        throw new Error("Cannot add to an empty set.");
    };
    EmptySet.prototype.clear = function () {
        // no-op
    };
    EmptySet.prototype.delete = function (value) {
        return false;
    };
    EmptySet.prototype.forEach = function (callbackfn, thisArg) {
        // no-op
    };
    EmptySet.prototype.has = function (value) {
        return false;
    };
    EmptySet.prototype[Symbol.iterator] = function () {
        return new EmptySetIterator();
    };
    EmptySet.prototype.entries = function () {
        return new EmptySetIterator();
    };
    EmptySet.prototype.keys = function () {
        return new EmptySetIterator();
    };
    EmptySet.prototype.values = function () {
        return new EmptySetIterator();
    };
    Object.defineProperty(EmptySet.prototype, Symbol.toStringTag, {
        get: function () {
            return "EmptySet";
        },
        enumerable: true,
        configurable: true
    });
    return EmptySet;
}());
exports.EmptySet = EmptySet;
var EmptySetIterator = /** @class */ (function () {
    function EmptySetIterator() {
    }
    EmptySetIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    EmptySetIterator.prototype.next = function () {
        return { done: true, value: null };
    };
    return EmptySetIterator;
}());
//# sourceMappingURL=EmptySet.js.map