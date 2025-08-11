var should  = require('should'),
    needle  = require('./../'),
    decoder = require('./../lib/decoder'),
    Q       = require('q'),
    chardet = require('jschardet'),
    fs      = require('fs'),
    http    = require('http'),
    helpers = require('./helpers');

describe('character encoding', function() {

  this.timeout(5000);

  function staticServerFor(file, content_type) {
    return http.createServer(function(req, res) {
      req.on('data', function(chunk) {})
      req.on('end', function() {
        // We used to pull from a particular site that is no longer up.
        // This is a local mirror pulled from archive.org
        // https://web.archive.org/web/20181003202907/http://www.nina.jp/server/slackware/webapp/tomcat_charset.html
        fs.readFile(file, function(err, data) {
          if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
          }
          res.writeHeader(200, { 'Content-Type': content_type })
          res.end(data);
        });
      })
    })
  }

  describe('Given content-type: "text/html; charset=EUC-JP"', function() {
    var server, port = 2233;

    before(function(done) {
      server = staticServerFor('test/files/tomcat_charset.html', 'text/html; charset=EUC-JP')
      server.listen(port, done)
      url = 'http://localhost:' + port;
    })

    after(function(done) {
      server.close(done)
    })

    describe('with decode = false', function() {
      it('does not decode', function(done) {
        needle.get(url, { decode: false }, function(err, resp) {
          resp.body.should.be.a.String;
          chardet.detect(resp.body).encoding.should.eql('windows-1252');
          resp.body.indexOf('EUCを使う').should.eql(-1);
          done();
        })
      })
    })

    describe('with decode = true', function() {
      it('decodes', function(done) {
        needle.get(url, { decode: true }, function(err, resp) {
          resp.body.should.be.a.String;
          chardet.detect(resp.body).encoding.should.eql('ascii');
          resp.body.indexOf('EUCを使う').should.not.eql(-1);
          done();
        })
      })
    })
  })

  describe('Given content-type: "text/html but file is charset: gb2312', function() {

    it('encodes to UTF-8', function(done) {

      // Our Needle wrapper that requests a chinese website.
      var task    = Q.nbind(needle.get, needle, 'http://www.chinesetop100.com/');

      // Different instantiations of this task
      var tasks   = [Q.fcall(task, {decode: true}),
                     Q.fcall(task, {decode: false})];

      var results = tasks.map(function(task) {
        return task.then(function(obj) {
          return obj[0].body;
        });
      });

      // Execute all requests concurrently
      Q.all(results).done(function(bodies) {

        var charsets = [
          chardet.detect(bodies[0]).encoding,
          chardet.detect(bodies[1]).encoding,
        ]

        // We wanted to decode our first stream as specified by options
        charsets[0].should.equal('ascii');
        bodies[0].indexOf('全球中文网站前二十强').should.not.equal(-1);

        // But not our second stream
        charsets[1].should.equal('windows-1252');
        bodies[1].indexOf('全球中文网站前二十强').should.equal(-1);

        done();
      });
    })
  })

  describe('Given content-type: text/html; charset=maccentraleurope', function() {
    var server, port = 2233;

    // from 'https://wayback.archive-it.org/3259/20160921140616/https://www.arc.gov/research/MapsofAppalachia.asp?MAP_ID=11';
    before(function(done) {
      server = staticServerFor('test/files/Appalachia.html', 'text/html; charset=maccentraleurope')
      server.listen(port, done)
      url = 'http://localhost:' + port;
    })

    after(function(done) {
      server.close(done)
    })

    describe('with decode = false', function() {
      it('does not decode', function(done) {
        needle.get(url, { decode: false }, function(err, resp) {
          resp.body.should.be.a.String;
          chardet.detect(resp.body).encoding.should.eql('ascii');
          done();
        })
      })
    })

    describe('with decode = true', function() {
      it('does not explode', function(done) {
        (function() {
          needle.get(url, { decode: true }, function(err, resp) {
            resp.body.should.be.a.String;
            chardet.detect(resp.body).encoding.should.eql('ascii');
            done();
          })
        }).should.not.throw();
      })
    })
  })

  describe('Given content-type: "text/html"', function () {

    var server,
        port = 54321,
        text = 'Magyarországi Fióktelepe'

    before(function(done) {
      server = helpers.server({
        port: port,
        response: text,
        headers: { 'Content-Type': 'text/html' }
      }, done);
    })

    after(function(done) {
      server.close(done)
    })

    describe('with decode = false', function () {
      it('decodes by default to utf-8', function (done) {

        needle.get('http://localhost:' + port, { decode: false }, function (err, resp) {
          resp.body.should.be.a.String;
          chardet.detect(resp.body).encoding.should.eql('ISO-8859-2');
          resp.body.should.eql('Magyarországi Fióktelepe')
          done();
        })

      })

    })
  })
  
  describe('multibyte characters split across chunks', function () {

    describe('with encoding = utf-8', function() {
    
      var d, 
        result = Buffer.allocUnsafe(0);

      before(function(done) {
        d = decoder('utf-8');
        done();
      });

      it('reassembles split multibyte characters', function (done) {

        d.on("data", function(chunk){
          result = Buffer.concat([ result, chunk ]);
        });

        d.on("end", function(){
          result.toString("utf-8").should.eql('慶');
          done();
        });

        // write '慶' in utf-8 split across chunks
        d.write(Buffer.from([0xE6]));
        d.write(Buffer.from([0x85]));
        d.write(Buffer.from([0xB6]));
        d.end();

      })
    })
    
    describe('with encoding = euc-jp', function() {
    
      var d, 
        result = Buffer.allocUnsafe(0);

      before(function(done) {
        d = decoder('euc-jp');
        done();
      });

      it('reassembles split multibyte characters', function (done) {

        d.on("data", function(chunk){
          result = Buffer.concat([ result, chunk ]);
        });

        d.on("end", function(){
          result.toString("utf-8").should.eql('慶');
          done();
        });

        // write '慶' in euc-jp split across chunks
        d.write(Buffer.from([0xB7]));
        d.write(Buffer.from([0xC4]));
        d.end();

      })
    })
    
    describe('with encoding = gb18030', function() {
    
      var d, 
        result = Buffer.allocUnsafe(0);

      before(function(done) {
        d = decoder('gb18030');
        done();
      });

      it('reassembles split multibyte characters', function (done) {

        d.on("data", function(chunk){
          result = Buffer.concat([ result, chunk ]);
        });

        d.on("end", function(){
          result.toString("utf-8").should.eql('慶');
          done();
        });

        // write '慶' in gb18030 split across chunks
        d.write(Buffer.from([0x91]));
        d.write(Buffer.from([0x63]));
        d.end();

      })
    })

  })
  
})
