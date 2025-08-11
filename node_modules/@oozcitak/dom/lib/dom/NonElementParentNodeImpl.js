"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var algorithm_1 = require("../algorithm");
/**
 * Represents a mixin that extends non-element parent nodes. This mixin
 * is implemented by {@link Document} and {@link DocumentFragment}.
 */
var NonElementParentNodeImpl = /** @class */ (function () {
    function NonElementParentNodeImpl() {
    }
    /** @inheritdoc */
    NonElementParentNodeImpl.prototype.getElementById = function (id) {
        /**
         * The getElementById(elementId) method, when invoked, must return the first
         * element, in tree order, within the context object’s descendants,
         * whose ID is elementId, and null if there is no such element otherwise.
         */
        var ele = algorithm_1.tree_getFirstDescendantNode(util_1.Cast.asNode(this), false, false, function (e) { return util_1.Guard.isElementNode(e); });
        while (ele !== null) {
            if (ele._uniqueIdentifier === id) {
                return ele;
            }
            ele = algorithm_1.tree_getNextDescendantNode(util_1.Cast.asNode(this), ele, false, false, function (e) { return util_1.Guard.isElementNode(e); });
        }
        return null;
    };
    return NonElementParentNodeImpl;
}());
exports.NonElementParentNodeImpl = NonElementParentNodeImpl;
//# sourceMappingURL=NonElementParentNodeImpl.js.map