var fs = require('fs'),
    url = require('url'),
    stream = require('stream');

function resolve_url(href, base) {
  if (url.URL)
    return new url.URL(href, base);

  // older Node version (< v6.13)
  return base ? url.resolve(base, href) : href;
}

function host_and_ports_match(url1, url2) {
  if (url1.indexOf('http') < 0) url1 = 'http://' + url1;
  if (url2.indexOf('http') < 0) url2 = 'http://' + url2;
  var a = url.parse(url1), b = url.parse(url2);

  return a.host == b.host
    && String(a.port || (a.protocol == 'https:' ? 443 : 80))
    == String(b.port || (b.protocol == 'https:' ? 443 : 80));
}

// returns false if a no_proxy host or pattern matches given url
function should_proxy_to(uri) {
  var no_proxy = get_env_var(['NO_PROXY'], true);
  if (!no_proxy) return true;

  // previous (naive, simple) strategy
  // var host, hosts = no_proxy.split(',');
  // for (var i in hosts) {
  //   host = hosts[i];
  //   if (host_and_ports_match(host, uri)) {
  //     return false;
  //   }
  // }

  var pattern, pattern_list = no_proxy.split(/[\s,]+/);
  for (var i in pattern_list) {
    pattern = pattern_list[i];
    if (pattern.trim().length == 0) continue;

    // replace leading dot by asterisk, escape dots and finally replace asterisk by .*
    var regex = new RegExp(pattern.replace(/^\./, "*").replace(/[.]/g, '\\$&').replace(/\*/g, '.*'))
    if (uri.match(regex)) return false;
  }

  return true;
}

function get_env_var(keys, try_lower) {
  var val, i = -1, env = process.env;
  while (!val && i < keys.length-1) {
    val = env[keys[++i]];
    if (!val && try_lower) {
      val = env[keys[i].toLowerCase()];
    }
  }
  return val;
}

function parse_content_type(header) {
  if (!header || header === '') return {};

  var found, charset = 'utf8', arr = header.split(';');

  if (arr.length > 1 && (found = arr[1].match(/charset=(.+)/)))
    charset = found[1];

  return { type: arr[0], charset: charset };
}

function is_stream(obj) {
  return typeof obj.pipe === 'function';
}

function get_stream_length(stream, given_length, cb) {
  if (given_length > 0)
    return cb(given_length);

  if (stream.end !== void 0 && stream.end !== Infinity && stream.start !== void 0)
    return cb((stream.end + 1) - (stream.start || 0));

  fs.stat(stream.path, function(err, stat) {
    cb(stat ? stat.size - (stream.start || 0) : null);
  });
}

function pump_streams(streams, cb) {
  if (stream.pipeline)
    return stream.pipeline.apply(null, streams.concat(cb));

  var tmp = streams.shift();
  while (streams.length) {
    tmp = tmp.pipe(streams.shift());
    tmp.once('error', function(e) {
      cb && cb(e);
      cb = null;
    })
  }
}

module.exports = {
  resolve_url: resolve_url,
  get_env_var: get_env_var,
  host_and_ports_match: host_and_ports_match,
  should_proxy_to: should_proxy_to,
  parse_content_type: parse_content_type,
  is_stream: is_stream,
  get_stream_length: get_stream_length,
  pump_streams: pump_streams
}