// @ts-check

import { addError, hasOverlap } from "../helpers/helpers.cjs";
import { addRangeToSet } from "../helpers/micromark-helpers.cjs";
import { filterByTypesCached } from "./cache.mjs";

const reversedLinkRe = /(^|[^\\])\(([^()]+)\)\[([^\]^][^\]]*)\](?!\()/g;

/** @type {import("markdownlint").Rule} */
export default {
  "names": [ "MD011", "no-reversed-links" ],
  "description": "Reversed link syntax",
  "tags": [ "links" ],
  "parser": "micromark",
  "function": function MD011(params, onError) {
    const codeBlockLineNumbers = new Set();
    for (const codeBlock of filterByTypesCached([ "codeFenced", "codeIndented" ])) {
      addRangeToSet(codeBlockLineNumbers, codeBlock.startLine, codeBlock.endLine);
    }
    const codeTexts = filterByTypesCached([ "codeText" ]);
    for (const [ lineIndex, line ] of params.lines.entries()) {
      const lineNumber = lineIndex + 1;
      if (!codeBlockLineNumbers.has(lineNumber)) {
        let match = null;
        while ((match = reversedLinkRe.exec(line)) !== null) {
          const [ reversedLink, preChar, linkText, linkDestination ] = match;
          if (
            !linkText.endsWith("\\") &&
            !linkDestination.endsWith("\\")
          ) {
            const column = match.index + preChar.length + 1;
            const length = match[0].length - preChar.length;
            /** @type {import("../helpers/helpers.cjs").FileRange} */
            const range = { "startLine": lineNumber, "startColumn": column, "endLine": lineNumber, "endColumn": column + length - 1 };
            if (!codeTexts.some((codeText) => hasOverlap(codeText, range))) {
              addError(
                onError,
                lineNumber,
                reversedLink.slice(preChar.length),
                undefined,
                [ column, length ],
                {
                  "editColumn": column,
                  "deleteCount": length,
                  "insertText": `[${linkText}](${linkDestination})`
                }
              );
            }
          }
        }
      }
    }
  }
};
