"use strict";

const LinkCheckResult = require('../LinkCheckResult');

module.exports.check = (link, opts, callback) => {
    import('node-email-verifier').then((mod) => {
        const emailValidator = mod.default;
        const address = link
                            .substr(7)      // strip "mailto:"
                            .split('?')[0]; // trim ?subject=blah hfields

        /* per RFC6068, the '?' is a reserved delimiter and email addresses containing '?' must be encoded,
         * so it's safe to split on '?' and pick [0].
         */

        emailValidator(address, { checkMx: true, timeout: opts.timeout || '10s' }).then((emailValid) => {
            if (!emailValid) {
                return callback(null, new LinkCheckResult(opts, link, 400, null));
            }
            return callback(null, new LinkCheckResult(opts, link, 200, null));
        }).catch((error) => {
            if (error.message.match(/timed out/)) {
                return callback(null, new LinkCheckResult(opts, link, 0, { message: 'Domain MX lookup timed out', code: 'ECONNRESET' }));
            }
            return callback(null, new LinkCheckResult(opts, link, 0, error));
        });
    });
};
