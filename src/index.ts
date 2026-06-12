import * as core from '@actions/core';
import { Inputs, BASE_URL } from './types';
import { uploadFile, uploadImage, updateResource, parseJsonInput } from './api';

async function run(): Promise<void> {
  try {
    // Get input parameters
    const inputs: Inputs = {
      apiToken: core.getInput('api_token', { required: true }),
      resourceId: core.getInput('resource_id', { required: true }),
      filePath: core.getInput('file_path', { required: false }),
      version: core.getInput('version', { required: false }),
      versionTitle: core.getInput('version_title', { required: false }),
      changelog: core.getInput('changelog', { required: false }),
      publishVersion: core.getBooleanInput('publish_version', { required: false }),
      mcVersions: parseJsonInput(core.getInput('mc_versions', { required: false })),
      tags: parseJsonInput(core.getInput('tags', { required: false })),
      officialTags: parseJsonInput(core.getInput('official_tags', { required: false })),
      coverImagePath: core.getInput('cover_image_path', { required: false }),
      tutorialPostIds: parseJsonInput(core.getInput('tutorial_post_ids', { required: false })),
      documentationPostRefs: parseJsonInput(core.getInput('documentation_post_refs', { required: false })),
      documentationUrl: core.getInput('documentation_url', { required: false }),
      dependencies: parseJsonInput(core.getInput('dependencies', { required: false })),
      isDraft: core.getBooleanInput('is_draft', { required: false })
    };

    // Validate required inputs
    if (!inputs.apiToken) {
      core.setFailed('api_token is required');
      return;
    }
    if (!inputs.resourceId) {
      core.setFailed('resource_id is required');
      return;
    }

    core.info('=== NexusMC Resource Update Action ===');
    core.info(`Resource ID: ${inputs.resourceId}`);

    // Prepare update data
    const updateData: Record<string, any> = {
      isDraft: inputs.isDraft
    };

    // Add version info if provided
    if (inputs.version) {
      updateData.version = inputs.version;
    }
    if (inputs.versionTitle) {
      updateData.versionTitle = inputs.versionTitle;
    }
    if (inputs.changelog) {
      updateData.changelog = inputs.changelog;
    }
    if (inputs.publishVersion !== undefined) {
      updateData.publishVersion = inputs.publishVersion;
    }
    if (inputs.mcVersions && inputs.mcVersions.length > 0) {
      updateData.mcVersions = inputs.mcVersions;
    }
    if (inputs.tags && inputs.tags.length > 0) {
      updateData.tags = inputs.tags;
    }
    if (inputs.officialTags && inputs.officialTags.length > 0) {
      updateData.officialTags = inputs.officialTags;
    }
    if (inputs.tutorialPostIds && inputs.tutorialPostIds.length > 0) {
      updateData.tutorialPostIds = inputs.tutorialPostIds;
    }
    if (inputs.documentationPostRefs && inputs.documentationPostRefs.length > 0) {
      updateData.documentationPostRefs = inputs.documentationPostRefs;
    }
    if (inputs.documentationUrl) {
      updateData.documentationUrl = inputs.documentationUrl;
    }
    if (inputs.dependencies && inputs.dependencies.length > 0) {
      updateData.dependencies = inputs.dependencies;
    }

    // Upload file if provided
    let fileUploaded = false;
    if (inputs.filePath) {
      try {
        const uploadResult = await uploadFile(inputs.apiToken, inputs.filePath);
        updateData.fileUrl = uploadResult.url;
        updateData.fileName = uploadResult.filename;
        updateData.fileSize = uploadResult.size;
        fileUploaded = true;
        core.info(`File uploaded: ${uploadResult.filename} (${uploadResult.size} bytes)`);
      } catch (error) {
        core.setFailed(`Failed to upload file: ${(error as Error).message}`);
        return;
      }
    }

    // Upload cover image if provided
    if (inputs.coverImagePath) {
      try {
        const imageResult = await uploadImage(inputs.apiToken, inputs.coverImagePath);
        updateData.coverImage = imageResult.url;
        core.info(`Cover image uploaded: ${imageResult.url}`);
      } catch (error) {
        core.setFailed(`Failed to upload cover image: ${(error as Error).message}`);
        return;
      }
    }

    // If no file and no version info, warn user
    if (!fileUploaded && !inputs.version) {
      core.warning('No file to upload and no version specified. The resource will not be updated.');
      return;
    }

    // Update resource
    try {
      const result = await updateResource(inputs.apiToken, inputs.resourceId, updateData);
      
      core.info('=== Update Successful ===');
      core.info(`Resource ID: ${result.id}`);
      core.info(`Status: ${result.status}`);
      if (result.version) {
        core.info(`Version: ${result.version}`);
      }

      // Set outputs
      core.setOutput('resource_id', result.id);
      core.setOutput('resource_url', `${BASE_URL}/resources/${result.id}`);
      core.setOutput('status', result.status);

    } catch (error) {
      core.setFailed(`Failed to update resource: ${(error as Error).message}`);
      return;
    }

  } catch (error) {
    core.setFailed(`Action failed: ${(error as Error).message}`);
  }
}

run();
