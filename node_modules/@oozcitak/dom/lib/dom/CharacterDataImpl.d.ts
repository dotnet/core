import { Element, Node, CharacterData } from "./interfaces";
import { NodeImpl } from "./NodeImpl";
/**
 * Represents a generic text node.
 */
export declare abstract class CharacterDataImpl extends NodeImpl implements CharacterData {
    _data: string;
    /**
     * Initializes a new instance of `CharacterData`.
     *
     * @param data - the text content
     */
    protected constructor(data: string);
    /** @inheritdoc */
    get data(): string;
    set data(value: string);
    /** @inheritdoc */
    get length(): number;
    /** @inheritdoc */
    substringData(offset: number, count: number): string;
    /** @inheritdoc */
    appendData(data: string): void;
    /** @inheritdoc */
    insertData(offset: number, data: string): void;
    /** @inheritdoc */
    deleteData(offset: number, count: number): void;
    /** @inheritdoc */
    replaceData(offset: number, count: number, data: string): void;
    get previousElementSibling(): Element | null;
    get nextElementSibling(): Element | null;
    before(...nodes: (Node | string)[]): void;
    after(...nodes: (Node | string)[]): void;
    replaceWith(...nodes: (Node | string)[]): void;
    remove(): void;
}
