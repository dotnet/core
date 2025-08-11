"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Guard_1 = require("./Guard");
/**
 * Contains type casts for DOM objects.
 */
var Cast = /** @class */ (function () {
    function Cast() {
    }
    /**
     * Casts the given object to a `Node`.
     *
     * @param a - the object to cast
     */
    Cast.asNode = function (a) {
        if (Guard_1.Guard.isNode(a)) {
            return a;
        }
        else {
            throw new Error("Invalid object. Node expected.");
        }
    };
    return Cast;
}());
exports.Cast = Cast;
//# sourceMappingURL=Cast.js.map