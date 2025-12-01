# Get CVEs affecting a specific product (requires cve.json for full detail)
# Usage: jq --arg product "dotnet-runtime" -f get_cve_by_product.jq release-notes/timeline/2025/01/cve.json
# Note: Product-CVE mapping is indexed in cve.json for fast lookup
.product_cves[$product] // empty
