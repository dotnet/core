import { Node, HTMLCollection, NodeList, Element, ParentNode } from "./interfaces";
/**
 * Represents a mixin that extends parent nodes that can have children.
 * This mixin is implemented by {@link Element}, {@link Document} and
 * {@link DocumentFragment}.
 */
export declare class ParentNodeImpl implements ParentNode {
    /** @inheritdoc */
    get children(): HTMLCollection;
    /** @inheritdoc */
    get firstElementChild(): Element | null;
    /** @inheritdoc */
    get lastElementChild(): Element | null;
    /** @inheritdoc */
    get childElementCount(): number;
    /** @inheritdoc */
    prepend(...nodes: (Node | string)[]): void;
    /** @inheritdoc */
    append(...nodes: (Node | string)[]): void;
    /** @inheritdoc */
    querySelector(selectors: string): Element | null;
    /** @inheritdoc */
    querySelectorAll(selectors: string): NodeList;
}
