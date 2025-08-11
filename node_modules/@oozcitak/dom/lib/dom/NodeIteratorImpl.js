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
var TraverserImpl_1 = require("./TraverserImpl");
var algorithm_1 = require("../algorithm");
/**
 * Represents an object which can be used to iterate through the nodes
 * of a subtree.
 */
var NodeIteratorImpl = /** @class */ (function (_super) {
    __extends(NodeIteratorImpl, _super);
    /**
     * Initializes a new instance of `NodeIterator`.
     */
    function NodeIteratorImpl(root, reference, pointerBeforeReference) {
        var _this = _super.call(this, root) || this;
        _this._iteratorCollection = undefined;
        _this._reference = reference;
        _this._pointerBeforeReference = pointerBeforeReference;
        algorithm_1.nodeIterator_iteratorList().add(_this);
        return _this;
    }
    Object.defineProperty(NodeIteratorImpl.prototype, "referenceNode", {
        /** @inheritdoc */
        get: function () { return this._reference; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NodeIteratorImpl.prototype, "pointerBeforeReferenceNode", {
        /** @inheritdoc */
        get: function () { return this._pointerBeforeReference; },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    NodeIteratorImpl.prototype.nextNode = function () {
        /**
         * The nextNode() method, when invoked, must return the result of
         * traversing with the context object and next.
         */
        return algorithm_1.nodeIterator_traverse(this, true);
    };
    /** @inheritdoc */
    NodeIteratorImpl.prototype.previousNode = function () {
        /**
         * The previousNode() method, when invoked, must return the result of
         * traversing with the context object and previous.
         */
        return algorithm_1.nodeIterator_traverse(this, false);
    };
    /** @inheritdoc */
    NodeIteratorImpl.prototype.detach = function () {
        /**
         * The detach() method, when invoked, must do nothing.
         *
         * since JS lacks weak references, we still use detach
         */
        algorithm_1.nodeIterator_iteratorList().delete(this);
    };
    /**
     * Creates a new `NodeIterator`.
     *
     * @param root - iterator's root node
     * @param reference - reference node
     * @param pointerBeforeReference - whether the iterator is before or after the
     * reference node
     */
    NodeIteratorImpl._create = function (root, reference, pointerBeforeReference) {
        return new NodeIteratorImpl(root, reference, pointerBeforeReference);
    };
    return NodeIteratorImpl;
}(TraverserImpl_1.TraverserImpl));
exports.NodeIteratorImpl = NodeIteratorImpl;
//# sourceMappingURL=NodeIteratorImpl.js.map