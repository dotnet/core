"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("./interfaces");
/**
 * Represents a lexer for XML content in a string.
 */
var XMLStringLexer = /** @class */ (function () {
    /**
     * Initializes a new instance of `XMLStringLexer`.
     *
     * @param str - the string to tokenize and lex
     * @param options - lexer options
     */
    function XMLStringLexer(str, options) {
        this._options = {
            skipWhitespaceOnlyText: false
        };
        this.err = { line: -1, col: -1, index: -1, str: "" };
        this._str = str;
        this._index = 0;
        this._length = str.length;
        if (options) {
            this._options.skipWhitespaceOnlyText = options.skipWhitespaceOnlyText || false;
        }
    }
    /**
     * Returns the next token.
     */
    XMLStringLexer.prototype.nextToken = function () {
        if (this.eof()) {
            return { type: interfaces_1.TokenType.EOF };
        }
        var token = (this.skipIfStartsWith('<') ? this.openBracket() : this.text());
        if (this._options.skipWhitespaceOnlyText) {
            if (token.type === interfaces_1.TokenType.Text &&
                XMLStringLexer.isWhiteSpaceToken(token)) {
                token = this.nextToken();
            }
        }
        return token;
    };
    /**
     * Branches from an opening bracket (`<`).
     */
    XMLStringLexer.prototype.openBracket = function () {
        if (this.skipIfStartsWith('?')) {
            if (this.skipIfStartsWith('xml')) {
                if (XMLStringLexer.isSpace(this._str[this._index])) {
                    return this.declaration();
                }
                else {
                    // a processing instruction starting with xml. e.g. <?xml-stylesheet href="doc.xsl" type="text/xsl"?>
                    this.seek(-3);
                    return this.pi();
                }
            }
            else {
                return this.pi();
            }
        }
        else if (this.skipIfStartsWith('!')) {
            if (this.skipIfStartsWith('--')) {
                return this.comment();
            }
            else if (this.skipIfStartsWith('[CDATA[')) {
                return this.cdata();
            }
            else if (this.skipIfStartsWith('DOCTYPE')) {
                return this.doctype();
            }
            else {
                this.throwError("Invalid '!' in opening tag.");
            }
        }
        else if (this.skipIfStartsWith('/')) {
            return this.closeTag();
        }
        else {
            return this.openTag();
        }
    };
    /**
     * Produces an XML declaration token.
     */
    XMLStringLexer.prototype.declaration = function () {
        var version = '';
        var encoding = '';
        var standalone = '';
        while (!this.eof()) {
            this.skipSpace();
            if (this.skipIfStartsWith('?>')) {
                return { type: interfaces_1.TokenType.Declaration, version: version, encoding: encoding, standalone: standalone };
            }
            else {
                // attribute name
                var _a = __read(this.attribute(), 2), attName = _a[0], attValue = _a[1];
                if (attName === 'version')
                    version = attValue;
                else if (attName === 'encoding')
                    encoding = attValue;
                else if (attName === 'standalone')
                    standalone = attValue;
                else
                    this.throwError('Invalid attribute name: ' + attName);
            }
        }
        this.throwError('Missing declaration end symbol `?>`');
    };
    /**
     * Produces a doc type token.
     */
    XMLStringLexer.prototype.doctype = function () {
        var pubId = '';
        var sysId = '';
        // name
        this.skipSpace();
        var name = this.takeUntil2('[', '>', true);
        this.skipSpace();
        if (this.skipIfStartsWith('PUBLIC')) {
            pubId = this.quotedString();
            sysId = this.quotedString();
        }
        else if (this.skipIfStartsWith('SYSTEM')) {
            sysId = this.quotedString();
        }
        // skip internal subset
        this.skipSpace();
        if (this.skipIfStartsWith('[')) {
            // skip internal subset nodes
            this.skipUntil(']');
            if (!this.skipIfStartsWith(']')) {
                this.throwError('Missing end bracket of DTD internal subset');
            }
        }
        this.skipSpace();
        if (!this.skipIfStartsWith('>')) {
            this.throwError('Missing doctype end symbol `>`');
        }
        return { type: interfaces_1.TokenType.DocType, name: name, pubId: pubId, sysId: sysId };
    };
    /**
     * Produces a processing instruction token.
     */
    XMLStringLexer.prototype.pi = function () {
        var target = this.takeUntilStartsWith('?>', true);
        if (this.eof()) {
            this.throwError('Missing processing instruction end symbol `?>`');
        }
        this.skipSpace();
        if (this.skipIfStartsWith('?>')) {
            return { type: interfaces_1.TokenType.PI, target: target, data: '' };
        }
        var data = this.takeUntilStartsWith('?>');
        if (this.eof()) {
            this.throwError('Missing processing instruction end symbol `?>`');
        }
        this.seek(2);
        return { type: interfaces_1.TokenType.PI, target: target, data: data };
    };
    /**
     * Produces a text token.
     *
     */
    XMLStringLexer.prototype.text = function () {
        var data = this.takeUntil('<');
        return { type: interfaces_1.TokenType.Text, data: data };
    };
    /**
     * Produces a comment token.
     *
     */
    XMLStringLexer.prototype.comment = function () {
        var data = this.takeUntilStartsWith('-->');
        if (this.eof()) {
            this.throwError('Missing comment end symbol `-->`');
        }
        this.seek(3);
        return { type: interfaces_1.TokenType.Comment, data: data };
    };
    /**
     * Produces a CDATA token.
     *
     */
    XMLStringLexer.prototype.cdata = function () {
        var data = this.takeUntilStartsWith(']]>');
        if (this.eof()) {
            this.throwError('Missing CDATA end symbol `]>`');
        }
        this.seek(3);
        return { type: interfaces_1.TokenType.CDATA, data: data };
    };
    /**
     * Produces an element token.
     */
    XMLStringLexer.prototype.openTag = function () {
        // element name
        this.skipSpace();
        var name = this.takeUntil2('>', '/', true);
        this.skipSpace();
        if (this.skipIfStartsWith('>')) {
            return { type: interfaces_1.TokenType.Element, name: name, attributes: [], selfClosing: false };
        }
        else if (this.skipIfStartsWith('/>')) {
            return { type: interfaces_1.TokenType.Element, name: name, attributes: [], selfClosing: true };
        }
        // attributes
        var attributes = [];
        while (!this.eof()) {
            // end tag
            this.skipSpace();
            if (this.skipIfStartsWith('>')) {
                return { type: interfaces_1.TokenType.Element, name: name, attributes: attributes, selfClosing: false };
            }
            else if (this.skipIfStartsWith('/>')) {
                return { type: interfaces_1.TokenType.Element, name: name, attributes: attributes, selfClosing: true };
            }
            var attr = this.attribute();
            attributes.push(attr);
        }
        this.throwError('Missing opening element tag end symbol `>`');
    };
    /**
     * Produces a closing tag token.
     *
     */
    XMLStringLexer.prototype.closeTag = function () {
        this.skipSpace();
        var name = this.takeUntil('>', true);
        this.skipSpace();
        if (!this.skipIfStartsWith('>')) {
            this.throwError('Missing closing element tag end symbol `>`');
        }
        return { type: interfaces_1.TokenType.ClosingTag, name: name };
    };
    /**
     * Reads an attribute name, value pair
     */
    XMLStringLexer.prototype.attribute = function () {
        // attribute name
        this.skipSpace();
        var name = this.takeUntil('=', true);
        this.skipSpace();
        if (!this.skipIfStartsWith('=')) {
            this.throwError('Missing equals sign before attribute value');
        }
        // attribute value
        var value = this.quotedString();
        return [name, value];
    };
    /**
     * Reads a string between double or single quotes.
     */
    XMLStringLexer.prototype.quotedString = function () {
        this.skipSpace();
        var startQuote = this.take(1);
        if (!XMLStringLexer.isQuote(startQuote)) {
            this.throwError('Missing start quote character before quoted value');
        }
        var value = this.takeUntil(startQuote);
        if (!this.skipIfStartsWith(startQuote)) {
            this.throwError('Missing end quote character after quoted value');
        }
        return value;
    };
    /**
     * Determines if the current index is at or past the end of input string.
     */
    XMLStringLexer.prototype.eof = function () { return this._index >= this._length; };
    /**
     * Skips the length of the given string if the string from current position
     * starts with the given string.
     *
     * @param str - the string to match
     */
    XMLStringLexer.prototype.skipIfStartsWith = function (str) {
        var strLength = str.length;
        if (strLength === 1) {
            if (this._str[this._index] === str) {
                this._index++;
                return true;
            }
            else {
                return false;
            }
        }
        for (var i = 0; i < strLength; i++) {
            if (this._str[this._index + i] !== str[i])
                return false;
        }
        this._index += strLength;
        return true;
    };
    /**
     * Seeks a number of character codes.
     *
     * @param count - number of characters to skip
     */
    XMLStringLexer.prototype.seek = function (count) {
        this._index += count;
        if (this._index < 0)
            this._index = 0;
        if (this._index > this._length)
            this._index = this._length;
    };
    /**
     * Skips space characters.
     */
    XMLStringLexer.prototype.skipSpace = function () {
        while (!this.eof() && (XMLStringLexer.isSpace(this._str[this._index]))) {
            this._index++;
        }
    };
    /**
     * Takes a given number of characters.
     *
     * @param count - character count
     */
    XMLStringLexer.prototype.take = function (count) {
        if (count === 1) {
            return this._str[this._index++];
        }
        var startIndex = this._index;
        this.seek(count);
        return this._str.slice(startIndex, this._index);
    };
    /**
     * Takes characters until the next character matches `char`.
     *
     * @param char - a character to match
     * @param space - whether a space character stops iteration
     */
    XMLStringLexer.prototype.takeUntil = function (char, space) {
        if (space === void 0) { space = false; }
        var startIndex = this._index;
        while (this._index < this._length) {
            var c = this._str[this._index];
            if (c !== char && (!space || !XMLStringLexer.isSpace(c))) {
                this._index++;
            }
            else {
                break;
            }
        }
        return this._str.slice(startIndex, this._index);
    };
    /**
     * Takes characters until the next character matches `char1` or `char1`.
     *
     * @param char1 - a character to match
     * @param char2 - a character to match
     * @param space - whether a space character stops iteration
     */
    XMLStringLexer.prototype.takeUntil2 = function (char1, char2, space) {
        if (space === void 0) { space = false; }
        var startIndex = this._index;
        while (this._index < this._length) {
            var c = this._str[this._index];
            if (c !== char1 && c !== char2 && (!space || !XMLStringLexer.isSpace(c))) {
                this._index++;
            }
            else {
                break;
            }
        }
        return this._str.slice(startIndex, this._index);
    };
    /**
     * Takes characters until the next characters matches `str`.
     *
     * @param str - a string to match
     * @param space - whether a space character stops iteration
     */
    XMLStringLexer.prototype.takeUntilStartsWith = function (str, space) {
        if (space === void 0) { space = false; }
        var startIndex = this._index;
        var strLength = str.length;
        while (this._index < this._length) {
            var match = true;
            for (var i = 0; i < strLength; i++) {
                var c = this._str[this._index + i];
                var char = str[i];
                if (space && XMLStringLexer.isSpace(c)) {
                    return this._str.slice(startIndex, this._index);
                }
                else if (c !== char) {
                    this._index++;
                    match = false;
                    break;
                }
            }
            if (match)
                return this._str.slice(startIndex, this._index);
        }
        this._index = this._length;
        return this._str.slice(startIndex);
    };
    /**
     * Skips characters until the next character matches `char`.
     *
     * @param char - a character to match
     */
    XMLStringLexer.prototype.skipUntil = function (char) {
        while (this._index < this._length) {
            var c = this._str[this._index];
            if (c !== char) {
                this._index++;
            }
            else {
                break;
            }
        }
    };
    /**
     * Determines if the given token is entirely whitespace.
     *
     * @param token - the token to check
     */
    XMLStringLexer.isWhiteSpaceToken = function (token) {
        var str = token.data;
        for (var i = 0; i < str.length; i++) {
            var c = str[i];
            if (c !== ' ' && c !== '\n' && c !== '\r' && c !== '\t' && c !== '\f')
                return false;
        }
        return true;
    };
    /**
     * Determines if the given character is whitespace.
     *
     * @param char - the character to check
     */
    XMLStringLexer.isSpace = function (char) {
        return char === ' ' || char === '\n' || char === '\r' || char === '\t';
    };
    /**
     * Determines if the given character is a quote character.
     *
     * @param char - the character to check
     */
    XMLStringLexer.isQuote = function (char) {
        return (char === '"' || char === '\'');
    };
    /**
     * Throws a parser error and records the line and column numbers in the parsed
     * string.
     *
     * @param msg - error message
     */
    XMLStringLexer.prototype.throwError = function (msg) {
        var regexp = /\r\n|\r|\n/g;
        var match = null;
        var line = 0;
        var firstNewLineIndex = 0;
        var lastNewlineIndex = this._str.length;
        while ((match = regexp.exec(this._str)) !== null) {
            if (match === null)
                break;
            line++;
            if (match.index < this._index)
                firstNewLineIndex = regexp.lastIndex;
            if (match.index > this._index) {
                lastNewlineIndex = match.index;
                break;
            }
        }
        this.err = {
            line: line,
            col: this._index - firstNewLineIndex,
            index: this._index,
            str: this._str.substring(firstNewLineIndex, lastNewlineIndex)
        };
        throw new Error(msg + "\nIndex: " + this.err.index +
            "\nLn: " + this.err.line + ", Col: " + this.err.col +
            "\nInput: " + this.err.str);
    };
    /**
     * Returns an iterator for the lexer.
     */
    XMLStringLexer.prototype[Symbol.iterator] = function () {
        this._index = 0;
        return {
            next: function () {
                var token = this.nextToken();
                if (token.type === interfaces_1.TokenType.EOF) {
                    return { done: true, value: null };
                }
                else {
                    return { done: false, value: token };
                }
            }.bind(this)
        };
    };
    return XMLStringLexer;
}());
exports.XMLStringLexer = XMLStringLexer;
//# sourceMappingURL=XMLStringLexer.js.map