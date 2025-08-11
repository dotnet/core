var should  = require('should'),
  needle  = require('./../'),
  helpers = require('./helpers');

describe('receiving json and xml content as string', function() {

  this.timeout(5000);

  ["text/plain", "application/json", "application/ld+json", "application/xml", "image/svg+xml"].forEach(function(mimetype, offset){

    describe('Given content-type: "'+mimetype+'"', function () {

      var server, port = 54330+offset;

      before(function(done) {
        server = helpers.server({
          port: port,
          response: 'content',
          headers: { 'Content-Type': mimetype }
        }, done);
      })

      after(function(done) {
        server.close(done)
      })

      describe('with parse = false', function () {
        it('delivers by default as string', function (done) {

          needle.get('http://localhost:' + port, { parse: false }, function (err, resp) {

            resp.body.should.be.a.String;
            (typeof resp.body).should.eql('string')
            done();
          })

        })

      })

    })

  });
  
  ["application/octet-stream", "image/png"].forEach(function(mimetype, offset){
  
    describe('Given content-type: "'+mimetype+'"', function () {

      var server, port = 54340+offset;

      before(function(done) {
        server = helpers.server({
          port: port,
          response: 'content',
          headers: { 'Content-Type': mimetype }
        }, done);
      })

      after(function(done) {
        server.close(done)
      })

      describe('with parse = false', function () {
        it('delivers by default as Buffer', function (done) {

          needle.get('http://localhost:' + port, { parse: false }, function (err, resp) {

            resp.body.should.be.a.Buffer;
            (resp.body instanceof Buffer).should.eql(true)
            done();
          })

        })

      })

    })

  })

})
