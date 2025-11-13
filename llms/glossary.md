# Glossary

Terminology and field definitions for .NET release metadata HAL+JSON documents.

**Quick definitions** (also available in `index.json` → `usage.glossary`):
- **LTS**: Long-Term Support – 3-year support window
- **STS**: Standard-Term Support – 18-month support window  
- **EOL**: End of Life – No longer supported
- **Preview**: Pre-release phase with previews and release candidates
- **Active**: Full support with regular updates and security fixes

## Support Lifecycle

### Release Types
- **`lts`**: Long-Term Support - 3+ year lifecycle
- **`sts`**: Standard-Term Support - 18 month lifecycle

### Support Phases  
- **`preview`**: Pre-release, not production-ready
- **`active`**: Fully supported with regular updates
- **`maintenance`**: Critical fixes only
- **`eol`**: End of life, no longer supported

## Common Fields

### Lifecycle Object
- **`release-type`**: Either `lts` or `sts`
- **`phase`**: Current support phase (preview, active, maintenance, eol)
- **`release-date`**: ISO 8601 timestamp of general availability
- **`eol-date`**: ISO 8601 timestamp when support ends
- **`supported`**: Boolean indicating current support status

### Other Fields
- **`version`**: Major.minor (e.g., `8.0`, `9.0`)
- **`kind`**: Document type (e.g., `index`, `release`)

## HAL Links (`_links`)

- **`self`**: Current document
- **`index`**: Root index
- **`latest`**: Most recent release (any support type)
- **`latest-lts`**: Most recent LTS release
- **`releases`**: Releases list for version
- **`release`**: Specific release document
- **`download`**: Download page or link
- **`supported-os`**: OS support information
- **`cve-json`**: Security vulnerability data
- **`sdk`**: SDK download links

### Link Properties
- **`href`**: URL (always follow this, never construct)
- **`type`**: Media type (`application/json`, `text/markdown`)

## Embedded Data (`_embedded`)

- **`releases`**: Array of versions with navigation links
- **`years`**: Historical years (in archive indexes)
- **`months`**: Months within year (in year indexes)

## Version Patterns

- **Major.minor**: `8.0`, `9.0`
- **Patch**: `8.0.1`, `9.0.0`
- **SDK feature band**: `8.0.4xx`, `9.0.1xx`
- **Preview**: `9.0.0-preview.1`
