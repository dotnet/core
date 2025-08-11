# DOM
A Javascript implementation of the [DOM Living Standard](https://dom.spec.whatwg.org/).

[![License](http://img.shields.io/npm/l/@oozcitak/dom.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![NPM Version](https://img.shields.io/npm/v/@oozcitak/dom?logo=npm&style=flat-square)](https://www.npmjs.com/package/@oozcitak/dom)

[![Travis Build Status](https://img.shields.io/travis/oozcitak/dom?logo=travis&style=flat-square)](http://travis-ci.org/oozcitak/dom)
[![AppVeyor Build status](https://img.shields.io/appveyor/ci/oozcitak/dom?logo=appveyor&style=flat-square)](https://ci.appveyor.com/project/oozcitak/dom)
[![Dev Dependency Status](http://img.shields.io/david/dev/oozcitak/dom.svg?style=flat-square)](https://david-dm.org/oozcitak/dom)
[![Code Coverage](https://img.shields.io/codecov/c/github/oozcitak/dom?logo=codecov&style=flat-square)](https://codecov.io/gh/oozcitak/dom)

# Version
Current version implements the standard as of commit [57512fa](https://dom.spec.whatwg.org/commit-snapshots/57512fac17cf2f1c4c85be4aec178c8086ee5ee4/) (Last Updated 24 September 2019).

This DOM implementation is for _XML documents only_.

# Installation
```
npm install @oozcitak/dom
```

# Usage
Create an instance of the [`DOMImplementation`](https://dom.spec.whatwg.org/#interface-domimplementation) class to construct the DOM tree.

```js
const { DOMImplementation } = require("@oozcitak/dom");

const dom = new DOMImplementation();
const doc = dom.createDocument('ns', 'root');
```

The module also exports [`DOMParser`](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#domparser) and [`XMLSerializer`](https://w3c.github.io/DOM-Parsing/#the-xmlserializer-interface) classes as in the browser.
