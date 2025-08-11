/**
 * A surrogate is a code point that is in the range U+D800 to U+DFFF, inclusive.
 */
export declare const Surrogate: RegExp;
/**
 * A scalar value is a code point that is not a surrogate.
 */
export declare const ScalarValue: RegExp;
/**
 * A noncharacter is a code point that is in the range U+FDD0 to U+FDEF,
 * inclusive, or U+FFFE, U+FFFF, U+1FFFE, U+1FFFF, U+2FFFE, U+2FFFF, U+3FFFE,
 * U+3FFFF, U+4FFFE, U+4FFFF, U+5FFFE, U+5FFFF, U+6FFFE, U+6FFFF, U+7FFFE,
 * U+7FFFF, U+8FFFE, U+8FFFF, U+9FFFE, U+9FFFF, U+AFFFE, U+AFFFF, U+BFFFE,
 * U+BFFFF, U+CFFFE, U+CFFFF, U+DFFFE, U+DFFFF, U+EFFFE, U+EFFFF, U+FFFFE,
 * U+FFFFF, U+10FFFE, or U+10FFFF.
 */
export declare const NonCharacter: RegExp;
/**
 * An ASCII code point is a code point in the range U+0000 NULL to U+007F
 * DELETE, inclusive.
 */
export declare const ASCIICodePoint: RegExp;
/**
 * An ASCII tab or newline is U+0009 TAB, U+000A LF, or U+000D CR.
 */
export declare const ASCIITabOrNewLine: RegExp;
/**
 * ASCII whitespace is U+0009 TAB, U+000A LF, U+000C FF, U+000D CR, or
 * U+0020 SPACE.
 */
export declare const ASCIIWhiteSpace: RegExp;
/**
 * A C0 control is a code point in the range U+0000 NULL to U+001F
 * INFORMATION SEPARATOR ONE, inclusive.
 */
export declare const C0Control: RegExp;
/**
 * A C0 control or space is a C0 control or U+0020 SPACE.
 */
export declare const C0ControlOrSpace: RegExp;
/**
 * A control is a C0 control or a code point in the range U+007F DELETE to
 * U+009F APPLICATION PROGRAM COMMAND, inclusive.
 */
export declare const Control: RegExp;
/**
 * An ASCII digit is a code point in the range U+0030 (0) to U+0039 (9),
 * inclusive.
 */
export declare const ASCIIDigit: RegExp;
/**
 * An ASCII upper hex digit is an ASCII digit or a code point in the range
 * U+0041 (A) to U+0046 (F), inclusive.
 */
export declare const ASCIIUpperHexDigit: RegExp;
/**
 * An ASCII lower hex digit is an ASCII digit or a code point in the range
 * U+0061 (a) to U+0066 (f), inclusive.
 */
export declare const ASCIILowerHexDigit: RegExp;
/**
 * An ASCII hex digit is an ASCII upper hex digit or ASCII lower hex digit.
 */
export declare const ASCIIHexDigit: RegExp;
/**
 * An ASCII upper alpha is a code point in the range U+0041 (A) to U+005A (Z),
 * inclusive.
 */
export declare const ASCIIUpperAlpha: RegExp;
/**
 * An ASCII lower alpha is a code point in the range U+0061 (a) to U+007A (z),
 * inclusive.
 */
export declare const ASCIILowerAlpha: RegExp;
/**
 * An ASCII alpha is an ASCII upper alpha or ASCII lower alpha.
 */
export declare const ASCIIAlpha: RegExp;
/**
 * An ASCII alphanumeric is an ASCII digit or ASCII alpha.
 */
export declare const ASCIIAlphanumeric: RegExp;
