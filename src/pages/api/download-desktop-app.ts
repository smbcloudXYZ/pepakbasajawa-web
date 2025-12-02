import type { APIRoute } from 'astro'
import type {
  GitHubAsset,
  GitHubRelease,
  DownloadLink,
  DownloadsResponse,
  PlatformType,
  ArchitectureType
} from '@/types/github-releases'

export const prerender = false

export const GET: APIRoute = async ({ url }) => {
  try {
    const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN
    const GITHUB_REPO = 'setoelkahfi/pepakbasajawa'

    if (!GITHUB_TOKEN) {
      console.error('GITHUB_TOKEN is not configured')
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const action = url.searchParams.get('action')
    const assetId = url.searchParams.get('assetId')

    // If requesting a specific asset download
    if (action === 'download' && assetId) {
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/releases/assets/${assetId}`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: 'application/octet-stream',
            'X-GitHub-Api-Version': '2022-11-28'
          },
          redirect: 'manual'
        }
      )

      if (response.status === 302 || response.status === 301) {
        const redirectUrl = response.headers.get('location')
        if (redirectUrl) {
          return Response.redirect(redirectUrl, 302)
        }
      }

      return new Response(JSON.stringify({ error: 'Failed to get download URL' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Fetch latest release
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('GitHub API error:', errorData)
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch releases',
          details: errorData
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const release: GitHubRelease = await response.json()
    const downloads: DownloadLink[] = []

    // Parse assets and categorize by platform
    for (const asset of release.assets) {
      const filename = asset.name.toLowerCase()
      let platform: PlatformType | null = null
      let architecture: ArchitectureType | undefined = undefined

      // macOS
      if (filename.includes('mac') || filename.includes('darwin') || filename.endsWith('.dmg')) {
        platform = 'macOS'
        if (
          filename.includes('arm64') ||
          filename.includes('aarch64') ||
          filename.includes('apple')
        ) {
          architecture = 'Apple Silicon'
        } else if (
          filename.includes('x64') ||
          filename.includes('intel') ||
          filename.includes('x86_64')
        ) {
          architecture = 'Intel'
        } else {
          architecture = 'Universal'
        }
      }
      // Windows
      else if (filename.includes('win') || filename.endsWith('.exe') || filename.endsWith('.msi')) {
        platform = 'Windows'
        if (filename.includes('x64') || filename.includes('x86_64')) {
          architecture = 'x64'
        } else if (filename.includes('arm64')) {
          architecture = 'ARM64'
        } else {
          architecture = 'x64'
        }
      }
      // Linux
      else if (
        filename.includes('linux') ||
        filename.endsWith('.appimage') ||
        filename.endsWith('.deb') ||
        filename.endsWith('.rpm') ||
        filename.endsWith('.tar.gz')
      ) {
        platform = 'Linux'
        if (filename.includes('arm64') || filename.includes('aarch64')) {
          architecture = 'ARM64'
        } else if (filename.includes('x64') || filename.includes('x86_64')) {
          architecture = 'x64'
        } else {
          architecture = 'x64'
        }
      }

      if (platform) {
        downloads.push({
          platform,
          architecture,
          url: `/api/download-desktop-app?action=download&assetId=${asset.id}`,
          filename: asset.name,
          size: asset.size,
          version: release.tag_name,
          assetId: asset.id
        })
      }
    }

    const responseData: DownloadsResponse = {
      version: release.tag_name,
      name: release.name,
      published_at: release.published_at,
      downloads
    }

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    })
  } catch (error) {
    console.error('Error fetching releases:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
