# Desktop Downloads Setup Guide

This guide explains how to set up the desktop app downloads feature that fetches releases from your private GitHub repository.

## Overview

The system consists of:
1. **API Endpoint** (`/api/download-desktop-app`) - Fetches releases from GitHub and proxies downloads
2. **Download Page** (`/download`) - Displays available downloads with platform-specific information

## Prerequisites

### 1. GitHub Personal Access Token

You need a GitHub Personal Access Token (PAT) with access to your private repository.

#### Creating a GitHub Token:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "PepakBasaJawa Downloads"
4. Set expiration (recommend: No expiration for production, or use fine-grained tokens with auto-renewal)
5. Select the following scopes:
   - `repo` (Full control of private repositories)
6. Click "Generate token"
7. **Copy the token immediately** (you won't be able to see it again)

#### Alternative: Fine-Grained Personal Access Token (Recommended)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Click "Generate new token"
3. Configure:
   - **Token name**: "PepakBasaJawa Downloads"
   - **Expiration**: Custom (1 year recommended)
   - **Repository access**: Only select repositories → `setoelkahfi/pepakbasajawa`
   - **Permissions**:
     - Repository permissions → Contents: Read-only
     - Repository permissions → Metadata: Read-only (automatically included)
4. Click "Generate token"
5. Copy the token

### 2. Environment Variables

Add the GitHub token to your environment variables:

**For local development (`.env`):**
```env
GITHUB_TOKEN=ghp_your_token_here
```

**For production (Vercel/Netlify/etc):**
Add the environment variable in your hosting platform's dashboard:
- Variable name: `GITHUB_TOKEN`
- Value: Your GitHub token

## How It Works

### 1. Fetching Releases

The API endpoint (`/api/download-desktop-app`) calls the GitHub API:

```
GET https://api.github.com/repos/setoelkahfi/pepakbasajawa/releases/latest
```

This requires authentication using the `GITHUB_TOKEN`.

### 2. Asset Detection

The system automatically detects platform and architecture based on filename patterns:

**macOS:**
- Filenames containing: `mac`, `darwin`, or ending with `.dmg`
- **Apple Silicon**: `arm64`, `aarch64`, `apple`
- **Intel**: `x64`, `intel`, `x86_64`
- **Universal**: No architecture specified

**Windows:**
- Filenames containing: `win` or ending with `.exe`, `.msi`
- **x64**: `x64`, `x86_64`
- **ARM64**: `arm64`

**Linux:**
- Filenames containing: `linux` or ending with `.appimage`, `.deb`, `.rpm`, `.tar.gz`
- **x64**: `x64`, `x86_64`
- **ARM64**: `arm64`, `aarch64`

### 3. Secure Downloads

Downloads are proxied through the API to keep your GitHub token secure:

```
User clicks download → /api/download-desktop-app?action=download&assetId=123
→ API authenticates with GitHub → GitHub provides temporary redirect URL
→ User downloads file
```

This approach (inspired by the [Practical Bazel blog post](https://www.stevenengelhardt.com/2023/05/23/practical-bazel-downloading-private-release-assets-from-github/)) ensures:
- GitHub token is never exposed to the client
- Downloads work without requiring users to authenticate
- Assets remain private on GitHub

## Release Naming Convention

For best results, use consistent naming for your release assets:

### Recommended Format:
```
pepakbasajawa-{version}-{platform}-{arch}.{ext}
```

### Examples:
- `pepakbasajawa-1.0.0-macos-arm64.dmg` (macOS Apple Silicon)
- `pepakbasajawa-1.0.0-macos-x64.dmg` (macOS Intel)
- `pepakbasajawa-1.0.0-windows-x64.exe` (Windows)
- `pepakbasajawa-1.0.0-linux-x64.AppImage` (Linux)
- `pepakbasajawa-1.0.0-linux-x64.deb` (Linux Debian)

## Testing

### Local Testing:

1. Set up environment variable:
   ```bash
   echo "GITHUB_TOKEN=your_token_here" >> .env
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Visit: `http://localhost:4321/download`

4. Test the API directly:
   ```bash
   curl http://localhost:4321/api/download-desktop-app
   ```

### Testing with GitHub:

1. Create a test release in your repository
2. Upload test assets with appropriate names
3. Verify they appear on the download page
4. Test downloading each asset

## Troubleshooting

### Error: "GITHUB_TOKEN is not configured"
- Ensure the environment variable is set correctly
- Restart your dev server after adding the token
- Check your hosting platform's environment variables in production

### Error: "Failed to fetch releases"
- Verify your GitHub token has the correct permissions
- Check if the token has expired
- Ensure the repository name is correct in the code

### Downloads not appearing:
- Check if release assets follow the naming conventions
- Verify the release is marked as "latest" on GitHub
- Check browser console for API errors

### Download links not working:
- Ensure the asset ID is being passed correctly
- Verify GitHub token has access to download assets
- Check API logs for authentication errors

## Security Best Practices

1. **Never commit tokens**: Add `.env` to `.gitignore`
2. **Use fine-grained tokens**: Limit scope to only what's needed
3. **Rotate tokens regularly**: Update tokens every 6-12 months
4. **Monitor token usage**: Check GitHub's token usage logs
5. **Use environment variables**: Never hardcode tokens

## Caching

The API response is cached for 5 minutes to reduce GitHub API calls:

```typescript
'Cache-Control': 'public, max-age=300'
```

Adjust this value in `/src/pages/api/download-desktop-app.ts` if needed.

## GitHub API Rate Limits

- **Authenticated requests**: 5,000 per hour
- **Unauthenticated requests**: 60 per hour

With caching enabled, this should be sufficient for most traffic levels.

## CI/CD Integration

### Automated Releases

You can automate releases using GitHub Actions:

```yaml
name: Release Desktop App

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Desktop Apps
        run: |
          # Your build commands here
          
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            dist/*.dmg
            dist/*.exe
            dist/*.AppImage
            dist/*.deb
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Support

For questions or issues:
- Email: info@pepakbasajawa.com
- Repository: https://github.com/setoelkahfi/pepakbasajawa

## License

This implementation is part of the PepakBasaJawa project.