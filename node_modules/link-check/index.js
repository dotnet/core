"use strict";

const { URL } = require('url');

const protocols = {
    hash: function () { return require('./lib/proto/hash'); },
    file: function () { return require('./lib/proto/file'); },
    http: function () { return require('./lib/proto/http'); },
    https: function () { return require('./lib/proto/https'); },
    mailto: function () { return require('./lib/proto/mailto'); },
};

module.exports = function linkCheck(link, opts, callback) {

    if (arguments.length === 2 && typeof opts === 'function') {
        // optional 'opts' not supplied.
        callback = opts;
        opts = {};
    }

    const url = link.startsWith('#') ? link : new URL(link, opts.baseUrl);
    const protocol = link.startsWith('#') ? 'hash' : url.protocol.replace(/:$/, '');

    if (!protocols.hasOwnProperty(protocol)) {
        callback(new Error('Unsupported Protocol'), null);
        return;
    }

    protocols[protocol]().check(link, opts, callback);
};

module.exports.LinkCheckResult = require('./lib/LinkCheckResult');
