---
name: navigation-flows
description: Multi-hop query patterns and visual navigation maps through the release graph
---

# Navigation Flows

## Stop Criteria

**STOP when you reach `─► DONE`.** Each flow shows terminal nodes. Do not fetch beyond them.

## Entry Points

| Entry | Use For |
|-------|---------|
| `llms.json` | Supported versions, shortcuts (default) |
| `index.json` | All versions including EOL |
| `timeline/index.json` | Date-based navigation |

## Flow 1: Supported Versions (1-2 fetches)

```
llms.json
    │
    └─► _embedded.latest_patches[] ─► DONE (version, EOL, support)
            │
            ├─► _links.release-manifest ─► manifest.json
            │       ├─► compatibility-json ─► breaking changes
            │       ├─► supported-os-json ─► distros
            │       └─► os-packages-json ─► packages
            │
            └─► _links.latest-security ─► last security patch
```

## Flow 2: CVE Queries (2-N fetches)

```
llms.json
    │
    └─► _links.latest-security-month ─► month/index.json ◄────┐
            │                                                 │
            ├─► _embedded.disclosures[] ─► DONE              │
            ├─► _links.cve-json ─► cve.json (CVSS, CWE)      │
            └─► _links.prev-security ─────────────────────────┘
```

## Flow 3: EOL Versions (3-5 fetches)

```
llms.json
    │
    └─► _links.releases-index ─► index.json
            │
            └─► _embedded.releases[] ─► find EOL version
                    │
                    └─► _links.self ─► 6.0/index.json ─► DONE
                            │
                            └─► _links.latest-security ─► last patch
```

## Flow 4: Specific Patch (2-3 fetches)

"What changed in 9.0.10?" or "What CVEs were fixed in 8.0.15?"

```
llms.json
    │
    └─► _embedded.latest_patches[] ─► _links.release-major
            │
            ▼
        9.0/index.json
            │
            └─► _embedded.patches[] ─► find version "9.0.10"
                    │
                    └─► _links.self ─► 9.0/9.0.10/index.json ─► DONE
                            │
                            └─► _embedded.disclosures[] (CVEs fixed)
```

## Key Link Relations

```
From llms.json:
  latest-security-month ──► timeline month (CVE details)
  releases-index ──────────► full version list (including EOL)

From latest_patches[]:
  release-major ───────────► X.0/index.json (patches, timeline)
  release-manifest ────────► manifest.json (reference data)
  latest-security ─────────► last security patch

From manifest.json:
  compatibility-json ──────► breaking changes
  target-frameworks-json ──► TFMs
  supported-os-json ───────► distros, glibc versions
  os-packages-json ────────► apt/dnf packages

From month index:
  prev-security ───────────► previous security month
  cve-json ────────────────► full CVE details
```

## Common Mistakes

| Mistake | Why It's Wrong |
|---------|----------------|
| Using `next` relation | Doesn't exist—navigate backward with `prev` |
| Using `latest_sts` | Doesn't exist—use `latest` |
| Fetching after `DONE` | Stop at terminal nodes |
| Skipping `_embedded` | Often has the answer |

## Fetch Count Summary

| Query Type | Fetches |
|------------|---------|
| Supported version data | 1 |
| Reference data (OS, breaking changes) | 2 |
| Specific patch details | 2-3 |
| EOL version info | 3-5 |
| CVE history | 1 + N months |
