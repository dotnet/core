var needle  = require('../'),
    fs = require('fs'),
    should  = require('should'),
    helpers = require('./helpers');

describe('stream events', function() {

  var server,
      port = 3456,
      responseData,
      serverOpts = {},
      requestHandler = function(req, res) { res.end('OK') }

  before(function() {
    var opts = {
      port: port,
      handler: function(req, res) { requestHandler(req, res) }
    }
    server = helpers.server(opts);
  })

  after(function() {
    server.close();
  })

  beforeEach(function() {
    responseData = '';
  })

  describe('when consuming data directly', function() {

    function send_request(opts, cb) {
      return needle
              .get('http://localhost:' + port, opts)
              .on('data', function(data) { responseData += data })
    }

    describe('and request stream fails', function() {

      it('emits done event with error', function(done) {
        requestHandler = function(req, res) { req.socket.destroy() }

        send_request({}).on('done', function(err) {
          err.code.should.eql('ECONNRESET');
          responseData.should.eql('');
          done()
        })
      })

    })

    describe('and request succeeds but decoding fails', function() {

      it('emits done event without error', function(done) {
        requestHandler = function(req, res) {
          res.setHeader('Content-Type', 'application/json')
          res.end('invalid:json')
        }

        send_request({ json: true }).on('done', function(err) {
          should.not.exist(err);
          responseData.should.eql('invalid:json');
          done()
        })
      })

    })

    describe('and request succeeds and pipeline works ok', function() {

      it('emits done event without error', function(done) {
        requestHandler = function(req, res) { res.end('{"ok":1}') }

        send_request({ json: true }).on('done', function(err) {
          should.not.exist(err);
          responseData.should.eql('{"ok":1}');
          done()
        })
      })

    })

  })

  describe('when piping to a fs writableStream', function() {

    var outFile = 'test/tmp.dat';

    function send_request(opts, cb) {
      return needle
              .get('http://localhost:' + port, opts)
              .pipe(fs.createWriteStream(outFile))
              .on('data', function(data) { responseData += data })
    }

    after(function(done) {
      fs.unlink(outFile, done)
    })

    describe('and request stream fails', function() {

      it('final stream emits done event with error', function(done) {
        requestHandler = function(req, res) { req.socket.destroy() }

        send_request({}).on('done', function(err) {
          err.code.should.eql('ECONNRESET');
          done()
        })
      })

    })

    describe('and request succeeds but decoding fails', function() {

      it('final stream emits done event without error', function(done) {
        requestHandler = function(req, res) {
          res.setHeader('Content-Type', 'application/json')
          res.end('invalid:json')
        }

        send_request({ json: true }).on('done', function(err) {
          should.not.exist(err);
          done()
        })
      })

    })

    describe('and request succeeds and pipeline works ok', function() {

      it('final stream emits done event without error', function(done) {
        requestHandler = function(req, res) { res.end('{"ok":1}') }

        send_request({ json: true }).on('done', function(err) {
          should.not.exist(err);
          done()
        })
      })

    })

  })

})