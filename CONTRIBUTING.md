# Contributing

See [Contributing](https://github.com/dotnet/runtime/blob/main/CONTRIBUTING.md) for information about coding styles, source structure, making pull requests, and more.

## Repositories

See the [.NET Repos](Documentation/core-repos.md) to find a repo to contribute to.

## Text encoding

Use UTF-8 without a byte order mark (BOM) and LF line endings for text files.
The editor and Git defaults enforce the line-ending convention. CI validates
committed text changed by a pull request or push, without requiring unrelated
historical files to be rewritten.

To run the same check locally after committing, use
`python3 eng/validate_text_encoding.py --base-ref origin/main`. Run its regression
tests with `python3 -m unittest discover -s eng -p 'test_validate_text_encoding.py'`.
