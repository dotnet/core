# is-relative-url

> Check if a URL is relative

## Install

```sh
npm install is-relative-url
```

## Usage

```js
import isRelativeUrl from 'is-relative-url';

isRelativeUrl('foo/bar');
//=> true

isRelativeUrl('https://sindresorhus.com/foo/bar');
//=> false

isRelativeUrl('//sindresorhus.com');
//=> true
```

## Related

See [is-absolute-url](https://github.com/sindresorhus/is-absolute-url) for the inverse.
