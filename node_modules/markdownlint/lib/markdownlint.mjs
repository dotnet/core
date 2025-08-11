// @ts-check

// @ts-ignore
import { fs as nodeFs, os, path } from "#node-imports";
import { initialize as cacheInitialize } from "./cache.mjs";
import { version } from "./constants.mjs";
import { requireMarkdownItCjs } from "./defer-require.cjs";
import { resolveModule } from "./resolve-module.cjs";
import rules from "./rules.mjs";
import { parse as micromarkParse } from "./micromark-parse.mjs";
import parseConfiguration from "./parse-configuration.mjs";
import * as helpers from "../helpers/helpers.cjs";

/**
 * Validate the list of rules for structure and reuse.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {boolean} synchronous Whether to execute synchronously.
 * @returns {Error | null} Error message if validation fails.
 */
function validateRuleList(ruleList, synchronous) {
  let result = null;
  if (ruleList.length === rules.length) {
    // No need to validate if only using built-in rules
    return result;
  }
  const allIds = {};
  for (const [ index, rule ] of ruleList.entries()) {
    const customIndex = index - rules.length;
    // eslint-disable-next-line jsdoc/require-jsdoc
    function newError(property, value) {
      return new Error(
        `Property '${property}' of custom rule at index ${customIndex} is incorrect: '${value}'.`);
    }
    for (const property of [ "names", "tags" ]) {
      const value = rule[property];
      if (!result &&
        (!value || !Array.isArray(value) || (value.length === 0) ||
         !value.every(helpers.isString) || value.some(helpers.isEmptyString))) {
        result = newError(property, value);
      }
    }
    for (const propertyInfo of [
      [ "description", "string" ],
      [ "function", "function" ]
    ]) {
      const property = propertyInfo[0];
      const value = rule[property];
      if (!result && (!value || (typeof value !== propertyInfo[1]))) {
        result = newError(property, value);
      }
    }
    if (
      !result &&
      (rule.parser !== undefined) &&
      (rule.parser !== "markdownit") &&
      (rule.parser !== "micromark") &&
      (rule.parser !== "none")
    ) {
      result = newError("parser", rule.parser);
    }
    if (
      !result &&
      rule.information &&
      !helpers.isUrl(rule.information)
    ) {
      result = newError("information", rule.information);
    }
    if (
      !result &&
      (rule.asynchronous !== undefined) &&
      (typeof rule.asynchronous !== "boolean")
    ) {
      result = newError("asynchronous", rule.asynchronous);
    }
    if (!result && rule.asynchronous && synchronous) {
      result = new Error(
        "Custom rule " + rule.names.join("/") + " at index " + customIndex +
        " is asynchronous and can not be used in a synchronous context."
      );
    }
    if (!result) {
      for (const name of rule.names) {
        const nameUpper = name.toUpperCase();
        if (!result && (allIds[nameUpper] !== undefined)) {
          result = new Error("Name '" + name + "' of custom rule at index " +
            customIndex + " is already used as a name or tag.");
        }
        allIds[nameUpper] = true;
      }
      for (const tag of rule.tags) {
        const tagUpper = tag.toUpperCase();
        if (!result && allIds[tagUpper]) {
          result = new Error("Tag '" + tag + "' of custom rule at index " +
            customIndex + " is already used as a name.");
        }
        allIds[tagUpper] = false;
      }
    }
  }
  return result;
}

/**
 * Creates a LintResults instance with toString for pretty display.
 *
 * @param {Rule[]} ruleList List of rules.
 * @returns {LintResults} New LintResults instance.
 */
function newResults(ruleList) {
  const lintResults = {};
  // eslint-disable-next-line jsdoc/require-jsdoc
  function toString(useAlias) {
    let ruleNameToRule = null;
    const results = [];
    const keys = Object.keys(lintResults);
    keys.sort();
    for (const file of keys) {
      const fileResults = lintResults[file];
      if (Array.isArray(fileResults)) {
        for (const result of fileResults) {
          const ruleMoniker = result.ruleNames ?
            result.ruleNames.join("/") :
            (result.ruleName + "/" + result.ruleAlias);
          results.push(
            file + ": " +
            result.lineNumber + ": " +
            ruleMoniker + " " +
            result.ruleDescription +
            (result.errorDetail ?
              " [" + result.errorDetail + "]" :
              "") +
            (result.errorContext ?
              " [Context: \"" + result.errorContext + "\"]" :
              ""));
        }
      } else {
        if (!ruleNameToRule) {
          ruleNameToRule = {};
          for (const rule of ruleList) {
            const ruleName = rule.names[0].toUpperCase();
            ruleNameToRule[ruleName] = rule;
          }
        }
        for (const [ ruleName, ruleResults ] of Object.entries(fileResults)) {
          const rule = ruleNameToRule[ruleName.toUpperCase()];
          for (const lineNumber of ruleResults) {
            // @ts-ignore
            const nameIndex = Math.min(useAlias ? 1 : 0, rule.names.length - 1);
            const result =
              file + ": " +
              lineNumber + ": " +
              // @ts-ignore
              rule.names[nameIndex] + " " +
              // @ts-ignore
              rule.description;
            results.push(result);
          }
        }
      }
    }
    return results.join("\n");
  }
  Object.defineProperty(lintResults, "toString", { "value": toString });
  // @ts-ignore
  return lintResults;
}

/**
 * Remove front matter (if present at beginning of content).
 *
 * @param {string} content Markdown content.
 * @param {RegExp | null} frontMatter Regular expression to match front matter.
 * @returns {Object} Trimmed content and front matter lines.
 */
function removeFrontMatter(content, frontMatter) {
  let frontMatterLines = [];
  if (frontMatter) {
    const frontMatterMatch = content.match(frontMatter);
    if (frontMatterMatch && !frontMatterMatch.index) {
      const contentMatched = frontMatterMatch[0];
      content = content.slice(contentMatched.length);
      frontMatterLines = contentMatched.split(helpers.newLineRe);
      if ((frontMatterLines.length > 0) &&
          (frontMatterLines[frontMatterLines.length - 1] === "")) {
        frontMatterLines.length--;
      }
    }
  }
  return {
    "content": content,
    "frontMatterLines": frontMatterLines
  };
}

/**
 * Map rule names/tags to canonical rule name.
 *
 * @param {Rule[]} ruleList List of rules.
 * @returns {Object.<string, string[]>} Map of alias to rule name.
 */
function mapAliasToRuleNames(ruleList) {
  const aliasToRuleNames = {};
  // const tagToRuleNames = {};
  for (const rule of ruleList) {
    const ruleName = rule.names[0].toUpperCase();
    // The following is useful for updating README.md:
    // console.log(
    //   "* **[" + ruleName + "](doc/Rules.md#" + ruleName.toLowerCase() +
    //    ")** *" + rule.names.slice(1).join("/") + "* - " + rule.description);
    for (const name of rule.names) {
      const nameUpper = name.toUpperCase();
      aliasToRuleNames[nameUpper] = [ ruleName ];
    }
    for (const tag of rule.tags) {
      const tagUpper = tag.toUpperCase();
      const ruleNames = aliasToRuleNames[tagUpper] || [];
      ruleNames.push(ruleName);
      aliasToRuleNames[tagUpper] = ruleNames;
      // tagToRuleNames[tag] = ruleName;
    }
  }
  // The following is useful for updating README.md:
  // Object.keys(tagToRuleNames).sort().forEach(function forTag(tag) {
  //   console.log("* **" + tag + "** - " +
  //     aliasToRuleNames[tag.toUpperCase()].join(", "));
  // });
  // @ts-ignore
  return aliasToRuleNames;
}

/**
 * Apply (and normalize) configuration object.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {Configuration} config Configuration object.
 * @param {Object.<string, string[]>} aliasToRuleNames Map of alias to rule
 * names.
 * @returns {Configuration} Effective configuration.
 */
function getEffectiveConfig(ruleList, config, aliasToRuleNames) {
  const defaultKey = Object.keys(config).filter(
    (key) => key.toUpperCase() === "DEFAULT"
  );
  const ruleDefault = (defaultKey.length === 0) || !!config[defaultKey[0]];
  /** @type {Configuration} */
  const effectiveConfig = {};
  for (const rule of ruleList) {
    const ruleName = rule.names[0].toUpperCase();
    effectiveConfig[ruleName] = ruleDefault;
  }
  // for (const ruleName of deprecatedRuleNames) {
  //   effectiveConfig[ruleName] = false;
  // }
  for (const key of Object.keys(config)) {
    let value = config[key];
    if (value) {
      if (!(value instanceof Object)) {
        value = {};
      }
    } else {
      value = false;
    }
    const keyUpper = key.toUpperCase();
    for (const ruleName of (aliasToRuleNames[keyUpper] || [])) {
      effectiveConfig[ruleName] = value;
    }
  }
  return effectiveConfig;
}

/**
 * Result object for getEnabledRulesPerLineNumber.
 *
 * @typedef {Object} EnabledRulesPerLineNumberResult
 * @property {Configuration} effectiveConfig Effective configuration.
 * @property {any[]} enabledRulesPerLineNumber Enabled rules per line number.
 * @property {Rule[]} enabledRuleList Enabled rule list.
 */

/**
 * Create a mapping of enabled rules per line.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {string[]} lines List of content lines.
 * @param {string[]} frontMatterLines List of front matter lines.
 * @param {boolean} noInlineConfig Whether to allow inline configuration.
 * @param {Configuration} config Configuration object.
 * @param {ConfigurationParser[] | undefined} configParsers Configuration parsers.
 * @param {Object.<string, string[]>} aliasToRuleNames Map of alias to rule
 * names.
 * @returns {EnabledRulesPerLineNumberResult} Effective configuration and enabled rules per line number.
 */
function getEnabledRulesPerLineNumber(
  ruleList,
  lines,
  frontMatterLines,
  noInlineConfig,
  config,
  configParsers,
  aliasToRuleNames) {
  // Shared variables
  let enabledRules = {};
  let capturedRules = {};
  const allRuleNames = [];
  const enabledRulesPerLineNumber = new Array(1 + frontMatterLines.length);
  // Helper functions
  // eslint-disable-next-line jsdoc/require-jsdoc
  function handleInlineConfig(input, forEachMatch, forEachLine) {
    for (const [ lineIndex, line ] of input.entries()) {
      if (!noInlineConfig) {
        let match = null;
        while ((match = helpers.inlineCommentStartRe.exec(line))) {
          const action = match[2].toUpperCase();
          const startIndex = match.index + match[1].length;
          const endIndex = line.indexOf("-->", startIndex);
          if (endIndex === -1) {
            break;
          }
          const parameter = line.slice(startIndex, endIndex);
          forEachMatch(action, parameter, lineIndex + 1);
        }
      }
      if (forEachLine) {
        forEachLine();
      }
    }
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function configureFile(action, parameter) {
    if (action === "CONFIGURE-FILE") {
      const { "config": parsed } = parseConfiguration(
        "CONFIGURE-FILE", parameter, configParsers
      );
      if (parsed) {
        config = {
          ...config,
          ...parsed
        };
      }
    }
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function applyEnableDisable(action, parameter, state) {
    state = { ...state };
    const enabled = (action.startsWith("ENABLE"));
    const trimmed = parameter && parameter.trim();
    const items = trimmed ? trimmed.toUpperCase().split(/\s+/) : allRuleNames;
    for (const nameUpper of items) {
      for (const ruleName of (aliasToRuleNames[nameUpper] || [])) {
        state[ruleName] = enabled;
      }
    }
    return state;
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function enableDisableFile(action, parameter) {
    if ((action === "ENABLE-FILE") || (action === "DISABLE-FILE")) {
      enabledRules = applyEnableDisable(action, parameter, enabledRules);
    }
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function captureRestoreEnableDisable(action, parameter) {
    if (action === "CAPTURE") {
      capturedRules = enabledRules;
    } else if (action === "RESTORE") {
      enabledRules = capturedRules;
    } else if ((action === "ENABLE") || (action === "DISABLE")) {
      enabledRules = applyEnableDisable(action, parameter, enabledRules);
    }
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function updateLineState() {
    enabledRulesPerLineNumber.push(enabledRules);
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  function disableLineNextLine(action, parameter, lineNumber) {
    const disableLine = (action === "DISABLE-LINE");
    const disableNextLine = (action === "DISABLE-NEXT-LINE");
    if (disableLine || disableNextLine) {
      const nextLineNumber =
        frontMatterLines.length + lineNumber + (disableNextLine ? 1 : 0);
      enabledRulesPerLineNumber[nextLineNumber] =
        applyEnableDisable(
          action,
          parameter,
          enabledRulesPerLineNumber[nextLineNumber]
        );
    }
  }
  // Handle inline comments
  handleInlineConfig([ lines.join("\n") ], configureFile);
  const effectiveConfig = getEffectiveConfig(
    ruleList, config, aliasToRuleNames);
  for (const rule of ruleList) {
    const ruleName = rule.names[0].toUpperCase();
    allRuleNames.push(ruleName);
    enabledRules[ruleName] = !!effectiveConfig[ruleName];
  }
  capturedRules = enabledRules;
  handleInlineConfig(lines, enableDisableFile);
  handleInlineConfig(lines, captureRestoreEnableDisable, updateLineState);
  handleInlineConfig(lines, disableLineNextLine);
  // Create the list of rules that are used at least once
  const enabledRuleList = [];
  for (const [ index, ruleName ] of allRuleNames.entries()) {
    if (enabledRulesPerLineNumber.some((enabledRulesForLine) => enabledRulesForLine[ruleName])) {
      enabledRuleList.push(ruleList[index]);
    }
  }
  // Return results
  return {
    effectiveConfig,
    enabledRulesPerLineNumber,
    enabledRuleList
  };
}

/**
 * Lints a string containing Markdown content.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {Object.<string, string[]>} aliasToRuleNames Map of alias to rule names.
 * @param {string} name Identifier for the content.
 * @param {string} content Markdown content.
 * @param {MarkdownItFactory} markdownItFactory Function to create a markdown-it parser.
 * @param {Configuration} config Configuration object.
 * @param {ConfigurationParser[] | undefined} configParsers Configuration parsers.
 * @param {RegExp | null} frontMatter Regular expression for front matter.
 * @param {boolean} handleRuleFailures Whether to handle exceptions in rules.
 * @param {boolean} noInlineConfig Whether to allow inline configuration.
 * @param {number} resultVersion Version of the LintResults object to return.
 * @param {boolean} synchronous Whether to execute synchronously.
 * @param {LintContentCallback} callback Callback (err, result) function.
 * @returns {void}
 */
function lintContent(
  ruleList,
  aliasToRuleNames,
  name,
  content,
  markdownItFactory,
  config,
  configParsers,
  frontMatter,
  handleRuleFailures,
  noInlineConfig,
  resultVersion,
  synchronous,
  callback) {
  // Provide a consistent error-reporting callback
  const callbackError = (error) => callback(error instanceof Error ? error : new Error(error));
  // Remove UTF-8 byte order marker (if present)
  content = content.replace(/^\uFEFF/, "");
  // Remove front matter
  const removeFrontMatterResult = removeFrontMatter(content, frontMatter);
  const { frontMatterLines } = removeFrontMatterResult;
  content = removeFrontMatterResult.content;
  // Get enabled rules per line (with HTML comments present)
  const { effectiveConfig, enabledRulesPerLineNumber, enabledRuleList } =
    getEnabledRulesPerLineNumber(
      ruleList,
      content.split(helpers.newLineRe),
      frontMatterLines,
      noInlineConfig,
      config,
      configParsers,
      aliasToRuleNames
    );
  const needMarkdownItTokens = enabledRuleList.some(
    (rule) => (rule.parser === "markdownit") || (rule.parser === undefined)
  );
  const needMicromarkTokens = enabledRuleList.some(
    (rule) => (rule.parser === "micromark")
  );
  const customRulesPresent = (ruleList.length !== rules.length);
  // Parse content into parser tokens
  const micromarkTokens = needMicromarkTokens ?
    micromarkParse(content, { "freezeTokens": customRulesPresent }) :
    [];
  // Hide the content of HTML comments from rules
  const preClearedContent = content;
  content = helpers.clearHtmlCommentText(content);
  // Parse content into lines and get markdown-it tokens
  const lines = content.split(helpers.newLineRe);
  // Function to run after fetching markdown-it tokens (when needed)
  const lintContentInternal = (markdownitTokens) => {
    // Create (frozen) parameters for rules
    /** @type {MarkdownParsers} */
    // @ts-ignore
    const parsersMarkdownIt = Object.freeze({
      "markdownit": Object.freeze({
        "tokens": markdownitTokens
      })
    });
    /** @type {MarkdownParsers} */
    // @ts-ignore
    const parsersMicromark = Object.freeze({
      "micromark": Object.freeze({
        "tokens": micromarkTokens
      })
    });
    /** @type {MarkdownParsers} */
    // @ts-ignore
    const parsersNone = Object.freeze({});
    const paramsBase = {
      name,
      version,
      "lines": Object.freeze(lines),
      "frontMatterLines": Object.freeze(frontMatterLines)
    };
    cacheInitialize({
      ...paramsBase,
      "parsers": parsersMicromark,
      "config": null
    });
    // Function to run for each rule
    let results = [];
    /**
     * @param {Rule} rule Rule.
     * @returns {Promise<void> | null} Promise.
     */
    const forRule = (rule) => {
      // Configure rule
      const ruleName = rule.names[0].toUpperCase();
      const tokens = {};
      let parsers = parsersNone;
      if (rule.parser === undefined) {
        tokens.tokens = markdownitTokens;
        parsers = parsersMarkdownIt;
      } else if (rule.parser === "markdownit") {
        parsers = parsersMarkdownIt;
      } else if (rule.parser === "micromark") {
        parsers = parsersMicromark;
      }
      const params = {
        ...paramsBase,
        ...tokens,
        parsers,
        "config": effectiveConfig[ruleName]
      };
      // eslint-disable-next-line jsdoc/require-jsdoc
      function throwError(property) {
        throw new Error(
          `Value of '${property}' passed to onError by '${ruleName}' is incorrect for '${name}'.`);
      }
      // eslint-disable-next-line jsdoc/require-jsdoc
      function onError(errorInfo) {
        if (!errorInfo ||
          !helpers.isNumber(errorInfo.lineNumber) ||
          (errorInfo.lineNumber < 1) ||
          (errorInfo.lineNumber > lines.length)) {
          throwError("lineNumber");
        }
        const lineNumber = errorInfo.lineNumber + frontMatterLines.length;
        if (!enabledRulesPerLineNumber[lineNumber][ruleName]) {
          return;
        }
        if (errorInfo.detail &&
          !helpers.isString(errorInfo.detail)) {
          throwError("detail");
        }
        if (errorInfo.context &&
          !helpers.isString(errorInfo.context)) {
          throwError("context");
        }
        if (errorInfo.information &&
          !helpers.isUrl(errorInfo.information)) {
          throwError("information");
        }
        if (errorInfo.range &&
          (!Array.isArray(errorInfo.range) ||
            (errorInfo.range.length !== 2) ||
            !helpers.isNumber(errorInfo.range[0]) ||
            (errorInfo.range[0] < 1) ||
            !helpers.isNumber(errorInfo.range[1]) ||
            (errorInfo.range[1] < 1) ||
            ((errorInfo.range[0] + errorInfo.range[1] - 1) >
            lines[errorInfo.lineNumber - 1].length))) {
          throwError("range");
        }
        const fixInfo = errorInfo.fixInfo;
        const cleanFixInfo = {};
        if (fixInfo) {
          if (!helpers.isObject(fixInfo)) {
            throwError("fixInfo");
          }
          if (fixInfo.lineNumber !== undefined) {
            if ((!helpers.isNumber(fixInfo.lineNumber) ||
              (fixInfo.lineNumber < 1) ||
              (fixInfo.lineNumber > lines.length))) {
              throwError("fixInfo.lineNumber");
            }
            cleanFixInfo.lineNumber =
              fixInfo.lineNumber + frontMatterLines.length;
          }
          const effectiveLineNumber = fixInfo.lineNumber || errorInfo.lineNumber;
          if (fixInfo.editColumn !== undefined) {
            if ((!helpers.isNumber(fixInfo.editColumn) ||
              (fixInfo.editColumn < 1) ||
              (fixInfo.editColumn >
                lines[effectiveLineNumber - 1].length + 1))) {
              throwError("fixInfo.editColumn");
            }
            cleanFixInfo.editColumn = fixInfo.editColumn;
          }
          if (fixInfo.deleteCount !== undefined) {
            if ((!helpers.isNumber(fixInfo.deleteCount) ||
              (fixInfo.deleteCount < -1) ||
              (fixInfo.deleteCount >
                lines[effectiveLineNumber - 1].length))) {
              throwError("fixInfo.deleteCount");
            }
            cleanFixInfo.deleteCount = fixInfo.deleteCount;
          }
          if (fixInfo.insertText !== undefined) {
            if (!helpers.isString(fixInfo.insertText)) {
              throwError("fixInfo.insertText");
            }
            cleanFixInfo.insertText = fixInfo.insertText;
          }
        }
        const information = errorInfo.information || rule.information;
        results.push({
          lineNumber,
          "ruleName": rule.names[0],
          "ruleNames": rule.names,
          "ruleDescription": rule.description,
          "ruleInformation": information ? information.href : null,
          "errorDetail": errorInfo.detail || null,
          "errorContext": errorInfo.context || null,
          "errorRange": errorInfo.range ? [ ...errorInfo.range ] : null,
          "fixInfo": fixInfo ? cleanFixInfo : null
        });
      }
      // Call (possibly external) rule function to report errors
      const catchCallsOnError = (error) => onError({
        "lineNumber": 1,
        "detail": `This rule threw an exception: ${error.message || error}`
      });
      const invokeRuleFunction = () => rule.function(params, onError);
      if (rule.asynchronous) {
        // Asynchronous rule, ensure it returns a Promise
        const ruleFunctionPromise =
          Promise.resolve().then(invokeRuleFunction);
        return handleRuleFailures ?
          ruleFunctionPromise.catch(catchCallsOnError) :
          ruleFunctionPromise;
      }
      // Synchronous rule
      try {
        invokeRuleFunction();
      } catch (error) {
        if (handleRuleFailures) {
          catchCallsOnError(error);
        } else {
          throw error;
        }
      }
      return null;
    };
    const formatResults = () => {
      // Sort results by rule name by line number
      results.sort((a, b) => (
        a.ruleName.localeCompare(b.ruleName) ||
        a.lineNumber - b.lineNumber
      ));
      if (resultVersion < 3) {
        // Remove fixInfo and multiple errors for the same rule and line number
        const noPrevious = {
          "ruleName": null,
          "lineNumber": -1
        };
        results = results.filter((error, index, array) => {
          delete error.fixInfo;
          const previous = array[index - 1] || noPrevious;
          return (
            (error.ruleName !== previous.ruleName) ||
            (error.lineNumber !== previous.lineNumber)
          );
        });
      }
      if (resultVersion === 0) {
        // Return a dictionary of rule->[line numbers]
        const dictionary = {};
        for (const error of results) {
          const ruleLines = dictionary[error.ruleName] || [];
          ruleLines.push(error.lineNumber);
          dictionary[error.ruleName] = ruleLines;
        }
        // @ts-ignore
        results = dictionary;
      } else if (resultVersion === 1) {
        // Use ruleAlias instead of ruleNames
        for (const error of results) {
          error.ruleAlias = error.ruleNames[1] || error.ruleName;
          delete error.ruleNames;
        }
      } else {
        // resultVersion 2 or 3: Remove unwanted ruleName
        for (const error of results) {
          delete error.ruleName;
        }
      }
      return results;
    };
    // Run all rules
    const ruleListAsync = enabledRuleList.filter((rule) => rule.asynchronous);
    const ruleListSync = enabledRuleList.filter((rule) => !rule.asynchronous);
    const ruleListAsyncFirst = [
      ...ruleListAsync,
      ...ruleListSync
    ];
    const callbackSuccess = () => callback(null, formatResults());
    try {
      const ruleResults = ruleListAsyncFirst.map(forRule);
      if (ruleListAsync.length > 0) {
        Promise.all(ruleResults.slice(0, ruleListAsync.length))
          .then(callbackSuccess)
          .catch(callbackError);
      } else {
        callbackSuccess();
      }
    } catch (error) {
      callbackError(error);
    } finally {
      cacheInitialize();
    }
  };
  if (!needMarkdownItTokens || synchronous) {
    // Need/able to call into markdown-it and lintContentInternal synchronously
    const markdownItTokens = needMarkdownItTokens ?
      requireMarkdownItCjs().getMarkdownItTokens(markdownItFactory(), preClearedContent, lines) :
      [];
    lintContentInternal(markdownItTokens);
  } else {
    // Need to call into markdown-it and lintContentInternal asynchronously
    Promise.all([
      // eslint-disable-next-line no-inline-comments
      import(/* webpackMode: "eager" */ "./markdownit.cjs"),
      // eslint-disable-next-line no-promise-executor-return
      new Promise((resolve) => resolve(markdownItFactory()))
    ]).then(([ markdownitCjs, markdownIt ]) => {
      const markdownItTokens = markdownitCjs.getMarkdownItTokens(markdownIt, preClearedContent, lines);
      lintContentInternal(markdownItTokens);
    }).catch(callbackError);
  }
}

/**
 * Lints a file containing Markdown content.
 *
 * @param {Rule[]} ruleList List of rules.
 * @param {Object.<string, string[]>} aliasToRuleNames Map of alias to rule names.
 * @param {string} file Path of file to lint.
 * @param {MarkdownItFactory} markdownItFactory Function to create a markdown-it parser.
 * @param {Configuration} config Configuration object.
 * @param {ConfigurationParser[] | undefined} configParsers Configuration parsers.
 * @param {RegExp | null} frontMatter Regular expression for front matter.
 * @param {boolean} handleRuleFailures Whether to handle exceptions in rules.
 * @param {boolean} noInlineConfig Whether to allow inline configuration.
 * @param {number} resultVersion Version of the LintResults object to return.
 * @param {Object} fs File system implementation.
 * @param {boolean} synchronous Whether to execute synchronously.
 * @param {LintContentCallback} callback Callback (err, result) function.
 * @returns {void}
 */
function lintFile(
  ruleList,
  aliasToRuleNames,
  file,
  markdownItFactory,
  config,
  configParsers,
  frontMatter,
  handleRuleFailures,
  noInlineConfig,
  resultVersion,
  fs,
  synchronous,
  callback) {
  // eslint-disable-next-line jsdoc/require-jsdoc
  function lintContentWrapper(err, content) {
    if (err) {
      return callback(err);
    }
    return lintContent(
      ruleList,
      aliasToRuleNames,
      file,
      content,
      markdownItFactory,
      config,
      configParsers,
      frontMatter,
      handleRuleFailures,
      noInlineConfig,
      resultVersion,
      synchronous,
      callback
    );
  }
  // Make a/synchronous call to read file
  if (synchronous) {
    lintContentWrapper(null, fs.readFileSync(file, "utf8"));
  } else {
    fs.readFile(file, "utf8", lintContentWrapper);
  }
}

/**
 * Lint files and strings specified in the Options object.
 *
 * @param {Options | null} options Options object.
 * @param {boolean} synchronous Whether to execute synchronously.
 * @param {LintCallback} callback Callback (err, result) function.
 * @returns {void}
 */
function lintInput(options, synchronous, callback) {
  // Normalize inputs
  options = options || {};
  callback = callback || function noop() {};
  const customRuleList =
    [ options.customRules || [] ]
      .flat()
      .map((rule) => ({
        "names": helpers.cloneIfArray(rule.names),
        "description": rule.description,
        "information": helpers.cloneIfUrl(rule.information),
        "tags": helpers.cloneIfArray(rule.tags),
        "parser": rule.parser,
        "asynchronous": rule.asynchronous,
        "function": rule.function
      }));
  // eslint-disable-next-line unicorn/prefer-spread
  const ruleList = rules.concat(customRuleList);
  const ruleErr = validateRuleList(ruleList, synchronous);
  if (ruleErr) {
    callback(ruleErr);
    return;
  }
  let files = [];
  if (Array.isArray(options.files)) {
    files = [ ...options.files ];
  } else if (options.files) {
    files = [ String(options.files) ];
  }
  const strings = options.strings || {};
  const stringsKeys = Object.keys(strings);
  const config = options.config || { "default": true };
  const configParsers = options.configParsers || undefined;
  const frontMatter = (options.frontMatter === undefined) ?
    helpers.frontMatterRe :
    options.frontMatter;
  const handleRuleFailures = !!options.handleRuleFailures;
  const noInlineConfig = !!options.noInlineConfig;
  const resultVersion = (options.resultVersion === undefined) ?
    3 :
    options.resultVersion;
  const markdownItFactory =
    options.markdownItFactory ||
    (() => { throw new Error("The option 'markdownItFactory' was required (due to the option 'customRules' including a rule requiring the 'markdown-it' parser), but 'markdownItFactory' was not set."); });
  const fs = options.fs || nodeFs;
  const aliasToRuleNames = mapAliasToRuleNames(ruleList);
  const results = newResults(ruleList);
  let done = false;
  let concurrency = 0;
  // eslint-disable-next-line jsdoc/require-jsdoc
  function lintWorker() {
    let currentItem = null;
    // eslint-disable-next-line jsdoc/require-jsdoc
    function lintWorkerCallback(err, result) {
      concurrency--;
      if (err) {
        done = true;
        return callback(err);
      }
      results[currentItem] = result;
      if (!synchronous) {
        lintWorker();
      }
      return null;
    }
    if (done) {
      // Abort for error or nothing left to do
    } else if (files.length > 0) {
      // Lint next file
      concurrency++;
      currentItem = files.shift();
      lintFile(
        ruleList,
        aliasToRuleNames,
        currentItem,
        markdownItFactory,
        config,
        configParsers,
        frontMatter,
        handleRuleFailures,
        noInlineConfig,
        resultVersion,
        fs,
        synchronous,
        lintWorkerCallback
      );
    } else if ((currentItem = stringsKeys.shift())) {
      // Lint next string
      concurrency++;
      lintContent(
        ruleList,
        aliasToRuleNames,
        currentItem,
        strings[currentItem] || "",
        markdownItFactory,
        config,
        configParsers,
        frontMatter,
        handleRuleFailures,
        noInlineConfig,
        resultVersion,
        synchronous,
        lintWorkerCallback
      );
    } else if (concurrency === 0) {
      // Finish
      done = true;
      return callback(null, results);
    }
    return null;
  }
  if (synchronous) {
    while (!done) {
      lintWorker();
    }
  } else {
    // Testing on a Raspberry Pi 4 Model B with an artificial 5ms file access
    // delay suggests that a concurrency factor of 8 can eliminate the impact
    // of that delay (i.e., total time is the same as with no delay).
    lintWorker();
    lintWorker();
    lintWorker();
    lintWorker();
    lintWorker();
    lintWorker();
    lintWorker();
    lintWorker();
  }
}

/**
 * Lint specified Markdown files.
 *
 * @param {Options | null} options Configuration options.
 * @param {LintCallback} callback Callback (err, result) function.
 * @returns {void}
 */
export function lintAsync(options, callback) {
  return lintInput(options, false, callback);
}

/**
 * Lint specified Markdown files.
 *
 * @param {Options | null} options Configuration options.
 * @returns {Promise<LintResults>} Results object.
 */
export function lintPromise(options) {
  return new Promise((resolve, reject) => {
    lintAsync(options, (error, results) => {
      if (error || !results) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

/**
 * Lint specified Markdown files.
 *
 * @param {Options | null} options Configuration options.
 * @returns {LintResults} Results object.
 */
export function lintSync(options) {
  let results = null;
  lintInput(options, true, function callback(error, res) {
    if (error) {
      throw error;
    }
    results = res;
  });
  // @ts-ignore
  return results;
}

/**
 * Resolve referenced "extends" path in a configuration file
 * using path.resolve() with require.resolve() as a fallback.
 *
 * @param {string} configFile Configuration file name.
 * @param {string} referenceId Referenced identifier to resolve.
 * @param {Object} fs File system implementation.
 * @param {ResolveConfigExtendsCallback} callback Callback (err, result)
 * function.
 * @returns {void}
 */
function resolveConfigExtends(configFile, referenceId, fs, callback) {
  const configFileDirname = path.dirname(configFile);
  const resolvedExtendsFile = path.resolve(configFileDirname, referenceId);
  fs.access(resolvedExtendsFile, (err) => {
    if (err) {
      // Not a file, try require.resolve
      try {
        return callback(
          null,
          resolveModule(referenceId, [ configFileDirname ])
        );
      } catch {
        // Unable to resolve, use resolvedExtendsFile
      }
    }
    return callback(null, resolvedExtendsFile);
  });
}

/**
 * Resolve referenced "extends" path in a configuration file
 * using path.resolve() with require.resolve() as a fallback.
 *
 * @param {string} configFile Configuration file name.
 * @param {string} referenceId Referenced identifier to resolve.
 * @param {Object} fs File system implementation.
 * @returns {string} Resolved path to file.
 */
function resolveConfigExtendsSync(configFile, referenceId, fs) {
  const configFileDirname = path.dirname(configFile);
  const resolvedExtendsFile = path.resolve(configFileDirname, referenceId);
  try {
    fs.accessSync(resolvedExtendsFile);
    return resolvedExtendsFile;
  } catch {
    // Not a file, try require.resolve
  }
  try {
    return resolveModule(referenceId, [ configFileDirname ]);
  } catch {
    // Unable to resolve, return resolvedExtendsFile
  }
  return resolvedExtendsFile;
}

/**
 * Extend specified configuration object.
 *
 * @param {Configuration} config Configuration object.
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[] | undefined} parsers Parsing
 * function(s).
 * @param {Object} fs File system implementation.
 * @param {ReadConfigCallback} callback Callback (err, result) function.
 * @returns {void}
 */
function extendConfig(config, file, parsers, fs, callback) {
  const configExtends = config.extends;
  if (configExtends) {
    return resolveConfigExtends(
      file,
      helpers.expandTildePath(configExtends, os),
      fs,
      // eslint-disable-next-line no-use-before-define
      (_, resolvedExtends) => readConfigAsync(
        // @ts-ignore
        resolvedExtends,
        parsers,
        fs,
        (err, extendsConfig) => {
          if (err) {
            return callback(err);
          }
          const result = {
            ...extendsConfig,
            ...config
          };
          delete result.extends;
          return callback(null, result);
        }
      )
    );
  }
  return callback(null, config);
}

/**
 * Extend specified configuration object.
 *
 * @param {Configuration} config Configuration object.
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[] | undefined} parsers Parsing function(s).
 * @param {Object} fs File system implementation.
 * @returns {Promise<Configuration>} Configuration object.
 */
export function extendConfigPromise(config, file, parsers, fs) {
  return new Promise((resolve, reject) => {
    extendConfig(config, file, parsers, fs, (error, results) => {
      if (error || !results) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[] | ReadConfigCallback} [parsers] Parsing
 * function(s).
 * @param {Object} [fs] File system implementation.
 * @param {ReadConfigCallback} [callback] Callback (err, result) function.
 * @returns {void}
 */
export function readConfigAsync(file, parsers, fs, callback) {
  if (!callback) {
    if (fs) {
      callback = fs;
      fs = null;
    } else {
      // @ts-ignore
      callback = parsers;
      // @ts-ignore
      parsers = null;
    }
  }
  if (!fs) {
    fs = nodeFs;
  }
  // Read file
  file = helpers.expandTildePath(file, os);
  fs.readFile(file, "utf8", (err, content) => {
    if (err) {
      // @ts-ignore
      return callback(err);
    }
    // Try to parse file
    // @ts-ignore
    const { config, message } = parseConfiguration(file, content, parsers);
    if (!config) {
      // @ts-ignore
      return callback(new Error(message));
    }
    // Extend configuration
    // @ts-ignore
    return extendConfig(config, file, parsers, fs, callback);
  });
}

/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @param {Object} [fs] File system implementation.
 * @returns {Promise<Configuration>} Configuration object.
 */
export function readConfigPromise(file, parsers, fs) {
  return new Promise((resolve, reject) => {
    readConfigAsync(file, parsers, fs, (error, results) => {
      if (error || !results) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

/**
 * Read specified configuration file.
 *
 * @param {string} file Configuration file name.
 * @param {ConfigurationParser[]} [parsers] Parsing function(s).
 * @param {Object} [fs] File system implementation.
 * @returns {Configuration} Configuration object.
 */
export function readConfigSync(file, parsers, fs) {
  if (!fs) {
    fs = nodeFs;
  }
  // Read file
  file = helpers.expandTildePath(file, os);
  const content = fs.readFileSync(file, "utf8");
  // Try to parse file
  const { config, message } = parseConfiguration(file, content, parsers);
  if (!config) {
    // @ts-ignore
    throw new Error(message);
  }
  // Extend configuration
  const configExtends = config.extends;
  if (configExtends) {
    delete config.extends;
    const resolvedExtends = resolveConfigExtendsSync(
      file,
      helpers.expandTildePath(configExtends, os),
      fs
    );
    return {
      ...readConfigSync(resolvedExtends, parsers, fs),
      ...config
    };
  }
  return config;
}

/**
 * Normalizes the fields of a RuleOnErrorFixInfo instance.
 *
 * @param {RuleOnErrorFixInfo} fixInfo RuleOnErrorFixInfo instance.
 * @param {number} [lineNumber] Line number.
 * @returns {RuleOnErrorFixInfoNormalized} Normalized RuleOnErrorFixInfo instance.
 */
function normalizeFixInfo(fixInfo, lineNumber = 0) {
  return {
    "lineNumber": fixInfo.lineNumber || lineNumber,
    "editColumn": fixInfo.editColumn || 1,
    "deleteCount": fixInfo.deleteCount || 0,
    "insertText": fixInfo.insertText || ""
  };
}

/**
 * Applies the specified fix to a Markdown content line.
 *
 * @param {string} line Line of Markdown content.
 * @param {RuleOnErrorFixInfo} fixInfo RuleOnErrorFixInfo instance.
 * @param {string} [lineEnding] Line ending to use.
 * @returns {string | null} Fixed content or null if deleted.
 */
export function applyFix(line, fixInfo, lineEnding = "\n") {
  const { editColumn, deleteCount, insertText } = normalizeFixInfo(fixInfo);
  const editIndex = editColumn - 1;
  return (deleteCount === -1) ?
    null :
    line.slice(0, editIndex) + insertText.replace(/\n/g, lineEnding) + line.slice(editIndex + deleteCount);
}

/**
 * Applies as many of the specified fixes as possible to Markdown content.
 *
 * @param {string} input Lines of Markdown content.
 * @param {RuleOnErrorInfo[]} errors RuleOnErrorInfo instances.
 * @returns {string} Fixed content.
 */
export function applyFixes(input, errors) {
  const lineEnding = helpers.getPreferredLineEnding(input, os);
  const lines = input.split(helpers.newLineRe);
  // Normalize fixInfo objects
  let fixInfos = errors
    .filter((error) => error.fixInfo)
    // @ts-ignore
    .map((error) => normalizeFixInfo(error.fixInfo, error.lineNumber));
  // Sort bottom-to-top, line-deletes last, right-to-left, long-to-short
  fixInfos.sort((a, b) => {
    const aDeletingLine = (a.deleteCount === -1);
    const bDeletingLine = (b.deleteCount === -1);
    return (
      (b.lineNumber - a.lineNumber) ||
      (aDeletingLine ? 1 : (bDeletingLine ? -1 : 0)) ||
      (b.editColumn - a.editColumn) ||
      (b.insertText.length - a.insertText.length)
    );
  });
  // Remove duplicate entries (needed for following collapse step)
  /** @type {RuleOnErrorFixInfo} */
  let lastFixInfo = {};
  fixInfos = fixInfos.filter((fixInfo) => {
    const unique = (
      (fixInfo.lineNumber !== lastFixInfo.lineNumber) ||
      (fixInfo.editColumn !== lastFixInfo.editColumn) ||
      (fixInfo.deleteCount !== lastFixInfo.deleteCount) ||
      (fixInfo.insertText !== lastFixInfo.insertText)
    );
    lastFixInfo = fixInfo;
    return unique;
  });
  // Collapse insert/no-delete and no-insert/delete for same line/column
  lastFixInfo = {
    "lineNumber": -1
  };
  for (const fixInfo of fixInfos) {
    if (
      (fixInfo.lineNumber === lastFixInfo.lineNumber) &&
      (fixInfo.editColumn === lastFixInfo.editColumn) &&
      !fixInfo.insertText &&
      (fixInfo.deleteCount > 0) &&
      lastFixInfo.insertText &&
      !lastFixInfo.deleteCount) {
      fixInfo.insertText = lastFixInfo.insertText;
      lastFixInfo.lineNumber = 0;
    }
    lastFixInfo = fixInfo;
  }
  fixInfos = fixInfos.filter((fixInfo) => fixInfo.lineNumber);
  // Apply all (remaining/updated) fixes
  let lastLineIndex = -1;
  let lastEditIndex = -1;
  for (const fixInfo of fixInfos) {
    const { lineNumber, editColumn, deleteCount } = fixInfo;
    const lineIndex = lineNumber - 1;
    const editIndex = editColumn - 1;
    if (
      (lineIndex !== lastLineIndex) ||
      (deleteCount === -1) ||
      ((editIndex + deleteCount) <=
        (lastEditIndex - ((deleteCount > 0) ? 0 : 1)))
    ) {
      // @ts-ignore
      lines[lineIndex] = applyFix(lines[lineIndex], fixInfo, lineEnding);
    }
    lastLineIndex = lineIndex;
    lastEditIndex = editIndex;
  }
  // Return corrected input
  return lines.filter((line) => line !== null).join(lineEnding);
}

/**
 * Gets the (semantic) version of the library.
 *
 * @returns {string} SemVer string.
 */
export function getVersion() {
  return version;
}

// Type declarations

/**
 * Function to implement rule logic.
 *
 * @callback RuleFunction
 * @param {RuleParams} params Rule parameters.
 * @param {RuleOnError} onError Error-reporting callback.
 * @returns {void}
 */

/* eslint-disable jsdoc/valid-types */

/**
 * Rule parameters.
 *
 * @typedef {Object} RuleParams
 * @property {string} name File/string name.
 * @property {MarkdownParsers} parsers Markdown parser data.
 * @property {readonly string[]} lines File/string lines.
 * @property {readonly string[]} frontMatterLines Front matter lines.
 * @property {RuleConfiguration} config Rule configuration.
 * @property {string} version Version of the markdownlint library.
 */

/* eslint-enable jsdoc/valid-types */

/**
 * Markdown parser data.
 *
 * @typedef {Object} MarkdownParsers
 * @property {ParserMarkdownIt} markdownit Markdown parser data from markdown-it (only present when Rule.parser is "markdownit").
 * @property {ParserMicromark} micromark Markdown parser data from micromark (only present when Rule.parser is "micromark").
 */

/**
 * Markdown parser data from markdown-it.
 *
 * @typedef {Object} ParserMarkdownIt
 * @property {MarkdownItToken[]} tokens Token objects from markdown-it.
 */

/**
 * Markdown parser data from micromark.
 *
 * @typedef {Object} ParserMicromark
 * @property {MicromarkToken[]} tokens Token objects from micromark.
 */

/**
 * markdown-it token.
 *
 * @typedef {Object} MarkdownItToken
 * @property {string[][]} attrs HTML attributes.
 * @property {boolean} block Block-level token.
 * @property {MarkdownItToken[]} children Child nodes.
 * @property {string} content Tag contents.
 * @property {boolean} hidden Ignore element.
 * @property {string} info Fence info.
 * @property {number} level Nesting level.
 * @property {number[]} map Beginning/ending line numbers.
 * @property {string} markup Markup text.
 * @property {Object} meta Arbitrary data.
 * @property {number} nesting Level change.
 * @property {string} tag HTML tag name.
 * @property {string} type Token type.
 * @property {number} lineNumber Line number (1-based).
 * @property {string} line Line content.
 */

/** @typedef {import("micromark-util-types").TokenType} MicromarkTokenType */

/**
 * micromark token.
 *
 * @typedef {Object} MicromarkToken
 * @property {MicromarkTokenType} type Token type.
 * @property {number} startLine Start line (1-based).
 * @property {number} startColumn Start column (1-based).
 * @property {number} endLine End line (1-based).
 * @property {number} endColumn End column (1-based).
 * @property {string} text Token text.
 * @property {MicromarkToken[]} children Child tokens.
 * @property {MicromarkToken | null} parent Parent token.
 */

/**
 * Error-reporting callback.
 *
 * @callback RuleOnError
 * @param {RuleOnErrorInfo} onErrorInfo Error information.
 * @returns {void}
 */

/**
 * Fix information for RuleOnError callback.
 *
 * @typedef {Object} RuleOnErrorInfo
 * @property {number} lineNumber Line number (1-based).
 * @property {string} [detail] Detail about the error.
 * @property {string} [context] Context for the error.
 * @property {URL} [information] Link to more information.
 * @property {number[]} [range] Column number (1-based) and length.
 * @property {RuleOnErrorFixInfo} [fixInfo] Fix information.
 */

/**
 * Fix information for RuleOnErrorInfo.
 *
 * @typedef {Object} RuleOnErrorFixInfo
 * @property {number} [lineNumber] Line number (1-based).
 * @property {number} [editColumn] Column of the fix (1-based).
 * @property {number} [deleteCount] Count of characters to delete.
 * @property {string} [insertText] Text to insert (after deleting).
 */

/**
 * RuleOnErrorInfo with all optional properties present.
 *
 * @typedef {Object} RuleOnErrorFixInfoNormalized
 * @property {number} lineNumber Line number (1-based).
 * @property {number} editColumn Column of the fix (1-based).
 * @property {number} deleteCount Count of characters to delete.
 * @property {string} insertText Text to insert (after deleting).
 */

/**
 * Rule definition.
 *
 * @typedef {Object} Rule
 * @property {string[]} names Rule name(s).
 * @property {string} description Rule description.
 * @property {URL} [information] Link to more information.
 * @property {string[]} tags Rule tag(s).
 * @property {"markdownit" | "micromark" | "none"} parser Parser used.
 * @property {boolean} [asynchronous] True if asynchronous.
 * @property {RuleFunction} function Rule implementation.
 */

/**
 * Method used by the markdown-it parser to parse input.
 *
 * @callback MarkdownItParse
 * @param {string} src Source string.
 * @param {Object} env Environment sandbox.
 * @returns {import("markdown-it").Token[]} Tokens.
 */

/**
 * Instance of the markdown-it parser.
 *
 * @typedef MarkdownIt
 * @property {MarkdownItParse} parse Method to parse input.
 */

/**
 * Gets an instance of the markdown-it parser. Any plugins should already have been loaded.
 *
 * @callback MarkdownItFactory
 * @returns {MarkdownIt|Promise<MarkdownIt>} Instance of the markdown-it parser.
 */

/**
 * Configuration options.
 *
 * @typedef {Object} Options
 * @property {Configuration} [config] Configuration object.
 * @property {ConfigurationParser[]} [configParsers] Configuration parsers.
 * @property {Rule[] | Rule} [customRules] Custom rules.
 * @property {string[] | string} [files] Files to lint.
 * @property {RegExp | null} [frontMatter] Front matter pattern.
 * @property {Object} [fs] File system implementation.
 * @property {boolean} [handleRuleFailures] True to catch exceptions.
 * @property {MarkdownItFactory} [markdownItFactory] Function to create a markdown-it parser.
 * @property {boolean} [noInlineConfig] True to ignore HTML directives.
 * @property {number} [resultVersion] Results object version.
 * @property {Object.<string, string>} [strings] Strings to lint.
 */

/**
 * A markdown-it plugin.
 *
 * @typedef {Array} Plugin
 */

/**
 * Function to pretty-print lint results.
 *
 * @callback ToStringCallback
 * @param {boolean} [ruleAliases] True to use rule aliases.
 * @returns {string} Pretty-printed results.
 */

/**
 * Lint results (for resultVersion 3).
 *
 * @typedef {Object.<string, LintError[]>} LintResults
 * @property {ToStringCallback} toString String representation.
 */

/**
 * Lint error.
 *
 * @typedef {Object} LintError
 * @property {number} lineNumber Line number (1-based).
 * @property {string[]} ruleNames Rule name(s).
 * @property {string} ruleDescription Rule description.
 * @property {string} ruleInformation Link to more information.
 * @property {string} errorDetail Detail about the error.
 * @property {string} errorContext Context for the error.
 * @property {number[]} errorRange Column number (1-based) and length.
 * @property {FixInfo} [fixInfo] Fix information.
 */

/**
 * Fix information.
 *
 * @typedef {Object} FixInfo
 * @property {number} [lineNumber] Line number (1-based).
 * @property {number} [editColumn] Column of the fix (1-based).
 * @property {number} [deleteCount] Count of characters to delete.
 * @property {string} [insertText] Text to insert (after deleting).
 */

/**
 * Called with the result of linting a string or document.
 *
 * @callback LintContentCallback
 * @param {Error | null} error Error iff failed.
 * @param {LintError[]} [result] Result iff successful.
 * @returns {void}
 */

/**
 * Called with the result of the lint function.
 *
 * @callback LintCallback
 * @param {Error | null} error Error object iff failed.
 * @param {LintResults} [results] Lint results iff succeeded.
 * @returns {void}
 */

/**
 * Configuration object for linting rules. For the JSON schema, see
 * {@link ../schema/markdownlint-config-schema.json}.
 *
 * @typedef {import("./configuration.d.ts").Configuration} Configuration
 */

/**
 * Configuration object for linting rules strictly. For the JSON schema, see
 * {@link ../schema/markdownlint-config-schema-strict.json}.
 *
 * @typedef {import("./configuration-strict.d.ts").ConfigurationStrict} ConfigurationStrict
 */

/**
 * Rule configuration object.
 *
 * @typedef {boolean | Object} RuleConfiguration Rule configuration.
 */

/**
 * Parses a configuration string and returns a configuration object.
 *
 * @callback ConfigurationParser
 * @param {string} text Configuration string.
 * @returns {Configuration}
 */

/**
 * Called with the result of the readConfig function.
 *
 * @callback ReadConfigCallback
 * @param {Error | null} err Error object or null.
 * @param {Configuration} [config] Configuration object.
 * @returns {void}
 */

/**
 * Called with the result of the resolveConfigExtends function.
 *
 * @callback ResolveConfigExtendsCallback
 * @param {Error | null} err Error object or null.
 * @param {string} [path] Resolved path to file.
 * @returns {void}
 */
