'use strict';

const expect = require('expect.js');
const htmlLinkExtractor = require('..');

describe('html-link-extractor', function () {

    it('should extract anchor links', function () {
        expect(htmlLinkExtractor('<p><a href="foo.html">foo</a><a href="bar.html">bar.html</a></p>')).to.eql([ 'foo.html', 'bar.html' ]);
    });

    it('should extract image links', function () {
        expect(htmlLinkExtractor('<div><img src="foo.jpg" alt="foo"/></div>')).to.eql([ 'foo.jpg' ]);
    });

    it('should ignore links that are empty e.g. <a id="foo">foo</a>', function () {
        expect(htmlLinkExtractor('<p><a id="foo">foo</a></p>')).to.eql([ ]);
    });
});
