# Navigation Flows

*Core Rules from SKILL.md apply: follow `_links` for navigation, use `_embedded` first.*

Visual map of navigation patterns through the .NET release graph. Use this when planning multi-hop queries.

## Entry Points

```
llms.json (AI-optimized)          index.json (all versions)       timeline/index.json (by date)
     │                                  │                                │
     └─► latest_patches[]               ├─► _embedded.releases[]         ├─► _embedded.years[]
         (supported versions)           │   (all versions incl EOL)      │   └─► _embedded.months[]
                                        │                                │
                                        └─► _links.timeline-index        └─► _links.prev-security
                                                                             (walk security history)
```

## Flow 1: Supported Version Queries (1-2 fetches)

```
llms.json
    │
    └─► _embedded.latest_patches[] ─────────────────────────► DONE (patch version, EOL date, support status)
            │
            ├─► _links.release-major ─► X.0/index.json ─► DONE (navigation: patches, SDKs)
            │
            ├─► _links.release-manifest ─► manifest.json ─► DONE (reference data)
            │       ├─► compatibility-json ─► breaking changes
            │       ├─► target-frameworks-json ─► TFMs
            │       ├─► supported-os-json ─► distros, glibc
            │       └─► os-packages-json ─► apt/dnf packages
            │
            └─► _links.latest-sdk ─► sdk/index.json ─► DONE (feature bands, downloads)
```

## Flow 2: CVE Queries (2-N fetches)

```
llms.json
    │
    └─► _links.latest-security-month ─► month/index.json ◄────┐
            │                                                 │
            ├─► _embedded.disclosures[] ─► DONE (severity)    │
            │                                                 │
            ├─► _links.cve-json ─► cve.json (CVSS, CWE)       │
            │                                                 │
            └─► _links.prev-security ─────────────────────────┘ (walk history)
```

## Flow 3: EOL Version Queries (3-5 fetches)

```
llms.json
    │
    └─► _links.releases-index
            │
            ▼
        index.json
            │
            └─► _embedded.releases[] ─► find EOL version (e.g., 6.0)
                    │
                    └─► _links.self
                            │
                            ▼
                        6.0/index.json ─► eol_date, latest patch
                            │
                            └─► _links.latest-security
                                    │
                                    ▼
                                6.0.35/index.json ─► _embedded.disclosures[] ─► DONE
```

## Flow 4: Reference Data Queries (2 fetches)

```
llms.json
    │
    └─► _embedded.latest_patches[] ─► _links.release-manifest
            │
            ▼
        manifest.json (all reference data in one place)
            │
            ├─► _links.compatibility-json ─► DONE (breaking changes)
            ├─► _links.target-frameworks-json ─► DONE (TFMs)
            ├─► _links.supported-os-json ─► DONE (distros, glibc versions)
            └─► _links.os-packages-json ─► DONE (apt/dnf packages per distro)
```

## Key Link Relations

```
From llms.json:
  latest-security-month ──► timeline month (CVE details)
  releases-index ──────────► full version list (including EOL)

From latest_patches[]:
  release-major ───────────► X.0/index.json (navigation: patches, timeline)
  release-manifest ────────► manifest.json (reference data)
  latest-sdk ──────────────► sdk/index.json (SDK bands)
  latest-security ─────────► last security patch

From manifest.json:
  compatibility-json ──────► breaking changes
  target-frameworks-json ──► TFMs
  supported-os-json ───────► distros, glibc versions
  os-packages-json ────────► apt/dnf packages

From month index:
  prev-security ───────────► previous security month (auto-skips non-security)
  cve-json ────────────────► full CVE details

From version index:
  release-manifest ────────► manifest.json (same as from latest_patches[])
```

## Non-Existent Relations (Common LLM Mistakes)

These relations do **not exist** — do not attempt to use them:

| Relation | Why It Doesn't Exist |
|----------|---------------------|
| `next` | The graph is designed for backward navigation from the present. Use `latest`, `latest-lts`, or `latest-security-month` to start at the most recent asset, then walk backwards with `prev` or `prev-security`. This is more efficient since most queries care about recent data. |
| `latest_sts` | Not useful — we always have an LTS release in support, but not always an STS. If STS is acceptable, use `latest` which returns the newest release regardless of type. |

## Fetch Count Summary

| Pattern | Fetches | Notes |
|---------|---------|-------|
| Embedded data | 1 | patch versions, support status, CVE counts |
| Reference data | 2 | breaking changes, TFMs, OS support (via manifest.json) |
| SDK info | 2 | feature bands, downloads |
| EOL version info | 3-5 | must traverse releases-index |
| CVE history | 1+N | N = security months to traverse |
