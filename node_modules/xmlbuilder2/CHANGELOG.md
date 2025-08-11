# Change Log

All notable changes to this project are documented in this file. This project adheres to [Semantic Versioning](http://semver.org/#semantic-versioning-200).

## [3.1.1] - 2023-05-08

### Bug Fixes

- Moved `@types/node` to a dev dependency (see [#165](https://github.com/oozcitak/xmlbuilder2/issues/165)).
- Bumped `js-yaml` up from a version with a known vulnerability (see [#141](https://github.com/oozcitak/xmlbuilder2/pull/141) and [#167](https://github.com/oozcitak/xmlbuilder2/pull/167)).

## [3.1.0] - 2023-04-24

### Features

- Allowed preserving blankspace text nodes when parsing an XML string (see [#101](https://github.com/oozcitak/xmlbuilder2/pull/101)).

### Bug Fixes

- Fixed various ampersand encoding issues (see [#105](https://github.com/oozcitak/xmlbuilder2/issues/105), [#109](https://github.com/oozcitak/xmlbuilder2/issues/109), [#110](https://github.com/oozcitak/xmlbuilder2/issues/110))

## [3.0.2] - 2021-08-10

### Bug Fixes

- Fixed a bug where some predefined entities where not being decoded when parsed (see [#99](https://github.com/oozcitak/xmlbuilder2/issues/99)).

## [3.0.1] - 2021-07-29

### Bug Fixes

- Fixed a bug which prevented web workers from consuming the webpack bundle (see [#77](https://github.com/oozcitak/xmlbuilder2/issues/77)).

## [3.0.0] - 2021-07-29

### Bug Fixes

- Fixed a bug where parsers did not decode predefined entities (see [#82](https://github.com/oozcitak/xmlbuilder2/issues/82), [#88](https://github.com/oozcitak/xmlbuilder2/issues/88) and [#98](https://github.com/oozcitak/xmlbuilder2/issues/98)).
- Fixed a bug where XML parser would not always return the last top level element node created (see [#81](https://github.com/oozcitak/xmlbuilder2/issues/81)).
- Fixed a bug where JS object parser would fail to parse mixed content (see [#90](https://github.com/oozcitak/xmlbuilder2/issues/90)).

### Features

- Added the `import` function to callback API (see [#2](https://github.com/oozcitak/xmlbuilder2/issues/2)).

### BREAKING CHANGES

- Removed support for node.js 10.
- Removed the `noDoubleEncoding` flag from serializers. Parsers now decode predefined entities (see [#82](https://github.com/oozcitak/xmlbuilder2/issues/82), [#88](https://github.com/oozcitak/xmlbuilder2/issues/88) and [#98](https://github.com/oozcitak/xmlbuilder2/issues/98)).

## [2.4.1] - 2021-04-08

### Bug Fixes

- Fixed node type dependency to `*` (see [#69](https://github.com/oozcitak/xmlbuilder2/issues/69) and [#84](https://github.com/oozcitak/xmlbuilder2/issues/84)).
- Added documentation link to `next` function (see [#61](https://github.com/oozcitak/xmlbuilder2/issues/61)).
- Applied `keepNullNodes` option to all types of text nodes (see [#56](https://github.com/oozcitak/xmlbuilder2/issues/56)).
- Fixed a typo in `CHANGELOG` (see [#54](https://github.com/oozcitak/xmlbuilder2/issues/54)).

### Features

- Added `sanitize` function to parsers (see [#65](https://github.com/oozcitak/xmlbuilder2/issues/65)).

## [2.4.0] - 2020-09-14

### Bug Fixes

- Fixed a bug where the input of custom parsers were not sanitized.
- Fixed a bug where attributes would not lookup their namespaces from their parent elements (see [#51](https://github.com/oozcitak/xmlbuilder2/issues/51) and [#53](https://github.com/oozcitak/xmlbuilder2/issues/53)).
- Fixed a bug where typings were not included in the package (see [#52](https://github.com/oozcitak/xmlbuilder2/issues/52)).

### Features

- Added `declaration` function to serializers.
- Add YAML parser to callback builder.

## [2.3.1] - 2020-08-05

### Bug Fixes

- Fixed a bug where YAML serializer would not escape special characters.
- Fixed a bug where the `element` function of a custom parser would throw an error if it changed the node name (see [#46](https://github.com/oozcitak/xmlbuilder2/issues/46)).
- Fixed a bug where XML parser would ignore `encoding` and `standalone` in XML declaration.
- Fixed a bug where the `ele` function would throw an error if it failed to create any child nodes.

## [2.3.0] - 2020-08-04

### Bug Fixes

- Fixed a bug where JSON serializer would not escape special characters (see [#44](https://github.com/oozcitak/xmlbuilder2/issues/44)).

### Features

- Added custom parsers (see [#25](https://github.com/oozcitak/xmlbuilder2/issues/25)).
- Added YAML parser and serializer.

## [2.2.0] - 2020-07-14

### Bug Fixes

- Fixed a bug where `each` would stop traversing the document tree if the current node was removed inside the callback.

### Features

- Added the `verbose` option to object serializer to create consistent yet verbose output (see [#30](https://github.com/oozcitak/xmlbuilder2/issues/30)).

## [2.1.7] - 2020-07-09

### Bug Fixes

- Prevented object converter from grouping attributes into element content (see [#29](https://github.com/oozcitak/xmlbuilder2/issues/29)).

## [2.1.6] - 2020-07-02

### Bug Fixes

- Added minified browser bundle from transpiled ES5 code so that the library can be used on old browsers (see [#28](https://github.com/oozcitak/xmlbuilder2/issues/28)). Note that `Proxy` and `Reflect` polyfills are required to use the library on IE 11.

## [2.1.5] - 2020-06-18

### Bug Fixes

- Fixed a bug where carriage return characters (`'\r'`) were escaped in text and attribute contents (see [#24](https://github.com/oozcitak/xmlbuilder2/issues/24)).

## [2.1.4] - 2020-06-16

### Bug Fixes

- Fixed a bug where mixin classes overwrote DOM class constructors (see [#23](https://github.com/oozcitak/xmlbuilder2/issues/23)).

## [2.1.3] - 2020-06-11

### Bug Fixes

- Fixed a bug where child nodes did not inherit the parent namespace (see [#18](https://github.com/oozcitak/xmlbuilder2/issues/18)).
- Fixed a bug where falsy values passed as node contents caused missing nodes (see [#21](https://github.com/oozcitak/xmlbuilder2/issues/21)).

## [2.1.2] - 2020-04-09

### Bug Fixes

- Fixed a bug where the `noDoubleEncoding` flag kept named entities other than [those specified in the spec](https://www.w3.org/TR/xml/#sec-predefined-ent) (see [#16](https://github.com/oozcitak/xmlbuilder2/issues/16)).

## [2.1.1] - 2020-04-01

### Bug Fixes

- Fixed a bug where calling `end` on a document fragment node would serialize the fragment's owner document not the fragment itself.

## [2.1.0] - 2020-03-31

### Features

- Added the `noDoubleEncoding` option to prevent html entities from being re-encoded when serialized (see [#15](https://github.com/oozcitak/xmlbuilder2/issues/15)).

## [2.0.0] - 2020-03-30

### Bug Fixes

- Fixed namespace inheritance logic, so that a preferred prefix is not retrieved from a parent element if the element has no prefix and its namespace matches the default namespace declaration (see: https://github.com/web-platform-tests/wpt/pull/16703).
- Namespace declaration attributes from JS objects are now applied correctly to their parent elements (see [#13](https://github.com/oozcitak/xmlbuilder2/issues/13)).

### Features

- Narrowed return value types of functions for better intellisense support with TypeScript (see [#14](https://github.com/oozcitak/xmlbuilder2/issues/14)).
- Added `invalidCharReplacement` option to sanitize input strings by replacing invalid characters (see [#12](https://github.com/oozcitak/xmlbuilder2/issues/12)). The option has no defaults and must be configured by the user.

### BREAKING CHANGES

- Removed `inheritNS` options (see [#1](https://github.com/oozcitak/xmlbuilder2/issues/1), [#6](https://github.com/oozcitak/xmlbuilder2/issues/6) and [#13](https://github.com/oozcitak/xmlbuilder2/issues/13)). Element nodes now inherit namespaces from their parent element nodes by default. To reset the default namespace declaration create an `"xmlns"` attribute with an empty value (`""`) as in the DOM.

## [1.8.1] - 2020-03-27

### Bug Fixes

- Fixed where JS object, map and JSON serializers' `group` setting defaulted to `true`.

## [1.8.0] - 2020-03-25

### Features

- Added `EventEmitter` interface to callback builder object.

## [1.7.0] - 2020-03-19

### Features

- Added JSON output format to callback API.

## [1.6.0] - 2020-03-17

### Features

- Added converter options to callback API similar to regular API.

## [1.5.0] - 2020-03-17

### Bug Fixes

- Fixed collection functions to return child node indices not descendant node indices.

### Features

- Added JS object and XML string parser to callback API functions.
- Added tree depth to collection function callbacks.

## [1.4.3] - 2020-03-03

### Bug Fixes

- `keepNullNodes` and `keepNullAttributes` flags now properly keep `null` **and** `undefined` values (see [#5](https://github.com/oozcitak/xmlbuilder2/issues/5)). Without these flags, `null` **and** `undefined` will be silently skipped.

## [1.4.2] - 2020-03-02

### Bug Fixes

- Added `types` to `package.json` to help IDEs infer types (see [#4](https://github.com/oozcitak/xmlbuilder2/issues/4)).

## [1.4.1] - 2020-02-28

### Bug Fixes

- Renamed callback API functions.

## [1.4.0] - 2020-02-28

### Features

- Added callback API (see [#2](https://github.com/oozcitak/xmlbuilder2/issues/2)).

## [1.3.0] - 2020-02-18

### Features

- Added namespace aliases.

## [1.2.1] - 2020-02-18

### Bug Fixes

- Prevented null namespaces from being converted to the string `"null"`.

### Features

- Removed namespace aliases.

## [1.2.0] - 2020-02-17

### Features

- Added namespace aliases.

## [1.1.2] - 2020-02-17

### Bug Fixes

- Prevented child element namespaces to be inherited from their parent elements (see [#1](https://github.com/oozcitak/xmlbuilder2/issues/1)).
- Fixed JS object parser to allow namespaces for both element nodes and attributes with the `{ "prefix:name@ns": {} }` notation.

## [1.1.1] - 2020-02-13

### Bug Fixes

- Fixed `width` option to work in pretty-printing mode to wrap attributes.

## [1.1.0] - 2020-02-12

### Bug Fixes

- A CDATA node will not be indented in pretty-printing mode if it is the single child of its parent element.

## 1.0.0 - 2020-02-12

- Initial release

[1.1.0]: https://github.com/oozcitak/xmlbuilder2/compare/v1.0.0...v1.1.0
[1.1.1]: https://github.com/oozcitak/xmlbuilder2/compare/v1.1.0...v1.1.1
[1.1.2]: https://github.com/oozcitak/xmlbuilder2/compare/v1.1.1...v1.1.2
[1.2.0]: https://github.com/oozcitak/xmlbuilder2/compare/v1.1.2...v1.2.0
[1.2.1]: https://github.com/oozcitak/xmlbuilder2/compare/v1.2.0...v1.2.1
[1.3.0]: https://github.com/oozcitak/xmlbuilder2/compare/v1.2.1...v1.3.0
[1.4.0]: https://github.com/oozcitak/xmlbuilder2/compare/v1.3.0...v1.4.0
[1.4.1]: https://github.com/oozcitak/xmlbuilder2/compare/v1.4.0...v1.4.1
[1.4.2]: https://github.com/oozcitak/xmlbuilder2/compare/v1.4.1...v1.4.2
[1.4.3]: https://github.com/oozcitak/xmlbuilder2/compare/v1.4.2...v1.4.3
[1.5.0]: https://github.com/oozcitak/xmlbuilder2/compare/v1.4.3...v1.5.0
[1.6.0]: https://github.com/oozcitak/xmlbuilder2/compare/v1.5.0...v1.6.0
[1.7.0]: https://github.com/oozcitak/xmlbuilder2/compare/v1.6.0...v1.7.0
[1.8.0]: https://github.com/oozcitak/xmlbuilder2/compare/v1.7.0...v1.8.0
[1.8.1]: https://github.com/oozcitak/xmlbuilder2/compare/v1.8.0...v1.8.1
[2.0.0]: https://github.com/oozcitak/xmlbuilder2/compare/v1.8.1...v2.0.0
[2.1.0]: https://github.com/oozcitak/xmlbuilder2/compare/v2.0.0...v2.1.0
[2.1.1]: https://github.com/oozcitak/xmlbuilder2/compare/v2.1.0...v2.1.1
[2.1.2]: https://github.com/oozcitak/xmlbuilder2/compare/v2.1.1...v2.1.2
[2.1.3]: https://github.com/oozcitak/xmlbuilder2/compare/v2.1.2...v2.1.3
[2.1.4]: https://github.com/oozcitak/xmlbuilder2/compare/v2.1.3...v2.1.4
[2.1.5]: https://github.com/oozcitak/xmlbuilder2/compare/v2.1.4...v2.1.5
[2.1.6]: https://github.com/oozcitak/xmlbuilder2/compare/v2.1.5...v2.1.6
[2.1.7]: https://github.com/oozcitak/xmlbuilder2/compare/v2.1.6...v2.1.7
[2.2.0]: https://github.com/oozcitak/xmlbuilder2/compare/v2.1.7...v2.2.0
[2.3.0]: https://github.com/oozcitak/xmlbuilder2/compare/v2.2.0...v2.3.0
[2.3.1]: https://github.com/oozcitak/xmlbuilder2/compare/v2.3.0...v2.3.1
[2.4.0]: https://github.com/oozcitak/xmlbuilder2/compare/v2.3.1...v2.4.0
[2.4.1]: https://github.com/oozcitak/xmlbuilder2/compare/v2.4.0...v2.4.1
[3.0.0]: https://github.com/oozcitak/xmlbuilder2/compare/v2.4.1...v3.0.0
[3.0.1]: https://github.com/oozcitak/xmlbuilder2/compare/v3.0.0...v3.0.1
[3.0.2]: https://github.com/oozcitak/xmlbuilder2/compare/v3.0.1...v3.0.2
[3.1.0]: https://github.com/oozcitak/xmlbuilder2/compare/v3.0.2...v3.1.0
[3.1.1]: https://github.com/oozcitak/xmlbuilder2/compare/v3.1.0...v3.1.1
