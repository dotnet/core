"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
/**
 * Represents a mixin that extends child nodes that can have siblings
 * other than doctypes. This mixin is implemented by {@link Element} and
 * {@link CharacterData}.
 */
var NonDocumentTypeChildNodeImpl = /** @class */ (function () {
    function NonDocumentTypeChildNodeImpl() {
    }
    Object.defineProperty(NonDocumentTypeChildNodeImpl.prototype, "previousElementSibling", {
        /** @inheritdoc */
        get: function () {
            /**
             * The previousElementSibling attribute’s getter must return the first
             * preceding sibling that is an element, and null otherwise.
             */
            var node = util_1.Cast.asNode(this)._previousSibling;
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
    Object.defineProperty(NonDocumentTypeChildNodeImpl.prototype, "nextElementSibling", {
        /** @inheritdoc */
        get: function () {
            /**
             * The nextElementSibling attribute’s getter must return the first
             * following sibling that is an element, and null otherwise.
             */
            var node = util_1.Cast.asNode(this)._nextSibling;
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
    return NonDocumentTypeChildNodeImpl;
}());
exports.NonDocumentTypeChildNodeImpl = NonDocumentTypeChildNodeImpl;
//# sourceMappingURL=NonDocumentTypeChildNodeImpl.js.map