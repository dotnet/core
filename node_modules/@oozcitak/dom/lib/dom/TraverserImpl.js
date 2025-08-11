"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("./interfaces");
/**
 * Represents an object which can be used to iterate through the nodes
 * of a subtree.
 */
var TraverserImpl = /** @class */ (function () {
    /**
     * Initializes a new instance of `Traverser`.
     *
     * @param root - root node
     */
    function TraverserImpl(root) {
        this._activeFlag = false;
        this._root = root;
        this._whatToShow = interfaces_1.WhatToShow.All;
        this._filter = null;
    }
    Object.defineProperty(TraverserImpl.prototype, "root", {
        /** @inheritdoc */
        get: function () { return this._root; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TraverserImpl.prototype, "whatToShow", {
        /** @inheritdoc */
        get: function () { return this._whatToShow; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TraverserImpl.prototype, "filter", {
        /** @inheritdoc */
        get: function () { return this._filter; },
        enumerable: true,
        configurable: true
    });
    return TraverserImpl;
}());
exports.TraverserImpl = TraverserImpl;
//# sourceMappingURL=TraverserImpl.js.map