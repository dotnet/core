"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var infra_1 = require("@oozcitak/infra");
var algorithm_1 = require("../algorithm");
var util_1 = require("../util");
var util_2 = require("@oozcitak/util");
/**
 * Represents a collection of elements.
 */
var HTMLCollectionImpl = /** @class */ (function () {
    /**
     * Initializes a new instance of `HTMLCollection`.
     *
     * @param root - root node
     * @param filter - node filter
     */
    function HTMLCollectionImpl(root, filter) {
        this._live = true;
        this._root = root;
        this._filter = filter;
        return new Proxy(this, this);
    }
    Object.defineProperty(HTMLCollectionImpl.prototype, "length", {
        /** @inheritdoc */
        get: function () {
            var _this = this;
            /**
             * The length attribute’s getter must return the number of nodes
             * represented by the collection.
             */
            var count = 0;
            var node = algorithm_1.tree_getFirstDescendantNode(this._root, false, false, function (e) { return util_1.Guard.isElementNode(e) && _this._filter(e); });
            while (node !== null) {
                count++;
                node = algorithm_1.tree_getNextDescendantNode(this._root, node, false, false, function (e) { return util_1.Guard.isElementNode(e) && _this._filter(e); });
            }
            return count;
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    HTMLCollectionImpl.prototype.item = function (index) {
        var _this = this;
        /**
         * The item(index) method, when invoked, must return the indexth element
         * in the collection. If there is no indexth element in the collection,
         * then the method must return null.
         */
        var i = 0;
        var node = algorithm_1.tree_getFirstDescendantNode(this._root, false, false, function (e) { return util_1.Guard.isElementNode(e) && _this._filter(e); });
        while (node !== null) {
            if (i === index)
                return node;
            else
                i++;
            node = algorithm_1.tree_getNextDescendantNode(this._root, node, false, false, function (e) { return util_1.Guard.isElementNode(e) && _this._filter(e); });
        }
        return null;
    };
    /** @inheritdoc */
    HTMLCollectionImpl.prototype.namedItem = function (key) {
        var _this = this;
        /**
         * 1. If key is the empty string, return null.
         * 2. Return the first element in the collection for which at least one of
         * the following is true:
         * - it has an ID which is key;
         * - it is in the HTML namespace and has a name attribute whose value is key;
         * or null if there is no such element.
         */
        if (key === '')
            return null;
        var ele = algorithm_1.tree_getFirstDescendantNode(this._root, false, false, function (e) { return util_1.Guard.isElementNode(e) && _this._filter(e); });
        while (ele != null) {
            if (ele._uniqueIdentifier === key) {
                return ele;
            }
            else if (ele._namespace === infra_1.namespace.HTML) {
                for (var i = 0; i < ele._attributeList.length; i++) {
                    var attr = ele._attributeList[i];
                    if (attr._localName === "name" && attr._namespace === null &&
                        attr._namespacePrefix === null && attr._value === key)
                        return ele;
                }
            }
            ele = algorithm_1.tree_getNextDescendantNode(this._root, ele, false, false, function (e) { return util_1.Guard.isElementNode(e) && _this._filter(e); });
        }
        return null;
    };
    /** @inheritdoc */
    HTMLCollectionImpl.prototype[Symbol.iterator] = function () {
        var root = this._root;
        var filter = this._filter;
        var currentNode = algorithm_1.tree_getFirstDescendantNode(root, false, false, function (e) { return util_1.Guard.isElementNode(e) && filter(e); });
        return {
            next: function () {
                if (currentNode === null) {
                    return { done: true, value: null };
                }
                else {
                    var result = { done: false, value: currentNode };
                    currentNode = algorithm_1.tree_getNextDescendantNode(root, currentNode, false, false, function (e) { return util_1.Guard.isElementNode(e) && filter(e); });
                    return result;
                }
            }
        };
    };
    /**
     * Implements a proxy get trap to provide array-like access.
     */
    HTMLCollectionImpl.prototype.get = function (target, key, receiver) {
        if (!util_2.isString(key) || HTMLCollectionImpl.reservedNames.indexOf(key) !== -1) {
            return Reflect.get(target, key, receiver);
        }
        var index = Number(key);
        if (isNaN(index)) {
            return target.namedItem(key) || undefined;
        }
        else {
            return target.item(index) || undefined;
        }
    };
    /**
     * Implements a proxy set trap to provide array-like access.
     */
    HTMLCollectionImpl.prototype.set = function (target, key, value, receiver) {
        if (!util_2.isString(key) || HTMLCollectionImpl.reservedNames.indexOf(key) !== -1) {
            return Reflect.set(target, key, value, receiver);
        }
        var index = Number(key);
        var node = isNaN(index) ?
            target.namedItem(key) || undefined : target.item(index) || undefined;
        if (node && node._parent) {
            algorithm_1.mutation_replace(node, value, node._parent);
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Creates a new `HTMLCollection`.
     *
     * @param root - root node
     * @param filter - node filter
     */
    HTMLCollectionImpl._create = function (root, filter) {
        if (filter === void 0) { filter = (function () { return true; }); }
        return new HTMLCollectionImpl(root, filter);
    };
    HTMLCollectionImpl.reservedNames = ['_root', '_live', '_filter', 'length',
        'item', 'namedItem', 'get', 'set'];
    return HTMLCollectionImpl;
}());
exports.HTMLCollectionImpl = HTMLCollectionImpl;
//# sourceMappingURL=HTMLCollectionImpl.js.map