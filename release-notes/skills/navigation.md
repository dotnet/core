# Navigation Flows

Visual map of navigation patterns through the .NET release graph. Use this when planning multi-hop queries.

## Entry Points

```
llms.json (AI-optimized)          index.json (all versions)       timeline/index.json (by date)
     │                                  │                                │
     ├─► latest_patches[]               ├─► _embedded.releases[]         ├─► _embedded.years[]
     │   (supported versions)           │   (all versions incl EOL)      │   └─► _embedded.months[]
     │                                  │                                │
     └─► latest_security_month[]        └─► _links.timeline-index        └─► _links.prev-security
         (current CVE summary)                                               (walk security history)
```

## Flow 1: Supported Version Queries (1-2 fetches)

```
llms.json
    │
    └─► _embedded.latest_patches[] ─────────────────────────► DONE (patch version, EOL date, support status)
            │
            ├─► _links.release-major ─► X.0/index.json ─► compatibility-json ─► DONE (breaking changes)
            │                                          └─► target-frameworks-json ─► DONE (TFMs)
            │
            └─► _links.latest-sdk ─► sdk/index.json ─► DONE (feature bands, downloads)
```

## Flow 2: CVE Queries (1-N fetches)

```
llms.json
    │
    ├─► _embedded.latest_security_month[] ─► DONE (CVE IDs and counts only)
    │
    └─► _links.latest-security-month
            │
            ▼
        month/index.json ◄──────────────────┐
            │                               │
            ├─► _embedded.disclosures[] ────│─► DONE (severity, titles, fixes)
            │                               │
            ├─► _links.cve-json ───────────►│   cve.json ─► DONE (CVSS vectors, CWE, packages)
            │                               │
            └─► _links.prev-security ───────┘   (repeat for history)
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

## Flow 4: Linux/OS Queries (3 fetches)

```
llms.json
    │
    └─► _embedded.latest_patches[] ─► _links.release-major
            │
            ▼
        X.0/index.json
            │
            └─► _links.release-manifest
                    │
                    ▼
                manifest.json
                    │
                    ├─► _links.supported-os-json ─► DONE (distros, glibc versions)
                    │
                    └─► _links.os-packages-json ─► DONE (apt/dnf packages per distro)
```

## Key Link Relations

```
From llms.json:
  latest-security-month ──► timeline month (CVE details)
  releases-index ──────────► full version list (including EOL)

From latest_patches[]:
  release-major ───────────► X.0/index.json (version resources)
  latest-sdk ──────────────► sdk/index.json (SDK bands)
  latest-security ─────────► last security patch

From month index:
  prev-security ───────────► previous security month (auto-skips non-security)
  cve-json ────────────────► full CVE details

From version index:
  release-manifest ────────► manifest.json (OS support, packages)
  compatibility-json ──────► breaking changes
  target-frameworks-json ──► TFMs
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
| Version resources | 2 | breaking changes, TFMs, SDK bands |
| OS/Linux queries | 3 | requires manifest hop |
| EOL version info | 3-5 | must traverse releases-index |
| CVE history | 1+N | N = security months to traverse |
