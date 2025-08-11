import { DOMTokenList, Element, Attr } from "./interfaces";
/**
 * Represents a token set.
 */
export declare class DOMTokenListImpl implements DOMTokenList {
    _element: Element;
    _attribute: Attr;
    _tokenSet: Set<string>;
    /**
     * Initializes a new instance of `DOMTokenList`.
     *
     * @param element - associated element
     * @param attribute - associated attribute
     */
    private constructor();
    /** @inheritdoc */
    get length(): number;
    /** @inheritdoc */
    item(index: number): string | null;
    /** @inheritdoc */
    contains(token: string): boolean;
    /** @inheritdoc */
    add(...tokens: string[]): void;
    /** @inheritdoc */
    remove(...tokens: string[]): void;
    /** @inheritdoc */
    toggle(token: string, force?: boolean | undefined): boolean;
    /** @inheritdoc */
    replace(token: string, newToken: string): boolean;
    /** @inheritdoc */
    supports(token: string): boolean;
    /** @inheritdoc */
    get value(): string;
    set value(value: string);
    /**
     * Returns an iterator for the token set.
     */
    [Symbol.iterator](): Iterator<string>;
    /**
     * Creates a new `DOMTokenList`.
     *
     * @param element - associated element
     * @param attribute - associated attribute
     */
    static _create(element: Element, attribute: Attr): DOMTokenListImpl;
}
