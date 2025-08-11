# URL
A Javascript implementation of the [URL Living Standard](https://url.spec.whatwg.org/).

[![License](http://img.shields.io/npm/l/@oozcitak/url.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![NPM Version](http://img.shields.io/npm/v/@oozcitak/url.svg?style=flat-square)](https://www.npmjs.com/package/@oozcitak/url)

[![Travis Build Status](http://img.shields.io/travis/oozcitak/url.svg?style=flat-square)](http://travis-ci.org/oozcitak/url)
[![AppVeyor Build status](https://ci.appveyor.com/api/projects/status/vmmfuvai1o3yips8?svg=true)](https://ci.appveyor.com/project/oozcitak/url)
[![Dev Dependency Status](http://img.shields.io/david/dev/oozcitak/url.svg?style=flat-square)](https://david-dm.org/oozcitak/url)
[![Code Coverage](https://img.shields.io/codecov/c/github/oozcitak/url?style=flat-square)](https://codecov.io/gh/oozcitak/url)

# Version
Current version implements the standard as of commit [7ae1c69](https://url.spec.whatwg.org/commit-snapshots/7ae1c691c96f0d82fafa24c33aa1e8df9ffbf2bc/).

# Installation
```
npm install @oozcitak/url
```

# Usage
Create an instance of the `URL` or `URLSearchParams` classes.

```js
const { URL } = require("@oozcitak/url");

const url = new URL("https://example.org/file.aspx")
```
