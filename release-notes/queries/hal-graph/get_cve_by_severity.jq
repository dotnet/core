# Get CVEs by severity level (requires cve.json for severity index)
# Usage: jq --arg severity "HIGH" -f get_cve_by_severity.jq release-notes/timeline/2025/01/cve.json
# Note: Severity-CVE mapping is pre-indexed in cve.json for fast lookup
.severity_cves[$severity] // empty
