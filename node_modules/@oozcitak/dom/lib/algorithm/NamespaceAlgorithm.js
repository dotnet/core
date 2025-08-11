"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DOMException_1 = require("../dom/DOMException");
var infra_1 = require("@oozcitak/infra");
var XMLAlgorithm_1 = require("./XMLAlgorithm");
/**
 * Validates the given qualified name.
 *
 * @param qualifiedName - qualified name
 */
function namespace_validate(qualifiedName) {
    /**
     * To validate a qualifiedName, throw an "InvalidCharacterError"
     * DOMException if qualifiedName does not match the Name or QName
     * production.
     */
    if (!XMLAlgorithm_1.xml_isName(qualifiedName))
        throw new DOMException_1.InvalidCharacterError("Invalid XML name: " + qualifiedName);
    if (!XMLAlgorithm_1.xml_isQName(qualifiedName))
        throw new DOMException_1.InvalidCharacterError("Invalid XML qualified name: " + qualifiedName + ".");
}
exports.namespace_validate = namespace_validate;
/**
 * Validates and extracts a namespace, prefix and localName from the
 * given namespace and qualified name.
 * See: https://dom.spec.whatwg.org/#validate-and-extract.
 *
 * @param namespace - namespace
 * @param qualifiedName - qualified name
 *
 * @returns a tuple with `namespace`, `prefix` and `localName`.
 */
function namespace_validateAndExtract(namespace, qualifiedName) {
    /**
     * 1. If namespace is the empty string, set it to null.
     * 2. Validate qualifiedName.
     * 3. Let prefix be null.
     * 4. Let localName be qualifiedName.
     * 5. If qualifiedName contains a ":" (U+003E), then split the string on it
     * and set prefix to the part before and localName to the part after.
     * 6. If prefix is non-null and namespace is null, then throw a
     * "NamespaceError" DOMException.
     * 7. If prefix is "xml" and namespace is not the XML namespace, then throw
     * a "NamespaceError" DOMException.
     * 8. If either qualifiedName or prefix is "xmlns" and namespace is not the
     * XMLNS namespace, then throw a "NamespaceError" DOMException.
     * 9. If namespace is the XMLNS namespace and neither qualifiedName nor
     * prefix is "xmlns", then throw a "NamespaceError" DOMException.
     * 10. Return namespace, prefix, and localName.
     */
    if (!namespace)
        namespace = null;
    namespace_validate(qualifiedName);
    var parts = qualifiedName.split(':');
    var prefix = (parts.length === 2 ? parts[0] : null);
    var localName = (parts.length === 2 ? parts[1] : qualifiedName);
    if (prefix && namespace === null)
        throw new DOMException_1.NamespaceError("Qualified name includes a prefix but the namespace is null.");
    if (prefix === "xml" && namespace !== infra_1.namespace.XML)
        throw new DOMException_1.NamespaceError("Qualified name includes the \"xml\" prefix but the namespace is not the XML namespace.");
    if (namespace !== infra_1.namespace.XMLNS &&
        (prefix === "xmlns" || qualifiedName === "xmlns"))
        throw new DOMException_1.NamespaceError("Qualified name includes the \"xmlns\" prefix but the namespace is not the XMLNS namespace.");
    if (namespace === infra_1.namespace.XMLNS &&
        (prefix !== "xmlns" && qualifiedName !== "xmlns"))
        throw new DOMException_1.NamespaceError("Qualified name does not include the \"xmlns\" prefix but the namespace is the XMLNS namespace.");
    return [namespace, prefix, localName];
}
exports.namespace_validateAndExtract = namespace_validateAndExtract;
/**
 * Extracts a prefix and localName from the given qualified name.
 *
 * @param qualifiedName - qualified name
 *
 * @returns an tuple with `prefix` and `localName`.
 */
function namespace_extractQName(qualifiedName) {
    namespace_validate(qualifiedName);
    var parts = qualifiedName.split(':');
    var prefix = (parts.length === 2 ? parts[0] : null);
    var localName = (parts.length === 2 ? parts[1] : qualifiedName);
    return [prefix, localName];
}
exports.namespace_extractQName = namespace_extractQName;
//# sourceMappingURL=NamespaceAlgorithm.js.map