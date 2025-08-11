//////////////////////////////////////////
// Needle -- HTTP Client for Node.js
// Written by Tomás Pollak <tomas@forkhq.com>
// (c) 2012-2023 - Fork Ltd.
// MIT Licensed
//////////////////////////////////////////

var fs          = require('fs'),
    http        = require('http'),
    https       = require('https'),
    url         = require('url'),
    stream      = require('stream'),
    debug       = require('util').debuglog('needle'),
    stringify   = require('./querystring').build,
    multipart   = require('./multipart'),
    auth        = require('./auth'),
    cookies     = require('./cookies'),
    parsers     = require('./parsers'),
    decoder     = require('./decoder'),
    utils       = require('./utils');

//////////////////////////////////////////
// variabilia

var version     = require('../package.json').version;

var user_agent  = 'Needle/' + version;
user_agent     += ' (Node.js ' + process.version + '; ' + process.platform + ' ' + process.arch + ')';

var tls_options = 'pfx key passphrase cert ca ciphers rejectUnauthorized secureProtocol checkServerIdentity family';

// older versions of node (< 0.11.4) prevent the runtime from exiting
// because of connections in keep-alive state. so if this is the case
// we'll default new requests to set a Connection: close header.
var close_by_default = !http.Agent || http.Agent.defaultMaxSockets != Infinity;

// see if we have Object.assign. otherwise fall back to util._extend
var extend = Object.assign ? Object.assign : require('util')._extend;

// these are the status codes that Needle interprets as redirects.
var redirect_codes = [301, 302, 303, 307, 308];

//////////////////////////////////////////
// decompressors for gzip/deflate/br bodies

function bind_opts(fn, options) {
  return fn.bind(null, options);
}

var decompressors = {};

try {

  var zlib = require('zlib');

  // Enable Z_SYNC_FLUSH to avoid Z_BUF_ERROR errors (Node PR #2595)
  var zlib_options = {
    flush: zlib.Z_SYNC_FLUSH,
    finishFlush: zlib.Z_SYNC_FLUSH
  };

  var br_options = {
    flush: zlib.BROTLI_OPERATION_FLUSH,
    finishFlush: zlib.BROTLI_OPERATION_FLUSH
  };

  decompressors['x-deflate'] = bind_opts(zlib.Inflate, zlib_options);
  decompressors['deflate']   = bind_opts(zlib.Inflate, zlib_options);
  decompressors['x-gzip']    = bind_opts(zlib.Gunzip, zlib_options);
  decompressors['gzip']      = bind_opts(zlib.Gunzip, zlib_options);
  if (typeof zlib.BrotliDecompress === 'function') {
    decompressors['br']      = bind_opts(zlib.BrotliDecompress, br_options);
  }

} catch(e) { /* zlib not available */ }

//////////////////////////////////////////
// options and aliases

var defaults = {
  // data
  boundary                : '--------------------NODENEEDLEHTTPCLIENT',
  encoding                : 'utf8',
  parse_response          : 'all', // same as true. valid options: 'json', 'xml' or false/null
  proxy                   : null,

  // agent & headers
  agent                   : null,
  headers                 : {},
  accept                  : '*/*',
  user_agent              : user_agent,

  // numbers
  open_timeout            : 10000,
  response_timeout        : 0,
  read_timeout            : 0,
  follow_max              : 0,
  stream_length           : -1,

  // abort signal
  signal                  : null,

  // booleans
  compressed              : false,
  decode_response         : true,
  parse_cookies           : true,
  follow_set_cookies      : false,
  follow_set_referer      : false,
  follow_keep_method      : false,
  follow_if_same_host     : false,
  follow_if_same_protocol : false,
  follow_if_same_location : false,
  use_proxy_from_env_var  : true
}

var aliased = {
  options: {
    decode  : 'decode_response',
    parse   : 'parse_response',
    timeout : 'open_timeout',
    follow  : 'follow_max'
  },
  inverted: {}
}

// only once, invert aliased keys so we can get passed options.
Object.keys(aliased.options).map(function(k) {
  var value = aliased.options[k];
  aliased.inverted[value] = k;
});

//////////////////////////////////////////
// helpers

function keys_by_type(type) {
  return Object.keys(defaults).map(function(el) {
    if (defaults[el] !== null && defaults[el].constructor == type)
      return el;
  }).filter(function(el) { return el })
}

//////////////////////////////////////////
// the main act

function Needle(method, uri, data, options, callback) {
  // if (!(this instanceof Needle)) {
  //   return new Needle(method, uri, data, options, callback);
  // }

  if (typeof uri !== 'string')
    throw new TypeError('URL must be a string, not ' + uri);

  this.method   = method.toLowerCase();
  this.uri      = uri;
  this.data     = data;

  if (typeof options == 'function') {
    this.callback = options;
    this.options  = {};
  } else {
    this.callback = callback;
    this.options  = options;
  }

}

Needle.prototype.setup = function(uri, options) {

  function get_option(key, fallback) {
    // if original is in options, return that value
    if (typeof options[key] != 'undefined') return options[key];

    // otherwise, return value from alias or fallback/undefined
    return typeof options[aliased.inverted[key]] != 'undefined'
                ? options[aliased.inverted[key]] : fallback;
  }

  function check_value(expected, key) {
    var value = get_option(key),
        type  = typeof value;

    if (type != 'undefined' && type != expected)
      throw new TypeError(type + ' received for ' + key + ', but expected a ' + expected);

    return (type == expected) ? value : defaults[key];
  }

  //////////////////////////////////////////////////
  // the basics

  var config = {
    http_opts : {
      agent: get_option('agent', defaults.agent),
      localAddress: get_option('localAddress', undefined),
      lookup: get_option('lookup', undefined),
      signal: get_option('signal', defaults.signal)
    }, // passed later to http.request() directly
    headers   : {},
    output    : options.output,
    proxy     : get_option('proxy', defaults.proxy),
    parser    : get_option('parse_response', defaults.parse_response),
    encoding  : options.encoding || (options.multipart ? 'binary' : defaults.encoding)
  }

  keys_by_type(Boolean).forEach(function(key) {
    config[key] = check_value('boolean', key);
  })

  keys_by_type(Number).forEach(function(key) {
    config[key] = check_value('number', key);
  })

  if (config.http_opts.signal && !(config.http_opts.signal instanceof AbortSignal))
    throw new TypeError(typeof config.http_opts.signal + ' received for signal, but expected an AbortSignal');

  // populate http_opts with given TLS options
  tls_options.split(' ').forEach(function(key) {
    if (typeof options[key] != 'undefined') {
      if (config.http_opts.agent) { // pass option to existing agent
        config.http_opts.agent.options[key] = options[key];
      } else {
        config.http_opts[key] = options[key];
      }
    }
  });

  //////////////////////////////////////////////////
  // headers, cookies

  for (var key in defaults.headers)
    config.headers[key] = defaults.headers[key];

  config.headers['accept'] = options.accept || defaults.accept;
  config.headers['user-agent'] = options.user_agent || defaults.user_agent;

  if (options.content_type)
    config.headers['content-type'] = options.content_type;

  // set connection header if opts.connection was passed, or if node < 0.11.4 (close)
  if (options.connection || close_by_default)
    config.headers['connection'] = options.connection || 'close';

  if ((options.compressed || defaults.compressed) && typeof zlib != 'undefined')
    config.headers['accept-encoding'] = decompressors['br'] ? 'gzip, deflate, br' : 'gzip, deflate';

  if (options.cookies)
    config.headers['cookie'] = cookies.write(options.cookies);

  //////////////////////////////////////////////////
  // basic/digest auth

  if (uri.match(/[^\/]@/)) { // url contains user:pass@host, so parse it.
    var parts = (url.parse(uri).auth || '').split(':');
    options.username = parts[0];
    options.password = parts[1];
  }

  if (options.username) {
    if (options.auth && (options.auth == 'auto' || options.auth == 'digest')) {
      config.credentials = [options.username, options.password];
    } else {
      config.headers['authorization'] = auth.basic(options.username, options.password);
    }
  }

  if (config.use_proxy_from_env_var) {
    var env_proxy = utils.get_env_var(['HTTP_PROXY', 'HTTPS_PROXY'], true);
    if (!config.proxy && env_proxy) config.proxy = env_proxy;
  }

  // if proxy is present, set auth header from either url or proxy_user option.
  if (config.proxy) {
    if (!config.use_proxy_from_env_var || utils.should_proxy_to(uri)) {
      if (config.proxy.indexOf('http') === -1)
        config.proxy = 'http://' + config.proxy;

      if (config.proxy.indexOf('@') !== -1) {
        var proxy = (url.parse(config.proxy).auth || '').split(':');
        options.proxy_user = proxy[0];
        options.proxy_pass = proxy[1];
      }

      if (options.proxy_user)
        config.headers['proxy-authorization'] = auth.basic(options.proxy_user, options.proxy_pass);
    } else {
      delete config.proxy;
    }
  }

  // now that all our headers are set, overwrite them if instructed.
  for (var h in options.headers)
    config.headers[h.toLowerCase()] = options.headers[h];

  config.uri_modifier = get_option('uri_modifier', null);

  return config;
}

Needle.prototype.start = function() {

  var out      = new stream.PassThrough({ objectMode: false }),
      uri      = this.uri,
      data     = this.data,
      method   = this.method,
      callback = (typeof this.options == 'function') ? this.options : this.callback,
      options  = this.options || {};

  // if no 'http' is found on URL, prepend it.
  if (uri.indexOf('http') === -1)
    uri = uri.replace(/^(\/\/)?/, 'http://');

  var self = this, body, waiting = false, config = this.setup(uri, options);

  // unless options.json was set to false, assume boss also wants JSON if content-type matches.
  var json = options.json || (options.json !== false && config.headers['content-type'] == 'application/json');

  if (data) {

    if (options.multipart) { // boss says we do multipart. so we do it.
      var boundary = options.boundary || defaults.boundary;

      waiting = true;
      multipart.build(data, boundary, function(err, parts) {
        if (err) throw(err);

        config.headers['content-type'] = 'multipart/form-data; boundary=' + boundary;
        next(parts);
      });

    } else if (utils.is_stream(data)) {

      if (method == 'get')
        throw new Error('Refusing to pipe() a stream via GET. Did you mean .post?');

      if (config.stream_length > 0 || (config.stream_length === 0 && data.path)) {
        // ok, let's get the stream's length and set it as the content-length header.
        // this prevents some servers from cutting us off before all the data is sent.
        waiting = true;
        utils.get_stream_length(data, config.stream_length, function(length) {
          data.length = length;
          next(data);
        })

      } else {
        // if the boss doesn't want us to get the stream's length, or if it doesn't
        // have a file descriptor for that purpose, then just head on.
        body = data;
      }

    } else if (Buffer.isBuffer(data)) {

      body = data; // use the raw buffer as request body.

    } else if (method == 'get' && !json) {

      // append the data to the URI as a querystring.
      uri = uri.replace(/\?.*|$/, '?' + stringify(data));

    } else { // string or object data, no multipart.

      // if string, leave it as it is, otherwise, stringify.
      body = (typeof(data) === 'string') ? data
             : json ? JSON.stringify(data) : stringify(data);

      // ensure we have a buffer so bytecount is correct.
      body = Buffer.from(body, config.encoding);
    }

  }

  function next(body) {
    if (body) {
      if (body.length) config.headers['content-length'] = body.length;

      // if no content-type was passed, determine if json or not.
      if (!config.headers['content-type']) {
        config.headers['content-type'] = json
        ? 'application/json; charset=utf-8'
        : 'application/x-www-form-urlencoded'; // no charset says W3 spec.
      }
    }

    // unless a specific accept header was set, assume json: true wants JSON back.
    if (options.json && (!options.accept && !(options.headers || {}).accept))
      config.headers['accept'] = 'application/json';

    self.send_request(1, method, uri, config, body, out, callback);
  }

  if (!waiting) next(body);
  return out;
}

Needle.prototype.get_request_opts = function(method, uri, config) {
  var opts      = config.http_opts,
      proxy     = config.proxy,
      remote    = proxy ? url.parse(proxy) : url.parse(uri);

  opts.protocol = remote.protocol;
  opts.host     = remote.hostname;
  opts.port     = remote.port || (remote.protocol == 'https:' ? 443 : 80);
  opts.path     = proxy ? uri : remote.pathname + (remote.search || '');
  opts.method   = method;
  opts.headers  = config.headers;

  if (!opts.headers['host']) {
    // if using proxy, make sure the host header shows the final destination
    var target = proxy ? url.parse(uri) : remote;
    opts.headers['host'] = target.hostname;

    // and if a non standard port was passed, append it to the port header
    if (target.port && [80, 443].indexOf(target.port) === -1) {
      opts.headers['host'] += ':' + target.port;
    }
  }

  return opts;
}

Needle.prototype.should_follow = function(location, config, original) {
  if (!location) return false;

  // returns true if location contains matching property (host or protocol)
  function matches(property) {
    var property = original[property];
    return location.indexOf(property) !== -1;
  }

  // first, check whether the requested location is actually different from the original
  if (!config.follow_if_same_location && location === original)
    return false;

  if (config.follow_if_same_host && !matches('host'))
    return false; // host does not match, so not following

  if (config.follow_if_same_protocol && !matches('protocol'))
    return false; // procotol does not match, so not following

  return true;
}

Needle.prototype.send_request = function(count, method, uri, config, post_data, out, callback) {

  if (typeof config.uri_modifier === 'function') {
    var modified_uri = config.uri_modifier(uri);
    debug('Modifying request URI', uri + ' => ' + modified_uri);
    uri = modified_uri;
  }

  var request,
      timer,
      returned     = 0,
      self         = this,
      request_opts = this.get_request_opts(method, uri, config),
      protocol     = request_opts.protocol == 'https:' ? https : http,
      signal       = request_opts.signal;

  function done(err, resp) {
    if (returned++ > 0)
      return debug('Already finished, stopping here.');

    if (timer) clearTimeout(timer);
    request.removeListener('error', had_error);
    out.done = true;

    // An error can still be fired after closing.  In particular, on macOS.
    // See also:
    //  - https://github.com/tomas/needle/issues/391
    //  - https://github.com/less/less.js/issues/3693
    //  - https://github.com/nodejs/node/issues/27916
    request.once('error', function() {});

    if (callback)
      return callback(err, resp, resp ? resp.body : undefined);

    // NOTE: this event used to be called 'end', but the behaviour was confusing
    // when errors ocurred, because the stream would still emit an 'end' event.
    out.emit('done', err);

    // trigger the 'done' event on streams we're being piped to, if any
    var pipes = out._readableState.pipes || [];
    if (!pipes.forEach) pipes = [pipes];
    pipes.forEach(function(st) { st.emit('done', err); })
  }

  function had_error(err) {
    debug('Request error', err);
    out.emit('err', err);
    done(err || new Error('Unknown error when making request.'));
  }

  function abort_handler() {
    out.emit('err', new Error('Aborted by signal.'));
    request.destroy();
  }

  function set_timeout(type, milisecs) {
    if (timer) clearTimeout(timer);
    if (milisecs <= 0) return;

    timer = setTimeout(function() {
      out.emit('timeout', type);
      request.destroy();
      // also invoke done() to terminate job on read_timeout
      if (type == 'read') done(new Error(type + ' timeout'));

      signal && signal.removeEventListener('abort', abort_handler);
    }, milisecs);
  }

  debug('Making request #' + count, request_opts);
  request = protocol.request(request_opts, function(resp) {

    var headers = resp.headers;
    debug('Got response', resp.statusCode, headers);
    out.emit('response', resp);

    set_timeout('read', config.read_timeout);

    // if we got cookies, parse them unless we were instructed not to. make sure to include any
    // cookies that might have been set on previous redirects.
    if (config.parse_cookies && (headers['set-cookie'] || config.previous_resp_cookies)) {
      resp.cookies = extend(config.previous_resp_cookies || {}, cookies.read(headers['set-cookie']));
      debug('Got cookies', resp.cookies);
    }

    // if redirect code is found, determine if we should follow it according to the given options.
    if (redirect_codes.indexOf(resp.statusCode) !== -1 && self.should_follow(headers.location, config, uri)) {
      // clear timer before following redirects to prevent unexpected setTimeout consequence
      clearTimeout(timer);

      if (count <= config.follow_max) {
        out.emit('redirect', headers.location);

        // unless 'follow_keep_method' is true, rewrite the request to GET before continuing.
        if (!config.follow_keep_method) {
          method    = 'GET';
          post_data = null;
          delete config.headers['content-length']; // in case the original was a multipart POST request.
        }

        // if follow_set_cookies is true, insert cookies in the next request's headers.
        // we set both the original request cookies plus any response cookies we might have received.
        if (config.follow_set_cookies && utils.host_and_ports_match(headers.location, uri)) {
          var request_cookies = cookies.read(config.headers['cookie']);
          config.previous_resp_cookies = resp.cookies;
          if (Object.keys(request_cookies).length || Object.keys(resp.cookies || {}).length) {
            config.headers['cookie'] = cookies.write(extend(request_cookies, resp.cookies));
          }
        } else if (config.headers['cookie']) {
          debug('Clearing original request cookie', config.headers['cookie']);
          delete config.headers['cookie'];
        }

        if (config.follow_set_referer)
          config.headers['referer'] = encodeURI(uri); // the original, not the destination URL.

        config.headers['host'] = null; // clear previous Host header to avoid conflicts.

        var redirect_url = utils.resolve_url(headers.location, uri);
        debug('Redirecting to ' +  redirect_url.toString());
        return self.send_request(++count, method, redirect_url.toString(), config, post_data, out, callback);
      } else if (config.follow_max > 0) {
        return done(new Error('Max redirects reached. Possible loop in: ' + headers.location));
      }
    }

    // if auth is requested and credentials were not passed, resend request, provided we have user/pass.
    if (resp.statusCode == 401 && headers['www-authenticate'] && config.credentials) {
      if (!config.headers['authorization']) { // only if authentication hasn't been sent
        var auth_header = auth.header(headers['www-authenticate'], config.credentials, request_opts);

        if (auth_header) {
          config.headers['authorization'] = auth_header;
          return self.send_request(count, method, uri, config, post_data, out, callback);
        }
      }
    }

    // ok, so we got a valid (non-redirect & authorized) response. let's notify the stream guys.
    out.emit('header', resp.statusCode, headers);
    out.emit('headers', headers);

    var pipeline      = [],
        mime          = utils.parse_content_type(headers['content-type']),
        text_response = mime.type && (mime.type.indexOf('text/') != -1 || !!mime.type.match(/(\/|\+)(xml|json)$/));

    // To start, if our body is compressed and we're able to inflate it, do it.
    if (headers['content-encoding'] && decompressors[headers['content-encoding']]) {

      var decompressor = decompressors[headers['content-encoding']]();

      // make sure we catch errors triggered by the decompressor.
      decompressor.on('error', had_error);
      pipeline.push(decompressor);
    }

    // If parse is enabled and we have a parser for it, then go for it.
    if (config.parser && parsers[mime.type]) {

      // If a specific parser was requested, make sure we don't parse other types.
      var parser_name = config.parser.toString().toLowerCase();
      if (['xml', 'json'].indexOf(parser_name) == -1 || parsers[mime.type].name == parser_name) {

        // OK, so either we're parsing all content types or the one requested matches.
        out.parser = parsers[mime.type].name;
        pipeline.push(parsers[mime.type].fn());

        // Set objectMode on out stream to improve performance.
        out._writableState.objectMode = true;
        out._readableState.objectMode = true;
      }

    // If we're not parsing, and unless decoding was disabled, we'll try
    // decoding non UTF-8 bodies to UTF-8, using the iconv-lite library.
    } else if (text_response && config.decode_response && mime.charset) {
      pipeline.push(decoder(mime.charset));
    }

    // And `out` is the stream we finally push the decoded/parsed output to.
    pipeline.push(out);

    // Now, release the kraken!
    utils.pump_streams([resp].concat(pipeline), function(err) {
      if (err) debug(err)

      // on node v8.x, if an error ocurrs on the receiving end,
      // then we want to abort the request to avoid having dangling sockets
      if (err && err.message == 'write after end') request.destroy();
    });

    // If the user has requested and output file, pipe the output stream to it.
    // In stream mode, we will still get the response stream to play with.
    if (config.output && resp.statusCode == 200) {

      // for some reason, simply piping resp to the writable stream doesn't
      // work all the time (stream gets cut in the middle with no warning).
      // so we'll manually need to do the readable/write(chunk) trick.
      var file = fs.createWriteStream(config.output);
      file.on('error', had_error);

      out.on('end', function() {
        if (file.writable) file.end();
      });

      file.on('close', function() {
        delete out.file;
      })

      out.on('readable', function() {
        var chunk;
        while ((chunk = this.read()) !== null) {
          if (file.writable) file.write(chunk);

          // if callback was requested, also push it to resp.body
          if (resp.body) resp.body.push(chunk);
        }
      })

      out.file = file;
    }

    // Only aggregate the full body if a callback was requested.
    if (callback) {
      resp.raw   = [];
      resp.body  = [];
      resp.bytes = 0;

      // Gather and count the amount of (raw) bytes using a PassThrough stream.
      var clean_pipe = new stream.PassThrough();

      clean_pipe.on('readable', function() {
        var chunk;
        while ((chunk = this.read()) != null) {
          resp.bytes += chunk.length;
          resp.raw.push(chunk);
        }
      })

      utils.pump_streams([resp, clean_pipe], function(err) {
        if (err) debug(err);
      });

      // Listen on the 'readable' event to aggregate the chunks, but only if
      // file output wasn't requested. Otherwise we'd have two stream readers.
      if (!config.output || resp.statusCode != 200) {
        out.on('readable', function() {
          var chunk;
          while ((chunk = this.read()) !== null) {
            // We're either pushing buffers or objects, never strings.
            if (typeof chunk == 'string') chunk = Buffer.from(chunk);

            // Push all chunks to resp.body. We'll bind them in resp.end().
            resp.body.push(chunk);
          }
        })
      }
    }

    // And set the .body property once all data is in.
    out.on('end', function() {
      if (resp.body) { // callback mode

        // we want to be able to access to the raw data later, so keep a reference.
        resp.raw = Buffer.concat(resp.raw);

        // if parse was successful, we should have an array with one object
        if (resp.body[0] !== undefined && !Buffer.isBuffer(resp.body[0])) {

          // that's our body right there.
          resp.body = resp.body[0];

          // set the parser property on our response. we may want to check.
          if (out.parser) resp.parser = out.parser;

        } else { // we got one or several buffers. string or binary.
          resp.body = Buffer.concat(resp.body);

          // if we're here and parsed is true, it means we tried to but it didn't work.
          // so given that we got a text response, let's stringify it.
          if (text_response || out.parser) {
            resp.body = resp.body.toString();
          }
        }
      }

      // if an output file is being written to, make sure the callback
      // is triggered after all data has been written to it.
      if (out.file) {
        out.file.on('close', function() {
          done(null, resp);
        })
      } else { // elvis has left the building.
        done(null, resp);
      }

    });

    // out.on('error', function(err) {
    //   had_error(err);
    //   if (err.code == 'ERR_STREAM_DESTROYED' || err.code == 'ERR_STREAM_PREMATURE_CLOSE') {
    //     request.abort();
    //   }
    // })

  }); // end request call

  // unless open_timeout was disabled, set a timeout to abort the request.
  set_timeout('open', config.open_timeout);

  // handle errors on the request object. things might get bumpy.
  request.on('error', had_error);

  // make sure timer is cleared if request is aborted (issue #257)
  request.once('abort', function() {
    if (timer) clearTimeout(timer);
  })

  // set response timeout once we get a valid socket
  request.once('socket', function(socket) {
    if (socket.connecting) {
      socket.once('connect', function() {
        set_timeout('response', config.response_timeout);
      })
    } else {
      set_timeout('response', config.response_timeout);
    }
  })

  if (post_data) {
    if (utils.is_stream(post_data)) {
      utils.pump_streams([post_data, request], function(err) {
        if (err) debug(err);
      });
    } else {
      request.write(post_data, config.encoding);
      request.end();
    }
  } else {
    request.end();
  }

  if (signal) { // abort signal given, so handle it
    if (signal.aborted === true) {
      abort_handler();
    } else {
      signal.addEventListener('abort', abort_handler, { once: true });
    }
  }

  out.abort = function() { request.destroy() }; // easier access
  out.request = request;
  return out;
}

//////////////////////////////////////////
// exports

if (typeof Promise !== 'undefined') {
  module.exports = function() {
    var verb, args = [].slice.call(arguments);

    if (args[0].match(/\.|\//)) // first argument looks like a URL
      verb = (args.length > 2) ? 'post' : 'get';
    else
      verb = args.shift();

    if (verb.match(/get|head/i) && args.length == 2)
      args.splice(1, 0, null); // assume no data if head/get with two args (url, options)

    return new Promise(function(resolve, reject) {
      module.exports.request(verb, args[0], args[1], args[2], function(err, resp) {
        return err ? reject(err) : resolve(resp);
      });
    })
  }
}

module.exports.version = version;

module.exports.defaults = function(obj) {
  for (var key in obj) {
    var target_key = aliased.options[key] || key;

    if (defaults.hasOwnProperty(target_key) && typeof obj[key] != 'undefined') {
      if (target_key != 'parse_response' && target_key != 'proxy' && target_key != 'agent' && target_key != 'signal') {
        // ensure type matches the original, except for proxy/parse_response that can be null/bool or string, and signal that can be null/AbortSignal
        var valid_type = defaults[target_key].constructor.name;

        if (obj[key].constructor.name != valid_type)
          throw new TypeError('Invalid type for ' + key + ', should be ' + valid_type);
      } else if (target_key === 'signal' && obj[key] !== null && !(obj[key] instanceof AbortSignal)) {
        throw new TypeError('Invalid type for ' + key + ', should be AbortSignal');
      }
      defaults[target_key] = obj[key];
    } else {
      throw new Error('Invalid property for defaults:' + target_key);
    }
  }

  return defaults;
}

'head get'.split(' ').forEach(function(method) {
  module.exports[method] = function(uri, options, callback) {
    return new Needle(method, uri, null, options, callback).start();
  }
})

'post put patch delete'.split(' ').forEach(function(method) {
  module.exports[method] = function(uri, data, options, callback) {
    return new Needle(method, uri, data, options, callback).start();
  }
})

module.exports.request = function(method, uri, data, opts, callback) {
  return new Needle(method, uri, data, opts, callback).start();
};
