import { NodeType, Text, HTMLSlotElement, Document, Slot } from "./interfaces";
import { CharacterDataImpl } from "./CharacterDataImpl";
/**
 * Represents a text node.
 */
export declare class TextImpl extends CharacterDataImpl implements Text {
    _nodeType: NodeType;
    _name: string;
    _assignedSlot: Slot | null;
    /**
     * Initializes a new instance of `Text`.
     *
     * @param data - the text content
     */
    constructor(data?: string);
    /** @inheritdoc */
    get wholeText(): string;
    /** @inheritdoc */
    splitText(offset: number): Text;
    get assignedSlot(): HTMLSlotElement | null;
    /**
     * Creates a `Text`.
     *
     * @param document - owner document
     * @param data - the text content
     */
    static _create(document: Document, data?: string): TextImpl;
}
