var needle  = require('..'),
    https   = require('https'),
    helpers = require('./helpers'),
    should  = require('should');

describe('tls options', function() {

  describe('rejectUnauthorized: false', function() {

    var url = 'https://expired-rsa-dv.ssl.com/';

    it('is an expired cert', function(done) {
      needle.get(url, function(err, resp) {
        err.code.should.eql('CERT_HAS_EXPIRED')
        should.not.exist(resp)
        done()
      })
    })

    it('allows fetching pages under expired certificates', function(done) {
      needle.get(url, { rejectUnauthorized: false }, function(err, resp) {
        should.not.exist(err);
        resp.statusCode.should.eql(200);
        done()
      })
    })

    it('also works when using custom agent', function(done) {
      var agent = new https.Agent({ rejectUnauthorized: true })

      // should overwrite value from custom agent
      needle.get(url, { rejectUnauthorized: false }, function(err, resp) {
        should.not.exist(err);
        resp.statusCode.should.eql(200);
        done()
      })

    })

    it('also works with shared/default agent', function(done) {
      var agent = new https.Agent({ rejectUnauthorized: true })
      needle.defaults({ agent: agent })

      // should overwrite value from custom agent
      needle.get(url, { rejectUnauthorized: false }, function(err, resp) {
        should.not.exist(err);
        resp.statusCode.should.eql(200);

        needle.defaults({ agent: null })
        done()
      })

    })

  })

})