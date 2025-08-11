import { Attr, Element, Document, Node } from "../dom/interfaces";
/**
 * Determines whether the element's attribute list contains the given
 * attribute.
 *
 * @param attribute - an attribute node
 * @param element - an element node
 */
export declare function element_has(attribute: Attr, element: Element): boolean;
/**
 * Changes the value of an attribute node.
 *
 * @param attribute - an attribute node
 * @param element - an element node
 * @param value - attribute value
 */
export declare function element_change(attribute: Attr, element: Element, value: string): void;
/**
 * Appends an attribute to an element node.
 *
 * @param attribute - an attribute
 * @param element - an element to receive the attribute
 */
export declare function element_append(attribute: Attr, element: Element): void;
/**
 * Removes an attribute from an element node.
 *
 * @param attribute - an attribute
 * @param element - an element to receive the attribute
 */
export declare function element_remove(attribute: Attr, element: Element): void;
/**
 * Replaces an attribute with another of an element node.
 *
 * @param oldAttr - old attribute
 * @param newAttr - new attribute
 * @param element - an element to receive the attribute
 */
export declare function element_replace(oldAttr: Attr, newAttr: Attr, element: Element): void;
/**
 * Retrieves an attribute with the given name from an element node.
 *
 * @param qualifiedName - an attribute name
 * @param element - an element to receive the attribute
 */
export declare function element_getAnAttributeByName(qualifiedName: string, element: Element): Attr | null;
/**
 * Retrieves an attribute with the given namespace and local name from an
 * element node.
 *
 * @param namespace - an attribute namespace
 * @param localName - an attribute local name
 * @param element - an element to receive the attribute
 */
export declare function element_getAnAttributeByNamespaceAndLocalName(namespace: string, localName: string, element: Element): Attr | null;
/**
 * Retrieves an attribute's value with the given name namespace and local
 * name from an element node.
 *
 * @param element - an element to receive the attribute
 * @param localName - an attribute local name
 * @param namespace - an attribute namespace
 */
export declare function element_getAnAttributeValue(element: Element, localName: string, namespace?: string): string;
/**
 * Sets an attribute of an element node.
 *
 * @param attr - an attribute
 * @param element - an element to receive the attribute
 */
export declare function element_setAnAttribute(attr: Attr, element: Element): Attr | null;
/**
 * Sets an attribute's value of an element node.
 *
 * @param element - an element to receive the attribute
 * @param localName - an attribute local name
 * @param value - an attribute value
 * @param prefix - an attribute prefix
 * @param namespace - an attribute namespace
 */
export declare function element_setAnAttributeValue(element: Element, localName: string, value: string, prefix?: string | null, namespace?: string | null): void;
/**
 * Removes an attribute with the given name from an element node.
 *
 * @param qualifiedName - an attribute name
 * @param element - an element to receive the attribute
 */
export declare function element_removeAnAttributeByName(qualifiedName: string, element: Element): Attr | null;
/**
 * Removes an attribute with the given namespace and local name from an
 * element node.
 *
 * @param namespace - an attribute namespace
 * @param localName - an attribute local name
 * @param element - an element to receive the attribute
 */
export declare function element_removeAnAttributeByNamespaceAndLocalName(namespace: string, localName: string, element: Element): Attr | null;
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
export declare function element_createAnElement(document: Document, localName: string, namespace: string | null, prefix?: string | null, is?: string | null, synchronousCustomElementsFlag?: boolean): Element;
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
export declare function element_insertAdjacent(element: Element, where: "beforebegin" | "afterbegin" | "beforeend" | "afterend", node: Node): Node | null;
