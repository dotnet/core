var should = require('should'),
    needle = require('./../'),
    fs = require('fs'),
    https = require('https'),
    stream = require('stream');

describe('socket cleanup', function(){

  var outFile = 'test/tmp';
  var httpAgent, readStream, writeStream

  var file = 'ubuntu-21.04-desktop-amd64.iso',
      url = 'https://releases.ubuntu.com/21.04/' + file;

  function getActiveSockets() {
    return Object.keys(httpAgent.sockets).length
  }

  before(function() {
    httpAgent = new https.Agent({
      keepAlive  : true,
      maxSockets : 1
    });
  })

  after(function() {
    httpAgent.destroy()
    fs.unlinkSync(outFile);
  })

  it('should cleanup sockets on ERR_STREAM_PREMATURE_CLOSE (using .pipe)', function(done) {
    getActiveSockets().should.eql(0);

    var resp = needle.get(url, { agent: httpAgent });
    var writable = fs.createWriteStream(outFile);
    resp.pipe(writable);

    writable.on('close', function(e) {
      if (!resp.done) resp.abort();
    })

    setTimeout(function() {
      getActiveSockets().should.eql(1);
      writable.destroy();
    }, 50);

    setTimeout(function() {
      getActiveSockets().should.eql(0);
      done();
    }, 500); // takes a bit
  })

  it('should cleanup sockets on ERR_STREAM_PREMATURE_CLOSE (using stream.pipeline)', function(done) {
    if (!stream.pipeline)
      return done()

    getActiveSockets().should.eql(0);

    var resp = needle.get(url, { agent: httpAgent });
    var writable = fs.createWriteStream(outFile);

    stream.pipeline(resp, writable, function(err) {
      err.code.should.eql('ERR_STREAM_PREMATURE_CLOSE')
      if (err) resp.request.destroy();
    });

    setTimeout(function() {
      getActiveSockets().should.eql(1);
      writable.destroy();
    }, 50);

    setTimeout(function() {
      getActiveSockets().should.eql(0);
      done();
    }, 1000); // takes a bit

  })

})
