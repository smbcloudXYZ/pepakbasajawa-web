/**
 * GitHub Release API Types
 * Based on GitHub REST API v3
 * https://docs.github.com/en/rest/releases/releases
 */

export interface GitHubUser {
  login: string
  id: number
  node_id: string
  avatar_url: string
  url: string
  html_url: string
  type: string
}

export interface GitHubAsset {
  id: number
  node_id: string
  name: string
  label: string | null
  uploader: GitHubUser
  content_type: string
  state: string
  size: number
  download_count: number
  created_at: string
  updated_at: string
  browser_download_url: string
  url: string
}

export interface GitHubRelease {
  id: number
  node_id: string
  tag_name: string
  target_commitish: string
  name: string
  draft: boolean
  prerelease: boolean
  created_at: string
  published_at: string
  assets: GitHubAsset[]
  tarball_url: string
  zipball_url: string
  body: string
  author: GitHubUser
  url: string
  html_url: string
  assets_url: string
  upload_url: string
}

/**
 * Application-specific types
 */

export type PlatformType = 'macOS' | 'Windows' | 'Linux'

export type ArchitectureType =
  | 'Apple Silicon'
  | 'Intel'
  | 'Universal'
  | 'x64'
  | 'ARM64'
  | 'x86'

export interface DownloadLink {
  platform: PlatformType
  architecture?: ArchitectureType
  url: string
  filename: string
  size: number
  version: string
  assetId?: number
}

export interface DownloadsResponse {
  version: string
  name: string
  published_at: string
  downloads: DownloadLink[]
}

export interface DownloadError {
  error: string
  details?: string
  message?: string
}

/**
 * Platform detection patterns
 */
export const PLATFORM_PATTERNS = {
  macOS: {
    keywords: ['mac', 'darwin'],
    extensions: ['.dmg', '.pkg'],
    architectures: {
      'Apple Silicon': ['arm64', 'aarch64', 'apple'],
      'Intel': ['x64', 'intel', 'x86_64'],
      'Universal': ['universal']
    }
  },
  Windows: {
    keywords: ['win', 'windows'],
    extensions: ['.exe', '.msi', '.msix'],
    architectures: {
      'x64': ['x64', 'x86_64', 'amd64'],
      'ARM64': ['arm64', 'aarch64'],
      'x86': ['x86', 'ia32', 'i386']
    }
  },
  Linux: {
    keywords: ['linux'],
    extensions: ['.appimage', '.deb', '.rpm', '.tar.gz', '.snap'],
    architectures: {
      'x64': ['x64', 'x86_64', 'amd64'],
      'ARM64': ['arm64', 'aarch64'],
      'x86': ['x86', 'i386']
    }
  }
} as const

/**
 * Helper type guards
 */
export function isDownloadsResponse(data: unknown): data is DownloadsResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'version' in data &&
    'downloads' in data &&
    Array.isArray((data as DownloadsResponse).downloads)
  )
}

export function isDownloadError(data: unknown): data is DownloadError {
  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data
  )
}
