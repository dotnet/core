import { Attr, NamedNodeMap, DOMTokenList, ShadowRoot, NodeType, Node, Document, Element, HTMLCollection, NodeList, ShadowRootMode, CustomElementDefinition, HTMLSlotElement, Slot, AttributeChangeStep } from "./interfaces";
import { NodeImpl } from "./NodeImpl";
/**
 * Represents an element node.
 */
export declare class ElementImpl extends NodeImpl implements Element {
    _nodeType: NodeType;
    _children: Set<Node>;
    _namespace: string | null;
    _namespacePrefix: string | null;
    _localName: string;
    _customElementState: "undefined" | "failed" | "uncustomized" | "custom";
    _customElementDefinition: CustomElementDefinition | null;
    _is: string | null;
    _shadowRoot: ShadowRoot | null;
    _attributeList: NamedNodeMap;
    _uniqueIdentifier?: string;
    _attributeChangeSteps: AttributeChangeStep[];
    _name: string;
    _assignedSlot: Slot | null;
    /**
     * Initializes a new instance of `Element`.
     */
    constructor();
    /** @inheritdoc */
    get namespaceURI(): string | null;
    /** @inheritdoc */
    get prefix(): string | null;
    /** @inheritdoc */
    get localName(): string;
    /** @inheritdoc */
    get tagName(): string;
    /** @inheritdoc */
    get id(): string;
    set id(value: string);
    /** @inheritdoc */
    get className(): string;
    set className(value: string);
    /** @inheritdoc */
    get classList(): DOMTokenList;
    /** @inheritdoc */
    get slot(): string;
    set slot(value: string);
    /** @inheritdoc */
    hasAttributes(): boolean;
    /** @inheritdoc */
    get attributes(): NamedNodeMap;
    /** @inheritdoc */
    getAttributeNames(): string[];
    /** @inheritdoc */
    getAttribute(qualifiedName: string): string | null;
    /** @inheritdoc */
    getAttributeNS(namespace: string, localName: string): string | null;
    /** @inheritdoc */
    setAttribute(qualifiedName: string, value: string): void;
    /** @inheritdoc */
    setAttributeNS(namespace: string, qualifiedName: string, value: string): void;
    /** @inheritdoc */
    removeAttribute(qualifiedName: string): void;
    /** @inheritdoc */
    removeAttributeNS(namespace: string, localName: string): void;
    /** @inheritdoc */
    hasAttribute(qualifiedName: string): boolean;
    /** @inheritdoc */
    toggleAttribute(qualifiedName: string, force?: boolean): boolean;
    /** @inheritdoc */
    hasAttributeNS(namespace: string, localName: string): boolean;
    /** @inheritdoc */
    getAttributeNode(qualifiedName: string): Attr | null;
    /** @inheritdoc */
    getAttributeNodeNS(namespace: string, localName: string): Attr | null;
    /** @inheritdoc */
    setAttributeNode(attr: Attr): Attr | null;
    /** @inheritdoc */
    setAttributeNodeNS(attr: Attr): Attr | null;
    /** @inheritdoc */
    removeAttributeNode(attr: Attr): Attr;
    /** @inheritdoc */
    attachShadow(init: {
        mode: ShadowRootMode;
    }): ShadowRoot;
    /** @inheritdoc */
    get shadowRoot(): ShadowRoot | null;
    /** @inheritdoc */
    closest(selectors: string): Element | null;
    /** @inheritdoc */
    matches(selectors: string): boolean;
    /** @inheritdoc */
    webkitMatchesSelector(selectors: string): boolean;
    /** @inheritdoc */
    getElementsByTagName(qualifiedName: string): HTMLCollection;
    /** @inheritdoc */
    getElementsByTagNameNS(namespace: string, localName: string): HTMLCollection;
    /** @inheritdoc */
    getElementsByClassName(classNames: string): HTMLCollection;
    /** @inheritdoc */
    insertAdjacentElement(where: "beforebegin" | "afterbegin" | "beforeend" | "afterend", element: Element): Element | null;
    /** @inheritdoc */
    insertAdjacentText(where: "beforebegin" | "afterbegin" | "beforeend" | "afterend", data: string): void;
    /**
     * Returns the qualified name.
     */
    get _qualifiedName(): string;
    /**
     * Returns the upper-cased qualified name for a html element.
     */
    get _htmlUppercasedQualifiedName(): string;
    get children(): HTMLCollection;
    get firstElementChild(): Element | null;
    get lastElementChild(): Element | null;
    get childElementCount(): number;
    prepend(...nodes: (Node | string)[]): void;
    append(...nodes: (Node | string)[]): void;
    querySelector(selectors: string): Element | null;
    querySelectorAll(selectors: string): NodeList;
    get previousElementSibling(): Element | null;
    get nextElementSibling(): Element | null;
    before(...nodes: (Node | string)[]): void;
    after(...nodes: (Node | string)[]): void;
    replaceWith(...nodes: (Node | string)[]): void;
    remove(): void;
    get assignedSlot(): HTMLSlotElement | null;
    /**
     * Creates a new `Element`.
     *
     * @param document - owner document
     * @param localName - local name
     * @param namespace - namespace
     * @param prefix - namespace prefix
     */
    static _create(document: Document, localName: string, namespace?: string | null, namespacePrefix?: string | null): ElementImpl;
}
