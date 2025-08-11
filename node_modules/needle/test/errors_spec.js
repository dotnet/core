var needle  = require('../'),
    sinon   = require('sinon'),
    should  = require('should'),
    http    = require('http'),
    Emitter = require('events').EventEmitter,
    helpers = require('./helpers');

var get_catch = function(url, opts) {
  var err;
  try {
    needle.get(url, opts);
  } catch(e) {
    err = e;
  }
  return err;
}

describe('errors', function() {

  after(function(done) {
    setTimeout(done, 100)
  })

  describe('when host does not exist', function() {

    var url = 'http://unexistinghost/foo';

    describe('with callback', function() {

      it('does not throw', function() {
        var ex = get_catch(url);
        should.not.exist(ex);
      })

      it('callbacks an error', function(done) {
        needle.get(url, function(err) {
          err.should.be.a.Error;
          done();
        })
      })

      it('error should be ENOTFOUND or EADDRINFO or EAI_AGAIN', function(done) {
        needle.get(url, function(err) {
          err.code.should.match(/ENOTFOUND|EADDRINFO|EAI_AGAIN/)
          done();
        })
      })

      it('does not callback a response', function(done) {
        needle.get(url, function(err, resp) {
          should.not.exist(resp);
          done();
        })
      })

      it('does not emit an error event', function(done) {
        var emitted = false;
        var req = needle.get(url, function(err, resp) { })

        req.on('error', function() {
          emitted = true;
        })

        setTimeout(function() {
          emitted.should.eql(false);
          done();
        }, 100);
      })

    })

    describe('without callback', function() {

      it('does not throw', function() {
        var ex = get_catch(url);
        should.not.exist(ex);
      })

      it('emits end event once, with error', function(done) {
        var callcount = 0,
            stream = needle.get(url);

        stream.on('done', function(err) {
          err.code.should.match(/ENOTFOUND|EADDRINFO|EAI_AGAIN/)
          callcount++;
        })

        setTimeout(function() {
          callcount.should.equal(1);
          done();
        }, 200)
      })

      it('does not emit a readable event', function(done) {
        var called = false,
            stream = needle.get(url);

        stream.on('readable', function() {
          called = true;
        })

        stream.on('done', function(err) {
          called.should.be.false;
          done();
        })
      })

      it('does not emit an error event', function(done) {
        var emitted = false,
            stream = needle.get(url);

        stream.on('error', function() {
          emitted = true;
        })

        stream.on('done', function(err) {
          emitted.should.eql(false);
          done();
        })
      })

    })

  })

  describe('when request times out waiting for response', function() {

    var server,
        url = 'http://localhost:3333/foo';

    var send_request = function(cb) {
      return needle.get(url, { response_timeout: 200 }, cb);
    }

    before(function() {
      server = helpers.server({ port: 3333, wait: 1000 });
    })

    after(function() {
      server.close();
    })

    describe('with callback', function() {

      it('aborts the request', function(done) {

        var time = new Date();

        send_request(function(err) {
          var timediff = (new Date() - time);
          timediff.should.be.within(200, 300);
          done();
        })

      })

      it('callbacks an error', function(done) {
        send_request(function(err) {
          err.should.be.a.Error;
          done();
        })
      })

      it('error should be ECONNRESET', function(done) {
        send_request(function(err) {
          err.code.should.equal('ECONNRESET')
          done();
        })
      })

      it('does not callback a response', function(done) {
        send_request(function(err, resp) {
          should.not.exist(resp);
          done();
        })
      })

      it('does not emit an error event', function(done) {
        var emitted = false;

        var req = send_request(function(err, resp) {
          should.not.exist(resp);
        })

        req.on('error', function() {
          emitted = true;
        })

        setTimeout(function() {
          emitted.should.eql(false);
          done();
        }, 350);
      })

    })

    describe('without callback', function() {

      it('emits done event once, with error', function(done) {
        var error,
            called = 0,
            stream = send_request();

        stream.on('done', function(err) {
          err.code.should.equal('ECONNRESET');
          called++;
        })

        setTimeout(function() {
          called.should.equal(1);
          done();
        }, 250)
      })

      it('aborts the request', function(done) {

        var time = new Date();
        var stream = send_request();

        stream.on('done', function(err) {
          var timediff = (new Date() - time);
          timediff.should.be.within(200, 300);
          done();
        })

      })

      it('error should be ECONNRESET', function(done) {
        var error,
            stream = send_request();

        stream.on('done', function(err) {
          err.code.should.equal('ECONNRESET')
          done();
        })
      })

      it('does not emit a readable event', function(done) {
        var called = false,
            stream = send_request();

        stream.on('readable', function() {
          called = true;
        })

        stream.on('done', function(err) {
          called.should.be.false;
          done();
        })
      })

      it('does not emit an error event', function(done) {
        var emitted = false;
        var stream = send_request();

        stream.on('error', function() {
          emitted = true;
        })

        stream.on('done', function(err) {
          err.should.be.a.Error;
          err.code.should.equal('ECONNRESET')
          emitted.should.eql(false);
          done();
        })
      })

    })

  })

  var node_major_ver = process.version.split('.')[0].replace('v', '');
  if (node_major_ver >= 16) {
    describe('when request is aborted by signal', function() {

      var server,
          url = 'http://localhost:3333/foo';
  
      before(function() {
        server = helpers.server({ port: 3333, wait: 600 });
      })
  
      after(function() {
        server.close();
      })
  
      afterEach(function() {
        // reset signal to default
        needle.defaults({signal: null});
      })
  
      it('works if passing an already aborted signal aborts the request', function(done) {
        var abortedSignal = AbortSignal.abort();
        var start = new Date();
  
        abortedSignal.aborted.should.equal(true);
  
        needle.get(url, { signal: abortedSignal, response_timeout: 10000 }, function(err, res) {
          var timediff = (new Date() - start);
  
          should.not.exist(res);
          err.code.should.equal('ABORT_ERR');
          timediff.should.be.within(0, 50);
  
          done();
        });
      })
  
      it('works if request aborts before timing out', function(done) {
        var cancel = new AbortController();
        var start = new Date();
  
        needle.get(url, { signal: cancel.signal, response_timeout: 500, open_timeout: 500, read_timeout: 500 }, function(err, res) {
          var timediff = (new Date() - start);
  
          should.not.exist(res);
          if (node_major_ver <= 16)
            err.code.should.equal('ECONNRESET');
          if (node_major_ver > 16)
            err.code.should.equal('ABORT_ERR');
          cancel.signal.aborted.should.equal(true);
          timediff.should.be.within(200, 250);
  
          done();
        });
  
        function abort() {
          cancel.abort();
        }
        setTimeout(abort, 200);
      })
  
      it('works if request times out before being aborted', function(done) {
        var cancel = new AbortController();
        var start = new Date();
  
        needle.get(url, { signal: cancel.signal, response_timeout: 200, open_timeout: 200, read_timeout: 200 }, function(err, res) {
          var timediff = (new Date() - start);
  
          should.not.exist(res);
          err.code.should.equal('ECONNRESET');
          timediff.should.be.within(200, 250);
        });
  
        function abort() {
          cancel.signal.aborted.should.equal(false);
          done();
        }
        setTimeout(abort, 500);
      })
  
      it('works if setting default signal aborts all requests', function(done) {
        var cancel = new AbortController();
  
        needle.defaults({signal: cancel.signal});
  
        var start = new Date();
        var count = 0;
        function cb(err, res) {
          var timediff = (new Date() - start);
  
          should.not.exist(res);
          if (node_major_ver <= 16)
            err.code.should.equal('ECONNRESET');
          if (node_major_ver > 16)
            err.code.should.equal('ABORT_ERR');
          cancel.signal.aborted.should.equal(true);
          timediff.should.be.within(200, 250);
  
          if ( count++ === 2 ) done();
        }
  
        needle.get(url, { timeout: 300 }, cb);
        needle.get(url, { timeout: 350 }, cb);
        needle.get(url, { timeout: 400 }, cb);
  
        function abort() {
          cancel.abort();
        }
        setTimeout(abort, 200);
      })
  
      it('does not work if invalid signal passed', function(done) {
        try {
          needle.get(url, { signal: 'invalid signal' }, function(err, res) {
            done(new Error('A bad option error expected to be thrown'));
          });
        } catch(e) {
          e.should.be.a.TypeError;
          done();
        }
      })
  
      it('does not work if invalid signal set by default', function(done) {
        try {
          needle.defaults({signal: new Error(), timeout: 1200});
          done(new Error('A bad option error expected to be thrown'));
        } catch(e) {
          e.should.be.a.TypeError;
          done();
        }
      })
  
    })
  }
})
