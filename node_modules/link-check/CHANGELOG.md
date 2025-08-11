# Changes

## Version 5.4.0

* Defer protocol imports #89 @mondeja
* Decrease package size #90 @mondeja
* ci: use current node.js versions in matrix build #93 @MikeMcC399
* Replace isemail to fix deprecation warning #94 @rkitover
* Fix #79, keep HTTP method when following #80 @MrThanlon
* fix test badge on README #74 @dklimpel
* upgrade dependencies

## Version 5.3.0

* fix failing github action with IPv6 @dklimpel
* Add http proxy support @dklimpel
* docs: Format with Markdownlint @nschonni
* upgrade dependencies

## Version 5.2.0

Changes:

* add `open_timeout` option @Colin-Whelan #51
* don't parse HTTP response @sadra-barikbin #57
* upgrade dependencies

## Version 5.1.0

Changes:

* support for hash links

## Version 5.0.3

Changes:

* upgrade dependencies

## Version 5.0.2

Changes:

* upgrade dependencies

## Version 5.0.1

Changes:

* #49 upgrade dependencies

## Version 5.0.0

This release contains the following potentially breaking changes:

* bad/expired/unauthorized HTTPS certificate errors are no longer ignored.
  * sites with bad certs are no longer considered `alive`
* `User-Agent` header no longer impersonates Firefox.
  * defaults to `link-check/5.0.0` (override via `opts.user_agent`).

Changes:

* #46 provide accurate user-agent string
* #44 update to use WHATWG URL API
* #40 use a broader URL encoding function
* #30 reject unauthorized TLS connections (i.e. don't allow bad certs)
* #29 replace Request deprecated dependency by Needle

## Version 4.5.4

* #35 fix encode by adding decode first

## Version 4.5.3

* #76 encode urls to prevent unicode chars to fail

## Version 4.5.2

* #25 fixes 429 "Too Many Requests" retries that don't follow standard (@NicolasMassart)
* #22 Add support for retry count on 429 response codes (@andreizet)

## Version 4.5.1

* update dependencies

## Version 4.5.0

* update dependencies
* add an option to automatically retry on a 429 response (PR #19)

## Version 4.4.7

* update dependencies.
* fix markdown formatting in `README.md` (PR #18)

## Version 4.4.6

* update dependencies.

## Version 4.4.5

* update dependencies.
* add CHANGELOG.md (Issue #17)
