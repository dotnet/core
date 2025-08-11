"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents an abstract range with a start and end boundary point.
 */
var AbstractRangeImpl = /** @class */ (function () {
    function AbstractRangeImpl() {
    }
    Object.defineProperty(AbstractRangeImpl.prototype, "_startNode", {
        get: function () { return this._start[0]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractRangeImpl.prototype, "_startOffset", {
        get: function () { return this._start[1]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractRangeImpl.prototype, "_endNode", {
        get: function () { return this._end[0]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractRangeImpl.prototype, "_endOffset", {
        get: function () { return this._end[1]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractRangeImpl.prototype, "_collapsed", {
        get: function () {
            return (this._start[0] === this._end[0] &&
                this._start[1] === this._end[1]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractRangeImpl.prototype, "startContainer", {
        /** @inheritdoc */
        get: function () { return this._startNode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractRangeImpl.prototype, "startOffset", {
        /** @inheritdoc */
        get: function () { return this._startOffset; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractRangeImpl.prototype, "endContainer", {
        /** @inheritdoc */
        get: function () { return this._endNode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractRangeImpl.prototype, "endOffset", {
        /** @inheritdoc */
        get: function () { return this._endOffset; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractRangeImpl.prototype, "collapsed", {
        /** @inheritdoc */
        get: function () { return this._collapsed; },
        enumerable: true,
        configurable: true
    });
    return AbstractRangeImpl;
}());
exports.AbstractRangeImpl = AbstractRangeImpl;
//# sourceMappingURL=AbstractRangeImpl.js.map