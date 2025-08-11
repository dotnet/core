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
var util_1 = require("@oozcitak/util");
var ObjectWriter_1 = require("./ObjectWriter");
var BaseWriter_1 = require("./BaseWriter");
/**
 * Serializes XML nodes into ES6 maps and arrays.
 */
var MapWriter = /** @class */ (function (_super) {
    __extends(MapWriter, _super);
    /**
     * Initializes a new instance of `MapWriter`.
     *
     * @param builderOptions - XML builder options
     * @param writerOptions - serialization options
     */
    function MapWriter(builderOptions, writerOptions) {
        var _this = _super.call(this, builderOptions) || this;
        // provide default options
        _this._writerOptions = util_1.applyDefaults(writerOptions, {
            format: "map",
            wellFormed: false,
            group: false,
            verbose: false
        });
        return _this;
    }
    /**
     * Produces an XML serialization of the given node.
     *
     * @param node - node to serialize
     */
    MapWriter.prototype.serialize = function (node) {
        // convert to object
        var objectWriterOptions = util_1.applyDefaults(this._writerOptions, {
            format: "object",
            wellFormed: false,
            verbose: false
        });
        var objectWriter = new ObjectWriter_1.ObjectWriter(this._builderOptions, objectWriterOptions);
        var val = objectWriter.serialize(node);
        // recursively convert object into Map
        return this._convertObject(val);
    };
    /**
     * Recursively converts a JS object into an ES5 map.
     *
     * @param obj - a JS object
     */
    MapWriter.prototype._convertObject = function (obj) {
        if (util_1.isArray(obj)) {
            for (var i = 0; i < obj.length; i++) {
                obj[i] = this._convertObject(obj[i]);
            }
            return obj;
        }
        else if (util_1.isObject(obj)) {
            var map = new Map();
            for (var key in obj) {
                map.set(key, this._convertObject(obj[key]));
            }
            return map;
        }
        else {
            return obj;
        }
    };
    return MapWriter;
}(BaseWriter_1.BaseWriter));
exports.MapWriter = MapWriter;
//# sourceMappingURL=MapWriter.js.map