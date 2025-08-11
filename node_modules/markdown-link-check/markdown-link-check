#!/usr/bin/env node

'use strict';

let chalk;
const fs = require('fs');
const { promisify } = require('util');
const markdownLinkCheck = promisify(require('.'));
const needle = require('needle');
const path = require('path');
const pkg = require('./package.json');
const { Command } = require('commander');
const program = new Command();
const { ProxyAgent } = require('proxy-agent');

const reporters = {
    default: async function defaultReporter(err, results, opts, filenameForOutput) {
        const chalk = (await import('chalk')).default

        const statusLabels = {
            alive: chalk.green('✓'),
            dead: chalk.red('✖'),
            ignored: chalk.gray('/'),
            error: chalk.yellow('⚠'),
        };

        if (err) {
            console.error(chalk.red("\n  ERROR: something went wrong!"));
            console.error(err.stack);
        }

        if (results.length === 0 && !opts.quiet) {
            console.log(chalk.yellow("  No hyperlinks found!"));
        }
        results.forEach(function (result) {
            // Skip messages for non-deadlinks in quiet mode.
            if (opts.quiet && result.status !== "dead") {
                return;
            }

            if (opts.verbose) {
                if (result.err) {
                    console.log(
                        "  [%s] %s → Status: %s %s",
                        statusLabels[result.status],
                        result.link,
                        result.statusCode,
                        result.err
                    );
                } else {
                    console.log("  [%s] %s → Status: %s", statusLabels[result.status], result.link, result.statusCode);
                }
            } else if (!opts.quiet) {
                console.log("  [%s] %s", statusLabels[result.status], result.link);
            }
        });

        if (!opts.quiet) {
            console.log("\n  %s links checked.", results.length);
        }

        if (results.some((result) => result.status === "dead")) {
            let deadLinks = results.filter((result) => {
                return result.status === "dead";
            });
            if (!opts.quiet) {
                console.error(chalk.red("\n  ERROR: %s dead links found!"), deadLinks.length);
            } else {
                console.error(chalk.red("\n  ERROR: %s dead links found in %s !"), deadLinks.length, filenameForOutput);
            }
            deadLinks.forEach(function (result) {
                console.log("  [%s] %s → Status: %s", statusLabels[result.status], result.link, result.statusCode);
            });
        }
    },
};

class Input {
    constructor(filenameForOutput, stream, opts) {
        this.filenameForOutput = filenameForOutput;
        this.stream = stream;
        this.opts = opts;
    }
}

function commaSeparatedPathsList(value) {
    return value.split(',');
}

function commaSeparatedCodesList(value, dummyPrevious) {
    return value.split(',').map(function(item) {
        return parseInt(item, 10);
    });
}

/**
 * Load all files in the rootFolder and all subfolders that end with .md
 */
function loadAllMarkdownFiles(rootFolder = '.') {
    const files = [];
    fs.readdirSync(rootFolder).forEach(file => {
        const fullPath = path.join(rootFolder, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            files.push(...loadAllMarkdownFiles(fullPath));
        } else if (fullPath.endsWith('.md')) {
            files.push(fullPath);
        }
    });
    return files;
}

function commaSeparatedReportersList(value) {
    return value.split(',').map((reporter) => reporters[reporter] ?? reporters.default);
}

function getInputs() {
    const inputs = [];

    program
        .version(pkg.version)
        .option('-p, --progress', 'show progress bar')
        .option('-c, --config [config]', 'apply a config file (JSON), holding e.g. url specific header configuration')
        .option('-q, --quiet', 'displays errors only')
        .option('-v, --verbose', 'displays detailed error information')
        .option('-i, --ignore <paths>', 'ignore input paths including an ignore path', commaSeparatedPathsList)
        .option('-a, --alive <code>', 'comma separated list of HTTP codes to be considered as alive', commaSeparatedCodesList)
        .option('-r, --retry', 'retry after the duration indicated in \'retry-after\' header when HTTP code is 429')
        .option('--reporters <names>', 'specify reporters to use', commaSeparatedReportersList)
        .option('--projectBaseUrl <url>', 'the URL to use for {{BASEURL}} replacement')
        .arguments('[filenamesOrDirectorynamesOrUrls...]')
        .action(function (filenamesOrUrls) {
            let filenameForOutput;
            let stream;

            if (!filenamesOrUrls.length) {
                // read from stdin unless a filename is given
                inputs.push(new Input(filenameForOutput, process.stdin, {}));
            }

            function onError(error) {
                console.error(chalk.red('\nERROR: Unable to connect! Please provide a valid URL as an argument.'));
                process.exit(1);
            }
            function onResponse(response) {
                if (response.statusCode === 404) {
                    console.error(chalk.red('\nERROR: 404 - File not found! Please provide a valid URL as an argument.'));
                    process.exit(1);
                }
            }

            const { ignore } = program.opts();

            for (const filenameOrUrl of filenamesOrUrls) {
                filenameForOutput = filenameOrUrl;
                let baseUrl = '';
                // remote file
                if (/https?:/.test(filenameOrUrl)) {
                    stream = needle.get(
                        filenameOrUrl, { agent: new ProxyAgent(), use_proxy_from_env_var: false }
                    );
                    stream.on('error', onError);
                    stream.on('response', onResponse);
                    try { // extract baseUrl from supplied URL
                        const parsed = new URL(filenameOrUrl);
                        parsed.search = '';
                        parsed.hash = '';
                        if (parsed.pathname.lastIndexOf('/') !== -1) {
                            parsed.pathname = parsed.pathname.substring(0, parsed.pathname.lastIndexOf('/') + 1);
                        }
                        baseUrl = parsed.toString();
                        inputs.push(new Input(filenameForOutput, stream, {baseUrl: baseUrl}));
                    } catch (err) {
                        /* ignore error */
                    }
                } else {
                    // local file or directory
                    let files = [];

                    if (fs.statSync(filenameOrUrl).isDirectory()){
                        files = loadAllMarkdownFiles(filenameOrUrl)
                    } else {
                        files = [filenameOrUrl]
                    }

                    for (let file of files) {
                        filenameForOutput = file;
                        const resolved = path.resolve(filenameForOutput);

                        // skip paths given if it includes a path to ignore.
                        // todo: allow ignore paths to be glob or regex instead of just includes?
                        if (ignore && ignore.some((ignorePath) => resolved.includes(ignorePath))) {
                            continue;
                        }

                        if (process.platform === 'win32') {
                            baseUrl = 'file://' + path.dirname(resolved).replace(/\\/g, '/');
                        }
                        else {
                            baseUrl = 'file://' + path.dirname(resolved);
                        }

                        stream = fs.createReadStream(filenameForOutput);
                        inputs.push(new Input(filenameForOutput, stream, {baseUrl: baseUrl}));
                    }
                }
            }
        }
    ).parse(process.argv);

    for (const input of inputs) {
        input.opts.showProgressBar = (program.opts().progress === true); // force true or undefined to be true or false.
        input.opts.quiet = (program.opts().quiet === true);
        input.opts.verbose = (program.opts().verbose === true);
        input.opts.retryOn429 = (program.opts().retry === true);
        input.opts.aliveStatusCodes = program.opts().alive;
        input.opts.reporters = program.opts().reporters ?? [ reporters.default ];
        const config = program.opts().config;
        if (config) {
            input.opts.config = config.trim();
        }

        if (program.projectBaseUrl) {
            input.opts.projectBaseUrl = `file://${program.projectBaseUrl}`;
        } else {
            // set the default projectBaseUrl to the current working directory, so that `{{BASEURL}}` can be resolved to the project root.
            if (process.platform === 'win32') {
                input.opts.projectBaseUrl = `file:///${process.cwd().replace(/\\/g, '/')}`;
            }
            else {
                input.opts.projectBaseUrl = `file://${process.cwd()}`;
            }
        }
    }

    return inputs;
}

async function loadConfig(config) {
    return new Promise((resolve, reject) => {
        fs.access(config, (fs.constants || fs).R_OK, function (err) {
            if (!err) {
                let configStream = fs.createReadStream(config);
                let configData = '';

                configStream.on('data', function (chunk) {
                    configData += chunk.toString();
                }).on('end', function () {
                    resolve(JSON.parse(configData));
                });
            }
            else {
                console.error(chalk.red('\nERROR: Config file not accessible.'));
                process.exit(1);
            }
        });
    });
}

async function processInput(filenameForOutput, stream, opts) {
    let markdown = ''; // collect the markdown data, then process it

    stream.on('error', function(error) {
        if (error.code === 'ENOENT') {
            console.error(chalk.red('\nERROR: File not found! Please provide a valid filename as an argument.'));
        } else {
            console.error(chalk.red(error));
        }
        return process.exit(1);
    });

    for await (const chunk of stream) {
        markdown += chunk.toString();
    }

    if (!opts.quiet && filenameForOutput) {
        console.log(chalk.cyan('\nFILE: ' + filenameForOutput));
    }

    if (opts.config) {
        let config = await loadConfig(opts.config);

        opts.ignorePatterns = config.ignorePatterns;
        opts.replacementPatterns = config.replacementPatterns;
        opts.httpHeaders = config.httpHeaders;
        opts.timeout = config.timeout;
        opts.ignoreDisable = config.ignoreDisable;
        opts.retryOn429 = config.retryOn429;
        opts.retryCount = config.retryCount;
        opts.fallbackRetryDelay = config.fallbackRetryDelay;
        opts.aliveStatusCodes = config.aliveStatusCodes;
        opts.reporters = config.reporters ?? opts.reporters;
    }

    await runMarkdownLinkCheck(filenameForOutput, markdown, opts);
}

async function runMarkdownLinkCheck(filenameForOutput, markdown, opts) {
    const [err, results] = await markdownLinkCheck(markdown, opts)
        .then(res => [null, res]).catch(err => [err]);

    await Promise.allSettled(
        opts.reporters.map(reporter => reporter(err, results, opts, filenameForOutput)
    ));

    if (err) throw null;
    else if (results.some((result) => result.status === 'dead')) return;
    else return;
}

async function main() {
    chalk = (await import('chalk')).default;

    const inputs = getInputs();

    let isOk = true;
    for await (const input of inputs) {
        try {
            await processInput(input.filenameForOutput, input.stream, input.opts);
        } catch (err) {
            isOk = false;
        }
    }

    process.exit(isOk ? 0 : 1);
}

main();
