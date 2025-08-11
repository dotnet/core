"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var algorithm_1 = require("../algorithm");
/**
 * Represents a mixin that extends parent nodes that can have children.
 * This mixin is implemented by {@link Element}, {@link Document} and
 * {@link DocumentFragment}.
 */
var ParentNodeImpl = /** @class */ (function () {
    function ParentNodeImpl() {
    }
    Object.defineProperty(ParentNodeImpl.prototype, "children", {
        /** @inheritdoc */
        get: function () {
            /**
             * The children attribute’s getter must return an HTMLCollection collection
             * rooted at context object matching only element children.
             */
            return algorithm_1.create_htmlCollection(util_1.Cast.asNode(this));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParentNodeImpl.prototype, "firstElementChild", {
        /** @inheritdoc */
        get: function () {
            /**
             * The firstElementChild attribute’s getter must return the first child
             * that is an element, and null otherwise.
             */
            var node = util_1.Cast.asNode(this)._firstChild;
            while (node) {
                if (util_1.Guard.isElementNode(node))
                    return node;
                else
                    node = node._nextSibling;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParentNodeImpl.prototype, "lastElementChild", {
        /** @inheritdoc */
        get: function () {
            /**
             * The lastElementChild attribute’s getter must return the last child that
             * is an element, and null otherwise.
             */
            var node = util_1.Cast.asNode(this)._lastChild;
            while (node) {
                if (util_1.Guard.isElementNode(node))
                    return node;
                else
                    node = node._previousSibling;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParentNodeImpl.prototype, "childElementCount", {
        /** @inheritdoc */
        get: function () {
            var e_1, _a;
            /**
             * The childElementCount attribute’s getter must return the number of
             * children of context object that are elements.
             */
            var count = 0;
            try {
                for (var _b = __values(util_1.Cast.asNode(this)._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var childNode = _c.value;
                    if (util_1.Guard.isElementNode(childNode))
                        count++;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return count;
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    ParentNodeImpl.prototype.prepend = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        /**
         * 1. Let node be the result of converting nodes into a node given nodes
         * and context object’s node document.
         * 2. Pre-insert node into context object before the context object’s first
         * child.
         */
        var node = util_1.Cast.asNode(this);
        var childNode = algorithm_1.parentNode_convertNodesIntoANode(nodes, node._nodeDocument);
        algorithm_1.mutation_preInsert(childNode, node, node._firstChild);
    };
    /** @inheritdoc */
    ParentNodeImpl.prototype.append = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        /**
         * 1. Let node be the result of converting nodes into a node given nodes
         * and context object’s node document.
         * 2. Append node to context object.
         */
        var node = util_1.Cast.asNode(this);
        var childNode = algorithm_1.parentNode_convertNodesIntoANode(nodes, node._nodeDocument);
        algorithm_1.mutation_append(childNode, node);
    };
    /** @inheritdoc */
    ParentNodeImpl.prototype.querySelector = function (selectors) {
        /**
         * The querySelector(selectors) method, when invoked, must return the first
         * result of running scope-match a selectors string selectors against
         * context object, if the result is not an empty list, and null otherwise.
         */
        var node = util_1.Cast.asNode(this);
        var result = algorithm_1.selectors_scopeMatchASelectorsString(selectors, node);
        return (result.length === 0 ? null : result[0]);
    };
    /** @inheritdoc */
    ParentNodeImpl.prototype.querySelectorAll = function (selectors) {
        /**
         * The querySelectorAll(selectors) method, when invoked, must return the
         * static result of running scope-match a selectors string selectors against
         * context object.
         */
        var node = util_1.Cast.asNode(this);
        var result = algorithm_1.selectors_scopeMatchASelectorsString(selectors, node);
        return algorithm_1.create_nodeListStatic(node, result);
    };
    return ParentNodeImpl;
}());
exports.ParentNodeImpl = ParentNodeImpl;
//# sourceMappingURL=ParentNodeImpl.js.map