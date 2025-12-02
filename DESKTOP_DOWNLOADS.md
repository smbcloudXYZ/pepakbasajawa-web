# Desktop Downloads Feature

> **Complete documentation has been moved to the `/docs` directory.**

## 📚 Quick Links

- **[Get Started (5 min)](./docs/QUICK_START_DOWNLOADS.md)** - Fast setup guide
- **[Master Overview](./docs/DESKTOP_DOWNLOADS_FEATURE.md)** - Complete feature overview
- **[Full Documentation](./docs/README.md)** - All documentation index

## 🚀 Quick Start

```bash
# 1. Create GitHub token at https://github.com/settings/tokens
# 2. Add to .env
echo "GITHUB_TOKEN=ghp_your_token_here" > .env

# 3. Test connection
npm run test:releases

# 4. Start dev server
npm run dev

# 5. Visit http://localhost:4321/download
```

## 📖 Documentation

All documentation is located in the [`/docs`](./docs) directory:

| Document | Description | Time |
|----------|-------------|------|
| [README.md](./docs/README.md) | Documentation index & navigation | 2 min |
| [DESKTOP_DOWNLOADS_FEATURE.md](./docs/DESKTOP_DOWNLOADS_FEATURE.md) | Master overview - **START HERE** | 10 min |
| [QUICK_START_DOWNLOADS.md](./docs/QUICK_START_DOWNLOADS.md) | Fast setup guide | 5 min |
| [DESKTOP_DOWNLOADS_SETUP.md](./docs/DESKTOP_DOWNLOADS_SETUP.md) | Complete setup instructions | 15 min |
| [DOWNLOADS_README.md](./docs/DOWNLOADS_README.md) | Full API reference | 30 min |
| [IMPLEMENTATION_SUMMARY.md](./docs/IMPLEMENTATION_SUMMARY.md) | Technical architecture | 20 min |
| [DEPLOYMENT_CHECKLIST.md](./docs/DEPLOYMENT_CHECKLIST.md) | Deployment guide | 15 min |
| [SECURITY_AUDIT.md](./docs/SECURITY_AUDIT.md) | Security audit results | 10 min |
| [SECURITY_GUIDE.md](./docs/SECURITY_GUIDE.md) | Security best practices | 15 min |

## 🎯 What This Feature Does

Provides secure download links for desktop applications stored in a private GitHub repository:

- 🍎 **macOS** - Apple Silicon, Intel, Universal
- 🪟 **Windows** - x64, ARM64
- 🐧 **Linux** - x64, ARM64 (AppImage, DEB, RPM)

## 🔒 Security

This repository is **PUBLIC**. Never commit:
- ❌ `.env` files
- ❌ GitHub tokens
- ❌ API keys
- ❌ Any credentials

See [SECURITY_GUIDE.md](./docs/SECURITY_GUIDE.md) for complete security practices.

## 📁 Key Files

```
src/pages/api/download-desktop-app.ts    # API endpoint
src/pages/download.astro                 # Download page
src/types/github-releases.ts             # TypeScript types
scripts/test-github-releases.js          # Test script
.env.example                             # Environment template
```

## 🆘 Need Help?

1. **Start here**: [docs/DESKTOP_DOWNLOADS_FEATURE.md](./docs/DESKTOP_DOWNLOADS_FEATURE.md)
2. **Quick setup**: [docs/QUICK_START_DOWNLOADS.md](./docs/QUICK_START_DOWNLOADS.md)
3. **Full docs**: [docs/README.md](./docs/README.md)
4. **Email**: info@pepakbasajawa.com

---

**Version**: 1.0.0 | **Status**: ✅ Production Ready | **Docs**: [/docs](./docs)