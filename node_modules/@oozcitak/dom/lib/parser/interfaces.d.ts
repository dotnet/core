import { Document } from "../dom/interfaces";
/**
 * Represents a parser for XML and HTML content.
 *
 * See: https://w3c.github.io/DOM-Parsing/#the-domparser-interface
 */
export interface DOMParser {
    /**
     * Parses the given string and returns a document object.
     *
     * @param source - the string containing the document tree.
     * @param mimeType - the mime type of the document
     */
    parseFromString(source: string, mimeType: MimeType): Document;
}
/**
 * Defines the mime type of the document.
 */
export declare type MimeType = 'text/html' | 'text/xml' | 'application/xml' | 'application/xhtml+xml' | 'image/svg+xml';
/**
 * Represents a token.
 */
export interface XMLToken {
    /**
     * Token type.
     */
    readonly type: TokenType;
}
/**
 * Represents an end-of-file token.
 */
export interface EOFToken extends XMLToken {
    readonly type: TokenType.EOF;
}
/**
 * Represents an XML declaration token.
 */
export interface DeclarationToken extends XMLToken {
    readonly type: TokenType.Declaration;
    readonly version: string;
    readonly encoding: string;
    readonly standalone: string;
}
/**
 * Represents a DocType token.
 */
export interface DocTypeToken extends XMLToken {
    readonly type: TokenType.DocType;
    readonly name: string;
    readonly pubId: string;
    readonly sysId: string;
}
/**
 * Represents a character data token.
 */
export interface CharacterDataToken extends XMLToken {
    readonly data: string;
}
/**
 * Represents a comment token.
 */
export interface CommentToken extends CharacterDataToken {
    readonly type: TokenType.Comment;
}
/**
 * Represents a CDATA token.
 */
export interface CDATAToken extends CharacterDataToken {
    readonly type: TokenType.CDATA;
}
/**
 * Represents a text token.
 */
export interface TextToken extends CharacterDataToken {
    readonly type: TokenType.Text;
}
/**
 * Represents a processing instruction token.
 */
export interface PIToken extends CharacterDataToken {
    readonly type: TokenType.PI;
    readonly target: string;
}
/**
 * Represents an element token.
 */
export interface ElementToken extends XMLToken {
    readonly type: TokenType.Element;
    readonly name: string;
    readonly attributes: Array<[string, string]>;
    readonly selfClosing: boolean;
}
/**
 * Represents a closing tag token.
 */
export interface ClosingTagToken extends XMLToken {
    readonly type: TokenType.ClosingTag;
    readonly name: string;
}
/**
 * Represents a lexer for XML content.
 */
export interface XMLLexer extends Iterable<XMLToken> {
    /**
     * Returns the next token.
     */
    nextToken(): XMLToken;
}
/**
 * Defines lexer options.
 */
export declare type XMLLexerOptions = {
    /**
     * Determines whether whitespace-only text nodes are skipped or not.
     */
    skipWhitespaceOnlyText: boolean;
};
/**
 * Defines the type of a token.
 */
export declare enum TokenType {
    EOF = 0,
    Declaration = 1,
    DocType = 2,
    Element = 3,
    Text = 4,
    CDATA = 5,
    PI = 6,
    Comment = 7,
    ClosingTag = 8
}
