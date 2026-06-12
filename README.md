# Upload to NexusMC

A GitHub Action to upload files to NexusMC and update resources.

> LLM Generated

## Usage

```yaml
- uses: mcio-dev/upload-to-nexusmc@v1
  with:
    api_token: ${{ secrets.NEXUSMC_API_TOKEN }}
    resource_id: ${{ secrets.NEXUSMC_RESOURCE_ID }}
    file_path: dist/my-plugin.jar
    version: 1.2.0
```

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| `api_token` | Yes | NexusMC Personal API Token |
| `resource_id` | Yes | NexusMC Resource ID |
| `file_path` | No | Path to the file to upload |
| `version` | No | Resource version number |
| `version_title` | No | Version title |
| `changelog` | No | Changelog for the new version |
| `publish_version` | No | Whether to publish as a new version (default: true) |
| `mc_versions` | No | Supported Minecraft versions (JSON array, e.g. '["1.20.1"]') |
| `tags` | No | Custom tags (JSON array) |
| `official_tags` | No | Official tags (JSON array) |
| `cover_image_path` | No | Path to cover image file |
| `tutorial_post_ids` | No | Tutorial post IDs (JSON array) |
| `documentation_post_refs` | No | Documentation post references (JSON array) |
| `documentation_url` | No | External documentation URL |
| `dependencies` | No | Dependencies (JSON array) |
| `is_draft` | No | Save as draft (default: false) |

## Outputs

| Output | Description |
|--------|-------------|
| `resource_id` | The updated resource ID |
| `resource_url` | URL to the resource |
| `status` | Resource status |

## Getting Your API Token

1. Go to [NexusMC](https://www.nexusmc.cn)
2. Navigate to Settings → API Tokens
3. Create a new token with the following scopes:
   - `upload:file` - Upload files
   - `resource:update:self` - Update your resources

## Examples

### Basic Usage

```yaml
- uses: mcio-dev/upload-to-nexusmc@v1
  with:
    api_token: ${{ secrets.NEXUSMC_API_TOKEN }}
    resource_id: ${{ secrets.NEXUSMC_RESOURCE_ID }}
    file_path: dist/my-plugin.jar
    version: 1.2.0
```

### With Full Options

```yaml
- uses: mcio-dev/upload-to-nexusmc@v1
  with:
    api_token: ${{ secrets.NEXUSMC_API_TOKEN }}
    resource_id: ${{ secrets.NEXUSMC_RESOURCE_ID }}
    file_path: dist/my-plugin.jar
    cover_image_path: dist/cover.png
    version: 1.2.0
    version_title: "Support Minecraft 1.21"
    changelog: |
      - Fixed bug #123
      - Improved performance
    mc_versions: '["1.20.1", "1.21"]'
    tags: '["auto-sync", "feature"]'
    documentation_url: https://docs.example.com
    is_draft: false
```

### Update Version Only (No File Upload)

```yaml
- uses: mcio-dev/upload-to-nexusmc@v1
  with:
    api_token: ${{ secrets.NEXUSMC_API_TOKEN }}
    resource_id: ${{ secrets.NEXUSMC_RESOURCE_ID }}
    version: 1.2.0
    changelog: "Updated changelog"
```

## License

MIT
