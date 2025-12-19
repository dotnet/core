# Metrics

Query cost comparison tests from [release-graph-eval](https://github.com/dotnet/release-graph-eval).

See [overview.md](../overview.md) for design context, file characteristics, and cache coherency analysis.

## Contents

| Document | Description |
|----------|-------------|
| [Index Discovery](index-discovery.md) | HAL discovery patterns - exploring `_links` and `_embedded` |
| [Easy Questions (Q1)](easy-questions.md) | Version queries answerable from embedded data (0 fetches) |
| [CVE Stress Tests (Q2)](cve-stress-test.md) | Timeline navigation, severity filtering, code fixes (2-15 fetches) |
| [Upgrade to What's New (Q3)](upgrade-whats-new.md) | Breaking changes and migration guidance (2-5 fetches) |
| [Interacting with Environment (Q4)](interacting-with-environment.md) | Shell output parsing, libc checks, Docker setup (2-6 fetches) |
| [Project File Analysis (Q5)](project-file-analysis.md) | TFM support, package CVEs, target platforms (1-8 fetches) |
