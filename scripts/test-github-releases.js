#!/usr/bin/env node

/**
 * Test script to verify GitHub API connection and releases
 *
 * Usage:
 *   GITHUB_TOKEN=your_token node scripts/test-github-releases.js
 *
 * Or with .env file:
 *   node scripts/test-github-releases.js
 *
 * Environment variables required:
 *   GITHUB_TOKEN - Your GitHub personal access token
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Try to load environment variables from .env file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = resolve(__dirname, '..', '.env')

try {
  const envContent = readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^\s*([^#][^=]+?)\s*=\s*(.+?)\s*$/)
    if (match) {
      const key = match[1]
      const value = match[2].replace(/^['"]|['"]$/g, '')
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
} catch (err) {
  // .env file doesn't exist, that's okay
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO = 'setoelkahfi/pepakbasajawa'

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

async function testGitHubConnection() {
  log('\n🔍 Testing GitHub API Connection\n', 'bright')

  // Check if token exists
  if (!GITHUB_TOKEN) {
    log('❌ ERROR: GITHUB_TOKEN environment variable is not set', 'red')
    log('\nPlease create a .env file with:', 'yellow')
    log('GITHUB_TOKEN=ghp_your_token_here\n', 'cyan')
    log('Or run with:', 'yellow')
    log('GITHUB_TOKEN=your_token node scripts/test-github-releases.js\n', 'cyan')
    process.exit(1)
  }

  log(`✓ GitHub token found (${GITHUB_TOKEN.substring(0, 10)}...)`, 'green')
  log(`✓ Repository: ${GITHUB_REPO}`, 'green')

  try {
    // Test API connection with user endpoint
    log('\n📡 Testing GitHub API authentication...', 'blue')
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    if (!userResponse.ok) {
      throw new Error(
        `GitHub API authentication failed: ${userResponse.status} ${userResponse.statusText}`
      )
    }

    const user = await userResponse.json()
    log(`✓ Authenticated as: ${user.login}`, 'green')

    // Fetch releases
    log('\n📦 Fetching latest release...', 'blue')
    const releaseResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )

    if (releaseResponse.status === 404) {
      log('⚠️  No releases found in repository', 'yellow')
      log('\nTo create a release:', 'yellow')
      log(`1. Go to: https://github.com/${GITHUB_REPO}/releases`, 'cyan')
      log('2. Click "Draft a new release"', 'cyan')
      log('3. Create a tag (e.g., v1.0.0)', 'cyan')
      log('4. Upload your app files', 'cyan')
      log('5. Click "Publish release"\n', 'cyan')
      process.exit(0)
    }

    if (!releaseResponse.ok) {
      throw new Error(
        `Failed to fetch releases: ${releaseResponse.status} ${releaseResponse.statusText}`
      )
    }

    const release = await releaseResponse.json()
    log(`✓ Found release: ${release.name || release.tag_name}`, 'green')
    log(`  Version: ${release.tag_name}`, 'cyan')
    log(`  Published: ${new Date(release.published_at).toLocaleString()}`, 'cyan')
    log(`  Assets: ${release.assets.length}`, 'cyan')

    if (release.assets.length === 0) {
      log('\n⚠️  Release has no assets', 'yellow')
      log('Upload app files to the release on GitHub\n', 'yellow')
      process.exit(0)
    }

    // Analyze assets
    log('\n📋 Release Assets:', 'bright')
    log('─'.repeat(80), 'cyan')

    const platformStats = {
      macOS: [],
      Windows: [],
      Linux: [],
      Unknown: []
    }

    for (const asset of release.assets) {
      const filename = asset.name.toLowerCase()
      let platform = 'Unknown'
      let architecture = ''

      // Detect platform
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
      } else if (
        filename.includes('win') ||
        filename.endsWith('.exe') ||
        filename.endsWith('.msi')
      ) {
        platform = 'Windows'
        if (filename.includes('x64') || filename.includes('x86_64')) {
          architecture = 'x64'
        } else if (filename.includes('arm64')) {
          architecture = 'ARM64'
        } else {
          architecture = 'x64'
        }
      } else if (
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

      platformStats[platform].push({
        name: asset.name,
        size: asset.size,
        architecture,
        downloads: asset.download_count
      })

      const icon =
        platform === 'macOS'
          ? '🍎'
          : platform === 'Windows'
            ? '🪟'
            : platform === 'Linux'
              ? '🐧'
              : '❓'
      log(`${icon} ${asset.name}`, 'bright')
      log(`   Platform: ${platform}${architecture ? ` (${architecture})` : ''}`, 'cyan')
      log(`   Size: ${formatBytes(asset.size)}`, 'cyan')
      log(`   Downloads: ${asset.download_count}`, 'cyan')
      log(`   ID: ${asset.id}`, 'cyan')
      log('')
    }

    // Summary
    log('─'.repeat(80), 'cyan')
    log('\n📊 Summary:', 'bright')
    log(
      `   macOS: ${platformStats.macOS.length} asset(s)`,
      platformStats.macOS.length > 0 ? 'green' : 'yellow'
    )
    log(
      `   Windows: ${platformStats.Windows.length} asset(s)`,
      platformStats.Windows.length > 0 ? 'green' : 'yellow'
    )
    log(
      `   Linux: ${platformStats.Linux.length} asset(s)`,
      platformStats.Linux.length > 0 ? 'green' : 'yellow'
    )

    if (platformStats.Unknown.length > 0) {
      log(`   Unknown: ${platformStats.Unknown.length} asset(s)`, 'yellow')
      log('\n⚠️  Some assets could not be categorized:', 'yellow')
      platformStats.Unknown.forEach((asset) => {
        log(`   - ${asset.name}`, 'yellow')
      })
      log('\nConsider renaming to match patterns:', 'yellow')
      log('   - macOS: *-macos-arm64.dmg or *-macos-x64.dmg', 'cyan')
      log('   - Windows: *-windows-x64.exe', 'cyan')
      log('   - Linux: *-linux-x64.AppImage', 'cyan')
    }

    // Test asset download
    log('\n🔗 Testing asset download URL...', 'blue')
    const firstAsset = release.assets[0]
    const assetResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/assets/${firstAsset.id}`,
      {
        method: 'HEAD',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/octet-stream',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )

    if (assetResponse.ok) {
      log('✓ Asset download URLs are accessible', 'green')
    } else {
      log('⚠️  Asset download test returned status: ' + assetResponse.status, 'yellow')
    }

    // Success message
    log('\n✅ All tests passed!', 'green')
    log('\nYour download page should work correctly.', 'bright')
    log('Start your dev server with: npm run dev', 'cyan')
    log('Then visit: http://localhost:4321/download\n', 'cyan')
  } catch (error) {
    log('\n❌ ERROR:', 'red')
    log(error.message, 'red')
    log('\nTroubleshooting:', 'yellow')
    log('1. Verify your GitHub token has "repo" scope', 'cyan')
    log('2. Check that the repository name is correct', 'cyan')
    log("3. Ensure the token hasn't expired", 'cyan')
    log('4. Try generating a new token at: https://github.com/settings/tokens\n', 'cyan')
    process.exit(1)
  }
}

// Run the test
testGitHubConnection()
