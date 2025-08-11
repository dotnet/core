// @ts-check

import { addErrorDetailIf } from "../helpers/helpers.cjs";
import { filterByTypesCached, getReferenceLinkImageData } from "./cache.mjs";
import { addRangeToSet, getDescendantsByType } from "../helpers/micromark-helpers.cjs";

const longLineRePrefix = "^.{";
const longLineRePostfixRelaxed = "}.*\\s.*$";
const longLineRePostfixStrict = "}.+$";
const sternModeRe = /^(?:[#>\s]*\s)?\S*$/;

/** @typedef {import("micromark-extension-gfm-autolink-literal")} */
/** @typedef {import("micromark-extension-gfm-table")} */

/** @type {import("markdownlint").Rule} */
export default {
  "names": [ "MD013", "line-length" ],
  "description": "Line length",
  "tags": [ "line_length" ],
  "parser": "micromark",
  "function": function MD013(params, onError) {
    const lineLength = Number(params.config.line_length || 80);
    const headingLineLength =
      Number(params.config.heading_line_length || lineLength);
    const codeLineLength =
      Number(params.config.code_block_line_length || lineLength);
    const strict = !!params.config.strict;
    const stern = !!params.config.stern;
    const longLineRePostfix =
      (strict || stern) ? longLineRePostfixStrict : longLineRePostfixRelaxed;
    const longLineRe =
      new RegExp(longLineRePrefix + lineLength + longLineRePostfix);
    const longHeadingLineRe =
      new RegExp(longLineRePrefix + headingLineLength + longLineRePostfix);
    const longCodeLineRe =
      new RegExp(longLineRePrefix + codeLineLength + longLineRePostfix);
    const codeBlocks = params.config.code_blocks;
    const includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;
    const tables = params.config.tables;
    const includeTables = (tables === undefined) ? true : !!tables;
    const headings = params.config.headings;
    const includeHeadings = (headings === undefined) ? true : !!headings;
    const headingLineNumbers = new Set();
    for (const heading of filterByTypesCached([ "atxHeading", "setextHeading" ])) {
      addRangeToSet(headingLineNumbers, heading.startLine, heading.endLine);
    }
    const codeBlockLineNumbers = new Set();
    for (const codeBlock of filterByTypesCached([ "codeFenced", "codeIndented" ])) {
      addRangeToSet(codeBlockLineNumbers, codeBlock.startLine, codeBlock.endLine);
    }
    const tableLineNumbers = new Set();
    for (const table of filterByTypesCached([ "table" ])) {
      addRangeToSet(tableLineNumbers, table.startLine, table.endLine);
    }
    const linkLineNumbers = new Set();
    for (const link of filterByTypesCached([ "autolink", "image", "link", "literalAutolink" ])) {
      addRangeToSet(linkLineNumbers, link.startLine, link.endLine);
    }
    const paragraphDataLineNumbers = new Set();
    for (const paragraph of filterByTypesCached([ "paragraph" ])) {
      for (const data of getDescendantsByType(paragraph, [ "data" ])) {
        addRangeToSet(paragraphDataLineNumbers, data.startLine, data.endLine);
      }
    }
    const linkOnlyLineNumbers = new Set();
    for (const lineNumber of linkLineNumbers) {
      if (!paragraphDataLineNumbers.has(lineNumber)) {
        linkOnlyLineNumbers.add(lineNumber);
      }
    }
    const definitionLineIndices = new Set(getReferenceLinkImageData().definitionLineIndices);
    for (let lineIndex = 0; lineIndex < params.lines.length; lineIndex++) {
      const line = params.lines[lineIndex];
      const lineNumber = lineIndex + 1;
      const isHeading = headingLineNumbers.has(lineNumber);
      const inCode = codeBlockLineNumbers.has(lineNumber);
      const inTable = tableLineNumbers.has(lineNumber);
      const length = inCode ?
        codeLineLength :
        (isHeading ? headingLineLength : lineLength);
      const lengthRe = inCode ?
        longCodeLineRe :
        (isHeading ? longHeadingLineRe : longLineRe);
      if ((includeCodeBlocks || !inCode) &&
          (includeTables || !inTable) &&
          (includeHeadings || !isHeading) &&
          !definitionLineIndices.has(lineIndex) &&
          (strict ||
           (!(stern && sternModeRe.test(line)) &&
            !linkOnlyLineNumbers.has(lineNumber))) &&
          lengthRe.test(line)) {
        addErrorDetailIf(
          onError,
          lineNumber,
          length,
          line.length,
          undefined,
          undefined,
          [ length + 1, line.length - length ]
        );
      }
    }
  }
};
