"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Pre-serializes XML nodes.
 */
var BaseCBWriter = /** @class */ (function () {
    /**
     * Initializes a new instance of `BaseCBWriter`.
     *
     * @param builderOptions - XML builder options
     */
    function BaseCBWriter(builderOptions) {
        /**
         * Gets the current depth of the XML tree.
         */
        this.level = 0;
        this._builderOptions = builderOptions;
        this._writerOptions = builderOptions;
    }
    return BaseCBWriter;
}());
exports.BaseCBWriter = BaseCBWriter;
//# sourceMappingURL=BaseCBWriter.js.map