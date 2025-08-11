var http    = require('http'),
    helpers = require('./helpers'),
    should  = require('should');

var port = 54321;


describe('request headers', function() {

  var needle,
      server,
      existing_sockets,
      original_defaultMaxSockets;

  before(function(done) {
    setTimeout(function() {
      existing_sockets = get_active_sockets().length;
      server = helpers.server({ port: port }, done);
    }, 100);
  })

  after(function(done) {
    server.close(done);
  })

  function send_request(opts, cb) {
    needle.get('http://localhost:' + port, opts, cb);
  }

  function get_active_sockets() {
    var handles = process._getActiveHandles();

    return handles.filter(function(el) {
      if (el.constructor.name.toString() == 'Socket') {
        return el.destroyed !== true;
      }
    })
  }

  describe('old node versions (<0.11.4) with persistent keep-alive connections', function() {

    // emulate old node behaviour
    before(function() {
      delete require.cache[require.resolve('..')] // in case it was already loaded
      original_defaultMaxSockets = http.Agent.defaultMaxSockets;
      http.Agent.defaultMaxSockets = 5;
      needle = require('..');
    })

    after(function() {
      http.Agent.defaultMaxSockets = original_defaultMaxSockets;
      delete require.cache[require.resolve('..')]
    })

    describe('default options', function() {

      it('sends a Connection: close header', function(done) {
        send_request({}, function(err, resp) {
          resp.body.headers['connection'].should.eql('close');
          done();
        })
      })

      it('no open sockets remain after request', function(done) {
        send_request({}, function(err, resp) {
          setTimeout(function() {
            get_active_sockets().length.should.eql(existing_sockets);
            done();
          }, 10)
        });
      })

    })

    describe('passing connection: close', function() {

      it('sends a Connection: close header', function(done) {
        send_request({ connection: 'close' }, function(err, resp) {
          resp.body.headers['connection'].should.eql('close');
          done();
        })
      })

      it('no open sockets remain after request', function(done) {
        send_request({ connection: 'close' }, function(err, resp) {
          setTimeout(function() {
            get_active_sockets().length.should.eql(existing_sockets);
            done();
          }, 10)
        });
      })

    })

    describe('passing connection: keep-alive', function() {

      it('sends a Connection: keep-alive header (using options.headers.connection)', function(done) {
        send_request({ headers: { connection: 'keep-alive' }}, function(err, resp) {
          resp.body.headers['connection'].should.eql('keep-alive');
          done();
        })
      })

      it('sends a Connection: keep-alive header (using options.connection)', function(done) {
        send_request({ connection: 'keep-alive' }, function(err, resp) {
          resp.body.headers['connection'].should.eql('keep-alive');
          done();
        })
      })

      it('one open socket remain after request', function(done) {
        send_request({ connection: 'keep-alive' }, function(err, resp) {
          get_active_sockets().length.should.eql(existing_sockets + 1);
          done();
        });
      })

    })

  })

  describe('new node versions with smarter connection disposing', function() {

    before(function() {
      delete require.cache[require.resolve('..')]
      original_defaultMaxSockets = http.Agent.defaultMaxSockets;
      http.Agent.defaultMaxSockets = Infinity;
      needle = require('..');
    })

    after(function() {
      http.Agent.defaultMaxSockets = original_defaultMaxSockets;
      delete require.cache[require.resolve('..')]
    })

    describe('default options', function() {

      var node_major_ver = process.version.split('.')[0].replace('v', '');

      if (parseInt(node_major_ver) >= 4) {

        it('sets Connection header to close (> v4)', function(done) {
          send_request({}, function(err, resp) {
            resp.body.headers['connection'].should.eql('close');
            done()
          })
        })

      } else {

        it('sets Connection header to keep-alive (< v4)', function(done) {
          send_request({}, function(err, resp) {
            resp.body.headers['connection'].should.eql('keep-alive');
            done();
          })
        })

      }

      if (parseInt(node_major_ver) >= 14) {

        // TODO: figure out why this happens
        it('two open sockets remains after request (>= v14)', function(done) {
          send_request({}, function(err, resp) {
            get_active_sockets().length.should.eql(existing_sockets + 2);
            done();
          });
        })

      } else if (parseInt(node_major_ver) >= 8 || parseInt(node_major_ver) == 0) {

        it('one open socket remains after request (> v8 && v0.10)', function(done) {
          send_request({}, function(err, resp) {
            get_active_sockets().length.should.eql(existing_sockets + 1);
            done();
          });
        })

      } else {

        it('no open sockets remain after request (> v0.10 && < v8)', function(done) {
          send_request({}, function(err, resp) {
            get_active_sockets().length.should.eql(existing_sockets);
            done();
          });
        })

      }

    })

    describe('passing connection: close', function() {

      it('sends a Connection: close header', function(done) {
        send_request({ connection: 'close' }, function(err, resp) {
          resp.body.headers['connection'].should.eql('close');
          done();
        })
      })

      it('no open sockets remain after request', function(done) {
        send_request({ connection: 'close' }, function(err, resp) {
          setTimeout(function() {
            get_active_sockets().length.should.eql(existing_sockets);
            done();
          }, 10);
        });
      })

    })

    describe('passing connection: keep-alive', function() {

      it('sends a Connection: keep-alive header (using options.headers.connection)', function(done) {
        send_request({ headers: { connection: 'keep-alive' }}, function(err, resp) {
          resp.body.headers['connection'].should.eql('keep-alive');
          done();
        })
      })

      it('sends a Connection: keep-alive header (using options.connection)', function(done) {
        send_request({ connection: 'keep-alive' }, function(err, resp) {
          resp.body.headers['connection'].should.eql('keep-alive');
          done();
        })
      })

      it('one open socket remain after request', function(done) {
        send_request({ connection: 'keep-alive' }, function(err, resp) {
          get_active_sockets().length.should.eql(existing_sockets + 1);
          done();
        });
      })

    })

  })

  describe('using shared keep-alive agent', function() {

    before(function() {
      needle.defaults({ agent: http.Agent({ keepAlive: true }) })
    })

    after(function() {
      needle.defaults().agent.destroy(); // close existing connections
      needle.defaults({ agent: null }); // and reset default value
    })

    describe('default options', function() {

      it('sends a Connection: keep-alive header', function(done) {
        send_request({}, function(err, resp) {
          resp.body.headers['connection'].should.eql('keep-alive');
          done();
        })
      })

      it('one open socket remain after request', function(done) {
        send_request({ connection: 'keep-alive' }, function(err, resp) {
          setTimeout(function() {
            get_active_sockets().length.should.eql(existing_sockets + 1);
            done();
          }, 10);
        });
      })

    })

    describe('passing connection: close', function() {

      it('sends a Connection: close header', function(done) {
        send_request({ connection: 'close' }, function(err, resp) {
          resp.body.headers['connection'].should.eql('close');
          done();
        })
      })

      it('no open sockets remain after request', function(done) {
        send_request({ connection: 'close' }, function(err, resp) {
          setTimeout(function() {
            get_active_sockets().length.should.eql(existing_sockets);
            done();
          }, 10)
        });
      })

    })

    describe('passing connection: keep-alive', function() {

      it('sends a Connection: keep-alive header (using options.headers.connection)', function(done) {
        send_request({ headers: { connection: 'keep-alive' }}, function(err, resp) {
          resp.body.headers['connection'].should.eql('keep-alive');
          done();
        })
      })

      it('sends a Connection: keep-alive header (using options.connection)', function(done) {
        send_request({ connection: 'keep-alive' }, function(err, resp) {
          resp.body.headers['connection'].should.eql('keep-alive');
          done();
        })
      })

      it('one open socket remain after request', function(done) {
        send_request({ connection: 'keep-alive' }, function(err, resp) {
          setTimeout(function() {
            get_active_sockets().length.should.eql(existing_sockets + 1);
            done();
          }, 10);
        })
      })

    })


  })

})
