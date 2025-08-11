var needle  = require('../'),
    sinon   = require('sinon'),
    should  = require('should'),
    http    = require('http'),
    helpers = require('./helpers');

var port = 3456;

describe('uri_modifier config parameter function', function() {

  var server, uri;

  function send_request(mw, cb) {
    needle.get(uri, { uri_modifier: mw }, cb);
  }

  before(function(done){
    server = helpers.server({ port: port }, done);
  })

  after(function(done) {
    server.close(done);
  })

  describe('modifies uri', function() {

    var path = '/foo/replace';

    before(function() {
      uri = 'localhost:' + port + path
    });

    it('should modify path', function(done) {
      send_request(function(uri) {
        return uri.replace('/replace', '');
      }, function(err, res) {
        should.not.exist(err);
        should(res.req.path).be.exactly('/foo');
        done();
      });

    });

  })

})
