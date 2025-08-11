"use strict";

const Writable = require('stream').Writable;

class BlackHole extends Writable {
    constructor(options) {
        super(options);
    }
    _write(chunk, encoding, callback) {
        callback(); // eat the input
    }
}

module.exports = BlackHole;
