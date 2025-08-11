'use strict';

const { marked } = require('marked');
const htmlLinkExtractor = require('html-link-extractor');

module.exports = function markdownLinkExtractor(markdown, extended = false) {

    marked.setOptions({
        mangle: false, // don't escape autolinked email address with HTML character references.
    });

    const html = marked(markdown);
    const links = htmlLinkExtractor(html);
    return links;
};
