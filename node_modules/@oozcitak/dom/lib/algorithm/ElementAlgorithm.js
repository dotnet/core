"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DOMImpl_1 = require("../dom/DOMImpl");
var infra_1 = require("@oozcitak/infra");
var util_1 = require("../util");
var DOMException_1 = require("../dom/DOMException");
var CreateAlgorithm_1 = require("./CreateAlgorithm");
var CustomElementAlgorithm_1 = require("./CustomElementAlgorithm");
var MutationObserverAlgorithm_1 = require("./MutationObserverAlgorithm");
var DOMAlgorithm_1 = require("./DOMAlgorithm");
var MutationAlgorithm_1 = require("./MutationAlgorithm");
var DocumentAlgorithm_1 = require("./DocumentAlgorithm");
/**
 * Determines whether the element's attribute list contains the given
 * attribute.
 *
 * @param attribute - an attribute node
 * @param element - an element node
 */
function element_has(attribute, element) {
    /**
     * An element has an attribute A if its attribute list contains A.
     */
    return element._attributeList._asArray().indexOf(attribute) !== -1;
}
exports.element_has = element_has;
/**
 * Changes the value of an attribute node.
 *
 * @param attribute - an attribute node
 * @param element - an element node
 * @param value - attribute value
 */
function element_change(attribute, element, value) {
    /**
     * 1. Queue an attribute mutation record for element with attribute’s
     * local name, attribute’s namespace, and attribute’s value.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        MutationObserverAlgorithm_1.observer_queueAttributeMutationRecord(element, attribute._localName, attribute._namespace, attribute._value);
    }
    /**
     * 2. If element is custom, then enqueue a custom element callback reaction
     * with element, callback name "attributeChangedCallback", and an argument
     * list containing attribute’s local name, attribute’s value, value, and
     * attribute’s namespace.
     */
    if (DOMImpl_1.dom.features.customElements) {
        if (util_1.Guard.isCustomElementNode(element)) {
            CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction(element, "attributeChangedCallback", [attribute._localName, attribute._value, value, attribute._namespace]);
        }
    }
    /**
     * 3. Run the attribute change steps with element, attribute’s local name,
     * attribute’s value, value, and attribute’s namespace.
     * 4. Set attribute’s value to value.
     */
    if (DOMImpl_1.dom.features.steps) {
        DOMAlgorithm_1.dom_runAttributeChangeSteps(element, attribute._localName, attribute._value, value, attribute._namespace);
    }
    attribute._value = value;
}
exports.element_change = element_change;
/**
 * Appends an attribute to an element node.
 *
 * @param attribute - an attribute
 * @param element - an element to receive the attribute
 */
function element_append(attribute, element) {
    /**
     * 1. Queue an attribute mutation record for element with attribute’s
     * local name, attribute’s namespace, and null.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        MutationObserverAlgorithm_1.observer_queueAttributeMutationRecord(element, attribute._localName, attribute._namespace, null);
    }
    /**
     * 2. If element is custom, then enqueue a custom element callback reaction
     * with element, callback name "attributeChangedCallback", and an argument
     * list containing attribute’s local name, null, attribute’s value, and
     * attribute’s namespace.
     */
    if (DOMImpl_1.dom.features.customElements) {
        if (util_1.Guard.isCustomElementNode(element)) {
            CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction(element, "attributeChangedCallback", [attribute._localName, null, attribute._value, attribute._namespace]);
        }
    }
    /**
     * 3. Run the attribute change steps with element, attribute’s local name,
     * null, attribute’s value, and attribute’s namespace.
     */
    if (DOMImpl_1.dom.features.steps) {
        DOMAlgorithm_1.dom_runAttributeChangeSteps(element, attribute._localName, null, attribute._value, attribute._namespace);
    }
    /**
     * 4. Append attribute to element’s attribute list.
     * 5. Set attribute’s element to element.
     */
    element._attributeList._asArray().push(attribute);
    attribute._element = element;
    // mark that the document has namespaces
    if (!element._nodeDocument._hasNamespaces && (attribute._namespace !== null ||
        attribute._namespacePrefix !== null || attribute._localName === "xmlns")) {
        element._nodeDocument._hasNamespaces = true;
    }
}
exports.element_append = element_append;
/**
 * Removes an attribute from an element node.
 *
 * @param attribute - an attribute
 * @param element - an element to receive the attribute
 */
function element_remove(attribute, element) {
    /**
     * 1. Queue an attribute mutation record for element with attribute’s
     * local name, attribute’s namespace, and attribute’s value.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        MutationObserverAlgorithm_1.observer_queueAttributeMutationRecord(element, attribute._localName, attribute._namespace, attribute._value);
    }
    /**
     * 2. If element is custom, then enqueue a custom element callback reaction
     * with element, callback name "attributeChangedCallback", and an argument
     * list containing attribute’s local name, attribute’s value, null,
     * and attribute’s namespace.
     */
    if (DOMImpl_1.dom.features.customElements) {
        if (util_1.Guard.isCustomElementNode(element)) {
            CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction(element, "attributeChangedCallback", [attribute._localName, attribute._value, null, attribute._namespace]);
        }
    }
    /**
     * 3. Run the attribute change steps with element, attribute’s local name,
     * attribute’s value, null, and attribute’s namespace.
     */
    if (DOMImpl_1.dom.features.steps) {
        DOMAlgorithm_1.dom_runAttributeChangeSteps(element, attribute._localName, attribute._value, null, attribute._namespace);
    }
    /**
     * 3. Remove attribute from element’s attribute list.
     * 5. Set attribute’s element to null.
     */
    var index = element._attributeList._asArray().indexOf(attribute);
    element._attributeList._asArray().splice(index, 1);
    attribute._element = null;
}
exports.element_remove = element_remove;
/**
 * Replaces an attribute with another of an element node.
 *
 * @param oldAttr - old attribute
 * @param newAttr - new attribute
 * @param element - an element to receive the attribute
 */
function element_replace(oldAttr, newAttr, element) {
    /**
     * 1. Queue an attribute mutation record for element with oldAttr’s
     * local name, oldAttr’s namespace, and oldAttr’s value.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        MutationObserverAlgorithm_1.observer_queueAttributeMutationRecord(element, oldAttr._localName, oldAttr._namespace, oldAttr._value);
    }
    /**
     * 2. If element is custom, then enqueue a custom element callback reaction
     * with element, callback name "attributeChangedCallback", and an argument
     * list containing oldAttr’s local name, oldAttr’s value, newAttr’s value,
     * and oldAttr’s namespace.
     */
    if (DOMImpl_1.dom.features.customElements) {
        if (util_1.Guard.isCustomElementNode(element)) {
            CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction(element, "attributeChangedCallback", [oldAttr._localName, oldAttr._value, newAttr._value, oldAttr._namespace]);
        }
    }
    /**
     * 3. Run the attribute change steps with element, oldAttr’s local name,
     * oldAttr’s value, newAttr’s value, and oldAttr’s namespace.
     */
    if (DOMImpl_1.dom.features.steps) {
        DOMAlgorithm_1.dom_runAttributeChangeSteps(element, oldAttr._localName, oldAttr._value, newAttr._value, oldAttr._namespace);
    }
    /**
     * 4. Replace oldAttr by newAttr in element’s attribute list.
     * 5. Set oldAttr’s element to null.
     * 6. Set newAttr’s element to element.
     */
    var index = element._attributeList._asArray().indexOf(oldAttr);
    if (index !== -1) {
        element._attributeList._asArray()[index] = newAttr;
    }
    oldAttr._element = null;
    newAttr._element = element;
    // mark that the document has namespaces
    if (!element._nodeDocument._hasNamespaces && (newAttr._namespace !== null ||
        newAttr._namespacePrefix !== null || newAttr._localName === "xmlns")) {
        element._nodeDocument._hasNamespaces = true;
    }
}
exports.element_replace = element_replace;
/**
 * Retrieves an attribute with the given name from an element node.
 *
 * @param qualifiedName - an attribute name
 * @param element - an element to receive the attribute
 */
function element_getAnAttributeByName(qualifiedName, element) {
    /**
     * 1. If element is in the HTML namespace and its node document is an HTML
     * document, then set qualifiedName to qualifiedName in ASCII lowercase.
     * 2. Return the first attribute in element’s attribute list whose qualified
     * name is qualifiedName, and null otherwise.
     */
    if (element._namespace === infra_1.namespace.HTML && element._nodeDocument._type === "html") {
        qualifiedName = qualifiedName.toLowerCase();
    }
    return element._attributeList._asArray().find(function (attr) { return attr._qualifiedName === qualifiedName; }) || null;
}
exports.element_getAnAttributeByName = element_getAnAttributeByName;
/**
 * Retrieves an attribute with the given namespace and local name from an
 * element node.
 *
 * @param namespace - an attribute namespace
 * @param localName - an attribute local name
 * @param element - an element to receive the attribute
 */
function element_getAnAttributeByNamespaceAndLocalName(namespace, localName, element) {
    /**
     * 1. If namespace is the empty string, set it to null.
     * 2. Return the attribute in element’s attribute list whose namespace is
     * namespace and local name is localName, if any, and null otherwise.
     */
    var ns = namespace || null;
    return element._attributeList._asArray().find(function (attr) { return attr._namespace === ns && attr._localName === localName; }) || null;
}
exports.element_getAnAttributeByNamespaceAndLocalName = element_getAnAttributeByNamespaceAndLocalName;
/**
 * Retrieves an attribute's value with the given name namespace and local
 * name from an element node.
 *
 * @param element - an element to receive the attribute
 * @param localName - an attribute local name
 * @param namespace - an attribute namespace
 */
function element_getAnAttributeValue(element, localName, namespace) {
    if (namespace === void 0) { namespace = ''; }
    /**
     * 1. Let attr be the result of getting an attribute given namespace,
     * localName, and element.
     * 2. If attr is null, then return the empty string.
     * 3. Return attr’s value.
     */
    var attr = element_getAnAttributeByNamespaceAndLocalName(namespace, localName, element);
    if (attr === null)
        return '';
    else
        return attr._value;
}
exports.element_getAnAttributeValue = element_getAnAttributeValue;
/**
 * Sets an attribute of an element node.
 *
 * @param attr - an attribute
 * @param element - an element to receive the attribute
 */
function element_setAnAttribute(attr, element) {
    /**
     * 1. If attr’s element is neither null nor element, throw an
     * "InUseAttributeError" DOMException.
     * 2. Let oldAttr be the result of getting an attribute given attr’s
     * namespace, attr’s local name, and element.
     * 3. If oldAttr is attr, return attr.
     * 4. If oldAttr is non-null, replace it by attr in element.
     * 5. Otherwise, append attr to element.
     * 6. Return oldAttr.
     */
    if (attr._element !== null && attr._element !== element)
        throw new DOMException_1.InUseAttributeError("This attribute already exists in the document: " + attr._qualifiedName + " as a child of " + attr._element._qualifiedName + ".");
    var oldAttr = element_getAnAttributeByNamespaceAndLocalName(attr._namespace || '', attr._localName, element);
    if (oldAttr === attr)
        return attr;
    if (oldAttr !== null) {
        element_replace(oldAttr, attr, element);
    }
    else {
        element_append(attr, element);
    }
    return oldAttr;
}
exports.element_setAnAttribute = element_setAnAttribute;
/**
 * Sets an attribute's value of an element node.
 *
 * @param element - an element to receive the attribute
 * @param localName - an attribute local name
 * @param value - an attribute value
 * @param prefix - an attribute prefix
 * @param namespace - an attribute namespace
 */
function element_setAnAttributeValue(element, localName, value, prefix, namespace) {
    if (prefix === void 0) { prefix = null; }
    if (namespace === void 0) { namespace = null; }
    /**
     * 1. If prefix is not given, set it to null.
     * 2. If namespace is not given, set it to null.
     * 3. Let attribute be the result of getting an attribute given namespace,
     * localName, and element.
     * 4. If attribute is null, create an attribute whose namespace is
     * namespace, namespace prefix is prefix, local name is localName, value
     * is value, and node document is element’s node document, then append this
     * attribute to element, and then return.
     * 5. Change attribute from element to value.
     */
    var attribute = element_getAnAttributeByNamespaceAndLocalName(namespace || '', localName, element);
    if (attribute === null) {
        var newAttr = CreateAlgorithm_1.create_attr(element._nodeDocument, localName);
        newAttr._namespace = namespace;
        newAttr._namespacePrefix = prefix;
        newAttr._value = value;
        element_append(newAttr, element);
        return;
    }
    element_change(attribute, element, value);
}
exports.element_setAnAttributeValue = element_setAnAttributeValue;
/**
 * Removes an attribute with the given name from an element node.
 *
 * @param qualifiedName - an attribute name
 * @param element - an element to receive the attribute
 */
function element_removeAnAttributeByName(qualifiedName, element) {
    /**
     * 1. Let attr be the result of getting an attribute given qualifiedName
     * and element.
     * 2. If attr is non-null, remove it from element.
     * 3. Return attr.
     */
    var attr = element_getAnAttributeByName(qualifiedName, element);
    if (attr !== null) {
        element_remove(attr, element);
    }
    return attr;
}
exports.element_removeAnAttributeByName = element_removeAnAttributeByName;
/**
 * Removes an attribute with the given namespace and local name from an
 * element node.
 *
 * @param namespace - an attribute namespace
 * @param localName - an attribute local name
 * @param element - an element to receive the attribute
 */
function element_removeAnAttributeByNamespaceAndLocalName(namespace, localName, element) {
    /**
     * 1. Let attr be the result of getting an attribute given namespace, localName, and element.
     * 2. If attr is non-null, remove it from element.
     * 3. Return attr.
     */
    var attr = element_getAnAttributeByNamespaceAndLocalName(namespace, localName, element);
    if (attr !== null) {
        element_remove(attr, element);
    }
    return attr;
}
exports.element_removeAnAttributeByNamespaceAndLocalName = element_removeAnAttributeByNamespaceAndLocalName;
/**
 * Creates an element node.
 * See: https://dom.spec.whatwg.org/#concept-create-element.
 *
 * @param document - the document owning the element
 * @param localName - local name
 * @param namespace - element namespace
 * @param prefix - namespace prefix
 * @param is - the "is" value
 * @param synchronousCustomElementsFlag - synchronous custom elements flag
 */
function element_createAnElement(document, localName, namespace, prefix, is, synchronousCustomElementsFlag) {
    if (prefix === void 0) { prefix = null; }
    if (is === void 0) { is = null; }
    if (synchronousCustomElementsFlag === void 0) { synchronousCustomElementsFlag = false; }
    /**
     * 1. If prefix was not given, let prefix be null.
     * 2. If is was not given, let is be null.
     * 3. Let result be null.
     */
    var result = null;
    if (!DOMImpl_1.dom.features.customElements) {
        result = CreateAlgorithm_1.create_element(document, localName, namespace, prefix);
        result._customElementState = "uncustomized";
        result._customElementDefinition = null;
        result._is = is;
        return result;
    }
    /**
     * 4. Let definition be the result of looking up a custom element definition
     * given document, namespace, localName, and is.
     */
    var definition = CustomElementAlgorithm_1.customElement_lookUpACustomElementDefinition(document, namespace, localName, is);
    if (definition !== null && definition.name !== definition.localName) {
        /**
        * 5. If definition is non-null, and definition’s name is not equal to
        * its local name (i.e., definition represents a customized built-in
        * element), then:
          * 5.1. Let interface be the element interface for localName and the HTML
          * namespace.
          * 5.2. Set result to a new element that implements interface, with no
          * attributes, namespace set to the HTML namespace, namespace prefix
          * set to prefix, local name set to localName, custom element state set
          * to "undefined", custom element definition set to null, is value set
          * to is, and node document set to document.
          * 5.3. If the synchronous custom elements flag is set, upgrade element
          * using definition.
          * 5.4. Otherwise, enqueue a custom element upgrade reaction given result
          * and definition.
          */
        var elemenInterface = DocumentAlgorithm_1.document_elementInterface(localName, infra_1.namespace.HTML);
        result = new elemenInterface();
        result._localName = localName;
        result._namespace = infra_1.namespace.HTML;
        result._namespacePrefix = prefix;
        result._customElementState = "undefined";
        result._customElementDefinition = null;
        result._is = is;
        result._nodeDocument = document;
        if (synchronousCustomElementsFlag) {
            CustomElementAlgorithm_1.customElement_upgrade(definition, result);
        }
        else {
            CustomElementAlgorithm_1.customElement_enqueueACustomElementUpgradeReaction(result, definition);
        }
    }
    else if (definition !== null) {
        /**
         * 6. Otherwise, if definition is non-null, then:
         */
        if (synchronousCustomElementsFlag) {
            /**
             * 6.1. If the synchronous custom elements flag is set, then run these
             * steps while catching any exceptions:
             */
            try {
                /**
                 * 6.1.1. Let C be definition’s constructor.
                 * 6.1.2. Set result to the result of constructing C, with no arguments.
                 * 6.1.3. Assert: result’s custom element state and custom element definition
                 * are initialized.
                 * 6.1.4. Assert: result’s namespace is the HTML namespace.
                 * _Note:_ IDL enforces that result is an HTMLElement object, which all
                 * use the HTML namespace.
                 */
                var C = definition.constructor;
                var result_1 = new C();
                console.assert(result_1._customElementState !== undefined);
                console.assert(result_1._customElementDefinition !== undefined);
                console.assert(result_1._namespace === infra_1.namespace.HTML);
                /**
                 * 6.1.5. If result’s attribute list is not empty, then throw a
                 * "NotSupportedError" DOMException.
                 * 6.1.6. If result has children, then throw a "NotSupportedError"
                 * DOMException.
                 * 6.1.7. If result’s parent is not null, then throw a
                 * "NotSupportedError" DOMException.
                 * 6.1.8. If result’s node document is not document, then throw a
                 * "NotSupportedError" DOMException.
                 * 6.1.9. If result’s local name is not equal to localName, then throw
                 * a "NotSupportedError" DOMException.
                 */
                if (result_1._attributeList.length !== 0)
                    throw new DOMException_1.NotSupportedError("Custom element already has attributes.");
                if (result_1._children.size !== 0)
                    throw new DOMException_1.NotSupportedError("Custom element already has child nodes.");
                if (result_1._parent !== null)
                    throw new DOMException_1.NotSupportedError("Custom element already has a parent node.");
                if (result_1._nodeDocument !== document)
                    throw new DOMException_1.NotSupportedError("Custom element is already in a document.");
                if (result_1._localName !== localName)
                    throw new DOMException_1.NotSupportedError("Custom element has a different local name.");
                /**
                 * 6.1.10. Set result’s namespace prefix to prefix.
                 * 6.1.11. Set result’s is value to null.
                 */
                result_1._namespacePrefix = prefix;
                result_1._is = null;
            }
            catch (e) {
                /**
                 * If any of these steps threw an exception, then:
                 * - Report the exception.
                 * - Set result to a new element that implements the HTMLUnknownElement
                 * interface, with no attributes, namespace set to the HTML namespace,
                 * namespace prefix set to prefix, local name set to localName, custom
                 * element state set to "failed", custom element definition set to null,
                 * is value set to null, and node document set to document.
                 */
                // TODO: Report the exception
                result = CreateAlgorithm_1.create_htmlUnknownElement(document, localName, infra_1.namespace.HTML, prefix);
                result._customElementState = "failed";
                result._customElementDefinition = null;
                result._is = null;
            }
        }
        else {
            /**
             * 6.2. Otherwise:
             * 6.2.1. Set result to a new element that implements the HTMLElement
             * interface, with no attributes, namespace set to the HTML namespace,
             * namespace prefix set to prefix, local name set to localName, custom
             * element state set to "undefined", custom element definition set to
             * null, is value set to null, and node document set to document.
             * 6.2.2. Enqueue a custom element upgrade reaction given result and
             * definition.
             */
            result = CreateAlgorithm_1.create_htmlElement(document, localName, infra_1.namespace.HTML, prefix);
            result._customElementState = "undefined";
            result._customElementDefinition = null;
            result._is = null;
            CustomElementAlgorithm_1.customElement_enqueueACustomElementUpgradeReaction(result, definition);
        }
    }
    else {
        /**
         * 7. Otherwise:
         * 7.1. Let interface be the element interface for localName and
         * namespace.
         * 7.2. Set result to a new element that implements interface, with no
         * attributes, namespace set to namespace, namespace prefix set to prefix,
         * local name set to localName, custom element state set to
         * "uncustomized", custom element definition set to null, is value set to
         * is, and node document set to document.
         */
        var elementInterface = DocumentAlgorithm_1.document_elementInterface(localName, namespace);
        result = new elementInterface();
        result._localName = localName;
        result._namespace = namespace;
        result._namespacePrefix = prefix;
        result._customElementState = "uncustomized";
        result._customElementDefinition = null;
        result._is = is;
        result._nodeDocument = document;
        /**
         * 7.3. If namespace is the HTML namespace, and either localName is a
         * valid custom element name or is is non-null, then set result’s
         * custom element state to "undefined".
         */
        if (namespace === infra_1.namespace.HTML && (is !== null ||
            CustomElementAlgorithm_1.customElement_isValidCustomElementName(localName))) {
            result._customElementState = "undefined";
        }
    }
    /* istanbul ignore next */
    if (result === null) {
        throw new Error("Unable to create element.");
    }
    /**
     * 8. Returns result
     */
    return result;
}
exports.element_createAnElement = element_createAnElement;
/**
 * Inserts a new node adjacent to this element.
 *
 * @param element - a reference element
 * @param where - a string defining where to insert the element node.
 *   - `beforebegin` before this element itself.
 *   - `afterbegin` before the first child.
 *   - `beforeend` after the last child.
 *   - `afterend` after this element itself.
 * @param node - node to insert
 */
function element_insertAdjacent(element, where, node) {
    /**
     * - "beforebegin"
     * If element’s parent is null, return null.
     * Return the result of pre-inserting node into element’s parent before
     * element.
     * - "afterbegin"
     * Return the result of pre-inserting node into element before element’s
     * first child.
     * - "beforeend"
     * Return the result of pre-inserting node into element before null.
     * - "afterend"
     * If element’s parent is null, return null.
     * Return the result of pre-inserting node into element’s parent before element’s next sibling.
     * - Otherwise
     * Throw a "SyntaxError" DOMException.
     */
    switch (where.toLowerCase()) {
        case 'beforebegin':
            if (element._parent === null)
                return null;
            return MutationAlgorithm_1.mutation_preInsert(node, element._parent, element);
        case 'afterbegin':
            return MutationAlgorithm_1.mutation_preInsert(node, element, element._firstChild);
        case 'beforeend':
            return MutationAlgorithm_1.mutation_preInsert(node, element, null);
        case 'afterend':
            if (element._parent === null)
                return null;
            return MutationAlgorithm_1.mutation_preInsert(node, element._parent, element._nextSibling);
        default:
            throw new DOMException_1.SyntaxError("Invalid 'where' argument. \"beforebegin\", \"afterbegin\", \"beforeend\" or \"afterend\" expected");
    }
}
exports.element_insertAdjacent = element_insertAdjacent;
//# sourceMappingURL=ElementAlgorithm.js.map