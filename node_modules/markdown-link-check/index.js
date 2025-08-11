'use strict';

const async = require('async');
const linkCheck = require('link-check');
const LinkCheckResult = require('link-check').LinkCheckResult;
const markdownLinkExtractor = require('markdown-link-extractor');
const ProgressBar = require('progress');

const envVarPatternMatcher = /(?<pattern>{{env\.(?<name>[a-zA-Z0-9\-_]+)}})/;

/*
 * Performs some special replacements for the following patterns:
 * - {{BASEURL}} - to be replaced with opts.projectBaseUrl
 * - {{env.<env_var_name>}} - to be replaced with the environment variable specified with <env_var_name>
 */
function performSpecialReplacements(str, opts) {
    // replace the `{{BASEURL}}` with the opts.projectBaseUrl. Helpful to build absolute urls "relative" to project roots
    str = str.replace('{{BASEURL}}', opts.projectBaseUrl);

    // replace {{env.<env_var_name>}} with the corresponding environment variable or an empty string if none is set.
    var envVarMatch;
    do {
        envVarMatch = envVarPatternMatcher.exec(str);

        if(!envVarMatch) {
            break;
        }

        var envVarPattern = envVarMatch.groups.pattern;
        var envVarName = envVarMatch.groups.name;

        var envVarPatternReplacement = '';

        if(envVarName in process.env) {
            envVarPatternReplacement = process.env[envVarName];
        }

        str = str.replace(envVarPattern, envVarPatternReplacement);
        // eslint-disable-next-line no-constant-condition
    } while (true);

    return str;
}

function removeCodeBlocks(markdown) {
    return markdown.replace(/^```[\S\s]+?^```$/gm, '');
}

function extractHtmlSections(markdown) {
    markdown =
        // remove code blocks
        removeCodeBlocks(markdown)
        // remove HTML comments
        .replace(/<!--[\S\s]+?-->/gm, '')
        // remove single line code (if not escaped with "\")
        .replace(/(?<!\\)`[\S\s]+?(?<!\\)`/gm, '');

    const regexAllId = /<(?<tag>[^\s]+).*?id=["'](?<id>[^"']*?)["'].*?>/gmi;
    const regexAName = /<a.*?name=["'](?<name>[^"']*?)["'].*?>/gmi;

    const sections = []
        .concat(Array.from(markdown.matchAll(regexAllId), (match) => match.groups.id))
        .concat(Array.from(markdown.matchAll(regexAName), (match) => match.groups.name));

    return sections
}

function extractSections(markdown) {
    // First remove code blocks.
    markdown = removeCodeBlocks(markdown);

    const sectionTitles = markdown.match(/^#+ .*$/gm) || [];

    const sections = sectionTitles.map(section =>
        // The links are compared with the headings (simple text comparison).
        // However, the links are url-encoded beforehand, so the headings
        // have to also be encoded so that they can also be matched.
        encodeURIComponent(
            section
                // replace links, the links can start with "./", "/", "http://", "https://" or "#"
                // and keep the value of the text ($1)
                .replace(/\[(.+)\]\(((?:\.?\/|https?:\/\/|#)[\w\d./?=#-]+)\)/, "$1")
                // make everything (Unicode-aware) lower case
                .toLowerCase()
                // remove white spaces and "#" at the beginning
                .replace(/^#+\s*/, '')
                // remove everything that is NOT a (Unicode) Letter, (Unicode) Number decimal,
                // (Unicode) Number letter, white space, underscore or hyphen
                // https://ruby-doc.org/3.3.2/Regexp.html#class-Regexp-label-Unicode+Character+Categories
                .replace(/[^\p{L}\p{Nd}\p{Nl}\s_\-`]/gu, "")
                // remove sequences of *
                .replace(/\*(?=.*)/gu, "")
                // remove leftover backticks
                .replace(/`/gu, "")
                // Now replace remaining blanks with '-'
                .replace(/\s/gu, "-")
        )
    );

    var uniq = {};
    for (var section of sections) {
        if (section in uniq) {
            uniq[section]++;
            section = section + '-' + uniq[section];
        }
        uniq[section] = 0;
    }
    const uniqueSections = Object.keys(uniq) ?? [];

    return uniqueSections;
}

module.exports = function markdownLinkCheck(markdown, opts, callback) {
    if (arguments.length === 2 && typeof opts === 'function') {
        // optional 'opts' not supplied.
        callback = opts;
        opts = {};
    }

    if(!opts.ignoreDisable) {
        markdown = [
            /(<!--[ \t]+markdown-link-check-disable[ \t]+-->[\S\s]*?<!--[ \t]+markdown-link-check-enable[ \t]+-->)/mg,
            /(<!--[ \t]+markdown-link-check-disable[ \t]+-->[\S\s]*(?!<!--[ \t]+markdown-link-check-enable[ \t]+-->))/mg,
            /(<!--[ \t]+markdown-link-check-disable-next-line[ \t]+-->\r?\n[^\r\n]*)/mg,
            /([^\r\n]*<!--[ \t]+markdown-link-check-disable-line[ \t]+-->[^\r\n]*)/mg
        ].reduce(function(_markdown, disablePattern) {
            return _markdown.replace(new RegExp(disablePattern), '');
        }, markdown);
    }

    const links = markdownLinkExtractor(markdown);
    const sections = extractSections(markdown).concat(extractHtmlSections(markdown));
    const linksCollection = [...new Set(links)]
    const bar = (opts.showProgressBar) ?
        new ProgressBar('Checking... [:bar] :percent', {
            complete: '=',
            incomplete: ' ',
            width: 25,
            total: linksCollection.length
        }) : undefined;

    async.mapLimit(linksCollection, 2, function (link, callback) {
        if (opts.ignorePatterns) {
            const shouldIgnore = opts.ignorePatterns.some(function(ignorePattern) {
                return ignorePattern.pattern instanceof RegExp ? ignorePattern.pattern.test(link) : (new RegExp(ignorePattern.pattern)).test(link) ? true : false;
            });

            if (shouldIgnore) {
                const result = new LinkCheckResult(opts, link, 0, undefined);
                result.status = 'ignored'; // custom status for ignored links
                callback(null, result);
                return;
            }
        }

        if (opts.replacementPatterns) {
            for (let replacementPattern of opts.replacementPatterns) {
                let pattern = replacementPattern.pattern instanceof RegExp ? replacementPattern.pattern : new RegExp(replacementPattern.pattern, replacementPattern.global ? 'g' : '');
                link = link.replace(pattern, performSpecialReplacements(replacementPattern.replacement, opts));
            }
        }

        // Make sure it is not undefined and that the appropriate headers are always recalculated for a given link.
        opts.headers = {};

        if (opts.httpHeaders) {
            for (const httpHeader of opts.httpHeaders) {
                if (httpHeader.headers) {
                    for (const header of Object.keys(httpHeader.headers)) {
                        httpHeader.headers[header] = performSpecialReplacements(httpHeader.headers[header], opts);
                    }
                }

                for (const url of httpHeader.urls) {
                    if (link.startsWith(url)) {
                        Object.assign(opts.headers, httpHeader.headers);

                        // The headers of this httpHeader has been applied, the other URLs of this httpHeader don't need to be evaluated any further.
                        break;
                    }
                }
            }
        }

        let sectionLink = null;

        if (link.startsWith('#')) {
            sectionLink = link;
        }
        else if ('baseUrl' in opts && link.startsWith(opts.baseUrl)) {
            if (link.substring(opts.baseUrl.length).match(/^\/*#/)) {
                sectionLink = link.replace(/^[^#]+/, '');
            }
        }

        if (sectionLink) {
            const result = new LinkCheckResult(opts, sectionLink, sections.includes(sectionLink.substring(1)) ? 200 : 404, undefined);
            callback(null, result);
            return;
        }

        linkCheck(link, opts, function (err, result) {
            if (opts.showProgressBar) {
                bar.tick();
            }

            if (err) {
                result = new LinkCheckResult(opts, link, 500, err);
                result.status = 'error'; // custom status for errored links
            }

            callback(null, result);
        });
    }, callback);
};
