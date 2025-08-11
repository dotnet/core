"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents a mutation record.
 */
var MutationRecordImpl = /** @class */ (function () {
    /**
     * Initializes a new instance of `MutationRecord`.
     *
     * @param type - type of mutation: `"attributes"` for an attribute
     * mutation, `"characterData"` for a mutation to a CharacterData node
     * and `"childList"` for a mutation to the tree of nodes.
     * @param target - node affected by the mutation.
     * @param addedNodes - list of added nodes.
     * @param removedNodes - list of removed nodes.
     * @param previousSibling - previous sibling of added or removed nodes.
     * @param nextSibling - next sibling of added or removed nodes.
     * @param attributeName - local name of the changed attribute,
     * and `null` otherwise.
     * @param attributeNamespace - namespace of the changed attribute,
     * and `null` otherwise.
     * @param oldValue - value before mutation: attribute value for an attribute
     * mutation, node `data` for a mutation to a CharacterData node and `null`
     * for a mutation to the tree of nodes.
     */
    function MutationRecordImpl(type, target, addedNodes, removedNodes, previousSibling, nextSibling, attributeName, attributeNamespace, oldValue) {
        this._type = type;
        this._target = target;
        this._addedNodes = addedNodes;
        this._removedNodes = removedNodes;
        this._previousSibling = previousSibling;
        this._nextSibling = nextSibling;
        this._attributeName = attributeName;
        this._attributeNamespace = attributeNamespace;
        this._oldValue = oldValue;
    }
    Object.defineProperty(MutationRecordImpl.prototype, "type", {
        /** @inheritdoc */
        get: function () { return this._type; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MutationRecordImpl.prototype, "target", {
        /** @inheritdoc */
        get: function () { return this._target; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MutationRecordImpl.prototype, "addedNodes", {
        /** @inheritdoc */
        get: function () { return this._addedNodes; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MutationRecordImpl.prototype, "removedNodes", {
        /** @inheritdoc */
        get: function () { return this._removedNodes; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MutationRecordImpl.prototype, "previousSibling", {
        /** @inheritdoc */
        get: function () { return this._previousSibling; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MutationRecordImpl.prototype, "nextSibling", {
        /** @inheritdoc */
        get: function () { return this._nextSibling; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MutationRecordImpl.prototype, "attributeName", {
        /** @inheritdoc */
        get: function () { return this._attributeName; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MutationRecordImpl.prototype, "attributeNamespace", {
        /** @inheritdoc */
        get: function () { return this._attributeNamespace; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MutationRecordImpl.prototype, "oldValue", {
        /** @inheritdoc */
        get: function () { return this._oldValue; },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a new `MutationRecord`.
     *
     * @param type - type of mutation: `"attributes"` for an attribute
     * mutation, `"characterData"` for a mutation to a CharacterData node
     * and `"childList"` for a mutation to the tree of nodes.
     * @param target - node affected by the mutation.
     * @param addedNodes - list of added nodes.
     * @param removedNodes - list of removed nodes.
     * @param previousSibling - previous sibling of added or removed nodes.
     * @param nextSibling - next sibling of added or removed nodes.
     * @param attributeName - local name of the changed attribute,
     * and `null` otherwise.
     * @param attributeNamespace - namespace of the changed attribute,
     * and `null` otherwise.
     * @param oldValue - value before mutation: attribute value for an attribute
     * mutation, node `data` for a mutation to a CharacterData node and `null`
     * for a mutation to the tree of nodes.
     */
    MutationRecordImpl._create = function (type, target, addedNodes, removedNodes, previousSibling, nextSibling, attributeName, attributeNamespace, oldValue) {
        return new MutationRecordImpl(type, target, addedNodes, removedNodes, previousSibling, nextSibling, attributeName, attributeNamespace, oldValue);
    };
    return MutationRecordImpl;
}());
exports.MutationRecordImpl = MutationRecordImpl;
//# sourceMappingURL=MutationRecordImpl.js.map