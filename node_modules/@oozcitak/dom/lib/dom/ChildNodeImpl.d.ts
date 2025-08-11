import { Node, ChildNode } from "./interfaces";
/**
 * Represents a mixin that extends child nodes that can have siblings
 * including doctypes. This mixin is implemented by {@link Element},
 * {@link CharacterData} and {@link DocumentType}.
 */
export declare class ChildNodeImpl implements ChildNode {
    /** @inheritdoc */
    before(...nodes: (Node | string)[]): void;
    /** @inheritdoc */
    after(...nodes: (Node | string)[]): void;
    /** @inheritdoc */
    replaceWith(...nodes: (Node | string)[]): void;
    /** @inheritdoc */
    remove(): void;
}
