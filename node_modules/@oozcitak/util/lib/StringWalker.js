"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Walks through the code points of a string.
 */
var StringWalker = /** @class */ (function () {
    /**
     * Initializes a new `StringWalker`.
     *
     * @param input - input string
     */
    function StringWalker(input) {
        this._pointer = 0;
        this._chars = Array.from(input);
        this._length = this._chars.length;
    }
    Object.defineProperty(StringWalker.prototype, "eof", {
        /**
         * Determines if the current position is beyond the end of string.
         */
        get: function () { return this._pointer >= this._length; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StringWalker.prototype, "length", {
        /**
         * Returns the number of code points in the input string.
         */
        get: function () { return this._length; },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the current code point. Returns `-1` if the position is beyond
     * the end of string.
     */
    StringWalker.prototype.codePoint = function () {
        if (this._codePoint === undefined) {
            if (this.eof) {
                this._codePoint = -1;
            }
            else {
                var cp = this._chars[this._pointer].codePointAt(0);
                /* istanbul ignore else */
                if (cp !== undefined) {
                    this._codePoint = cp;
                }
                else {
                    this._codePoint = -1;
                }
            }
        }
        return this._codePoint;
    };
    /**
     * Returns the current character. Returns an empty string if the position is
     * beyond the end of string.
     */
    StringWalker.prototype.c = function () {
        if (this._c === undefined) {
            this._c = (this.eof ? "" : this._chars[this._pointer]);
        }
        return this._c;
    };
    /**
     * Returns the remaining string.
     */
    StringWalker.prototype.remaining = function () {
        if (this._remaining === undefined) {
            this._remaining = (this.eof ?
                "" : this._chars.slice(this._pointer + 1).join(''));
        }
        return this._remaining;
    };
    /**
     * Returns the substring from the current character to the end of string.
     */
    StringWalker.prototype.substring = function () {
        if (this._substring === undefined) {
            this._substring = (this.eof ?
                "" : this._chars.slice(this._pointer).join(''));
        }
        return this._substring;
    };
    Object.defineProperty(StringWalker.prototype, "pointer", {
        /**
         * Gets or sets the current position.
         */
        get: function () { return this._pointer; },
        set: function (val) {
            if (val === this._pointer)
                return;
            this._pointer = val;
            this._codePoint = undefined;
            this._c = undefined;
            this._remaining = undefined;
            this._substring = undefined;
        },
        enumerable: true,
        configurable: true
    });
    return StringWalker;
}());
exports.StringWalker = StringWalker;
//# sourceMappingURL=StringWalker.js.map