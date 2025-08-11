# markdownlint-cli

[![GitHub Actions Build Status][actions-badge]][actions-url]

> Command Line Interface for [MarkdownLint][markdownlint]

## Installation

```bash
npm install -g markdownlint-cli
```

On macOS you can install via [Homebrew](https://brew.sh/):

```bash
brew install markdownlint-cli
```

## Usage

```bash
markdownlint --help

Usage: markdownlint [options] [files|directories|globs...]

MarkdownLint Command Line Interface

Arguments:
  files|directories|globs                    files, directories, and/or globs to lint

Options:
  -V, --version                              output the version number
  -c, --config <configFile>                  configuration file (JSON, JSONC, JS, YAML, or TOML)
  --configPointer <pointer>                  JSON Pointer to object within configuration file (default: "")
  -d, --dot                                  include files/folders with a dot (for example `.github`)
  -f, --fix                                  fix basic errors (does not work with STDIN)
  -i, --ignore <file|directory|glob>         file(s) to ignore/exclude (default: [])
  -j, --json                                 write issues in json format
  -o, --output <outputFile>                  write issues to file (no console)
  -p, --ignore-path <file>                   path to file with ignore pattern(s)
  -q, --quiet                                do not write issues to STDOUT
  -r, --rules <file|directory|glob|package>  include custom rule files (default: [])
  -s, --stdin                                read from STDIN (does not work with files)
  --enable <rules...>                        Enable certain rules, e.g. --enable MD013 MD041 --
  --disable <rules...>                       Disable certain rules, e.g. --disable MD013 MD041 --
  -h, --help                                 display help for command
```

Or run using [Docker](https://www.docker.com) and [GitHub Packages](https://github.com/features/packages):

```bash
docker run -v $PWD:/workdir ghcr.io/igorshubovych/markdownlint-cli:latest "*.md"
```

> **Note**
> Because `--enable` and `--disable` are [variadic arguments that accept multiple values][commander-variadic], it is necessary to end the list by passing `--` before the `<files|directories|globs>` argument like so: `markdownlint --disable MD013 -- README.md`.

### Globbing

`markdownlint-cli` supports advanced globbing patterns like `**/*.md` ([more information][globprimer]).
With shells like Bash, it may be necessary to quote globs so they are not interpreted by the shell.
For example, `--ignore *.md` would be expanded by Bash to `--ignore a.md b.md ...` before invoking `markdownlint-cli`, causing it to ignore only the first file because `--ignore` takes a single parameter (though it can be used multiple times).
Quoting the glob like `--ignore '*.md'` passes it through unexpanded and ignores the set of files.

#### Globbing examples

To lint all Markdown files in a Node.js project (excluding dependencies), the following commands might be used:

Windows CMD: `markdownlint **/*.md --ignore node_modules`

Linux Bash: `markdownlint '**/*.md' --ignore node_modules`

### Ignoring files

If present in the current folder, a `.markdownlintignore` file will be used to ignore files and/or directories according to the rules for [gitignore][gitignore].
If the `-p`/`--ignore-path` option is present, the specified file will be used instead of `.markdownlintignore`.

The order of operations is:

- Enumerate files/directories/globs passed on the command line
- Apply exclusions from `-p`/`--ignore-path` (if specified) or `.markdownlintignore` (if present)
- Apply exclusions from any `-i`/`--ignore` option(s) that are specified

### Fixing errors

When the `--fix` option is specified, `markdownlint-cli` tries to apply all fixes reported by the active rules and reports any errors that remain.
Because this option makes changes to the input files, it is good to make a backup first or work with files under source control so any unwanted changes can be undone.

> Because not all rules include fix information when reporting errors, fixes may overlap, and not all errors are fixable, `--fix` will not usually address all errors.

## Configuration

`markdownlint-cli` reuses [the rules][rules] from `markdownlint` package.

Configuration is stored in JSON, JSONC, YAML, INI, or TOML files in the same [config format][config].

A sample configuration file:

```json
{
  "default": true,
  "MD003": { "style": "atx_closed" },
  "MD007": { "indent": 4 },
  "no-hard-tabs": false,
  "whitespace": false
}
```

For more examples, see [.markdownlint.jsonc][markdownlint-jsonc], [.markdownlint.yaml][markdownlint-yaml], [test-config.toml](test/test-config.toml) or the [style folder][style-folder].

The CLI argument `--config` is not required.
If it is not provided, `markdownlint-cli` looks for the file `.markdownlint.jsonc`/`.markdownlint.json`/`.markdownlint.yaml`/`.markdownlint.yml` in current folder, or for the file `.markdownlintrc` in the current or all parent folders.
The algorithm is described in detail on the [`rc` package page][rc-standards].
Note that when relying on the lookup of a file named `.markdownlintrc` in the current or parent folders, the only syntaxes accepted are INI and JSON, and the file cannot have an extension.
If the `--config` argument is provided, the file must be valid JSON, JSONC, JS, or YAML.
JS configuration files contain JavaScript code, must have the `.js` or `.cjs` file extension, and must export (via `module.exports = ...`) a configuration object of the form shown above.
If your workspace _(project)_ is [ESM-only] _(`"type": "module"` set in the root `package.json` file)_, then the configuration file **should end with `.cjs` file extension**.
A JS configuration file may internally `require` one or more npm packages as a way of reusing configuration across projects.

The `--configPointer` argument allows the use of [JSON Pointer][json-pointer] syntax to identify a sub-object within the configuration object (per above).
This argument can be used with any configuration file type and makes it possible to nest a configuration object within another file like `package.json` or `pyproject.toml` (e.g., via `/key` or `/key/subkey`).

`--enable` and `--disable` override configuration files; if a configuration file disables `MD123` and you pass `--enable MD123`, it will be enabled.
If a rule is passed to both `--enable` and `--disable`, it will be disabled.

> - JS configuration files must be provided via the `--config` argument; they are not automatically loaded because running untrusted code is a security concern.
> - TOML configuration files must be provided via the `--config` argument; they are not automatically loaded.

## Exit codes

`markdownlint-cli` returns one of the following exit codes:

- `0`: Program ran successfully
- `1`: Linting errors
- `2`: Unable to write `-o`/`--output` output file
- `3`: Unable to load `-r`/`--rules` custom rule
- `4`: Unexpected error (e.g. malformed config)

## Use with pre-commit

To run `markdownlint-cli` as part of a [pre-commit][pre-commit] workflow, add something like the below to the `repos` list in the project's `.pre-commit-config.yaml`:

```yaml
- repo: https://github.com/igorshubovych/markdownlint-cli
  rev: v0.45.0
  hooks:
  - id: markdownlint
```

> Depending on the environment this workflow runs in, it may be necessary to [override the language version of Node.js used by pre-commit][pre-commit-version].

## Related

- [markdownlint][markdownlint] - API for this module
- [markdownlint-cli2][markdownlint-cli2] - Alternate CLI implementation
- [glob][glob] - Pattern matching implementation
- [ignore][ignore] - `.markdownlintignore` implementation

## License

MIT © Igor Shubovych

[actions-badge]: https://github.com/igorshubovych/markdownlint-cli/workflows/CI/badge.svg?branch=master
[actions-url]: https://github.com/igorshubovych/markdownlint-cli/actions?query=workflow%3ACI
[commander-variadic]: https://github.com/tj/commander.js#variadic-option
[json-pointer]: https://datatracker.ietf.org/doc/html/rfc6901
[markdownlint]: https://github.com/DavidAnson/markdownlint
[markdownlint-cli2]: https://github.com/DavidAnson/markdownlint-cli2
[markdownlint-jsonc]: https://github.com/DavidAnson/markdownlint/blob/main/schema/.markdownlint.jsonc
[markdownlint-yaml]: https://github.com/DavidAnson/markdownlint/blob/main/schema/.markdownlint.yaml
[rules]: https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md
[config]: https://github.com/DavidAnson/markdownlint#optionsconfig
[style-folder]: https://github.com/DavidAnson/markdownlint/tree/main/style
[rc-standards]: https://www.npmjs.com/package/rc#standards
[glob]: https://github.com/isaacs/node-glob
[globprimer]: https://github.com/isaacs/node-glob/blob/master/README.md#glob-primer
[ignore]: https://github.com/kaelzhang/node-ignore
[gitignore]: https://git-scm.com/docs/gitignore
[pre-commit]: https://pre-commit.com/
[pre-commit-version]: https://pre-commit.com/#overriding-language-version
[ESM-only]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
