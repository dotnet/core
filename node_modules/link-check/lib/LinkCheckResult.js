"use strict";

class LinkCheckResult {
    constructor(opts, link, statusCode, err) {
        opts.aliveStatusCodes = opts.aliveStatusCodes || [ 200 ];
        
        this.link = link;
        this.statusCode = statusCode || 0;
        this.err = err || null;
        this.status = opts.aliveStatusCodes.some((statusCode) => (statusCode instanceof RegExp) ? statusCode.test(this.statusCode) : statusCode === this.statusCode) ? 'alive' : 'dead';
    }
}

module.exports = LinkCheckResult;
