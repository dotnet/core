"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@oozcitak/util");
var CreateAlgorithm_1 = require("../algorithm/CreateAlgorithm");
/**
 * Represents an object implementing DOM algorithms.
 */
var DOMImpl = /** @class */ (function () {
    /**
     * Initializes a new instance of `DOM`.
     */
    function DOMImpl() {
        this._features = {
            mutationObservers: true,
            customElements: true,
            slots: true,
            steps: true
        };
        this._window = null;
        this._compareCache = new util_1.CompareCache();
        this._rangeList = new util_1.FixedSizeSet();
    }
    /**
     * Sets DOM algorithm features.
     *
     * @param features - DOM features supported by algorithms. All features are
     * enabled by default unless explicity disabled.
     */
    DOMImpl.prototype.setFeatures = function (features) {
        if (features === undefined)
            features = true;
        if (util_1.isObject(features)) {
            for (var key in features) {
                this._features[key] = features[key] || false;
            }
        }
        else {
            // enable/disable all features
            for (var key in this._features) {
                this._features[key] = features;
            }
        }
    };
    Object.defineProperty(DOMImpl.prototype, "features", {
        /**
         * Gets DOM algorithm features.
         */
        get: function () { return this._features; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DOMImpl.prototype, "window", {
        /**
         * Gets the DOM window.
         */
        get: function () {
            if (this._window === null) {
                this._window = CreateAlgorithm_1.create_window();
            }
            return this._window;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DOMImpl.prototype, "compareCache", {
        /**
         * Gets the global node compare cache.
         */
        get: function () { return this._compareCache; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DOMImpl.prototype, "rangeList", {
        /**
         * Gets the global range list.
         */
        get: function () { return this._rangeList; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DOMImpl, "instance", {
        /**
         * Returns the instance of `DOM`.
         */
        get: function () {
            if (!DOMImpl._instance) {
                DOMImpl._instance = new DOMImpl();
            }
            return DOMImpl._instance;
        },
        enumerable: true,
        configurable: true
    });
    return DOMImpl;
}());
/**
 * Represents an object implementing DOM algorithms.
 */
exports.dom = DOMImpl.instance;
//# sourceMappingURL=DOMImpl.js.map