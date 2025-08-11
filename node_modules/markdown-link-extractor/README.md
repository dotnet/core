# markdown-link-extractor

Extracts links from markdown texts.

## Installation
```bash
$ npm install --save markdown-link-extractor
```
## API

### markdownLinkExtractor(markdown)

Parameters:

* `markdown` text in markdown format.

Returns:

* an array containing the URLs from the links found.

## Examples

```js
const { readFileSync } = require('fs');
const markdownLinkExtractor = require('markdown-link-extractor');

const markdown = readFileSync('README.md', {encoding: 'utf8'});

const links = markdownLinkExtractor(markdown);
links.forEach(link => console.log(link));
```

## Upgrading to v4.0.0

- anchor link extraction no longer supported

Code that looked like this:

```
const { links } = markdownLinkExtractor(str);
```

Should change to this:

```
const links = markdownLinkExtractor(str);
```

## Upgrading to v3.0.0

- extended mode no longer supported
- embedded image size parameters in `![]()` no longer supported

## Testing

    npm test

## License

See [LICENSE.md](https://github.com/tcort/markdown-link-extractor/blob/master/LICENSE.md)
