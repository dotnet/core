#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import os from 'node:os';
import process from 'node:process';
import {program} from 'commander';
import {glob} from 'glob';
import {applyFixes} from 'markdownlint';
import {lint, readConfig} from 'markdownlint/sync';
import rc from 'run-con';
import {minimatch} from 'minimatch';
import jsonpointer from 'jsonpointer';

const require = Module.createRequire(import.meta.url);
const options = program.opts();
// The following two values are copied from package.json (and validated by tests)
const version = '0.45.0';
const description = 'MarkdownLint Command Line Interface';

function markdownItFactory() {
  return require('markdown-it')({html: true});
}

function posixPath(p) {
  return p.split(path.sep).join(path.posix.sep);
}

function jsoncParse(text) {
  const {parse, printParseErrorCode} = require('jsonc-parser');
  const errors = [];
  const result = parse(text, errors, {allowTrailingComma: true});
  if (errors.length > 0) {
    const aggregate = errors.map(error => `${printParseErrorCode(error.error)} (offset ${error.offset}, length ${error.length})`).join(', ');
    throw new Error(`Unable to parse JSON(C) content, ${aggregate}`);
  }

  return result;
}

function yamlParse(text) {
  return require('js-yaml').load(text);
}

function tomlParse(text) {
  return require('smol-toml').parse(text);
}

const exitCodes = {
  lintFindings: 1,
  failedToWriteOutputFile: 2,
  failedToLoadCustomRules: 3,
  unexpectedError: 4
};

const projectConfigFiles = ['.markdownlint.jsonc', '.markdownlint.json', '.markdownlint.yaml', '.markdownlint.yml'];
// TOML files can be (incorrectly) read by yamlParse (but not vice versa), so tomlParse needs to go before yamlParse
const configParsers = [jsoncParse, tomlParse, yamlParse];
const fsOptions = {encoding: 'utf8'};
const processCwd = process.cwd();

function readConfiguration(userConfigFile) {
  // Load from well-known config files
  let config = rc('markdownlint', {});
  for (const projectConfigFile of projectConfigFiles) {
    try {
      fs.accessSync(projectConfigFile);
      const projectConfig = readConfig(projectConfigFile, configParsers);
      config = {...config, ...projectConfig};
      break;
    } catch {
      // Ignore failure
    }
  }

  // Normally parsing this file is not needed, because it is already parsed by rc package.
  // However I have to do it to overwrite configuration from .markdownlint.{jsonc,json,yaml,yml}.
  if (userConfigFile) {
    try {
      const jsConfigFile = /\.c?js$/i.test(userConfigFile);
      const userConfig = jsConfigFile ? require(path.resolve(processCwd, userConfigFile)) : readConfig(userConfigFile, configParsers);
      config = require('deep-extend')(config, userConfig);
    } catch (error) {
      console.error(`Cannot read or parse config file '${userConfigFile}': ${error.message}`);
      process.exitCode = exitCodes.unexpectedError;
    }
  }

  return config;
}

function prepareFileList(files, fileExtensions, previousResults) {
  const globOptions = {
    dot: Boolean(options.dot),
    nodir: true
  };
  let extensionGlobPart = '*.';
  if (!fileExtensions) {
    // Match everything
    extensionGlobPart = '';
  } else if (fileExtensions.length === 1) {
    // Glob seems not to match patterns like 'foo.{js}'
    extensionGlobPart += fileExtensions[0];
  } else {
    extensionGlobPart += '{' + fileExtensions.join(',') + '}';
  }

  files = files.map(file => {
    try {
      if (fs.lstatSync(file).isDirectory()) {
        // Directory (file falls through to below)
        if (previousResults) {
          const matcher = new minimatch.Minimatch(posixPath(path.resolve(processCwd, path.join(file, '**', extensionGlobPart))), globOptions);
          return previousResults.filter(fileInfo => matcher.match(fileInfo.absolute)).map(fileInfo => fileInfo.original);
        }

        return glob.sync(posixPath(path.join(file, '**', extensionGlobPart)), globOptions);
      }
    } catch {
      // Not a directory, not a file, may be a glob
      if (previousResults) {
        const matcher = new minimatch.Minimatch(posixPath(path.resolve(processCwd, file)), globOptions);
        return previousResults.filter(fileInfo => matcher.match(fileInfo.absolute)).map(fileInfo => fileInfo.original);
      }

      return glob.sync(file, globOptions);
    }

    // File
    return file;
  });
  return files.flat().map(file => ({
    original: file,
    relative: path.relative(processCwd, file),
    absolute: path.resolve(file)
  }));
}

function printResult(lintResult) {
  const results = Object.keys(lintResult).flatMap(file =>
    lintResult[file].map(result => {
      if (options.json) {
        return {
          fileName: file,
          ...result
        };
      }

      return {
        file: file,
        lineNumber: result.lineNumber,
        column: (result.errorRange && result.errorRange[0]) || 0,
        names: result.ruleNames.join('/'),
        description: result.ruleDescription + (result.errorDetail ? ' [' + result.errorDetail + ']' : '') + (result.errorContext ? ' [Context: "' + result.errorContext + '"]' : '')
      };
    })
  );

  let lintResultString = '';
  if (results.length > 0) {
    if (options.json) {
      results.sort((a, b) => a.fileName.localeCompare(b.fileName) || a.lineNumber - b.lineNumber || a.ruleDescription.localeCompare(b.ruleDescription));
      lintResultString = JSON.stringify(results, null, 2);
    } else {
      results.sort((a, b) => a.file.localeCompare(b.file) || a.lineNumber - b.lineNumber || a.names.localeCompare(b.names) || a.description.localeCompare(b.description));

      lintResultString = results
        .map(result => {
          const {file, lineNumber, column, names, description} = result;
          const columnText = column ? `:${column}` : '';
          return `${file}:${lineNumber}${columnText} ${names} ${description}`;
        })
        .join('\n');
    }

    // Note: process.exit(1) will end abruptly, interrupting asynchronous IO
    // streams (e.g., when the output is being piped). Just set the exit code
    // and let the program terminate normally.
    // @see {@link https://nodejs.org/dist/latest-v8.x/docs/api/process.html#process_process_exit_code}
    // @see {@link https://github.com/igorshubovych/markdownlint-cli/pull/29#issuecomment-343535291}
    process.exitCode = exitCodes.lintFindings;
  }

  if (options.output) {
    lintResultString = lintResultString.length > 0 ? lintResultString + os.EOL : lintResultString;
    try {
      fs.writeFileSync(options.output, lintResultString);
    } catch (error) {
      console.warn('Cannot write to output file ' + options.output + ': ' + error.message);
      process.exitCode = exitCodes.failedToWriteOutputFile;
    }
  } else if (lintResultString && !options.quiet) {
    console.error(lintResultString);
  }
}

function concatArray(item, array) {
  array.push(item);
  return array;
}

program
  .version(version)
  .description(description)
  .option('-c, --config <configFile>', 'configuration file (JSON, JSONC, JS, YAML, or TOML)')
  .option('--configPointer <pointer>', 'JSON Pointer to object within configuration file', '')
  .option('-d, --dot', 'include files/folders with a dot (for example `.github`)')
  .option('-f, --fix', 'fix basic errors (does not work with STDIN)')
  .option('-i, --ignore <file|directory|glob>', 'file(s) to ignore/exclude', concatArray, [])
  .option('-j, --json', 'write issues in json format')
  .option('-o, --output <outputFile>', 'write issues to file (no console)')
  .option('-p, --ignore-path <file>', 'path to file with ignore pattern(s)')
  .option('-q, --quiet', 'do not write issues to STDOUT')
  .option('-r, --rules <file|directory|glob|package>', 'include custom rule files', concatArray, [])
  .option('-s, --stdin', 'read from STDIN (does not work with files)')
  .option('--enable <rules...>', 'Enable certain rules, e.g. --enable MD013 MD041 --')
  .option('--disable <rules...>', 'Disable certain rules, e.g. --disable MD013 MD041 --')
  .argument('[files|directories|globs...]', 'files, directories, and/or globs to lint');

program.parse(process.argv);

function tryResolvePath(filepath) {
  try {
    if ((path.basename(filepath) === filepath || filepath.startsWith('@')) && path.extname(filepath) === '') {
      // Looks like a package name, resolve it relative to cwd
      // Get list of directories, where requested module can be.
      let paths = Module._nodeModulePaths(processCwd);
      // eslint-disable-next-line unicorn/prefer-spread
      paths = paths.concat(Module.globalPaths);
      if (require.resolve.paths) {
        // Node >= 8.9.0
        return require.resolve(filepath, {paths: paths});
      }

      return Module._resolveFilename(filepath, {paths: paths});
    }

    // Maybe it is a path to package installed locally
    return require.resolve(path.join(processCwd, filepath));
  } catch {
    return filepath;
  }
}

function loadCustomRules(rules) {
  return rules.flatMap(rule => {
    try {
      const resolvedPath = [tryResolvePath(rule)];
      const fileList = prepareFileList(resolvedPath, ['js', 'cjs', 'mjs']).flatMap(filepath => require(filepath.absolute));
      if (fileList.length === 0) {
        throw new Error('No such rule');
      }

      return fileList;
    } catch (error) {
      console.error('Cannot load custom rule ' + rule + ': ' + error.message);
      return process.exit(exitCodes.failedToLoadCustomRules);
    }
  });
}

let ignorePath = '.markdownlintignore';
let {existsSync} = fs;
if (options.ignorePath) {
  ignorePath = options.ignorePath;
  existsSync = () => true;
}

let ignoreFilter = () => true;
if (existsSync(ignorePath)) {
  const ignoreText = fs.readFileSync(ignorePath, fsOptions);
  const ignore = require('ignore');
  const ignoreInstance = ignore().add(ignoreText);
  ignoreFilter = fileInfo => !ignoreInstance.ignores(fileInfo.relative);
}

const files = prepareFileList(program.args, ['md', 'markdown']).filter(value => ignoreFilter(value));
const ignores = prepareFileList(options.ignore, null, files);
const customRules = loadCustomRules(options.rules);
const diff = files.filter(file => !ignores.some(ignore => ignore.absolute === file.absolute)).map(paths => paths.original);

function lintAndPrint(stdin, files) {
  files ||= [];
  const configuration = readConfiguration(options.config);
  const config = jsonpointer.get(configuration, options.configPointer) || {};

  for (const rule of options.enable || []) {
    // Leave default values in place if rule is an object
    config[rule] ||= true;
  }

  for (const rule of options.disable || []) {
    config[rule] = false;
  }

  const lintOptions = {
    markdownItFactory,
    config,
    configParsers,
    customRules,
    files
  };
  if (stdin) {
    lintOptions.strings = {
      stdin
    };
  }

  if (options.fix) {
    const fixOptions = {...lintOptions};
    for (const file of files) {
      fixOptions.files = [file];
      const fixResult = lint(fixOptions);
      const fixes = fixResult[file].filter(error => error.fixInfo);
      if (fixes.length > 0) {
        const originalText = fs.readFileSync(file, fsOptions);
        const fixedText = applyFixes(originalText, fixes);
        if (originalText !== fixedText) {
          fs.writeFileSync(file, fixedText, fsOptions);
        }
      }
    }
  }

  const lintResult = lint(lintOptions);
  printResult(lintResult);
}

try {
  if (files.length > 0 && !options.stdin) {
    lintAndPrint(null, diff);
  } else if (files.length === 0 && options.stdin && !options.fix) {
    import('node:stream/consumers').then(module => module.text(process.stdin)).then(lintAndPrint);
  } else {
    program.help();
  }
} catch (error) {
  console.error(error);
  process.exit(exitCodes.unexpectedError);
}
