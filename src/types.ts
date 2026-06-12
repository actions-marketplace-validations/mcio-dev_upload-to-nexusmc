export interface Inputs {
  apiToken: string;
  resourceId: string;
  filePath: string;
  version?: string;
  versionTitle?: string;
  changelog?: string;
  publishVersion: boolean;
  mcVersions?: string[];
  tags?: string[];
  officialTags?: string[];
  coverImagePath?: string;
  tutorialPostIds?: string[];
  documentationPostRefs?: string | any[];
  documentationUrl?: string;
  dependencies?: string[];
  isDraft: boolean;
}

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  sha256?: string;
  sha1?: string;
}

export interface UploadImageResponse {
  url: string;
  thumbnailUrl?: string;
  originalSize: number;
  optimizedSize?: number;
}

export interface ResourceResponse {
  id: string;
  title: string;
  status: string;
  platform?: string;
  category?: string;
  version?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface ErrorResponse {
  error: string;
  code?: string;
  requiredScope?: string;
  [key: string]: any;
}

export const BASE_URL = 'https://www.nexusmc.cn/api';
