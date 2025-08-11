import { Element, NonDocumentTypeChildNode } from "./interfaces";
/**
 * Represents a mixin that extends child nodes that can have siblings
 * other than doctypes. This mixin is implemented by {@link Element} and
 * {@link CharacterData}.
 */
export declare class NonDocumentTypeChildNodeImpl implements NonDocumentTypeChildNode {
    /** @inheritdoc */
    get previousElementSibling(): Element | null;
    /** @inheritdoc */
    get nextElementSibling(): Element | null;
}
