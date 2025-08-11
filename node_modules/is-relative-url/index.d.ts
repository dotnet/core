/**
Check if a URL is relative.

@param url - The URL to check.

@example
```
import isRelativeUrl from 'is-relative-url';

isRelativeUrl('foo/bar');
//=> true

isRelativeUrl('https://sindresorhus.com/foo/bar');
//=> false

isRelativeUrl('//sindresorhus.com');
//=> true
```
*/
export default function isRelativeUrl(url: string): boolean;
