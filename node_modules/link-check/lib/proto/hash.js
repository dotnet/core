"use strict";

const LinkCheckResult = require('../LinkCheckResult');

module.exports = {
    check: function (link, opts, callback) {
        const anchors = opts.anchors || [];
        callback(null, new LinkCheckResult(opts, link, anchors.includes(link) ? 200 : 404, null));
    }
};
