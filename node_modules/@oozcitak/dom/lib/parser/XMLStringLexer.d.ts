import { XMLToken, XMLLexer, XMLLexerOptions } from "./interfaces";
/**
 * Represents a lexer for XML content in a string.
 */
export declare class XMLStringLexer implements XMLLexer {
    private _str;
    private _index;
    private _length;
    private _options;
    err: {
        line: number;
        col: number;
        index: number;
        str: string;
    };
    /**
     * Initializes a new instance of `XMLStringLexer`.
     *
     * @param str - the string to tokenize and lex
     * @param options - lexer options
     */
    constructor(str: string, options?: Partial<XMLLexerOptions>);
    /**
     * Returns the next token.
     */
    nextToken(): XMLToken;
    /**
     * Branches from an opening bracket (`<`).
     */
    private openBracket;
    /**
     * Produces an XML declaration token.
     */
    private declaration;
    /**
     * Produces a doc type token.
     */
    private doctype;
    /**
     * Produces a processing instruction token.
     */
    private pi;
    /**
     * Produces a text token.
     *
     */
    private text;
    /**
     * Produces a comment token.
     *
     */
    private comment;
    /**
     * Produces a CDATA token.
     *
     */
    private cdata;
    /**
     * Produces an element token.
     */
    private openTag;
    /**
     * Produces a closing tag token.
     *
     */
    private closeTag;
    /**
     * Reads an attribute name, value pair
     */
    private attribute;
    /**
     * Reads a string between double or single quotes.
     */
    private quotedString;
    /**
     * Determines if the current index is at or past the end of input string.
     */
    private eof;
    /**
     * Skips the length of the given string if the string from current position
     * starts with the given string.
     *
     * @param str - the string to match
     */
    private skipIfStartsWith;
    /**
     * Seeks a number of character codes.
     *
     * @param count - number of characters to skip
     */
    private seek;
    /**
     * Skips space characters.
     */
    private skipSpace;
    /**
     * Takes a given number of characters.
     *
     * @param count - character count
     */
    private take;
    /**
     * Takes characters until the next character matches `char`.
     *
     * @param char - a character to match
     * @param space - whether a space character stops iteration
     */
    private takeUntil;
    /**
     * Takes characters until the next character matches `char1` or `char1`.
     *
     * @param char1 - a character to match
     * @param char2 - a character to match
     * @param space - whether a space character stops iteration
     */
    private takeUntil2;
    /**
     * Takes characters until the next characters matches `str`.
     *
     * @param str - a string to match
     * @param space - whether a space character stops iteration
     */
    private takeUntilStartsWith;
    /**
     * Skips characters until the next character matches `char`.
     *
     * @param char - a character to match
     */
    private skipUntil;
    /**
     * Determines if the given token is entirely whitespace.
     *
     * @param token - the token to check
     */
    private static isWhiteSpaceToken;
    /**
     * Determines if the given character is whitespace.
     *
     * @param char - the character to check
     */
    private static isSpace;
    /**
     * Determines if the given character is a quote character.
     *
     * @param char - the character to check
     */
    private static isQuote;
    /**
     * Throws a parser error and records the line and column numbers in the parsed
     * string.
     *
     * @param msg - error message
     */
    private throwError;
    /**
     * Returns an iterator for the lexer.
     */
    [Symbol.iterator](): Iterator<XMLToken>;
}
