# html-link-extractor

Extracts links from html texts.

## Installation
```bash
$ npm install --save html-link-extractor
```
## API

### htmlLinkExtractor(html)

Parameters:

* `html` text in html format.

Returns:

* an array of URLs
## Examples

```js
const { readFileSync } = require('fs');
const htmlLinkExtractor = require('html-link-extractor');

const html = readFileSync('index.html', {encoding: 'utf8'});

const links = htmlLinkExtractor(html);
links.forEach(link => console.log(link));
```

## Testing

    npm test

## License

See [LICENSE.md](https://github.com/tcort/html-link-extractor/blob/master/LICENSE.md)
