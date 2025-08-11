import { Element, Document, CustomElementDefinition } from "../dom/interfaces";
/**
 * Determines if the given string is a valid custom element name.
 *
 * @param name - a name string
 */
export declare function customElement_isValidCustomElementName(name: string): boolean;
/**
 * Determines if the given string is a valid element name.
 *
 * @param name - a name string
 */
export declare function customElement_isValidElementName(name: string): boolean;
/**
 * Determines if the given string is a void element name.
 *
 * @param name - a name string
 */
export declare function customElement_isVoidElementName(name: string): boolean;
/**
 * Determines if the given string is a valid shadow host element name.
 *
 * @param name - a name string
 */
export declare function customElement_isValidShadowHostName(name: string): boolean;
/**
 * Enqueues an upgrade reaction for a custom element.
 *
 * @param element - a custom element
 * @param definition - a custom element definition
 */
export declare function customElement_enqueueACustomElementUpgradeReaction(element: Element, definition: CustomElementDefinition): void;
/**
 * Enqueues a callback reaction for a custom element.
 *
 * @param element - a custom element
 * @param callbackName - name of the callback
 * @param args - callback arguments
 */
export declare function customElement_enqueueACustomElementCallbackReaction(element: Element, callbackName: string, args: any[]): void;
/**
 * Upgrade a custom element.
 *
 * @param element - a custom element
 */
export declare function customElement_upgrade(definition: CustomElementDefinition, element: Element): void;
/**
 * Tries to upgrade a custom element.
 *
 * @param element - a custom element
 */
export declare function customElement_tryToUpgrade(element: Element): void;
/**
 * Looks up a custom element definition.
 *
 * @param document - a document
 * @param namespace - element namespace
 * @param localName - element local name
 * @param is - an `is` value
 */
export declare function customElement_lookUpACustomElementDefinition(document: Document, namespace: string | null, localName: string | null, is: string | null): CustomElementDefinition | null;
