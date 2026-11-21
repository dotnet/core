# Licensed to the .NET Foundation under one or more agreements.
# The .NET Foundation licenses this file to you under the MIT license.

"""Check committed text for UTF-8 without a BOM and LF line endings."""

import argparse
import subprocess
import sys
from pathlib import PurePosixPath

# Git treats UTF-16 as binary. Still validate recognized text formats so an
# accidental UTF-16 release note cannot bypass the binary-file exemption.
TEXT_SUFFIXES = {
    ".cs",
    ".csv",
    ".html",
    ".ini",
    ".js",
    ".json",
    ".md",
    ".ps1",
    ".py",
    ".sh",
    ".toml",
    ".ts",
    ".txt",
    ".xml",
    ".yaml",
    ".yml",
}


def encoding_errors(data):
    """Return the policy violations in one text blob."""
    errors = []
    if data.startswith(b"\xef\xbb\xbf"):
        errors.append("UTF-8 BOM")
    try:
        data.decode("utf-8")
    except UnicodeDecodeError:
        errors.append("invalid UTF-8")
    if b"\0" in data:
        errors.append("NUL bytes in text")
    if b"\r" in data:
        errors.append("CR line endings")
    return errors


def git(*args):
    """Run Git without interpreting arguments through a shell."""
    return subprocess.check_output(["git", *args])


def main(argv=None):
    """Check all tracked text blobs, or only changes since a base commit."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-ref", help="check changes since this commit")
    args = parser.parse_args(argv)
    changed = None
    if args.base_ref:
        base = (
            git(
                "rev-parse", "--verify", "--end-of-options", args.base_ref + "^{commit}"
            )
            .decode()
            .strip()
        )
        changed = set(
            git(
                "diff",
                "--name-only",
                "--diff-filter=ACMR",
                "-z",
                base + "...HEAD",
                "--",
            ).split(b"\0")
        )

    failed = False
    checked = 0
    # Validate committed blobs, not checkout bytes: Windows checkout settings
    # must not make the same commit pass on one machine and fail on another.
    for entry in git("ls-files", "--eol", "-z").split(b"\0"):
        if not entry:
            continue
        info, path = entry.split(b"\t", 1)
        if changed is not None and path not in changed:
            continue
        name = path.decode("utf-8")
        if (
            info.startswith(b"i/-text")
            and PurePosixPath(name).suffix.lower() not in TEXT_SUFFIXES
        ):
            continue
        data = git("show", "HEAD:" + name)
        errors = encoding_errors(data)
        checked += 1
        if errors:
            print(f"{name}: {', '.join(errors)}", file=sys.stderr)
            failed = True
    print(f"Checked {checked} committed text files.")
    return int(failed)


if __name__ == "__main__":
    sys.exit(main())
