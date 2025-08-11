// @ts-check

import { addErrorDetailIf } from "../helpers/helpers.cjs";
import { getHeadingLevel } from "../helpers/micromark-helpers.cjs";
import { filterByTypesCached } from "./cache.mjs";

/** @type {import("markdownlint").Rule} */
export default {
  "names": [ "MD001", "heading-increment" ],
  "description": "Heading levels should only increment by one level at a time",
  "tags": [ "headings" ],
  "parser": "micromark",
  "function": function MD001(params, onError) {
    let prevLevel = Number.MAX_SAFE_INTEGER;
    for (const heading of filterByTypesCached([ "atxHeading", "setextHeading" ])) {
      const level = getHeadingLevel(heading);
      if (level > prevLevel) {
        addErrorDetailIf(
          onError,
          heading.startLine,
          `h${prevLevel + 1}`,
          `h${level}`
        );
      }
      prevLevel = level;
    }
  }
};
