import { Element, NonElementParentNode } from "./interfaces";
/**
 * Represents a mixin that extends non-element parent nodes. This mixin
 * is implemented by {@link Document} and {@link DocumentFragment}.
 */
export declare class NonElementParentNodeImpl implements NonElementParentNode {
    /** @inheritdoc */
    getElementById(id: string): Element | null;
}
