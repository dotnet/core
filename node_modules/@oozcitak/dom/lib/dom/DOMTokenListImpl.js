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
var DOMImpl_1 = require("./DOMImpl");
var DOMException_1 = require("./DOMException");
var infra_1 = require("@oozcitak/infra");
var algorithm_1 = require("../algorithm");
/**
 * Represents a token set.
 */
var DOMTokenListImpl = /** @class */ (function () {
    /**
     * Initializes a new instance of `DOMTokenList`.
     *
     * @param element - associated element
     * @param attribute - associated attribute
     */
    function DOMTokenListImpl(element, attribute) {
        /**
         * 1. Let element be associated element.
         * 2. Let localName be associated attribute’s local name.
         * 3. Let value be the result of getting an attribute value given element
         * and localName.
         * 4. Run the attribute change steps for element, localName, value, value,
         * and null.
         */
        this._element = element;
        this._attribute = attribute;
        this._tokenSet = new Set();
        var localName = attribute._localName;
        var value = algorithm_1.element_getAnAttributeValue(element, localName);
        // define a closure to be called when the associated attribute's value changes
        var thisObj = this;
        function updateTokenSet(element, localName, oldValue, value, namespace) {
            /**
             * 1. If localName is associated attribute’s local name, namespace is null,
             * and value is null, then empty token set.
             * 2. Otherwise, if localName is associated attribute’s local name,
             * namespace is null, then set token set to value, parsed.
             */
            if (localName === thisObj._attribute._localName && namespace === null) {
                if (!value)
                    thisObj._tokenSet.clear();
                else
                    thisObj._tokenSet = algorithm_1.orderedSet_parse(value);
            }
        }
        // add the closure to the associated element's attribute change steps
        this._element._attributeChangeSteps.push(updateTokenSet);
        if (DOMImpl_1.dom.features.steps) {
            algorithm_1.dom_runAttributeChangeSteps(element, localName, value, value, null);
        }
    }
    Object.defineProperty(DOMTokenListImpl.prototype, "length", {
        /** @inheritdoc */
        get: function () {
            /**
             * The length attribute' getter must return context object’s token set’s
             * size.
             */
            return this._tokenSet.size;
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    DOMTokenListImpl.prototype.item = function (index) {
        var e_1, _a;
        /**
         * 1. If index is equal to or greater than context object’s token set’s
         * size, then return null.
         * 2. Return context object’s token set[index].
         */
        var i = 0;
        try {
            for (var _b = __values(this._tokenSet), _c = _b.next(); !_c.done; _c = _b.next()) {
                var token = _c.value;
                if (i === index)
                    return token;
                i++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return null;
    };
    /** @inheritdoc */
    DOMTokenListImpl.prototype.contains = function (token) {
        /**
         * The contains(token) method, when invoked, must return true if context
         * object’s token set[token] exists, and false otherwise.
         */
        return this._tokenSet.has(token);
    };
    /** @inheritdoc */
    DOMTokenListImpl.prototype.add = function () {
        var e_2, _a;
        var tokens = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tokens[_i] = arguments[_i];
        }
        try {
            /**
             * 1. For each token in tokens:
             * 1.1. If token is the empty string, then throw a "SyntaxError"
             * DOMException.
             * 1.2. If token contains any ASCII whitespace, then throw an
             * "InvalidCharacterError" DOMException.
             * 2. For each token in tokens, append token to context object’s token set.
             * 3. Run the update steps.
             */
            for (var tokens_1 = __values(tokens), tokens_1_1 = tokens_1.next(); !tokens_1_1.done; tokens_1_1 = tokens_1.next()) {
                var token = tokens_1_1.value;
                if (token === '') {
                    throw new DOMException_1.SyntaxError("Cannot add an empty token.");
                }
                else if (infra_1.codePoint.ASCIIWhiteSpace.test(token)) {
                    throw new DOMException_1.InvalidCharacterError("Token cannot contain whitespace.");
                }
                else {
                    this._tokenSet.add(token);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (tokens_1_1 && !tokens_1_1.done && (_a = tokens_1.return)) _a.call(tokens_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        algorithm_1.tokenList_updateSteps(this);
    };
    /** @inheritdoc */
    DOMTokenListImpl.prototype.remove = function () {
        var e_3, _a;
        var tokens = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tokens[_i] = arguments[_i];
        }
        try {
            /**
             * 1. For each token in tokens:
             * 1.1. If token is the empty string, then throw a "SyntaxError"
             * DOMException.
             * 1.2. If token contains any ASCII whitespace, then throw an
             * "InvalidCharacterError" DOMException.
             * 2. For each token in tokens, remove token from context object’s token set.
             * 3. Run the update steps.
             */
            for (var tokens_2 = __values(tokens), tokens_2_1 = tokens_2.next(); !tokens_2_1.done; tokens_2_1 = tokens_2.next()) {
                var token = tokens_2_1.value;
                if (token === '') {
                    throw new DOMException_1.SyntaxError("Cannot remove an empty token.");
                }
                else if (infra_1.codePoint.ASCIIWhiteSpace.test(token)) {
                    throw new DOMException_1.InvalidCharacterError("Token cannot contain whitespace.");
                }
                else {
                    this._tokenSet.delete(token);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (tokens_2_1 && !tokens_2_1.done && (_a = tokens_2.return)) _a.call(tokens_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        algorithm_1.tokenList_updateSteps(this);
    };
    /** @inheritdoc */
    DOMTokenListImpl.prototype.toggle = function (token, force) {
        if (force === void 0) { force = undefined; }
        /**
         * 1. If token is the empty string, then throw a "SyntaxError" DOMException.
         * 2. If token contains any ASCII whitespace, then throw an
         * "InvalidCharacterError" DOMException.
         */
        if (token === '') {
            throw new DOMException_1.SyntaxError("Cannot toggle an empty token.");
        }
        else if (infra_1.codePoint.ASCIIWhiteSpace.test(token)) {
            throw new DOMException_1.InvalidCharacterError("Token cannot contain whitespace.");
        }
        /**
         * 3. If context object’s token set[token] exists, then:
         */
        if (this._tokenSet.has(token)) {
            /**
             * 3.1. If force is either not given or is false, then remove token from
             * context object’s token set, run the update steps and return false.
             * 3.2. Return true.
             */
            if (force === undefined || force === false) {
                this._tokenSet.delete(token);
                algorithm_1.tokenList_updateSteps(this);
                return false;
            }
            return true;
        }
        /**
         * 4. Otherwise, if force not given or is true, append token to context
         * object’s token set, run the update steps, and return true.
         */
        if (force === undefined || force === true) {
            this._tokenSet.add(token);
            algorithm_1.tokenList_updateSteps(this);
            return true;
        }
        /**
         * 5. Return false.
         */
        return false;
    };
    /** @inheritdoc */
    DOMTokenListImpl.prototype.replace = function (token, newToken) {
        /**
         * 1. If either token or newToken is the empty string, then throw a
         * "SyntaxError" DOMException.
         * 2. If either token or newToken contains any ASCII whitespace, then throw
         * an "InvalidCharacterError" DOMException.
         */
        if (token === '' || newToken === '') {
            throw new DOMException_1.SyntaxError("Cannot replace an empty token.");
        }
        else if (infra_1.codePoint.ASCIIWhiteSpace.test(token) || infra_1.codePoint.ASCIIWhiteSpace.test(newToken)) {
            throw new DOMException_1.InvalidCharacterError("Token cannot contain whitespace.");
        }
        /**
         * 3. If context object’s token set does not contain token, then return
         * false.
         */
        if (!this._tokenSet.has(token))
            return false;
        /**
         * 4. Replace token in context object’s token set with newToken.
         * 5. Run the update steps.
         * 6. Return true.
         */
        infra_1.set.replace(this._tokenSet, token, newToken);
        algorithm_1.tokenList_updateSteps(this);
        return true;
    };
    /** @inheritdoc */
    DOMTokenListImpl.prototype.supports = function (token) {
        /**
         * 1. Let result be the return value of validation steps called with token.
         * 2. Return result.
         */
        return algorithm_1.tokenList_validationSteps(this, token);
    };
    Object.defineProperty(DOMTokenListImpl.prototype, "value", {
        /** @inheritdoc */
        get: function () {
            /**
             * The value attribute must return the result of running context object’s
             * serialize steps.
             */
            return algorithm_1.tokenList_serializeSteps(this);
        },
        set: function (value) {
            /**
             * Setting the value attribute must set an attribute value for the
             * associated element using associated attribute’s local name and the given
             * value.
             */
            algorithm_1.element_setAnAttributeValue(this._element, this._attribute._localName, value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns an iterator for the token set.
     */
    DOMTokenListImpl.prototype[Symbol.iterator] = function () {
        var it = this._tokenSet[Symbol.iterator]();
        return {
            next: function () {
                return it.next();
            }
        };
    };
    /**
     * Creates a new `DOMTokenList`.
     *
     * @param element - associated element
     * @param attribute - associated attribute
     */
    DOMTokenListImpl._create = function (element, attribute) {
        return new DOMTokenListImpl(element, attribute);
    };
    return DOMTokenListImpl;
}());
exports.DOMTokenListImpl = DOMTokenListImpl;
//# sourceMappingURL=DOMTokenListImpl.js.map