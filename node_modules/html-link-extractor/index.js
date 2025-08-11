'use strict';

const cheerio = require('cheerio');

function htmlLinkExtractor(html) {

    const $ = cheerio.load(html);

    const links = [];

    [
        { tagName: 'a', attr: 'href' },
        { tagName: 'area', attr: 'href' },
        { tagName: 'link', attr: 'href' },

        { tagName: 'audio', attr: 'src' },
        { tagName: 'embed', attr: 'src' },
        { tagName: 'iframe', attr: 'src' },
        { tagName: 'input', attr: 'src' },
        { tagName: 'img', attr: 'src' },
        { tagName: 'javascript', attr: 'src' },
        { tagName: 'source', attr: 'src' },
        { tagName: 'track', attr: 'src' },
        { tagName: 'video', attr: 'src' },

    ].forEach(({ tagName, attr }) => {
        $(tagName).each((i, node) => {
            if ($(node).attr(attr)) {
                links.push(
                    $(node).attr(attr)
                );
            }
        });
    });

    return links;
}

module.exports = htmlLinkExtractor;
