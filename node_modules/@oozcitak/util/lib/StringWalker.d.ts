/**
 * Walks through the code points of a string.
 */
export declare class StringWalker {
    private _chars;
    private _length;
    private _pointer;
    private _codePoint;
    private _c;
    private _remaining;
    private _substring;
    /**
     * Initializes a new `StringWalker`.
     *
     * @param input - input string
     */
    constructor(input: string);
    /**
     * Determines if the current position is beyond the end of string.
     */
    get eof(): boolean;
    /**
     * Returns the number of code points in the input string.
     */
    get length(): number;
    /**
     * Returns the current code point. Returns `-1` if the position is beyond
     * the end of string.
     */
    codePoint(): number;
    /**
     * Returns the current character. Returns an empty string if the position is
     * beyond the end of string.
     */
    c(): string;
    /**
     * Returns the remaining string.
     */
    remaining(): string;
    /**
     * Returns the substring from the current character to the end of string.
     */
    substring(): string;
    /**
     * Gets or sets the current position.
     */
    get pointer(): number;
    set pointer(val: number);
}
