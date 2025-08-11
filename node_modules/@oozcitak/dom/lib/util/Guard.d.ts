import { RegisteredObserver, TransientRegisteredObserver, EventListener, MouseEvent, Slotable, Node, Text, Element, ShadowRoot, CharacterData, Document, DocumentType, Attr, Comment, ProcessingInstruction, Slot, Window, CDATASection, DocumentFragment } from "../dom/interfaces";
/**
 * Contains user-defined type guards for DOM objects.
 */
export declare class Guard {
    /**
     * Determines if the given object is a `Node`.
     *
     * @param a - the object to check
     */
    static isNode(a: any): a is Node;
    /**
     * Determines if the given object is a `Document`.
     *
     * @param a - the object to check
     */
    static isDocumentNode(a: any): a is Document;
    /**
     * Determines if the given object is a `DocumentType`.
     *
     * @param a - the object to check
     */
    static isDocumentTypeNode(a: any): a is DocumentType;
    /**
     * Determines if the given object is a `DocumentFragment`.
     *
     * @param a - the object to check
     */
    static isDocumentFragmentNode(a: any): a is DocumentFragment;
    /**
     * Determines if the given object is a `Attr`.
     *
     * @param a - the object to check
     */
    static isAttrNode(a: any): a is Attr;
    /**
     * Determines if the given node is a `CharacterData` node.
     *
     * @param a - the object to check
     */
    static isCharacterDataNode(a: any): a is CharacterData;
    /**
     * Determines if the given object is a `Text` or a `CDATASection`.
     *
     * @param a - the object to check
     */
    static isTextNode(a: any): a is Text;
    /**
     * Determines if the given object is a `Text`.
     *
     * @param a - the object to check
     */
    static isExclusiveTextNode(a: any): a is Text;
    /**
     * Determines if the given object is a `CDATASection`.
     *
     * @param a - the object to check
     */
    static isCDATASectionNode(a: any): a is CDATASection;
    /**
     * Determines if the given object is a `Comment`.
     *
     * @param a - the object to check
     */
    static isCommentNode(a: any): a is Comment;
    /**
     * Determines if the given object is a `ProcessingInstruction`.
     *
     * @param a - the object to check
     */
    static isProcessingInstructionNode(a: any): a is ProcessingInstruction;
    /**
     * Determines if the given object is an `Element`.
     *
     * @param a - the object to check
     */
    static isElementNode(a: any): a is Element;
    /**
     * Determines if the given object is a custom `Element`.
     *
     * @param a - the object to check
     */
    static isCustomElementNode(a: any): a is Element;
    /**
     * Determines if the given object is a `ShadowRoot`.
     *
     * @param a - the object to check
     */
    static isShadowRoot(a: any): a is ShadowRoot;
    /**
     * Determines if the given object is a `MouseEvent`.
     *
     * @param a - the object to check
     */
    static isMouseEvent(a: any): a is MouseEvent;
    /**
     * Determines if the given object is a slotable.
     *
     * Element and Text nodes are slotables. A slotable has an associated name
     * (a string).
     *
     * @param a - the object to check
     */
    static isSlotable(a: any): a is Slotable;
    /**
     * Determines if the given object is a slot.
     *
     * @param a - the object to check
     */
    static isSlot(a: any): a is Slot;
    /**
     * Determines if the given object is a `Window`.
     *
     * @param a - the object to check
     */
    static isWindow(a: any): a is Window;
    /**
     * Determines if the given object is an `EventListener`.
     *
     * @param a - the object to check
     */
    static isEventListener(a: any): a is EventListener;
    /**
     * Determines if the given object is a `RegisteredObserver`.
     *
     * @param a - the object to check
     */
    static isRegisteredObserver(a: any): a is RegisteredObserver;
    /**
   * Determines if the given object is a `TransientRegisteredObserver`.
   *
   * @param a - the object to check
   */
    static isTransientRegisteredObserver(a: any): a is TransientRegisteredObserver;
}
