"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PotentialCustomElementName = /[a-z]([\0-\t\x2D\._a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-([\0-\t\x2D\._a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*/;
var NamesWithHyphen = new Set(['annotation-xml', 'color-profile',
    'font-face', 'font-face-src', 'font-face-uri', 'font-face-format',
    'font-face-name', 'missing-glyph']);
var ElementNames = new Set(['article', 'aside', 'blockquote',
    'body', 'div', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'header', 'main', 'nav', 'p', 'section', 'span']);
var VoidElementNames = new Set(['area', 'base', 'basefont',
    'bgsound', 'br', 'col', 'embed', 'frame', 'hr', 'img', 'input', 'keygen',
    'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr']);
var ShadowHostNames = new Set(['article', 'aside', 'blockquote', 'body',
    'div', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main',
    'nav', 'p', 'section', 'span']);
/**
 * Determines if the given string is a valid custom element name.
 *
 * @param name - a name string
 */
function customElement_isValidCustomElementName(name) {
    if (!PotentialCustomElementName.test(name))
        return false;
    if (NamesWithHyphen.has(name))
        return false;
    return true;
}
exports.customElement_isValidCustomElementName = customElement_isValidCustomElementName;
/**
 * Determines if the given string is a valid element name.
 *
 * @param name - a name string
 */
function customElement_isValidElementName(name) {
    return (ElementNames.has(name));
}
exports.customElement_isValidElementName = customElement_isValidElementName;
/**
 * Determines if the given string is a void element name.
 *
 * @param name - a name string
 */
function customElement_isVoidElementName(name) {
    return (VoidElementNames.has(name));
}
exports.customElement_isVoidElementName = customElement_isVoidElementName;
/**
 * Determines if the given string is a valid shadow host element name.
 *
 * @param name - a name string
 */
function customElement_isValidShadowHostName(name) {
    return (ShadowHostNames.has(name));
}
exports.customElement_isValidShadowHostName = customElement_isValidShadowHostName;
/**
 * Enqueues an upgrade reaction for a custom element.
 *
 * @param element - a custom element
 * @param definition - a custom element definition
 */
function customElement_enqueueACustomElementUpgradeReaction(element, definition) {
    // TODO: Implement in HTML DOM
}
exports.customElement_enqueueACustomElementUpgradeReaction = customElement_enqueueACustomElementUpgradeReaction;
/**
 * Enqueues a callback reaction for a custom element.
 *
 * @param element - a custom element
 * @param callbackName - name of the callback
 * @param args - callback arguments
 */
function customElement_enqueueACustomElementCallbackReaction(element, callbackName, args) {
    // TODO: Implement in HTML DOM
}
exports.customElement_enqueueACustomElementCallbackReaction = customElement_enqueueACustomElementCallbackReaction;
/**
 * Upgrade a custom element.
 *
 * @param element - a custom element
 */
function customElement_upgrade(definition, element) {
    // TODO: Implement in HTML DOM
}
exports.customElement_upgrade = customElement_upgrade;
/**
 * Tries to upgrade a custom element.
 *
 * @param element - a custom element
 */
function customElement_tryToUpgrade(element) {
    // TODO: Implement in HTML DOM
}
exports.customElement_tryToUpgrade = customElement_tryToUpgrade;
/**
 * Looks up a custom element definition.
 *
 * @param document - a document
 * @param namespace - element namespace
 * @param localName - element local name
 * @param is - an `is` value
 */
function customElement_lookUpACustomElementDefinition(document, namespace, localName, is) {
    // TODO: Implement in HTML DOM
    return null;
}
exports.customElement_lookUpACustomElementDefinition = customElement_lookUpACustomElementDefinition;
//# sourceMappingURL=CustomElementAlgorithm.js.map