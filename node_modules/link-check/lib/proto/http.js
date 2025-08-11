"use strict";

const BlackHole = require('../BlackHole');
const LinkCheckResult = require('../LinkCheckResult');
const ms = require('ms');
const needle = require('needle');
const pkg = require('../../package.json');
var { ProxyAgent } = require('proxy-agent');

module.exports = {

    check: function check(link, opts, callback, attempts, additionalMessage) {

        attempts = attempts ?? 0;

        // default request timeout set to 10s if not provided in options
        let timeout = opts.timeout || '10s';

        // default open timeout set to 10s if not provided in options
        let open_timeout = opts.open_timeout || '10s';

        // retry on 429 http code flag is false by default if not provided in options
        let retryOn429 = opts.retryOn429 || false;

        //max retry count will default to 2 seconds if not provided in options
        let retryCount = opts.retryCount || 2;

        //fallback retry delay will default to 60 seconds not provided in options
        let fallbackRetryDelayInMs = ms(opts.fallbackRetryDelay || '60s');

        let user_agent = opts.user_agent || `${pkg.name}/${pkg.version}`;

        // Decoding and encoding is required to prevent encoding already encoded URLs
        // We decode using the decodeURIComponent as it will decode a wider range of
        // characters that were not necessary to be encoded at first, then we re-encode
        // only the required ones using encodeURI.
        // Note that we don't use encodeURIComponents as it adds too much non-necessary encodings
        // see "Not Escaped" list in https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#description
        const url = encodeURI(decodeURIComponent(new URL(link, opts.baseUrl).toString()));

        const options = {
            agent: new ProxyAgent(),
            use_proxy_from_env_var: false,
            user_agent: user_agent,
            follow_max: 8,
            follow_keep_method: true,
            response_timeout: ms(timeout),
            open_timeout: ms(open_timeout),
            auth: 'auto',
            headers: {},
            parse_response: false
        };

        if (opts.headers) {
            Object.assign(options.headers, opts.headers);
        }

        needle.head(url, options, function (err, res) {
            if (!err && res.statusCode === 200) {
                if (additionalMessage){
                  err = !err ? additionalMessage : `${err} ${additionalMessage}`;
                }
                callback(null, new LinkCheckResult(opts, link, res ? res.statusCode : 0, err)); // alive, returned 200 OK
                return;
            }

            // if HEAD fails (405 Method Not Allowed, etc), try GET
            needle.get(url, options, function (err, res) {
                // If enabled in opts, the response was a 429 (Too Many Requests) and there is a retry-after provided, wait and then retry
                if (retryOn429 && res && res.statusCode === 429 && attempts < retryCount) {
                    //delay will default to fallbackRetryDelay if no retry-after header is found
                    let retryInMs = fallbackRetryDelayInMs;
                    if (res.headers.hasOwnProperty('retry-after')){
                        const retryStr = res.headers['retry-after'];
                        // Standard for 'retry-after' header is in seconds.
                        // the format have to be checked before to see if it's an integer or a complex one.
                        // see https://github.com/tcort/link-check/issues/24

                        if(isNaN(retryStr)){
                          // Some HTTP servers return a non standard 'retry-after' header with incorrect values according to <https://tools.ietf.org/html/rfc7231#section-7.1.3>.
                          // tcort/link-check implemented a retry system to mainly enable Github links to be tested.
                          // Hopefully Github fixed this non standard behaviour on their side.
                          // tcort/link-check will then stop the support of non standard 'retry-after' header for releases greater or equal to 4.7.0.
                          // all this 'isNaN' part and the additionalMessage will then be removed from the code.
                          additionalMessage =
                            "Server returned a non standard \'retry-after\' header. " +
                            "Non standard \'retry-after\' header will not work after link-check 4.7.0 release. " +
                            "See https://github.com/tcort/link-check/releases/tag/v4.5.2 release note for details.";

                          let buf = '';
                          let letter = false;
                          for (let i = 0; i < retryStr.length; i++) {
                              let c = retryStr[i];
                              if (isNaN(c)) {
                                  letter = true;
                                  buf += c;
                              } else {
                                  if (letter) {
                                      retryInMs += ms(buf.trim());
                                      buf = '';
                                  }
                                  letter = false;
                                  buf += c;
                              }
                          }
                          retryInMs = ms(buf.trim());
                        }else{
                          // standard compliant header value conversion to milliseconds
                          const secondsToMilisecondsMultiplier = 1000;
                          retryInMs = parseFloat(retryStr) * secondsToMilisecondsMultiplier;
                        }
                    }
                    // Recurse back after the retry timeout has elapsed (incrementing our attempts to avoid an infinite loop)
                    setTimeout(check, retryInMs, link, opts, callback, attempts + 1, additionalMessage);
                } else {
                    if (additionalMessage){
                      err = !err ? additionalMessage : `${err} ${additionalMessage}`;
                    }
                    callback(null, new LinkCheckResult(opts, link, res ? res.statusCode : 0, err));
                }
            }).pipe(new BlackHole());
        });
    },
};
