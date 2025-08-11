"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines the type of a token.
 */
var TokenType;
(function (TokenType) {
    TokenType[TokenType["EOF"] = 0] = "EOF";
    TokenType[TokenType["Declaration"] = 1] = "Declaration";
    TokenType[TokenType["DocType"] = 2] = "DocType";
    TokenType[TokenType["Element"] = 3] = "Element";
    TokenType[TokenType["Text"] = 4] = "Text";
    TokenType[TokenType["CDATA"] = 5] = "CDATA";
    TokenType[TokenType["PI"] = 6] = "PI";
    TokenType[TokenType["Comment"] = 7] = "Comment";
    TokenType[TokenType["ClosingTag"] = 8] = "ClosingTag";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
//# sourceMappingURL=interfaces.js.map