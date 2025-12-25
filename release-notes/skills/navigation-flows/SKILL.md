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
    └─► _embedded.patches["X.0"] ─► DONE (version, EOL, support)
            │
            ├─► _links.manifest ─► manifest.json
            │       ├─► compatibility ─► breaking changes
            │       ├─► supported-os ─► distros
            │       └─► os-packages ─► packages
            │
            └─► _links.latest-security-patch ─► last security patch
```

## Flow 2: CVE/Security Queries (2-N fetches)

**Use `latest-security-disclosures`** — available at both top-level and patch-level.

```
llms.json
    │
    ├─► _links.latest-security-disclosures ─► month/index.json ◄──┐
    │                                                              │
    └─► _embedded.patches["8.0"]._links.latest-security-disclosures│
                    │                                              │
                    ├─► _embedded.disclosures[] ─► DONE           │
                    ├─► _links.cve-json ─► cve.json               │
                    └─► _links.prev-security ──────────────────────┘
```

## Flow 3: EOL Versions (3-5 fetches)

```
llms.json
    │
    └─► _links.root ─► index.json
            │
            └─► _embedded.releases[] ─► find EOL version
                    │
                    └─► _links.self ─► 6.0/index.json ─► DONE
                            │
                            └─► _links.latest-security-patch ─► last patch
```

## Flow 4: Specific Patch (2-3 fetches)

"What changed in 9.0.10?" or "What CVEs were fixed in 8.0.15?"

```
llms.json
    │
    └─► _embedded.patches["9.0"] ─► _links.major
            │
            ▼
        9.0/index.json
            │
            └─► _embedded.patches["9.0.10"] ─► find version
                    │
                    └─► _links.self ─► 9.0/9.0.10/index.json ─► DONE
                            │
                            └─► _embedded.disclosures[] (CVEs fixed)
```

## Key Link Relations

```
From llms.json._links:
  latest-security-disclosures ─► timeline month (CVE disclosures)
  root ────────────────────────► full version list (including EOL)

From patches["X.0"]._links:
  major ───────────────────────► X.0/index.json (patches, timeline)
  manifest ────────────────────► manifest.json (reference data)
  latest-security-disclosures ─► security month for this version

From manifest.json:
  compatibility ───────────► breaking changes
  target-frameworks ───────► TFMs
  supported-os ────────────► distros, glibc versions
  os-packages ─────────────► apt/dnf packages

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
