# Upload to NexusMC

A GitHub Action to upload files to NexusMC and update resources.

> LLM Generated

## Best Practices

Go to `https://github.com/${user}/${repository}/settings/secrets/actions` and setup environments below:
+ Set secret `NEXUSMC_API_TOKEN` to your API token
  - You can get it [here](https://www.nexusmc.cn/settings?tab=api).
+ Set variable `NEXUSMC_RESOURCE_ID` to your resource id
  - You can get resource id in url when you edit it.
  - e.g. `9a4949f8-6d42-45bb-8480-0bab00c9732e`

Then add the workflow file below into `.github/workflows/release.yml` (or whatever filename you want). It will be triggered after you published a release.

```yaml
name: Build and upload Release

on:
  release:
    types: [ published ]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Validate Gradle wrapper
        uses: gradle/actions/wrapper-validation@v4
      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v4

      - name: Setup Java 25
        uses: actions/setup-java@v3
        with:
          distribution: temurin
          java-version: 25

        # Example for build Gradle project
      - name: Build plugin
        run: ./gradlew build -Pversion="${{ github.event.release.tag_name }}"

        # Optional: Upload file to release, requires 'contents: write' permission above
      - name: Upload to Release
        uses: softprops/action-gh-release@v3
        continue-on-error: true
        with:
          # The single file you want to upload
          files: build/libs/PluginName-${{ github.event.release.tag_name }}.jar
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

        # Important: Actual step to upload file for update resource
      - uses: mcio-dev/upload-to-nexusmc@v1
        with:
          api_token: ${{ secrets.NEXUSMC_API_TOKEN }}
          resource_id: ${{ vars.NEXUSMC_RESOURCE_ID }}
          # The single file you want to upload
          file_path: build/libs/PluginName-${{ github.event.release.tag_name }}.jar
          version: ${{ github.event.release.tag_name }}
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
    resource_id: ${{ vars.NEXUSMC_RESOURCE_ID }}
    file_path: dist/my-plugin.jar
    version: 1.2.0
```

### With Full Options

```yaml
- uses: mcio-dev/upload-to-nexusmc@v1
  with:
    api_token: ${{ secrets.NEXUSMC_API_TOKEN }}
    resource_id: ${{ vars.NEXUSMC_RESOURCE_ID }}
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
    resource_id: ${{ vars.NEXUSMC_RESOURCE_ID }}
    version: 1.2.0
    changelog: "Updated changelog"
```

## License

MIT
