# Licensed to the .NET Foundation under one or more agreements.
# The .NET Foundation licenses this file to you under the MIT license.

"""Regression coverage for committed text encoding validation."""

import contextlib
import io
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import validate_text_encoding


class TextEncodingTests(unittest.TestCase):
    """Exercise byte encodings and changed-file Git selection."""

    def test_encodings(self):
        """Recognize valid Unicode and reject common incorrect encodings."""
        cases = [
            (b"", []),
            ("Release notes: café\n".encode(), []),
            (b"\xef\xbb\xbfnotes\n", ["UTF-8 BOM"]),
            (b"notes\r\n", ["CR line endings"]),
            (b"notes\r", ["CR line endings"]),
            (b"caf\xe9\n", ["invalid UTF-8"]),
            ("notes\n".encode("utf-16"), ["invalid UTF-8", "NUL bytes in text"]),
            ("notes\n".encode("utf-16-le"), ["NUL bytes in text"]),
        ]
        for data, expected in cases:
            with self.subTest(data=data):
                self.assertEqual(validate_text_encoding.encoding_errors(data), expected)

    def test_changed_committed_files(self):
        """Ignore historical violations, binary files, and checkout-only edits."""
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)

            def git(*args):
                return subprocess.check_output(["git", "-C", directory, *args])

            git("init", "-q")
            git("config", "user.name", "Test")
            git("config", "user.email", "test@example.com")
            git("config", "core.autocrlf", "false")
            (root / "old.md").write_bytes(b"\xef\xbb\xbfexisting\n")
            git("add", ".")
            git("commit", "-qm", "baseline")
            base = git("rev-parse", "HEAD").decode().strip()
            (root / "release notes.md").write_bytes(b"\xef\xbb\xbfnew\r\n")
            (root / "utf16.md").write_bytes("notes\n".encode("utf-16-le"))
            (root / "image.bin").write_bytes(b"\x00\xff\r\n")
            git("add", ".")
            git("commit", "-qm", "changes")

            with patch.object(validate_text_encoding, "git", git):
                errors = io.StringIO()
                with contextlib.redirect_stderr(errors), contextlib.redirect_stdout(
                    io.StringIO()
                ):
                    self.assertEqual(
                        validate_text_encoding.main(["--base-ref", base]), 1
                    )
                self.assertEqual(
                    errors.getvalue(),
                    "release notes.md: UTF-8 BOM, CR line endings\n"
                    "utf16.md: NUL bytes in text\n",
                )

                (root / "release notes.md").write_bytes("café\n".encode())
                (root / "utf16.md").write_bytes(b"notes\n")
                git("add", ".")
                git("commit", "-qm", "fix encoding")
                # Uncommitted checkout damage must not alter validation of HEAD.
                (root / "release notes.md").write_bytes(b"\xff\r\n")
                with contextlib.redirect_stdout(io.StringIO()):
                    self.assertEqual(
                        validate_text_encoding.main(["--base-ref", base]), 0
                    )


if __name__ == "__main__":
    unittest.main()
