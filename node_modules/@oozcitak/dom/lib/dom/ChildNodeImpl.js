"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var algorithm_1 = require("../algorithm");
/**
 * Represents a mixin that extends child nodes that can have siblings
 * including doctypes. This mixin is implemented by {@link Element},
 * {@link CharacterData} and {@link DocumentType}.
 */
var ChildNodeImpl = /** @class */ (function () {
    function ChildNodeImpl() {
    }
    /** @inheritdoc */
    ChildNodeImpl.prototype.before = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        /**
         * 1. Let parent be context object’s parent.
         * 2. If parent is null, then return.
         */
        var context = util_1.Cast.asNode(this);
        var parent = context._parent;
        if (parent === null)
            return;
        /**
         * 3. Let viablePreviousSibling be context object’s first preceding
         * sibling not in nodes, and null otherwise.
         */
        var viablePreviousSibling = context._previousSibling;
        var flag = true;
        while (flag && viablePreviousSibling) {
            flag = false;
            for (var i = 0; i < nodes.length; i++) {
                var child = nodes[i];
                if (child === viablePreviousSibling) {
                    viablePreviousSibling = viablePreviousSibling._previousSibling;
                    flag = true;
                    break;
                }
            }
        }
        /**
         * 4. Let node be the result of converting nodes into a node, given nodes
         * and context object’s node document.
         */
        var node = algorithm_1.parentNode_convertNodesIntoANode(nodes, context._nodeDocument);
        /**
         * 5. If viablePreviousSibling is null, set it to parent’s first child,
         * and to viablePreviousSibling’s next sibling otherwise.
         */
        if (viablePreviousSibling === null)
            viablePreviousSibling = parent._firstChild;
        else
            viablePreviousSibling = viablePreviousSibling._nextSibling;
        /**
         * 6. Pre-insert node into parent before viablePreviousSibling.
         */
        algorithm_1.mutation_preInsert(node, parent, viablePreviousSibling);
    };
    /** @inheritdoc */
    ChildNodeImpl.prototype.after = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        /**
         * 1. Let parent be context object’s parent.
         * 2. If parent is null, then return.
         */
        var context = util_1.Cast.asNode(this);
        var parent = context._parent;
        if (!parent)
            return;
        /**
         * 3. Let viableNextSibling be context object’s first following sibling not
         * in nodes, and null otherwise.
         */
        var viableNextSibling = context._nextSibling;
        var flag = true;
        while (flag && viableNextSibling) {
            flag = false;
            for (var i = 0; i < nodes.length; i++) {
                var child = nodes[i];
                if (child === viableNextSibling) {
                    viableNextSibling = viableNextSibling._nextSibling;
                    flag = true;
                    break;
                }
            }
        }
        /**
         * 4. Let node be the result of converting nodes into a node, given nodes
         * and context object’s node document.
         */
        var node = algorithm_1.parentNode_convertNodesIntoANode(nodes, context._nodeDocument);
        /**
         * 5. Pre-insert node into parent before viableNextSibling.
         */
        algorithm_1.mutation_preInsert(node, parent, viableNextSibling);
    };
    /** @inheritdoc */
    ChildNodeImpl.prototype.replaceWith = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        /**
         * 1. Let parent be context object’s parent.
         * 2. If parent is null, then return.
         */
        var context = util_1.Cast.asNode(this);
        var parent = context._parent;
        if (!parent)
            return;
        /**
         * 3. Let viableNextSibling be context object’s first following sibling not
         * in nodes, and null otherwise.
         */
        var viableNextSibling = context._nextSibling;
        var flag = true;
        while (flag && viableNextSibling) {
            flag = false;
            for (var i = 0; i < nodes.length; i++) {
                var child = nodes[i];
                if (child === viableNextSibling) {
                    viableNextSibling = viableNextSibling._nextSibling;
                    flag = true;
                    break;
                }
            }
        }
        /**
         * 4. Let node be the result of converting nodes into a node, given nodes
         * and context object’s node document.
         */
        var node = algorithm_1.parentNode_convertNodesIntoANode(nodes, context._nodeDocument);
        /**
         * 5. If context object’s parent is parent, replace the context object with
         * node within parent.
         * _Note:_ Context object could have been inserted into node.
         * 6. Otherwise, pre-insert node into parent before viableNextSibling.
         */
        if (context._parent === parent)
            algorithm_1.mutation_replace(context, node, parent);
        else
            algorithm_1.mutation_preInsert(node, parent, viableNextSibling);
    };
    /** @inheritdoc */
    ChildNodeImpl.prototype.remove = function () {
        /**
         * 1. If context object’s parent is null, then return.
         * 2. Remove the context object from context object’s parent.
         */
        var context = util_1.Cast.asNode(this);
        var parent = context._parent;
        if (!parent)
            return;
        algorithm_1.mutation_remove(context, parent);
    };
    return ChildNodeImpl;
}());
exports.ChildNodeImpl = ChildNodeImpl;
//# sourceMappingURL=ChildNodeImpl.js.map