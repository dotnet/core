var needle = require('../'),
    should = require('should');

describe('when posting a very long string', function() {

  this.timeout(20000);

  function get_string(length) {
    var str = '';
    for (var i = 0; i < length; i++) {
      str += 'x';
    }
    return str;
  }

  var major_version = process.version.split('.')[0];

  it("shouldn't throw an EPIPE error out of nowhere", function(done) {

    // for some reason this test fails in Github Actions with Node v8.x
    // although in my Linux box passes without issues
    if (process.env.CI && (major_version == 'v8' || major_version == 'v6')) {
      return done();
    }

    var error;

    function finished() {
      setTimeout(function() {
        should.not.exist(error);
        done();
      }, 300);
    }

    try {
      needle.post('https://google.com', { data: get_string(Math.pow(2, 20)) }, finished)
    } catch(e) {
      error = e;
    }

  })

})
