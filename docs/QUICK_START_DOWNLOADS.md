# Quick Start: Desktop Downloads Feature

Get the desktop downloads feature running in 5 minutes.

## 1. Get Your GitHub Token

```bash
# Go to: https://github.com/settings/tokens
# Click "Generate new token (classic)"
# Select scope: "repo" (for private repos)
# Copy the token
```

## 2. Add Token to Environment

```bash
# Create .env file in project root
echo "GITHUB_TOKEN=ghp_your_actual_token_here" > .env
```

## 3. Test Locally

```bash
# Install dependencies (if needed)
npm install

# Start dev server
npm run dev

# Visit in browser
open http://localhost:4321/download
```

## 4. Deploy to Production

### Vercel
```bash
# Add environment variable
vercel env add GITHUB_TOKEN
# Paste your token when prompted

# Deploy
vercel --prod
```

### Netlify
```bash
# Add environment variable in Netlify dashboard:
# Site settings → Environment variables → Add variable
# Key: GITHUB_TOKEN
# Value: your_token

# Deploy
netlify deploy --prod
```

### Other Platforms
Add `GITHUB_TOKEN` environment variable in your platform's dashboard.

## 5. Upload Release to GitHub

Your release assets should follow this naming pattern:

```
✅ pepakbasajawa-1.0.0-macos-arm64.dmg
✅ pepakbasajawa-1.0.0-macos-x64.dmg
✅ pepakbasajawa-1.0.0-windows-x64.exe
✅ pepakbasajawa-1.0.0-linux-x64.AppImage
```

Steps:
1. Go to: https://github.com/setoelkahfi/pepakbasajawa/releases
2. Click "Draft a new release"
3. Create a tag (e.g., `v1.0.0`)
4. Upload your built app files
5. Click "Publish release"

## How It Works

```
┌─────────────┐
│   Browser   │
│  (User)     │
└─────┬───────┘
      │ 1. Visit /download
      ▼
┌─────────────────┐
│  Download Page  │
│  (Astro)        │
└─────┬───────────┘
      │ 2. Fetch releases
      ▼
┌──────────────────────┐
│  API Endpoint        │
│  /api/download-...   │
└─────┬────────────────┘
      │ 3. Authenticate with GitHub
      ▼
┌──────────────────┐
│  GitHub API      │
│  (Private Repo)  │
└─────┬────────────┘
      │ 4. Return releases
      ▼
┌─────────────┐
│   Browser   │
│  (Shows     │
│   links)    │
└─────────────┘
```

When user clicks download:
```
User → API (with asset ID) → GitHub → Temporary URL → User downloads
```

## Troubleshooting

**Problem**: "GITHUB_TOKEN is not configured"
```bash
# Solution: Check your .env file exists and contains the token
cat .env | grep GITHUB_TOKEN

# Restart dev server
npm run dev
```

**Problem**: "Failed to fetch releases"
```bash
# Solution 1: Verify token permissions
# Go to: https://github.com/settings/tokens
# Make sure token has "repo" scope

# Solution 2: Check token hasn't expired
# Generate a new token if needed

# Solution 3: Verify repository name in code
# Check: src/pages/api/download-desktop-app.ts
# Line with: const GITHUB_REPO = 'setoelkahfi/pepakbasajawa'
```

**Problem**: No downloads showing
```bash
# Solution: Check release exists and has assets
# Visit: https://github.com/setoelkahfi/pepakbasajawa/releases

# Make sure:
# 1. At least one release is marked as "latest"
# 2. Release has uploaded asset files
# 3. Asset filenames match patterns (mac/win/linux)
```

## API Endpoints

### Get Releases
```bash
curl http://localhost:4321/api/download-desktop-app
```

Response:
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
      "version": "v1.0.0"
    }
  ]
}
```

### Download Asset
```bash
curl -L "http://localhost:4321/api/download-desktop-app?action=download&assetId=12345" \
  -o app.dmg
```

## Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] GitHub token is not committed to repository
- [ ] Token has minimum required permissions (repo scope only)
- [ ] Production environment variable is set
- [ ] Token is rotated periodically (every 6-12 months)

## Need More Help?

See detailed documentation: [DESKTOP_DOWNLOADS_SETUP.md](./DESKTOP_DOWNLOADS_SETUP.md)

Email: info@pepakbasajawa.com