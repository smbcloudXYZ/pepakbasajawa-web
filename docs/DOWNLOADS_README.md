# Desktop Downloads Feature - README

Complete guide for the desktop application downloads system that fetches releases from private GitHub repositories.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Features](#features)
- [Architecture](#architecture)
- [Setup](#setup)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Overview

This system provides secure download links for desktop applications stored in a private GitHub repository. It automatically detects platform and architecture from release assets and presents them in a user-friendly interface.

### Key Features

- 🔒 **Secure**: GitHub tokens never exposed to clients
- 🚀 **Fast**: 5-minute response caching
- 📱 **Responsive**: Mobile-friendly design
- 🎯 **Smart Detection**: Automatic platform/architecture detection
- 🔧 **Type-Safe**: Full TypeScript support
- 📊 **Testable**: Built-in test utilities

### Supported Platforms

- **macOS**: Apple Silicon (M1/M2/M3), Intel, Universal
- **Windows**: x64, ARM64, x86
- **Linux**: x64, ARM64 (AppImage, DEB, RPM, Snap)

## Quick Start

### 1. Create GitHub Token

```bash
# Visit: https://github.com/settings/tokens
# Create token with 'repo' scope
# Copy the token
```

### 2. Configure Environment

```bash
# Create .env file
echo "GITHUB_TOKEN=ghp_your_token_here" > .env
```

### 3. Test Connection

```bash
# Verify GitHub API access
npm run test:releases
```

### 4. Start Development

```bash
# Start dev server
npm run dev

# Visit download page
open http://localhost:4321/download
```

## Features

### API Endpoint

**Location**: `/src/pages/api/download-desktop-app.ts`

- Fetches latest release from GitHub
- Authenticates with Personal Access Token
- Detects platforms and architectures
- Proxies downloads securely
- Caches responses (5 minutes)
- Full TypeScript types

### Download Page

**Location**: `/src/pages/download.astro`

- Displays mobile app store links
- Shows desktop download options
- Real-time release fetching
- Platform-specific icons
- File size formatting
- Responsive design

### Type System

**Location**: `/src/types/github-releases.ts`

- GitHub API response types
- Application-specific interfaces
- Platform detection patterns
- Type guards
- Full IntelliSense support

## Architecture

```
┌─────────────┐
│   Browser   │
│   (User)    │
└──────┬──────┘
       │ GET /download
       ▼
┌─────────────────┐
│  Download Page  │ ← Astro SSG/SSR
└──────┬──────────┘
       │ Fetch /api/download-desktop-app
       ▼
┌──────────────────────┐
│   API Endpoint       │ ← Astro API Route
│  - Authenticate      │
│  - Parse assets      │
│  - Detect platforms  │
└──────┬───────────────┘
       │ Bearer Token Auth
       ▼
┌──────────────────┐
│   GitHub API     │
│  Private Repo    │
│  /releases       │
└──────────────────┘
```

### Data Flow

1. **User visits** `/download` page
2. **JavaScript fetches** `/api/download-desktop-app`
3. **API authenticates** with GitHub using token
4. **GitHub returns** latest release data
5. **API parses** assets and detects platforms
6. **API returns** structured download links
7. **Page displays** download buttons
8. **User clicks** download
9. **API proxies** download with GitHub auth
10. **User receives** file

## Setup

### Prerequisites

- Node.js 18+ or compatible
- GitHub account with repository access
- Astro project (this is an Astro plugin/feature)

### Installation

Files are already created. Just configure:

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env and add your GitHub token
nano .env
# Add: GITHUB_TOKEN=ghp_your_actual_token

# 3. Install dependencies (if needed)
npm install

# 4. Test setup
npm run test:releases
```

### GitHub Token Setup

#### Option 1: Classic Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "PepakBasaJawa Downloads"
4. Scopes: Select `repo` (Full control of private repositories)
5. Expiration: Choose duration
6. Generate and copy token

#### Option 2: Fine-Grained Token (Recommended)

1. Go to https://github.com/settings/tokens?type=beta
2. Click "Generate new token"
3. Name: "PepakBasaJawa Downloads"
4. Repository access: Select `setoelkahfi/pepakbasajawa`
5. Permissions:
   - Contents: Read-only
   - Metadata: Read-only (auto-selected)
6. Expiration: 1 year recommended
7. Generate and copy token

### Environment Variables

**Development (.env)**:
```env
GITHUB_TOKEN=ghp_your_token_here
```

**Production**:
Add to your hosting platform's environment variables dashboard.

## Usage

### Creating Releases

1. **Build your desktop apps** (macOS, Windows, Linux)

2. **Name files consistently**:
   ```
   pepakbasajawa-1.0.0-macos-arm64.dmg
   pepakbasajawa-1.0.0-macos-x64.dmg
   pepakbasajawa-1.0.0-windows-x64.exe
   pepakbasajawa-1.0.0-linux-x64.AppImage
   ```

3. **Create GitHub release**:
   ```bash
   # Via GitHub web interface
   # Or via gh CLI:
   gh release create v1.0.0 \
     dist/*.dmg \
     dist/*.exe \
     dist/*.AppImage \
     --title "Release 1.0.0" \
     --notes "Release notes here"
   ```

### File Naming Convention

Format: `{app}-{version}-{platform}-{arch}.{ext}`

**Examples**:
- ✅ `pepakbasajawa-1.0.0-macos-arm64.dmg`
- ✅ `pepakbasajawa-1.0.0-macos-x64.dmg`
- ✅ `pepakbasajawa-1.0.0-windows-x64.exe`
- ✅ `pepakbasajawa-1.0.0-windows-x64.msi`
- ✅ `pepakbasajawa-1.0.0-linux-x64.AppImage`
- ✅ `pepakbasajawa-1.0.0-linux-x64.deb`
- ❌ `app.dmg` (too generic)
- ❌ `release-v1.exe` (no platform info)

## Configuration

### Adjust Cache Duration

Edit `/src/pages/api/download-desktop-app.ts`:

```typescript
return new Response(JSON.stringify(responseData), {
  status: 200,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300' // ← Change 300 to desired seconds
  }
})
```

### Change Repository

Edit `/src/pages/api/download-desktop-app.ts`:

```typescript
const GITHUB_REPO = 'setoelkahfi/pepakbasajawa' // ← Change to your repo
```

### Customize Platform Detection

Edit `/src/types/github-releases.ts`:

```typescript
export const PLATFORM_PATTERNS = {
  macOS: {
    keywords: ['mac', 'darwin'], // ← Add more keywords
    extensions: ['.dmg', '.pkg'],
    // ...
  }
}
```

## API Reference

### GET /api/download-desktop-app

Fetches available desktop downloads.

**Response**:
```json
{
  "version": "v1.0.0",
  "name": "Release 1.0.0",
  "published_at": "2024-01-15T10:00:00Z",
  "downloads": [
    {
      "platform": "macOS",
      "architecture": "Apple Silicon",
      "url": "/api/download-desktop-app?action=download&assetId=12345",
      "filename": "pepakbasajawa-1.0.0-macos-arm64.dmg",
      "size": 125829120,
      "version": "v1.0.0",
      "assetId": 12345
    }
  ]
}
```

### GET /api/download-desktop-app?action=download&assetId={id}

Downloads a specific asset.

**Parameters**:
- `action`: Must be "download"
- `assetId`: GitHub asset ID from releases response

**Response**: HTTP 302 redirect to temporary download URL

## Testing

### Test GitHub Connection

```bash
npm run test:releases
```

**Expected Output**:
```
🔍 Testing GitHub API Connection

✓ GitHub token found (ghp_abcd12...)
✓ Repository: setoelkahfi/pepakbasajawa
✓ Authenticated as: setoelkahfi
✓ Found release: Release 1.0.0

📋 Release Assets:
────────────────────────────────────
🍎 pepakbasajawa-1.0.0-macos-arm64.dmg
   Platform: macOS (Apple Silicon)
   Size: 120.00 MB
   ...

✅ All tests passed!
```

### Manual API Testing

```bash
# Test releases endpoint
curl http://localhost:4321/api/download-desktop-app | jq

# Test download (replace asset ID)
curl -L "http://localhost:4321/api/download-desktop-app?action=download&assetId=12345" \
  -o test-download.dmg
```

### Integration Testing

```bash
# Start dev server
npm run dev

# In another terminal, test endpoints
curl http://localhost:4321/api/download-desktop-app

# Test in browser
open http://localhost:4321/download
```

## Deployment

### Vercel

```bash
# Set environment variable
vercel env add GITHUB_TOKEN
# Paste your token when prompted

# Deploy
vercel --prod
```

Or via Vercel dashboard:
1. Project Settings → Environment Variables
2. Add `GITHUB_TOKEN` with your token
3. Redeploy

### Netlify

```bash
# Via CLI
netlify env:set GITHUB_TOKEN your_token_here

# Deploy
netlify deploy --prod
```

Or via Netlify dashboard:
1. Site settings → Environment variables
2. Add variable: `GITHUB_TOKEN`
3. Redeploy site

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build

ENV GITHUB_TOKEN=${GITHUB_TOKEN}

EXPOSE 4321
CMD ["npm", "run", "preview"]
```

Build and run:
```bash
docker build -t pepakbasajawa-web .
docker run -e GITHUB_TOKEN=your_token -p 4321:4321 pepakbasajawa-web
```

## Troubleshooting

### Common Issues

#### 1. "GITHUB_TOKEN is not configured"

**Symptoms**: API returns 500 error
**Solutions**:
- Check `.env` file exists and contains token
- Verify token is not empty or commented out
- Restart dev server after adding token
- In production, check environment variables in hosting dashboard

```bash
# Verify token is loaded
cat .env | grep GITHUB_TOKEN

# Restart server
npm run dev
```

#### 2. "Failed to fetch releases"

**Symptoms**: API returns error or 404
**Solutions**:
- Verify token has correct permissions (`repo` scope)
- Check token hasn't expired
- Confirm repository name is correct
- Ensure at least one release exists

```bash
# Test token manually
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/repos/setoelkahfi/pepakbasajawa/releases/latest
```

#### 3. No downloads showing on page

**Symptoms**: Page loads but no desktop downloads appear
**Solutions**:
- Check browser console for errors
- Verify release is marked as "latest" (not draft)
- Ensure release has uploaded assets
- Run `npm run test:releases` to debug

#### 4. Downloads not detected correctly

**Symptoms**: Files show as "Unknown" platform
**Solutions**:
- Check filename follows naming convention
- Add platform keywords to filename
- Verify file extension is standard (.dmg, .exe, .AppImage)
- Update detection patterns if needed

#### 5. Rate limit exceeded

**Symptoms**: API returns 403 after many requests
**Solutions**:
- Authenticated limit is 5,000/hour (should be plenty)
- Check cache is working (5-minute default)
- Monitor rate limit: `curl https://api.github.com/rate_limit`
- Consider increasing cache duration

## Best Practices

### Security

1. **Never commit tokens**
   - Add `.env` to `.gitignore`
   - Use environment variables
   - Rotate tokens regularly

2. **Use fine-grained tokens**
   - Limit scope to specific repository
   - Read-only permissions
   - Set expiration dates

3. **Monitor token usage**
   - Check GitHub token logs
   - Watch for suspicious activity
   - Revoke compromised tokens immediately

### Release Management

1. **Consistent naming**
   - Use version tags (v1.0.0)
   - Follow semantic versioning
   - Include platform in filename

2. **Complete releases**
   - Build all platforms
   - Test on each platform
   - Include changelogs

3. **Automation**
   - Use GitHub Actions for releases
   - Automate builds
   - Run tests before publishing

### Performance

1. **Caching**
   - Keep 5-minute cache for balance
   - Increase for stable releases
   - Decrease for active development

2. **Asset optimization**
   - Compress installers when possible
   - Use appropriate formats
   - Consider delta updates

3. **CDN**
   - Consider CDN for large files
   - GitHub provides good distribution
   - Monitor download speeds

## Support

### Documentation

- **Setup Guide**: `DESKTOP_DOWNLOADS_SETUP.md`
- **Quick Start**: `QUICK_START_DOWNLOADS.md`
- **Implementation Details**: `IMPLEMENTATION_SUMMARY.md`

### Contact

- **Email**: info@pepakbasajawa.com
- **Repository**: https://github.com/setoelkahfi/pepakbasajawa
- **Web**: https://github.com/setoelkahfi/pepakbasajawa-web

### Resources

- [GitHub Releases API](https://docs.github.com/en/rest/releases)
- [Astro API Routes](https://docs.astro.build/en/core-concepts/endpoints/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## License

This feature is part of the PepakBasaJawa project.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: ✅ Production Ready