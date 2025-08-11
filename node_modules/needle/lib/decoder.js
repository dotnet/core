var iconv,
    inherits  = require('util').inherits,
    stream    = require('stream');

var regex = /(?:charset|encoding)\s*=\s*['"]? *([\w\-]+)/i;

inherits(StreamDecoder, stream.Transform);

function StreamDecoder(charset) {
  if (!(this instanceof StreamDecoder))
    return new StreamDecoder(charset);

  stream.Transform.call(this, charset);
  this.charset = charset;
  this.parsed_chunk = false;
}

StreamDecoder.prototype._transform = function(chunk, encoding, done) {
  // try to get charset from chunk, but just once
  if (!this.parsed_chunk && (this.charset == 'utf-8' || this.charset == 'utf8')) {
    this.parsed_chunk = true;

    var matches = regex.exec(chunk.toString());

    if (matches) {
      var found = matches[1].toLowerCase().replace('utf8', 'utf-8'); // canonicalize;
      // set charset, but only if iconv can handle it
      if (iconv.encodingExists(found)) this.charset = found;
    }
  }

  // if charset is already utf-8 or given encoding isn't supported, just pass through
  if (this.charset == 'utf-8' || !iconv.encodingExists(this.charset)) {
    this.push(chunk);
    return done();
  }

  // initialize stream decoder if not present
  var self = this;
  if (!this.decoder) {
    this.decoder = iconv.decodeStream(this.charset);
    this.decoder.on('data', function(decoded_chunk) {
      self.push(decoded_chunk);
    });
  };

  this.decoder.write(chunk);
  done();
}

module.exports = function(charset) {
  try {
    if (!iconv) iconv = require('iconv-lite');
  } catch(e) {
    /* iconv not found */
  }

  if (iconv)
    return new StreamDecoder(charset);
  else
    return new stream.PassThrough;
}
