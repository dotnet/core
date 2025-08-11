# Changes

## Version 4.0.2

* update dependencies

## Version 4.0.1

* update dependencies

## Version 4.0.0

* remove anchor extraction

## Version 3.0.0

* add support for extracting links from inline HTML #7
* fix issue parsing links with emoji #19
* remove extended mode
* remove support for embedded image size parameters due to performance issues. Reported by Shachar Menashe.
* upgrade dependencies

## Version 2.0.1

* upgrade dependencies

## Version 2.0.0

* returns an object with links and anchors.

Code that looked like this:

```
const links = markdownLinkExtractor(str);
```

Should change to this:

```
const { links } = markdownLinkExtractor(str);
```

## Version 1.3.1

* update dependencies

## Version 1.3.0

* extended output mode
* update dependencies

## Version 1.2.7

* update dependencies.

## Version 1.2.6

* Don't mangle email addresses. Fixes tcort/markdown-link-check#86

## Version 1.2.5

* fix missing `$` at end of regex which lead to some links not being extracted.

## Version 1.2.4

* update dependencies and adapt code for new major version of `markd`.

## Version 1.2.3

* update dependencies.

## Version 1.2.2

* update dependencies.
* add CHANGELOG.md

